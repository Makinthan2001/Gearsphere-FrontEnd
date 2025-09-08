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
import { Cpu, ArrowLeft } from "react-bootstrap-icons";
import CustomerNavbar from "../../pageNavbars/CustomerNavbar";
import LoadingScreen from "../../../components/loading/LoadingScreen";
import { toast } from "react-toastify";

const compareCpuHeadingStyle = `
  .compare-cpu-heading {
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
  .comparison-table .cpu-name {
    font-weight: 600;
    color: #1a237e;
  }
  .comparison-table .cpu-img {
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
  .cpu-compare-card-sm {
    min-width: 200px;
    max-width: 250px;
    margin: 0 auto;
    padding: 1rem 1rem 1.2rem 1rem;
    border-radius: 14px;
  }
  .cpu-compare-card-sm .cpu-img {
    width: 80px;
    height: 80px;
    margin-bottom: 0.7rem;
  }
  .cpu-compare-card-sm .cpu-name {
    font-size: 0.95rem;
    margin-bottom: 0.3rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-word;
  }
  .cpu-compare-card-sm .price {
    font-size: 1.05rem;
    margin-bottom: 0.4rem;
  }
  .cpu-compare-card-sm .btn {
    font-size: 1rem;
    padding: 0.35rem 1.1rem;
  }
  @media (max-width: 991.98px) {
    .cpu-compare-card-sm {
      min-width: 170px;
      max-width: 200px;
    }
  }
  @media (max-width: 575.98px) {
    .cpu-compare-card-sm {
      min-width: 140px;
      max-width: 170px;
    }
  }
`;

const cpuIconMap = {
  "Intel Core i9-13900K": <Cpu size={24} className="text-primary" />,
  "AMD Ryzen 9 7950X": <Cpu size={24} className="text-danger" />,
  "Intel Core i7-13700K": <Cpu size={24} className="text-primary" />,
  "AMD Ryzen 7 7700X": <Cpu size={24} className="text-danger" />,
  "Intel Core i5-13600K": <Cpu size={24} className="text-primary" />,
  "AMD Ryzen 5 7600X": <Cpu size={24} className="text-danger" />,
  "Intel Core i3-13100": <Cpu size={24} className="text-primary" />,
  "AMD Ryzen 5 5600X": <Cpu size={24} className="text-danger" />,
  "Intel Pentium Gold G6400": <Cpu size={24} className="text-primary" />,
  "AMD Athlon 3000G": <Cpu size={24} className="text-danger" />,
  "Intel Core i9-12900K": <Cpu size={24} className="text-primary" />,
  "AMD Ryzen 9 5900X": <Cpu size={24} className="text-danger" />,
  "Intel Core i5-12400F": <Cpu size={24} className="text-primary" />,
  "AMD Ryzen 7 5800X": <Cpu size={24} className="text-danger" />,
  "Intel Core i7-12700F": <Cpu size={24} className="text-primary" />,
  "AMD Ryzen 3 3200G": <Cpu size={24} className="text-danger" />,
};

