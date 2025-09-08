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
import { Fan, ArrowLeft } from "react-bootstrap-icons";
import CustomerNavbar from "../../pageNavbars/CustomerNavbar";
import { toast } from "react-toastify";
import axios from "axios";

const compareCoolerHeadingStyle = `
  .compare-cooler-heading {
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
  .comparison-table .cooler-name {
    font-weight: 600;
    color: #1a237e;
  }
  .comparison-table .cooler-img {
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
  .cooler-compare-card-sm {
    min-width: 200px;
    max-width: 250px;
    margin: 0 auto;
    padding: 1rem 1rem 1.2rem 1rem;
    border-radius: 14px;
  }
  .cooler-compare-card-sm .cooler-img {
    width: 80px;
    height: 80px;
    margin-bottom: 0.7rem;
  }
  .cooler-compare-card-sm .cooler-name {
    font-size: 0.95rem;
    margin-bottom: 0.3rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-word;
  }
  .cooler-compare-card-sm .price {
    font-size: 1.05rem;
    margin-bottom: 0.4rem;
  }
  .cooler-compare-card-sm .btn {
    font-size: 1rem;
    padding: 0.35rem 1.1rem;
  }
  @media (max-width: 991.98px) {
    .cooler-compare-card-sm {
      min-width: 170px;
      max-width: 200px;
    }
  }
  @media (max-width: 575.98px) {
    .cooler-compare-card-sm {
      min-width: 140px;
      max-width: 170px;
    }
  }
`;

const coolerIconMap = {
  "Thermalright Phantom Spirit 120 SE ARGB 66.17 CFM": (
    <Fan size={24} className="text-info" />
  ),
  "Noctua NH-D15 chromax.black 82.52 CFM": (
    <Fan size={24} className="text-secondary" />
  ),
  "Cooler Master Hyper 212 Black Edition 42 CFM": (
    <Fan size={24} className="text-dark" />
  ),
  "Thermalright Peerless Assassin 120 SE 66.17 CFM": (
    <Fan size={24} className="text-info" />
  ),
  "ARCTIC Liquid Freezer III Pro 360 77 CFM": (
    <Fan size={24} className="text-primary" />
  ),
};

export default function CompareCPUCoolerPage() {
  const [coolers, setCoolers] = useState([]);
  const [allCoolers, setAllCoolers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch all CPU coolers from backend
        const response = await axios.get(
          "http://localhost/gearsphere_api/GearSphere-BackEnd/getCPUCoolers.php"
        );

        if (response.data.success) {
          setAllCoolers(response.data.data);

          // Get selected coolers from navigation state instead of sessionStorage
          const compareSelection = location.state?.compareSelection || [];
          if (compareSelection.length > 0) {
            const selectedIds = compareSelection.map((c) => c.product_id);
            const selectedCoolers = response.data.data.filter((c) =>
              selectedIds.includes(c.product_id)
            );

            // Add icons to coolers
            const coolersWithIcons = selectedCoolers.map((cooler) => ({
              ...cooler,
              icon: coolerIconMap[cooler.name] || null,
            }));

            setCoolers(coolersWithIcons);
          }
        }
      } catch (error) {
        toast.error("Error loading CPU cooler data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSelect = (cooler) => {
    const { icon, ...coolerWithoutIcon } = cooler;
    toast.success(`Selected ${cooler.name}. Redirecting to PC Builder...`);
    setTimeout(() => {
      navigate("/pc-builder", {
        state: { selectedComponent: coolerWithoutIcon },
      });
    }, 1000);
  };

  const handleBackToSelection = () => {
    navigate("/cpucooler");
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

  if (coolers.length === 0) {
    return (
      <>
        <CustomerNavbar />
        <Container className="py-5">
          <Alert variant="warning">
            <h4>No CPU Coolers to Compare</h4>
            <p>No CPU Coolers were selected for comparison.</p>
            <Button onClick={handleBackToSelection} variant="primary">
              <ArrowLeft className="me-2" />
              Back to CPU Cooler Selection
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
        <style>{compareCoolerHeadingStyle}</style>
        <style>{comparisonTableStyle}</style>
        <style>{smallCardStyle}</style>

        <div className="d-flex align-items-center justify-content-between mb-4">
          <h1 className="mb-0 compare-cooler-heading">Compare CPU Coolers</h1>
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
          {coolers.map((cooler, index) => (
            <Col key={cooler.product_id} xs="auto" className="p-0">
              <Card className="h-100 shadow-sm cooler-compare-card-sm">
                <Card.Body className="text-center">
                  <img
                    src={
                      cooler.image_url
                        ? `http://localhost/gearsphere_api/GearSphere-BackEnd/${cooler.image_url}`
                        : "/profile_images/user_image.jpg"
                    }
                    alt={cooler.name}
                    className="cooler-img mb-2"
                  />
                  <Card.Title className="cooler-name">{cooler.name}</Card.Title>
                  <Card.Text className="price">
                    LKR {cooler.price?.toLocaleString() || "N/A"}
                  </Card.Text>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleSelect(cooler)}
                  >
                    Select This Cooler
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
              {coolers.map((cooler) => (
                <th key={cooler.product_id}>{cooler.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>Type</strong>
              </td>
              {coolers.map((cooler) => (
                <td key={cooler.product_id}>
                  {cooler.water_cooled ? (
                    <span className="badge bg-primary">Liquid</span>
                  ) : (
                    <span className="badge bg-secondary">Air</span>
                  )}
                </td>
              ))}
            </tr>
            <tr>
              <td>
                <strong>Fan RPM</strong>
              </td>
              {coolers.map((cooler) => (
                <td key={cooler.product_id}>{cooler.fan_rpm || "—"}</td>
              ))}
            </tr>
            <tr>
              <td>
                <strong>Noise Level</strong>
              </td>
              {coolers.map((cooler) => (
                <td key={cooler.product_id}>{cooler.noise_level || "—"}</td>
              ))}
            </tr>
            <tr>
              <td>
                <strong>Color</strong>
              </td>
              {coolers.map((cooler) => (
                <td key={cooler.product_id}>{cooler.color || "—"}</td>
              ))}
            </tr>
            <tr>
              <td>
                <strong>Height</strong>
              </td>
              {coolers.map((cooler) => (
                <td key={cooler.product_id}>{cooler.height || "—"}</td>
              ))}
            </tr>
            <tr>
              <td>
                <strong>Description</strong>
              </td>
              {coolers.map((cooler) => (
                <td
                  key={cooler.product_id}
                  style={{
                    whiteSpace: "pre-line",
                    textAlign: "justify",
                    fontSize: "0.95em",
                    verticalAlign: "top",
                  }}
                >
                  {cooler.description || "—"}
                </td>
              ))}
            </tr>
            <tr>
              <td>
                <strong>Price</strong>
              </td>
              {coolers.map((cooler) => (
                <td key={cooler.product_id} className="price">
                  LKR {cooler.price?.toLocaleString() || "N/A"}
                </td>
              ))}
            </tr>
          </tbody>
        </Table>

        <div className="text-center mt-4">
          <Button variant="primary" size="lg" onClick={handleBackToSelection}>
            <ArrowLeft className="me-2" />
            Back to CPU Cooler Selection
          </Button>
        </div>
      </Container>
    </>
  );
}
