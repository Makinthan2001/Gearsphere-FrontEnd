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
import { Motherboard } from "react-bootstrap-icons";
import CustomerNavbar from "../../pageNavbars/CustomerNavbar";
import LoadingScreen from "../../../components/loading/LoadingScreen";
import { toast } from "react-toastify";
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

const baseCardStyle = {
  boxShadow: "0 2px 12px rgba(0,0,0,0.10), 0 1.5px 4px rgba(0,0,0,0.08)",
  borderRadius: 16,
  background: "#fff",
  transition:
    "box-shadow 0.3s cubic-bezier(.4,0,.2,1), transform 0.3s cubic-bezier(.4,0,.2,1)",
  animation: "fadeInCard 0.6s ease",
  minHeight: 0,
};
const hoverCardStyle = {
  boxShadow: "0 8px 32px rgba(0,0,0,0.18), 0 3px 12px rgba(0,0,0,0.12)",
  transform: "translateY(-4px) scale(1.03)",
};

if (
  typeof document !== "undefined" &&
  !document.getElementById("fadeInCardKeyframes")
) {
  const style = document.createElement("style");
  style.id = "fadeInCardKeyframes";
  style.innerHTML = `@keyframes fadeInCard { from { opacity: 0; transform: translateY(20px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }`;
  document.head.appendChild(style);
}

const mbTableResponsiveStyle = `
  @media (max-width: 991.98px) {
    .mb-table-sm .mb-img {
      width: 18px !important;
      height: 18px !important;
      min-width: 18px !important;
      min-height: 18px !important;
      max-width: 18px !important;
      max-height: 18px !important;
      margin-right: 4px !important;
      border-radius: 4px !important;
      object-fit: cover;
    }
  }
  @media (max-width: 576px) {
    .mb-table-sm td, .mb-table-sm th {
      padding: 0.25rem 0.3rem !important;
      font-size: 0.85rem !important;
    }
    .mb-table-sm .mb-name {
      font-size: 0.95rem !important;
    }
    .mb-table-sm .btn {
      font-size: 0.8rem !important;
      padding: 0.2rem 0.5rem !important;
    }
  }
`;

const selectMbHeadingStyle = `
  .select-mb-heading {
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

export default function MotherboardPage() {
  const [compareSelection, setCompareSelection] = useState([]);
  const [motherboards, setMotherboards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const breakpoint = useBreakpoint();
  let maxCompare = 4;
  if (breakpoint === "md") maxCompare = 3;
  if (breakpoint === "sm") maxCompare = 2;

  const [priceSort, setPriceSort] = useState("default");

  useEffect(() => {
    setLoading(true);
    setError(null);
    axios
      .get(
        "http://localhost/gearsphere_api/GearSphere-BackEnd/getMotherBoard.php"
      )
      .then((response) => {
        const data = response.data;
        if (data.success) {
          setMotherboards(data.data || []);
        } else {
          setError(data.message || "Failed to fetch motherboards");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch motherboards");
        setLoading(false);
      });
  }, []);

  let sortedMotherboards = [...motherboards];
  if (priceSort === "asc") {
    sortedMotherboards.sort((a, b) => a.price - b.price);
  } else if (priceSort === "desc") {
    sortedMotherboards.sort((a, b) => b.price - a.price);
  }

  const handleToggleCompare = (option) => {
    setCompareSelection((prev) => {
      if (prev.some((item) => item.product_id === option.product_id)) {
        return prev.filter((item) => item.product_id !== option.product_id);
      } else {
        if (prev.length >= maxCompare) {
          setTimeout(() => {
            toast.warning(
              `You can only compare up to ${maxCompare} motherboards at a time on this device.`
            );
          }, 0);
          return prev;
        }
        return [...prev, option];
      }
    });
  };

  const handleSelectMotherboard = (mb) => {
    toast.success(`Selected ${mb.name}. Redirecting to PC Builder...`);
    setTimeout(() => {
      // Navigate back to PC Builder with selected motherboard in state (no sessionStorage)
      navigate("/pc-builder", {
        state: { selectedComponent: mb },
      });
    }, 1000);
  };

  const handleCompareClick = () => {
    // Navigate to compare page with selected items in state (no sessionStorage)
    navigate("/compare-motherboard", {
      state: { compareSelection },
      replace: true,
    });
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
          message="Loading Motherboards"
          subMessage="Fetching available motherboards"
        />
      )}
      <CustomerNavbar />
      <Container className="py-5">
        <style>{selectMbHeadingStyle}</style>
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h1 className="mb-0 select-mb-heading">Select Motherboard</h1>
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
        <style>{mbTableResponsiveStyle}</style>
        <Table striped bordered hover responsive className="mb-table-sm">
          <thead>
            <tr>
              <th></th>
              <th>Image</th>
              <th>Name</th>
              <th>Socket</th>
              <th>Form Factor</th>
              <th>Chipset</th>
              <th>Memory Slots</th>
              <th>Max Memory</th>
              <th>Memory Type</th>
              <th>SATA Ports</th>
              <th>Wi-Fi</th>
              <th>Price</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {error ? (
              <tr>
                <td colSpan="13" className="text-center text-danger">
                  {error}
                </td>
              </tr>
            ) : sortedMotherboards.length === 0 ? (
              <tr>
                <td colSpan="13" className="text-center text-muted">
                  No motherboards available.
                </td>
              </tr>
            ) : (
              sortedMotherboards.map((mb) => (
                <tr key={mb.product_id}>
                  <td>
                    <Form.Check
                      type="checkbox"
                      checked={compareSelection.some(
                        (item) => item.product_id === mb.product_id
                      )}
                      onChange={() => handleToggleCompare(mb)}
                    />
                  </td>
                  <td>
                    {mb.image_url ? (
                      <img
                        src={`http://localhost/gearsphere_api/GearSphere-BackEnd/${mb.image_url}`}
                        alt={mb.name}
                        className="mb-img me-2"
                        style={{
                          width: 40,
                          height: 40,
                          objectFit: "cover",
                          borderRadius: 4,
                        }}
                      />
                    ) : (
                      <Motherboard size={24} className="me-2 text-secondary" />
                    )}
                  </td>
                  <td>
                    <strong className="mb-name">{mb.name}</strong>
                  </td>
                  <td>{mb.socket || "—"}</td>
                  <td>{mb.form_factor || "—"}</td>
                  <td>{mb.chipset || "—"}</td>
                  <td>{mb.memory_slots ?? "—"}</td>
                  <td>{mb.memory_max || "—"}</td>
                  <td>{mb.memory_type || "—"}</td>
                  <td>{mb.sata_ports ?? "—"}</td>
                  <td>{mb.wifi === 1 ? "Yes" : mb.wifi === 0 ? "No" : "—"}</td>
                  <td>LKR {mb.price ? mb.price.toLocaleString() : "—"}</td>
                  <td>
                    <Button
                      className="btn-darkblue"
                      size="sm"
                      onClick={() => handleSelectMotherboard(mb)}
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
