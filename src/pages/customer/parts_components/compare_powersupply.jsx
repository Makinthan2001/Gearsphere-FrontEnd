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
import { Power, ArrowLeft } from "react-bootstrap-icons";
import CustomerNavbar from "../../pageNavbars/CustomerNavbar";
import { toast } from "react-toastify";
import axios from "axios";

const comparePSUHeadingStyle = `
  .compare-psu-heading {
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
  .comparison-table .psu-name {
    font-weight: 600;
    color: #1a237e;
  }
  .comparison-table .psu-img {
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
  .psu-compare-card-sm {
    min-width: 200px;
    max-width: 250px;
    margin: 0 auto;
    padding: 1rem 1rem 1.2rem 1rem;
    border-radius: 14px;
  }
  .psu-compare-card-sm .psu-img {
    width: 80px;
    height: 80px;
    margin-bottom: 0.7rem;
  }
  .psu-compare-card-sm .psu-name {
    font-size: 0.95rem;
    margin-bottom: 0.3rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-word;
  }
  .psu-compare-card-sm .price {
    font-size: 1.05rem;
    margin-bottom: 0.4rem;
  }
  .psu-compare-card-sm .btn {
    font-size: 1rem;
    padding: 0.35rem 1.1rem;
  }
  @media (max-width: 991.98px) {
    .psu-compare-card-sm {
      min-width: 170px;
      max-width: 200px;
    }
  }
  @media (max-width: 575.98px) {
    .psu-compare-card-sm {
      min-width: 140px;
      max-width: 170px;
    }
  }
`;

export default function ComparePowerSupplyPage() {
  const [psus, setPsus] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get compare selection from navigation state with sessionStorage fallback
    let compareSelection = location.state?.compareSelection || [];

    // Fallback to sessionStorage if navigation state is empty (for page refresh scenarios)
    if (compareSelection.length === 0) {
      const storedSelection = sessionStorage.getItem(
        "powersupply_compareSelection"
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
        "powersupply_compareSelection",
        JSON.stringify(compareSelection)
      );
    }

    if (compareSelection.length > 0) {
      const ids = compareSelection.map((psu) => psu.product_id);
      axios
        .get(
          "http://localhost/gearsphere_api/GearSphere-BackEnd/getPowerSupply.php"
        )
        .then((response) => {
          const data = response.data;
          if (data.success) {
            // Filter only those in compare list
            const filtered = (data.data || []).filter((psu) =>
              ids.includes(psu.product_id)
            );
            setPsus(filtered);
          } else {
            toast.error(data.message || "Failed to fetch power supplies");
          }
          setLoading(false);
        })
        .catch(() => {
          toast.error("Failed to fetch power supplies");
          setLoading(false);
        });
    } else {
      setLoading(false);
    }

    // Cleanup sessionStorage when component unmounts
    return () => {
      sessionStorage.removeItem("powersupply_compareSelection");
    };
  }, [location.state]);

  const handleSelect = (psu) => {
    toast.success(`Selected ${psu.name}. Redirecting to PC Builder...`);
    setTimeout(() => {
      navigate("/pc-builder", { state: { selectedComponent: psu } });
    }, 1000);
  };

  const handleBackToSelection = () => {
    navigate("/powersupply");
  };

  if (loading) {
    return (
      <>
        <CustomerNavbar />
        <Container className="py-5 text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </Container>
      </>
    );
  }

  if (psus.length === 0) {
    return (
      <>
        <CustomerNavbar />
        <Container className="py-5">
          <Alert variant="warning">
            <h4>No Power Supplies to Compare</h4>
            <p>No Power Supplies were selected for comparison.</p>
            <Button onClick={handleBackToSelection} variant="primary">
              <ArrowLeft className="me-2" />
              Back to Power Supply Selection
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
        <style>{comparePSUHeadingStyle}</style>
        <style>{comparisonTableStyle}</style>
        <style>{smallCardStyle}</style>

        <div className="d-flex align-items-center justify-content-between mb-4">
          <h1 className="mb-0 compare-psu-heading">Compare Power Supplies</h1>
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
          {psus.map((psu) => (
            <Col key={psu.product_id} xs="auto" className="p-0">
              <Card className="h-100 shadow-sm psu-compare-card-sm">
                <Card.Body className="text-center">
                  <img
                    src={
                      psu.image_url
                        ? `http://localhost/gearsphere_api/GearSphere-BackEnd/${psu.image_url}`
                        : "/profile_images/user_image.jpg"
                    }
                    alt={psu.name}
                    className="psu-img mb-2"
                  />
                  <Card.Title className="psu-name">{psu.name}</Card.Title>
                  <Card.Text className="price">
                    LKR {psu.price?.toLocaleString() || "N/A"}
                  </Card.Text>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleSelect(psu)}
                  >
                    Select This Power Supply
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
              {psus.map((psu) => (
                <th key={psu.product_id}>{psu.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>Wattage</strong>
              </td>
              {psus.map((psu) => (
                <td key={psu.product_id}>{psu.wattage || "—"}</td>
              ))}
            </tr>
            <tr>
              <td>
                <strong>Type</strong>
              </td>
              {psus.map((psu) => (
                <td key={psu.product_id}>{psu.psu_type || "—"}</td>
              ))}
            </tr>
            <tr>
              <td>
                <strong>Efficiency</strong>
              </td>
              {psus.map((psu) => (
                <td key={psu.product_id}>{psu.efficiency_rating || "—"}</td>
              ))}
            </tr>
            <tr>
              <td>
                <strong>Length</strong>
              </td>
              {psus.map((psu) => (
                <td key={psu.product_id}>{psu.length || "—"}</td>
              ))}
            </tr>
            <tr>
              <td>
                <strong>Modular</strong>
              </td>
              {psus.map((psu) => (
                <td key={psu.product_id}>{psu.modular || "—"}</td>
              ))}
            </tr>
            <tr>
              <td>
                <strong>SATA Connectors</strong>
              </td>
              {psus.map((psu) => (
                <td key={psu.product_id}>{psu.sata_connectors || "—"}</td>
              ))}
            </tr>
            <tr>
              <td>
                <strong>Description</strong>
              </td>
              {psus.map((psu) => (
                <td
                  key={psu.product_id}
                  style={{
                    whiteSpace: "pre-line",
                    textAlign: "justify",
                    fontSize: "0.95em",
                    verticalAlign: "top",
                  }}
                >
                  {psu.description || "—"}
                </td>
              ))}
            </tr>
            <tr>
              <td>
                <strong>Price</strong>
              </td>
              {psus.map((psu) => (
                <td key={psu.product_id} className="price">
                  LKR {psu.price?.toLocaleString() || "N/A"}
                </td>
              ))}
            </tr>
          </tbody>
        </Table>

        <div className="text-center mt-4">
          <Button variant="primary" size="lg" onClick={handleBackToSelection}>
            <ArrowLeft className="me-2" />
            Back to Power Supply Selection
          </Button>
        </div>
      </Container>
    </>
  );
}
