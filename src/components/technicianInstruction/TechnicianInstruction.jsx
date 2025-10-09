import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import pcGif from '../../images/pc_video.gif';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../signup/Signup.css'; // ✅ Importing styles with blur and buttons

function TechnicianInstruction({ show, onHide, onAgree, imgSrc }) {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => setIsChecked(!isChecked);

  const handleNext = () => {
    if (isChecked) {
      onAgree();
    } else {
      toast.warn('You have to agree to the terms and conditions');
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="xl"
      backdrop="static"
      className="instruction-modal" // ✅ Apply custom modal class for blur and styling
    >
      <div className="d-flex flex-column flex-md-row" style={{ minHeight: 500 }}>
        {/* Left image section */}
        <div
          className="d-none d-md-flex align-items-center justify-content-center"
          style={{
            width: 400,
            borderRadius: '12px 0 0 12px',
            background: '#f8f9fa'
          }}
        >
          <img
            src={imgSrc || pcGif}
            alt="Instructions"
            style={{ width: 350, borderRadius: 12 }}
          />
        </div>

        {/* Right instructions section */}
        <div
          className="flex-grow-1 p-4"
          style={{ background: '#fff', borderRadius: '0 12px 12px 0' }}
        >
          <h3>PC Technician Registration Instructions</h3>
          <p>Welcome to GearSphere! Please adhere to these guidelines for a seamless experience:</p>
          <ul>
            <li>Do can get customer details through the application.</li>
            <li><b>You must submit a PDF, DOC, or DOCX file as proof of your qualifications (CV).</b></li>
            <li>You can get build request after you are verified by the admin .</li>
            <li>All communications with customers must remain within the platform.</li>
            <li>If you are unable to attend to a customer, reject their request within one weeks of the assign date.</li>
            <li>Following these instructions helps maintain the integrity and reliability of our platform.</li>
          </ul>
          <p>Thank you for your cooperation and professionalism.</p>

          <Form.Check
            type="checkbox"
            label="I agree to the terms and conditions."
            checked={isChecked}
            onChange={handleCheckboxChange}
            className="mb-3"
          />

          <div className="d-flex gap-2">
            <Button variant="secondary" onClick={onHide}>Back</Button>
            <Button variant="primary" onClick={handleNext}>Next</Button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </Modal>
  );
}

export default TechnicianInstruction;
