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
import LoadingScreen from "../../../components/loading/LoadingScreen";
import { toast } from "react-toastify";

const compareGpuHeadingStyle = `
  .compare-gpu-heading {
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
  .comparison-table .gpu-name {
    font-weight: 600;
    color: #1a237e;
  }
  .comparison-table .gpu-img {
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
  .gpu-compare-card-sm {
    min-width: 200px;
    max-width: 250px;
    margin: 0 auto;
    padding: 1rem 1rem 1.2rem 1rem;
    border-radius: 14px;
  }
  .gpu-compare-card-sm .gpu-img {
    width: 100px;
    height: 100px;
    margin-bottom: 0.7rem;
    border-radius: 8px;
    object-fit: cover;
  }
  .gpu-compare-card-sm .gpu-name {
    font-size: 0.95rem;
    margin-bottom: 0.3rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-word;
  }
  .gpu-compare-card-sm .price {
    font-size: 1.05rem;
    margin-bottom: 0.4rem;
  }
  .gpu-compare-card-sm .btn {
    font-size: 1rem;
    padding: 0.35rem 1.1rem;
  }
  @media (max-width: 991.98px) {
    .gpu-compare-card-sm {
      min-width: 170px;
      max-width: 200px;
    }
  }
  @media (max-width: 575.98px) {
    .gpu-compare-card-sm {
      min-width: 140px;
      max-width: 170px;
    }
  }
`;

export default function CompareGPUPage() {
  const [gpus, setGpus] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get compare selection from navigation state with sessionStorage fallback
    let compareSelection = location.state?.compareSelection || [];

    // Fallback to sessionStorage if navigation state is empty (for page refresh scenarios)
    if (compareSelection.length === 0) {
      const storedSelection = sessionStorage.getItem("gpu_compareSelection");
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
        "gpu_compareSelection",
        JSON.stringify(compareSelection)
      );
    }

    if (compareSelection.length > 0) {
      try {
        setGpus(compareSelection);
      } catch (error) {
        toast.error("Error loading GPU comparison data");
      }
    }
    setLoading(false);

    // Cleanup sessionStorage when component unmounts
    return () => {
      sessionStorage.removeItem("gpu_compareSelection");
    };
  }, [location.state]);

  const handleSelectGPU = (gpu) => {
    toast.success(`Selected ${gpu.name}. Redirecting to PC Builder...`);
    setTimeout(() => {
      navigate("/pc-builder", { state: { selectedComponent: gpu } });
    }, 1000);
  };

  const handleBackToSelection = () => {
    navigate("/gpu");
  };

  if (loading) {
    return (
      <LoadingScreen
        message="Loading GPU Comparison"
        subMessage="Fetching graphics card comparison data"
      />
    );
  }

  if (gpus.length === 0) {
    return (
      <>
        <CustomerNavbar />
        <Container className="py-5">
          <Alert variant="warning">
            <h4>No GPUs to Compare</h4>
            <p>No Video Cards were selected for comparison.</p>
            <Button onClick={handleBackToSelection} variant="primary">
              <ArrowLeft className="me-2" />
              Back to GPU Selection
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
        <style>{compareGpuHeadingStyle}</style>
        <style>{comparisonTableStyle}</style>
        <style>{smallCardStyle}</style>

        <div className="d-flex align-items-center justify-content-between mb-4">
          <h1 className="mb-0 compare-gpu-heading">Compare Video Cards</h1>
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
          {gpus.map((gpu, index) => (
            <Col key={gpu.product_id} xs="auto" className="p-0">
              <Card className="h-100 shadow-sm gpu-compare-card-sm">
                <Card.Body className="text-center">
                  <img
                    src={
                      gpu.image_url
                        ? `http://localhost/gearsphere_api/GearSphere-BackEnd/${gpu.image_url}`
                        : "/profile_images/user_image.jpg"
                    }
                    alt={gpu.name}
                    className="gpu-img mb-2"
                  />
                  <Card.Title className="gpu-name">{gpu.name}</Card.Title>
                  <Card.Text className="price">
                    LKR {gpu.price?.toLocaleString() || "N/A"}
                  </Card.Text>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleSelectGPU(gpu)}
                  >
                    Select This GPU
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <Table className="comparison-table">
          <thead>
            <tr>
              <th>Specification</th>
              {gpus.map((gpu) => (
                <th key={gpu.product_id}>{gpu.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>Chipset</strong>
              </td>
              {gpus.map((gpu) => (
                <td key={gpu.product_id}>{gpu.chipset || "—"}</td>
              ))}
            </tr>
            <tr>
              <td>
                <strong>Memory</strong>
              </td>
              {gpus.map((gpu) => (
                <td key={gpu.product_id}>{gpu.memory || "—"}</td>
              ))}
            </tr>
            <tr>
              <td>
                <strong>Memory Type</strong>
              </td>
              {gpus.map((gpu) => (
                <td key={gpu.product_id}>{gpu.memory_type || "—"}</td>
              ))}
            </tr>
            <tr>
              <td>
                <strong>Core Clock</strong>
              </td>
              {gpus.map((gpu) => (
                <td key={gpu.product_id}>{gpu.core_clock || "—"}</td>
              ))}
            </tr>
            <tr>
              <td>
                <strong>Boost Clock</strong>
              </td>
              {gpus.map((gpu) => (
                <td key={gpu.product_id}>{gpu.boost_clock || "—"}</td>
              ))}
            </tr>
            <tr>
              <td>
                <strong>Interface</strong>
              </td>
              {gpus.map((gpu) => (
                <td key={gpu.product_id}>{gpu.interface || "—"}</td>
              ))}
            </tr>
            <tr>
              <td>
                <strong>Length</strong>
              </td>
              {gpus.map((gpu) => (
                <td key={gpu.product_id}>{gpu.length || "—"}</td>
              ))}
            </tr>
            <tr>
              <td>
                <strong>TDP</strong>
              </td>
              {gpus.map((gpu) => (
                <td key={gpu.product_id}>{gpu.tdp || "—"}</td>
              ))}
            </tr>
            <tr>
              <td>
                <strong>Cooling</strong>
              </td>
              {gpus.map((gpu) => (
                <td key={gpu.product_id}>{gpu.cooling || "—"}</td>
              ))}
            </tr>
            <tr>
              <td>
                <strong>Description</strong>
              </td>
              {gpus.map((gpu) => (
                <td
                  key={gpu.product_id}
                  style={{
                    textAlign: "justify",
                    fontSize: "0.95em",
                    whiteSpace: "pre-line",
                  }}
                >
                  {gpu.description || "—"}
                </td>
              ))}
            </tr>
            <tr>
              <td>
                <strong>Price</strong>
              </td>
              {gpus.map((gpu) => (
                <td key={gpu.product_id} className="price">
                  LKR {gpu.price?.toLocaleString() || "N/A"}
                </td>
              ))}
            </tr>
          </tbody>
        </Table>
      </Container>
    </>
  );
}
