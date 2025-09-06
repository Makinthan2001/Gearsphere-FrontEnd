import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Badge,
  Button,
  Modal,
  Spinner,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../../components/loading/LoadingScreen";
// import { OrdersContext } from './OrdersContext';

const Orders = () => {
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [showTechnicianModal, setShowTechnicianModal] = useState(false);
  const [technicianDetails, setTechnicianDetails] = useState(null);

  const formatLKR = (amount) => "LKR " + Number(amount).toLocaleString("en-LK");

  const getStatusBadge = (status, isRequest = false) => {
    if (isRequest) {
      const variants = {
        Pending: "primary", // blue
        Accepted: "success", // green
        Rejected: "danger", // red
      };
      return <Badge bg={variants[status] || "secondary"}>{status}</Badge>;
    } else {
      const variants = {
        Pending: "warning",
        Processing: "info",
        Shipped: "primary",
        Delivered: "success",
        Cancelled: "danger",
      };
      return <Badge bg={variants[status] || "secondary"}>{status}</Badge>;
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const handleViewTechnician = async (technicianId) => {
    try {
      const response = await axios.get(
        `http://localhost/gearsphere_api/GearSphere-BackEnd/getTechnicianDetail.php?technician_id=${technicianId}`
      );
      if (response.data.success) {
        setTechnicianDetails(response.data.technician);
        setShowTechnicianModal(true);
      }
    } catch (err) {
      setTechnicianDetails(null);
      setShowTechnicianModal(false);
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        // Get user session from backend
        const sessionResponse = await axios.get(
          "http://localhost/gearsphere_api/GearSphere-BackEnd/getSession.php",
          { withCredentials: true }
        );

        if (!sessionResponse.data.success) {
          setOrders([]);
          setLoading(false);
          return;
        }

        const user_id = sessionResponse.data.user_id;
        const response = await fetch(
          `http://localhost/gearsphere_api/GearSphere-BackEnd/getOrders.php?user_id=${user_id}`,
          { credentials: "include" }
        );
        const data = await response.json();
        if (data.success && Array.isArray(data.orders)) {
          setOrders(data.orders);
        } else {
          setOrders([]);
        }
      } catch (err) {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Show loading screen while data is being fetched
  if (loading) {
    return (
      <LoadingScreen
        message="Loading Your Orders"
        subMessage="Fetching your order history"
      />
    );
  }

  return (
    <Container className="py-5">
      <h1 className="text-center mb-5">My Orders</h1>

      {orders.length === 0 ? (
        <Card className="shadow-sm">
          <Card.Body className="text-center py-5">
            <h4 className="text-muted mb-3">No Orders Yet</h4>
            <p className="text-muted">You haven't placed any orders yet.</p>
            <Button variant="primary" href="/marketplace">
              Browse Products
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Card className="shadow-sm">
          <Card.Body>
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Order Status</th>
                  <th>Total</th>
                  <th>Actions</th>
                  <th>Request Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.order_id}>
                    <td>{order.order_id}</td>
                    <td>{order.date}</td>
                    <td>{getStatusBadge(order.orderStatus)}</td>
                    <td>{formatLKR(order.total)}</td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleViewDetails(order)}
                      >
                        View Details
                      </Button>
                    </td>
                    <td>
                      {order.requestStatus ? (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 8,
                          }}
                        >
                          <span>
                            {getStatusBadge(order.requestStatus, true)}
                          </span>
                          <div>
                            {order.requestStatus.toLowerCase() ===
                              "rejected" && (
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() =>
                                  navigate("/customer/find-technician", {
                                    state: { order_id: order.order_id },
                                  })
                                }
                              >
                                Add Technician
                              </Button>
                            )}
                            {["pending", "accepted"].includes(
                              order.requestStatus?.toLowerCase()
                            ) &&
                              order.technicianId && (
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={() =>
                                    handleViewTechnician(order.technicianId)
                                  }
                                >
                                  View Technician
                                </Button>
                              )}
                          </div>
                        </div>
                      ) : (
                        <span>-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {/* Order Details Modal */}
      <Modal
        show={showOrderDetails}
        onHide={() => setShowOrderDetails(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <>
              <Row className="mb-4">
                <Col md={12}>
                  <h5>Order Information</h5>
                  <p className="mb-1">
                    <strong>Order ID:</strong> {selectedOrder.order_id}
                  </p>
                  <p className="mb-1">
                    <strong>Date:</strong> {selectedOrder.date}
                  </p>
                  <p className="mb-1">
                    <strong>Status:</strong>{" "}
                    {getStatusBadge(selectedOrder.orderStatus)}
                  </p>
                  <p className="mb-1">
                    <strong>Payment Status:</strong>{" "}
                    <Badge bg="success">{selectedOrder.paymentStatus}</Badge>
                  </p>
                </Col>
              </Row>
              
              <Row className="mb-4">
                <Col md={12}>
                  <h5>Order Summary</h5>
                  <p className="text-muted mb-0">Full order breakdown is displayed below the items table.</p>
                </Col>
              </Row>
              
              <Row className="mb-4">
                <Col md={12}>
                  <h5>Shipping Information</h5>
                  <p className="mb-1">
                    <strong>Delivery Address:</strong> {selectedOrder.deliveryAddress}
                  </p>
                  <p className="mb-1">
                    <strong>Phone Number:</strong> {selectedOrder.phoneNumber}
                  </p>
                </Col>
              </Row>

              <h5>Order Items</h5>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Photo</th>
                    <th>Item</th>
                    <th>Category</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item, index) => (
                    <tr key={index}>
                      <td>
                        {item.image_url ? (
                          <img
                            src={`http://localhost/gearsphere_api/GearSphere-BackEnd/${item.image_url}`}
                            alt={item.name}
                            style={{
                              width: 56,
                              height: 56,
                              objectFit: "cover",
                              borderRadius: 6,
                            }}
                          />
                        ) : (
                          <span className="text-muted">No Image</span>
                        )}
                      </td>
                      <td>{item.name}</td>
                      <td>{item.category}</td>
                      <td>{item.quantity}</td>
                      <td>{formatLKR(item.price)}</td>
                      <td>{formatLKR(item.quantity * item.price)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-top">
                    <td colSpan="6" className="py-4">
                      <div className="bg-light p-4 rounded shadow-sm">
                        <div className="d-flex justify-content-between align-items-center mb-3 pb-2">
                          <span className="text-muted fs-6">Items Subtotal:</span>
                          <span className="fw-semibold fs-6">
                            {formatLKR(selectedOrder.items.reduce((sum, item) => sum + (item.quantity * item.price), 0))}
                          </span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mb-3 pb-2">
                          <span className="text-muted fs-6">Delivery Charge:</span>
                          <span className="fw-semibold fs-6 text-primary">
                            {formatLKR(selectedOrder.deliveryCharge)}
                          </span>
                        </div>
                        <hr className="my-3" />
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="fs-5 fw-bold text-dark">Total:</span>
                          <span className="fs-5 fw-bold text-success">
                            {formatLKR(selectedOrder.total)}
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tfoot>
              </Table>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowOrderDetails(false)}
          >
            Close
          </Button>
          {selectedOrder?.status === "Delivered" && (
            <Button variant="primary">Leave Review</Button>
          )}
        </Modal.Footer>
      </Modal>

      {/* Technician Details Modal */}
      <Modal
        show={showTechnicianModal}
        onHide={() => setShowTechnicianModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Technician Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {technicianDetails ? (
            <div className="text-center">
              <img
                src={
                  technicianDetails.profile_image
                    ? `http://localhost/gearsphere_api/GearSphere-BackEnd/profile_images/${technicianDetails.profile_image}`
                    : "/profile_images/user_image.jpg"
                }
                alt={technicianDetails.name}
                style={{
                  width: 120,
                  height: 120,
                  objectFit: "cover",
                  borderRadius: "50%",
                  marginBottom: 12,
                }}
              />
              <h4 className="mt-2 mb-1">{technicianDetails.name}</h4>
              <Badge
                bg={
                  technicianDetails.status === "available"
                    ? "success"
                    : "secondary"
                }
                className="mb-2"
              >
                {technicianDetails.status === "available"
                  ? "Available"
                  : "Unavailable"}
              </Badge>
              <div className="mb-2">
                <Badge bg="primary">{technicianDetails.specialization}</Badge>
              </div>
              <div className="mb-2">
                <i className="bi bi-geo-alt"></i> {technicianDetails.address}
              </div>
              <div className="mb-2">
                <strong>Phone:</strong> {technicianDetails.contact_number}{" "}
                &nbsp;
                <strong>Charge:</strong> Rs.{" "}
                {Number(technicianDetails.charge_per_day).toLocaleString()} /
                day
              </div>
              <div className="mb-2">
                <strong>Experience:</strong> {technicianDetails.experience}{" "}
                years
              </div>
            </div>
          ) : (
            <div className="text-center text-muted">
              Technician details not found.
            </div>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Orders;
