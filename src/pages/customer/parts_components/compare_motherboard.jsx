import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  Button,
  Table,
  Alert,
  Card,
  Row,
  Col,
} from "react-bootstrap";
import { Motherboard, ArrowLeft } from "react-bootstrap-icons";
import CustomerNavbar from "../../pageNavbars/CustomerNavbar";
import { toast } from "react-toastify";
import axios from "axios";

const compareMbHeadingStyle = `
  .compare-mb-heading {
    font-size: 2.1rem;
    font-weight: 700;
    color: #1a237e;
    letter-spacing: 0.5px;
    text-shadow: 0 2px 8px rgba(26,35,126,0.08);
    margin-bottom: 0;
    margin-top: 0.2em;
    line-height: 1.1;
  }
`;

const comparisonTableStyle = `
  .comparison-table th {
    background-color: #f8f9fa;
    font-weight: 600;
    text-align: center;
    vertical-align: middle;
    border: 1px solid #dee2e6;
    width: 200px;
    min-width: 200px;
    max-width: 200px;
    word-break: break-word;
  }
  .comparison-table td {
    text-align: center;
    vertical-align: middle;
    border: 1px solid #dee2e6;
    width: 200px;
    min-width: 200px;
    max-width: 200px;
    word-break: break-word;
  }
  .comparison-table .mb-name {
    font-weight: 600;
    color: #1a237e;
  }
  .comparison-table .mb-img {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    object-fit: cover;
    margin-bottom: 8px;
  }
  .comparison-table .price {
    font-weight: 600;
    color: #28a745;
  }
`;

const smallCardStyle = `
  .mb-compare-card-sm {
    min-width: 200px;
    max-width: 250px;
    margin: 0 auto;
    padding: 1rem 1rem 1.2rem 1rem;
    border-radius: 14px;
  }
  .mb-compare-card-sm .mb-img {
    width: 80px;
    height: 80px;
    margin-bottom: 0.7rem;
  }
  .mb-compare-card-sm .mb-name {
    font-size: 0.95rem;
    margin-bottom: 0.3rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-word;
  }
  .mb-compare-card-sm .price {
    font-size: 1.05rem;
    margin-bottom: 0.4rem;
  }
  .mb-compare-card-sm .btn {
    font-size: 1rem;
    padding: 0.35rem 1.1rem;
  }
  @media (max-width: 991.98px) {
    .mb-compare-card-sm {
      min-width: 170px;
      max-width: 200px;
    }
  }
  @media (max-width: 575.98px) {
    .mb-compare-card-sm {
      min-width: 140px;
      max-width: 170px;
    }
  }
`;

