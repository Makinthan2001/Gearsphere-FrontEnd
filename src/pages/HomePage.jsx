import React, { useState, useEffect } from "react";
import Select from "react-select";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Badge,
  Carousel,
  Navbar,
  Nav,
  Accordion,
  Form,
  InputGroup,
} from "react-bootstrap";
import {
  Cpu,
  People,
  Lightning,
  Shield,
  ChevronRight,
  Star,
  Grid3x3Gap,
  Tools,
  Award,
  Wrench,
  Headset,
  Search,
  Filter,
  SortDown,
  StarFill,
  Envelope,
  Telephone,
  GeoAlt,
  Clock,
  Person,
  Display,
  Motherboard,
  Memory,
  Hdd,
  Power,
  PcDisplay,
  Fan,
  PersonCheck,
  Cart,
  CameraVideo,
  Mic,
  Printer,
  BatteryFull,
  Wifi,
  Tablet,
  Camera,
  CameraReels,
  ChevronLeft,
} from "react-bootstrap-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles.css";
import LoginModal from "../components/login/LoginModal";
import Signup from "../components/signup/Signup";
import Footer from "../components/footer/Footer";
import pcGif from "../images/pc_video1.gif";
import { Link, useNavigate } from "react-router-dom";
import sivatheevanImg from "../images/sivatheevan.png";
import makinthanImg from "../images/makinthan.png";
import pugazhImg from "../images/pugazh.png";
import kowsiImg from "../images/kowsi.png";
import gif1 from "../images/download.jpg";
import profile1 from "../images/profile/pp1.png";
import profile2 from "../images/profile/pp2.png";
import profile3 from "../images/profile/pp3.jpg";
import profile4 from "../images/profile/pp4.jpg";
import profile5 from "../images/profile/pp5.jpg";
import profile6 from "../images/profile/pp6.jpg";
import pcpic1 from "../images/pcpic1.png";
import pcpic2 from "../images/pcpic2.jpeg";
import pcpic3 from "../images/pcpic3.jpg";
import aboutus from "../images/aboutus2.png";
import serviceimg from "../images/services1.png";
import gearSphereLogo from "../images/logo.PNG";
import { toast } from "react-toastify";
import axios from "axios";
import LoadingScreen from "../components/loading/LoadingScreen";

const ourValuesCardHoverStyle = `
.our-values-card {
  transition: box-shadow 0.3s, transform 0.3s;
}
.our-values-card:hover {
  box-shadow: 0 8px 32px rgba(67,97,238,0.18), 0 1.5px 8px rgba(0,0,0,0.10);
  transform: translateY(-6px) scale(1.04);
  background: rgba(255,255,255,0.95);
}
`;

const serviceCardBorderStyle = `
.service-card.modern-border {
  position: relative;
  background: white;
  border: none;
  border-radius: 1.25rem;
  overflow: visible;
  z-index: 1;
}
.service-card.modern-border::before {
  content: '';
  position: absolute;
  top: -3px; left: -3px; right: -3px; bottom: -3px;
  z-index: 0;
  border-radius: 1.35rem;
  background: linear-gradient(135deg, #4361ee, #00b894, #fd7e14, #6c5ce7);
  background-size: 300% 300%;
  animation: borderGradientMove 6s ease infinite;
}
@keyframes borderGradientMove {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
.service-card.modern-border > .card-body {
  position: relative;
  z-index: 1;
  background: white;
  border-radius: 1.1rem;
}
`;

const productSliderStyle = `
.product-slider-row {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 8px;
  position: relative;
  scrollbar-width: thin;
  scrollbar-color: #4361ee #f1f1f1;
}
.product-slider-row::-webkit-scrollbar {
  height: 10px;
}
.product-slider-row::-webkit-scrollbar-thumb {
  background: #4361ee;
  border-radius: 5px;
}
.product-slider-row::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 5px;
}
.product-slider-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  background: #fff;
  border: 1px solid #4361ee;
  color: #4361ee;
  border-radius: 50%;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(67,97,238,0.08);
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.product-slider-arrow:hover {
  background: #4361ee;
  color: #fff;
}
.product-slider-arrow.left { left: -18px; }
.product-slider-arrow.right { right: -18px; }
`;

