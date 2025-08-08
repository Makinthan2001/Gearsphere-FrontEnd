import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import logo from '../../images/logo.PNG';

function Footer() {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = document.querySelector('.navbar-custom')?.offsetHeight || 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <footer className="bg-dark text-white py-5">
      <Container>
        <Row>
          <Col md={4} className="mb-4 mb-md-0">
            <div className="d-flex align-items-center mb-3">
              <img src={logo} alt="GearSphere Logo" style={{height: 32, width: 'auto', marginRight: 10, verticalAlign: 'middle', background: '#fff', padding: 4, borderRadius: 8}} />
              <h5 className="mb-0 fw-bold">GearSphere</h5>
            </div>
            <p className="mb-3">Building the future, one custom PC at a time.</p>
            <p className="mb-0 small">© {new Date().getFullYear()} GearSphere. All rights reserved.</p>
          </Col>
          <Col md={4} className="mb-4 mb-md-0">
            <h5 className="mb-3 fw-bold" style={{ marginLeft: '5rem' }}>Quick Links</h5>
            <ul className="list-unstyled" style={{ display: 'flex', flexWrap: 'wrap', gap: 0 }}>
              <li className="mb-2" style={{ flex: '0 0 50%' }}>
                <span onClick={() => scrollToSection('hero')} className="text-white-50 text-decoration-none cursor-pointer hover-text-white" role="button">Home</span>
              </li>
              <li className="mb-2" style={{ flex: '0 0 50%' }}>
                <span onClick={() => scrollToSection('about')} className="text-white-50 text-decoration-none cursor-pointer hover-text-white" role="button">About Us</span>
              </li>
              <li className="mb-2" style={{ flex: '0 0 50%' }}>
                <span onClick={() => scrollToSection('services')} className="text-white-50 text-decoration-none cursor-pointer hover-text-white" role="button">Services</span>
              </li>
              <li className="mb-2" style={{ flex: '0 0 50%' }}>
                <span onClick={() => scrollToSection('products')} className="text-white-50 text-decoration-none cursor-pointer hover-text-white" role="button">Products</span>
              </li>
              <li className="mb-2" style={{ flex: '0 0 50%' }}>
                <span onClick={() => scrollToSection('reviews')} className="text-white-50 text-decoration-none cursor-pointer hover-text-white" role="button">Reviews</span>
              </li>
              <li className="mb-2" style={{ flex: '0 0 50%' }}>
                <span onClick={() => scrollToSection('contact')} className="text-white-50 text-decoration-none cursor-pointer hover-text-white" role="button">Contact</span>
              </li>
            </ul>
          </Col>
          <Col md={4}>
            <h5 className="mb-3 fw-bold" style={{ marginLeft: '5rem' }}>Contact Info</h5>
            <ul className="list-unstyled">
              <li className="mb-2 text-white-50" style={{ fontSize: '0.9rem' }}>
                <strong>Address:</strong> Pasara Road, Badulla City, 90 000
              </li>
              <li className="mb-2 text-white-50" style={{ fontSize: '0.9rem' }}>
                <strong>Phone:</strong> +94 (70) 407 9547 & +94 (76) 375 3730
              </li>
              <li className="mb-2 text-white-50" style={{ fontSize: '0.9rem' }}>
                <strong>Email:</strong> info@gearsphere.com & support@gearsphere.com
              </li>
            </ul>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
