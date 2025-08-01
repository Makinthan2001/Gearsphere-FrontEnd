import React, { useState, useEffect } from "react";
import { Navbar, Container, Nav, Button, Modal } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Bell } from "react-bootstrap-icons";
import axios from "axios";
import TechnicianNotification from "../technician/notification/TechnicianNotification";
import { useRef } from "react";

function TechnicianNavbar({ fixed = "top" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [technicianData, setTechnicianData] = useState({
    name: "",
    profile_image: "/profile_images/user_image.jpg",
  });
  const [showNotif, setShowNotif] = useState(false);
  const [notifCount, setNotifCount] = useState(0);
  const bellRef = useRef(null);

  useEffect(() => {
    const fetchTechnicianData = async () => {
      try {
        // Get session data from backend
        const sessionResponse = await axios.get(
          "http://localhost/gearsphere_api/GearSphere-BackEnd/getSession.php",
          { withCredentials: true }
        );

        if (
          !sessionResponse.data.success ||
          !sessionResponse.data.technician_id
        ) {
          return;
        }

        const technicianId = sessionResponse.data.technician_id;

        // Step 2: Get technician details by technician_id
        const response = await axios.get(
          `http://localhost/gearsphere_api/GearSphere-BackEnd/getTechnicianDetail.php?technician_id=${technicianId}`,
          { withCredentials: true }
        );
        const data = response.data;

        if (data && data.success && data.technician) {
          const profilePicUrl = data.technician.profile_image
            ? `http://localhost/gearsphere_api/GearSphere-BackEnd/profile_images/${data.technician.profile_image}`
            : "/profile_images/user_image.jpg";

          setTechnicianData({
            name: data.technician.name || "",
            profile_image: profilePicUrl,
          });
        }
      } catch (err) {
        console.error("Failed to fetch technician data:", err);
      }
    };

    fetchTechnicianData();

    // Listen for profile updates
    const handleProfileUpdate = () => {
      fetchTechnicianData();
    };

    window.addEventListener("profilePicUpdated", handleProfileUpdate);
    return () =>
      window.removeEventListener("profilePicUpdated", handleProfileUpdate);
  }, []);

  useEffect(() => {
    const fetchNotifCount = async () => {
      try {
        // Get session data from backend
        const sessionResponse = await axios.get(
          "http://localhost/gearsphere_api/GearSphere-BackEnd/getSession.php",
          { withCredentials: true }
        );

        if (!sessionResponse.data.success || !sessionResponse.data.user_id) {
          return;
        }

        const userId = sessionResponse.data.user_id;

        const res = await axios.get(
          `http://localhost/gearsphere_api/GearSphere-BackEnd/getSellerNotification.php?user_id=${userId}&count=1`,
          { withCredentials: true }
        );
        setNotifCount(res.data.count || 0);
      } catch (err) {
        setNotifCount(0);
      }
    };
    fetchNotifCount();
    const interval = setInterval(fetchNotifCount, 10000); // Poll every 10s
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

      // Call backend logout endpoint
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
            to="/technician/dashboard"
            onClick={() => setExpanded(false)}
          >
            <img
              src="/src/images/logo.PNG"
              alt="GearSphere Logo"
              style={{ height: "70px", width: "80px", marginRight: 8 }}
            />
            <span className="fw-bold">GearSphere</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="technician-navbar-nav" />
          <Navbar.Collapse id="technician-navbar-nav">
            {/* Monitoring Mode Indicator */}
            {sessionStorage.getItem("monitoring_mode") === "true" && (
              <div
                className="alert alert-warning py-1 px-2 mb-0 me-3"
                style={{ fontSize: "0.8rem" }}
              >
                <strong>Monitoring Mode:</strong> Viewing as Technician
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
                to="/technician/dashboard"
                onClick={() => setExpanded(false)}
                className={
                  location.pathname === "/technician/dashboard"
                    ? "text-primary fw-bold"
                    : ""
                }
              >
                Dashboard
              </Nav.Link>

              <Nav.Link
                as={Link}
                to="/technician/build-requests"
                onClick={() => setExpanded(false)}
                className={
                  location.pathname === "/technician/build-requests"
                    ? "text-primary fw-bold"
                    : ""
                }
              >
                Build Requests
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/technician/reviews"
                onClick={() => setExpanded(false)}
                className={
                  location.pathname === "/technician/reviews"
                    ? "text-primary fw-bold"
                    : ""
                }
              >
                Reviews
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
              <TechnicianNotification
                show={showNotif}
                target={bellRef.current}
                onHide={() => setShowNotif(false)}
              />
              <Nav.Link
                as={Link}
                to="/technician/profile"
                className="d-flex align-items-center p-0 ms-2"
              >
                <img
                  src={technicianData.profile_image}
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

export default TechnicianNavbar;
