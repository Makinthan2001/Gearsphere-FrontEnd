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
} from "react-bootstrap";
import { Link } from "react-router-dom";
import "../../styles.css";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  Award,
  Star,
  StarFill,
  Cart,
  Person,
  Headset,
} from "react-bootstrap-icons";
import { Envelope, Telephone, GeoAlt } from "react-bootstrap-icons";
import logo from "../../images/logo.PNG";
import Select from "react-select";
import pcpic2 from "../../images/pcpic2.jpeg";
import { toast } from "react-toastify";
import axios from "axios";
import LoadingScreen from "../../components/loading/LoadingScreen";

function CustomerDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    deliveredOrders: 0,
    pendingOrders: 0,
    reviews: 0,
    supportTickets: 0,
  });
  const [recentReviews, setRecentReviews] = useState([]);
  const [systemReviews, setSystemReviews] = useState([]);
  const [customerName, setCustomerName] = useState("Customer");
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch real data from backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // First check if user is logged in and is a customer
        const sessionResponse = await axios.get(
          "http://localhost/gearsphere_api/GearSphere-BackEnd/getSession.php",
          { withCredentials: true }
        );

        if (!sessionResponse.data.success) {
          setError("Please log in to access the customer dashboard");
          toast.error("Please log in first");
          return;
        }

        const userType = sessionResponse.data.user_type?.toLowerCase();
        if (userType !== "customer") {
          //setError(`Access denied. This dashboard is for customers only. You are logged in as: ${sessionResponse.data.user_type}`);
          // toast.error("Customer access only");
          return;
        }

        // If user is a customer, proceed with fetching dashboard data
        const response = await axios.get(
          "http://localhost/gearsphere_api/GearSphere-BackEnd/getCustomerDashboard.php",
          { withCredentials: true }
        );

        if (response.data.success) {
          const { dashboard_data, customer_name } = response.data;
          setStats({
            totalOrders: dashboard_data.total_orders,
            deliveredOrders: dashboard_data.delivered_orders,
            pendingOrders: dashboard_data.pending_orders,
            reviews: dashboard_data.total_reviews,
            supportTickets: 1, // Keep mock data for now
          });
          setRecentReviews(dashboard_data.recent_reviews);
          setCustomerName(customer_name);
        } else {
          setError(response.data.message || "Failed to fetch dashboard data");
          toast.error("Failed to load dashboard data");
        }
      } catch (err) {
        if (err.response?.status === 403) {
          setError(
            "Access denied. Please log in as a customer to access this dashboard."
          );
          toast.error("Customer access required");
        } else {
          setError("Failed to connect to server");
          toast.error("Failed to load dashboard data");
        }
      } finally {
        setLoading(false);
      }
    };

    const fetchSystemReviews = async () => {
      try {
        setReviewsLoading(true);
        const response = await axios.get(
          "http://localhost/gearsphere_api/GearSphere-BackEnd/getSystemReviews.php"
        );

        if (response.data.success) {
          setSystemReviews(response.data.reviews);
        } else {
          toast.error("Failed to load system reviews");
        }
      } catch (err) {
        toast.error("Error loading system reviews");
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchDashboardData();
    fetchSystemReviews();
  }, []);

  // Contact form state
  const [contactFirstName, setContactFirstName] = useState("");
  const [contactLastName, setContactLastName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactSubject, setContactSubject] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactLoading, setContactLoading] = useState(false);

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

  // Show loading screen while data is being fetched
  if (loading || reviewsLoading) {
    return (
      <LoadingScreen
        message="Loading Dashboard"
        subMessage="Fetching your latest data"
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
                <span className="text-primary">{customerName}</span>
              </h1>
              <p
                className="lead mb-5 rise-up"
                style={{ animationDelay: "0.3s" }}
              >
                Manage your orders, wishlist, reviews, and more. Enjoy your
                personalized PC experience!
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
        <h1 className="mb-4">Customer Dashboard</h1>

        <Row className="g-4 mb-4">
          <Col md={3}>
            <StatCard
              title="Total Orders"
              value={loading ? "..." : stats.totalOrders}
              icon={Cart}
              color="primary"
            />
          </Col>
          <Col md={3}>
            <StatCard
              title="Delivered Orders"
              value={loading ? "..." : stats.deliveredOrders}
              icon={Award}
              color="success"
            />
          </Col>
          <Col md={3}>
            <StatCard
              title="Pending Orders"
              value={loading ? "..." : stats.pendingOrders}
              icon={Cart}
              color="warning"
            />
          </Col>
          <Col md={3}>
            <StatCard
              title="Reviews Written"
              value={loading ? "..." : stats.reviews}
              icon={Star}
              color="info"
            />
          </Col>
        </Row>

        {/* System Reviews Section */}
        <Row className="mt-5">
          <Col>
            <h3 className="mb-4">Customer Reviews</h3>
            {reviewsLoading ? (
              <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading reviews...</span>
                </div>
              </div>
            ) : systemReviews.length > 0 ? (
              <Row className="g-4">
                {systemReviews.map((review) => (
                  <Col key={review.review_id} lg={3} md={6} sm={6} xs={12}>
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
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`me-1 ${
                                    i < review.rating
                                      ? "text-warning"
                                      : "text-muted"
                                  }`}
                                  fill={
                                    i < review.rating ? "currentColor" : "none"
                                  }
                                  size={16}
                                />
                              ))}
                              <span className="ms-2 text-muted small">
                                ({review.rating}/5)
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex-grow-1">
                          <p className="text-muted mb-2 small">
                            {new Date(review.created_at).toLocaleDateString()}
                          </p>
                          <p className="mb-0">{review.comment}</p>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <div className="text-center text-muted">
                <p>No approved system reviews yet.</p>
              </div>
            )}
          </Col>
        </Row>

        {loading && (
          <Row className="mt-4">
            <Col className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading dashboard data...</p>
            </Col>
          </Row>
        )}

        {error && (
          <Row className="mt-4">
            <Col>
              <div
                className={`alert ${
                  error.includes("Access denied")
                    ? "alert-warning"
                    : "alert-danger"
                }`}
                role="alert"
              >
                <div className="d-flex align-items-start">
                  <i
                    className={`bi ${
                      error.includes("Access denied")
                        ? "bi-shield-exclamation"
                        : "bi-exclamation-triangle"
                    } me-2 mt-1`}
                  ></i>
                  <div>
                    <strong>
                      {error.includes("Access denied")
                        ? "Access Restricted"
                        : "Error"}
                    </strong>
                    <p className="mb-0 mt-1">{error}</p>
                    {error.includes("Access denied") && <hr className="my-2" />}
                    {error.includes("Access denied") && (
                      <small className="text-muted">
                        <i className="bi bi-info-circle me-1"></i>
                        To access the customer dashboard, please log out and log
                        in with a customer account.
                      </small>
                    )}
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        )}
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
          <Row className="align-items-stretch" style={{ minHeight: "600px" }}>
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
                    Have questions about our products or services? Fill out the
                    form and our team will get back to you.
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
                            name: contactFirstName + " " + contactLastName,
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
                              borderBottom: "2px solid rgba(255,255,255,0.5)",
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
                            onChange={(e) => setContactLastName(e.target.value)}
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
                          { value: "", label: "Subject" },
                          {
                            value: "Product Inquiry",
                            label: "Product Inquiry",
                          },
                          {
                            value: "Technical Support",
                            label: "Technical Support",
                          },
                          { value: "Order Status", label: "Order Status" },
                          {
                            value: "Returns & Warranty",
                            label: "Returns & Warranty",
                          },
                          { value: "Other", label: "Other" },
                        ]}
                        value={[
                          { value: "", label: "Subject" },
                          {
                            value: "Product Inquiry",
                            label: "Product Inquiry",
                          },
                          {
                            value: "Technical Support",
                            label: "Technical Support",
                          },
                          { value: "Order Status", label: "Order Status" },
                          {
                            value: "Returns & Warranty",
                            label: "Returns & Warranty",
                          },
                          { value: "Other", label: "Other" },
                        ].find((opt) => opt.value === contactSubject)}
                        onChange={(opt) => setContactSubject(opt.value)}
                        placeholder="Subject"
                        styles={{
                          control: (base) => ({
                            ...base,
                            backgroundColor: "transparent",
                            border: "none",
                            borderBottom: "2px solid rgba(255,255,255,0.5)",
                            borderRadius: 0,
                            color: "white",
                            padding: "7px 5px 7px 5px",
                            fontSize: "1.1rem",
                            boxShadow: "none",
                            minHeight: 48,
                          }),
                          menu: (base) => ({
                            ...base,
                            background:
                              "linear-gradient(135deg, #2c3e50 0%, #3b5998 50%, #4a90e2 100%)",
                            color: "#fff",
                            borderRadius: 20,
                            marginTop: 15,
                            zIndex: 9999,
                          }),
                          option: (base, state) => ({
                            ...base,
                            backgroundColor: state.isFocused
                              ? "#1976d2"
                              : "transparent",
                            borderRadius: 22,
                            color: "#fff",
                            fontSize: "1.05rem",
                          }),
                          singleValue: (base) => ({
                            ...base,
                            color: "white",
                          }),
                          placeholder: (base) => ({
                            ...base,
                            color: "rgba(255,255,255,0.7)",
                          }),
                          dropdownIndicator: (base) => ({
                            ...base,
                            color: "white",
                          }),
                          indicatorSeparator: (base) => ({
                            ...base,
                            backgroundColor: "rgba(255,255,255,0.2)",
                          }),
                          input: (base) => ({
                            ...base,
                            color: "white",
                          }),
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
                        onChange={(e) => setContactMessage(e.target.value)}
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
                        e.target.style.boxShadow = "0 8px 25px rgba(0,0,0,0.3)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = "translateY(0)";
                        e.target.style.boxShadow = "0 6px 20px rgba(0,0,0,0.2)";
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

export default CustomerDashboard;
