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
import { Fan } from "react-bootstrap-icons";
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

export default function CPUCoolerPage() {
  const [cpuCoolers, setCpuCoolers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [compareSelection, setCompareSelection] = useState([]);
  const navigate = useNavigate();
  const breakpoint = useBreakpoint();
  let maxCompare = 4;
  if (breakpoint === "md") maxCompare = 3;
  if (breakpoint === "sm") maxCompare = 2;
  const [priceSort, setPriceSort] = useState("default");

  useEffect(() => {
    const fetchCPUCoolers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost/gearsphere_api/GearSphere-BackEnd/getCPUCoolers.php"
        );
        if (response.data.success) {
          setCpuCoolers(response.data.data);
        } else {
          setError("Failed to fetch CPU coolers");
        }
      } catch (err) {
        setError("Error fetching CPU coolers: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCPUCoolers();
  }, []);

  let sortedOptions = [...cpuCoolers];
  if (priceSort === "asc") {
    sortedOptions = [...cpuCoolers].sort((a, b) => a.price - b.price);
  } else if (priceSort === "desc") {
    sortedOptions = [...cpuCoolers].sort((a, b) => b.price - a.price);
  }

  const handleToggleCompare = (cooler) => {
    setCompareSelection((prev) => {
      if (prev.some((item) => item.product_id === cooler.product_id)) {
        return prev.filter((item) => item.product_id !== cooler.product_id);
      } else {
        if (prev.length >= maxCompare) {
          // Don't call toast inside setState - move it outside
          setTimeout(() => {
            toast.warning(
              `You can only compare up to ${maxCompare} CPU Coolers at a time on this device.`
            );
          }, 0);
          return prev;
        }
        return [...prev, cooler];
      }
    });
  };

  const handleSelect = (cooler) => {
    toast.success(`Selected ${cooler.name}. Redirecting to PC Builder...`);
    setTimeout(() => {
      // Navigate back to PC Builder with selected cooler in state (no sessionStorage)
      navigate("/pc-builder", {
        state: { selectedComponent: cooler },
      });
    }, 1000);
  };

  const handleCompareClick = () => {
    // Navigate to compare page with selected items in state (no sessionStorage)
    navigate("/compare-cpucooler", {
      state: { compareSelection },
      replace: true,
    });
  };

  const handleTogglePriceSort = () => {
    setPriceSort((prev) =>
      prev === "default" ? "asc" : prev === "asc" ? "desc" : "default"
    );
  };

  if (loading) {
    return (
      <LoadingScreen
        message="Loading CPU Coolers"
        subMessage="Fetching available cooling solutions"
      />
    );
  }

  if (error) {
    return (
      <>
        <CustomerNavbar />
        <Container className="py-5">
          <Alert variant="danger">
            <Alert.Heading>Error</Alert.Heading>
            <p>{error}</p>
          </Alert>
        </Container>
      </>
    );
  }

  return (
    <>
      <CustomerNavbar />
      <Container className="py-5">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h1 className="mb-0">Select CPU Cooler</h1>
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

        {sortedOptions.length === 0 ? (
          <Alert variant="info">
            <Alert.Heading>No CPU Coolers Available</Alert.Heading>
            <p>There are currently no CPU coolers in stock.</p>
          </Alert>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Fan RPM</th>
                <th>Noise Level</th>
                <th>Color</th>
                <th>Height</th>
                <th>Type</th>
                <th>Price</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {sortedOptions.map((cooler) => (
                <tr key={cooler.product_id}>
                  <td>
                    <Form.Check
                      type="checkbox"
                      checked={compareSelection.some(
                        (item) => item.product_id === cooler.product_id
                      )}
                      onChange={() => handleToggleCompare(cooler)}
                    />
                  </td>
                  <td className="d-flex align-items-center">
                    <img
                      src={
                        cooler.image_url
                          ? `http://localhost/gearsphere_api/GearSphere-BackEnd/${cooler.image_url}`
                          : "/profile_images/user_image.jpg"
                      }
                      alt={cooler.name}
                      style={{
                        width: 32,
                        height: 32,
                        marginRight: 8,
                        borderRadius: 6,
                        objectFit: "cover",
                      }}
                    />
                    <strong>{cooler.name}</strong>
                  </td>
                  <td>{cooler.fan_rpm || "—"}</td>
                  <td>{cooler.noise_level || "—"}</td>
                  <td>{cooler.color || "—"}</td>
                  <td>{cooler.height || "—"}</td>
                  <td>
                    {cooler.water_cooled ? (
                      <span className="badge bg-primary">Liquid</span>
                    ) : (
                      <span className="badge bg-secondary">Air</span>
                    )}
                  </td>
                  <td>LKR {cooler.price?.toLocaleString() || "N/A"}</td>
                  <td>
                    <Button
                      size="sm"
                      className="btn-darkblue"
                      onClick={() => handleSelect(cooler)}
                    >
                      Add
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>
    </>
  );
}
