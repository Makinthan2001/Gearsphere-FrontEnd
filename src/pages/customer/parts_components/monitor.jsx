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
import { Display } from "react-bootstrap-icons";
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

export default function MonitorPage() {
  const [monitors, setMonitors] = useState([]);
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
    const fetchMonitors = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost/gearsphere_api/GearSphere-BackEnd/getMonitors.php"
        );
        if (response.data.success) {
          setMonitors(response.data.data);
        } else {
          setError("Failed to fetch monitors");
        }
      } catch (err) {
        setError("Error fetching monitors: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMonitors();
  }, []);

  let sortedOptions = [...monitors];
  if (priceSort === "asc") {
    sortedOptions = [...monitors].sort((a, b) => a.price - b.price);
  } else if (priceSort === "desc") {
    sortedOptions = [...monitors].sort((a, b) => b.price - a.price);
  }

  const handleToggleCompare = (monitor) => {
    setCompareSelection((prev) => {
      if (prev.some((item) => item.product_id === monitor.product_id)) {
        return prev.filter((item) => item.product_id !== monitor.product_id);
      } else {
        if (prev.length >= maxCompare) {
          setTimeout(() => {
            toast.warning(
              `You can only compare up to ${maxCompare} Monitors at a time on this device.`
            );
          }, 0);
          return prev;
        }
        return [...prev, monitor];
      }
    });
  };

  const handleSelect = (monitor) => {
    toast.success(`Selected ${monitor.name}. Redirecting to PC Builder...`);
    setTimeout(() => {
      // Navigate back to PC Builder with selected monitor in state (no sessionStorage)
      navigate("/pc-builder", {
        state: { selectedComponent: monitor },
      });
    }, 1000);
  };

  const handleCompareClick = () => {
    // Navigate to compare page with selected items in state (no sessionStorage)
    navigate("/compare-monitor", {
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
        message="Loading Monitors"
        subMessage="Fetching available displays"
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
          <h1 className="mb-0">Select Monitor</h1>
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
            <Alert.Heading>No Monitors Available</Alert.Heading>
            <p>There are currently no monitors in stock.</p>
          </Alert>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Screen Size</th>
                <th>Resolution</th>
                <th>Refresh Rate</th>
                <th>Panel Type</th>
                <th>Aspect Ratio</th>
                <th>Brightness</th>
                <th>Price</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {sortedOptions.map((monitor) => (
                <tr key={monitor.product_id}>
                  <td>
                    <Form.Check
                      type="checkbox"
                      checked={compareSelection.some(
                        (item) => item.product_id === monitor.product_id
                      )}
                      onChange={() => handleToggleCompare(monitor)}
                    />
                  </td>
                  <td className="d-flex align-items-center">
                    <img
                      src={
                        monitor.image_url
                          ? `http://localhost/gearsphere_api/GearSphere-BackEnd/${monitor.image_url}`
                          : "/profile_images/user_image.jpg"
                      }
                      alt={monitor.name}
                      style={{
                        width: 32,
                        height: 32,
                        marginRight: 8,
                        borderRadius: 6,
                        objectFit: "cover",
                      }}
                    />
                    <strong>{monitor.name}</strong>
                  </td>
                  <td>
                    {monitor.screen_size ? `${monitor.screen_size}"` : "—"}
                  </td>
                  <td>{monitor.resolution || "—"}</td>
                  <td>{monitor.refresh_rate || "—"}</td>
                  <td>
                    <span
                      className={`badge bg-${
                        monitor.panel_type === "IPS"
                          ? "info"
                          : monitor.panel_type === "OLED"
                          ? "dark"
                          : "secondary"
                      }`}
                    >
                      {monitor.panel_type || "—"}
                    </span>
                  </td>
                  <td>{monitor.aspect_ratio || "—"}</td>
                  <td>{monitor.brightness || "—"}</td>
                  <td>LKR {monitor.price?.toLocaleString() || "N/A"}</td>
                  <td>
                    <Button
                      size="sm"
                      className="btn-darkblue"
                      onClick={() => handleSelect(monitor)}
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
