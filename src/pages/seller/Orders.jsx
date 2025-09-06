import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Form,
  Modal,
  Badge,
  Pagination,
  InputGroup,
} from "react-bootstrap";
import {
  Search,
  Box,
  CheckCircle,
  XCircle,
  Truck,
} from "react-bootstrap-icons";
import axios from "axios";
import LoadingScreen from "../../components/loading/LoadingScreen";

const SellerOrders = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const ordersPerPage = 10;
  const [orders, setOrders] = useState([]);
  const [updateStatus, setUpdateStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch orders from backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(
          `http://localhost/gearsphere_api/GearSphere-BackEnd/getSellerOrders.php`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await res.json();
        if (data.success) {
          // Map backend data to frontend format
          setOrders(
            data.orders.map((order) => ({
              id: order.order_id,
              customer: {
                name: order.customer.name,
                email: order.customer.email,
                phone: order.customer.phone,
                address: order.customer.address,
              },
              date: order.date,
              total: Number(order.total),
              status: order.status,
              items: order.items.map((item) => ({
                id: item.product_id,
                name: item.name,
                quantity: item.quantity,
                price: Number(item.price),
                category: item.category,
                image_url: item.image_url,
              })),
              // Optionally add paymentMethod, trackingNumber, notes if available in backend
              paymentMethod: order.paymentMethod || "",
              trackingNumber: order.trackingNumber || "",
              notes: order.notes || "",
              shippingAddress: order.customer.address || "",
              deliveryCharge: order.delivery_charge || 0,
              deliveryAddress: order.delivery_address || order.customer.address,
            }))
          );
        }
      } catch (err) {
        console.error("Failed to fetch seller orders:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusBadge = (status) => {
    const variants = {
      "In Process": "primary",
      "Ready to Deliver": "info",
      Delivered: "success",
      Processing: "primary",
      Shipped: "info",
    };
    return <Badge bg={variants[status] || "secondary"}>{status}</Badge>;
  };

  const statusDisplayMap = {
    pending: "Pending",
    processing: "Processing",
    shipped: "Shipped",
    delivered: "Delivered",
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      // Send update to backend
      const res = await axios.post(
        "http://localhost/gearsphere_api/GearSphere-BackEnd/updateOrderStatus.php",
        {
          order_id: orderId,
          status: newStatus,
        }
      );
      if (res.data.success) {
        setOrders((prev) =>
          prev.map((order) =>
            order.id === orderId
              ? { ...order, status: statusDisplayMap[newStatus] || newStatus }
              : order
          )
        );
      } else {
        alert(
          "Failed to update status: " + (res.data.message || "Unknown error")
        );
      }
    } catch (err) {
      alert("Failed to update status: " + err.message);
    }
    setShowUpdateModal(false);
  };

  // Remove the useEffect that fetches payment methods for each order
  // Use order.paymentMethod directly from backend

  const filteredOrders = orders.filter(
    (order) =>
      (String(order.id).toLowerCase().includes(searchQuery.toLowerCase()) ||
        (order.customer.name &&
          order.customer.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase())) ||
        (order.customer.email &&
          order.customer.email
            .toLowerCase()
            .includes(searchQuery.toLowerCase()))) &&
      (statusFilter === "all" || order.status === statusFilter) &&
      (dateFilter === "all" || order.date === dateFilter)
  );

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const formatLKR = (amount) => "LKR " + Number(amount).toLocaleString("en-LK");

  // Show loading screen while data is being fetched
  if (isLoading) {
    return (
      <LoadingScreen
        message="Loading Orders"
        subMessage="Fetching your order management data"
      />
    );
  }

  return (
    <Container className="py-5">
      <h1 className="text-center mb-5">Order Management</h1>

      <Row className="mb-4">
        <Col md={2}>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <h6 className="text-muted mb-2">Total Orders</h6>
              <h3>{orders.length}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <h6 className="text-muted mb-2">Pending</h6>
              <h3>
                {orders.filter((order) => order.status === "Pending").length}
              </h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <h6 className="text-muted mb-2">Processing</h6>
              <h3>
                {orders.filter((order) => order.status === "Processing").length}
              </h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <h6 className="text-muted mb-2">Shipped</h6>
              <h3>
                {orders.filter((order) => order.status === "Shipped").length}
              </h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <h6 className="text-muted mb-2">Delivered</h6>
              <h3>
                {orders.filter((order) => order.status === "Delivered").length}
              </h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <h6 className="text-muted mb-2">Total Revenue</h6>
              <h3>
                {formatLKR(orders.reduce((sum, order) => sum + order.total, 0))}
              </h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="d-flex gap-2">
              <Form.Select
                style={{ width: "200px" }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </Form.Select>
            </div>
            <Form.Control
              type="search"
              placeholder="Search by order ID, customer name, or email..."
              style={{ width: "300px" }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Table responsive hover>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
                <th>Payment Method</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>
                    <div>{order.customer.name}</div>
                    <small className="text-muted">{order.customer.email}</small>
                  </td>
                  <td>{order.date}</td>
                  <td>{formatLKR(order.total)}</td>
                  <td>{getStatusBadge(order.status)}</td>
                  <td>{order.paymentMethod}</td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowDetailsModal(true);
                      }}
                    >
                      Details
                    </Button>
                    <Button
                      variant="outline-info"
                      size="sm"
                      onClick={() => {
                        setSelectedOrder(order);
                        setUpdateStatus(order.status);
                        setShowUpdateModal(true);
                      }}
                    >
                      Update Status
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <Pagination>
                <Pagination.Prev
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                />
                {[...Array(totalPages)].map((_, index) => (
                  <Pagination.Item
                    key={index + 1}
                    active={index + 1 === currentPage}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                />
              </Pagination>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Order Details Modal */}
      <Modal
        show={showDetailsModal}
        onHide={() => setShowDetailsModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <>
              <Row className="mb-4">
                <Col md={6}>
                  <h5>Order Information</h5>
                  <p className="mb-1">
                    <strong>Order ID:</strong> {selectedOrder.id}
                  </p>
                  <p className="mb-1">
                    <strong>Date:</strong> {selectedOrder.date}
                  </p>
                  <p className="mb-1">
                    <strong>Status:</strong>{" "}
                    {getStatusBadge(selectedOrder.status)}
                  </p>
                  <p className="mb-1">
                    <strong>Payment Method:</strong>{" "}
                    {selectedOrder.paymentMethod}
                  </p>
                </Col>
                <Col md={6}>
                  <h5>Customer Information</h5>
                  <p className="mb-1">
                    <strong>Name:</strong> {selectedOrder.customer.name}
                  </p>
                  <p className="mb-1">
                    <strong>Email:</strong> {selectedOrder.customer.email}
                  </p>
                  <p className="mb-1">
                    <strong>Phone:</strong> {selectedOrder.customer.phone}
                  </p>
                  <p className="mb-1">
                    <strong>Delivery Address:</strong> {selectedOrder.deliveryAddress}
                  </p>
                </Col>
              </Row>
              <h5>Order Items</h5>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item) => (
                    <tr key={item.id}>
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
                    <td colSpan="5" className="py-4">
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
              {selectedOrder.notes && (
                <div className="mt-3">
                  <h5>Notes</h5>
                  <p>{selectedOrder.notes}</p>
                </div>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDetailsModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Update Status Modal */}
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Order Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Order ID</Form.Label>
                <Form.Control type="text" value={selectedOrder.id} disabled />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Current Status</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedOrder.status}
                  disabled
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>New Status</Form.Label>
                <Form.Select
                  value={updateStatus}
                  onChange={(e) => setUpdateStatus(e.target.value)}
                >
                  <option value="Select Status">Select Status</option>
                  {["processing", "shipped", "delivered"]
                    .filter(
                      (status) =>
                        statusDisplayMap[status] !== selectedOrder.status
                    )
                    .map((status) => (
                      <option key={status} value={status}>
                        {statusDisplayMap[status]}
                      </option>
                    ))}
                </Form.Select>
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => handleUpdateStatus(selectedOrder?.id, updateStatus)}
          >
            Update Status
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default SellerOrders;
