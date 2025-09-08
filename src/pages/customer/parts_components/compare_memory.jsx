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
import { Memory, ArrowLeft } from "react-bootstrap-icons";
import CustomerNavbar from "../../pageNavbars/CustomerNavbar";
import { toast } from "react-toastify";
import axios from "axios";

const compareMemoryHeadingStyle = `
  .compare-memory-heading {
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
  .comparison-table .memory-name {
    font-weight: 600;
    color: #1a237e;
  }
  .comparison-table .memory-img {
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
  .memory-compare-card-sm {
    min-width: 200px;
    max-width: 250px;
    margin: 0 auto;
    padding: 1rem 1rem 1.2rem 1rem;
    border-radius: 14px;
  }
  .memory-compare-card-sm .memory-img {
    width: 80px;
    height: 80px;
    margin-bottom: 0.7rem;
  }
  .memory-compare-card-sm .memory-name {
    font-size: 0.95rem;
    margin-bottom: 0.3rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-word;
  }
  .memory-compare-card-sm .price {
    font-size: 1.05rem;
    margin-bottom: 0.4rem;
  }
  .memory-compare-card-sm .btn {
    font-size: 1rem;
    padding: 0.35rem 1.1rem;
  }
  @media (max-width: 991.98px) {
    .memory-compare-card-sm {
      min-width: 170px;
      max-width: 200px;
    }
  }
  @media (max-width: 575.98px) {
    .memory-compare-card-sm {
      min-width: 140px;
      max-width: 170px;
    }
  }
`;

export default function CompareMemoryPage() {
  const [memory, setMemory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get compare selection from navigation state with sessionStorage fallback
    let compareSelection = location.state?.compareSelection || [];

    // Fallback to sessionStorage if navigation state is empty (for page refresh scenarios)
    if (compareSelection.length === 0) {
      const storedSelection = sessionStorage.getItem("memory_compareSelection");
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
        "memory_compareSelection",
        JSON.stringify(compareSelection)
      );
    }

    if (compareSelection.length > 0) {
      const ids = compareSelection.map((mem) => mem.product_id);
      axios
        .get("http://localhost/gearsphere_api/GearSphere-BackEnd/getMemory.php")
        .then((response) => {
          const data = response.data;
          if (data.success) {
            // Filter only those in compare list
            const filtered = (data.data || []).filter((mem) =>
              ids.includes(mem.product_id)
            );
            setMemory(filtered);
          } else {
            toast.error(data.message || "Failed to fetch memory");
          }
          setLoading(false);
        })
        .catch(() => {
          toast.error("Failed to fetch memory");
          setLoading(false);
        });
    } else {
      setLoading(false);
    }

    // Cleanup sessionStorage when component unmounts
    return () => {
      sessionStorage.removeItem("memory_compareSelection");
    };
  }, [location.state]);

  const handleSelectMemory = (mem) => {
    toast.success(`Selected ${mem.name}. Redirecting to PC Builder...`);
    setTimeout(() => {
      navigate("/pc-builder", { state: { selectedComponent: mem } });
    }, 1000);
  };

  const handleBackToSelection = () => {
    navigate("/memory");
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

  if (memory.length === 0) {
    return (
      <>
        <CustomerNavbar />
        <Container className="py-5">
          <Alert variant="warning">
            <h4>No Memory to Compare</h4>
            <p>No memory modules were selected for comparison.</p>
            <Button onClick={handleBackToSelection} variant="primary">
              <ArrowLeft className="me-2" />
              Back to Memory Selection
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
        <style>{compareMemoryHeadingStyle}</style>
        <style>{comparisonTableStyle}</style>
        <style>{smallCardStyle}</style>

        <div className="d-flex align-items-center justify-content-between mb-4">
          <h1 className="mb-0 compare-memory-heading">Compare Memory</h1>
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
          {memory.map((mem) => (
            <Col key={mem.name} xs="auto" className="p-0">
              <Card className="h-100 shadow-sm memory-compare-card-sm">
                <Card.Body className="text-center">
                  <img
                    src={
                      mem.image_url
                        ? `http://localhost/gearsphere_api/GearSphere-BackEnd/${mem.image_url}`
                        : "/profile_images/user_image.jpg"
                    }
                    alt={mem.name}
                    className="memory-img mb-2"
                  />
                  <Card.Title className="memory-name">{mem.name}</Card.Title>
                  <Card.Text className="price">
                    LKR {mem.price?.toLocaleString() || "N/A"}
                  </Card.Text>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleSelectMemory(mem)}
                  >
                    Select This Memory
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
              {memory.map((mem) => (
                <th key={mem.name}>{mem.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>Memory Type</strong>
              </td>
              {memory.map((mem) => (
                <td key={mem.name}>{mem.memory_type || "—"}</td>
              ))}
            </tr>
            <tr>
              <td>
                <strong>Speed</strong>
              </td>
              {memory.map((mem) => (
                <td key={mem.name}>{mem.speed || "—"}</td>
              ))}
            </tr>
            <tr>
              <td>
                <strong>Modules</strong>
              </td>
              {memory.map((mem) => (
                <td key={mem.name}>{mem.modules || "—"}</td>
              ))}
            </tr>
            <tr>
              <td>
                <strong>CAS Latency</strong>
              </td>
              {memory.map((mem) => (
                <td key={mem.name}>{mem.cas_latency || "—"}</td>
              ))}
            </tr>
            <tr>
              <td>
                <strong>Voltage</strong>
              </td>
              {memory.map((mem) => (
                <td key={mem.name}>{mem.voltage || "—"}</td>
              ))}
            </tr>
            <tr>
              <td>
                <strong>Description</strong>
              </td>
              {memory.map((mem) => (
                <td
                  key={mem.name}
                  style={{
                    whiteSpace: "pre-line",
                    textAlign: "justify",
                    fontSize: "0.95em",
                    verticalAlign: "top",
                  }}
                >
                  {mem.description || "—"}
                </td>
              ))}
            </tr>
            <tr>
              <td>
                <strong>Price</strong>
              </td>
              {memory.map((mem) => (
                <td key={mem.name} className="price">
                  LKR {mem.price?.toLocaleString() || "N/A"}
                </td>
              ))}
            </tr>
          </tbody>
        </Table>

        <div className="text-center mt-4">
          <Button variant="primary" size="lg" onClick={handleBackToSelection}>
            <ArrowLeft className="me-2" />
            Back to Memory Selection
          </Button>
        </div>
      </Container>
    </>
  );
}
