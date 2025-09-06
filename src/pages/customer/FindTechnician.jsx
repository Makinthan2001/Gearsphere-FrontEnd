import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Modal,
} from "react-bootstrap";
import { Star, StarFill, GeoAlt } from "react-bootstrap-icons";
import axios from "axios";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import LoadingScreen from "../../components/loading/LoadingScreen";

function FindTechnician() {
  const location = useLocation();
  const navigate = useNavigate();
  const order_id = location.state?.order_id;
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [showTechnicianModal, setShowTechnicianModal] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState(null);
  const [instructions, setInstructions] = useState("");
  const [showAssignmentSuccess, setShowAssignmentSuccess] = useState(false);
  const [assigning, setAssigning] = useState(false);

  // Fetch technicians from backend
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    axios
      .get(
        "http://localhost/gearsphere_api/GearSphere-BackEnd/getAllTechnicians.php?action=getAll",
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        setTechnicians(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load technicians");
        setLoading(false);
      });
  }, []);

  const updateOrderWithAssignment = async (assignment_id) => {
    if (!order_id || !assignment_id) return;

    try {
      await axios.post(
        "http://localhost/gearsphere_api/GearSphere-BackEnd/updateOrderAssignment.php",
        {
          order_id,
          assignment_id,
        },
        { withCredentials: true }
      );
      // You can add a success message here if you want
    } catch (error) {
      toast.error("Failed to link technician to the order.");
    }
  };

  // Sri Lankan districts
  const districts = [
    "Ampara",
    "Anuradhapura",
    "Badulla",
    "Batticaloa",
    "Colombo",
    "Galle",
    "Gampaha",
    "Hambantota",
    "Jaffna",
    "Kalutara",
    "Kandy",
    "Kegalle",
    "Kilinochchi",
    "Kurunegala",
    "Mannar",
    "Matale",
    "Matara",
    "Monaragala",
    "Mullaitivu",
    "Nuwara Eliya",
    "Polonnaruwa",
    "Puttalam",
    "Ratnapura",
    "Trincomalee",
    "Vavuniya",
  ];

  // Static list of specializations
  const specializations = [
    "Gaming PCs",
    "Workstations",
    "Custom Water Cooling",
    "Small Form Factor",
    "General PC Building",
  ];

  // Filter technicians based on selected district, specialization, and approval status
  const filteredTechnicians = technicians.filter((tech) => {
    // Only show approved technicians
    const isApproved = tech.approve_status === "approved";

    // Improved district matching - extract district from address
    const matchesDistrict = !selectedDistrict || (() => {
      if (!tech.address) return false;
      
      // Split address by comma and check if the last part (district) matches
      const addressParts = tech.address.split(', ');
      if (addressParts.length >= 2) {
        const district = addressParts[addressParts.length - 1].trim();
        return district === selectedDistrict;
      }
      
      // Fallback: check if address contains the district
      return tech.address.includes(selectedDistrict);
    })();
    
    // Improved specialization matching
    const matchesSpecialization = !selectedService || (() => {
      if (!tech.specialization) return false;
      
      // Handle array of specializations
      if (Array.isArray(tech.specialization)) {
        return tech.specialization.some(spec => {
          if (typeof spec === 'string') {
            // Case-insensitive comparison and trimming
            return spec.trim().toLowerCase() === selectedService.trim().toLowerCase();
          }
          return false;
        });
      }
      
      // Handle single specialization string
      if (typeof tech.specialization === 'string') {
        return tech.specialization.trim().toLowerCase() === selectedService.trim().toLowerCase();
      }
      
      return false;
    })();

    return isApproved && matchesDistrict && matchesSpecialization;
  });

  const handleAssignTechnician = async () => {
    if (!navigator.onLine) {
      toast.error("You are offline. Cannot assign technician.");
      return;
    }
    if (!selectedTechnician) return;

    try {
      // Get user session from backend
      const sessionResponse = await axios.get(
        "http://localhost/gearsphere_api/GearSphere-BackEnd/getSession.php",
        { withCredentials: true }
      );

      if (!sessionResponse.data.success) {
        setError("Session expired. Please log in again.");
        return;
      }

      const customer_id = sessionResponse.data.user_id;
      setAssigning(true);
      const res = await axios.post(
        "http://localhost/gearsphere_api/GearSphere-BackEnd/assignTechnician.php",
        {
          customer_id: customer_id,
          technician_id:
            selectedTechnician.technician_id ||
            selectedTechnician.id ||
            selectedTechnician.user_id,
          instructions: instructions,
        },
        { withCredentials: true }
      );
      if (res.data && res.data.success) {
        toast.success("Technician Assigned Successfully");
        setShowTechnicianModal(false);
        setShowAssignmentSuccess(true);
        setInstructions("");

        if (order_id && res.data.assignment_id) {
          await updateOrderWithAssignment(res.data.assignment_id);
        }
      } else {
        setError(res.data.message || "Failed to assign technician.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to assign technician."
      );
    } finally {
      setAssigning(false);
    }
  };

  const renderStars = (rating) => {
    return Array(5)
      .fill(0)
      .map((_, i) =>
        i < Math.floor(rating) ? (
          <StarFill key={i} className="text-warning" />
        ) : (
          <Star key={i} className="text-warning" />
        )
      );
  };

  // Show loading screen while data is being fetched
  if (loading) {
    return (
      <LoadingScreen
        message="Finding Technicians"
        subMessage="Searching for available PC specialists"
      />
    );
  }
  if (error) return <div>{error}</div>;

  const cardStyle = {
    background: "linear-gradient(135deg, #f8fafc 60%, #e0e7ff 100%)",
    borderRadius: 18,
    boxShadow: "0 4px 24px rgba(80, 80, 160, 0.10)",
    border: "none",
    transition: "transform 0.3s cubic-bezier(.4,2,.3,1), box-shadow 0.3s",
    position: "relative",
    overflow: "hidden",
    minHeight: 370,
    animation: "fadeUp 0.7s cubic-bezier(.4,2,.3,1) both",
  };
  const cardHoverStyle = {
    transform: "translateY(-8px) scale(1.03)",
    boxShadow: "0 8px 32px 0 rgba(80, 80, 160, 0.18)",
  };
  const imageBorderStyle = {
    borderBottom: "4px solid #6366f1",
    paddingBottom: 4,
    background: "#fff",
  };
  const assignBtnStyle = {
    background: "linear-gradient(90deg, #10b981 0%, #059669 100%)",
    border: "none",
    color: "#fff",
    fontWeight: 600,
    boxShadow: "0 2px 8px rgba(16,185,129,0.18)",
    transition: "background 0.2s, box-shadow 0.2s, transform 0.2s",
  };
  const assignBtnHoverStyle = {
    background: "linear-gradient(90deg, #059669 0%, #10b981 100%)",
    boxShadow: "0 4px 16px rgba(16,185,129,0.28)",
    transform: "scale(1.05)",
  };

  return (
    <Container className="py-5">
      <h1 className="mb-4">Find a Technician</h1>

      {/* Filters */}
      <Row className="mb-4">
        <Col md={12}>
          <Card>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>District</Form.Label>
                    <Form.Select
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                    >
                      <option value="">All Districts</option>
                      {districts.map((district) => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Service Type</Form.Label>
                    <Form.Select
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value)}
                    >
                      <option value="">Select Service Type</option>
                      {specializations.map((spec) => (
                        <option key={spec} value={spec}>
                          {spec}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Technician List */}
      <Row>
        {filteredTechnicians.length === 0 ? (
          <Col xs={12}>
            <Card className="text-center py-5">
              <Card.Body>
                <div className="mb-3">
                  <i
                    className="bi bi-person-x"
                    style={{ fontSize: "3rem", color: "#6c757d" }}
                  ></i>
                </div>
                <h4 className="text-muted mb-3">
                  No Approved Technicians Available
                </h4>
                <p className="text-muted">
                  {selectedDistrict || selectedService
                    ? "No approved technicians match your current filters. Try adjusting your search criteria."
                    : "There are currently no approved technicians available. Please check back later."}
                </p>
                {(selectedDistrict || selectedService) && (
                  <Button
                    variant="outline-primary"
                    onClick={() => {
                      setSelectedDistrict("");
                      setSelectedService("");
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </Card.Body>
            </Card>
          </Col>
        ) : (
          filteredTechnicians.map((tech) => (
            <Col
              key={tech.technician_id || tech.id || tech.user_id}
              lg={4}
              md={4}
              sm={6}
              xs={12}
              className="mb-4"
            >
              <div
                style={cardStyle}
                className="h-100 technician-card-anim"
                onMouseEnter={(e) => {
                  Object.assign(e.currentTarget.style, cardHoverStyle);
                }}
                onMouseLeave={(e) => {
                  Object.assign(e.currentTarget.style, cardStyle);
                }}
              >
                <Card.Body className="p-3">
                  <div className="d-flex flex-column align-items-center text-center h-100">
                    <div style={imageBorderStyle} className="mb-2">
                      <img
                        src={
                          tech.profile_image
                            ? `http://localhost/gearsphere_api/GearSphere-BackEnd/profile_images/${tech.profile_image}`
                            : "/profile_images/user_image.jpg"
                        }
                        alt={tech.name}
                        className="rounded-2 border border-2 "
                        width="100"
                        height="100"
                        style={{ objectFit: "cover", background: "#fff" }}
                      />
                    </div>
                    <h5 className="mb-1 fw-bold">{tech.name}</h5>
                    <div className="mb-2">
                      <span
                        className={`badge ${
                          tech.status === "available"
                            ? "bg-success"
                            : "bg-secondary"
                        }`}
                        style={{ fontSize: "0.9em", borderRadius: 8 }}
                      >
                        {tech.status === "available"
                          ? "Available"
                          : "Unavailable"}
                      </span>
                    </div>
                    <div className="mb-2">
                      {Array.isArray(tech.specialization) ? (
                        tech.specialization.map((service, index) => (
                          <span
                            key={service + "_" + index}
                            className="badge bg-primary bg-opacity-75 me-1 mb-1"
                            style={{ fontSize: "0.85em", borderRadius: 8 }}
                          >
                            {service}
                          </span>
                        ))
                      ) : tech.specialization ? (
                        <span
                          className="badge bg-primary bg-opacity-75 me-1 mb-1"
                          style={{ fontSize: "0.85em", borderRadius: 8 }}
                        >
                          {tech.specialization}
                        </span>
                      ) : (
                        <span className="text-muted">No specialization</span>
                      )}
                    </div>
                    <div className="text-muted small mb-1">
                      <GeoAlt className="me-1" size={14} /> {tech.address}
                    </div>
                    <div className="d-flex flex-column flex-sm-row flex-wrap gap-1 gap-sm-2 mb-1 justify-content-center align-items-center">
                      <span className="text-muted small">
                        <strong>Phone:</strong>{" "}
                        {tech.contact_number || (
                          <span className="text-muted">N/A</span>
                        )}
                      </span>
                      <span className="text-muted small">
                        <strong>Charge:</strong>{" "}
                        {tech.charge_per_day !== undefined ? (
                          <span>
                            Rs. {Number(tech.charge_per_day).toLocaleString()} /
                            day
                          </span>
                        ) : (
                          <span className="text-muted">N/A</span>
                        )}
                      </span>
                      <span className="text-muted small">
                        <strong>Experience:</strong> {tech.experience} year
                        {tech.experience === 1 ? "" : "s"}
                      </span>
                    </div>
                    <button
                      style={
                        tech.status === "available"
                          ? assignBtnStyle
                          : {
                              ...assignBtnStyle,
                              background:
                                "linear-gradient(90deg, #9ca3af 0%, #6b7280 100%)",
                              cursor: "not-allowed",
                              opacity: 0.6,
                            }
                      }
                      className="btn btn-sm mt-2"
                      disabled={tech.status !== "available"}
                      onMouseEnter={(e) => {
                        if (tech.status === "available") {
                          Object.assign(
                            e.currentTarget.style,
                            assignBtnHoverStyle
                          );
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (tech.status === "available") {
                          Object.assign(e.currentTarget.style, assignBtnStyle);
                        }
                      }}
                      onClick={() => {
                        if (tech.status !== "available") {
                          toast.error("Technician is unavailable");
                          return;
                        }
                        setSelectedTechnician(tech);
                        setShowTechnicianModal(true);
                      }}
                    >
                      {tech.status === "available" ? "Assign" : "Unavailable"}
                    </button>
                  </div>
                </Card.Body>
              </div>
            </Col>
          ))
        )}
      </Row>

      {/* Technician Details Modal */}
      {showTechnicianModal && selectedTechnician && (
        <Modal
          show={showTechnicianModal}
          onHide={() => setShowTechnicianModal(false)}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              Assign Technician - {selectedTechnician.name}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col md={4}>
                <div className="text-center mb-3">
                  <img
                    src={
                      selectedTechnician.profile_image
                        ? `http://localhost/gearsphere_api/GearSphere-BackEnd/profile_images/${selectedTechnician.profile_image}`
                        : "/profile_images/user_image.jpg"
                    }
                    alt={selectedTechnician.name}
                    className="rounded-circle mb-3"
                    width="120"
                    height="120"
                  />
                  <h4>{selectedTechnician.name}</h4>
                  <p className="text-muted mb-2">
                    <GeoAlt className="me-1" /> {selectedTechnician.address}{" "}
                  </p>
                  <div className="mb-2">
                    <strong>Phone:</strong>{" "}
                    {selectedTechnician.contact_number || (
                      <span className="text-muted">N/A</span>
                    )}
                  </div>
                  <div className="mb-2">
                    <strong>Charge per day:</strong>{" "}
                    {selectedTechnician.charge_per_day !== undefined ? (
                      <span>
                        Rs.{" "}
                        {Number(
                          selectedTechnician.charge_per_day
                        ).toLocaleString()}{" "}
                        / day
                      </span>
                    ) : (
                      <span className="text-muted">N/A</span>
                    )}
                  </div>
                  <div className="mb-2">
                    <strong>Specialization:</strong>{" "}
                    {Array.isArray(selectedTechnician.specialization) ? (
                      selectedTechnician.specialization.map(
                        (service, index) => (
                          <span
                            key={service + "_" + index}
                            className="badge bg-primary me-1 mb-1"
                          >
                            {service}
                          </span>
                        )
                      )
                    ) : selectedTechnician.specialization ? (
                      <span className="badge bg-primary me-1 mb-1">
                        {selectedTechnician.specialization}
                      </span>
                    ) : (
                      <span className="text-muted">No specialization</span>
                    )}
                  </div>
                  {/* <div className="d-flex justify-content-center align-items-center mb-2">
                    {renderStars(selectedTechnician.rating)}
                    <span className="ms-2">
                      {selectedTechnician.rating} ({selectedTechnician.reviews}{" "}
                      reviews)
                    </span>
                  </div> */}
                  <div className="mb-3">
                    <small className="text-muted">
                      {selectedTechnician.experience} year
                      {selectedTechnician.experience === 1 ? "" : "s"}{" "}
                      experience
                    </small>
                  </div>
                </div>
              </Col>
              <Col md={8}>
                <h5>Technician Details</h5>
                <p className="mb-3">{selectedTechnician.description}</p>

                <div className="mb-3">
                  <strong>Services Offered:</strong>
                  <div className="mt-2">
                    {Array.isArray(selectedTechnician.specialization) ? (
                      selectedTechnician.specialization.map(
                        (service, index) => (
                          <span
                            key={service + "_" + index}
                            className="badge bg-primary me-1 mb-1"
                          >
                            {service}
                          </span>
                        )
                      )
                    ) : selectedTechnician.specialization ? (
                      <span className="badge bg-primary me-1 mb-1">
                        {selectedTechnician.specialization}
                      </span>
                    ) : (
                      <span className="text-muted">No specialization</span>
                    )}
                  </div>
                </div>

                <hr />

                <h5>Assignment Instructions</h5>
                <p className="text-muted small mb-3">
                  Provide specific instructions for the technician about your PC
                  build requirements.
                </p>

                <Form.Group className="mb-3">
                  <Form.Label>Special Instructions</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Enter any specific instructions, preferences, or requirements for your PC build..."
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                  />
                  <Form.Text className="text-muted">
                    Examples: "Please ensure good cable management", "Prefer
                    quiet cooling solutions", "Need RGB lighting setup"
                  </Form.Text>
                </Form.Group>

                <div className="alert alert-info">
                  <strong>Note:</strong> The technician will contact you within
                  24 hours to discuss your requirements and schedule the build.
                </div>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowTechnicianModal(false)}
              disabled={assigning}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleAssignTechnician}
              disabled={assigning}
            >
              {assigning ? "Processing..." : "Assign Technician"}
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* Assignment Success Modal */}
      <Modal
        show={showAssignmentSuccess}
        onHide={() => setShowAssignmentSuccess(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-success">
            <i className="bi bi-check-circle-fill me-2"></i>
            Technician Assigned Successfully!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <div className="mb-4">
            <div className="text-success" style={{ fontSize: "3rem" }}>
              ✅
            </div>
          </div>
          <h4 className="text-success mb-3">Assignment Confirmed</h4>
          <p className="mb-3">
            <strong>{selectedTechnician?.name}</strong> has been assigned to
            your PC build project.
          </p>
          <div className="alert alert-info">
            <strong>Next Steps:</strong>
            <ul className="mb-0 mt-2 text-start">
              <li>The technician will contact you within 24 hours</li>
              <li>You'll discuss your PC build requirements</li>
              <li>Schedule will be arranged for the build</li>
              <li>
                Payment for technician services will be handled separately
              </li>
            </ul>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => {
              setShowAssignmentSuccess(false);
              if (order_id) {
                navigate("/orders"); // Navigate to orders page if coming from PC Builder
              }
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Container>
  );
}

export default FindTechnician;
