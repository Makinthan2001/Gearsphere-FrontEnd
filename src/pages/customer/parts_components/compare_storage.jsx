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
import { Hdd, ArrowLeft } from "react-bootstrap-icons";
import CustomerNavbar from "../../pageNavbars/CustomerNavbar";
import { toast } from "react-toastify";
import axios from "axios";

const compareStorageHeadingStyle = `
  .compare-storage-heading {
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
  .comparison-table .storage-name {
    font-weight: 600;
    color: #1a237e;
  }
  .comparison-table .storage-img {
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
  .storage-compare-card-sm {
    min-width: 200px;
    max-width: 250px;
    margin: 0 auto;
    padding: 1rem 1rem 1.2rem 1rem;
    border-radius: 14px;
  }
  .storage-compare-card-sm .storage-img {
    width: 80px;
    height: 80px;
    margin-bottom: 0.7rem;
  }
  .storage-compare-card-sm .storage-name {
    font-size: 0.95rem;
    margin-bottom: 0.3rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-word;
  }
  .storage-compare-card-sm .price {
    font-size: 1.05rem;
    margin-bottom: 0.4rem;
  }
  .storage-compare-card-sm .btn {
    font-size: 1rem;
    padding: 0.35rem 1.1rem;
  }
  @media (max-width: 991.98px) {
    .storage-compare-card-sm {
      min-width: 170px;
      max-width: 200px;
    }
  }
  @media (max-width: 575.98px) {
    .storage-compare-card-sm {
      min-width: 140px;
      max-width: 170px;
    }
  }
`;

export default function CompareStoragePage() {
  const [storage, setStorage] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get compare selection from navigation state with sessionStorage fallback
    let compareSelection = location.state?.compareSelection || [];

    // Fallback to sessionStorage if navigation state is empty (for page refresh scenarios)
    if (compareSelection.length === 0) {
      const storedSelection = sessionStorage.getItem(
        "storage_compareSelection"
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
        "storage_compareSelection",
        JSON.stringify(compareSelection)
      );
    }

    if (compareSelection.length > 0) {
      const ids = compareSelection.map((stor) => stor.product_id);
      axios
        .get(
          "http://localhost/gearsphere_api/GearSphere-BackEnd/getStorage.php"
        )
        .then((response) => {
          const data = response.data;
          if (data.success) {
            // Filter only those in compare list
            const filtered = (data.data || []).filter((stor) =>
              ids.includes(stor.product_id)
            );
            setStorage(filtered);
          } else {
            toast.error(data.message || "Failed to fetch storage");
          }
          setLoading(false);
        })
        .catch(() => {
          toast.error("Failed to fetch storage");
          setLoading(false);
        });
    } else {
      setLoading(false);
    }

    // Cleanup sessionStorage when component unmounts
    return () => {
      sessionStorage.removeItem("storage_compareSelection");
    };
  }, [location.state]);

  const handleSelectStorage = (stor) => {
    toast.success(`Selected ${stor.name}. Redirecting to PC Builder...`);
    setTimeout(() => {
      navigate("/pc-builder", { state: { selectedComponent: stor } });
    }, 1000);
  };

  const handleBackToSelection = () => {
    navigate("/storage");
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

  if (storage.length === 0) {
    return (
      <>
        <CustomerNavbar />
        <Container className="py-5">
          <Alert variant="warning">
            <h4>No Storage to Compare</h4>
            <p>No storage devices were selected for comparison.</p>
            <Button onClick={handleBackToSelection} variant="primary">
              <ArrowLeft className="me-2" />
              Back to Storage Selection
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
        <style>{compareStorageHeadingStyle}</style>
        <style>{comparisonTableStyle}</style>
        <style>{smallCardStyle}</style>

        <div className="d-flex align-items-center justify-content-between mb-4">
          <h1 className="mb-0 compare-storage-heading">Compare Storage</h1>
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
          {storage.map((stor) => (
            <Col key={stor.name} xs="auto" className="p-0">
              <Card className="h-100 shadow-sm storage-compare-card-sm">
                <Card.Body className="text-center">
                  <img
                    src={
                      stor.image_url
                        ? `http://localhost/gearsphere_api/GearSphere-BackEnd/${stor.image_url}`
                        : "/profile_images/user_image.jpg"
                    }
                    alt={stor.name}
                    className="storage-img mb-2"
                  />
                  <Card.Title className="storage-name">{stor.name}</Card.Title>
                  <Card.Text className="price">
                    LKR {stor.price?.toLocaleString() || "N/A"}
                  </Card.Text>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleSelectStorage(stor)}
                  >
                    Select This Storage
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
              {storage.map((stor) => (
                <th key={stor.name}>{stor.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>Storage Type</strong>
              </td>
              {storage.map((stor) => (
                <td key={stor.name}>{stor.storage_type || "—"}</td>
              ))}
            </tr>
            <tr>
              <td>
                <strong>Capacity</strong>
              </td>
              {storage.map((stor) => (
                <td key={stor.name}>{stor.capacity || "—"}</td>
              ))}
            </tr>
            <tr>
              <td>
                <strong>Interface</strong>
              </td>
              {storage.map((stor) => (
                <td key={stor.name}>{stor.interface || "—"}</td>
              ))}
            </tr>
            <tr>
              <td>
                <strong>Form Factor</strong>
              </td>
              {storage.map((stor) => (
                <td key={stor.name}>{stor.form_factor || "—"}</td>
              ))}
            </tr>
            <tr>
              <td>
                <strong>Description</strong>
              </td>
              {storage.map((stor) => (
                <td
                  key={stor.name}
                  style={{
                    whiteSpace: "pre-line",
                    textAlign: "justify",
                    fontSize: "0.95em",
                    verticalAlign: "top",
                  }}
                >
                  {stor.description || "—"}
                </td>
              ))}
            </tr>
            <tr>
              <td>
                <strong>Price</strong>
              </td>
              {storage.map((stor) => (
                <td key={stor.name} className="price">
                  LKR {stor.price?.toLocaleString() || "N/A"}
                </td>
              ))}
            </tr>
          </tbody>
        </Table>

        <div className="text-center mt-4">
          <Button variant="primary" size="lg" onClick={handleBackToSelection}>
            <ArrowLeft className="me-2" />
            Back to Storage Selection
          </Button>
        </div>
      </Container>
    </>
  );
}
