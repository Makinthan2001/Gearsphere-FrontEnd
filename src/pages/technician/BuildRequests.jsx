import React, { useState, useEffect } from "react";
import axios from "axios";
import LoadingScreen from "../../components/loading/LoadingScreen";

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: 16,
  background: "#fff",
  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  borderRadius: 12,
  overflow: "hidden",
  border: "1px solid #e0e0e0",
};
const thStyle = {
  background: "linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 100%)",
  color: "#fff",
  padding: "16px 12px",
  textAlign: "left",
  fontWeight: 600,
  fontSize: "14px",
  letterSpacing: "0.5px",
  textTransform: "uppercase",
  borderBottom: "3px solid #000",
};
const tdStyle = {
  padding: "14px 12px",
  borderBottom: "1px solid #f0f0f0",
  color: "#333",
  fontSize: "14px",
  verticalAlign: "middle",
};
const trHover = {
  background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
  transform: "scale(1.001)",
  transition: "all 0.2s ease",
};
const imgStyle = {
  width: 50,
  height: 50,
  borderRadius: "50%",
  objectFit: "cover",
  border: "2px solid #e0e0e0",
  background: "#f8f9fa",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
};
const modalOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
  backdropFilter: "blur(4px)",
};
const modalContent = {
  background: "#fff",
  borderRadius: 16,
  padding: 32,
  minWidth: 380,
  maxWidth: 450,
  boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
  position: "relative",
  border: "1px solid #e0e0e0",
};
const closeBtn = {
  position: "absolute",
  top: 16,
  right: 20,
  background: "none",
  border: "none",
  fontSize: 24,
  cursor: "pointer",
  color: "#666",
  width: 32,
  height: 32,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.2s ease",
};
const actionBtn = {
  padding: "10px 20px",
  margin: "0 8px",
  border: "none",
  borderRadius: 8,
  fontWeight: 600,
  fontSize: 14,
  cursor: "pointer",
  transition: "all 0.2s ease",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};
const confirmModalContent = {
  background: "#fff",
  borderRadius: 16,
  padding: 32,
  minWidth: 320,
  maxWidth: 380,
  boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
  textAlign: "center",
  position: "relative",
  border: "1px solid #e0e0e0",
};
const confirmBtn = {
  ...actionBtn,
  minWidth: 90,
  margin: "0 8px",
};
const statusBadge = {
  display: "inline-block",
  minWidth: 85,
  padding: "6px 14px",
  borderRadius: 20,
  fontWeight: 600,
  fontSize: 12,
  textAlign: "center",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
};
const statusColors = {
  pending: {
    background:
      "linear-gradient(135deg, #ffc107 0%, #ff8f00 100%)",
    color: "#fff",
  },
  accepted: {
    background:
      "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
    color: "#fff",
  },
  rejected: {
    background:
      "linear-gradient(135deg, #dc3545 0%, #e91e63 100%)",
    color: "#fff",
  },
};

