import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  InputGroup,
  Accordion,
  Alert,
  Nav,
  Badge,
  Table,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import "../../styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Select from 'react-select';

import {
  Calendar,
  CurrencyDollar,
  Star,
  Tools,
  People,
  Clock,
  Envelope,
  Telephone,
  GeoAlt,
} from "react-bootstrap-icons";
import logo from "../../images/logo.PNG";
import pcpic2 from "../../images/pcpic2.jpeg";
import { toast } from "react-toastify";
import axios from "axios";
import LoadingScreen from "../../components/loading/LoadingScreen";

function TechnicianDashboard() {
  const [stats, setStats] = useState({
    pendingAppointments: 0,
    completedAppointments: 0,
    totalEarnings: 0,
    averageRating: 0,
    activeServices: 0,
    totalCustomers: 0,
  });

  const [buildStats, setBuildStats] = useState({
    total_requests: 0,
    pending_requests: 0,
    accepted_requests: 0,
  });
  const [recentPendingRequests, setRecentPendingRequests] = useState([]);
  const [technicianName, setTechnicianName] = useState("");
  const [systemReviews, setSystemReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buildStatsLoading, setBuildStatsLoading] = useState(true);
  const [contactFirstName, setContactFirstName] = useState("");
  const [contactLastName, setContactLastName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactSubject, setContactSubject] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - Replace with actual API call
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      setStats({
        pendingAppointments: 5,
        completedAppointments: 28,
        totalEarnings: 125000,
        averageRating: 4.8,
        activeServices: 3,
        totalCustomers: 15,
      });
      setIsLoading(false);
    }, 1000);
  }, []);

  // Contact form state
  const [contactLoading, setContactLoading] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Get session data from backend
        const sessionResponse = await axios.get(
          "http://localhost/gearsphere_api/GearSphere-BackEnd/getSession.php",
          { withCredentials: true }
        );

        if (!sessionResponse.data.success || !sessionResponse.data.user_id) {
          return;
        }

        const userId = sessionResponse.data.user_id;
        const technicianId = sessionResponse.data.technician_id;

        // Get technician details
        const technicianResponse = await axios.get(
          `http://localhost/gearsphere_api/GearSphere-BackEnd/getTechnicianDetail.php?technician_id=${technicianId}`,
          { withCredentials: true }
        );

        if (technicianResponse.data.success) {
          setTechnicianName(technicianResponse.data.technician.name || "");
        }

        // Fetch build request statistics
        const buildStatsResponse = await axios.get(
          `http://localhost/gearsphere_api/GearSphere-BackEnd/getBuildRequestStats.php?technician_id=${technicianId}`,
          { withCredentials: true }
        );

        if (buildStatsResponse.data.success) {
          setBuildStats(buildStatsResponse.data.stats);
          setRecentPendingRequests(buildStatsResponse.data.recent_pending);
        }
        setBuildStatsLoading(false);

        // Fetch all technicians to get their user IDs
        const techniciansResponse = await axios.get(
          "http://localhost/gearsphere_api/GearSphere-BackEnd/getAllTechnicians.php?action=getAll"
        );

        let technicianUserIds = [];
        if (
          techniciansResponse.data &&
          Array.isArray(techniciansResponse.data)
        ) {
          technicianUserIds = techniciansResponse.data.map(
            (tech) => tech.user_id || tech.id
          );
        }

        // Fetch system reviews and filter to show only reviews BY technicians about the system
        const systemReviewsResponse = await fetch(
          `http://localhost/gearsphere_api/GearSphere-BackEnd/getReviews.php?target_type=system&status=approved`
        );
        const systemReviewsData = await systemReviewsResponse.json();

        // Filter to show only system reviews written BY technicians
        const technicianSystemReviews = Array.isArray(systemReviewsData)
          ? systemReviewsData.filter((review) =>
              technicianUserIds.includes(review.user_id)
            )
          : [];

        setSystemReviews(technicianSystemReviews);

        setStats({
          pendingAppointments: 5,
          completedAppointments: 28,
          totalEarnings: 125000,
          averageRating: 4.8,
          activeServices: 3,
          totalCustomers: 15,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <Card className="h-100">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h6 className="text-muted mb-2">{title}</h6>
            <h3 className="mb-0">{value}</h3>
          </div>
          <div className={`bg-${color} bg-opacity-10 p-3 rounded`}>
            <Icon size={24} className={`text-${color}`} />
          </div>
        </div>
      </Card.Body>
    </Card>
  );

  const renderStars = (rating) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`me-1 ${i < rating ? "text-warning" : "text-muted"}`}
          fill={i < rating ? "currentColor" : "none"}
          size={16}
        />
      ));
  };

  const renderReviewCard = (review) => (
    <Col key={review.id} lg={3} md={6} sm={6} xs={12}>
      <Card className="h-100 shadow-sm">
        <Card.Body className="d-flex flex-column">
          <div className="d-flex align-items-center mb-3">
            <img
              src={
                review.profile_image
                  ? `http://localhost/gearsphere_api/GearSphere-BackEnd/profile_images/${review.profile_image}`
                  : "/profile_images/user_image.jpg"
              }
              alt={review.username}
              className="rounded-circle me-3"
              width="50"
              height="50"
              style={{ objectFit: "cover" }}
            />
            <div>
              <h6 className="mb-1">{review.username}</h6>
              <div className="d-flex align-items-center">
                {renderStars(review.rating)}
                <span className="ms-2 text-muted small">
                  ({review.rating}/5)
                </span>
              </div>
            </div>
          </div>
          <p className="text-muted mb-0">{review.comment}</p>
          <div className="mt-auto">
            <small className="text-muted">
              {new Date(review.created_at).toLocaleDateString()}
            </small>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );

  // Show loading screen while data is being fetched
  if (isLoading) {
    return (
      <LoadingScreen
        message="Loading Technician Dashboard"
        subMessage="Fetching your appointment data"
      />
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section
        className="py-0 bg-black text-white position-relative overflow-hidden mb-5"
        style={{
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          borderBottomLeftRadius: "2rem",
          borderBottomRightRadius: "2rem",
          boxShadow: "0 4px 32px rgba(0,0,0,0.10)",
          marginTop: "-1px",
          marginBottom: 0,
          position: "relative",
          paddingTop: 0,
        }}
      >
        {/* Sharp background image (no blur) */}
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            backgroundImage: `url(${pcpic2})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            zIndex: 0,
            opacity: 0.7,
          }}
        ></div>
        {/* Overlay for darkening and contrast */}
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background:
              "radial-gradient(circle at 30% 50%, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0) 70%)",
            zIndex: 1,
          }}
        ></div>
        <Container className="py-0 position-relative" style={{ zIndex: 2 }}>
          <Row className="align-items-center">
            <Col lg={6} className="mb-5 mb-lg-0">
              <h1
                className="display-3 fw-bold mb-4 rise-up"
                style={{ animationDelay: "0s" }}
              >
                Welcome to Your Dashboard,{" "}
                <span className="text-primary">
                  {technicianName || "GearSphere Technician"}
                </span>
              </h1>
              <p
                className="lead mb-5 rise-up"
                style={{ animationDelay: "0.3s" }}
              >
                Manage your appointments, services, earnings, and more. Deliver
                the best PC building experience!
              </p>
              <div
                className="d-flex gap-3 rise-up"
                style={{ animationDelay: "0.6s" }}
              >
                {/* Add dashboard-specific buttons here if needed */}
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      {/* Existing Dashboard Content */}
      <Container className="py-5">
        <h1 className="mb-4">Technician Dashboard</h1>

        {/* Build Request Statistics */}
        <Row className="g-4 mb-4">
          <Col md={4}>
            <StatCard
              title="Total Build Requests"
              value={buildStats.total_requests}
              icon={Tools}
              color="info"
            />
          </Col>
          <Col md={4}>
            <StatCard
              title="Pending Build Requests"
              value={buildStats.pending_requests}
              icon={Clock}
              color="warning"
            />
          </Col>
          <Col md={4}>
            <StatCard
              title="Accepted Build Requests"
              value={buildStats.accepted_requests}
              icon={Star}
              color="success"
            />
          </Col>
        </Row>

        {/* Recent Pending Build Requests */}
        <Row className="mb-4">
          <Col>
            <h3 className="mb-4">Recent Pending Build Requests</h3>
            {buildStatsLoading ? (
              <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading requests...</span>
                </div>
              </div>
            ) : recentPendingRequests && recentPendingRequests.length > 0 ? (
              <Card>
                <Card.Body>
                  <Table responsive hover>
                    <thead>
                      <tr>
                        <th>Customer</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Date Assigned</th>
                        <th>Status</th>
                        
                      </tr>
                    </thead>
                    <tbody>
                      {recentPendingRequests.map((request, index) => (
                        <tr key={request.assignment_id || index}>
                          <td>
                            <div className="d-flex align-items-center">
                              <img
                                src={
                                  request.customer_profile_image
                                    ? `http://localhost/gearsphere_api/GearSphere-BackEnd/profile_images/${request.customer_profile_image}`
                                    : "/profile_images/user_image.jpg"
                                }
                                alt={request.customer_name}
                                className="rounded-circle me-2"
                                width="32"
                                height="32"
                                style={{ objectFit: "cover" }}
                              />
                              {request.customer_name}
                            </div>
                          </td>
                          <td>{request.customer_email}</td>
                          <td>{request.customer_phone}</td>
                          <td>
                            {new Date(request.assigned_at).toLocaleDateString()}
                          </td>
                          <td>
                            <Badge bg="warning">Pending</Badge>
                          </td>
                          
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  <div className="text-center mt-3">
                    <Link
                      to="/technician/build-requests"
                      className="btn btn-primary"
                    >
                      View All Build Requests
                    </Link>
                  </div>
                </Card.Body>
              </Card>
            ) : (
              <Alert variant="info">No recent pending build requests.</Alert>
            )}
          </Col>
        </Row>

        {/* Technicians Reviews Section */}
        <Row className="mt-5">
          <Col>
            <h3 className="mb-4">Technicians Reviews</h3>
            {loading ? (
              <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading reviews...</span>
                </div>
              </div>
            ) : systemReviews.length > 0 ? (
              <Row className="g-4">
                {systemReviews.map((review) => renderReviewCard(review))}
              </Row>
            ) : (
              <Alert variant="info">No technicians reviews yet.</Alert>
            )}
          </Col>
        </Row>
      </Container>
      {/* Contact Section */}
      <section
        className="py-0 bg-white"
        style={{
          borderRadius: "2rem",
          boxShadow: "0 4px 32px rgba(0,0,0,0.10)",
          marginTop: "2rem",
          marginBottom: 0,
        }}
      >

        <Container>
                        <h1 className="text-center mb-5">Contact Us</h1>
                        <Row
                          className="align-items-stretch"
                          style={{ minHeight: "600px" }}
                        >
                          {/* Left Panel - Contact Form with Blue Background */}
                          <Col lg={6} className="d-flex align-items-center">
                            <div className="w-100 p-4">
                              <div
                                style={{
                                  background:
                                    "linear-gradient(135deg, #2c3e50 0%, #3b5998 50%, #4a90e2 100%)",
                                  borderRadius: "2rem",
                                  padding: "3rem 2.5rem",
                                  boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
                                }}
                              >
                                <h2
                                  className="text-white mb-2 fw-bold"
                                  style={{ fontSize: "2.5rem" }}
                                >
                                  Contact Us
                                </h2>
                                <p
                                  className="text-white mb-5"
                                  style={{ opacity: 0.9, fontSize: "1.1rem" }}
                                >
                                  Have questions about our products or services? Fill
                                  out the form and our team will get back to you.
                                </p>
                                <Form
                                  onSubmit={async (e) => {
                                    e.preventDefault();
                                    if (
                                      !contactFirstName ||
                                      !contactLastName ||
                                      !contactEmail ||
                                      !contactSubject ||
                                      !contactMessage
                                    ) {
                                      toast.error("Please fill in all fields.");
                                      return;
                                    }
                                    setContactLoading(true);
                                    try {
                                      const res = await axios.post(
                                        "http://localhost/gearsphere_api/GearSphere-BackEnd/addMessage.php",
                                        {
                                          name:
                                            contactFirstName + " " + contactLastName,
                                          email: contactEmail,
                                          subject: contactSubject,
                                          message: contactMessage,
                                        }
                                      );
                                      if (res.data.success) {
                                        toast.success("Thanks for contacting admin!");
                                        setContactFirstName("");
                                        setContactLastName("");
                                        setContactEmail("");
                                        setContactSubject("");
                                        setContactMessage("");
                                      } else {
                                        toast.error(
                                          res.data.message || "Failed to send message."
                                        );
                                      }
                                    } catch (err) {
                                      toast.error("Failed to send message.");
                                    }
                                    setContactLoading(false);
                                  }}
                                >
                                  <Row>
                                    <Col md={6}>
                                      <Form.Group className="mb-4">
                                        <Form.Control
                                          type="text"
                                          placeholder="First Name"
                                          value={contactFirstName}
                                          onChange={(e) =>
                                            setContactFirstName(e.target.value)
                                          }
                                          style={{
                                            backgroundColor: "transparent",
                                            border: "none",
                                            borderBottom:
                                              "2px solid rgba(255,255,255,0.5)",
                                            borderRadius: "0",
                                            color: "white",
                                            padding: "15px 5px",
                                            fontSize: "1.1rem",
                                          }}
                                          className="contact-input-underline"
                                        />
                                      </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                      <Form.Group className="mb-4">
                                        <Form.Control
                                          type="text"
                                          placeholder="Last Name"
                                          value={contactLastName}
                                          onChange={(e) =>
                                            setContactLastName(e.target.value)
                                          }
                                          style={{
                                            backgroundColor: "transparent",
                                            border: "none",
                                            borderBottom:
                                              "2px solid rgba(255,255,255,0.5)",
                                            borderRadius: "0",
                                            color: "white",
                                            padding: "15px 5px",
                                            fontSize: "1.1rem",
                                          }}
                                          className="contact-input-underline"
                                        />
                                      </Form.Group>
                                    </Col>
                                  </Row>
        
                                  <Form.Group className="mb-4">
                                    <Form.Control
                                      type="email"
                                      placeholder="Email Address"
                                      value={contactEmail}
                                      onChange={(e) => setContactEmail(e.target.value)}
                                      style={{
                                        backgroundColor: "transparent",
                                        border: "none",
                                        borderBottom: "2px solid rgba(255,255,255,0.5)",
                                        borderRadius: "0",
                                        color: "white",
                                        padding: "15px 5px",
                                        fontSize: "1.1rem",
                                      }}
                                      className="contact-input-underline"
                                    />
                                  </Form.Group>
        
                                  <Form.Group className="mb-4">
                                    <Select
                                      options={[
                                        { value: '', label: 'Subject' },
                                        { value: 'Product Inquiry', label: 'Product Inquiry' },
                                        { value: 'Technical Support', label: 'Technical Support' },
                                        { value: 'Order Status', label: 'Order Status' },
                                        { value: 'Returns & Warranty', label: 'Returns & Warranty' },
                                        { value: 'Other', label: 'Other' }
                                      ]}
                                      value={[
                                        { value: '', label: 'Subject' },
                                        { value: 'Product Inquiry', label: 'Product Inquiry' },
                                        { value: 'Technical Support', label: 'Technical Support' },
                                        { value: 'Order Status', label: 'Order Status' },
                                        { value: 'Returns & Warranty', label: 'Returns & Warranty' },
                                        { value: 'Other', label: 'Other' }
                                      ].find(opt => opt.value === contactSubject)}
                                      onChange={opt => setContactSubject(opt.value)}
                                      placeholder="Subject"
                                      styles={{
                                        control: (base) => ({
                                          ...base,
                                          backgroundColor: 'transparent',
                                          border: 'none',
                                          borderBottom: '2px solid rgba(255,255,255,0.5)',
                                          borderRadius: 0,
                                          color: 'white',
                                          padding: '7px 5px 7px 5px',
                                          fontSize: '1.1rem',
                                          boxShadow: 'none',
                                          minHeight: 48,
                                        }),
                                        menu: (base) => ({
                                          ...base,
                                          background: 'linear-gradient(135deg, #2c3e50 0%, #3b5998 50%, #4a90e2 100%)',
                                          color: '#fff',
                                          borderRadius: 20,
                                          marginTop: 15,
                                          zIndex: 9999,
                                        }),
                                        option: (base, state) => ({
                                          ...base,
                                          backgroundColor: state.isFocused ? '#1976d2' : 'transparent',
                                          borderRadius: 22,
                                          color: '#fff',
                                          fontSize: '1.05rem',
                                        }),
                                        singleValue: (base) => ({
                                          ...base,
                                          color: 'white',
                                        }),
                                        placeholder: (base) => ({
                                          ...base,
                                          color: 'rgba(255,255,255,0.7)',
                                        }),
                                        dropdownIndicator: (base) => ({
                                          ...base,
                                          color: 'white',
                                        }),
                                        indicatorSeparator: (base) => ({
                                          ...base,
                                          backgroundColor: 'rgba(255,255,255,0.2)',
                                        }),
                                        input: (base) => ({
                                          ...base,
                                          color: 'white',
                                        })
                                      }}
                                      isSearchable={false}
                                    />
                                  </Form.Group>
        
                                  <Form.Group className="mb-5">
                                    <Form.Control
                                      as="textarea"
                                      rows={4}
                                      placeholder="Enter your message..."
                                      value={contactMessage}
                                      onChange={(e) =>
                                        setContactMessage(e.target.value)
                                      }
                                      style={{
                                        backgroundColor: "transparent",
                                        border: "none",
                                        borderBottom: "2px solid rgba(255,255,255,0.5)",
                                        borderRadius: "0",
                                        color: "white",
                                        padding: "15px 5px",
                                        fontSize: "1.1rem",
                                        resize: "none",
                                      }}
                                      className="contact-input-underline"
                                    />
                                  </Form.Group>
        
                                  <Button
                                    variant="light"
                                    type="submit"
                                    disabled={contactLoading}
                                    className="w-100"
                                    style={{
                                      backgroundColor: "white",
                                      color: "#2c3e50",
                                      border: "none",
                                      borderRadius: "30px",
                                      padding: "15px 30px",
                                      fontSize: "1.2rem",
                                      fontWeight: "600",
                                      boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
                                      transition: "all 0.3s ease",
                                      textTransform: "uppercase",
                                      letterSpacing: "1px",
                                    }}
                                    onMouseEnter={(e) => {
                                      e.target.style.transform = "translateY(-3px)";
                                      e.target.style.boxShadow =
                                        "0 8px 25px rgba(0,0,0,0.3)";
                                    }}
                                    onMouseLeave={(e) => {
                                      e.target.style.transform = "translateY(0)";
                                      e.target.style.boxShadow =
                                        "0 6px 20px rgba(0,0,0,0.2)";
                                    }}
                                  >
                                    {contactLoading ? "Sending..." : "Send Message"}
                                  </Button>
                                </Form>
                              </div>
                            </div>
                          </Col>
        
                          {/* Right Panel - Contact Information with Enhanced Transitions */}
                          <Col lg={6} className="d-flex align-items-center">
                            <div
                              className="w-100 d-flex align-items-center justify-content-center "
                              style={{
                                backgroundColor: "white",
                                borderRadius: "3rem",
                                margin: "20px",
                                minHeight: "750px",
                                boxShadow: "0 15px 50px rgba(0,0,0,0.1)",
        
                                cursor: "pointer",
                                border: "1px solid rgba(0,0,0,0.05)",
                              }}
                            >
                              <div className="text-center p-5">
                                <div className="mb-5">
                                  <h2
                                    className="fw-bold mb-3"
                                    style={{
                                      color: "#2c3e50",
                                      fontSize: "2.2rem",
                                      textTransform: "lowercase",
                                    }}
                                  >
                                    contact us
                                  </h2>
                                  <h3
                                    className="fw-bold"
                                    style={{
                                      color: "#333",
                                      fontSize: "1.3rem",
                                      marginBottom: "3rem",
                                      textTransform: "uppercase",
                                      letterSpacing: "2px",
                                    }}
                                  >
                                    PLEASE GET IN TOUCH
                                  </h3>
                                </div>
        
                                <div className="contact-info-item mb-4 d-flex align-items-center justify-content-start">
                                  <div
                                    className="contact-icon me-4"
                                    style={{
                                      backgroundColor: "#f8f9fa",
                                      borderRadius: "50%",
                                      width: "65px",
                                      height: "65px",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      flexShrink: 0,
                                      transition: "all 0.3s ease",
                                      border: "2px solid #e9ecef",
                                    }}
                                  >
                                    <GeoAlt
                                      size={26}
                                      style={{
                                        color: "#6c757d",
                                        transition: "color 0.3s ease",
                                      }}
                                    />
                                  </div>
                                  <div className="text-start">
                                    <p
                                      className="mb-1 fw-bold"
                                      style={{ color: "#333", fontSize: "1.2rem" }}
                                    >
                                      Address:
                                    </p>
                                    <p
                                      className="mb-0"
                                      style={{
                                        color: "#6c757d",
                                        fontSize: "1rem",
                                        lineHeight: "1.5",
                                      }}
                                    >
                                      Pasara Road, Badulla City, 90 000
                                    </p>
                                  </div>
                                </div>
        
                                <div className="contact-info-item mb-4 d-flex align-items-center justify-content-start">
                                  <div
                                    className="contact-icon me-4"
                                    style={{
                                      backgroundColor: "#f8f9fa",
                                      borderRadius: "50%",
                                      width: "65px",
                                      height: "65px",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      flexShrink: 0,
                                      transition: "all 0.3s ease",
                                      border: "2px solid #e9ecef",
                                    }}
                                  >
                                    <Telephone
                                      size={26}
                                      style={{
                                        color: "#6c757d",
                                        transition: "color 0.3s ease",
                                      }}
                                    />
                                  </div>
                                  <div className="text-start">
                                    <p
                                      className="mb-1 fw-bold"
                                      style={{ color: "#333", fontSize: "1.2rem" }}
                                    >
                                      Phone:
                                    </p>
                                    <p
                                      className="mb-0"
                                      style={{
                                        color: "#6c757d",
                                        fontSize: "1rem",
                                        lineHeight: "1.5",
                                      }}
                                    >
                                      +94 (76) 375 3730
                                    </p>
                                    <p
                                      className="mb-0"
                                      style={{
                                        color: "#6c757d",
                                        fontSize: "1rem",
                                        lineHeight: "1.5",
                                      }}
                                    >
                                      +94 (70) 407 9547
                                    </p>
                                  </div>
                                </div>
        
                                <div className="contact-info-item mb-4 d-flex align-items-center justify-content-start">
                                  <div
                                    className="contact-icon me-4"
                                    style={{
                                      backgroundColor: "#f8f9fa",
                                      borderRadius: "50%",
                                      width: "65px",
                                      height: "65px",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      flexShrink: 0,
                                      transition: "all 0.3s ease",
                                      border: "2px solid #e9ecef",
                                    }}
                                  >
                                    <Envelope
                                      size={26}
                                      style={{
                                        color: "#6c757d",
                                        transition: "color 0.3s ease",
                                      }}
                                    />
                                  </div>
                                  <div className="text-start">
                                    <p
                                      className="mb-1 fw-bold"
                                      style={{ color: "#333", fontSize: "1.2rem" }}
                                    >
                                      Email:
                                    </p>
                                    <p
                                      className="mb-0"
                                      style={{
                                        color: "#6c757d",
                                        fontSize: "1rem",
                                        lineHeight: "1.5",
                                      }}
                                    >
                                      info@gearsphere.com
                                    </p>
                                    <p
                                      className="mb-0"
                                      style={{
                                        color: "#6c757d",
                                        fontSize: "1rem",
                                        lineHeight: "1.5",
                                      }}
                                    >
                                      support@gearsphere.com
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </Container>
        
      </section>
    </>
  );
}

export default TechnicianDashboard;
