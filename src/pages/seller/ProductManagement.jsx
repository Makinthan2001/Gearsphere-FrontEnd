import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Form,
  Modal,
  Badge,
  Pagination,
  Spinner,
  Alert,
} from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingScreen from "../../components/loading/LoadingScreen";
import ImagePreview from "../../components/ImagePreview";
import CPUForm from "./productForms/CPUForm";
import CPUCoolerForm from "./productForms/CPUCoolerForm";
import MotherboardForm from "./productForms/MotherboardForm";
import MemoryForm from "./productForms/MemoryForm";
import StorageForm from "./productForms/StorageForm";
import VideoCardForm from "./productForms/VideoCardForm";
import PowerSupplyForm from "./productForms/PowerSupplyForm";
import OperatingSystemForm from "./productForms/OperatingSystemForm";
import MonitorForm from "./productForms/MonitorForm";
import PCCaseForm from "./productForms/PCCaseForm";
import GeneralProductForm from "./productForms/GeneralProductForm";
import GeneralProductEditForm from "./editForms/GeneralProductEditForm";

const ProductManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const productsPerPage = 10;

  // API state
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Backend API URL
  const API_BASE_URL = "http://localhost/gearsphere_api/GearSphere-Backend";

  const categories = [
    "CPU",
    "CPU Cooler",
    "Motherboard",
    "Memory",
    "Storage",
    "Video Card",
    "Power Supply",
    "Operating System",
    "Monitor",
    "PC Case",
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

  const [selectedType, setSelectedType] = useState("");
  const [addProductFormKey, setAddProductFormKey] = useState(0);

  const productTypeOptions = [
    { key: "general", label: "General Product", component: GeneralProductForm },
    { key: "cpu", label: "CPU", component: CPUForm },
    { key: "cpu_cooler", label: "CPU Cooler", component: CPUCoolerForm },
    { key: "motherboard", label: "Motherboard", component: MotherboardForm },
    { key: "memory", label: "Memory", component: MemoryForm },
    { key: "storage", label: "Storage", component: StorageForm },
    { key: "video_card", label: "Video Card", component: VideoCardForm },
    { key: "power_supply", label: "Power Supply", component: PowerSupplyForm },
    {
      key: "operating_system",
      label: "Operating System",
      component: OperatingSystemForm,
    },
    { key: "monitor", label: "Monitor", component: MonitorForm },
    { key: "pc_case", label: "PC Case", component: PCCaseForm },
  ];

  // Fetch products from backend API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/getProducts.php`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        // Transform the data to match frontend expectations
        const transformedProducts = data.products.map((product) => ({
          id: product.product_id,
          name: product.name,
          category: product.category,
          price: parseFloat(product.price),
          stock: Number(product.stock) || 0, // Ensure stock is a number
          status: product.status,
          rating: 0, // You might want to add rating field to your database
          sales: 0, // You might want to add sales field to your database
          image: product.image_url
            ? `${API_BASE_URL}/${product.image_url}`
            : "/placeholder.svg?height=200&width=200",
          description: product.description,
          manufacturer: product.manufacturer,
          specific_details: product.specific_details,
        }));

        setProducts(transformedProducts);
      } else {
        setError(data.message || "Failed to fetch products");
      }
    } catch (err) {
      setError("Error connecting to server: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const getStatusBadge = (status) => {
    const variants = {
      Active: "success",
      Inactive: "secondary",
      "Out of Stock": "warning",
      Discontinued: "danger",
    };
    return <Badge bg={variants[status] || "secondary"}>{status}</Badge>;
  };

  const handleAddProduct = async (productData) => {
    try {
      setSubmitting(true);

      // Create FormData for file upload
      const formData = new FormData();

      // Add all form data
      Object.keys(productData).forEach((key) => {
        if (key === "image" && productData[key]) {
          formData.append("image", productData[key]);
        } else if (key !== "image") {
          formData.append(key, productData[key]);
        }
      });

      // Add product type based on category
      const categoryToType = {
        CPU: "cpu",
        "CPU Cooler": "cpu_cooler",
        Motherboard: "motherboard",
        Memory: "memory",
        Storage: "storage",
        "Video Card": "video_card",
        "Power Supply": "power_supply",
        "Operating System": "operating_system",
        Monitor: "monitor",
        "PC Case": "pc_case",
      };

      const productType = categoryToType[productData.category] || "general";
      formData.append("type", productType);

      const response = await fetch(`${API_BASE_URL}/addProduct.php`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        // Refresh products list
        await fetchProducts();
        setShowAddModal(false);
        setSelectedType("");
        setAddProductFormKey((prev) => prev + 1);

        // Show success toast
        toast.success(`Product "${productData.name}" added successfully!`, {
          autoClose: 2000,
          hideProgressBar: false,
        });
      } else {
        toast.error(result.message || "Failed to add product", {
          autoClose: 2000,
          hideProgressBar: false,
        });
      }
    } catch (err) {
      toast.error("Error adding product: " + err.message, {
        autoClose: 2000,
        hideProgressBar: false,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditProduct = async (productData) => {
    try {
      setSubmitting(true);

      // Create FormData for file upload
      const formData = new FormData();

      // Add product ID
      formData.append("product_id", productData.id);

      // Add all form data
      Object.keys(productData).forEach((key) => {
        if (key === "image" && productData[key]) {
          formData.append("image", productData[key]);
        } else if (key !== "image" && key !== "id") {
          formData.append(key, productData[key]);
        }
      });

      // Add product type based on category
      const categoryToType = {
        CPU: "cpu",
        "CPU Cooler": "cpu_cooler",
        Motherboard: "motherboard",
        Memory: "memory",
        Storage: "storage",
        "Video Card": "video_card",
        "Power Supply": "power_supply",
        "Operating System": "operating_system",
        Monitor: "monitor",
        "PC Case": "pc_case",
      };

      const productType = categoryToType[productData.category] || "general";
      formData.append("type", productType);

      const response = await fetch(`${API_BASE_URL}/updateProduct.php`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        // Refresh products list
        await fetchProducts();
        setShowEditModal(false);
        setEditProduct(null);

        // Show success toast
        toast.success(`Product "${productData.name}" updated successfully!`, {
          autoClose: 2000,
          hideProgressBar: false,
        });
      } else {
        toast.error(result.message || "Failed to update product", {
          autoClose: 2000,
          hideProgressBar: false,
        });
      }
    } catch (err) {
      toast.error("Error updating product: " + err.message, {
        autoClose: 2000,
        hideProgressBar: false,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      setSubmitting(true);

      const response = await fetch(`${API_BASE_URL}/deleteProduct.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ product_id: productId }),
      });

      const result = await response.json();

      if (result.success) {
        // Refresh products list
        await fetchProducts();
        setShowDeleteModal(false);

        // Show success toast
        toast.success("Product deleted successfully!", {
          autoClose: 2000,
          hideProgressBar: false,
        });
      } else {
        toast.error(result.message || "Failed to delete product", {
          autoClose: 2000,
          hideProgressBar: false,
        });
      }
    } catch (err) {
      toast.error("Error deleting product: " + err.message, {
        autoClose: 2000,
        hideProgressBar: false,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      (product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (categoryFilter === "all" || product.category === categoryFilter) &&
      true
  );

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const formatLKR = (amount) => "LKR " + Number(amount).toLocaleString("en-LK");

  if (loading) {
    return (
      <LoadingScreen
        message="Loading Products"
        submessage="Fetching product management data"
      />
    );
  }

  return (
    <Container className="py-5">
      <h1 className="text-center mb-5">Product Management</h1>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Filters and Search */}
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Search Products</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Search by name or category..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Category Filter</Form.Label>
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
              </Form.Group>
            </Col>
            <Col md={2} className="d-flex align-items-end ms-auto text-end">
              <Button
                variant="primary"
                onClick={() => {
                  setSelectedType("");
                  setShowAddModal(true);
                }}
                disabled={submitting}
              >
                {submitting ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  "Add Product"
                )}
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Products Table */}
      <Card>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Products ({filteredProducts.length})</h5>
            <small className="text-muted">
              Showing {indexOfFirstProduct + 1}-
              {Math.min(indexOfLastProduct, filteredProducts.length)} of{" "}
              {filteredProducts.length} products
            </small>
          </div>

          <Table responsive hover>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Rating</th>
                <th>Sales</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <ImagePreview
                        src={product.image}
                        alt={product.name}
                        width="40px"
                        height="40px"
                        className="rounded me-2"
                        fallbackSrc="/placeholder.svg?height=40&width=40"
                      />
                      <div>
                        <div>{product.name}</div>
                        <small className="text-muted">ID: {product.id}</small>
                      </div>
                    </div>
                  </td>
                  <td>{product.category}</td>
                  <td>{formatLKR(product.price)}</td>
                  <td>{product.stock}</td>
                  <td>
                    <div className="d-flex align-items-center">
                      <span className="me-1">{product.rating}</span>
                      <i className="bi bi-star-fill text-warning"></i>
                    </div>
                  </td>
                  <td>{product.sales}</td>
                  <td>
                    <div className="d-flex gap-1">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => {
                          setEditProduct(product);
                          setShowEditModal(true);
                        }}
                        disabled={submitting}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => {
                          setSelectedProduct(product);
                          setShowDeleteModal(true);
                        }}
                        disabled={submitting}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {currentProducts.length === 0 && (
            <div className="text-center py-4">
              <p className="text-muted">
                No products found matching your criteria.
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <Pagination>
                <Pagination.First
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                />
                <Pagination.Prev
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                />

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Pagination.Item
                      key={page}
                      active={page === currentPage}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Pagination.Item>
                  )
                )}

                <Pagination.Next
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                />
                <Pagination.Last
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                />
              </Pagination>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Add Product Modal */}
      <Modal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!selectedType ? (
            <div>
              <h6 className="mb-3">Select Product Type:</h6>
              <Row>
                {productTypeOptions.map((option) => (
                  <Col key={option.key} md={6} className="mb-2">
                    <Button
                      variant="outline-primary"
                      className="w-100"
                      onClick={() => setSelectedType(option.key)}
                    >
                      {option.label}
                    </Button>
                  </Col>
                ))}
              </Row>
            </div>
          ) : (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6>
                  Add{" "}
                  {
                    productTypeOptions.find((opt) => opt.key === selectedType)
                      ?.label
                  }
                </h6>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => setSelectedType("")}
                >
                  Change Type
                </Button>
              </div>
              {selectedType &&
                (() => {
                  const FormComponent = productTypeOptions.find(
                    (opt) => opt.key === selectedType
                  )?.component;
                  return FormComponent ? (
                    <FormComponent
                      key={addProductFormKey + selectedType}
                      onSubmit={handleAddProduct}
                    />
                  ) : null;
                })()}
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* Edit Product Modal */}
      <Modal
        show={showEditModal}
        onHide={() => {
          if (!submitting) {
            setShowEditModal(false);
            setEditProduct(null);
          }
        }}
        size="lg"
      >
        <Modal.Header closeButton={!submitting}>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editProduct && (
            <GeneralProductEditForm
              initialData={editProduct}
              onSubmit={handleEditProduct}
              onCancel={() => {
                setShowEditModal(false);
                setEditProduct(null);
              }}
            />
          )}
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete "{selectedProduct?.name}"? This action
          cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => handleDeleteProduct(selectedProduct?.id)}
            disabled={submitting}
          >
            {submitting ? <Spinner animation="border" size="sm" /> : "Delete"}
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={true}
        pauseOnHover={false}
        theme="light"
        limit={3}
        style={{
          zIndex: 9999,
          position: "fixed",
          top: "20px",
          right: "20px",
        }}
        toastStyle={{
          backgroundColor: "white",
          color: "black",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          borderRadius: "8px",
          border: "1px solid #e0e0e0",
        }}
      />
    </Container>
  );
};

export default ProductManagement;
