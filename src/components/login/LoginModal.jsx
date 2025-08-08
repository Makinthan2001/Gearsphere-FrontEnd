import { useState, useEffect } from "react";
import { Modal, Button, Form, Alert, InputGroup } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import loginImage from "../../images/login.jpg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./loginmodal.css";
import axios from "axios";

function LoginModal({ show, onHide, switchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [checkOTP, setCheckOTP] = useState("");
  const [step, setStep] = useState(1);
  const location = useLocation();
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 992);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 992);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  //Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    // Updated email validation to accept all valid email formats including university emails
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost/gearsphere_api/GearSphere-BackEnd/login.php",
        {
          email,
          password,
        },
        {
          withCredentials: true, // Important for session cookies
        }
      );
      console.log(response.data);
      if (response.data.success) {
        const { user_type } = response.data;

        toast.success(response.data.message, { autoClose: 1000 });

        // Close modal immediately
        onHide();

        // Store user type in session storage for navigation control
        sessionStorage.setItem("user_type", user_type);
        sessionStorage.setItem("just_logged_in", "true");
        sessionStorage.removeItem("just_logged_out");
        sessionStorage.removeItem("logout_timestamp");

        // Navigate based on user type - backend session handles authentication
        console.log("Navigating for user_type:", user_type.toLowerCase());
        if (user_type.toLowerCase() === "admin") {
          console.log("Navigating to admin dashboard");
          navigate("/admin", { replace: true });
        } else if (user_type.toLowerCase() === "customer") {
          console.log("Navigating to customer dashboard");
          navigate("/customer/dashboard", { replace: true });
        } else if (user_type.toLowerCase() === "technician") {
          console.log("Navigating to technician dashboard");
          navigate("/technician/dashboard", { replace: true });
        } else if (user_type.toLowerCase() === "seller") {
          console.log("Navigating to seller dashboard");
          navigate("/seller", { replace: true });
        } else {
          console.log("Unknown user type:", user_type);
        }

        // Prevent back navigation to home/login pages after login
        setTimeout(() => {
          // Clear the just_logged_in flag after navigation is complete
          sessionStorage.removeItem("just_logged_in");

          window.history.replaceState(null, null, window.location.href);

          // Additional protection against back navigation
          const preventBack = (event) => {
            const userType = sessionStorage.getItem("user_type");
            if (userType && window.location.pathname === "/") {
              event.preventDefault();
              const dashboardMap = {
                admin: "/admin",
                customer: "/customer/dashboard",
                seller: "/seller",
                technician: "/technician/dashboard",
              };
              const dashboardPath = dashboardMap[userType.toLowerCase()];
              if (dashboardPath) {
                navigate(dashboardPath, { replace: true });
              }
            }
          };

          window.addEventListener("popstate", preventBack);

          // Clean up after 30 seconds to avoid memory leaks
          setTimeout(() => {
            window.removeEventListener("popstate", preventBack);
          }, 30000);
        }, 500);
      } else if (response.data.message) {
        toast.error(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data) {
        toast.error(error.response.data.message);
      } else if (error.message) {
        toast.error("Login failed: " + error.message);
      } else {
        toast.error("Login failed. Try again..");
      }
    }
  };

  // Handle forgot password
  const handleForgotPassword = async () => {
    // Updated email validation to accept all valid email formats including university emails
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(forgotPasswordEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    try {
      if (step === 1) {
        const response = await axios.post(
          "http://localhost/gearsphere_api/GearSphere-BackEnd/generateOTP.php",
          {
            email: forgotPasswordEmail.trim(), //username: forgotPasswordUsername,
          }
        );
        // console.log(response.data)
        if (response.data.success) {
          toast.success(response.data.message);
          setCheckOTP(response.data.otp);
          //console.log(response.data.otp);
          setStep(2);
        } else {
          toast.error(response.data.message);
        }
      } else if (step === 2) {
        //console.log(otp);
        if (otp.trim() === checkOTP.toString().trim()) {
          toast.success("OTP verified successfully...");
          setCheckOTP("");
          setStep(3);
        } else {
          toast.error("Invalid OTP, Try again later...");
          setStep(1);
        }
      } else if (step === 3) {
        if (newPassword !== confirmPassword) {
          toast.error("Passwords do not match.");
          return;
        }

        const passwordRegex =
          /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;

        if (!passwordRegex.test(newPassword)) {
          toast.error(
            "Password must be at least 6 characters long and include at least one uppercase letter, one special character, and one number."
          );
          return;
        }

        const response = await axios.post(
          "http://localhost/gearsphere_api/GearSphere-BackEnd/changePassword.php",
          {
            email: forgotPasswordEmail,
            new_password: newPassword,
          }
        );
        console.log("Change Password Response:", response.data);
        if (response.data.success) {
          toast.success(response.data.message);
          setTimeout(() => {
            setShowForgotModal(false);
          }, 1000);
        } else {
          toast.error(response.data.message);
          setTimeout(() => {
            setShowForgotModal(false);
          }, 1000);
        }
      }
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Password reset failed.");
      }
    }
  };

  return (
    <>
      {/* Show login modal only if not in forgot password flow */}
      {/* Custom backdrop for blur */}
      {(show && !showForgotModal) && (
        <div className="custom-login-backdrop" />
      )}
      <Modal
        show={show && !showForgotModal}
        onHide={onHide}
        dialogClassName={`modal-dialog-centered custom-login-modal${
          isLargeScreen ? " modal-lg" : ""
        }`}
      >
        <div className="modal-content">
          <Modal.Body className="p-0">
            <div className="row g-0">
              {/* Hide image on small screens, show on md+ */}
              <div className="col-md-6 d-none d-md-block">
                <img
                  src={loginImage}
                  alt="Login Visual"
                  className="img-fluid rounded-start"
                  style={{ height: "100%", objectFit: "cover" }}
                />
              </div>
              {/* Form always visible, full width on small screens */}
              <div className="col-12 col-md-6 p-4">
                <Modal.Header closeButton className="border-0 pb-0" />
                <Modal.Title className="mb-3">Login to GearSphere</Modal.Title>
                <Form onSubmit={handleLogin}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      size="sm"
                      autoComplete="email"
                    />
                  </Form.Group>
                  <Form.Group className="mb-4">
                    <Form.Label>Password</Form.Label>
                    <InputGroup size="sm">
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={() => setShowPassword((prev) => !prev)}
                        tabIndex={-1}
                        style={{ borderLeft: 0 }}
                        size="sm"
                      >
                        {showPassword ? <BsEyeSlash /> : <BsEye />}
                      </Button>
                    </InputGroup>
                  </Form.Group>
                  <div className="d-flex justify-content-end align-items-center mb-3">
                    <a href="#" onClick={() => setShowForgotModal(true)}>
                      Forgot password?
                    </a>
                  </div>
                  <Button type="submit" className="w-100 btn-sm" size="sm">
                    Login
                  </Button>
                </Form>
                <div className="text-center mt-3">
                  <span>Don't have an account? </span>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onHide();
                      switchToRegister();
                    }}
                  >
                    Register
                  </a>
                </div>
              </div>
            </div>
          </Modal.Body>
        </div>
      </Modal>

      <Modal
        show={showForgotModal}
        onHide={() => setShowForgotModal(false)}
        className="forgot-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Reset Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {step === 1 && (
              <>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    required
                  />
                </Form.Group>
              </>
            )}

            {step === 2 && (
              <Form.Group controlId="formOtp">
                <Form.Label>OTP</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter the OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </Form.Group>
            )}

            {step === 3 && (
              <>
                <Form.Group controlId="formBasicPassword">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formConfirmPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </Form.Group>
              </>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowForgotModal(false)}>
            close
          </Button>
          <Button variant="primary" onClick={handleForgotPassword}>
            {step === 1
              ? "Send OTP"
              : step === 2
              ? "Verify OTP"
              : "Reset Password"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default LoginModal;
