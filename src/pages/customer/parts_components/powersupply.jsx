import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Table,
} from "react-bootstrap";
import { Power } from "react-bootstrap-icons";
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

const selectPSUHeadingStyle = `
  .select-psu-heading {
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

const psuTableResponsiveStyle = `
  @media (max-width: 991.98px) {
    .psu-table-sm .psu-img {
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
    .psu-table-sm td, .psu-table-sm th {
      padding: 0.25rem 0.3rem !important;
      font-size: 0.85rem !important;
    }
    .psu-table-sm .psu-name {
      font-size: 0.95rem !important;
    }
    .psu-table-sm .btn {
      font-size: 0.8rem !important;
      padding: 0.2rem 0.5rem !important;
    }
  }
`;

export default function PowerSupplyPage() {
  const [compareSelection, setCompareSelection] = useState([]);
  const [psus, setPsus] = useState([]);
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
        "http://localhost/gearsphere_api/GearSphere-BackEnd/getPowerSupply.php"
      )
      .then((response) => {
        const data = response.data;
        if (data.success) {
          setPsus(data.data || []);
        } else {
          setError(data.message || "Failed to fetch power supplies");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch power supplies");
        setLoading(false);
      });
  }, []);

  let sortedPsus = [...psus];
  if (priceSort === "asc") {
    sortedPsus.sort((a, b) => a.price - b.price);
  } else if (priceSort === "desc") {
    sortedPsus.sort((a, b) => b.price - a.price);
  }

  const handleToggleCompare = (option) => {
    setCompareSelection((prev) => {
      if (prev.some((item) => item.product_id === option.product_id)) {
        return prev.filter((item) => item.product_id !== option.product_id);
      } else {
        if (prev.length >= maxCompare) {
          setTimeout(() => {
            toast.warning(
              `You can only compare up to ${maxCompare} power supplies at a time on this device.`
            );
          }, 0);
          return prev;
        }
        return [...prev, option];
      }
    });
  };

  const handleSelect = (psu) => {
    toast.success(`Selected ${psu.name}. Redirecting to PC Builder...`);
    setTimeout(() => {
      // Navigate back to PC Builder with selected PSU in state (no sessionStorage)
      navigate("/pc-builder", {
        state: { selectedComponent: psu },
      });
    }, 1000);
  };

  const handleCompareClick = () => {
    // Navigate to compare page with selected items in state (no sessionStorage)
    navigate("/compare-powersupply", {
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
          message="Loading Power Supplies"
          subMessage="Fetching available PSU units"
        />
      )}
      <CustomerNavbar />
      <Container className="py-5">
        <style>{selectPSUHeadingStyle}</style>
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h1 className="mb-0 select-psu-heading">Select Power Supply</h1>
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
        <style>{psuTableResponsiveStyle}</style>
        <Table striped bordered hover responsive className="psu-table-sm">
          <thead>
            <tr>
              <th></th>
              <th>Image</th>
              <th>Name</th>
              <th>Wattage</th>
              <th>Type</th>
              <th>Efficiency</th>
              <th>Length</th>
              <th>Modular</th>
              <th>SATA Connectors</th>
              <th>Price</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="11" className="text-center text-muted">
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="11" className="text-center text-danger">
                  {error}
                </td>
              </tr>
            ) : sortedPsus.length === 0 ? (
              <tr>
                <td colSpan="11" className="text-center text-muted">
                  No power supplies available.
                </td>
              </tr>
            ) : (
              sortedPsus.map((psu) => (
                <tr key={psu.product_id}>
                  <td>
                    <Form.Check
                      type="checkbox"
                      checked={compareSelection.some(
                        (item) => item.product_id === psu.product_id
                      )}
                      onChange={() => handleToggleCompare(psu)}
                    />
                  </td>
                  <td>
                    {psu.image_url ? (
                      <img
                        src={`http://localhost/gearsphere_api/GearSphere-BackEnd/${psu.image_url}`}
                        alt={psu.name}
                        className="psu-img me-2"
                        style={{
                          width: 40,
                          height: 40,
                          objectFit: "cover",
                          borderRadius: 4,
                        }}
                      />
                    ) : (
                      <Power size={24} className="me-2 text-secondary" />
                    )}
                  </td>
                  <td>
                    <strong className="psu-name">{psu.name}</strong>
                  </td>
                  <td>{psu.wattage || "—"}</td>
                  <td>{psu.psu_type || "—"}</td>
                  <td>{psu.efficiency_rating || "—"}</td>
                  <td>{psu.length || "—"}</td>
                  <td>{psu.modular || "—"}</td>
                  <td>{psu.sata_connectors || "—"}</td>
                  <td>LKR {psu.price ? psu.price.toLocaleString() : "—"}</td>
                  <td>
                    <Button
                      className="btn-darkblue"
                      size="sm"
                      onClick={() => handleSelect(psu)}
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
