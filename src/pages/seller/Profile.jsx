import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import LoadingScreen from "../../components/loading/LoadingScreen";

const SellerProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    contact_number: "",
    address: "",
    profilePic: "/profile_images/user_image.jpg",
  });
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef();

  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `http://localhost/gearsphere_api/GearSphere-BackEnd/getSeller.php`,
          {
            withCredentials: true,
          }
        );
        const data = response.data;

        if (data) {
          const profilePicUrl = data.profile_image
            ? `http://localhost/gearsphere_api/GearSphere-BackEnd/profile_images/${data.profile_image}`
            : "/profile_images/user_image.jpg";

          setFormData({
            name: data.name || "",
            contact_number: data.contact_number || "",
            address: data.address || "",
            email: data.email || "",
            profilePic: profilePicUrl,
          });

          window.dispatchEvent(new Event("profilePicUpdated"));
        }
      } catch (err) {
        console.error("Fetch failed:", err);
        toast.error("Failed to fetch profile");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSellerData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicFile(file);
      setProfilePicPreview(URL.createObjectURL(file));
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("contact_number", formData.contact_number);
    payload.append("address", formData.address);

    if (profilePicFile) {
      payload.append("profile_image", profilePicFile);
    }

    try {
      const response = await axios.post(
        "http://localhost/gearsphere_api/GearSphere-BackEnd/updateSellerProfile.php",
        payload,
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Profile updated successfully");

        const profileRes = await axios.get(
          `http://localhost/gearsphere_api/GearSphere-BackEnd/getSeller.php`,
          { withCredentials: true }
        );
        const data = profileRes.data;
        const profilePicUrl = data.profile_image
          ? `http://localhost/gearsphere_api/GearSphere-BackEnd/profile_images/${data.profile_image}`
          : "/profile_images/user_image.jpg";

        setFormData((prev) => ({
          ...prev,
          profilePic: profilePicUrl,
        }));
        window.dispatchEvent(new Event("profilePicUpdated"));
        setProfilePicFile(null);
        setProfilePicPreview(null);
      } else {
        toast.error(
          "Update failed: " + (response.data.message || "Unknown error")
        );
      }
    } catch (err) {
      console.error("Update error:", err);
      toast.error("An error occurred during update");
    }
  };

  // Show loading screen while data is being fetched
  if (isLoading) {
    return (
      <LoadingScreen
        message="Loading Seller Profile"
        subMessage="Fetching your seller information"
      />
    );
  }

  return (
    <Container>
      <br />
      <br />
      <br />
      <br />
      <br />
      <div className="profile-border-wrapper">
        <Row>
          <Col md={5}>
            <Card className="shadow-sm">
              <Card.Body className="text-center">
                <img
                  src={formData.profilePic}
                  alt="Profile"
                  className="rounded-circle mb-3"
                  style={{
                    width: "120px",
                    height: "120px",
                    objectFit: "cover",
                  }}
                />
                <h5>{formData.name}</h5>
                <p>
                  <b>Email:</b> {formData.email}
                </p>
                <p>
                  <b>Contact:</b> {formData.contact_number}
                </p>
                <p>
                  <b>Address:</b> {formData.address}
                </p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={7} className="border rounded p-4 shadow-sm bg-white">
            <h1 className="text-center mb-5">My Profile</h1>
            <div className="text-center mb-4">
              <img
                src={profilePicPreview || formData.profilePic}
                alt="Profile"
                className="rounded-circle mb-3"
                style={{ width: "150px", height: "150px", objectFit: "cover" }}
              />
              <div>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  ref={fileInputRef}
                  onChange={handleProfilePicChange}
                  autoComplete="off"
                />
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => fileInputRef.current.click()}
                >
                  Change Photo
                </Button>
              </div>
              <h5 className="mt-3">{formData.name}</h5>
              <p className="text-muted">Seller</p>
            </div>

            <Form onSubmit={handleProfileUpdate}>
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  autoComplete="name"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Contact Number</Form.Label>
                <Form.Control
                  type="tel"
                  name="contact_number"
                  value={formData.contact_number}
                  onChange={handleInputChange}
                  placeholder="07X XXX XXXX"
                  pattern="0[0-9]{9}"
                  title="Enter a valid Sri Lankan phone number"
                  autoComplete="tel"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="e.g., Point Pedro | Jaffna"
                  autoComplete="street-address"
                />
              </Form.Group>

              <Button variant="primary" type="submit">
                Update Profile
              </Button>
            </Form>
          </Col>
        </Row>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .profile-border-wrapper {
          border: 1.5px solid #dee2e6;
          border-radius: 18px;
          padding: 2rem 1.5rem;
          background: #fff;
          box-shadow: 0 2px 12px rgba(0,0,0,0.03);
          margin-bottom: 2rem;
        }
      `,
        }}
      />
      <ToastContainer position="top-right" autoClose={3000} />
    </Container>
  );
};

export default SellerProfile;
