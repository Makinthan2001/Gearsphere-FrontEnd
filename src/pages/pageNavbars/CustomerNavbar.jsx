import React, { useState, useContext, useEffect, useRef } from "react";
import {
  Navbar,
  Container,
  Nav,
  Button,
  Modal,
  Badge,
  ListGroup,
  Form,
} from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Bell, Cart } from "react-bootstrap-icons";
import { CartContext } from "../customer/CartContext";
import Checkout from "../customer/Checkout";
import axios from "axios";
import CustomerNotification from "../customer/notification/CustomerNotification";

function CustomerNavbar({ fixed = "top" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [customerData, setCustomerData] = useState({
    name: "",
    profile_image: "/profile_images/user_image.jpg",
  });
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    getCartCount,
  } = useContext(CartContext);
  const [showNotif, setShowNotif] = useState(false);
  const [notifCount, setNotifCount] = useState(0);
  const bellRef = useRef(null);

  const formatLKR = (amount) => "LKR " + Number(amount).toLocaleString("en-LK");

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const response = await axios.get(
          `http://localhost/gearsphere_api/GearSphere-BackEnd/getCustomer.php`,
          {
            withCredentials: true, // Use backend session
          }
        );
        const data = response.data;

        if (data) {
          const profilePicUrl = data.profile_image
            ? `http://localhost/gearsphere_api/GearSphere-BackEnd/profile_images/${data.profile_image}`
            : "/profile_images/user_image.jpg";

          setCustomerData({
            name: data.name || "",
            profile_image: profilePicUrl,
          });
        }
      } catch (err) {
        console.error("Failed to fetch customer data:", err);
      }
    };

    fetchCustomerData();

    // Listen for profile updates
    const handleProfileUpdate = () => {
      fetchCustomerData();
    };

    window.addEventListener("profilePicUpdated", handleProfileUpdate);
    return () =>
      window.removeEventListener("profilePicUpdated", handleProfileUpdate);
  }, []);

  useEffect(() => {
    const fetchNotifCount = async () => {
      try {
        // Get session first to get user_id
        const sessionRes = await axios.get(
          "http://localhost/gearsphere_api/GearSphere-BackEnd/getSession.php",
          { withCredentials: true }
        );

        if (!sessionRes.data.success) return;

        const res = await axios.get(
          `http://localhost/gearsphere_api/GearSphere-BackEnd/getCustomerNotification.php?user_id=${sessionRes.data.user_id}&count=1`,
          { withCredentials: true }
        );
        setNotifCount(res.data.count || 0);
      } catch (err) {
        setNotifCount(0);
      }
    };
    fetchNotifCount();
    const interval = setInterval(fetchNotifCount, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      // Log session storage before clearing
      console.log("Session storage before logout:", {
        user_type: sessionStorage.getItem("user_type"),
        pcbuilder_components: sessionStorage.getItem(
          "pcbuilder_selected_components"
        ),
        selected_cpu: sessionStorage.getItem("selected_cpu"),
        monitoring_mode: sessionStorage.getItem("monitoring_mode"),
        totalItems: sessionStorage.length,
      });

      await axios.post(
        "http://localhost/gearsphere_api/GearSphere-BackEnd/logout.php",
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear frontend session storage
      sessionStorage.removeItem("user_type");
      sessionStorage.removeItem("just_logged_in");
      sessionStorage.setItem("just_logged_out", "true");
      sessionStorage.setItem("logout_timestamp", Date.now().toString());

      // Clear any monitoring mode flags
      sessionStorage.removeItem("monitoring_mode");
      sessionStorage.removeItem("original_user_type");
      sessionStorage.removeItem("original_user_id");

      // Clear PC Builder related session storage
      sessionStorage.removeItem("pcbuilder_selected_components");
      sessionStorage.removeItem("selected_cpu");
      sessionStorage.removeItem("selected_gpu");
      sessionStorage.removeItem("selected_motherboard");
      sessionStorage.removeItem("selected_memory");
      sessionStorage.removeItem("selected_storage");
      sessionStorage.removeItem("selected_powersupply");
      sessionStorage.removeItem("selected_case");
      sessionStorage.removeItem("selected_cpucooler");
      sessionStorage.removeItem("selected_monitor");
      sessionStorage.removeItem("selected_operatingsystem");

      // Clear comparison selection storage
      sessionStorage.removeItem("cpu_compareSelection");
      sessionStorage.removeItem("gpu_compareSelection");
      sessionStorage.removeItem("motherboard_compareSelection");
      sessionStorage.removeItem("memory_compareSelection");
      sessionStorage.removeItem("storage_compareSelection");
      sessionStorage.removeItem("powersupply_compareSelection");
      sessionStorage.removeItem("case_compareSelection");
      sessionStorage.removeItem("cpucooler_compareSelection");
      sessionStorage.removeItem("monitor_compareSelection");
      sessionStorage.removeItem("operatingsystem_compareSelection");

      // Verify session storage is cleared
      console.log("Session storage after clearing:", {
        user_type: sessionStorage.getItem("user_type"),
        pcbuilder_components: sessionStorage.getItem(
          "pcbuilder_selected_components"
        ),
        selected_cpu: sessionStorage.getItem("selected_cpu"),
        monitoring_mode: sessionStorage.getItem("monitoring_mode"),
        just_logged_out: sessionStorage.getItem("just_logged_out"),
        totalItems: sessionStorage.length,
        allKeys: Object.keys(sessionStorage),
      });

      // Additional verification - list all remaining items
      const remainingItems = {};
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        remainingItems[key] = sessionStorage.getItem(key);
      }
      console.log("All remaining session storage items:", remainingItems);

      // Navigate to home and reload to ensure clean state
      navigate("/", { replace: true });
      window.location.reload();
    }
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleProceedToCheckout = () => {
    setShowCartModal(false);
    setShowCheckoutModal(true);
  };

  return (
    <>
      <Navbar
        bg="light"
        expand="lg"
        className=""
        fixed={fixed}
        expanded={expanded}
        onToggle={setExpanded}
        style={{ borderBottom: "none" }}
      >
        <Container>
          <Navbar.Brand
            as={Link}
            to="/customer/dashboard"
            onClick={() => setExpanded(false)}
          >
            <img
              src="/src/images/logo.PNG"
              alt="GearSphere Logo"
              style={{ height: "70px", width: "80px", marginRight: 8 }}
            />
            <span className="fw-bold">GearSphere</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="customer-navbar-nav" />
          <Navbar.Collapse id="customer-navbar-nav">
            {/* Monitoring Mode Indicator */}
            {sessionStorage.getItem("monitoring_mode") === "true" && (
              <div
                className="alert alert-warning py-1 px-2 mb-0 me-3"
                style={{ fontSize: "0.8rem" }}
              >
                <strong>Monitoring Mode:</strong> Viewing as Customer
                <Button
                  size="sm"
                  variant="outline-primary"
                  className="ms-2"
                  onClick={() => {
                    const originalUserType =
                      sessionStorage.getItem("original_user_type");
                    sessionStorage.removeItem("monitoring_mode");
                    sessionStorage.removeItem("original_user_type");
                    sessionStorage.removeItem("original_user_id");

                    if (originalUserType === "admin") {
                      navigate("/admin");
                    } else {
                      navigate("/seller/dashboard");
                    }
                  }}
                >
                  Back to{" "}
                  {sessionStorage.getItem("original_user_type") === "admin"
                    ? "Admin"
                    : "Seller"}
                </Button>
              </div>
            )}
            <Nav className="me-auto">
              <Nav.Link
                as={Link}
                to="/customer/dashboard"
                onClick={() => setExpanded(false)}
                className={
                  location.pathname === "/customer/dashboard"
                    ? "text-primary fw-bold"
                    : ""
                }
              >
                Dashboard
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/marketplace"
                onClick={() => setExpanded(false)}
                className={
                  location.pathname === "/marketplace"
                    ? "text-primary fw-bold"
                    : ""
                }
              >
                Marketplace
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/pc-builder"
                onClick={() => setExpanded(false)}
                className={
                  location.pathname === "/pc-builder"
                    ? "text-primary fw-bold"
                    : ""
                }
              >
                PC Builder
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/orders"
                onClick={() => setExpanded(false)}
                className={
                  location.pathname === "/orders" ? "text-primary fw-bold" : ""
                }
              >
                My Orders
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/customer/reviews"
                onClick={() => setExpanded(false)}
                className={
                  location.pathname === "/customer/reviews"
                    ? "text-primary fw-bold"
                    : ""
                }
              >
                My Reviews
              </Nav.Link>
            </Nav>
            <div className="d-flex align-items-center">
              <div style={{ position: "relative", display: "inline-block" }}>
                <Bell
                  ref={bellRef}
                  size={22}
                  className="me-3 cursor-pointer text-secondary"
                  style={{ verticalAlign: "middle" }}
                  onClick={() => setShowNotif((prev) => !prev)}
                />
                {notifCount > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: -4,
                      right: 2,
                      background: "red",
                      color: "white",
                      borderRadius: "50%",
                      padding: "2px 7px",
                      fontSize: 12,
                      fontWeight: 700,
                      zIndex: 2,
                    }}
                  >
                    {notifCount}
                  </span>
                )}
              </div>
              <CustomerNotification
                show={showNotif}
                target={bellRef.current}
                onHide={() => setShowNotif(false)}
              />
              <div className="position-relative me-3">
                <Cart
                  size={22}
                  className="cursor-pointer text-secondary"
                  style={{ verticalAlign: "middle" }}
                  onClick={() => setShowCartModal(true)}
                />
                {getCartCount() > 0 && (
                  <Badge
                    bg="danger"
                    className="position-absolute top-0 start-100 translate-middle"
                    style={{ fontSize: "0.7rem" }}
                  >
                    {getCartCount()}
                  </Badge>
                )}
              </div>
              <Nav.Link
                as={Link}
                to="/profile"
                className="d-flex align-items-center p-0 ms-2"
              >
                <img
                  src={customerData.profile_image}
                  alt="Profile"
                  className="rounded-circle"
                  style={{
                    width: 40,
                    height: 40,
                    objectFit: "cover",
                    border: "2px solid #4361ee",
                  }}
                />
              </Nav.Link>
              <Button
                variant="outline-danger"
                onClick={() => setShowLogoutModal(true)}
                className="ms-3"
              >
                Logout
              </Button>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Cart Modal */}
      <Modal
        show={showCartModal}
        onHide={() => setShowCartModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Shopping Cart ({getCartCount()} items)</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {cartItems.length === 0 ? (
            <div className="text-center py-4">
              <Cart size={48} className="text-muted mb-3" />
              <h5 className="text-muted">Your cart is empty</h5>
              <p className="text-muted">
                Add some products from the marketplace to get started!
              </p>
            </div>
          ) : (
            <>
              <ListGroup variant="flush">
                {cartItems.map((item) => (
                  <ListGroup.Item
                    key={item.id}
                    className="d-flex align-items-center"
                  >
                    <img
                      src={
                        item.image_url || "/placeholder.svg?height=60&width=60"
                      }
                      alt={item.name}
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                      }}
                      className="rounded me-3"
                    />
                    <div className="flex-grow-1">
                      <h6 className="mb-1">{item.name}</h6>
                      <p className="text-muted mb-1">{item.category}</p>
                      <p className="text-primary mb-0 fw-bold">
                        {formatLKR(item.price)}
                      </p>
                    </div>
                    <div className="d-flex align-items-center">
                      <Form.Control
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(
                            item.id,
                            parseInt(e.target.value) || 0
                          )
                        }
                        style={{ width: "70px" }}
                        className="me-2"
                      />
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <div className="border-top pt-3 mt-3">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Total:</h5>
                  <h5 className="mb-0 text-primary">
                    {formatLKR(getCartTotal())}
                  </h5>
                </div>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCartModal(false)}>
            Continue Shopping
          </Button>
          {cartItems.length > 0 && (
            <Button variant="primary" onClick={handleProceedToCheckout}>
              Proceed to Checkout
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      {/* Checkout Modal */}
      <Checkout
        show={showCheckoutModal}
        onHide={() => setShowCheckoutModal(false)}
      />

      {/* Logout Confirmation Modal */}
      <Modal
        show={showLogoutModal}
        onHide={() => setShowLogoutModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to logout?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLogoutModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleLogout}>
            Logout
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CustomerNavbar;
