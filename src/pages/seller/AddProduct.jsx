// import React, { useState } from 'react';
// import { Container, Row, Col, Card, Form, Button, Alert, Tabs, Tab } from 'react-bootstrap';
// import CPUForm from './productForms/CPUForm';
// import CPUCoolerForm from './productForms/CPUCoolerForm';
// import MotherboardForm from './productForms/MotherboardForm';
// import MemoryForm from './productForms/MemoryForm';
// import StorageForm from './productForms/StorageForm';
// import VideoCardForm from './productForms/VideoCardForm';
// import PowerSupplyForm from './productForms/PowerSupplyForm';
// import OperatingSystemForm from './productForms/OperatingSystemForm';
// import MonitorForm from './productForms/MonitorForm';
// import PCCaseForm from './productForms/PCCaseForm';
// import GeneralProductForm from './productForms/GeneralProductForm';

// const AddProduct = () => {
//   const [activeTab, setActiveTab] = useState('general');
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [showError, setShowError] = useState(false);
//   const [errorMessage, setErrorMessage] = useState('');

//   const handleSubmit = async (productData) => {
//     try {
//       // TODO: Implement API call to add product
//       console.log('Adding product:', productData);
      
//       // Simulate API call
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//       setShowSuccess(true);
//       setShowError(false);
      
//       // Reset form after successful submission
//       setTimeout(() => {
//         setShowSuccess(false);
//       }, 3000);
      
//     } catch (error) {
//       setErrorMessage(error.message || 'Failed to add product');
//       setShowError(true);
//       setShowSuccess(false);
//     }
//   };

//   const productCategories = [
//     { key: 'general', title: 'General Products', component: GeneralProductForm },
//     { key: 'cpu', title: 'CPU', component: CPUForm },
//     { key: 'cpu_cooler', title: 'CPU Cooler', component: CPUCoolerForm },
//     { key: 'motherboard', title: 'Motherboard', component: MotherboardForm },
//     { key: 'memory', title: 'Memory', component: MemoryForm },
//     { key: 'storage', title: 'Storage', component: StorageForm },
//     { key: 'video_card', title: 'Video Card', component: VideoCardForm },
//     { key: 'power_supply', title: 'Power Supply', component: PowerSupplyForm },
//     { key: 'operating_system', title: 'Operating System', component: OperatingSystemForm },
//     { key: 'monitor', title: 'Monitor', component: MonitorForm },
//     { key: 'pc_case', title: 'PC Case', component: PCCaseForm },
//   ];

//   return (
//     <Container className="py-5">
//       <Row className="justify-content-center">
//         <Col lg={10}>
//           <Card className="shadow">
//             <Card.Header className="bg-primary text-white">
//               <h3 className="mb-0">Add New Product</h3>
//             </Card.Header>
//             <Card.Body>
//               {showSuccess && (
//                 <Alert variant="success" onClose={() => setShowSuccess(false)} dismissible>
//                   Product added successfully!
//                 </Alert>
//               )}
              
//               {showError && (
//                 <Alert variant="danger" onClose={() => setShowError(false)} dismissible>
//                   {errorMessage}
//                 </Alert>
//               )}

//               <Tabs
//                 activeKey={activeTab}
//                 onSelect={(k) => setActiveTab(k)}
//                 className="mb-4"
//                 variant="tabs"
//               >
//                 {productCategories.map(({ key, title, component: Component }) => (
//                   <Tab key={key} eventKey={key} title={title}>
//                     <div className="mt-3">
//                       <Component onSubmit={handleSubmit} />
//                     </div>
//                   </Tab>
//                 ))}
//               </Tabs>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default AddProduct; 
