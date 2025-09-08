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
import { Display, ArrowLeft } from "react-bootstrap-icons";
import CustomerNavbar from "../../pageNavbars/CustomerNavbar";
import { toast } from "react-toastify";

const compareMonitorHeadingStyle = `
  .compare-monitor-heading {
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
  .comparison-table .monitor-name {
    font-weight: 600;
    color: #1a237e;
  }
  .comparison-table .monitor-img {
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
  .monitor-compare-card-sm {
    min-width: 200px;
    max-width: 250px;
    margin: 0 auto;
    padding: 1rem 1rem 1.2rem 1rem;
    border-radius: 14px;
  }
  .monitor-compare-card-sm .monitor-img {
    width: 80px;
    height: 80px;
    margin-bottom: 0.7rem;
  }
  .monitor-compare-card-sm .monitor-name {
    font-size: 0.95rem;
    margin-bottom: 0.3rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-word;
  }
  .monitor-compare-card-sm .price {
    font-size: 1.05rem;
    margin-bottom: 0.4rem;
  }
  .monitor-compare-card-sm .btn {
    font-size: 1rem;
    padding: 0.35rem 1.1rem;
  }
  @media (max-width: 991.98px) {
    .monitor-compare-card-sm {
      min-width: 170px;
      max-width: 200px;
    }
  }
  @media (max-width: 575.98px) {
    .monitor-compare-card-sm {
      min-width: 140px;
      max-width: 170px;
    }
  }
`;

const monitorIconMap = {
  "Samsung Odyssey G9": <Display size={24} className="text-primary" />,
  "LG 27GL850-B": <Display size={24} className="text-success" />,
  "ASUS ROG Swift PG279Q": <Display size={24} className="text-danger" />,
  "Dell Alienware AW3423DW": <Display size={24} className="text-warning" />,
  "Acer Predator X27": <Display size={24} className="text-info" />,
  "BenQ PD2700U": <Display size={24} className="text-secondary" />,
  "ViewSonic VP2768": <Display size={24} className="text-dark" />,
  "Philips 276E8VJSB": <Display size={24} className="text-primary" />,
  "MSI Optix MAG274QRF": <Display size={24} className="text-success" />,
  "Gigabyte M27Q": <Display size={24} className="text-danger" />,
};

export default function CompareMonitorPage() {
  const [monitors, setMonitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get compare selection from navigation state instead of sessionStorage
    const compareSelection = location.state?.compareSelection || [];
    if (compareSelection.length > 0) {
      try {
        const monitorsWithIcons = compareSelection.map((monitor) => ({
          ...monitor,
          icon: monitorIconMap[monitor.name] || null,
        }));
        setMonitors(monitorsWithIcons);
      } catch (error) {
        toast.error("Error loading monitor comparison data");
      }
    }
    setLoading(false);
  }, [location.state]);

  const handleSelectMonitor = (monitor) => {
    const { icon, ...monitorWithoutIcon } = monitor;
    toast.success(`Selected ${monitor.name}. Redirecting to PC Builder...`);
    setTimeout(() => {
      navigate("/pc-builder", {
        state: { selectedComponent: monitorWithoutIcon },
      });
    }, 1000);
  };

  const handleBackToSelection = () => {
    navigate("/monitor");
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

  if (monitors.length === 0) {
    return (
      <>
        <CustomerNavbar />
        <Container className="py-5">
          <Alert variant="warning">
            <h4>No Monitors to Compare</h4>
            <p>No monitors were selected for comparison.</p>
            <Button onClick={handleBackToSelection} variant="primary">
              <ArrowLeft className="me-2" />
              Back to Monitor Selection
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
        <style>{compareMonitorHeadingStyle}</style>
        <style>{comparisonTableStyle}</style>
        <style>{smallCardStyle}</style>

        <div className="d-flex align-items-center justify-content-between mb-4">
          <h1 className="mb-0 compare-monitor-heading">Compare Monitors</h1>
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
          {monitors.map((monitor, index) => (
            <Col key={monitor.name} xs="auto" className="p-0">
              <Card className="h-100 shadow-sm monitor-compare-card-sm">
                <Card.Body className="text-center">
                  <img
                    src={
                      monitor.image_url
                        ? `http://localhost/gearsphere_api/GearSphere-BackEnd/${monitor.image_url}`
                        : "/profile_images/user_image.jpg"
                    }
                    alt={monitor.name}
                    className="monitor-img mb-2"
                  />
                  <Card.Title className="monitor-name">
                    {monitor.name}
                  </Card.Title>
                  <Card.Text className="price">
                    LKR {monitor.price?.toLocaleString() || "N/A"}
                  </Card.Text>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleSelectMonitor(monitor)}
                  >
                    Select This Monitor
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
              {monitors.map((monitor) => (
                <th key={monitor.name}>{monitor.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>Screen Size</strong>
              </td>
              {monitors.map((monitor) => (
                <td key={monitor.name}>
                  {monitor.screen_size ? `${monitor.screen_size}"` : "—"}
                </td>
              ))}
            </tr>
            <tr>
              <td>
                <strong>Resolution</strong>
              </td>
              {monitors.map((monitor) => (
                <td key={monitor.name}>{monitor.resolution || "—"}</td>
              ))}
            </tr>
            <tr>
              <td>
                <strong>Refresh Rate</strong>
              </td>
              {monitors.map((monitor) => (
                <td key={monitor.name}>{monitor.refresh_rate || "—"}</td>
              ))}
            </tr>
            <tr>
              <td>
                <strong>Panel Type</strong>
              </td>
              {monitors.map((monitor) => (
                <td key={monitor.name}>
                  <span
                    className={`badge bg-${
                      monitor.panel_type === "IPS"
                        ? "info"
                        : monitor.panel_type === "OLED"
                        ? "dark"
                        : "secondary"
                    }`}
                  >
                    {monitor.panel_type || "—"}
                  </span>
                </td>
              ))}
            </tr>
            <tr>
              <td>
                <strong>Aspect Ratio</strong>
              </td>
              {monitors.map((monitor) => (
                <td key={monitor.name}>{monitor.aspect_ratio || "—"}</td>
              ))}
            </tr>
            <tr>
              <td>
                <strong>Brightness</strong>
              </td>
              {monitors.map((monitor) => (
                <td key={monitor.name}>{monitor.brightness || "—"}</td>
              ))}
            </tr>
            <tr>
              <td>
                <strong>Description</strong>
              </td>
              {monitors.map((monitor) => (
                <td
                  key={monitor.name}
                  style={{
                    whiteSpace: "pre-line",
                    textAlign: "justify",
                    fontSize: "0.95em",
                    verticalAlign: "top",
                  }}
                >
                  {monitor.description || "—"}
                </td>
              ))}
            </tr>
            <tr>
              <td>
                <strong>Price</strong>
              </td>
              {monitors.map((monitor) => (
                <td key={monitor.name} className="price">
                  LKR {monitor.price?.toLocaleString() || "N/A"}
                </td>
              ))}
            </tr>
          </tbody>
        </Table>

        <div className="text-center mt-4">
          <Button variant="primary" size="lg" onClick={handleBackToSelection}>
            <ArrowLeft className="me-2" />
            Back to Monitor Selection
          </Button>
        </div>
      </Container>
    </>
  );
}
