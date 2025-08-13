import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Signup.css";
import ClearIcon from "@mui/icons-material/Clear";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import registerimg from "../../images/register.png";
import TechnicianInstruction from "../technicianInstruction/TechnicianInstruction";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Button, Modal } from "react-bootstrap";
import PhoneIcon from "@mui/icons-material/Phone";
import providerImg from "../../images/provider_img.jpg";
import TechnicianRegistration from "../technicianRegister/TechnicianRegistration";
import techStyles from "../technicianRegister/TechnicianRegistration.module.css";

const Signup = ({ signupClose, loginClose, setShowTechnicianInstruction }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [openInstruct, setOpenInstruct] = useState(false);
  const [providerData, setProviderData] = useState({});
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [sentOtp, setSentOtp] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [registeringAsTechnician, setRegisteringAsTechnician] = useState(false);
  const [registeringAs, setRegisteringAs] = useState("customer");
  const [experience, setExperience] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [file, setFile] = useState(null);
  const [isTechnician, setIsTechnician] = useState(false);
  const [showTechDetailsForm, setShowTechDetailsForm] = useState(false);
  const [techExperience, setTechExperience] = useState("");
  const [techSpecialization, setTechSpecialization] = useState("");
  const [techCV, setTechCV] = useState(null);

  const districts = [
    "",
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

  const sendOTP = async () => {
    try {
      const res = await axios.post(
        "http://localhost/gearsphere_api/GearSphere-BackEnd/emailValidation.php",
        { email },
        { withCredentials: true } // Essential for session management
      );
      if (res.data.success) {
        toast.success("OTP sent to your email.");
        setOtpModalVisible(true);
      } else {
        toast.error(res.data.message || "Failed to send OTP.");
      }
    } catch (err) {
      console.error("OTP send error:", err);
      toast.error("Error sending OTP.");
    }
  };

  const handleOtpSubmit = async () => {
    try {
      const response = await axios.post(
        "http://localhost/gearsphere_api/GearSphere-BackEnd/verifyOtp.php",
        { otp: enteredOtp },
        { withCredentials: true } // Essential for session management
      );

      if (response.data.success) {
        toast.success("OTP verified successfully.");
        setOtpModalVisible(false);
        if (isTechnician) {
          setOpenInstruct(true);
        } else {
          await registerCustomer();
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      toast.error("OTP verification failed. Please try again.");
    }
  };

  const handleTechnicianAgree = () => {
    setOpenInstruct(false);
    setShowTechDetailsForm(true);
  };

  const handleTechDetailsSubmit = async (e) => {
    e.preventDefault();
    const fullName = `${firstName} ${lastName}`;
    const fullAddress = `${city} | ${district}`;
    const formData = new FormData();
    formData.append("name", fullName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("contact_number", username); // or use a phone field if you have one
    formData.append("address", fullAddress);
    formData.append("userType", "technician");
    formData.append("experience", techExperience);
    formData.append("specialization", techSpecialization);
    if (techCV) formData.append("cv", techCV);
    try {
      const res = await axios.post(
        "http://localhost/gearsphere_api/GearSphere-BackEnd/customersignup.php",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      if (res.data.status === "success") {
        toast.success("Registration successful!");
        setTimeout(() => {
          setShowTechDetailsForm(false);
          if (signupClose) signupClose(false);
          if (loginClose) loginClose(true);
        }, 1500);
      } else {
        toast.error(res.data.message || "Registration failed.");
      }
    } catch (err) {
      if (err.response) {
        toast.error(
          `Server Error: ${err.response.data.message || "Check PHP error log"}`
        );
      } else if (err.request) {
        toast.error(
          "No response from server. Check if PHP backend is running."
        );
      } else {
        toast.error("Request setup error.");
      }
    }
  };

  const registerCustomer = async () => {
    const fullName = `${firstName} ${lastName}`;
    const fullAddress = `${city} | ${district} | ${postalCode}`;

    const formData = new FormData();
    formData.append("name", fullName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("contact_number", contactNumber);
    formData.append("address", fullAddress);
    formData.append("userType", "customer");

    try {
      const response = await axios.post(
        "http://localhost/gearsphere_api/GearSphere-BackEnd/customersignup.php",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      if (response.data.status === "success") {
        toast.success("Registered Successfully, You can login now...");
        setTimeout(() => {
          if (signupClose) signupClose(false);
          if (loginClose) loginClose(true);
        }, 3000);
      } else {
        toast.error(
          response.data.message ||
            "Registration failed. Please check your credentials and try again."
        );
      }
    } catch (error) {
      if (error.response) {
        toast.error(
          `Server Error: ${
            error.response.data.message || "Check PHP error log"
          }`
        );
      } else if (error.request) {
        toast.error(
          "No response from server. Check if PHP backend is running."
        );
      } else {
        toast.error("Customer email already exists.");
      }
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  };

  const registerProvider = async () => {
    const fullName = `${firstName} ${lastName}`;
    const fullAddress = `${city} | ${district} | ${postalCode}`;
    setProviderData({ fullName, fullAddress, email, password });
    setOpenInstruct(true);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (
      !firstName ||
      !lastName ||
      !city ||
      !district ||
      !email ||
      !password ||
      !confirmPassword ||
      !postalCode ||
      !contactNumber
    ) {
      toast.error("All fields are required.");
      return;
    }
    const nameRegex = /^[a-zA-Z]+$/;
    if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
      toast.error("First name and last name should only contain letters.");
      return;
    }
    // Updated email validation to accept all valid email formats including university emails
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
    if (!passwordRegex.test(password)) {
      toast.error(
        "Password must be at least 6 characters long and include at least one uppercase letter, one special character, and one number."
      );
      return;
    }
    await sendOTP();
  };

  const handleTechnicianRegister = async (e) => {
    e.preventDefault();
    setIsTechnician(true);
    // Validate fields (reuse your validation logic from handleProviderRegister)
    if (
      !firstName ||
      !lastName ||
      !city ||
      !district ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      toast.error("Please fill in all fields.");
      return;
    }
    const nameRegex = /^[a-zA-Z]+$/;
    if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
      toast.error("First name and last name should only contain letters.");
      return;
    }
    // Updated email validation to accept all valid email formats including university emails
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
    if (!passwordRegex.test(password)) {
      toast.error(
        "Password must be at least 6 characters long and include at least one uppercase letter, one special character, and one number."
      );
      return;
    }
    await sendOTP();
  };

  // Prevent background scroll when any modal is open
  useEffect(() => {
    const body = document.body;
    const isAnyModalOpen = !openInstruct && !showTechDetailsForm; // Main signup modal is open

    if (
      isAnyModalOpen ||
      openInstruct ||
      showTechDetailsForm ||
      otpModalVisible
    ) {
      const originalStyle = body.style.overflow;
      body.style.overflow = "hidden";
      return () => {
        body.style.overflow = originalStyle;
      };
    }
  }, [openInstruct, showTechDetailsForm, otpModalVisible]);

  return (
    <>
      {/* Only show signup form if instruction popup and tech details form are not open */}
      {!openInstruct && !showTechDetailsForm && (
        <div
          className={techStyles["tech-essential-registration"]}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              if (signupClose) signupClose(false);
            }
          }}
        >
          <div className="signup-container">
            <ClearIcon
              className="cancel-btn"
              onClick={() => {
                signupClose(false);
              }}
            />
            <div className="form">
              <div className="form-section">
                <form onSubmit={handleSignup}>
                  <h2>Sign up</h2>
                  {/* First Name and Last Name */}
                  <div className="input_row">
                    <div className="input_box small_input">
                      <input
                        type="text"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        autoComplete="given-name"
                      />
                      <PersonIcon className="icon" />
                    </div>
                    <div className="input_box small_input">
                      <input
                        type="text"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        autoComplete="family-name"
                      />
                      <PersonIcon className="icon" />
                    </div>
                  </div>
                  {/* Email */}
                  <div className="input_box">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                    />
                    <EmailIcon className="icon" />
                  </div>
                  {/* Phone Number */}
                  <div className="input_box">
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      required
                      autoComplete="tel"
                    />
                    <PhoneIcon className="icon" />
                  </div>
                  {/* City field (in its own row) */}
                  <div className="input_box">
                    <input
                      type="text"
                      placeholder="City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                      autoComplete="address-level2"
                    />
                    <LocationOnIcon className="icon" />
                  </div>

                  {/* District and Postal Code in one row */}
                  <div className="input_row">
                    <div className="input_box small_input">
                      <select
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        required
                      >
                        <option value="">District</option>
                        {districts.map((district, index) => (
                          <option key={index} value={district}>
                            {district}
                          </option>
                        ))}
                      </select>
                      <LocationOnIcon className="icon" />
                    </div>

                    <div className="input_box small_input">
                      <input
                        type="text"
                        placeholder="Postal Code"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        required
                        autoComplete="postal-code"
                      />
                      <LocationOnIcon className="icon" />
                    </div>
                  </div>

                  {/* Password and Confirm Password */}
                  <div className="input_box">
                    <input
                      type="password"
                      placeholder="Create password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                    />
                    <LockIcon className="icon" />
                  </div>
                  <div className="input_box">
                    <input
                      type="password"
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                    />
                    <LockIcon className="icon" />
                  </div>
                  <div className="button-div">
                    <button className="button" type="submit">
                      Register as Customer
                    </button>
                    <button
                      className="button"
                      type="button"
                      onClick={handleTechnicianRegister}
                    >
                      Register as Technician
                    </button>
                  </div>
                  <div className="login_signup">
                    Already have an account?
                    <span
                      onClick={() => {
                        if (signupClose) signupClose(false);
                        if (loginClose) loginClose(true);
                      }}
                    >
                      Login
                    </span>
                  </div>
                </form>
              </div>
              <div className="form-img">
                <img className="register-img" src={registerimg} alt="" />
              </div>
            </div>
          </div>
        </div>
      )}
      {/* OTP Modal */}
      <Modal
        show={otpModalVisible}
        onHide={() => setOtpModalVisible(false)}
        centered
        className="otp-modal-front"
      >
        <Modal.Header closeButton>
          <Modal.Title>OTP Verification</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Please enter the OTP sent to your email:</p>
          <input
            type="text"
            className="form-control"
            placeholder="Enter OTP"
            value={enteredOtp}
            onChange={(e) => setEnteredOtp(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setOtpModalVisible(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleOtpSubmit}>
            Verify OTP
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Technician Instruction Popup */}
      {openInstruct && (
        <TechnicianInstruction
          show={openInstruct}
          onHide={() => setOpenInstruct(false)}
          onAgree={handleTechnicianAgree}
          imgSrc={providerImg}
        />
      )}
      {/* Technician Details Form */}
      {showTechDetailsForm && (
        <Modal
          show={showTechDetailsForm}
          onHide={() => setShowTechDetailsForm(false)}
          size="xl"
          backdrop="static"
          centered
        >
          <TechnicianRegistration
            technicianData={{
              name: `${firstName} ${lastName}`,
              email,
              password,
              contact_number: contactNumber,
              address: `${city} | ${district} | ${postalCode}`,
              userType: "technician",
            }}
            onBack={() => setShowTechDetailsForm(false)}
            onSuccess={() => {
              setShowTechDetailsForm(false);
              if (signupClose) signupClose(false);
              if (loginClose) loginClose(true);
            }}
          />
        </Modal>
      )}
      <ToastContainer />
    </>
  );
};

export default Signup;