// Loading animation styles
const loadingAnimationStyle = `
.loading-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  z-index: 9999;
}

.loading-text {
  color: #333333;
  font-size: 18px;
  font-weight: 500;
  text-align: center;
  margin-bottom: 10px;
}

.loading-subtext {
  color: #666666;
  font-size: 14px;
  text-align: center;
}

.loading-dots {
  display: inline-block;
  animation: loadingDots 1.5s infinite;
}

@keyframes loadingDots {
  0%, 20% { content: ''; }
  40% { content: '.'; }
  60% { content: '..'; }
  80%, 100% { content: '...'; }
}

.gear-icon-animation {
  width: 120px;
  height: 120px;
  margin-bottom: 30px;
  animation: logoFloat 3s ease-in-out infinite;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.logo-glow {
  filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.5));
}

@keyframes logoFloat {
  0%, 100% { 
    transform: translateY(0px) scale(1);
    filter: drop-shadow(0 5px 15px rgba(0, 0, 0, 0.1));
  }
  50% { 
    transform: translateY(-10px) scale(1.05);
    filter: drop-shadow(0 10px 25px rgba(0, 0, 0, 0.2));
  }
}
`;

const contactSectionStyles = `
.contact-input-underline::placeholder {
  color: rgba(255, 255, 255, 0.7) !important;
}
.contact-input-underline:focus {
  background-color: transparent !important;
  border-bottom: 2px solid white !important;
  box-shadow: none !important;
  color: white !important;
  outline: none !important;
}
.contact-input-underline option {
  background-color: white !important;
  color: #333 !important;
}
.contact-info-box:hover {
  transform: translateY(-12px) scale(1.03);
  box-shadow: 0 25px 60px rgba(0,0,0,0.15);
}
.contact-info-item {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.contact-info-item:hover {
  transform: translateX(15px);
}
.contact-info-item:hover .contact-icon {
  background-color: #e3f2fd !important;
  transform: scale(1.15) rotate(5deg);
  border-color: #4a90e2 !important;
}
.contact-info-item:hover .contact-icon svg {
  color: #4a90e2 !important;
}
`;

