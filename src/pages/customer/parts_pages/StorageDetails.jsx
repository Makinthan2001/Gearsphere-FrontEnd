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

function StorageDetails({ product }) {
  const navigate = useNavigate();
  const { addToCart, isInCart } = useContext(CartContext);
  const [storageSpecs, setStorageSpecs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStorageSpecs();
  }, [product.product_id]);

  const fetchStorageSpecs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost/gearsphere_api/GearSphere-BackEnd/getStorageDetails.php?product_id=${product.product_id}`
      );

      if (response.data.success) {
        setStorageSpecs(response.data.specs);
      } else {
        setError("Failed to load storage specifications");
      }
    } catch (err) {
      setError("Failed to load storage specifications");
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
        message="Loading Storage Details"
        subMessage="Fetching detailed specifications"
      />
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

      {storageSpecs && (
        <Row className="mt-4">
          <Col>
            <Card>
              <Card.Header>
                <h5 className="mb-0">Storage Specifications</h5>
              </Card.Header>
              <Card.Body>
                <Table striped bordered hover responsive>
                  <tbody>
                    <tr>
                      <td>
                        <strong>Capacity</strong>
                      </td>
                      <td>{storageSpecs.capacity || "N/A"}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Type</strong>
                      </td>
                      <td>{storageSpecs.type || "N/A"}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Cache</strong>
                      </td>
                      <td>{storageSpecs.cache || "N/A"}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Form Factor</strong>
                      </td>
                      <td>{storageSpecs.form_factor || "N/A"}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Interface</strong>
                      </td>
                      <td>{storageSpecs.interface || "N/A"}</td>
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

export default StorageDetails;