const BuildRequests = () => {
  const [buildRequests, setBuildRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hoveredRow, setHoveredRow] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");
  const [localStatus, setLocalStatus] = useState("");
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    action: null,
  });
  
  // New states for PC parts modal
  const [showPartsModal, setShowPartsModal] = useState(false);
  const [partsData, setPartsData] = useState([]);
  const [partsLoading, setPartsLoading] = useState(false);
  const [partsError, setPartsError] = useState("");

  useEffect(() => {
    fetchBuildRequests();
    // eslint-disable-next-line
  }, []);

  const fetchBuildRequests = async () => {
    try {
      setLoading(true);

      // Get session data first
      const sessionResponse = await axios.get(
        "http://localhost/gearsphere_api/GearSphere-BackEnd/getSession.php",
        { withCredentials: true }
      );

      if (
        !sessionResponse.data.success ||
        !sessionResponse.data.technician_id
      ) {
        setError("Technician not logged in.");
        setLoading(false);
        return;
      }

      const technician_id = sessionResponse.data.technician_id;

      // Fetch build requests using session-based technician_id
      const response = await fetch(
        `http://localhost/gearsphere_api/GearSphere-BackEnd/getBuildRequests.php?technician_id=${technician_id}`
      );

      const data = await response.json();

      if (data.success) {
        setBuildRequests(data.data);
      } else {
        setError(data.message || "Failed to fetch build requests.");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching build requests:", error);
      setError("Failed to fetch build requests.");
      setLoading(false);
    }
  };

  // Helper to get customer profile image
  const getProfileImage = (req) => {
    if (req.customer_profile_image) {
      return `http://localhost/gearsphere_api/GearSphere-BackEnd/profile_images/${req.customer_profile_image}`;
    }
    return `http://localhost/gearsphere_api/GearSphere-BackEnd/profile_images/user_image.jpg`;
  };

  // Function to fetch PC parts for an assignment
  const fetchPCParts = async (assignmentId) => {
    try {
      setPartsLoading(true);
      setPartsError("");
      
      const response = await fetch(
        `http://localhost/gearsphere_api/GearSphere-BackEnd/getOrders.php?assignment_id=${assignmentId}`
      );
      
      const data = await response.json();
      
      if (data.success && data.orders && data.orders.length > 0) {
        // Extract items from all orders for this assignment
        const allItems = data.orders.flatMap(order => order.items || []);
        setPartsData(allItems);
        setShowPartsModal(true);
      } else {
        setPartsError("No PC parts found for this assignment. The customer may not have placed an order yet.");
      }
      setPartsLoading(false);
    } catch (error) {
      console.error("Error fetching PC parts:", error);
      setPartsError("Failed to fetch PC parts");
      setPartsLoading(false);
    }
  };

  // PC Parts Modal Component
  const PCPartsModal = ({ show, parts, onClose, loading, error }) => {
    if (!show) return null;
    
    return (
      <div style={modalOverlay}>
        <div style={{
          ...modalContent,
          minWidth: 800,
          maxWidth: 1000,
          maxHeight: '90vh',
          overflow: 'auto'
        }}>
          <button style={closeBtn} onClick={onClose}>
            &times;
          </button>
          <h3 style={{ margin: '0 0 20px 0', color: '#333', textAlign: 'center' }}>
            PC Parts Details
          </h3>
          
          {loading && (
            <div style={{ textAlign: 'center', padding: 40 }}>
              <div>Loading PC parts...</div>
            </div>
          )}
          
          {error && (
            <div style={{ 
              color: '#e53935', 
              textAlign: 'center', 
              padding: 20,
              background: '#ffebee',
              borderRadius: 8,
              border: '1px solid #ffcdd2'
            }}>
              {error}
            </div>
          )}
          
          {!loading && !error && parts.length > 0 && (
            <div>
              {/* Parts List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {parts.map((part, idx) => (
                  <div 
                    key={`${part.product_id}-${idx}`} 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: 16,
                      background: idx % 2 === 0 ? '#fff' : '#f8f9fa',
                      borderRadius: 8,
                      border: '1px solid #e0e0e0',
                      gap: 16
                    }}
                  >
                    {/* Product Image */}
                    <img
                      src={part.image_url ? 
                        `http://localhost/gearsphere_api/GearSphere-BackEnd/${part.image_url}` : 
                        '/placeholder-product.png'
                      }
                      alt={part.name}
                      style={{
                        width: 60,
                        height: 60,
                        objectFit: 'cover',
                        borderRadius: 8,
                        border: '1px solid #ddd',
                        flexShrink: 0
                      }}
                    />
                    
                    {/* Product Details */}
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        fontWeight: 600, 
                        fontSize: 15,
                        color: '#333',
                        marginBottom: 4 
                      }}>
                        {part.name}
                      </div>
                      {part.description && (
                        <div style={{ 
                          fontSize: 13, 
                          color: '#666',
                          lineHeight: 1.4
                        }}>
                          {part.description}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {!loading && !error && parts.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, color: '#666' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📦</div>
              <div style={{ fontSize: 18, fontWeight: 500 }}>No PC parts found</div>
              <div style={{ fontSize: 14, marginTop: 8 }}>
                The customer hasn't placed an order for this build request yet.
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Custom confirmation modal
  const ConfirmModal = ({ show, action, onConfirm, onCancel, loading }) => {
    if (!show) return null;
    return (
      <div style={modalOverlay}>
        <div style={confirmModalContent}>
          <div style={{ fontSize: 18, marginBottom: 18 }}>
            Are you sure you want to <b>{action}</b> this request?
          </div>
          <button
            style={{
              ...confirmBtn,
              background: action === "accept" ? "#43a047" : "#e53935",
              color: "#fff",
            }}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Processing..." : "Yes"}
          </button>
          <button
            style={{
              ...confirmBtn,
              background: "#eee",
              color: "#333",
              border: "1px solid #bbb",
            }}
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  // Modal for customer details and actions
  const CustomerDetailModal = ({ request, onClose }) => {
    if (!request) return null;
    const statusToShow = localStatus || request.status;

    const handleStatusUpdate = (status) => {
      setConfirmModal({ show: true, action: status });
    };

    const doStatusUpdate = (status) => {
      setModalLoading(true);
      setModalError("");
      fetch(
        "http://localhost/gearsphere_api/GearSphere-BackEnd/updateAssignmentStatus.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            assignment_id: request.assignment_id,
            status,
          }),
        }
      )
        .then((res) => res.json())
        .then((data) => {
          setModalLoading(false);
          setConfirmModal({ show: false, action: null });
          if (data.success) {
            setLocalStatus(status);
            fetchBuildRequests();
          } else {
            setModalError(data.message || "Failed to update status.");
          }
        })
        .catch(() => {
          setModalLoading(false);
          setConfirmModal({ show: false, action: null });
          setModalError("Failed to update status.");
        });
    };

    return (
      <div style={modalOverlay}>
        <div style={modalContent}>
          <button style={closeBtn} onClick={onClose}>
            &times;
          </button>
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <img
              src={getProfileImage(request)}
              alt={request.customer_name}
              style={{ ...imgStyle, width: 72, height: 72, marginBottom: 8 }}
            />
            <h3 style={{ margin: 0 }}>{request.customer_name}</h3>
            <div style={{ color: "#888", fontSize: 14 }}>
              {request.customer_email}
            </div>
          </div>
          <div style={{ marginBottom: 8 }}>
            <b>Phone:</b> {request.customer_phone}
          </div>
          <div style={{ marginBottom: 8 }}>
            <b>Address:</b> {request.customer_address}
          </div>
          <div style={{ marginBottom: 8 }}>
            <b>Date Assigned:</b> {request.assigned_at}
          </div>
          <div style={{ marginBottom: 8 }}>
            <b>Status:</b> {statusToShow}
          </div>
          <div style={{ marginBottom: 8 }}>
            <b>Instructions:</b> {request.instructions}
          </div>
          {modalError && (
            <div style={{ color: "red", marginBottom: 8 }}>{modalError}</div>
          )}
          
          {/* PC Parts Details Button */}
          <div style={{ textAlign: 'center', marginTop: 16, marginBottom: 16 }}>
            <button
              style={{
                ...actionBtn,
                background: 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '12px 24px',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                margin: '0 auto'
              }}
              onClick={() => fetchPCParts(request.assignment_id)}
              disabled={partsLoading}
            >
              {partsLoading ? (
                <>
                  <div style={{
                    width: 16,
                    height: 16,
                    border: '2px solid #fff',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  Loading...
                </>
              ) : (
                <>
                  🛠️ View PC Parts Details
                </>
              )}
            </button>
            {partsError && (
              <div style={{ 
                color: '#e53935', 
                fontSize: 12, 
                marginTop: 8,
                padding: 8,
                background: '#ffebee',
                borderRadius: 4,
                border: '1px solid #ffcdd2'
              }}>
                {partsError}
              </div>
            )}
          </div>
          
          <div style={{ textAlign: "center", marginTop: 18 }}>
            {statusToShow === "pending" && (
              <>
                <button
                  style={{ ...actionBtn, background: "#43a047", color: "#fff" }}
                  disabled={modalLoading}
                  onClick={() => handleStatusUpdate("accepted")}
                >
                  Accept
                </button>
                <button
                  style={{ ...actionBtn, background: "#e53935", color: "#fff" }}
                  disabled={modalLoading}
                  onClick={() => handleStatusUpdate("rejected")}
                >
                  Reject
                </button>
              </>
            )}
            {statusToShow === "accepted" && (
              <button
                style={{ ...actionBtn, background: "#43a047", color: "#fff" }}
                disabled
              >
                Accepted
              </button>
            )}
            {statusToShow === "rejected" && (
              <button
                style={{ ...actionBtn, background: "#e53935", color: "#fff" }}
                disabled
              >
                Rejected
              </button>
            )}
          </div>
        </div>
        <ConfirmModal
          show={confirmModal.show}
          action={confirmModal.action === "accepted" ? "accept" : "reject"}
          onConfirm={() => doStatusUpdate(confirmModal.action)}
          onCancel={() => setConfirmModal({ show: false, action: null })}
          loading={modalLoading}
        />
      </div>
    );
  };

  // Show loading screen while data is being fetched
  if (loading) {
    return (
      <LoadingScreen
        message="Loading Build Requests"
        subMessage="Fetching pending assignments"
      />
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <h2 className="mb-4" style={{ fontWeight: 700, color: "#000" }}>
        Build Requests
      </h2>
      {error ? (
        <div style={{ color: "red", textAlign: "center", marginTop: 40 }}>
          {error}
        </div>
      ) : buildRequests.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: 80, color: "#888" }}>
          <img
            src="/no-data.svg"
            alt="No Requests"
            style={{ width: 120, marginBottom: 18, opacity: 0.7 }}
          />
          <div style={{ fontSize: 22, fontWeight: 500 }}>
            No build requests found
          </div>
          <div style={{ fontSize: 15, marginTop: 6 }}>
            You have not been assigned any build requests yet.
          </div>
        </div>
      ) : (
        <div style={{ overflowX: "auto", borderRadius: 8 }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Customer Photo</th>
                <th style={thStyle}>Customer Name</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Phone</th>
                <th style={thStyle}>Date Assigned</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {buildRequests.map((req, idx) => (
                <tr
                  key={req.assignment_id}
                  style={hoveredRow === idx ? trHover : {}}
                  onMouseEnter={() => setHoveredRow(idx)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td style={tdStyle}>
                    <img
                      src={getProfileImage(req)}
                      alt={req.customer_name}
                      style={imgStyle}
                    />
                  </td>
                  <td style={tdStyle}>{req.customer_name}</td>
                  <td style={tdStyle}>{req.customer_email}</td>
                  <td style={tdStyle}>{req.customer_phone}</td>
                  <td style={tdStyle}>{req.assigned_at}</td>
                  <td style={tdStyle}>
                    <span
                      style={{
                        ...statusBadge,
                        ...(statusColors[req.status] || statusColors.pending),
                      }}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <button
                      style={{
                        padding: "6px 14px",
                        background: "transparent",
                        color: "#1976d2",
                        border: "2px solid #1976d2",
                        borderRadius: 5,
                        cursor: "pointer",
                        fontWeight: 500,
                      }}
                      onClick={() => {
                        setSelectedRequest(req);
                        setShowModal(true);
                        setLocalStatus("");
                      }}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {showModal && (
        <CustomerDetailModal
          request={selectedRequest}
          onClose={() => setShowModal(false)}
        />
      )}
      
      {/* PC Parts Modal */}
      <PCPartsModal
        show={showPartsModal}
        parts={partsData}
        onClose={() => {
          setShowPartsModal(false);
          setPartsData([]);
          setPartsError("");
        }}
        loading={partsLoading}
        error={partsError}
      />
    </div>
  );
};

export default BuildRequests;
