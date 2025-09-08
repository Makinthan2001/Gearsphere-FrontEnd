// import React from 'react';
// import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
// import { BarChart, PieChart, Download, GraphUp } from 'react-bootstrap-icons';

// function Reports() {
//   return (
//     <Container className="py-5">
//       <h1 className="mb-4">Reports & Analytics</h1>
      
//       {/* Date Range Filter */}
//       <Row className="mb-4">
//         <Col md={6} className="d-flex gap-2">
//           <Form.Group className="flex-grow-1">
//             <Form.Label>From</Form.Label>
//             <Form.Control type="date" />
//           </Form.Group>
//           <Form.Group className="flex-grow-1">
//             <Form.Label>To</Form.Label>
//             <Form.Control type="date" />
//           </Form.Group>
//         </Col>
//         <Col md={6} className="d-flex justify-content-md-end align-items-end">
//           <Button variant="outline-primary">
//             <Download className="me-2" />
//             Export Report
//           </Button>
//         </Col>
//       </Row>

//       {/* Overview Stats */}
//       <Row className="mb-4">
//         <Col md={3}>
//           <Card className="text-center">
//             <Card.Body>
//               <h6>Total Users</h6>
//               <h3>1,234</h3>
//               <small className="text-success">+12% from last month</small>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={3}>
//           <Card className="text-center">
//             <Card.Body>
//               <h6>Total Orders</h6>
//               <h3>456</h3>
//               <small className="text-success">+8% from last month</small>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={3}>
//           <Card className="text-center">
//             <Card.Body>
//               <h6>Revenue</h6>
//               <h3>LKR 45,678</h3>
//               <small className="text-success">+15% from last month</small>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={3}>
//           <Card className="text-center">
//             <Card.Body>
//               <h6>Active Technicians</h6>
//               <h3>89</h3>
//               <small className="text-success">+5% from last month</small>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       {/* Charts */}
//       <Row>
//         <Col md={8} className="mb-4">
//           <Card>
//             <Card.Body>
//               <h5 className="mb-4">Revenue Overview</h5>
//               <div style={{ height: "300px" }} className="d-flex align-items-center justify-content-center">
//                 <GraphUp size={48} className="text-muted" />
//                 <span className="ms-2 text-muted">Revenue chart will be displayed here</span>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={4} className="mb-4">
//           <Card>
//             <Card.Body>
//               <h5 className="mb-4">User Distribution</h5>
//               <div style={{ height: "300px" }} className="d-flex align-items-center justify-content-center">
//                 <PieChart size={48} className="text-muted" />
//                 <span className="ms-2 text-muted">User distribution chart will be displayed here</span>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={6} className="mb-4">
//           <Card>
//             <Card.Body>
//               <h5 className="mb-4">Top Products</h5>
//               <div style={{ height: "300px" }} className="d-flex align-items-center justify-content-center">
//                 <BarChart size={48} className="text-muted" />
//                 <span className="ms-2 text-muted">Top products chart will be displayed here</span>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={6} className="mb-4">
//           <Card>
//             <Card.Body>
//               <h5 className="mb-4">Service Requests</h5>
//               <div style={{ height: "300px" }} className="d-flex align-items-center justify-content-center">
//                 <BarChart size={48} className="text-muted" />
//                 <span className="ms-2 text-muted">Service requests chart will be displayed here</span>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// }

// export default Reports; 