export default function CompareMotherboardPage() {
  const [motherboards, setMotherboards] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get compare selection from navigation state with sessionStorage fallback
    let compareSelection = location.state?.compareSelection || [];

    // Fallback to sessionStorage if navigation state is empty (for page refresh scenarios)
    if (compareSelection.length === 0) {
      const storedSelection = sessionStorage.getItem(
        "motherboard_compareSelection"
      );
      if (storedSelection) {
        try {
          compareSelection = JSON.parse(storedSelection);
        } catch (e) {
          // Invalid JSON in storage, ignore
        }
      }
    } else {
      // Store in sessionStorage for page refresh scenarios only
      sessionStorage.setItem(
        "motherboard_compareSelection",
        JSON.stringify(compareSelection)
      );
    }

    if (compareSelection.length > 0) {
      const ids = compareSelection.map((mb) => mb.product_id);
      axios
        .get(
          "http://localhost/gearsphere_api/GearSphere-BackEnd/getMotherBoard.php"
        )
        .then((response) => {
          const data = response.data;
          if (data.success) {
            // Filter only those in compare list
            const filtered = (data.data || []).filter((mb) =>
              ids.includes(mb.product_id)
            );
            setMotherboards(filtered);
          } else {
            toast.error(data.message || "Failed to fetch motherboards");
          }
          setLoading(false);
        })
        .catch(() => {
          toast.error("Failed to fetch motherboards");
          setLoading(false);
        });
    } else {
      setLoading(false);
    }

    // Cleanup sessionStorage when component unmounts
    return () => {
      sessionStorage.removeItem("motherboard_compareSelection");
    };
  }, [location.state]);

  const handleSelectMotherboard = (mb) => {
    toast.success(`Selected ${mb.name}. Redirecting to PC Builder...`);
    setTimeout(() => {
      navigate("/pc-builder", { state: { selectedComponent: mb } });
    }, 1000);
  };

  const handleBackToSelection = () => {
    navigate("/motherboard");
  };

  if (loading) {
    return (
      <>
        <CustomerNavbar />
        <Container className="py-5">
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </Container>
      </>
    );
  }

  if (motherboards.length === 0) {
    return (
      <>
        <CustomerNavbar />
        <Container className="py-5">
          <Alert variant="warning">
            <h4>No Motherboards to Compare</h4>
            <p>No motherboards were selected for comparison.</p>
            <Button onClick={handleBackToSelection} variant="primary">
              <ArrowLeft className="me-2" />
              Back to Motherboard Selection
            </Button>
          </Alert>
        </Container>
      </>
    );
  }

  return (
    <>
      <CustomerNavbar />
      <Container className="py-5">
        <style>{compareMbHeadingStyle}</style>
        <style>{comparisonTableStyle}</style>
        <style>{smallCardStyle}</style>

        <div className="d-flex align-items-center justify-content-between mb-4">
          <h1 className="mb-0 compare-mb-heading">Compare Motherboards</h1>
        </div>

        <Row
          className="mb-4 d-flex flex-row justify-content-center"
          style={{
            gap: "2rem",
            flexWrap: "nowrap",
            overflowX: "auto",
            whiteSpace: "nowrap",
            marginTop: "1.5rem",
            marginLeft: "0rem",
          }}
        >
          {motherboards.map((mb) => (
            <Col key={mb.name} xs="auto" className="p-0">
              <Card className="h-100 shadow-sm mb-compare-card-sm">
                <Card.Body className="text-center">
                  <img
                    src={
                      mb.image_url
                        ? `http://localhost/gearsphere_api/GearSphere-BackEnd/${mb.image_url}`
                        : "/profile_images/user_image.jpg"
                    }
                    alt={mb.name}
                    className="mb-img mb-2"
                  />
                  <Card.Title className="mb-name">{mb.name}</Card.Title>
                  <Card.Text className="price">
                    LKR {mb.price?.toLocaleString() || "N/A"}
                  </Card.Text>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleSelectMotherboard(mb)}
                  >
                    Select This Motherboard
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <Table
          className="comparison-table"
          style={{ tableLayout: "fixed", width: "100%" }}
        >
          <thead>
            <tr>
              <th>Specification</th>
              {motherboards.map((mb) => (
                <th key={mb.name}>{mb.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>Socket</strong>
              </td>
              {motherboards.map((mb) => (
                <td key={mb.name}>{mb.socket || "—"}</td>
              ))}
            </tr>
            <tr>
              <td>
                <strong>Form Factor</strong>
              </td>
              {motherboards.map((mb) => (
                <td key={mb.name}>{mb.form_factor || "—"}</td>
              ))}
            </tr>
            <tr>
              <td>
                <strong>Chipset</strong>
              </td>
              {motherboards.map((mb) => (
                <td key={mb.name}>{mb.chipset || "—"}</td>
              ))}
            </tr>
            <tr>
              <td>
                <strong>Memory Slots</strong>
              </td>
              {motherboards.map((mb) => (
                <td key={mb.name}>{mb.memory_slots ?? "—"}</td>
              ))}
            </tr>
            <tr>
              <td>
                <strong>Max Memory</strong>
              </td>
              {motherboards.map((mb) => (
                <td key={mb.name}>{mb.memory_max || "—"}</td>
              ))}
            </tr>
            <tr>
              <td>
                <strong>Memory Type</strong>
              </td>
              {motherboards.map((mb) => (
                <td key={mb.name}>{mb.memory_type || "—"}</td>
              ))}
            </tr>
            <tr>
              <td>
                <strong>SATA Ports</strong>
              </td>
              {motherboards.map((mb) => (
                <td key={mb.name}>{mb.sata_ports ?? "—"}</td>
              ))}
            </tr>
            <tr>
              <td>
                <strong>Wi-Fi</strong>
              </td>
              {motherboards.map((mb) => (
                <td key={mb.name}>
                  {mb.wifi === 1 ? "Yes" : mb.wifi === 0 ? "No" : "—"}
                </td>
              ))}
            </tr>
            <tr>
              <td>
                <strong>Description</strong>
              </td>
              {motherboards.map((mb) => (
                <td
                  key={mb.name}
                  style={{
                    whiteSpace: "pre-line",
                    textAlign: "justify",
                    fontSize: "0.95em",
                    verticalAlign: "top",
                  }}
                >
                  {mb.description || "—"}
                </td>
              ))}
            </tr>
            <tr>
              <td>
                <strong>Price</strong>
              </td>
              {motherboards.map((mb) => (
                <td key={mb.name} className="price">
                  LKR {mb.price?.toLocaleString() || "N/A"}
                </td>
              ))}
            </tr>
          </tbody>
        </Table>

        <div className="text-center mt-4">
          <Button variant="primary" size="lg" onClick={handleBackToSelection}>
            <ArrowLeft className="me-2" />
            Back to Motherboard Selection
          </Button>
        </div>
      </Container>
    </>
  );
}
