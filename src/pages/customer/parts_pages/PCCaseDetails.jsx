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

function PCCaseDetails({ product }) {
  const navigate = useNavigate();
  const { addToCart, isInCart } = useContext(CartContext);
  const [caseSpecs, setCaseSpecs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCaseSpecs();
  }, [product.product_id]);

  const fetchCaseSpecs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost/gearsphere_api/GearSphere-BackEnd/getPCCaseDetails.php?product_id=${product.product_id}`
      );

      if (response.data.success) {
        setCaseSpecs(response.data.specs);
      } else {
        setError("Failed to load PC Case specifications");
      }
    } catch (err) {
      setError("Failed to load PC Case specifications");
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
        message="Loading PC Case Details"
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

      {caseSpecs && (
        <Row className="mt-4">
          <Col>
            <Card>
              <Card.Header>
                <h5 className="mb-0">PC Case Specifications</h5>
              </Card.Header>
              <Card.Body>
                <Table striped bordered hover responsive>
                  <tbody>
                    <tr>
                      <td>
                        <strong>Type</strong>
                      </td>
                      <td>{caseSpecs.type || "N/A"}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Side Panel</strong>
                      </td>
                      <td>{caseSpecs.side_panel || "N/A"}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Color</strong>
                      </td>
                      <td>{caseSpecs.color || "N/A"}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Max GPU Length</strong>
                      </td>
                      <td>{caseSpecs.max_gpu_length || "N/A"}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Volume</strong>
                      </td>
                      <td>{caseSpecs.volume || "N/A"}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Dimensions</strong>
                      </td>
                      <td>{caseSpecs.dimensions || "N/A"}</td>
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

export default PCCaseDetails;
