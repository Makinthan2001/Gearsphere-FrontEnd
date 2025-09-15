// import React, { useState } from 'react';
// import { Container, Row, Col, Card, Form, Button, Table, Badge, Modal } from 'react-bootstrap';

// const TechnicianServices = () => {
//   const [showAddServiceModal, setShowAddServiceModal] = useState(false);
//   const [showEditServiceModal, setShowEditServiceModal] = useState(false);
//   const [selectedService, setSelectedService] = useState(null);
//   const [newService, setNewService] = useState({
//     name: '',
//     description: '',
//     price: '',
//     duration: '',
//     category: ''
//   });
//   const [services, setServices] = useState([
//     {
//       id: 1,
//       name: 'PC Building Service',
//       description: 'Professional PC assembly with cable management and testing',
//       price: 100,
//       duration: '2-3 hours',
//       category: 'Assembly',
//       status: 'Active',
//       completedJobs: 45,
//       rating: 4.8
//     },
//     {
//       id: 2,
//       name: 'Hardware Repair',
//       description: 'Diagnosis and repair of PC hardware issues',
//       price: 75,
//       duration: '1-2 hours',
//       category: 'Repair',
//       status: 'Active',
//       completedJobs: 32,
//       rating: 4.9
//     },
//   ]);

//   const categories = [
//     'Assembly',
//     'Repair',
//     'Maintenance',
//     'Upgrade',
//     'Software',
//     'Consultation'
//   ];

//   const handleAddService = (e) => {
//     e.preventDefault();
//     const newId = services.length > 0 ? Math.max(...services.map(s => s.id)) + 1 : 1;
//     setServices(prev => [
//       ...prev,
//       {
//         ...newService,
//         id: newId,
//         price: Number(newService.price),
//         status: 'Active',
//         completedJobs: 0,
//         rating: 0
//       }
//     ]);
//     setShowAddServiceModal(false);
//     setNewService({
//       name: '',
//       description: '',
//       price: '',
//       duration: '',
//       category: ''
//     });
//   };

//   const handleEditService = (e) => {
//     e.preventDefault();
//     setServices(prev => prev.map(service =>
//       service.id === selectedService.id ? { ...selectedService, price: Number(selectedService.price) } : service
//     ));
//     setShowEditServiceModal(false);
//   };

//   const handleDeleteService = (serviceId) => {
//     setServices(prev => prev.filter(service => service.id !== serviceId));
//   };

//   const handleToggleStatus = (serviceId) => {
//     setServices(prev => prev.map(service =>
//       service.id === serviceId
//         ? { ...service, status: service.status === 'Active' ? 'Inactive' : 'Active' }
//         : service
//     ));
//   };

//   return (
//     <Container className="py-5">
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h1>My Services</h1>
//         <Button variant="primary" onClick={() => setShowAddServiceModal(true)}>
//           Add New Service
//         </Button>
//       </div>

//       <Card className="shadow-sm">
//         <Card.Body>
//           <Table responsive hover>
//             <thead>
//               <tr>
//                 <th>Service Name</th>
//                 <th>Category</th>
//                 <th>Price</th>
//                 <th>Duration</th>
//                 <th>Status</th>
//                 <th>Completed Jobs</th>
//                 <th>Rating</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {services.map(service => (
//                 <tr key={service.id}>
//                   <td>
//                     <div>
//                       <strong>{service.name}</strong>
//                       <p className="text-muted mb-0 small">{service.description}</p>
//                     </div>
//                   </td>
//                   <td>{service.category}</td>
//                   <td>LKR {service.price}</td>
//                   <td>{service.duration}</td>
//                   <td>
//                     <Badge bg={service.status === 'Active' ? 'success' : 'secondary'}>
//                       {service.status}
//                     </Badge>
//                   </td>
//                   <td>{service.completedJobs}</td>
//                   <td>
//                     <span className="text-warning">★</span> {service.rating}
//                   </td>
//                   <td>
//                     <Button
//                       variant="outline-primary"
//                       size="sm"
//                       className="me-2"
//                       onClick={() => {
//                         setSelectedService(service);
//                         setShowEditServiceModal(true);
//                       }}
//                     >
//                       Edit
//                     </Button>
//                     <Button
//                       variant="outline-danger"
//                       size="sm"
//                       className="me-2"
//                       onClick={() => handleDeleteService(service.id)}
//                     >
//                       Delete
//                     </Button>
//                     <Button
//                       variant={service.status === 'Active' ? 'outline-secondary' : 'outline-success'}
//                       size="sm"
//                       className={service.status !== 'Active' ? 'activate-btn me-2' : 'me-2'}
//                       onClick={() => handleToggleStatus(service.id)}
//                     >
//                       {service.status === 'Active' ? 'Deactivate' : 'Activate'}
//                     </Button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//         </Card.Body>
//       </Card>

