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
import { Windows, ArrowLeft } from "react-bootstrap-icons";
import CustomerNavbar from "../../pageNavbars/CustomerNavbar";
import { toast } from "react-toastify";

const compareOSHeadingStyle = `
  .compare-os-heading {
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
  .comparison-table .os-name {
    font-weight: 600;
    color: #1a237e;
  }
  .comparison-table .os-img {
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
  .comparison-table .rating {
    color: #f5a623;
  }
`;

const smallCardStyle = `
  .os-compare-card-sm {
    min-width: 200px;
    max-width: 250px;
    margin: 0 auto;
    padding: 1rem 1rem 1.2rem 1rem;
    border-radius: 14px;
  }
  .os-compare-card-sm .os-img {
    width: 80px;
    height: 80px;
    margin-bottom: 0.7rem;
  }
  .os-compare-card-sm .os-name {
    font-size: 0.95rem;
    margin-bottom: 0.3rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-word;
  }
  .os-compare-card-sm .price {
    font-size: 1.05rem;
    margin-bottom: 0.4rem;
  }
  .os-compare-card-sm .btn {
    font-size: 1rem;
    padding: 0.35rem 1.1rem;
  }
  @media (max-width: 991.98px) {
    .os-compare-card-sm {
      min-width: 170px;
      max-width: 200px;
    }
  }
  @media (max-width: 575.98px) {
    .os-compare-card-sm {
      min-width: 140px;
      max-width: 170px;
    }
  }
`;

const osIconMap = {
  "Microsoft Windows 11 Pro": <Windows size={24} className="text-primary" />,
  "Microsoft Windows 11 Home": <Windows size={24} className="text-success" />,
  "Microsoft Windows 10 Pro": <Windows size={24} className="text-info" />,
  "Microsoft Windows 10 Home": <Windows size={24} className="text-warning" />,
};

export default function CompareOperatingSystemPage() {
  const [oses, setOses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get compare selection from navigation state instead of sessionStorage
    const compareSelection = location.state?.compareSelection || [];
    if (compareSelection.length > 0) {
      try {
        const osesWithIcons = compareSelection.map((os) => ({
          ...os,
          icon: osIconMap[os.name] || null,
        }));
        setOses(osesWithIcons);
      } catch (error) {
        toast.error("Error loading Operating System comparison data");
      }
    }
    setLoading(false);
  }, [location.state]);

  const handleSelectOS = (os) => {
    const { icon, ...osWithoutIcon } = os;
    toast.success(`Selected ${os.name}. Redirecting to PC Builder...`);
    setTimeout(() => {
      navigate("/pc-builder", { state: { selectedComponent: osWithoutIcon } });
    }, 1000);
  };

  const handleBackToSelection = () => {
    navigate("/operatingsystem");
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

  if (oses.length === 0) {
    return (
      <>
        <CustomerNavbar />
        <Container className="py-5">
          <Alert variant="warning">
            <h4>No Operating Systems to Compare</h4>
            <p>No operating systems were selected for comparison.</p>
            <Button onClick={handleBackToSelection} variant="primary">
              <ArrowLeft className="me-2" />
              Back to Operating System Selection
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
        <style>{compareOSHeadingStyle}</style>
        <style>{comparisonTableStyle}</style>
        <style>{smallCardStyle}</style>

        <div className="d-flex align-items-center justify-content-between mb-4">
          <h1 className="mb-0 compare-os-heading">Compare Operating Systems</h1>
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
          {oses.map((os, index) => (
            <Col key={os.name} xs="auto" className="p-0">
              <Card className="h-100 shadow-sm os-compare-card-sm">
                <Card.Body className="text-center">
                  <img
                    src={
                      os.image_url
                        ? `http://localhost/gearsphere_api/GearSphere-BackEnd/${os.image_url}`
                        : "/profile_images/user_image.jpg"
                    }
                    alt={os.name}
                    className="os-img mb-2"
                  />
                  <Card.Title className="os-name">{os.name}</Card.Title>
                  <Card.Text className="price">
                    {os.price === 0
                      ? "Free"
                      : `LKR ${parseFloat(os.price).toLocaleString()}`}
                  </Card.Text>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleSelectOS(os)}
                  >
                    Select This OS
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
              {oses.map((os) => (
                <th key={os.name}>{os.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>Model</strong>
              </td>
              {oses.map((os) => (
                <td key={os.name}>{os.model || "—"}</td>
              ))}
            </tr>
            <tr>
              <td>
                <strong>Mode</strong>
              </td>
              {oses.map((os) => (
                <td key={os.name}>{os.mode || "—"}</td>
              ))}
            </tr>
            <tr>
              <td>
                <strong>Version</strong>
              </td>
              {oses.map((os) => (
                <td key={os.name}>{os.version || "—"}</td>
              ))}
            </tr>
            <tr>
              <td>
                <strong>Max Supported Memory</strong>
              </td>
              {oses.map((os) => (
                <td key={os.name}>{os.max_supported_memory || "—"}</td>
              ))}
            </tr>
            <tr>
              <td>
                <strong>Description</strong>
              </td>
              {oses.map((os) => (
                <td
                  key={os.name}
                  style={{
                    whiteSpace: "pre-line",
                    textAlign: "justify",
                    fontSize: "0.95em",
                    verticalAlign: "top",
                  }}
                >
                  {os.description || "—"}
                </td>
              ))}
            </tr>
            <tr>
              <td>
                <strong>Price</strong>
              </td>
              {oses.map((os) => (
                <td key={os.name} className="price">
                  {os.price === 0
                    ? "Free"
                    : `LKR ${parseFloat(os.price).toLocaleString()}`}
                </td>
              ))}
            </tr>
          </tbody>
        </Table>

        <div className="text-center mt-4">
          <Button variant="primary" size="lg" onClick={handleBackToSelection}>
            <ArrowLeft className="me-2" />
            Back to Operating System Selection
          </Button>
        </div>
      </Container>
    </>
  );
}