function HomePage() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [reviewFilterVisible, setReviewFilterVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [priceRange, setPriceRange] = useState("All Prices");
  const [cpu, setCpu] = useState("All CPUs");
  const [gpu, setGpu] = useState("All GPUs");
  const [sortBy, setSortBy] = useState("Featured");
  const [partType, setPartType] = useState("All");
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  // Contact form state
  const [contactFirstName, setContactFirstName] = useState("");
  const [contactLastName, setContactLastName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactSubject, setContactSubject] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactLoading, setContactLoading] = useState(false);

  // System reviews state
  const [systemReviews, setSystemReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  // Main page loading state
  const [isLoading, setIsLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    // Enhanced session checking with immediate redirect for authenticated users
    const checkSessionAndRedirect = async () => {
      const userType = sessionStorage.getItem("user_type");
      const justLoggedOut = sessionStorage.getItem("just_logged_out");
      const justLoggedIn = sessionStorage.getItem("just_logged_in");

      // Don't redirect if user just logged out (allow them to stay on home)
      if (justLoggedOut) {
        // Clear the flag after a short delay
        setTimeout(() => {
          sessionStorage.removeItem("just_logged_out");
          sessionStorage.removeItem("logout_timestamp");
        }, 2000);
        return;
      }

      // If user has active session, immediately redirect them (regardless of justLoggedIn flag)
      if (userType) {
        try {
          // Verify session with backend
          const response = await fetch(
            "http://localhost/gearsphere_api/GearSphere-BackEnd/getSession.php",
            {
              method: "GET",
              credentials: "include",
            }
          );

          if (response.ok) {
            const sessionData = await response.json();
            if (sessionData.success) {
              const type = userType.toLowerCase();
              console.log(
                "🔒 Authenticated user detected on home page. Redirecting to dashboard for:",
                type
              );

              // Use replace: true to prevent going back to home page
              if (type === "admin") {
                navigate("/admin", { replace: true });
              } else if (type === "customer") {
                navigate("/customer/dashboard", { replace: true });
              } else if (type === "seller") {
                navigate("/seller", { replace: true });
              } else if (type === "technician") {
                navigate("/technician/dashboard", { replace: true });
              }

              // Additional history manipulation to ensure they can't go back
              window.history.replaceState(null, null, window.location.href);
            } else {
              // Session invalid, clear storage
              sessionStorage.removeItem("user_type");
              console.log("❌ Invalid session, cleared user_type");
            }
          } else {
            // Session check failed, clear storage
            sessionStorage.removeItem("user_type");
            console.log("❌ Session check failed, cleared user_type");
          }
        } catch (error) {
          console.error("Session verification failed:", error);
          // On error, clear potentially stale session data
          sessionStorage.removeItem("user_type");
        }
      }

      // Clear just_logged_in flag after processing
      if (justLoggedIn) {
        sessionStorage.removeItem("just_logged_in");
      }
    };

    // Run immediately on component mount
    checkSessionAndRedirect();
  }, [navigate]);

  // Additional effect to handle browser back button navigation to home page
  useEffect(() => {
    const handleVisibilityChange = () => {
      // When page becomes visible, check if user is authenticated
      if (!document.hidden) {
        const userType = sessionStorage.getItem("user_type");
        const justLoggedOut = sessionStorage.getItem("just_logged_out");

        if (userType && !justLoggedOut) {
          console.log(
            "🔄 Page focus detected with active session, redirecting..."
          );
          const type = userType.toLowerCase();

          if (type === "admin") {
            navigate("/admin", { replace: true });
          } else if (type === "customer") {
            navigate("/customer/dashboard", { replace: true });
          } else if (type === "seller") {
            navigate("/seller", { replace: true });
          } else if (type === "technician") {
            navigate("/technician/dashboard", { replace: true });
          }
        }
      }
    };

    // Listen for page visibility changes (handles tab switching and back navigation)
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [navigate]);

  // Fetch products from backend API
  useEffect(() => {
    setProductsLoading(true);
    fetch("http://localhost/gearsphere_api/GearSphere-BackEnd/getProducts.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setProducts(data.products);
        else setProducts([]);
      })
      .catch(() => setProducts([]))
      .finally(() => setProductsLoading(false));
  }, []);

  // Fetch system reviews from backend API
  useEffect(() => {
    const fetchSystemReviews = async () => {
      try {
        setReviewsLoading(true);
        const response = await axios.get(
          "http://localhost/gearsphere_api/GearSphere-BackEnd/getSystemReviews.php"
        );

        if (response.data.success) {
          setSystemReviews(response.data.reviews);
        } else {
          console.error(
            "Failed to fetch system reviews:",
            response.data.message
          );
        }
      } catch (err) {
        console.error("System reviews fetch error:", err);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchSystemReviews();
  }, []);

  // Check if all loading is complete
  useEffect(() => {
    if (!productsLoading && !reviewsLoading) {
      // Add a small delay to prevent flash
      setTimeout(() => setIsLoading(false), 500);
    }
  }, [productsLoading, reviewsLoading]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight =
        document.querySelector(".navbar-custom")?.offsetHeight || 80;
      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  // Filtered and searched parts
  const filteredParts = products.filter((part) => {
    const matchesType = partType === "All" || part.category === partType;
    const matchesSearch = part.name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  // Render stars for ratings (removed static reviews data - now using API)
  const renderStars = (rating) => {
    return Array(5)
      .fill(0)
      .map((_, i) =>
        i < rating ? (
          <StarFill key={i} className="text-warning me-1" />
        ) : (
          <Star key={i} className="text-warning me-1" />
        )
      );
  };

  // Loading component
  const CustomLoadingScreen = () => <LoadingScreen />;

  // Show loading screen while data is being fetched
  if (isLoading) {
    return <CustomLoadingScreen />;
  }

  return (
    <>
      <div className="homepage-root">
        <div style={{ marginTop: 80 }}>
          <main style={{ flex: 1 }}>
            <style>{ourValuesCardHoverStyle}</style>
            <style>{serviceCardBorderStyle}</style>
            <style>{productSliderStyle}</style>
            <style>{loadingAnimationStyle}</style>
            <style>{contactSectionStyles}</style>
            <style>{`
              .customer-review-card {
                transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
                border: 1.5px solid #f0f0f0;
              }
              .customer-review-card:hover {
                transform: translateY(-6px) scale(1.03);
                box-shadow: 0 8px 32px rgba(0,0,0,0.18);
                border-color: #0d6efd;
                z-index: 2;
              }
              .team-member-card {
                transition: transform 0.2s, box-shadow 0.2s;
                background: #fff;
                border-radius: 2rem;
                box-shadow: 0 2px 12px rgba(0,0,0,0.06);
              }
              .team-member-card:hover {
                transform: translateY(-6px) scale(1.04);
                box-shadow: 0 8px 32px rgba(67,97,238,0.18), 0 1.5px 8px rgba(0,0,0,0.10);
                z-index: 2;
              }
            `}</style>
            {/* Hero Section */}
            <section
              id="hero"
              className="py-5 bg-black text-white position-relative overflow-hidden mb-5"
              style={{
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
                borderBottomLeftRadius: "2rem",
                borderBottomRightRadius: "2rem",
                boxShadow: "0 4px 32px rgba(0,0,0,0.10)",
                marginTop: 0,
                marginBottom: "2rem",
              }}
            >
              {/* Blurred background image */}
              <div
                className="position-absolute top-0 start-0 w-100 h-100"
                style={{
                  backgroundImage: `url(${pcpic2})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  filter: "blur(12px)",
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
              <Container
                className="py-5 position-relative"
                style={{ zIndex: 2 }}
              >
                <Row className="align-items-center">
                  <Col lg={6} className="mb-5 mb-lg-0">
                    <h1
                      className="display-3 fw-bold mb-4 rise-up"
                      style={{ animationDelay: "0s" }}
                    >
                      Build Your Dream Tech{" "}
                      <span className="text-primary">With GearSphere</span>
                    </h1>
                    <p
                      className="lead mb-5 rise-up"
                      style={{ animationDelay: "0.3s" }}
                    >
                      Create your perfect custom PC with our expert builders and
                      premium components. From gaming rigs to professional
                      workstations, we've got you covered.
                    </p>
                    <div
                      className="d-flex gap-3 rise-up"
                      style={{ animationDelay: "0.6s" }}
                    >
                      <Button
                        size="lg"
                        variant="primary"
                        onClick={() => {
                          console.log(
                            "Start Building clicked, setting showLoginModal to true"
                          );
                          setShowLoginModal(true);
                        }}
                      >
                        Start Building
                      </Button>
                      <Button
                        size="lg"
                        variant="outline-light"
                        onClick={() => scrollToSection("products")}
                      >
                        Explore Products <ChevronRight />
                      </Button>
                    </div>
                  </Col>
                  <Col
                    lg={6}
                    className="text-lg-end"
                    style={{ backgroundBlendMode: "darken" }}
                  >
                    {/* <div className="d-inline-block rounded shadow-lg" >
                      <img
                        src={pcGif}
                        alt="PC Building Animation"
                        className="img-fluid rounded pc-gif-img"
                      />
                    </div> */}
                  </Col>
                </Row>
              </Container>
              {/* Blurred background image */}
              <div
                className="position-absolute top-0 start-0 w-100 h-100"
                style={{
                  backgroundImage: `url(${pcpic2})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundColor: "rgba(0, 0, 0, 0.5)", // black overlay
                  backgroundBlendMode: "darken", // or try 'multiply'
                  //filter: 'blur(0px)',
                  zIndex: 0,
                  opacity: 1,
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
            </section>

            {/* About Section */}
            <section
              id="about"
              className="py-5 about-section-custom position-relative mb-5"
              style={{
                overflow: "hidden",
                borderRadius: "2rem",
                boxShadow: "0 4px 32px rgba(0,0,0,0.10)",
                background: "transparent",
                marginTop: "2rem",
                marginBottom: "2rem",
              }}
            >
              <Container>
                <h1 className="text-center mb-5 about-title-custom">
                  About GearSphere
                </h1>
                <Row className="mb-5">
                  <Col
                    md={6}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <h2 className="about-heading-custom">Our Story</h2>
                    <p
                      className="about-text-custom"
                      style={{ textAlign: "justify", fontSize: "1rem" }}
                    >
                      <strong>GearSphere</strong> was founded in 2020 by a group
                      of passionate PC enthusiasts to make custom PC building
                      accessible to everyone. What began as a small effort has
                      grown into a trusted platform connecting customers with
                      expert PC builders across the country.
                    </p>
                    <p
                      className="about-text-custom"
                      style={{ textAlign: "justify", fontSize: "1rem" }}
                    >
                      Our mission is to make custom PC building easy,
                      affordable, and accessible whether you're a beginner or an
                      experienced user. GearSphere bridges the gap between
                      customers and skilled technicians, offering guided tools
                      to select compatible parts, compare options, and get
                      budget-friendly suggestions. We work only with verified
                      technicians and sellers to ensure quality, clear pricing,
                      and honest reviews. We also provide lifetime technical
                      support, upgrade options, and empower technicians by
                      giving them a professional platform to grow.
                    </p>
                  </Col>
                  <Col
                    md={6}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                    }}
                  >
                    <div
                      style={{
                        width: "80%",
                        height: "80%",
                        minHeight: 340,
                        borderRadius: "2rem",
                        overflow: "hidden",
                      }}
                    >
                    <img
                      src={aboutus}
                      alt="GearSphere Team"
                      style={{
                        width: "80%",
                        height: "80%",
                        objectFit: "cover",
                        borderRadius: "2rem",
                      }}
                    />
                  </div>
                  </Col>
                </Row>

                
              </Container>
            </section>

            {/* Services Section */}
            <section
              id="services"
              className="py-5 bg-white mb-5"
              style={{
                borderRadius: "2rem",
                boxShadow: "0 4px 32px rgba(0,0,0,0.10)",
                marginTop: "2rem",
                marginBottom: "2rem",
              }}
            >
              <Container className="py-5">
                <h1 className="text-center mb-5">Our Services</h1>

                <Row className="mb-5">
                  <Col md={6} className="mb-4 mb-md-0">
                    <h2>Expert PC Building Services</h2>
                    <p style={{ textAlign: "justify", fontSize: "1rem" }}>
                      At GearSphere, we offer comprehensive PC building services
                      tailored to your specific needs. Whether you're a gamer,
                      content creator, or professional, our expert builders will
                      craft the perfect system for you.
                    </p>
                    <p style={{ textAlign: "justify", fontSize: "1rem" }}>
                      We handle everything from component selection to assembly,
                      testing, and delivery, ensuring you receive a
                      high-performance, reliable system.
                    </p>
                    <Button
                      variant="primary"
                      className="mt-3"
                      onClick={() => setShowLoginModal(true)}
                    >
                      Get Started
                    </Button>
                  </Col>
                  <Col md={6}>
                  <div
                      style={{
                        width: "80%",
                        height: "80%",
                        minHeight: 340,
                        borderRadius: "2rem",
                        overflow: "hidden",
                        margin: "0 auto"
                      }}
                    >
                    <img
                      src={serviceimg}
                      alt="PC Building Service"
                      className="img-fluid rounded"
                    />
                    </div>
                  </Col>
                </Row>

                {/* Service Offerings Section */}
                <Row className="mb-5">
                  <Col md={12}>
                  <h2 className="text-center mb-4">Our Service Offerings</h2>
                  <Row>
                    <Col md={3} className="mb-4">
                      <Card className="service-card modern-border h-100" 
                      style={{
                        borderRadius: "1.5rem",
                        boxShadow: "0 8px 32px rgba(33, 150, 243, 0.15), 0 1.5px 6px rgba(0,0,0,0.08)",
                        border: "none",
                        transition: "transform 0.3s cubic-bezier(.25,.8,.25,1), box-shadow 0.3s cubic-bezier(.25,.8,.25,1)",
                        zIndex: "2",
                      }}>
                        <Card.Body className="text-center">
                          <div className="service-icon mb-3">
                            <Cpu size={40} style={{ color: "#4361ee" }} />
                          </div>
                          <Card.Title>Custom PC Building</Card.Title>
                          <br />
                          <Card.Text style={{ textAlign: "justify", fontSize: "1rem" }}>
                            Personalized systems built to your specifications
                            with premium components and expert assembly.
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={3} className="mb-4">
                      <Card className="service-card modern-border h-100" 
                      style={{
                        borderRadius: "1.5rem",
                        boxShadow: "0 8px 32px rgba(33, 150, 243, 0.15), 0 1.5px 6px rgba(0,0,0,0.08)",
                        border: "none",
                        transition: "transform 0.3s cubic-bezier(.25,.8,.25,1), box-shadow 0.3s cubic-bezier(.25,.8,.25,1)",
                        zIndex: "2",
                      }}>
                        <Card.Body className="text-center">
                          <div className="service-icon mb-3">
                            <Tools size={40} style={{ color: "#00b894" }} />
                          </div>
                          <Card.Title>
                              Budget-Based PC Build Recommendation
                            </Card.Title>
                            <Card.Text style={{ textAlign: "justify", fontSize: "1rem" }}>
                              Get personalized PC build recommendations based on
                              your budget and needs, ensuring the best value for
                              your money.
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={3} className="mb-4">
                        <Card className="service-card modern-border h-100"
                        style={{
                          borderRadius: "1.5rem",
                          boxShadow: "0 8px 32px rgba(33, 150, 243, 0.15), 0 1.5px 6px rgba(0,0,0,0.08)",
                          border: "none",
                          transition: "transform 0.3s cubic-bezier(.25,.8,.25,1), box-shadow 0.3s cubic-bezier(.25,.8,.25,1)",
                          zIndex: "2",
                        }}>
                          <Card.Body className="text-center">
                            <div className="service-icon mb-3">
                              <PersonCheck
                                size={40}
                                style={{ color: "#fd7e14" }}
                              />
                            </div>
                            <Card.Title>
                              Assign Technician for PC Build
                            </Card.Title>
                            <br />
                            <Card.Text style={{ textAlign: "justify", fontSize: "1rem" }}>
                              Easily assign a verified technician to build your
                              custom PC, ensuring professional assembly and
                              support.
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={3} className="mb-4">
                        <Card className="service-card modern-border h-100"
                        style={{
                          borderRadius: "1.5rem",
                          boxShadow: "0 8px 32px rgba(33, 150, 243, 0.15), 0 1.5px 6px rgba(0,0,0,0.08)",
                          border: "none",
                          transition: "transform 0.3s cubic-bezier(.25,.8,.25,1), box-shadow 0.3s cubic-bezier(.25,.8,.25,1)",
                          zIndex: "2",
                        }}>
                          <Card.Body className="text-center">
                            <div className="service-icon mb-3">
                              <Cart size={40} style={{ color: "#6c5ce7" }} />
                            </div>
                            <Card.Title>Buy PC Parts</Card.Title>
                            <br />
                            <Card.Text style={{ textAlign: "justify", fontSize: "1rem" }}>
                              Purchase high-quality PC parts and components
                              directly from trusted sellers through our
                              marketplace.
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </Col>
                </Row>

                {/* Process Section */}
                <Row className="mb-5">
                  <Col md={12}>
                    <h2 className="text-center mb-4">Our Process</h2>
                    <Row className="justify-content-center">
                      <Col md={10}>
                      <Card
                      style={{
                        borderRadius: "1.5rem",
                        boxShadow: "0 8px 32px rgba(33, 150, 243, 0.15), 0 1.5px 6px rgba(0,0,0,0.08)",
                        border: "none",
                        transition: "transform 0.3s cubic-bezier(.25,.8,.25,1), box-shadow 0.3s cubic-bezier(.25,.8,.25,1)",
                        zIndex: "2",
                      }}>
                        <div className="d-flex flex-column flex-md-row justify-content-between mt-3 mb-3 mx-3 my-3">
                          <div className="process-step">
                            <div className="process-number">1</div>
                            <div className="process-content">
                              <h5>Consultation</h5>
                              <p className="text-muted mb-0" style={{ fontSize: "1rem" }}>
                                Discuss your needs and budget
                              </p>
                             </div>
                          </div>
                          <div className="process-step">
                            <div className="process-number">2</div>
                            <div className="process-content">
                              <h5>Component Selection</h5>
                              <p className="text-muted mb-0" style={{ fontSize: "1rem" }}>
                                Choose the perfect parts
                              </p>
                            </div>
                          </div>
                          <div className="process-step">
                            <div className="process-number">3</div>
                            <div className="process-content">
                              <h5>Assembly</h5>
                              <p className="text-muted mb-0" style={{ fontSize: "1rem" }}>
                                Expert building and cable management
                              </p>
                            </div>
                          </div>
                          <div className="process-step">
                            <div className="process-number">4</div>
                            <div className="process-content">
                              <h5>Testing</h5>
                              <p className="text-muted mb-0" style={{ fontSize: "1rem" }}>
                                Rigorous quality assurance
                              </p>
                            </div>
                          </div>
                          <div className="process-step">
                            <div className="process-number">5</div>
                            <div className="process-content">
                              <h5>Delivery</h5>
                              <p className="text-muted mb-0" style={{ fontSize: "1rem" }}>
                                Safe shipping and setup assistance
                              </p>
                            </div>
                          </div>
                        </div>
                        </Card>
                        </Col>
                    </Row>
                  </Col>
                </Row>
              </Container>
            </section>

            {/* Products Section */}
            <section
              id="products"
              className="py-5 bg-white mb-5"
              style={{
                borderRadius: "2rem",
                boxShadow: "0 4px 32px rgba(0,0,0,0.10)",
                marginTop: "2rem",
                marginBottom: "2rem",
              }}
            >
              <Container>
                <h1 className="text-center mb-5">Our Products</h1>
                <Row className="mb-4">
                  <Col md={6} className="mb-3 mb-md-0">
                    <InputGroup>
                      <Form.Control
                        placeholder="Search PC parts..."
                        aria-label="Search PC parts"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ boxShadow: 'none', outline: 'none' }}
                      />
                      <Button variant="outline-secondary">
                        <Search />
                      </Button>
                    </InputGroup>
                  </Col>
                  <Col md={6} className="d-flex justify-content-md-end">
                    <Form.Select
                      style={{ maxWidth: "220px", boxShadow: 'none', outline: 'none' }}
                      value={partType}
                      onChange={(e) => setPartType(e.target.value)}
                    >
                      <option value="All">All Types</option>
                      {[...new Set(products.map((p) => p.category))].map(
                        (type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        )
                      )}
                    </Form.Select>
                  </Col>
                </Row>
                <div style={{ position: "relative" }}>
                  <div
                    className="product-slider-arrow left"
                    onClick={() => {
                      const row = document.getElementById("product-slider-row");
                      if (row) row.scrollBy({ left: -240, behavior: "smooth" });
                    }}
                  >
                    <ChevronLeft size={24} />
                  </div>
                  <div
                    className="product-slider-arrow right"
                    onClick={() => {
                      const row = document.getElementById("product-slider-row");
                      if (row) row.scrollBy({ left: 240, behavior: "smooth" });
                    }}
                  >
                    <ChevronRight size={24} />
                  </div>
                  <div
                    id="product-slider-row"
                    className="product-slider-row"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 24,
                      minWidth: 320,
                      overflowX: "auto",
                      WebkitOverflowScrolling: "touch",
                      paddingBottom: 8,
                    }}
                  >
                    {[0, 1].map((rowIdx) => {
                      const itemsPerRow = 50;
                      const rowParts = filteredParts.slice(
                        rowIdx * itemsPerRow,
                        (rowIdx + 1) * itemsPerRow
                      );
                      return (
                        <div
                          key={rowIdx}
                          style={{ display: "flex", gap: 24, minWidth: 320 }}
                        >
                          {rowParts.length === 0 && rowIdx === 0 ? (
                            <div className="text-center text-muted py-5 w-100">
                              No parts found.
                            </div>
                          ) : (
                            rowParts.map((part, idx) => (
                              <div
                                key={idx}
                                style={{ flex: "0 0 220px", maxWidth: 220 }}
                              >
                                <Card className="shadow-sm text-center">
                                  <Card.Body
                                    className="d-flex flex-column justify-content-between"
                                    style={{ paddingBottom: 0 }}
                                  >
                                    <div
                                      style={{
                                        minHeight: 180,
                                        maxHeight: 180,
                                        overflowY: "hidden",
                                        overflowX: "hidden",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "flex-start",
                                      }}
                                    >
                                      <div className="mb-3">
                                        {part.image_url ? (
                                          <img
                                            src={`http://localhost/gearsphere_api/GearSphere-BackEnd/${part.image_url}`}
                                            alt={part.name}
                                            style={{
                                              width: 60,
                                              height: 60,
                                              objectFit: "contain",
                                            }}
                                          />
                                        ) : (
                                          part.icon || (
                                            <Display
                                              size={32}
                                              className="text-info"
                                            />
                                          )
                                        )}
                                      </div>
                                      <Card.Title style={{ fontSize: '1rem', fontWeight: 500, marginBottom: 2 }}>{part.name}</Card.Title>
                                      <Card.Text className="text-muted" style={{ fontSize: '0.85rem', marginBottom: 0 }}>
                                        {part.category}
                                      </Card.Text>
                                    </div>
                                    <div>
                                      <h5 className="text-primary mb-2">
                                        LKR{" "}
                                        {Number(part.price).toLocaleString()}
                                      </h5>
                                      <Button
                                        variant="success"
                                        className="w-100 mb-2"
                                        onClick={() => setShowLoginModal(true)}
                                      >
                                        Buy
                                      </Button>
                                    </div>
                                  </Card.Body>
                                </Card>
                              </div>
                            ))
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Container>
            </section>

            {/* Reviews Section */}
            <section
              id="reviews"
              className="py-5 bg-white mb-5"
              style={{
                borderRadius: "2rem",
                boxShadow: "0 4px 32px rgba(0,0,0,0.10)",
                marginTop: "2rem",
                marginBottom: "2rem",
              }}
            >
              <Container>
                <h1 className="text-center mb-5">Customer Reviews</h1>

                {reviewsLoading ? (
                  <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">
                        Loading reviews...
                      </span>
                    </div>
                    <p className="mt-2">Loading customer reviews...</p>
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
                                        i < review.rating
                                          ? "currentColor"
                                          : "none"
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
                                {new Date(
                                  review.created_at
                                ).toLocaleDateString()}
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
              </Container>
            </section>

            {/* Contact Section */}
            <section
              id="contact"
              className="py-5 bg-white"
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
          </main>
          <Footer />
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal
        show={showLoginModal}
        onHide={() => setShowLoginModal(false)}
        switchToRegister={() => {
          console.log(
            "switchToRegister called, closing login modal and opening signup modal"
          );
          setShowLoginModal(false);
          setShowSignupModal(true);
        }}
      />

      {/* Signup Modal */}
      {showSignupModal && (
        <>
          {console.log(
            "Rendering Signup modal, showSignupModal:",
            showSignupModal
          )}
          <Signup
            signupClose={setShowSignupModal}
            loginClose={setShowLoginModal}
          />
        </>
      )}
    </>
  );
}

export default HomePage;
