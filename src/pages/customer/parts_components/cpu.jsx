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
import { Cpu } from "react-bootstrap-icons";
import CustomerNavbar from "../../pageNavbars/CustomerNavbar";
import LoadingScreen from "../../../components/loading/LoadingScreen";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

// Add useBreakpoint hook
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

// Inline styles for card
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

// Add fadeInCard keyframes to a style tag if not present
if (
  typeof document !== "undefined" &&
  !document.getElementById("fadeInCardKeyframes")
) {
  const style = document.createElement("style");
  style.id = "fadeInCardKeyframes";
  style.innerHTML = `@keyframes fadeInCard { from { opacity: 0; transform: translateY(20px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }`;
  document.head.appendChild(style);
}

// Add internal CSS for responsive table styling
const cpuTableResponsiveStyle = `
  @media (max-width: 991.98px) {
    .cpu-table-sm .cpu-img {
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
    .cpu-table-sm td, .cpu-table-sm th {
      padding: 0.25rem 0.3rem !important;
      font-size: 0.85rem !important;
    }
    .cpu-table-sm .cpu-name {
      font-size: 0.95rem !important;
    }
    .cpu-table-sm .btn {
      font-size: 0.8rem !important;
      padding: 0.2rem 0.5rem !important;
    }
  }
`;

const selectCpuHeadingStyle = `
  .select-cpu-heading {
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

export default function CPUPage() {
  const [compareSelection, setCompareSelection] = useState([]);
  const [cpus, setCpus] = useState([]);
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
      .get("http://localhost/gearsphere_api/GearSphere-BackEnd/getCPUs.php")
      .then((response) => {
        const data = response.data;
        if (data.success) {
          setCpus(data.data || []);
        } else {
          setError(data.message || "Failed to fetch CPUs");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch CPUs");
        setLoading(false);
      });
  }, []);

  let sortedCpus = [...cpus];
  if (priceSort === "asc") {
    sortedCpus.sort((a, b) => a.price - b.price);
  } else if (priceSort === "desc") {
    sortedCpus.sort((a, b) => b.price - a.price);
  }

  const handleToggleCompare = (option) => {
    setCompareSelection((prev) => {
      if (prev.some((item) => item.product_id === option.product_id)) {
        return prev.filter((item) => item.product_id !== option.product_id);
      } else {
        if (prev.length >= maxCompare) {
          // Don't call toast inside setState - move it outside
          setTimeout(() => {
            toast.warning(
              `You can only compare up to ${maxCompare} CPUs at a time on this device.`,
              {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
              }
            );
          }, 0);
          return prev;
        }
        return [...prev, option];
      }
    });
  };

  const handleSelectCPU = (cpu) => {
    // Remove icon from the CPU object before navigation for cleaner state
    const cpuWithoutIcon = { ...cpu };
    delete cpuWithoutIcon.icon;

    toast.success(`Selected ${cpu.name}. Redirecting to PC Builder...`);
    setTimeout(() => {
      // Navigate back to PC Builder with selected component in state
      navigate("/pc-builder", {
        state: { selectedComponent: cpuWithoutIcon },
      });
    }, 1000);
  };

  const handleCompareClick = () => {
    // Navigate to compare page with selected items in state (no sessionStorage)
    navigate("/compare-cpu", {
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
          message="Loading CPUs"
          subMessage="Fetching available processors"
        />
      )}
      <CustomerNavbar />
      <Container className="py-5">
        <style>{selectCpuHeadingStyle}</style>
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h1 className="mb-0 select-cpu-heading">Select CPU</h1>
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
        <style>{cpuTableResponsiveStyle}</style>
        <Table striped bordered hover responsive className="cpu-table-sm">
          <thead>
            <tr>
              <th></th>
              <th>Image</th>
              <th>Name</th>
              <th>Series</th>
              <th>Socket</th>
              <th>Core Count</th>
              <th>Thread Count</th>
              <th>Base Clock (GHz)</th>
              <th>Boost Clock (GHz)</th>
              <th>TDP</th>
              <th>Integrated Graphics</th>
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
            ) : sortedCpus.length === 0 ? (
              <tr>
                <td colSpan="13" className="text-center text-muted">
                  No CPUs available.
                </td>
              </tr>
            ) : (
              sortedCpus.map((cpu) => (
                <tr key={cpu.product_id}>
                  <td>
                    <Form.Check
                      type="checkbox"
                      checked={compareSelection.some(
                        (item) => item.product_id === cpu.product_id
                      )}
                      onChange={() => handleToggleCompare(cpu)}
                    />
                  </td>
                  <td>
                    {cpu.image_url ? (
                      <img
                        src={`http://localhost/gearsphere_api/GearSphere-BackEnd/${cpu.image_url}`}
                        alt={cpu.name}
                        className="cpu-img me-2"
                        style={{
                          width: 40,
                          height: 40,
                          objectFit: "cover",
                          borderRadius: 4,
                        }}
                      />
                    ) : (
                      <Cpu size={24} className="me-2 text-secondary" />
                    )}
                  </td>
                  <td>
                    <strong className="cpu-name">{cpu.name}</strong>
                  </td>
                  <td>{cpu.series || "—"}</td>
                  <td>{cpu.socket || "—"}</td>
                  <td>{cpu.core_count ?? "—"}</td>
                  <td>{cpu.thread_count ?? "—"}</td>
                  <td>{cpu.core_clock ?? "—"}</td>
                  <td>{cpu.core_boost_clock ?? "—"}</td>
                  <td>{cpu.tdp || "—"}</td>
                  <td>
                    {cpu.integrated_graphics === 1
                      ? "Yes"
                      : cpu.integrated_graphics === 0
                      ? "No"
                      : "—"}
                  </td>
                  <td>LKR {cpu.price ? cpu.price.toLocaleString() : "—"}</td>
                  <td>
                    <Button size="sm" onClick={() => handleSelectCPU(cpu)}>
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
