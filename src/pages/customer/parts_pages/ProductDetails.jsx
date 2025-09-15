import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Container, Alert } from "react-bootstrap";
import CustomerNavbar from "../../pageNavbars/CustomerNavbar";
import LoadingScreen from "../../../components/loading/LoadingScreen";
import VideoCardDetails from "./VideoCardDetails";
import CPUDetails from "./CPUDetails";
import MemoryDetails from "./MemoryDetails";
import StorageDetails from "./StorageDetails";
import MotherboardDetails from "./MotherboardDetails";
import PowerSupplyDetails from "./PowerSupplyDetails";
import PCCaseDetails from "./PCCaseDetails";
import CPUCoolerDetails from "./CPUCoolerDetails";
import MonitorDetails from "./MonitorDetails";
import OperatingSystemDetails from "./OperatingSystemDetails";
import GeneralProductDetails from "./GeneralProductDetails";
import axios from "axios";

function ProductDetails() {
  const { productId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [product, setProduct] = useState(location.state?.product || null);
  const [loading, setLoading] = useState(!product);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!product && productId) {
      fetchProductDetails();
    }
  }, [productId, product]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost/gearsphere_api/GearSphere-BackEnd/getProductDetails.php?product_id=${productId}`
      );

      if (response.data.success) {
        setProduct(response.data.product);
      } else {
        setError("Product not found");
      }
    } catch (err) {
      setError("Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

  const renderCategorySpecificDetails = () => {
    if (!product) return null;

    const category = product.category;

    switch (category) {
      case "Video Card":
        return <VideoCardDetails product={product} />;
      case "CPU":
        return <CPUDetails product={product} />;
      case "Memory":
        return <MemoryDetails product={product} />;
      case "Storage":
        return <StorageDetails product={product} />;
      case "Motherboard":
        return <MotherboardDetails product={product} />;
      case "Power Supply":
        return <PowerSupplyDetails product={product} />;
      case "PC Case":
        return <PCCaseDetails product={product} />;
      case "CPU Cooler":
        return <CPUCoolerDetails product={product} />;
      case "Monitor":
        return <MonitorDetails product={product} />;
      case "Operating System":
        return <OperatingSystemDetails product={product} />;
      // General categories without specific database tables
      case "Keyboard":
      case "Mouse":
      case "Headset":
      case "Microphone":
      case "Webcam":
      case "Speakers":
      case "Network Card":
      case "Sound Card":
      case "Cables":
      case "Thermal Paste":
      case "Fans":
        return <GeneralProductDetails product={product} />;
      default:
        return (
          <Alert variant="warning">
            <Alert.Heading>Category Not Supported</Alert.Heading>
            <p>
              Detailed specifications are not available for this product
              category: {category}
            </p>
          </Alert>
        );
    }
  };

  if (loading) {
    return (
      <LoadingScreen
        message="Loading Product Details"
        subMessage="Fetching detailed specifications"
      />
    );
  }

  if (error || !product) {
    return (
      <>
        <CustomerNavbar />
        <Container className="py-5">
          <Alert variant="danger">
            <Alert.Heading>Error</Alert.Heading>
            <p>{error || "Product not found"}</p>
            <div className="d-flex gap-2">
              <button
                className="btn btn-secondary"
                onClick={() => navigate(-1)}
              >
                Go Back
              </button>
              <button
                className="btn btn-primary"
                onClick={() => navigate("/marketplace")}
              >
                Browse Marketplace
              </button>
            </div>
          </Alert>
        </Container>
      </>
    );
  }

  return (
    <>
      <CustomerNavbar />
      {renderCategorySpecificDetails()}
    </>
  );
}

export default ProductDetails;