//       {/* Add Service Modal */}
//       <Modal show={showAddServiceModal} onHide={() => setShowAddServiceModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Add New Service</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form onSubmit={handleAddService}>
//             <Form.Group className="mb-3">
//               <Form.Label>Service Name</Form.Label>
//               <Form.Control
//                 type="text"
//                 value={newService.name}
//                 onChange={(e) => setNewService(prev => ({ ...prev, name: e.target.value }))}
//                 required
//               />
//             </Form.Group>

//             <Form.Group className="mb-3">
//               <Form.Label>Description</Form.Label>
//               <Form.Control
//                 as="textarea"
//                 rows={3}
//                 value={newService.description}
//                 onChange={(e) => setNewService(prev => ({ ...prev, description: e.target.value }))}
//                 required
//               />
//             </Form.Group>

//             <Form.Group className="mb-3">
//               <Form.Label>Category</Form.Label>
//               <Form.Select
//                 value={newService.category}
//                 onChange={(e) => setNewService(prev => ({ ...prev, category: e.target.value }))}
//                 required
//               >
//                 <option value="">Select Category</option>
//                 {categories.map(category => (
//                   <option key={category} value={category}>{category}</option>
//                 ))}
//               </Form.Select>
//             </Form.Group>

//             <Row>
//               <Col md={6}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Price (LKR)</Form.Label>
//                   <Form.Control
//                     type="number"
//                     value={newService.price}
//                     onChange={(e) => setNewService(prev => ({ ...prev, price: e.target.value }))}
//                     required
//                   />
//                 </Form.Group>
//               </Col>
//               <Col md={6}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Duration</Form.Label>
//                   <Form.Control
//                     type="text"
//                     placeholder="e.g., 2-3 hours"
//                     value={newService.duration}
//                     onChange={(e) => setNewService(prev => ({ ...prev, duration: e.target.value }))}
//                     required
//                   />
//                 </Form.Group>
//               </Col>
//             </Row>

//             <div className="text-end">
//               <Button variant="secondary" className="me-2" onClick={() => setShowAddServiceModal(false)}>
//                 Cancel
//               </Button>
//               <Button variant="primary" type="submit">
//                 Add Service
//               </Button>
//             </div>
//           </Form>
//         </Modal.Body>
//       </Modal>

//       {/* Edit Service Modal */}
//       <Modal show={showEditServiceModal} onHide={() => setShowEditServiceModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Edit Service</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {selectedService && (
//             <Form onSubmit={handleEditService}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Service Name</Form.Label>
//                 <Form.Control
//                   type="text"
//                   value={selectedService.name}
//                   onChange={(e) => setSelectedService(prev => ({ ...prev, name: e.target.value }))}
//                   required
//                 />
//               </Form.Group>

//               <Form.Group className="mb-3">
//                 <Form.Label>Description</Form.Label>
//                 <Form.Control
//                   as="textarea"
//                   rows={3}
//                   value={selectedService.description}
//                   onChange={(e) => setSelectedService(prev => ({ ...prev, description: e.target.value }))}
//                   required
//                 />
//               </Form.Group>

//               <Form.Group className="mb-3">
//                 <Form.Label>Category</Form.Label>
//                 <Form.Select
//                   value={selectedService.category}
//                   onChange={(e) => setSelectedService(prev => ({ ...prev, category: e.target.value }))}
//                   required
//                 >
//                   {categories.map(category => (
//                     <option key={category} value={category}>{category}</option>
//                   ))}
//                 </Form.Select>
//               </Form.Group>

//               <Row>
//                 <Col md={6}>
//                   <Form.Group className="mb-3">
//                     <Form.Label>Price (LKR)</Form.Label>
//                     <Form.Control
//                       type="number"
//                       value={selectedService.price}
//                       onChange={(e) => setSelectedService(prev => ({ ...prev, price: e.target.value }))}
//                       required
//                     />
//                   </Form.Group>
//                 </Col>
//                 <Col md={6}>
//                   <Form.Group className="mb-3">
//                     <Form.Label>Duration</Form.Label>
//                     <Form.Control
//                       type="text"
//                       value={selectedService.duration}
//                       onChange={(e) => setSelectedService(prev => ({ ...prev, duration: e.target.value }))}
//                       required
//                     />
//                   </Form.Group>
//                 </Col>
//               </Row>

//               <div className="text-end">
//                 <Button variant="secondary" className="me-2" onClick={() => setShowEditServiceModal(false)}>
//                   Cancel
//                 </Button>
//                 <Button variant="primary" type="submit">
//                   Save Changes
//                 </Button>
//               </div>
//             </Form>
//           )}
//         </Modal.Body>
//       </Modal>
//     </Container>
//   );
// };

// export default TechnicianServices; 
