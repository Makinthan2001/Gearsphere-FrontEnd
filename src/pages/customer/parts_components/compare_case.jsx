import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  Button,
  Table,
  Card,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
import { PcDisplay, ArrowLeft } from "react-bootstrap-icons";
import CustomerNavbar from "../../pageNavbars/CustomerNavbar";
import { toast } from "react-toastify";
import axios from "axios";

const compareCaseHeadingStyle = `
  .compare-case-heading {
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
  }
  .comparison-table td {
    text-align: center;
    vertical-align: middle;
    border: 1px solid #dee2e6;
  }
  .comparison-table .case-name {
    font-weight: 600;
    color: #1a237e;
  }
  .comparison-table .case-img {
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
  .case-compare-card-sm {
    min-width: 200px;
    max-width: 250px;
    margin: 0 auto;
    padding: 1rem 1rem 1.2rem 1rem;
    border-radius: 14px;
  }
  .case-compare-card-sm .case-img {
    width: 80px;
    height: 80px;
    margin-bottom: 0.7rem;
    border-radius: 8px;
    object-fit: cover;
  }
  .case-compare-card-sm .case-name {
    font-size: 0.95rem;
    margin-bottom: 0.3rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-word;
  }
  .case-compare-card-sm .price {
    font-size: 1.05rem;
    margin-bottom: 0.4rem;
  }
  .case-compare-card-sm .btn {
    font-size: 1rem;
    padding: 0.35rem 1.1rem;
  }
  @media (max-width: 991.98px) {
    .case-compare-card-sm {
      min-width: 170px;
      max-width: 200px;
    }
  }
  @media (max-width: 575.98px) {
    .case-compare-card-sm {
      min-width: 140px;
      max-width: 170px;
    }
  }
`;

