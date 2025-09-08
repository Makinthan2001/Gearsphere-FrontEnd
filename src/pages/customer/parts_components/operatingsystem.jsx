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

export default function OperatingSystemPage() {
  const [operatingSystems, setOperatingSystems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [compareSelection, setCompareSelection] = useState([]);
  const navigate = useNavigate();
  const breakpoint = useBreakpoint();
  let maxCompare = 4;
  if (breakpoint === "md") maxCompare = 3;
  if (breakpoint === "sm") maxCompare = 2;
  const [priceSort, setPriceSort] = useState("default");

  useEffect(() => {
    const fetchOperatingSystems = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost/gearsphere_api/GearSphere-BackEnd/getOperatingSystems.php"
        );

        if (response.data.success) {
          setOperatingSystems(response.data.data);
        } else {
          toast.error("Failed to load operating systems");
        }
      } catch (error) {
        toast.error("Error loading operating systems");
      } finally {
        setLoading(false);
      }
    };

    fetchOperatingSystems();
  }, []);

  // Sort operating systems based on price
  const sortedOperatingSystems = React.useMemo(() => {
    let sorted = [...operatingSystems];

    if (priceSort === "asc") {
      sorted.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (priceSort === "desc") {
      sorted.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    }

    return sorted;
  }, [operatingSystems, priceSort]);

  const handleToggleCompare = (os) => {
    setCompareSelection((prev) => {
      if (prev.some((item) => item.product_id === os.product_id)) {
        return prev.filter((item) => item.product_id !== os.product_id);
      } else {
        if (prev.length >= maxCompare) {
          setTimeout(() => {
            toast.warning(
              `You can only compare up to ${maxCompare} Operating Systems at a time on this device.`
            );
          }, 0);
          return prev;
        }
        return [...prev, os];
      }
    });
  };

  const handleSelect = (os) => {
    toast.success(`Selected ${os.name}. Redirecting to PC Builder...`);
    setTimeout(() => {
      // Navigate back to PC Builder with selected OS in state (no sessionStorage)
      navigate("/pc-builder", {
        state: { selectedComponent: os },
      });
    }, 1000);
  };

  const handleCompareClick = () => {
    // Navigate to compare page with selected items in state (no sessionStorage)
    navigate("/compare-operatingsystem", {
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
        message="Loading Operating Systems"
        subMessage="Fetching available OS options"
      />
    );
  }

  return (
    <>
      <CustomerNavbar />
      <Container className="py-5">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h1 className="mb-0">Select Operating System</h1>
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
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Model</th>
              <th>Mode</th>
              <th>Version</th>
              <th>Max Memory</th>
              <th>Price</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sortedOperatingSystems.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center text-muted">
                  No Operating Systems available.
                </td>
              </tr>
            ) : (
              sortedOperatingSystems.map((os) => (
                <tr key={os.product_id}>
                  <td>
                    <Form.Check
                      type="checkbox"
                      checked={compareSelection.some(
                        (item) => item.product_id === os.product_id
                      )}
                      onChange={() => handleToggleCompare(os)}
                    />
                  </td>
                  <td className="d-flex align-items-center">
                    <img
                      src={
                        os.image_url
                          ? `http://localhost/gearsphere_api/GearSphere-BackEnd/${os.image_url}`
                          : "/profile_images/user_image.jpg"
                      }
                      alt={os.name}
                      style={{
                        width: 32,
                        height: 32,
                        marginRight: 8,
                        borderRadius: 6,
                        objectFit: "cover",
                      }}
                    />
                    <strong>{os.name}</strong>
                  </td>
                  <td>{os.model || "—"}</td>
                  <td>{os.mode || "—"}</td>
                  <td>{os.version || "—"}</td>
                  <td>{os.max_supported_memory || "—"}</td>
                  <td>
                    {os.price === 0
                      ? "Free"
                      : `LKR ${parseFloat(os.price).toLocaleString()}`}
                  </td>
                  <td>
                    <Button
                      size="sm"
                      variant="success"
                      onClick={() => handleSelect(os)}
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
