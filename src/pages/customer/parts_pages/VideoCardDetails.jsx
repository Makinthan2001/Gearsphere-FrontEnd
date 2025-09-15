import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Table,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../CartContext";
import { toast } from "react-toastify";
import LoadingScreen from "../../../components/loading/LoadingScreen";
import axios from "axios";

function VideoCardDetails({ product }) {
  const navigate = useNavigate();
  const { addToCart, isInCart } = useContext(CartContext);
  const [videoCardSpecs, setVideoCardSpecs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVideoCardSpecs();
  }, [product.product_id]);

  const fetchVideoCardSpecs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost/gearsphere_api/GearSphere-BackEnd/getVideoCardDetails.php?product_id=${product.product_id}`
      );

      if (response.data.success) {
        setVideoCardSpecs(response.data.specs);
      } else {
        setError("Failed to load video card specifications");
      }
    } catch (err) {
      setError("Failed to load video card specifications");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const formatLKR = (amount) => "LKR " + Number(amount).toLocaleString("en-LK");

  const getStatusBadge = (status) => {
    const variants = {
      Active: "success",
      Inactive: "secondary",
      "Out of Stock": "warning",
      Discontinued: "danger",
    };
    return <Badge bg={variants[status] || "secondary"}>{status}</Badge>;
  };

  if (loading) {
    return (
      <LoadingScreen
        message="Loading Video Card Details"
        subMessage="Fetching detailed specifications"
      />
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <div className="alert alert-danger">{error}</div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <div className="mb-3">
        <Button variant="outline-secondary" onClick={() => navigate(-1)}>
          ← Back to Marketplace
        </Button>
      </div>

      <Row>
        <Col lg={6}>
          <Card className="mb-4">
            <Card.Img
              variant="top"
              src={
                product.image_url
                  ? `http://localhost/gearsphere_api/GearSphere-BackEnd/${product.image_url}`
                  : "/placeholder.svg?height=400&width=400"
              }
              alt={product.name}
              style={{
                height: "400px",
                objectFit: "contain",
                padding: "20px",
                background: "rgba(0,255,247,0.04)",
              }}
            />
          </Card>
        </Col>

        <Col lg={6}>
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <Badge bg="primary" className="mb-2">
                  {product.category}
                </Badge>
                {getStatusBadge(product.status)}
              </div>

              <Card.Title className="h3 mb-3">{product.name}</Card.Title>

              <div className="mb-3">
                <h5 className="text-primary">{formatLKR(product.price)}</h5>
                <p className="text-muted">
                  Manufacturer: {product.manufacturer}
                </p>
                <p className="text-muted">
                  Stock: {product.stock} units available
                </p>
              </div>

              <div className="mb-4">
                <h6>Description</h6>
                <p>{product.description}</p>
              </div>

              <Button
                variant={isInCart(product.product_id) ? "success" : "primary"}
                size="lg"
                className="w-100 mb-3"
                disabled={product.status === "Out of Stock"}
                onClick={handleAddToCart}
              >
                {product.status === "Out of Stock"
                  ? "Out of Stock"
                  : isInCart(product.product_id)
                  ? "Added to Cart ✓"
                  : "Add to Cart"}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {videoCardSpecs && (
        <Row className="mt-4">
          <Col>
            <Card>
              <Card.Header>
                <h5 className="mb-0">Video Card Specifications</h5>
              </Card.Header>
              <Card.Body>
                <Table striped bordered hover responsive>
                  <tbody>
                    <tr>
                      <td>
                        <strong>Chipset</strong>
                      </td>
                      <td>{videoCardSpecs.chipset || "N/A"}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Memory</strong>
                      </td>
                      <td>{videoCardSpecs.memory || "N/A"}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Memory Type</strong>
                      </td>
                      <td>{videoCardSpecs.memory_type || "N/A"}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Core Clock</strong>
                      </td>
                      <td>{videoCardSpecs.core_clock || "N/A"}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Boost Clock</strong>
                      </td>
                      <td>{videoCardSpecs.boost_clock || "N/A"}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Interface</strong>
                      </td>
                      <td>{videoCardSpecs.interface || "N/A"}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Length</strong>
                      </td>
                      <td>{videoCardSpecs.length || "N/A"}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>TDP</strong>
                      </td>
                      <td>{videoCardSpecs.tdp || "N/A"}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Cooling</strong>
                      </td>
                      <td>{videoCardSpecs.cooling || "N/A"}</td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default VideoCardDetails;
