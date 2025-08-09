import React, { useState, useContext, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Badge,
  Pagination,
  Toast,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { CartContext } from "./CartContext";
import LoadingScreen from "../../components/loading/LoadingScreen";

function Marketplace() {
  const navigate = useNavigate();
  const { addToCart, isInCart } = useContext(CartContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [addedProduct, setAddedProduct] = useState(null);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const productsPerPage = 12;
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch("http://localhost/gearsphere_api/GearSphere-BackEnd/getProducts.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.products)) {
          setProducts(data.products.map((p) => ({ ...p, id: p.product_id })));
        } else setProducts([]);
      })
      .catch(() => setProducts([]))
      .finally(() => setIsLoading(false));
  }, []);

  const categories = [
    "Video Card", // was 'Graphics Card'
    "CPU",
    "Memory",
    "Storage",
    "Motherboard",
    "Power Supply",
    "PC Case", // was 'Case'
    "CPU Cooler", // was 'Cooling'
    "Monitor",
    "Keyboard",
    "Mouse",
    "Headset",
    "Microphone",
    "Webcam",
    "Speakers",
    "Network Card",
    "Sound Card",
    "Cables",
    "Thermal Paste",
    "Fans",
  ];

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

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedProduct(product);
    setShowToast(true);
  };

  const truncateDescription = (description, maxLength = 80) => {
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + "...";
  };

  const filteredProducts = products.filter(
    (product) =>
      (product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase())) &&
      (categoryFilter === "all" || product.category === categoryFilter)
  );

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Show loading screen while data is being fetched
  if (isLoading) {
    return (
      <LoadingScreen
        message="Loading Marketplace"
        subMessage="Fetching available PC components"
      />
    );
  }

  return (
    <Container className="py-5">
      <h1 className="text-center mb-5">PC Parts Marketplace</h1>

      {/* Success Toast */}
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        style={{
          position: "fixed",
          top: 20,
          right: 20,
          zIndex: 9999,
        }}
        delay={3000}
        autohide
      >
        <Toast.Header>
          <strong className="me-auto">Added to Cart!</strong>
        </Toast.Header>
        <Toast.Body>
          {addedProduct?.name} has been added to your cart.
        </Toast.Body>
      </Toast>

      {/* Search and Filter Section */}
      <Row className="mb-4">
        <Col md={6}>
          <Form.Control
            type="search"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </Col>
        <Col md={6}>
          <Form.Select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      {/* Products Grid */}
      <Row>
        {currentProducts.map((product) => (
          <Col key={product.id} lg={3} md={4} sm={6} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Img
                variant="top"
                src={
                  product.image_url
                    ? `http://localhost/gearsphere_api/GearSphere-BackEnd/${product.image_url}`
                    : "/placeholder.svg?height=200&width=200"
                }
                alt={product.name}
                style={{
                  height: "200px",
                  objectFit: "contain",
                  padding: "8px",
                  background: "rgba(0,255,247,0.04)",
                  borderRadius: "12px",
                  margin: "12px",
                }}
              />
              <Card.Body className="d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <Badge bg="primary" className="mb-1">
                    {product.category}
                  </Badge>
                  {getStatusBadge(product.status)}
                </div>
                <Card.Title className="h6">{product.name}</Card.Title>
                <div
                  className="text-muted small flex-grow-1"
                  style={{
                    cursor: "pointer",
                    minHeight: "40px",
                    padding: "8px",
                    border: "1px solid #e9ecef",
                    borderRadius: "4px",
                    backgroundColor: "#f8f9fa",
                    position: "relative",
                  }}
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                >
                  {truncateDescription(product.description)}
                  {hoveredProduct === product.id && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: "100%",
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "#333",
                        color: "white",
                        padding: "1px 4px",
                        fontSize: "14px",
                        whiteSpace: "pre-wrap",
                        width: "300px",
                        maxWidth: "300px",
                        zIndex: 9999,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                        marginBottom: "8px",
                        wordWrap: "break-word",
                        border: "1px solid #555",
                        lineHeight: "1.2",
                        borderRadius: "6px",
                        opacity: "0.9",
                      }}
                    >
                      {product.description}
                      <div
                        style={{
                          position: "absolute",
                          top: "100%",
                          left: "50%",
                          transform: "translateX(-50%)",
                          border: "5px solid transparent",
                          borderTopColor: "#333",
                        }}
                      />
                    </div>
                  )}
                </div>
                <div className="mt-auto">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="h5 mb-0 text-primary">
                      {formatLKR(product.price)}
                    </span>
                    <div className="d-flex align-items-center">
                      <span className="me-1 small">{product.rating}</span>
                      <i className="bi bi-star-fill text-warning small"></i>
                    </div>
                  </div>
                  <Button
                    variant={isInCart(product.id) ? "success" : "primary"}
                    className="w-100"
                    disabled={product.status === "Out of Stock"}
                    onClick={() => handleAddToCart(product)}
                  >
                    {product.status === "Out of Stock"
                      ? "Out of Stock"
                      : isInCart(product.id)
                      ? "Added to Cart ✓"
                      : "Add to Cart"}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination>
            <Pagination.Prev
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            />
            {[...Array(totalPages)].map((_, index) => (
              <Pagination.Item
                key={index + 1}
                active={index + 1 === currentPage}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            />
          </Pagination>
        </div>
      )}

      {/* No Results Message */}
      {currentProducts.length === 0 && (
        <div className="text-center py-5">
          <h4 className="text-muted">No products found</h4>
          <p className="text-muted">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </Container>
  );
}

export default Marketplace;
