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
  Alert,
  Spinner,
} from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingScreen from "../../components/loading/LoadingScreen";
import ImagePreview from "../../components/ImagePreview";
import axios from "axios";

const Inventory = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showStockModal, setShowStockModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const productsPerPage = 10;

  // API state
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [stockFormData, setStockFormData] = useState({
    stock: "",
    status: "",
    lastRestockDate: "",
  });
  
  // State to track if notifications have been sent for current session
  const [notificationsSent, setNotificationsSent] = useState(false);

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

  // Fetch inventory from backend API
  const fetchInventory = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/getProducts.php`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        // Transform the data to match inventory expectations
        const transformedInventory = data.products.map((product) => ({
          id: product.product_id,
          name: product.name,
          category: product.category,
          sku: `SKU-${product.product_id.toString().padStart(6, "0")}`,
          currentStock: product.stock || 0,
          minStock: 5, // Fixed minimum stock
          status: product.status || "In Stock", // Use status from database
          lastRestock: product.last_restock_date
            ? new Date(product.last_restock_date).toLocaleDateString()
            : "N/A",
          value: (product.stock || 0) * parseFloat(product.price),
          price: parseFloat(product.price),
          image: product.image_url
            ? `${API_BASE_URL}/${product.image_url}`
            : "/placeholder.svg?height=200&width=200",
          description: product.description,
          manufacturer: product.manufacturer,
        }));

        setInventory(transformedInventory);
      } else {
        toast.error(data.message || "Failed to fetch inventory", {
          autoClose: 2000,
          hideProgressBar: false,
        });
      }
    } catch (err) {
      toast.error("Error connecting to server: " + err.message, {
        autoClose: 2000,
        hideProgressBar: false,
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to create low stock notifications
  const createLowStockNotifications = async (lowStockItems) => {
    if (lowStockItems.length === 0) return;
    
    try {
      // Get session to verify user is logged in as seller
      const sessionResponse = await axios.get(
        'http://localhost/gearsphere_api/GearSphere-BackEnd/getSession.php',
        { withCredentials: true }
      );

      if (!sessionResponse.data.success || sessionResponse.data.user_type !== 'seller') {
        return; // Only sellers can receive inventory notifications
      }

      const sellerId = sessionResponse.data.user_id;
      
      // Create a comprehensive low stock notification message
      let message = `Low Stock Alert!\nYou have ${lowStockItems.length} items that need attention:\n\n`;
      
      lowStockItems.slice(0, 10).forEach(item => { // Limit to 10 items to avoid overly long messages
        message += `${item.name} - Current Stock: ${item.currentStock} (Min: ${item.minStock})\n`;
      });
      
      if (lowStockItems.length > 10) {
        message += `\n... and ${lowStockItems.length - 10} more items`;
      }

      // Send notification to backend
      await axios.post(
        'http://localhost/gearsphere_api/GearSphere-BackEnd/addNotification.php',
        {
          user_id: sellerId,
          message: message
        },
        { withCredentials: true }
      );
      
    } catch (error) {
      // Failed to send low stock notification
    }
  };

  // Load inventory on component mount
  useEffect(() => {
    fetchInventory();
  }, []);

  // Create notifications when inventory changes and low stock items are detected
  useEffect(() => {
    if (inventory.length > 0) {
      const currentLowStockItems = inventory.filter(item => 
        item.status === 'Low Stock' || item.status === 'Out of Stock'
      );
      
      // Only create notifications if there are actually low stock items
      if (currentLowStockItems.length > 0 && !notificationsSent) {
        createLowStockNotifications(currentLowStockItems);
        setNotificationsSent(true); // Mark notifications as sent
      }
    }
  }, [inventory]); // Run when inventory changes

  const getStatusBadge = (status) => {
    const variants = {
      "In Stock": "success",
      "Low Stock": "warning",
      "Out of Stock": "danger",
      Discontinued: "secondary",
    };
    return <Badge bg={variants[status] || "secondary"}>{status}</Badge>;
  };

  const handleUpdateStock = async (productId, newStockData) => {
    try {
      setSubmitting(true);

      // Validate input
      if (!productId) {
        toast.error("Product ID is required", {
          autoClose: 2000,
          hideProgressBar: false,
        });
        return;
      }

      if (!newStockData.stock || newStockData.stock === "") {
        toast.error("Stock quantity is required", {
          autoClose: 2000,
          hideProgressBar: false,
        });
        return;
      }

      const stockValue = parseInt(newStockData.stock);
      if (isNaN(stockValue) || stockValue < 0) {
        toast.error("Stock must be a valid non-negative number", {
          autoClose: 2000,
          hideProgressBar: false,
        });
        return;
      }

      // Create FormData for the stock update
      const formData = new FormData();
      formData.append("product_id", productId.toString());
      formData.append("stock", stockValue.toString());
      // Only send status if Discontinued is selected
      if (newStockData.status === "Discontinued") {
        formData.append("status", "Discontinued");
      }
      formData.append("last_restock_date", newStockData.lastRestockDate);

      const response = await fetch(`${API_BASE_URL}/updateStock.php`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        // Refresh inventory list
        await fetchInventory();
        setShowStockModal(false);
        setStockFormData({
          stock: "",
          status: "",
          lastRestockDate: "",
        });

        // Show success message
        const autoStatus =
          stockValue === 0
            ? "Out of Stock"
            : stockValue <= 5
            ? "Low Stock"
            : "In Stock";
        const finalStatus = result.data.new_status;
        const statusChange =
          result.data.old_status !== finalStatus
            ? `, Status: ${result.data.old_status} → ${finalStatus}`
            : `, Status: ${finalStatus}`;

        const dateInfo = result.data.last_restock_date
          ? `, Last Restock: ${new Date(
              result.data.last_restock_date
            ).toLocaleDateString()}`
          : "";

        toast.success(
          `Updated successfully! ${result.data.product_name}: Stock ${result.data.old_stock} → ${result.data.new_stock}${statusChange}${dateInfo}`,
          {
            autoClose: 2000,
            hideProgressBar: false,
          }
        );
      } else {
        toast.error(result.message || "Failed to update stock and status", {
          autoClose: 2000,
          hideProgressBar: false,
        });
      }
    } catch (err) {
      toast.error("Error updating stock and status: " + err.message, {
        autoClose: 2000,
        hideProgressBar: false,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleStockModalOpen = (product) => {
    setSelectedProduct(product);

    // Format date for date input (YYYY-MM-DD format)
    let formattedDate = "";
    if (product.lastRestock && product.lastRestock !== "N/A") {
      try {
        const date = new Date(product.lastRestock);
        formattedDate = date.toISOString().split("T")[0]; // Get YYYY-MM-DD format
      } catch (e) {
        formattedDate = "";
      }
    }

    // Set status to "Discontinued" only if it's currently discontinued, otherwise empty for auto-calculation
    const statusValue = product.status === "Discontinued" ? "Discontinued" : "";

    setStockFormData({
      stock: product.currentStock.toString(),
      status: statusValue,
      lastRestockDate: formattedDate,
    });
    setShowStockModal(true);
  };

  const handleStockFormChange = (e) => {
    const { name, value } = e.target;
    setStockFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const filteredInventory = inventory.filter(
    (item) =>
      (item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (categoryFilter === "all" || item.category === categoryFilter) &&
      (stockFilter === "all" || item.status === stockFilter)
  );

  const indexOfLastItem = currentPage * productsPerPage;
  const indexOfFirstItem = indexOfLastItem - productsPerPage;
  const currentItems = filteredInventory.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredInventory.length / productsPerPage);

  const lowStockItems = inventory.filter(
    (item) => item.status === "Low Stock" || item.status === "Out of Stock"
  );

  const formatLKR = (amount) => "LKR " + Number(amount).toLocaleString("en-LK");

  if (loading) {
    return (
      <LoadingScreen
        message="Loading Inventory"
        submessage="Fetching product inventory data"
      />
    );
  }

  return (
    <Container className="py-5">
      <h1 className="text-center mb-5">Inventory Management</h1>

      {lowStockItems.length > 0 && (
        <Alert variant="warning" className="mb-4">
          <Alert.Heading>Low Stock Alert!</Alert.Heading>
          <p>You have {lowStockItems.length} items that need attention:</p>
          <ul>
            {lowStockItems.map((item) => (
              <li key={item.id}>
                {item.name} - Current Stock: {item.currentStock} (Min:{" "}
                {item.minStock})
              </li>
            ))}
          </ul>
        </Alert>
      )}

      <Row className="mb-4">
        <Col md={3}>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <h6 className="text-muted mb-2">Total Products</h6>
              <h3>{inventory.length}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <h6 className="text-muted mb-2">Low Stock Items</h6>
              <h3>{lowStockItems.length}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <h6 className="text-muted mb-2">Out of Stock</h6>
              <h3>
                {
                  inventory.filter((item) => item.status === "Out of Stock")
                    .length
                }
              </h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <h6 className="text-muted mb-2">Total Value</h6>
              <h3>
                {formatLKR(
                  inventory.reduce((sum, item) => sum + item.value, 0)
                )}
              </h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="d-flex gap-2">
              <Form.Select
                style={{ width: "200px" }}
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
              <Form.Select
                style={{ width: "200px" }}
                value={stockFilter}
                onChange={(e) => {
  setStockFilter(e.target.value);
  setCurrentPage(1);
}}
              >
                <option value="all">All Stock Status</option>
                <option value="In Stock">In Stock</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </Form.Select>
            </div>
            <Form.Control
              type="search"
              placeholder="Search by name, SKU, or category..."
              style={{ width: "300px" }}
              value={searchQuery}
              onChange={(e) => {
  setSearchQuery(e.target.value);
  setCurrentPage(1);
}}
            />
          </div>

          <Table responsive hover>
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Current Stock</th>
                <th>Status</th>
                <th>Value</th>
                <th>Last Restock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <ImagePreview
                        src={item.image}
                        alt={item.name}
                        width="40px"
                        height="40px"
                        className="rounded me-2"
                        fallbackSrc="/placeholder.svg?height=40&width=40"
                      />
                      <div>
                        <div>{item.name}</div>
                        <small className="text-muted">
                          {item.manufacturer}
                        </small>
                      </div>
                    </div>
                  </td>
                  <td>{item.sku}</td>
                  <td>{item.category}</td>
                  <td>
                    <span
                      className={`fw-bold ${
                        item.currentStock <= item.minStock ? "text-danger" : ""
                      }`}
                    >
                      {item.currentStock}
                    </span>
                  </td>
                  <td>{getStatusBadge(item.status)}</td>
                  <td>{formatLKR(item.value)}</td>
                  <td>{item.lastRestock}</td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleStockModalOpen(item)}
                      disabled={submitting}
                    >
                      {submitting ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        "Update Stock & Status"
                      )}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {currentItems.length === 0 && (
            <div className="text-center py-4">
              <p className="text-muted">
                No inventory items found matching your criteria.
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

      {/* Update Stock Modal */}
      <Modal show={showStockModal} onHide={() => setShowStockModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Stock & Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduct && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Product</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedProduct.name}
                  disabled
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Current Stock *</Form.Label>
                <Form.Control
                  type="number"
                  name="stock"
                  value={stockFormData.stock}
                  onChange={handleStockFormChange}
                  required
                  min="0"
                />
                <Form.Text className="text-muted">
                  Minimum stock level is fixed at 5. Status will automatically
                  update based on stock level.
                </Form.Text>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Control
                  type="text"
                  value={(() => {
                    const stock = parseInt(stockFormData.stock) || 0;
                    if (stock === 0) return "Out of Stock";
                    if (stock <= 5) return "Low Stock";
                    return "In Stock";
                  })()}
                  disabled
                  className="mb-2"
                />
                <Form.Select
                  name="status"
                  value={
                    stockFormData.status === "Discontinued"
                      ? "Discontinued"
                      : ""
                  }
                  onChange={(e) =>
                    setStockFormData((prev) => ({
                      ...prev,
                      status:
                        e.target.value === "Discontinued" ? "Discontinued" : "",
                    }))
                  }
                >
                  <option value="">Auto-calculate based on stock</option>
                  <option value="Discontinued">Discontinued</option>
                </Form.Select>
                <Form.Text className="text-muted">
                  Status automatically updates based on stock: 0 = Out of Stock,
                  1-5 = Low Stock, 6+ = In Stock. You can manually set to
                  "Discontinued" if needed.
                </Form.Text>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Last Restock Date</Form.Label>
                <Form.Control
                  type="date"
                  name="lastRestockDate"
                  value={stockFormData.lastRestockDate}
                  onChange={(e) =>
                    setStockFormData((prev) => ({
                      ...prev,
                      lastRestockDate: e.target.value,
                    }))
                  }
                />
                <Form.Text className="text-muted">
                  Set the date when this product was last restocked.
                </Form.Text>
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowStockModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() =>
              handleUpdateStock(selectedProduct?.id, stockFormData)
            }
            disabled={submitting}
          >
            {submitting ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Update Stock & Status"
            )}
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

export default Inventory;