export default function CompareCasePage() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get compare selection from navigation state with sessionStorage fallback
    let compareSelection = location.state?.compareSelection || [];

    // Fallback to sessionStorage if navigation state is empty (for page refresh scenarios)
    if (compareSelection.length === 0) {
      const storedSelection = sessionStorage.getItem("case_compareSelection");
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
        "case_compareSelection",
        JSON.stringify(compareSelection)
      );
    }

    if (compareSelection.length > 0) {
      try {
        const ids = compareSelection.map((pcCase) => pcCase.product_id);
        axios
          .get(
            "http://localhost/gearsphere_api/GearSphere-BackEnd/getPCCases.php"
          )
          .then((response) => {
            const data = response.data;
            if (data.success) {
              // Filter only those in compare list
              const filtered = (data.data || []).filter((pcCase) =>
                ids.includes(pcCase.product_id)
              );
              setCases(filtered);
            } else {
              toast.error(data.message || "Failed to fetch PC Cases");
            }
            setLoading(false);
          })
          .catch(() => {
            toast.error("Failed to fetch PC Cases");
            setLoading(false);
          });
      } catch (error) {
        toast.error("Error loading case comparison data");
        setLoading(false);
      }
    } else {
      setLoading(false);
    }

    // Cleanup sessionStorage when component unmounts
    return () => {
      sessionStorage.removeItem("case_compareSelection");
    };
  }, [location.state]);

  const handleSelectCase = (pcCase) => {
    toast.success(`Selected ${pcCase.name}. Redirecting to PC Builder...`);
    setTimeout(() => {
      navigate("/pc-builder", { state: { selectedComponent: pcCase } });
    }, 1000);
  };

  const handleBackToSelection = () => {
    navigate("/case");
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

  if (cases.length === 0) {
    return (
      <>
        <CustomerNavbar />
        <Container className="py-5">
          <Alert variant="warning">
            <h4>No PC Cases to Compare</h4>
            <p>No PC Cases were selected for comparison.</p>
            <Button onClick={handleBackToSelection} variant="primary">
              <ArrowLeft className="me-2" />
              Back to PC Case Selection
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
        <style>{compareCaseHeadingStyle}</style>
        <style>{comparisonTableStyle}</style>
        <style>{smallCardStyle}</style>

        <div className="d-flex align-items-center justify-content-between mb-4">
          <h1 className="mb-0 compare-case-heading">Compare PC Cases</h1>
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
          {cases.map((pcCase, index) => (
            <Col key={pcCase.product_id} xs="auto" className="p-0">
              <Card className="h-100 shadow-sm case-compare-card-sm">
                <Card.Body className="text-center">
                  <img
                    src={
                      pcCase.image_url
                        ? `http://localhost/gearsphere_api/GearSphere-BackEnd/${pcCase.image_url}`
                        : "/profile_images/user_image.jpg"
                    }
                    alt={pcCase.name}
                    className="case-img"
                  />
                  <Card.Title className="case-name">{pcCase.name}</Card.Title>
                  <Card.Text className="price">
                    LKR {pcCase.price?.toLocaleString() || "N/A"}
                  </Card.Text>
                  <Button
                    className="btn-darkblue"
                    size="sm"
                    onClick={() => handleSelectCase(pcCase)}
                  >
                    Select This Case
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <Table bordered hover responsive className="comparison-table">
          <thead>
            <tr>
              <th>Specification</th>
              {cases.map((pcCase) => (
                <th key={pcCase.product_id}>
                  <img
                    src={
                      pcCase.image_url
                        ? `http://localhost/gearsphere_api/GearSphere-BackEnd/${pcCase.image_url}`
                        : "/profile_images/user_image.jpg"
                    }
                    alt={pcCase.name}
                    className="case-img"
                  />
                  <div className="case-name">{pcCase.name}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>Type</strong>
              </td>
              {cases.map((pcCase) => (
                <td key={pcCase.product_id}>{pcCase.type || "—"}</td>
              ))}
            </tr>
            <tr>
              <td>
                <strong>Color</strong>
              </td>
              {cases.map((pcCase) => (
                <td key={pcCase.product_id}>{pcCase.color || "—"}</td>
              ))}
            </tr>
            <tr>
              <td>
                <strong>Side Panel</strong>
              </td>
              {cases.map((pcCase) => (
                <td key={pcCase.product_id}>{pcCase.side_panel || "—"}</td>
              ))}
            </tr>
            <tr>
              <td>
                <strong>Max GPU Length</strong>
              </td>
              {cases.map((pcCase) => (
                <td key={pcCase.product_id}>{pcCase.max_gpu_length || "—"}</td>
              ))}
            </tr>
            <tr>
              <td>
                <strong>Volume</strong>
              </td>
              {cases.map((pcCase) => (
                <td key={pcCase.product_id}>{pcCase.volume || "—"}</td>
              ))}
            </tr>
            <tr>
              <td>
                <strong>Dimensions</strong>
              </td>
              {cases.map((pcCase) => (
                <td key={pcCase.product_id}>{pcCase.dimensions || "—"}</td>
              ))}
            </tr>
            <tr>
              <td>
                <strong>Description</strong>
              </td>
              {cases.map((pcCase) => (
                <td key={pcCase.product_id}>
                  <div
                    style={{
                      maxWidth: "200px",
                      textAlign: "left",
                      fontSize: "0.9rem",
                      lineHeight: "1.4",
                    }}
                  >
                    {pcCase.description || "No description available"}
                  </div>
                </td>
              ))}
            </tr>
            <tr>
              <td>
                <strong>Price</strong>
              </td>
              {cases.map((pcCase) => (
                <td key={pcCase.product_id} className="price">
                  LKR {pcCase.price?.toLocaleString() || "N/A"}
                </td>
              ))}
            </tr>
          </tbody>
        </Table>

        <div className="text-center mt-4">
          <Button
            className="btn-darkblue"
            size="lg"
            onClick={handleBackToSelection}
          >
            <ArrowLeft className="me-2" />
            Back to PC Case Selection
          </Button>
        </div>
      </Container>
    </>
  );
}
