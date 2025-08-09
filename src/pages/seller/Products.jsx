// import React, { useState } from "react";
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   Button,
//   Form,
//   InputGroup,
//   Modal,
// } from "react-bootstrap";
// import { Search, Plus, Pencil, Trash, Star } from "react-bootstrap-icons";
// import LoadingScreen from "../../components/loading/LoadingScreen";
// import { useEffect } from "react";

// function SellerProducts() {
//   const [products, setProducts] = useState([]);
//   const [editModalShow, setEditModalShow] = useState(false);
//   const [editProduct, setEditProduct] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   // Simulate loading for consistency
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setIsLoading(false);
//     }, 800);
//     return () => clearTimeout(timer);
//   }, []);

//   const handleDelete = (id) => {
//     setProducts(products.filter((p) => p.id !== id));
//   };

//   const handleEdit = (product) => {
//     setEditProduct(product);
//     setEditModalShow(true);
//   };

//   const handleEditChange = (e) => {
//     const { name, value } = e.target;
//     setEditProduct((prev) => ({
//       ...prev,
//       [name]: name === "price" || name === "stock" ? Number(value) : value,
//     }));
//   };

//   const handleEditSave = () => {
//     setProducts(
//       products.map((p) => (p.id === editProduct.id ? editProduct : p))
//     );
//     setEditModalShow(false);
//     setEditProduct(null);
//   };

//   // Show loading screen while initializing
//   if (isLoading) {
//     return (
//       <LoadingScreen
//         message="Loading Products"
//         subMessage="Fetching your product inventory"
//       />
//     );
//   }

//   return (
//     <Container className="py-5">
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h1>Products</h1>
//         <Button variant="primary">
//           <Plus className="me-2" />
//           Add Product
//         </Button>
//       </div>

//       {/* Search and Filter */}
//       <Row className="mb-4">
//         <Col md={6}>
//           <InputGroup>
//             <Form.Control placeholder="Search products..." />
//             <Button variant="outline-secondary">
//               <Search />
//             </Button>
//           </InputGroup>
//         </Col>
//         <Col md={6} className="d-flex justify-content-md-end gap-2">
//           <Form.Select style={{ maxWidth: "200px" }}>
//             <option>All Categories</option>
//             <option>CPU</option>
//             <option>GPU</option>
//             <option>Motherboard</option>
//             <option>RAM</option>
//             <option>Storage</option>
//             <option>PSU</option>
//             <option>Case</option>
//           </Form.Select>
//           <Form.Select style={{ maxWidth: "200px" }}>
//             <option>Sort by: Name</option>
//             <option>Price</option>
//             <option>Stock</option>
//             <option>Rating</option>
//           </Form.Select>
//         </Col>
//       </Row>

//       {/* Products Grid */}
//       <Row>
//         {products.map((product) => (
//           <Col key={product.id} md={3} className="mb-4">
//             <Card>
//               <Card.Img
//                 variant="top"
//                 src={product.image}
//                 alt={product.name}
//                 style={{ height: "200px", objectFit: "cover" }}
//               />
//               <Card.Body>
//                 <div className="d-flex justify-content-between align-items-start mb-2">
//                   <h5 className="mb-0">{product.name}</h5>
//                   <div className="d-flex align-items-center">
//                     <Star className="text-warning me-1" size={14} />
//                     <span>{product.rating}</span>
//                   </div>
//                 </div>
//                 <p className="text-muted mb-2">{product.category}</p>
//                 <div className="d-flex justify-content-between align-items-center mb-3">
//                   <h4 className="mb-0">LKR {product.price}</h4>
//                   <span className="badge bg-success">{product.status}</span>
//                 </div>
//                 <div className="d-flex gap-2">
//                   <Button
//                     variant="outline-primary"
//                     className="flex-grow-1"
//                     onClick={() => handleEdit(product)}
//                   >
//                     <Pencil className="me-2" />
//                     Edit
//                   </Button>
//                   <Button
//                     variant="outline-danger"
//                     className="flex-grow-1"
//                     onClick={() => handleDelete(product.id)}
//                   >
//                     <Trash className="me-2" />
//                     Delete
//                   </Button>
//                 </div>
//               </Card.Body>
//             </Card>
//           </Col>
//         ))}
//       </Row>
//       {/* Edit Product Modal */}
//       <Modal
//         show={editModalShow}
//         onHide={() => setEditModalShow(false)}
//         centered
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>Edit Product</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {editProduct && (
//             <Form>
//               <Form.Group className="mb-3">
//                 <Form.Label>Name</Form.Label>
//                 <Form.Control
//                   type="text"
//                   name="name"
//                   value={editProduct.name}
//                   onChange={handleEditChange}
//                 />
//               </Form.Group>
//               <Form.Group className="mb-3">
//                 <Form.Label>Category</Form.Label>
//                 <Form.Select
//                   name="category"
//                   value={editProduct.category}
//                   onChange={handleEditChange}
//                 >
//                   <option>CPU</option>
//                   <option>GPU</option>
//                   <option>Motherboard</option>
//                   <option>RAM</option>
//                   <option>Storage</option>
//                   <option>PSU</option>
//                   <option>Case</option>
//                 </Form.Select>
//               </Form.Group>
//               <Form.Group className="mb-3">
//                 <Form.Label>Price</Form.Label>
//                 <Form.Control
//                   type="number"
//                   name="price"
//                   value={editProduct.price}
//                   onChange={handleEditChange}
//                 />
//               </Form.Group>
//               <Form.Group className="mb-3">
//                 <Form.Label>Stock</Form.Label>
//                 <Form.Control
//                   type="number"
//                   name="stock"
//                   value={editProduct.stock}
//                   onChange={handleEditChange}
//                 />
//               </Form.Group>
//             </Form>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setEditModalShow(false)}>
//             Cancel
//           </Button>
//           <Button variant="primary" onClick={handleEditSave}>
//             Save Changes
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </Container>
//   );
// }

// export default SellerProducts;
