import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Button, Form, Alert, Table } from "react-bootstrap";
import { Display } from "react-bootstrap-icons";
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

const gpuTableResponsiveStyle = `
  .gpu-table-sm .gpu-img {
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
    .gpu-table-sm .gpu-img {
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
    .gpu-table-sm td, .gpu-table-sm th {
      padding: 0.25rem 0.3rem !important;
      font-size: 0.85rem !important;
    }
    .gpu-table-sm .gpu-name {
      font-size: 0.95rem !important;
    }
    .gpu-table-sm .btn {
      font-size: 0.8rem !important;
      padding: 0.2rem 0.5rem !important;
    }
  }
`;

const selectGpuHeadingStyle = `
  .select-gpu-heading {
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

export default function GPUPage() {
  const [compareSelection, setCompareSelection] = useState([]);
  const [gpus, setGpus] = useState([]);
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
      .get("http://localhost/gearsphere_api/GearSphere-BackEnd/getGPUs.php")
      .then((response) => {
        const data = response.data;
        if (data.success) {
          setGpus(data.data || []);
        } else {
          setError(data.message || "Failed to fetch GPUs");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch GPUs");
        setLoading(false);
      });
  }, []);

  let sortedGpus = [...gpus];
  if (priceSort === "asc") {
    sortedGpus.sort((a, b) => a.price - b.price);
  } else if (priceSort === "desc") {
    sortedGpus.sort((a, b) => b.price - a.price);
  }

  const handleToggleCompare = (option) => {
    setCompareSelection((prev) => {
      if (prev.some((item) => item.product_id === option.product_id)) {
        return prev.filter((item) => item.product_id !== option.product_id);
      } else {
        if (prev.length >= maxCompare) {
          setTimeout(() => {
            toast.warning(
              `You can only compare up to ${maxCompare} Video Cards at a time on this device.`
            );
          }, 0);
          return prev;
        }
        return [...prev, option];
      }
    });
  };

  const handleSelectGPU = (gpu) => {
    toast.success(`Selected ${gpu.name}. Redirecting to PC Builder...`);
    setTimeout(() => {
      // Navigate back to PC Builder with selected component in state
      navigate("/pc-builder", {
        state: { selectedComponent: gpu },
      });
    }, 1000);
  };

  const handleCompareClick = () => {
    // Navigate to compare page with selected items in state (no sessionStorage)
    navigate("/compare-gpu", {
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
          message="Loading GPUs"
          subMessage="Fetching available graphics cards"
        />
      )}
      <CustomerNavbar />
      <Container className="py-5">
        <style>{selectGpuHeadingStyle}</style>
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h1 className="mb-0 select-gpu-heading">Select Video Card</h1>
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
        <style>{gpuTableResponsiveStyle}</style>
        {error && <Alert variant="danger">{error}</Alert>}
        <Table striped bordered hover responsive className="gpu-table-sm">
          <thead>
            <tr>
              <th></th>
              <th>Image</th>
              <th>Name</th>
              <th>Chipset</th>
              <th>Memory</th>
              <th>Memory Type</th>
              <th>Core Clock</th>
              <th>Boost Clock</th>
              <th>Interface</th>
              <th>Length</th>
              <th>TDP</th>
              <th>Cooling</th>
              <th>Price</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sortedGpus.length === 0 ? (
              <tr>
                <td colSpan="14" className="text-center text-muted">
                  No GPUs available.
                </td>
              </tr>
            ) : (
              sortedGpus.map((gpu) => (
                <tr key={gpu.product_id}>
                  <td>
                    <Form.Check
                      type="checkbox"
                      checked={compareSelection.some(
                        (item) => item.product_id === gpu.product_id
                      )}
                      onChange={() => handleToggleCompare(gpu)}
                    />
                  </td>
                  <td className="text-center align-middle">
                    <img
                      src={
                        gpu.image_url
                          ? `http://localhost/gearsphere_api/GearSphere-BackEnd/${gpu.image_url}`
                          : "/profile_images/user_image.jpg"
                      }
                      alt={gpu.name}
                      className="gpu-img"
                    />
                  </td>
                  <td className="align-middle">
                    <strong className="gpu-name">{gpu.name}</strong>
                  </td>
                  <td>{gpu.chipset}</td>
                  <td>{gpu.memory}</td>
                  <td>{gpu.memory_type}</td>
                  <td>{gpu.core_clock}</td>
                  <td>{gpu.boost_clock}</td>
                  <td>{gpu.interface}</td>
                  <td>{gpu.length}</td>
                  <td>{gpu.tdp}</td>
                  <td>{gpu.cooling}</td>
                  <td>LKR {gpu.price?.toLocaleString() || "N/A"}</td>
                  <td>
                    <Button
                      className="btn-darkblue"
                      size="sm"
                      onClick={() => handleSelectGPU(gpu)}
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
