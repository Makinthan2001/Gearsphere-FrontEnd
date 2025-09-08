import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import {
  Modal,
  Form,
  Button,
  Row,
  Col,
  Card,
  Badge,
  Alert,
} from "react-bootstrap";
import {
  CreditCard2Front,
  CreditCard2Back,
  Shield,
  CheckCircle,
} from "react-bootstrap-icons";
import { CartContext } from "./CartContext";
import { OrdersContext } from "./OrdersContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DeliveryCalculator from "./DeliveryCalculator";

const Checkout = ({
  show,
  onHide,
  // Custom order props for PC builds
  customOrderItems = null,
  customOrderTotal = null,
  customOrderType = null,
  onCustomOrderSuccess = null,
}) => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useContext(CartContext);
  const { addOrder } = useContext(OrdersContext);
  const [paymentMethod, setPaymentMethod] = useState("visa");
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [userAddress, setUserAddress] = useState("");
  const [userId, setUserId] = useState(null);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [deliveryAddress, setDeliveryAddress] = useState("");

  // Reset states when modal is closed
  const handleClose = () => {
    setShowSuccess(false);
    setIsProcessing(false);
    setCardNumber("");
    setCardHolder("");
    setExpiryDate("");
    setCvv("");
    setErrors({});
    onHide();
  };

  // Reset success state when modal is opened
  useEffect(() => {
    if (show) {
      setShowSuccess(false);
      setIsProcessing(false);
      fetchUserData();
    }
  }, [show]);

  // Fetch user data to get address for delivery calculation
  const fetchUserData = async () => {
    try {
      const sessionResponse = await axios.get(
        "http://localhost/gearsphere_api/GearSphere-BackEnd/getSession.php",
        { withCredentials: true }
      );

      if (sessionResponse.data.success) {
        const userIdFromSession = sessionResponse.data.user_id;
        setUserId(userIdFromSession);

        const userResponse = await axios.get(
          `http://localhost/gearsphere_api/GearSphere-BackEnd/getCustomer.php?user_id=${userIdFromSession}`,
          { withCredentials: true }
        );

        if (userResponse.data.success && userResponse.data.customer) {
          const address = userResponse.data.customer.address || "";
          setUserAddress(address);
          setDeliveryAddress(address); // Default delivery address to user's address
        }
      }
    } catch (error) {
      toast.error("Failed to load user information");
    }
  };

  // Use custom order data if provided, otherwise use cart data
  const orderItems =
    customOrderItems ||
    cartItems.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      category: item.category,
      quantity: item.quantity,
    }));

  const baseOrderTotal = customOrderTotal || getCartTotal();
  const orderTotal =
    (Number(baseOrderTotal) || 0) + (Number(deliveryCharge) || 0);
  const orderType = customOrderType || "Cart Order";

  const formatLKR = (amount) => {
    // Handle undefined, null, or NaN values
    if (amount === undefined || amount === null || isNaN(amount)) {
      return "LKR 0";
    }
    const numAmount = Number(amount);
    if (isNaN(numAmount)) {
      return "LKR 0";
    }
    return "LKR " + numAmount.toLocaleString("en-LK");
  };

  // Enhanced cardholder name validation
  const validateCardholderName = (name) => {
    const trimmedName = name.trim();

    // Check minimum length
    if (trimmedName.length < 2) {
      return "Cardholder name must be at least 2 characters long";
    }

    // Check maximum length
    if (trimmedName.length > 50) {
      return "Cardholder name cannot exceed 50 characters";
    }

    // Check for valid characters (letters, spaces, hyphens, apostrophes)
    const nameRegex = /^[a-zA-Z\s\-'\.]+$/;
    if (!nameRegex.test(trimmedName)) {
      return "Cardholder name can only contain letters, spaces, hyphens, and apostrophes";
    }

    // Check for at least one letter
    if (!/[a-zA-Z]/.test(trimmedName)) {
      return "Cardholder name must contain at least one letter";
    }

    // Check for consecutive spaces
    if (/\s{2,}/.test(trimmedName)) {
      return "Cardholder name cannot contain consecutive spaces";
    }

    // Check for leading/trailing special characters
    if (/^[\s\-'\.]+|[\s\-'\.]+$/.test(trimmedName)) {
      return "Cardholder name cannot start or end with special characters";
    }

    return null; // Valid name
  };

  // Enhanced CVV validation with card type specific rules
  const validateCVV = (cvvValue, cardType) => {
    if (!cvvValue) {
      return "CVV is required";
    }

    // Remove any non-digit characters
    const cleanCVV = cvvValue.replace(/\D/g, "");

    if (cardType === "amex") {
      // American Express uses 4-digit CVV
      if (cleanCVV.length !== 4) {
        return "American Express CVV must be 4 digits";
      }
    } else {
      // Visa, Mastercard, and most others use 3-digit CVV
      if (cleanCVV.length !== 3) {
        return "CVV must be 3 digits";
      }
    }

    // Check if all digits are the same (security check)
    if (/^(.)\1+$/.test(cleanCVV)) {
      return "CVV cannot be all the same digit";
    }

    return null; // Valid CVV
  };

  // Enhanced card number validation with Luhn algorithm
  const validateCardNumber = (cardNum) => {
    const cleanNumber = cardNum.replace(/\s/g, "");

    if (cleanNumber.length !== 16) {
      return "Card number must be 16 digits";
    }

    // Luhn algorithm for card validation
    const luhnCheck = (num) => {
      let sum = 0;
      let alternate = false;

      for (let i = num.length - 1; i >= 0; i--) {
        let n = parseInt(num.charAt(i), 10);

        if (alternate) {
          n *= 2;
          if (n > 9) {
            n = (n % 10) + 1;
          }
        }

        sum += n;
        alternate = !alternate;
      }

      return sum % 10 === 0;
    };

    if (!luhnCheck(cleanNumber)) {
      return "Please enter a valid card number";
    }

    // Check card type matches selected payment method
    const firstDigit = cleanNumber.charAt(0);
    const firstTwo = cleanNumber.substring(0, 2);

    if (paymentMethod === "visa" && firstDigit !== "4") {
      return "Visa cards must start with 4";
    }

    if (paymentMethod === "mastercard") {
      const firstTwoNum = parseInt(firstTwo);
      if (firstDigit !== "5" && !(firstTwoNum >= 22 && firstTwoNum <= 27)) {
        return "Mastercard must start with 5 or 22-27";
      }
    }

    return null; // Valid card number
  };

  const validateExpiryDate = (dateString) => {
    if (!dateString.match(/^\d{2}\/\d{2}$/)) {
      return "Please enter expiry date (MM/YY)";
    }

    const [month, year] = dateString.split("/");
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100; // Get last 2 digits
    const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11

    const expiryMonth = parseInt(month);
    const expiryYear = parseInt(year);

    // Check if month is valid (1-12)
    if (expiryMonth < 1 || expiryMonth > 12) {
      return "Please enter a valid month (01-12)";
    }
    // Check if year is valid (current year or future)
    else if (expiryYear < currentYear) {
      return "Card has expired";
    }
    // If same year, check if month is in the future
    else if (expiryYear === currentYear && expiryMonth < currentMonth) {
      return "Card has expired";
    }

    return null; // No error
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate delivery address first - this is required
    if (!deliveryAddress || deliveryAddress.trim() === "") {
      newErrors.deliveryAddress =
        "Delivery address is required to complete your order.";
      toast.error(
        "Please set a delivery address before proceeding with payment."
      );
    }

    const cardNumberError = validateCardNumber(cardNumber);
    if (cardNumberError) {
      newErrors.cardNumber = cardNumberError;
    }

    const cardHolderError = validateCardholderName(cardHolder);
    if (cardHolderError) {
      newErrors.cardHolder = cardHolderError;
    }

    const expiryError = validateExpiryDate(expiryDate);
    if (expiryError) {
      newErrors.expiryDate = expiryError;
    }

    const cvvError = validateCVV(cvv, paymentMethod);
    if (cvvError) {
      newErrors.cvv = cvvError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing to mimic a real-world scenario
    setTimeout(async () => {
      try {
        // Get user session from backend
        const sessionResponse = await axios.get(
          "http://localhost/gearsphere_api/GearSphere-BackEnd/getSession.php",
          { withCredentials: true }
        );

        if (!sessionResponse.data.success) {
          alert("You must be logged in to place an order.");
          setIsProcessing(false);
          return;
        }

        const user_id = sessionResponse.data.user_id;
        // Prepare payload for the backend. `orderItems` is already defined
        // to handle both cart and custom PC builds.
        const payload = {
          user_id,
          items: orderItems.map((item) => ({
            product_id: item.product_id || item.id, // Use product_id or fallback to id
            quantity: item.quantity,
            price: item.price,
          })),
          total_amount: orderTotal,
          payment_method: paymentMethod.toUpperCase(),
          delivery_charge: deliveryCharge,
          delivery_address: deliveryAddress,
        };

        const response = await fetch(
          "http://localhost/gearsphere_api/GearSphere-BackEnd/createOrder.php",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(payload),
          }
        );

        const data = await response.json();

        if (data.success) {
          setShowSuccess(true);

          // Handle post-order actions based on order type
          if (onCustomOrderSuccess) {
            // PC Builder flow: trigger the success callback
            setTimeout(() => {
              onHide();
              onCustomOrderSuccess({
                total: orderTotal,
                items: orderItems,
                paymentMethod: payload.payment_method,
                order_id: data.order_id,
                payment_id: data.payment_id,
              });
            }, 1500);
          } else {
            // Standard cart flow: clear cart and navigate
            clearCart();
            setTimeout(() => {
              onHide();
              navigate("/orders");
            }, 1500);
          }
        } else {
          alert(data.message || "Failed to save the order. Please try again.");
          setIsProcessing(false);
        }
      } catch (err) {
        alert("A network or server error occurred. Please try again later.");
        setIsProcessing(false);
      }
    }, 1500); // Simulating network delay
  };

  // Get card icons with proper Bootstrap icons and styling
  const getCardIcon = (type) => {
    switch (type) {
      case "visa":
        return (
          <div
            className="d-flex align-items-center justify-content-center"
            style={{
              background: "linear-gradient(135deg, #1a1f71, #0f4c75)",
              color: "white",
              width: "40px",
              height: "24px",
              borderRadius: "4px",
              fontSize: "10px",
              fontWeight: "bold",
            }}
          >
            VISA
          </div>
        );
      case "mastercard":
        return (
          <div
            className="d-flex align-items-center justify-content-center"
            style={{
              background: "linear-gradient(135deg, #eb001b, #f79e1b)",
              color: "white",
              width: "40px",
              height: "24px",
              borderRadius: "4px",
              fontSize: "8px",
              fontWeight: "bold",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: "#eb001b",
                  marginRight: "1px",
                }}
              ></div>
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: "#f79e1b",
                  marginLeft: "-3px",
                }}
              ></div>
            </div>
          </div>
        );
      default:
        return <CreditCard2Front size={20} />;
    }
  };

  const getCardPrefix = () => {
    return paymentMethod === "visa" ? "4" : "5";
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  const handleCardNumberChange = (e) => {
    const value = e.target.value;
    const formatted = formatCardNumber(value);
    setCardNumber(formatted);

    // Real-time validation
    if (formatted.replace(/\s/g, "").length === 16) {
      const error = validateCardNumber(formatted);
      setErrors((prev) => ({
        ...prev,
        cardNumber: error,
      }));
    }
  };

  const handleCardHolderChange = (e) => {
    const value = e.target.value;
    // Allow only valid characters during typing
    const sanitizedValue = value.replace(/[^a-zA-Z\s\-'\.]/g, "");
    setCardHolder(sanitizedValue);

    // Real-time validation for complete names
    if (sanitizedValue.trim().length >= 2) {
      const error = validateCardholderName(sanitizedValue);
      setErrors((prev) => ({
        ...prev,
        cardHolder: error,
      }));
    }
  };

  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    const maxLength = paymentMethod === "amex" ? 4 : 3;
    setCvv(value.substring(0, maxLength));

    // Real-time validation
    if (value.length === maxLength) {
      const error = validateCVV(value, paymentMethod);
      setErrors((prev) => ({
        ...prev,
        cvv: error,
      }));
    }
  };

  const handleExpiryChange = (e) => {
    const value = e.target.value;
    const formatted = formatExpiryDate(value);
    setExpiryDate(formatted);

    // Real-time validation
    if (formatted.length === 5) {
      // MM/YY format
      const error = validateExpiryDate(formatted);
      setErrors((prev) => ({
        ...prev,
        expiryDate: error,
      }));
    } else {
      // Clear error if not complete
      setErrors((prev) => ({
        ...prev,
        expiryDate: null,
      }));
    }
  };

  if (showSuccess) {
    return (
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Body className="text-center py-5">
          <div className="mb-4">
            <div className="text-success" style={{ fontSize: "4rem" }}>
              <CheckCircle size={64} />
            </div>
          </div>
          <h4 className="text-success mb-3">Payment Successful!</h4>
          <p className="text-muted">Your order has been placed successfully.</p>
          <p className="text-muted">Redirecting to orders page...</p>
        </Modal.Body>
      </Modal>
    );
  }

  return (
    <Modal show={show} onHide={handleClose} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>Checkout</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          {/* Order Summary */}
          <Col md={5}>
            <h5 className="mb-3">Order Summary</h5>
            <div className="border rounded p-3 mb-3">
              {orderItems.map((item) => (
                <div
                  key={item.id}
                  className="d-flex justify-content-between align-items-center mb-2"
                >
                  <div>
                    <h6 className="mb-0">{item.name}</h6>
                    <small className="text-muted">Qty: {item.quantity}</small>
                  </div>
                  <span className="fw-bold">
                    {formatLKR(item.price * item.quantity)}
                  </span>
                </div>
              ))}
              <hr />
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span>Subtotal:</span>
                <span>{formatLKR(baseOrderTotal)}</span>
              </div>

              {/* Delivery Calculator */}
              <DeliveryCalculator
                cartTotal={baseOrderTotal}
                onDeliveryUpdate={(deliveryInfo) => {
                  setDeliveryCharge(deliveryInfo.deliveryCharge);
                  setDeliveryAddress(deliveryInfo.address);
                }}
              />

              {/* Delivery Address Required Warning */}
              {(!deliveryAddress || deliveryAddress.trim() === "") && (
                <Alert variant="warning" className="mt-3 mb-0">
                  <small>
                    <strong>⚠️ Delivery address required:</strong> Please set
                    your delivery address above to proceed with payment.
                  </small>
                </Alert>
              )}

              <hr />
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="mb-0">Total:</h6>
                <h5 className="mb-0 text-primary">{formatLKR(orderTotal)}</h5>
              </div>
            </div>
          </Col>

          {/* Payment Form */}
          <Col md={7}>
            <h5 className="mb-3 d-flex align-items-center">
              <CreditCard2Front className="me-2" size={20} />
              Payment Details
            </h5>

            {/* Enhanced Card Type Selection */}
            <div className="mb-4">
              <Form.Label className="fw-bold">Select Card Type</Form.Label>
              <div className="d-flex gap-3">
                <Button
                  variant={
                    paymentMethod === "visa" ? "primary" : "outline-primary"
                  }
                  onClick={() => setPaymentMethod("visa")}
                  className="flex-fill d-flex align-items-center justify-content-center py-3"
                  style={{ minHeight: "60px" }}
                >
                  <div className="d-flex flex-column align-items-center">
                    {getCardIcon("visa")}
                    <small className="mt-1">Visa</small>
                  </div>
                </Button>
                <Button
                  variant={
                    paymentMethod === "mastercard"
                      ? "primary"
                      : "outline-primary"
                  }
                  onClick={() => setPaymentMethod("mastercard")}
                  className="flex-fill d-flex align-items-center justify-content-center py-3"
                  style={{ minHeight: "60px" }}
                >
                  <div className="d-flex flex-column align-items-center">
                    {getCardIcon("mastercard")}
                    <small className="mt-1">Mastercard</small>
                  </div>
                </Button>
              </div>
            </div>

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">
                  Card Number
                  <span className="text-danger">*</span>
                </Form.Label>
                <div className="position-relative">
                  <Form.Control
                    type="text"
                    placeholder={`${getCardPrefix()}000 0000 0000 0000`}
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    maxLength="19"
                    isInvalid={!!errors.cardNumber}
                    style={{ paddingRight: "50px" }}
                  />
                  <div
                    className="position-absolute"
                    style={{
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                    }}
                  >
                    {getCardIcon(paymentMethod)}
                  </div>
                </div>
                <Form.Control.Feedback type="invalid">
                  {errors.cardNumber}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">
                  Cardholder Name
                  <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter full name as shown on card"
                  value={cardHolder}
                  onChange={handleCardHolderChange}
                  maxLength="50"
                  isInvalid={!!errors.cardHolder}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.cardHolder}
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                  Enter your name exactly as it appears on your card
                </Form.Text>
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      Expiry Date
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={handleExpiryChange}
                      maxLength="5"
                      isInvalid={!!errors.expiryDate}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.expiryDate}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      CVV
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        type="text"
                        placeholder={paymentMethod === "amex" ? "1234" : "123"}
                        value={cvv}
                        onChange={handleCvvChange}
                        maxLength={paymentMethod === "amex" ? "4" : "3"}
                        isInvalid={!!errors.cvv}
                        style={{ paddingRight: "35px" }}
                      />
                      <CreditCard2Back
                        className="position-absolute text-muted"
                        style={{
                          right: "10px",
                          top: "50%",
                          transform: "translateY(-50%)",
                        }}
                        size={18}
                      />
                    </div>
                    <Form.Control.Feedback type="invalid">
                      {errors.cvv}
                    </Form.Control.Feedback>
                    <Form.Text className="text-muted">
                      {paymentMethod === "amex"
                        ? "4 digits on front"
                        : "3 digits on back"}
                    </Form.Text>
                  </Form.Group>
                </Col>
              </Row>

              <Alert
                variant="success"
                className="mb-3 d-flex align-items-center"
              >
                <CheckCircle className="me-2 flex-shrink-0" size={20} />
                <small>
                  <strong>256-bit SSL Encryption:</strong> Your payment
                  information is encrypted and secure. We never store your card
                  details.
                </small>
              </Alert>

              <div className="d-grid gap-2">
                <Button
                  type="submit"
                  variant="success"
                  size="lg"
                  disabled={
                    isProcessing ||
                    !deliveryAddress ||
                    deliveryAddress.trim() === ""
                  }
                  className="d-flex align-items-center justify-content-center"
                >
                  {isProcessing ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Processing Payment...
                    </>
                  ) : !deliveryAddress || deliveryAddress.trim() === "" ? (
                    <>
                      <Shield className="me-2" size={18} />
                      Set Delivery Address to Pay
                    </>
                  ) : (
                    <>
                      <Shield className="me-2" size={18} />
                      Pay {formatLKR(orderTotal)}
                    </>
                  )}
                </Button>
                <Button variant="outline-secondary" onClick={handleClose}>
                  Cancel
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default Checkout;