export default function CompareCPUPage() {
  const [cpus, setCpus] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get compare selection from navigation state with sessionStorage fallback
    let compareSelection = location.state?.compareSelection || [];

    // Fallback to sessionStorage if navigation state is empty (for page refresh scenarios)
    if (compareSelection.length === 0) {
      const storedSelection = sessionStorage.getItem("cpu_compareSelection");
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
        "cpu_compareSelection",
        JSON.stringify(compareSelection)
      );
    }

    if (compareSelection.length > 0) {
      try {
        const cpusWithIcons = compareSelection.map((cpu) => ({
          ...cpu,
          icon: cpuIconMap[cpu.name] || null,
        }));
        setCpus(cpusWithIcons);
      } catch (error) {
        toast.error("Error loading CPU comparison data");
      }
    }
    setLoading(false);

    // Cleanup sessionStorage when component unmounts
    return () => {
      sessionStorage.removeItem("cpu_compareSelection");
    };
  }, [location.state]);

  const handleSelectCPU = (cpu) => {
    const { icon, ...cpuWithoutIcon } = cpu;
    toast.success(`Selected ${cpu.name}. Redirecting to PC Builder...`);
    setTimeout(() => {
      navigate("/pc-builder", { state: { selectedComponent: cpuWithoutIcon } });
    }, 1000);
  };

  const handleBackToSelection = () => {
    navigate("/cpu");
  };

  if (loading) {
    return (
      <LoadingScreen
        message="Loading CPU Comparison"
        subMessage="Fetching processor comparison data"
      />
    );
  }

  if (cpus.length === 0) {
    return (
      <>
        <CustomerNavbar />
        <Container className="py-5">
          <Alert variant="warning">
            <h4>No CPUs to Compare</h4>
            <p>No CPUs were selected for comparison.</p>
            <Button onClick={handleBackToSelection} variant="primary">
              <ArrowLeft className="me-2" />
              Back to CPU Selection
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
        <style>{compareCpuHeadingStyle}</style>
        <style>{comparisonTableStyle}</style>
        <style>{smallCardStyle}</style>

        <div className="d-flex align-items-center justify-content-between mb-4">
          <h1 className="mb-0 compare-cpu-heading">Compare CPUs</h1>
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
          {cpus.map((cpu, index) => (
            <Col key={cpu.name} xs="auto" className="p-0">
              <Card className="h-100 shadow-sm cpu-compare-card-sm">
                <Card.Body className="text-center">
                  <img
                    src={
                      cpu.image_url
                        ? `http://localhost/gearsphere_api/GearSphere-BackEnd/${cpu.image_url}`
                        : "/profile_images/user_image.jpg"
                    }
                    alt={cpu.name}
                    className="cpu-img mb-2"
                  />
                  <Card.Title className="cpu-name">{cpu.name}</Card.Title>
                  <Card.Text className="price">
                    LKR {cpu.price?.toLocaleString() || "N/A"}
                  </Card.Text>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleSelectCPU(cpu)}
                  >
                    Select This CPU
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
              {cpus.map((cpu) => (
                <th key={cpu.name}>{cpu.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>Cores</strong>
              </td>
              {cpus.map((cpu) => (
                <td key={cpu.name}>{cpu.core_count ?? "—"}</td>
              ))}
            </tr>
            <tr>
              <td>
                <strong>Threads</strong>
              </td>
              {cpus.map((cpu) => (
                <td key={cpu.name}>{cpu.thread_count ?? "—"}</td>
              ))}
            </tr>
            <tr>
              <td>
                <strong>Base Speed (GHz)</strong>
              </td>
              {cpus.map((cpu) => (
                <td key={cpu.name}>{cpu.core_clock ?? "—"}</td>
              ))}
            </tr>
            <tr>
              <td>
                <strong>Boost Speed (GHz)</strong>
              </td>
              {cpus.map((cpu) => (
                <td key={cpu.name}>{cpu.core_boost_clock ?? "—"}</td>
              ))}
            </tr>
            <tr>
              <td>
                <strong>TDP</strong>
              </td>
              {cpus.map((cpu) => (
                <td key={cpu.name}>{cpu.tdp || "—"}</td>
              ))}
            </tr>
            <tr>
              <td>
                <strong>Series</strong>
              </td>
              {cpus.map((cpu) => (
                <td key={cpu.name}>{cpu.series || "—"}</td>
              ))}
            </tr>
            <tr>
              <td>
                <strong>Socket</strong>
              </td>
              {cpus.map((cpu) => (
                <td key={cpu.name}>{cpu.socket || "—"}</td>
              ))}
            </tr>
            <tr>
              <td>
                <strong>Integrated Graphics</strong>
              </td>
              {cpus.map((cpu) => (
                <td key={cpu.name}>
                  {cpu.integrated_graphics === 1
                    ? "Yes"
                    : cpu.integrated_graphics === 0
                    ? "No"
                    : "—"}
                </td>
              ))}
            </tr>
            <tr>
              <td>
                <strong>Description</strong>
              </td>
              {cpus.map((cpu) => (
                <td
                  key={cpu.name}
                  style={{
                    whiteSpace: "pre-line",
                    textAlign: "justify",
                    fontSize: "0.95em",
                    verticalAlign: "top",
                  }}
                >
                  {cpu.description || "—"}
                </td>
              ))}
            </tr>
            <tr>
              <td>
                <strong>Price</strong>
              </td>
              {cpus.map((cpu) => (
                <td key={cpu.name} className="price">
                  LKR {cpu.price?.toLocaleString() || "N/A"}
                </td>
              ))}
            </tr>
          </tbody>
        </Table>

        <div className="text-center mt-4">
          <Button variant="primary" size="lg" onClick={handleBackToSelection}>
            <ArrowLeft className="me-2" />
            Back to CPU Selection
          </Button>
        </div>
      </Container>
    </>
  );
}
