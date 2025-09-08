import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Alert,
  Table,
} from "react-bootstrap";
import { PcDisplay } from "react-bootstrap-icons";
import { toast } from "react-toastify";
import CustomerNavbar from "../../pageNavbars/CustomerNavbar";
import LoadingScreen from "../../../components/loading/LoadingScreen";
import axios from "axios";

function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState("lg");
  useEffect(() => {
    function updateBreakpoint() {
      const width = window.innerWidth;
      if (width < 768) setBreakpoint("sm");
      else if (width < 992) setBreakpoint("md");
      else setBreakpoint("lg");
    }
    updateBreakpoint();
    window.addEventListener("resize", updateBreakpoint);
    return () => window.removeEventListener("resize", updateBreakpoint);
  }, []);
  return breakpoint;
}

const caseTableResponsiveStyle = `
  .case-table-sm .case-img {
    width: 40px !important;
    height: 40px !important;
    min-width: 40px !important;
    min-height: 40px !important;
    max-width: 40px !important;
    max-height: 40px !important;
    margin-right: 8px !important;
    border-radius: 6px !important;
    object-fit: cover;
  }
  @media (max-width: 991.98px) {
    .case-table-sm .case-img {
      width: 24px !important;
      height: 24px !important;
      min-width: 24px !important;
      min-height: 24px !important;
      max-width: 24px !important;
      max-height: 24px !important;
      margin-right: 4px !important;
      border-radius: 4px !important;
      object-fit: cover;
    }
  }
  @media (max-width: 576px) {
    .case-table-sm td, .case-table-sm th {
      padding: 0.25rem 0.3rem !important;
      font-size: 0.85rem !important;
    }
    .case-table-sm .case-name {
      font-size: 0.95rem !important;
    }
    .case-table-sm .btn {
      font-size: 0.8rem !important;
      padding: 0.2rem 0.5rem !important;
    }
  }
`;

const selectCaseHeadingStyle = `
  .select-case-heading {
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

export default function CasePage() {
  const [compareSelection, setCompareSelection] = useState([]);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const breakpoint = useBreakpoint();
  let maxCompare = 4;
  if (breakpoint === "md") maxCompare = 3;
  if (breakpoint === "sm") maxCompare = 2;

  const [priceSort, setPriceSort] = useState("default"); // 'default', 'asc', or 'desc'

  useEffect(() => {
    setLoading(true);
    setError(null);
    axios
      .get("http://localhost/gearsphere_api/GearSphere-BackEnd/getPCCases.php")
      .then((response) => {
        const data = response.data;
        if (data.success) {
          setCases(data.data || []);
        } else {
          setError(data.message || "Failed to fetch PC Cases");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch PC Cases");
        setLoading(false);
      });
  }, []);

  let sortedCases = [...cases];
  if (priceSort === "asc") {
    sortedCases.sort((a, b) => a.price - b.price);
  } else if (priceSort === "desc") {
    sortedCases.sort((a, b) => b.price - a.price);
  }

  const handleToggleCompare = (option) => {
    setCompareSelection((prev) => {
      if (prev.some((item) => item.product_id === option.product_id)) {
        return prev.filter((item) => item.product_id !== option.product_id);
      } else {
        if (prev.length >= maxCompare) {
          setTimeout(() => {
            toast.warning(
              `You can only compare up to ${maxCompare} PC Cases at a time on this device.`
            );
          }, 0);
          return prev;
        }
        return [...prev, option];
      }
    });
  };

  const handleSelectCase = (pcCase) => {
    toast.success(`Selected ${pcCase.name}. Redirecting to PC Builder...`);
    setTimeout(() => {
      navigate("/pc-builder", { state: { selectedComponent: pcCase } });
    }, 1000);
  };

  const handleCompareClick = () => {
    navigate("/compare-case", { state: { compareSelection } });
  };

  const handleTogglePriceSort = () => {
    setPriceSort((prev) =>
      prev === "default" ? "asc" : prev === "asc" ? "desc" : "default"
    );
  };

  return (
    <>
      {loading && (
        <LoadingScreen
          message="Loading PC Cases"
          subMessage="Fetching available computer cases"
        />
      )}
      <CustomerNavbar />
      <Container className="py-5">
        <style>{selectCaseHeadingStyle}</style>
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h1 className="mb-0 select-case-heading">Select PC Case</h1>
          <div>
            <Button
              variant="outline-primary"
              size="sm"
              className="me-2"
              onClick={handleTogglePriceSort}
            >
              Price:{" "}
              {priceSort === "default"
                ? "Default"
                : priceSort === "asc"
                ? "Low to High"
                : "High to Low"}
            </Button>
            {compareSelection.length >= 2 && (
              <Button className="btn-darkblue" onClick={handleCompareClick}>
                Compare Selected ({compareSelection.length})
              </Button>
            )}
          </div>
        </div>
        <style>{caseTableResponsiveStyle}</style>
        {error && <Alert variant="danger">{error}</Alert>}
        <Table striped bordered hover responsive className="case-table-sm">
          <thead>
            <tr>
              <th></th>
              <th>Image</th>
              <th>Name</th>
              <th>Type</th>
              <th>Color</th>
              <th>Side Panel</th>
              <th>Max GPU Length</th>
              <th>Volume</th>
              <th>Dimensions</th>
              <th>Price</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sortedCases.length === 0 ? (
              <tr>
                <td colSpan="11" className="text-center text-muted">
                  No PC Cases available.
                </td>
              </tr>
            ) : (
              sortedCases.map((pcCase) => (
                <tr key={pcCase.product_id}>
                  <td>
                    <Form.Check
                      type="checkbox"
                      checked={compareSelection.some(
                        (item) => item.product_id === pcCase.product_id
                      )}
                      onChange={() => handleToggleCompare(pcCase)}
                    />
                  </td>
                  <td className="text-center align-middle">
                    <img
                      src={
                        pcCase.image_url
                          ? `http://localhost/gearsphere_api/GearSphere-BackEnd/${pcCase.image_url}`
                          : "/profile_images/user_image.jpg"
                      }
                      alt={pcCase.name}
                      className="case-img"
                    />
                  </td>
                  <td className="align-middle">
                    <strong className="case-name">{pcCase.name}</strong>
                  </td>
                  <td>{pcCase.type || "—"}</td>
                  <td>{pcCase.color || "—"}</td>
                  <td>{pcCase.side_panel || "—"}</td>
                  <td>{pcCase.max_gpu_length || "—"}</td>
                  <td>{pcCase.volume || "—"}</td>
                  <td>{pcCase.dimensions || "—"}</td>
                  <td>LKR {pcCase.price?.toLocaleString() || "N/A"}</td>
                  <td>
                    <Button
                      className="btn-darkblue"
                      size="sm"
                      onClick={() => handleSelectCase(pcCase)}
                    >
                      Add
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Container>
    </>
  );
}
