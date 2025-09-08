import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Alert,
  Modal,
  Table,
} from "react-bootstrap";
import {
  Cpu,
  Motherboard,
  Display,
  Memory,
  Hdd,
  Power,
  PcDisplay,
  Fan,
  CashStack,
  ArrowsAngleExpand,
  ExclamationTriangleFill,
} from "react-bootstrap-icons";
import { useOrders } from "./OrdersContext";
import Checkout from "./Checkout";
import { useNavigate, useLocation } from "react-router-dom";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import LoadingScreen from "../../components/loading/LoadingScreen";

const partOptionsMap = {
  cpu: null,
  gpu: null,
  motherboard: null,
  ram: null,
  storage: null,
  psu: null,
  case: null,
  cooling: null,
  monitor: null,
  operating_system: null,
};

const getPartOptions = (type) => partOptionsMap[type] || [];

// Add these SVG icons above the PCBuilder function
const GpuIcon = (
  <svg
    width="40"
    height="40"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="2"
      y="7"
      width="20"
      height="10"
      rx="2"
      fill="#22c55e"
      fillOpacity="0.12"
      stroke="#22c55e"
      strokeWidth="2"
    />
    <rect
      x="5"
      y="10"
      width="3"
      height="4"
      rx="1"
      fill="#22c55e"
      stroke="#22c55e"
      strokeWidth="1.5"
    />
    <rect
      x="16"
      y="10"
      width="3"
      height="4"
      rx="1"
      fill="#22c55e"
      stroke="#22c55e"
      strokeWidth="1.5"
    />
    <circle
      cx="12"
      cy="12"
      r="2.2"
      fill="#22c55e"
      stroke="#22c55e"
      strokeWidth="1.5"
    />
    <rect
      x="8.5"
      y="9.5"
      width="7"
      height="5"
      rx="1.5"
      fill="#fff"
      stroke="#22c55e"
      strokeWidth="1.2"
    />
    <rect
      x="10"
      y="11"
      width="4"
      height="2"
      rx="1"
      fill="#22c55e"
      stroke="#22c55e"
      strokeWidth="0.8"
    />
  </svg>
);

const MonitorIcon = (
  <svg
    width="40"
    height="40"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="3"
      y="5"
      width="18"
      height="12"
      rx="2"
      fill="#2563eb"
      fillOpacity="0.10"
      stroke="#2563eb"
      strokeWidth="2"
    />
    <rect
      x="8"
      y="17"
      width="8"
      height="2"
      rx="1"
      fill="#2563eb"
      stroke="#2563eb"
      strokeWidth="1.5"
    />
    <rect
      x="10"
      y="19"
      width="4"
      height="1.5"
      rx="0.75"
      fill="#2563eb"
      stroke="#2563eb"
      strokeWidth="1.2"
    />
  </svg>
);

// Add this SVG icon above the PCBuilder function
const OperatingSystemIcon = (
  <svg
    width="40"
    height="40"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="3"
      y="5"
      width="18"
      height="14"
      rx="2.5"
      fill="#e0e7ff"
      stroke="#2563eb"
      strokeWidth="2"
    />
    <rect
      x="3"
      y="11"
      width="18"
      height="2"
      fill="#2563eb"
      fillOpacity="0.15"
    />
    <rect
      x="11"
      y="5"
      width="2"
      height="14"
      fill="#2563eb"
      fillOpacity="0.15"
    />
    <rect
      x="3"
      y="5"
      width="18"
      height="14"
      rx="2.5"
      stroke="#2563eb"
      strokeWidth="2"
    />
  </svg>
);

function PCBuilder() {
  // Helper to get initial state from sessionStorage
  const getInitialSelectedComponents = () => {
    const saved = sessionStorage.getItem("pcbuilder_selected_components");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Validate that components are in correct slots based on their category
        const cleaned = {
          cpu: null,
          gpu: null,
          motherboard: null,
          ram: null,
          storage: null,
          psu: null,
          case: null,
          cooling: null,
          monitor: null,
          operating_system: null,
        };

        // Only keep components that are in the correct slots
        Object.entries(parsed).forEach(([slot, component]) => {
          if (component && component.category) {
            const correctSlot = getCategorySlot(component.category);
            if (correctSlot === slot) {
              cleaned[slot] = component;
            } else {
              // Component is in wrong slot, skip it
            }
          }
        });

        return cleaned;
      } catch (e) {
        return {
          cpu: null,
          gpu: null,
          motherboard: null,
          ram: null,
          storage: null,
          psu: null,
          case: null,
          cooling: null,
          monitor: null,
          operating_system: null,
        };
      }
    }
    return {
      cpu: null,
      gpu: null,
      motherboard: null,
      ram: null,
      storage: null,
      psu: null,
      case: null,
      cooling: null,
      monitor: null,
      operating_system: null,
    };
  };

  // Helper function to get correct slot for a category
  const getCategorySlot = (category) => {
    switch (category) {
      case "CPU":
        return "cpu";
      case "Video Card":
      case "GPU":
        return "gpu";
      case "Motherboard":
        return "motherboard";
      case "Memory":
      case "RAM":
        return "ram";
      case "Storage":
        return "storage";
      case "Power Supply":
      case "PSU":
        return "psu";
      case "PC Case":
      case "Case":
        return "case";
      case "CPU Cooler":
      case "Cooler":
        return "cooling";
      case "Monitor":
        return "monitor";
      case "Operating System":
        return "operating_system";
      default:
        return null;
    }
  };

  const [selectedRange, setSelectedRange] = useState("");
  const [usage, setUsage] = useState("");
  // Use function form to initialize from sessionStorage
  const [selectedComponents, setSelectedComponents] = useState(
    getInitialSelectedComponents
  );
  const [recommendations, setRecommendations] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonType, setComparisonType] = useState("");
  const [comparisonItems, setComparisonItems] = useState([]);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showTechnicianChoice, setShowTechnicianChoice] = useState(false);
  const [showClearConfirmModal, setShowClearConfirmModal] = useState(false);
  // Restore suggested build state
  const [suggestedBuild, setSuggestedBuild] = useState(null);
  const [suggestDebug, setSuggestDebug] = useState(null);
  const [lastOrderId, setLastOrderId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { addOrder } = useOrders();
  const navigate = useNavigate();
  const location = useLocation();

  // Function to reset the entire PC Builder state
  const resetBuildState = () => {
    const initialComponents = {
      cpu: null,
      gpu: null,
      motherboard: null,
      ram: null,
      storage: null,
      psu: null,
      case: null,
      cooling: null,
      monitor: null,
      operating_system: null,
    };
    setSelectedComponents(initialComponents);
    setUsage("");
    setSelectedRange("");
    setTotalPrice(0);
    setLastOrderId(null);
    setRecommendations(null);
    // Clear the saved state from sessionStorage to ensure a fresh start next time
    sessionStorage.removeItem("pcbuilder_selected_components");
  };

  // Handle clear all with confirmation
  const handleClearAll = () => {
    if (
      Object.values(selectedComponents).some((component) => component !== null)
    ) {
      setShowClearConfirmModal(true);
    }
  };

  // Handle confirm clear all
  const handleConfirmClear = () => {
    resetBuildState();
    setShowClearConfirmModal(false);
  };

  // Handle cancel clear
  const handleCancelClear = () => {
    setShowClearConfirmModal(false);
  };

  // Budget ranges in LKR
  const budgetRanges = [
    // {
    //   id: "range1",
    //   name: "Entry Level",
    //   min: 100000,
    //   max: 200000,
    //   tier: "low",
    // },
    { id: "range2", name: "Budget", min: 200000, max: 300000, tier: "low" },
    { id: "range3", name: "Mid-Range", min: 300000, max: 400000, tier: "mid" },
    { id: "range4", name: "High-End", min: 400000, max: 500000, tier: "mid" },
    { id: "range5", name: "Premium", min: 500000, max: 750000, tier: "high" },
    { id: "range6", name: "Ultimate", min: 750000, max: 1000000, tier: "high" },
  ];

  // Usage types and their component priorities
  const usageTypes = {
    gaming: {
      name: "Gaming",
      icon: "🎮",
      priorities: {
        gpu: 0.38,
        cpu: 0.23,
        ram: 0.1,
        storage: 0.1,
        motherboard: 0.09,
        psu: 0.07,
        case: 0.03,
        cooling: 0.03,
        monitor: 0.04,
        operating_system: 0.01,
      },
    },
    workstation: {
      name: "Workstation",
      icon: "💻",
      priorities: {
        cpu: 0.32,
        ram: 0.22,
        storage: 0.18,
        gpu: 0.09,
        motherboard: 0.09,
        psu: 0.08,
        case: 0.04,
        cooling: 0.03,
        monitor: 0.03,
        operating_system: 0.02,
      },
    },
    multimedia: {
      name: "Multimedia",
      icon: "🎬",
      priorities: {
        cpu: 0.28,
        gpu: 0.22,
        storage: 0.18,
        ram: 0.13,
        motherboard: 0.09,
        psu: 0.07,
        case: 0.04,
        cooling: 0.02,
        monitor: 0.04,
        operating_system: 0.01,
      },
    },
  };

  // Component icons mapping with correct icons
  const componentIcons = {
    cpu: <Cpu size={40} className="text-primary" />,
    gpu: GpuIcon,
    motherboard: <Motherboard size={40} className="text-info" />,
    ram: <Memory size={40} className="text-warning" />,
    storage: <Hdd size={40} className="text-danger" />,
    psu: <Power size={40} className="text-secondary" />,
    case: <PcDisplay size={40} className="text-dark" />,
    cooling: <Fan size={40} className="text-primary" />,
    monitor: MonitorIcon,
    operating_system: OperatingSystemIcon,
  };

  // Generate recommendations based on budget range and usage
  const generateRecommendations = (range, usageType) => {
    if (!range || !usageType || !usageTypes[usageType]) return null;

    const recommendedComponents = {};
    const priorities = usageTypes[usageType].priorities;
    const avgBudget = (range.min + range.max) / 2;

    // Find components within budget allocation
    for (const [component, allocation] of Object.entries(priorities)) {
      const componentBudget = avgBudget * allocation;
      const options = getPartOptions(component).filter(
        (comp) => comp.tier === range.tier
      );

      if (options.length > 0) {
        // Find the best component within budget
        const bestOption = options.reduce((best, current) => {
          if (
            current.price <= componentBudget &&
            (!best || current.price > best.price)
          ) {
            return current;
          }
          return best;
        }, null);

        recommendedComponents[component] = bestOption || options[0];
      }
    }

    return recommendedComponents;
  };

  // Add this function to fetch suggested build
  const fetchSuggestedBuild = async (budget, usageType) => {
    if (!budget || !usageType) return;
    try {
      const res = await fetch(
        `http://localhost/gearsphere_api/GearSphere-BackEnd/suggestBuild.php?budget=${budget}&usage=${usageType}`
      );
      const data = await res.json();
      const mapped = {
        ...data.build,
        cooling: data.build.cooler,
        operating_system: data.build.os,
      };
      setSelectedComponents((prev) => ({
        ...prev,
        ...mapped,
      }));
    } catch (err) {
      alert("Error fetching suggested build");
    }
  };

  // Replace handleRangeChange and handleUsageChange with:
  const handleRangeChange = (e) => setSelectedRange(e.target.value);
  const handleUsageChange = (e) => setUsage(e.target.value);

  // Handle component comparison with enhanced information
  const handleCompare = (componentType) => {
    setComparisonType(componentType);
    const options =
      getPartOptions(componentType)?.filter(
        (comp) =>
          comp.tier === budgetRanges.find((r) => r.id === selectedRange)?.tier
      ) || [];
    setComparisonItems(options.slice(0, 3)); // Compare top 3 options
    setShowComparison(true);
  };

  // Safe access to nested properties
  const safeGet = (obj, path, defaultValue = "N/A") => {
    const result = path.split(".").reduce((current, key) => {
      return current && current[key] !== undefined
        ? current[key]
        : defaultValue;
    }, obj);

    // Special handling for uniqueFeatures to ensure it's always an array
    if (path === "features.uniqueFeatures") {
      return Array.isArray(result) ? result : ["N/A"];
    }

    return result;
  };

  // Handle component selection from comparison
  const handleSelectFromComparison = (component) => {
    setSelectedComponents((prev) => ({ ...prev, [comparisonType]: component }));
    setShowComparison(false);
  };

  // Only sum prices for valid part keys
  const validKeys = [
    "cpu",
    "gpu",
    "motherboard",
    "ram",
    "storage",
    "psu",
    "case",
    "cooling",
    "monitor",
    "operating_system",
  ];

  // Initial loading effect
  useEffect(() => {
    // Simulate component initialization
    const initializeComponent = async () => {
      setIsLoading(true);
      // Add a small delay to show the loading screen
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsLoading(false);
    };

    initializeComponent();
  }, []);

  useEffect(() => {
    const total = Object.entries(selectedComponents)
      .filter(([key]) => validKeys.includes(key))
      .reduce((sum, [, component]) => {
        return sum + (component?.price ? parseFloat(component.price) : 0);
      }, 0);
    setTotalPrice(total);
  }, [selectedComponents]);

  const handleProceedToCheckout = () => {
    setShowCheckoutModal(true);
  };

  const handleCheckoutConfirm = () => {
    setShowCheckoutModal(false);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (orderData) => {
    setShowPaymentModal(false);
    setShowTechnicianChoice(true);
    setLastOrderId(orderData.order_id); // Store the order_id for later
  };

  // After technician assignment, update the order with assignment_id
  const handleTechnicianAssigned = async (assignment_id) => {
    if (!lastOrderId || !assignment_id) return;
    try {
      const response = await fetch(
        "http://localhost/gearsphere_api/GearSphere-BackEnd/updateOrderAssignment.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order_id: lastOrderId, assignment_id }),
        }
      );
      const data = await response.json();
      if (data.success) {
        // Optionally show a success message or update UI
        setShowTechnicianChoice(false);
        setLastOrderId(null);
      } else {
        alert(data.message || "Failed to link technician assignment to order.");
      }
    } catch (err) {
      alert("Network or server error. Please try again.");
    }
  };

  const handleGoToOrders = () => {
    setShowTechnicianChoice(false);
    resetBuildState(); // Reset the state before navigating
    navigate("/orders");
  };

  const handleAssignTechnician = () => {
    setShowTechnicianChoice(false);
    // Store order_id temporarily since state will be reset
    const orderIdToPass = lastOrderId;
    resetBuildState(); // Reset the state before navigating
    navigate("/customer/find-technician", {
      state: {
        order_id: orderIdToPass,
      },
    });
  };

  // Create PC build items for checkout
  const pcBuildItems = Object.entries(selectedComponents)
    .filter(([_, component]) => component && component.product_id)
    .map(([key, component]) => ({
      id: `${key}_${Date.now()}`,
      product_id: component.product_id,
      name: component.name,
      price: component.price,
      category: key.toUpperCase(),
      quantity: 1,
    }))
    // Remove duplicates by product_id
    .filter(
      (item, index, self) =>
        index === self.findIndex((t) => t.product_id === item.product_id)
    );

  useEffect(() => {
    const cpuStr = sessionStorage.getItem("selected_cpu");
    if (cpuStr) {
      const cpu = JSON.parse(cpuStr);
      const savedBuild = sessionStorage.getItem(
        "pcbuilder_selected_components"
      );
      const prev = savedBuild
        ? JSON.parse(savedBuild)
        : {
            cpu: null,
            gpu: null,
            motherboard: null,
            ram: null,
            storage: null,
            psu: null,
            case: null,
            cooling: null,
            monitor: null,
            operating_system: null,
          };
      const updated = { ...prev, cpu };
      setSelectedComponents(updated);
      sessionStorage.setItem(
        "pcbuilder_selected_components",
        JSON.stringify(updated)
      );
      sessionStorage.removeItem("selected_cpu");
    }
    if (location.search.includes("cpuSelected=1")) {
      navigate("/pc-builder", { replace: true });
    }
  }, [location]);

  useEffect(() => {
    const gpuStr = sessionStorage.getItem("selected_gpu");
    if (gpuStr) {
      const gpu = JSON.parse(gpuStr);
      const savedBuild = sessionStorage.getItem(
        "pcbuilder_selected_components"
      );
      const prev = savedBuild
        ? JSON.parse(savedBuild)
        : {
            cpu: null,
            gpu: null,
            motherboard: null,
            ram: null,
            storage: null,
            psu: null,
            case: null,
            cooling: null,
            monitor: null,
            operating_system: null,
          };
      const updated = { ...prev, gpu };
      setSelectedComponents(updated);
      sessionStorage.setItem(
        "pcbuilder_selected_components",
        JSON.stringify(updated)
      );
      sessionStorage.removeItem("selected_gpu");
    }
    if (location.search.includes("gpuSelected=1")) {
      navigate("/pc-builder", { replace: true });
    }
  }, [location]);

  useEffect(() => {
    const motherboardStr = sessionStorage.getItem("selected_motherboard");
    if (motherboardStr) {
      const motherboard = JSON.parse(motherboardStr);
      const savedBuild = sessionStorage.getItem(
        "pcbuilder_selected_components"
      );
      const prev = savedBuild
        ? JSON.parse(savedBuild)
        : {
            cpu: null,
            gpu: null,
            motherboard: null,
            ram: null,
            storage: null,
            psu: null,
            case: null,
            cooling: null,
            monitor: null,
            operating_system: null,
          };
      const updated = { ...prev, motherboard };
      setSelectedComponents(updated);
      sessionStorage.setItem(
        "pcbuilder_selected_components",
        JSON.stringify(updated)
      );
      sessionStorage.removeItem("selected_motherboard");
    }
    if (location.search.includes("motherboardSelected=1")) {
      navigate("/pc-builder", { replace: true });
    }
  }, [location]);

  useEffect(() => {
    const memoryStr = sessionStorage.getItem("selected_memory");
    if (memoryStr) {
      const memory = JSON.parse(memoryStr);
      const savedBuild = sessionStorage.getItem(
        "pcbuilder_selected_components"
      );
      const prev = savedBuild
        ? JSON.parse(savedBuild)
        : {
            cpu: null,
            gpu: null,
            motherboard: null,
            ram: null,
            storage: null,
            psu: null,
            case: null,
            cooling: null,
            monitor: null,
            operating_system: null,
          };
      const updated = { ...prev, ram: memory };
      setSelectedComponents(updated);
      sessionStorage.setItem(
        "pcbuilder_selected_components",
        JSON.stringify(updated)
      );
      sessionStorage.removeItem("selected_memory");
    }
    if (location.search.includes("memorySelected=1")) {
      navigate("/pc-builder", { replace: true });
    }
  }, [location]);

  useEffect(() => {
    const storageStr = sessionStorage.getItem("selected_storage");
    if (storageStr) {
      const storage = JSON.parse(storageStr);
      const savedBuild = sessionStorage.getItem(
        "pcbuilder_selected_components"
      );
      const prev = savedBuild
        ? JSON.parse(savedBuild)
        : {
            cpu: null,
            gpu: null,
            motherboard: null,
            ram: null,
            storage: null,
            psu: null,
            case: null,
            cooling: null,
            monitor: null,
            operating_system: null,
          };
      const updated = { ...prev, storage };
      setSelectedComponents(updated);
      sessionStorage.setItem(
        "pcbuilder_selected_components",
        JSON.stringify(updated)
      );
      sessionStorage.removeItem("selected_storage");
    }
    if (location.search.includes("storageSelected=1")) {
      navigate("/pc-builder", { replace: true });
    }
  }, [location]);

  useEffect(() => {
    const psuStr = sessionStorage.getItem("selected_powersupply");
    if (psuStr) {
      const psu = JSON.parse(psuStr);
      const savedBuild = sessionStorage.getItem(
        "pcbuilder_selected_components"
      );
      const prev = savedBuild
        ? JSON.parse(savedBuild)
        : {
            cpu: null,
            gpu: null,
            motherboard: null,
            ram: null,
            storage: null,
            psu: null,
            case: null,
            cooling: null,
            monitor: null,
            operating_system: null,
          };
      const updated = { ...prev, psu };
      setSelectedComponents(updated);
      sessionStorage.setItem(
        "pcbuilder_selected_components",
        JSON.stringify(updated)
      );
      sessionStorage.removeItem("selected_powersupply");
    }
    if (location.search.includes("powersupplySelected=1")) {
      navigate("/pc-builder", { replace: true });
    }
  }, [location]);

  useEffect(() => {
    const caseStr = sessionStorage.getItem("selected_case");
    if (caseStr) {
      const pcCase = JSON.parse(caseStr);
      const savedBuild = sessionStorage.getItem(
        "pcbuilder_selected_components"
      );
      const prev = savedBuild
        ? JSON.parse(savedBuild)
        : {
            cpu: null,
            gpu: null,
            motherboard: null,
            ram: null,
            storage: null,
            psu: null,
            case: null,
            cooling: null,
            monitor: null,
            operating_system: null,
          };
      const updated = { ...prev, case: pcCase };
      setSelectedComponents(updated);
      sessionStorage.setItem(
        "pcbuilder_selected_components",
        JSON.stringify(updated)
      );
      sessionStorage.removeItem("selected_case");
    }
    if (location.search.includes("caseSelected=1")) {
      navigate("/pc-builder", { replace: true });
    }
  }, [location]);

  useEffect(() => {
    const coolerStr = sessionStorage.getItem("selected_cpucooler");
    if (coolerStr) {
      const cooler = JSON.parse(coolerStr);
      const savedBuild = sessionStorage.getItem(
        "pcbuilder_selected_components"
      );
      const prev = savedBuild
        ? JSON.parse(savedBuild)
        : {
            cpu: null,
            gpu: null,
            motherboard: null,
            ram: null,
            storage: null,
            psu: null,
            case: null,
            cooling: null,
            monitor: null,
            operating_system: null,
          };
      const updated = { ...prev, cooling: cooler };
      setSelectedComponents(updated);
      sessionStorage.setItem(
        "pcbuilder_selected_components",
        JSON.stringify(updated)
      );
      sessionStorage.removeItem("selected_cpucooler");
    }
    if (location.search.includes("cpucoolerSelected=1")) {
      navigate("/pc-builder", { replace: true });
    }
  }, [location]);

  useEffect(() => {
    const monitorStr = sessionStorage.getItem("selected_monitor");
    if (monitorStr) {
      const monitor = JSON.parse(monitorStr);
      const savedBuild = sessionStorage.getItem(
        "pcbuilder_selected_components"
      );
      const prev = savedBuild
        ? JSON.parse(savedBuild)
        : {
            cpu: null,
            gpu: null,
            motherboard: null,
            ram: null,
            storage: null,
            psu: null,
            case: null,
            cooling: null,
            monitor: null,
            operating_system: null,
          };
      const updated = { ...prev, monitor };
      setSelectedComponents(updated);
      sessionStorage.setItem(
        "pcbuilder_selected_components",
        JSON.stringify(updated)
      );
      sessionStorage.removeItem("selected_monitor");
    }
    if (location.search.includes("monitorSelected=1")) {
      navigate("/pc-builder", { replace: true });
    }
  }, [location]);

  useEffect(() => {
    const osStr = sessionStorage.getItem("selected_operatingsystem");
    if (osStr) {
      const os = JSON.parse(osStr);
      const savedBuild = sessionStorage.getItem(
        "pcbuilder_selected_components"
      );
      const prev = savedBuild
        ? JSON.parse(savedBuild)
        : {
            cpu: null,
            gpu: null,
            motherboard: null,
            ram: null,
            storage: null,
            psu: null,
            case: null,
            cooling: null,
            monitor: null,
            operating_system: null,
          };
      const updated = { ...prev, operating_system: os };
      setSelectedComponents(updated);
      sessionStorage.setItem(
        "pcbuilder_selected_components",
        JSON.stringify(updated)
      );
      sessionStorage.removeItem("selected_operatingsystem");
    }
    if (location.search.includes("operatingsystemSelected=1")) {
      navigate("/pc-builder", { replace: true });
    }
  }, [location]);

  useEffect(() => {
    // Component selection tracking
  }, [selectedComponents]);

  // Handle incoming selected components from navigation state
  useEffect(() => {
    const selectedComponent = location.state?.selectedComponent;
    if (selectedComponent) {
      // Determine component type based on the component's category ONLY - most reliable
      let componentType = null;

      // Use category as the primary and most reliable detection method
      switch (selectedComponent.category) {
        case "CPU":
          componentType = "cpu";
          break;
        case "Video Card":
        case "GPU":
          componentType = "gpu";
          break;
        case "Motherboard":
          componentType = "motherboard";
          break;
        case "Memory":
        case "RAM":
          componentType = "ram";
          break;
        case "Storage":
          componentType = "storage";
          break;
        case "Power Supply":
        case "PSU":
          componentType = "psu";
          break;
        case "PC Case":
        case "Case":
          componentType = "case";
          break;
        case "CPU Cooler":
        case "Cooler":
          componentType = "cooling";
          break;
        case "Monitor":
          componentType = "monitor";
          break;
        case "Operating System":
          componentType = "operating_system";
          break;
        default:
          componentType = null;
      }

      if (componentType) {
        setSelectedComponents((prev) => ({
          ...prev,
          [componentType]: selectedComponent,
        }));

        // Clear the navigation state to prevent re-processing
        navigate(location.pathname, { replace: true, state: {} });
      } else {
        // Could not determine component type
      }
    }
  }, [location.state, navigate, location.pathname]);

  // Persist selectedComponents to sessionStorage on change
  useEffect(() => {
    sessionStorage.setItem(
      "pcbuilder_selected_components",
      JSON.stringify(selectedComponents)
    );
  }, [selectedComponents]);

  useEffect(() => {
    if (selectedRange && usage) {
      const range = budgetRanges.find((r) => r.id === selectedRange);
      fetchSuggestedBuild(range.max, usage);
    }
  }, [selectedRange, usage]);

  // Show loading screen while initializing
  if (isLoading) {
    return (
      <LoadingScreen
        message="Loading PC Builder"
        subMessage="Preparing your custom build experience"
      />
    );
  }

  return (
    <Container className="py-5">
      <h1 className="mb-4">PC Builder</h1>

      {/* Usage and Budget Range Selection */}
      <Card className="mb-4">
        <Card.Body>
          <h3>Configure Your Build</h3>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Select Usage Type</Form.Label>
                <Form.Select value={usage} onChange={handleUsageChange}>
                  <option value="">Select Usage Type</option>
                  {Object.entries(usageTypes).map(([key, type]) => (
                    <option key={key} value={key}>
                      {type.icon} {type.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <CashStack className="me-2" /> Select Budget Range
                </Form.Label>
                <Form.Select value={selectedRange} onChange={handleRangeChange}>
                  <option value="">Select Budget Range</option>
                  {budgetRanges.map((range) => (
                    <option key={range.id} value={range.id}>
                      {range.name} (LKR {range.min.toLocaleString()} -{" "}
                      {range.max.toLocaleString()})
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {recommendations && usage && usageTypes[usage] && selectedRange && (
        <Alert variant="info" className="mb-4">
          <h4>Recommended {usageTypes[usage].name} Build</h4>
          <p className="mb-0">
            Based on your {usageTypes[usage].name.toLowerCase()} needs and
            selected budget range, we've selected components that provide the
            best value for your money. You can modify any component below to
            better suit your needs.
          </p>
        </Alert>
      )}

      {/* SUGGESTED BUILD DISPLAY */}
      {/* Remove the entire suggested build display section */}

      <Row>
        {/* Component Selection */}
        <Col md={8}>
          <Card className="mb-4">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="mb-0">Build Your Custom PC</h3>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={handleClearAll}
                  className="d-flex align-items-center gap-2"
                >
                  <i className="bi bi-trash"></i>
                  Clear All
                </Button>
              </div>
              <Form>
                {Object.entries(selectedComponents)
                  .filter(([key]) => key !== "cooler" && key !== "os")
                  .map(([key, component]) => (
                    <div key={key} className="mb-4">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h5 className="mb-0">
                          {componentIcons[key]}{" "}
                          {key === "gpu"
                            ? "Video Card"
                            : key === "ram"
                            ? "Memory"
                            : key === "psu"
                            ? "Power Supply"
                            : key === "cooling"
                            ? "CPU Cooler"
                            : key === "monitor"
                            ? "Monitor"
                            : key === "operating_system"
                            ? "Operating System"
                            : key.toUpperCase()}
                        </h5>
                        {component && (
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() =>
                              setSelectedComponents((prev) => ({
                                ...prev,
                                [key]: null,
                              }))
                            }
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                      <Card>
                        <Card.Body>
                          <Row>
                            <Col
                              md={3}
                              className="d-flex align-items-center justify-content-center"
                            >
                              {/* For CPU, GPU, Motherboard: show icon if not selected, image if selected. For others, show icon. */}
                              {key === "cpu" && component ? (
                                <img
                                  src={
                                    component.image_url
                                      ? `http://localhost/gearsphere_api/GearSphere-BackEnd/${component.image_url}`
                                      : "/profile_images/user_image.jpg"
                                  }
                                  alt={component.name}
                                  style={{
                                    width: 56,
                                    height: 56,
                                    objectFit: "cover",
                                    borderRadius: 6,
                                  }}
                                />
                              ) : key === "cpu" && !component ? (
                                <Cpu size={40} className="text-primary" />
                              ) : key === "gpu" && component ? (
                                <img
                                  src={
                                    component.image_url
                                      ? `http://localhost/gearsphere_api/GearSphere-BackEnd/${component.image_url}`
                                      : "/profile_images/user_image.jpg"
                                  }
                                  alt={component.name}
                                  style={{
                                    width: 56,
                                    height: 56,
                                    objectFit: "cover",
                                    borderRadius: 6,
                                  }}
                                />
                              ) : key === "gpu" && !component ? (
                                componentIcons.gpu
                              ) : key === "motherboard" && component ? (
                                <img
                                  src={
                                    component.image_url
                                      ? `http://localhost/gearsphere_api/GearSphere-BackEnd/${component.image_url}`
                                      : "/profile_images/user_image.jpg"
                                  }
                                  alt={component.name}
                                  style={{
                                    width: 56,
                                    height: 56,
                                    objectFit: "cover",
                                    borderRadius: 6,
                                  }}
                                />
                              ) : key === "motherboard" && !component ? (
                                <Motherboard size={40} className="text-info" />
                              ) : key === "ram" && component ? (
                                <img
                                  src={
                                    component.image_url
                                      ? `http://localhost/gearsphere_api/GearSphere-BackEnd/${component.image_url}`
                                      : "/profile_images/user_image.jpg"
                                  }
                                  alt={component.name}
                                  style={{
                                    width: 56,
                                    height: 56,
                                    objectFit: "cover",
                                    borderRadius: 6,
                                  }}
                                />
                              ) : key === "ram" && !component ? (
                                <Memory size={40} className="text-warning" />
                              ) : key === "storage" && component ? (
                                <img
                                  src={
                                    component.image_url
                                      ? `http://localhost/gearsphere_api/GearSphere-BackEnd/${component.image_url}`
                                      : "/profile_images/user_image.jpg"
                                  }
                                  alt={component.name}
                                  style={{
                                    width: 56,
                                    height: 56,
                                    objectFit: "cover",
                                    borderRadius: 6,
                                  }}
                                />
                              ) : key === "storage" && !component ? (
                                <Hdd size={40} className="text-danger" />
                              ) : key === "psu" && component ? (
                                <img
                                  src={
                                    component.image_url
                                      ? `http://localhost/gearsphere_api/GearSphere-BackEnd/${component.image_url}`
                                      : "/profile_images/user_image.jpg"
                                  }
                                  alt={component.name}
                                  style={{
                                    width: 56,
                                    height: 56,
                                    objectFit: "cover",
                                    borderRadius: 6,
                                  }}
                                />
                              ) : key === "psu" && !component ? (
                                <Power size={40} className="text-secondary" />
                              ) : key === "case" && component ? (
                                <img
                                  src={
                                    component.image_url
                                      ? `http://localhost/gearsphere_api/GearSphere-BackEnd/${component.image_url}`
                                      : "/profile_images/user_image.jpg"
                                  }
                                  alt={component.name}
                                  style={{
                                    width: 56,
                                    height: 56,
                                    objectFit: "cover",
                                    borderRadius: 6,
                                  }}
                                />
                              ) : key === "case" && !component ? (
                                <PcDisplay size={40} className="text-dark" />
                              ) : key === "cooling" && component ? (
                                <img
                                  src={
                                    component.image_url
                                      ? `http://localhost/gearsphere_api/GearSphere-BackEnd/${component.image_url}`
                                      : "/profile_images/user_image.jpg"
                                  }
                                  alt={component.name}
                                  style={{
                                    width: 56,
                                    height: 56,
                                    objectFit: "cover",
                                    borderRadius: 6,
                                  }}
                                />
                              ) : key === "cooling" && !component ? (
                                <Fan size={40} className="text-info" />
                              ) : key === "monitor" && component ? (
                                <img
                                  src={
                                    component.image_url
                                      ? `http://localhost/gearsphere_api/GearSphere-BackEnd/${component.image_url}`
                                      : "/profile_images/user_image.jpg"
                                  }
                                  alt={component.name}
                                  style={{
                                    width: 56,
                                    height: 56,
                                    objectFit: "cover",
                                    borderRadius: 6,
                                  }}
                                />
                              ) : key === "monitor" && !component ? (
                                componentIcons.monitor
                              ) : key === "operating_system" && component ? (
                                <img
                                  src={
                                    component.image_url
                                      ? `http://localhost/gearsphere_api/GearSphere-BackEnd/${component.image_url}`
                                      : "/profile_images/user_image.jpg"
                                  }
                                  alt={component.name}
                                  style={{
                                    width: 56,
                                    height: 56,
                                    objectFit: "cover",
                                    borderRadius: 6,
                                  }}
                                />
                              ) : key === "operating_system" && !component ? (
                                componentIcons.operating_system
                              ) : (
                                componentIcons[key]
                              )}
                            </Col>
                            <Col md={9}>
                              <Button
                                className="mb-2 btn-darkblue"
                                onClick={() =>
                                  key === "cpu"
                                    ? navigate("/cpu")
                                    : key === "gpu"
                                    ? navigate("/gpu")
                                    : key === "motherboard"
                                    ? navigate("/motherboard")
                                    : key === "ram"
                                    ? navigate("/memory")
                                    : key === "storage"
                                    ? navigate("/storage")
                                    : key === "psu"
                                    ? navigate("/powersupply")
                                    : key === "case"
                                    ? navigate("/case")
                                    : key === "cooling"
                                    ? navigate("/cpucooler")
                                    : key === "monitor"
                                    ? navigate("/monitor")
                                    : key === "operating_system"
                                    ? navigate("/operatingsystem")
                                    : null
                                }
                              >
                                {component
                                  ? `Change ${
                                      key === "gpu"
                                        ? "Video Card"
                                        : key === "ram"
                                        ? "Memory"
                                        : key === "psu"
                                        ? "Power Supply"
                                        : key === "cooling"
                                        ? "CPU Cooler"
                                        : key === "monitor"
                                        ? "Monitor"
                                        : key === "operating_system"
                                        ? "Operating System"
                                        : key.toUpperCase()
                                    }`
                                  : `Select ${
                                      key === "gpu"
                                        ? "Video Card"
                                        : key === "ram"
                                        ? "Memory"
                                        : key === "psu"
                                        ? "Power Supply"
                                        : key === "cooling"
                                        ? "CPU Cooler"
                                        : key === "monitor"
                                        ? "Monitor"
                                        : key === "operating_system"
                                        ? "Operating System"
                                        : key.toUpperCase()
                                    }`}
                              </Button>
                              {component && (
                                <span className="ms-2 text-muted small">
                                  Selected: <strong>{component.name}</strong>
                                </span>
                              )}
                              {component && component.specs && (
                                <div className="mt-2">
                                  <small className="text-muted">
                                    {Object.entries(component.specs).map(
                                      ([spec, value]) => (
                                        <span key={spec} className="me-3">
                                          <strong>{spec}:</strong> {value}
                                        </span>
                                      )
                                    )}
                                  </small>
                                </div>
                              )}
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    </div>
                  ))}
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Summary */}
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <h3>Build Summary</h3>
              <div className="mb-3">
                <h5>Selected Components</h5>
                <ul className="list-unstyled">
                  {Object.entries(selectedComponents)
                    .filter(([key]) => key !== "cooler" && key !== "os")
                    .map(([key, component]) => (
                      <li key={key} className="mb-2">
                        <strong>
                          {key === "gpu"
                            ? "Video Card"
                            : key === "ram"
                            ? "Memory"
                            : key === "psu"
                            ? "Power Supply"
                            : key === "cooling"
                            ? "CPU Cooler"
                            : key === "monitor"
                            ? "Monitor"
                            : key === "operating_system"
                            ? "Operating System"
                            : key.toUpperCase()}
                          :
                        </strong>{" "}
                        {component ? (
                          <>
                            {component.name}
                            <br />
                            <small className="text-muted">
                              LKR {component.price.toLocaleString()}
                            </small>
                          </>
                        ) : (
                          "Not selected"
                        )}
                      </li>
                    ))}
                </ul>
              </div>
              <div className="mb-3">
                <h5>Total Price</h5>
                <h3 className="text-primary">
                  LKR{" "}
                  {totalPrice.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </h3>
                {selectedRange && (
                  <div
                    className={`mt-2 ${
                      totalPrice >
                      budgetRanges.find((r) => r.id === selectedRange)?.max
                        ? "text-danger"
                        : totalPrice <
                          budgetRanges.find((r) => r.id === selectedRange)?.min
                        ? "text-warning"
                        : "text-success"
                    }`}
                  >
                    {totalPrice >
                    budgetRanges.find((r) => r.id === selectedRange)?.max ? (
                      <small>Exceeds budget range</small>
                    ) : totalPrice <
                      budgetRanges.find((r) => r.id === selectedRange)?.min ? (
                      <small>
                        Below minimum budget range. The best available build for
                        this budget is below your minimum. Consider selecting
                        higher-tier parts manually.
                      </small>
                    ) : (
                      <small>Within budget range</small>
                    )}
                  </div>
                )}
              </div>
              <Button
                variant="success"
                className="w-100"
                disabled={
                  Object.values(selectedComponents).filter((comp) => comp)
                    .length === 0
                }
                onClick={handleProceedToCheckout}
              >
                Proceed to Checkout
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Enhanced Comparison Modal */}
      <Modal
        show={showComparison}
        onHide={() => setShowComparison(false)}
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {componentIcons[comparisonType]} Compare{" "}
            {comparisonType.toUpperCase()} Options
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="table-responsive">
            <Table bordered hover>
              <thead>
                <tr>
                  <th>Feature</th>
                  {comparisonItems.map((item) => (
                    <th key={item.name} className="text-center">
                      <div className="mb-2">
                        {item.icon || componentIcons[comparisonType]}
                      </div>
                      <div>{item.name}</div>
                      <div className="text-primary">
                        LKR {item.price.toLocaleString()}
                      </div>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="mt-2"
                        onClick={() => handleSelectFromComparison(item)}
                      >
                        Select This
                      </Button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Technical Specifications */}
                <tr className="table-primary">
                  <td colSpan={comparisonItems.length + 1}>
                    <strong>Technical Specifications</strong>
                  </td>
                </tr>
                {comparisonItems[0]?.specs &&
                  Object.keys(comparisonItems[0].specs).map((spec) => (
                    <tr key={spec}>
                      <td>
                        <strong>{spec}</strong>
                      </td>
                      {comparisonItems.map((item) => (
                        <td key={item.name} className="text-center">
                          {safeGet(item, `specs.${spec}`)}
                        </td>
                      ))}
                    </tr>
                  ))}

                {/* Functionality */}
                <tr className="table-success">
                  <td colSpan={comparisonItems.length + 1}>
                    <strong>Functionality</strong>
                  </td>
                </tr>
                {comparisonItems[0]?.features?.functionality &&
                  Object.entries(comparisonItems[0].features.functionality).map(
                    ([key, _]) => (
                      <tr key={key}>
                        <td>
                          <strong>{key}</strong>
                        </td>
                        {comparisonItems.map((item) => (
                          <td key={item.name} className="text-center">
                            {safeGet(item, `features.functionality.${key}`)}
                          </td>
                        ))}
                      </tr>
                    )
                  )}

                {/* Usage Scenarios */}
                <tr className="table-info">
                  <td colSpan={comparisonItems.length + 1}>
                    <strong>Usage Scenarios</strong>
                  </td>
                </tr>
                {comparisonItems[0]?.features?.usage &&
                  Object.entries(comparisonItems[0].features.usage).map(
                    ([key, _]) => (
                      <tr key={key}>
                        <td>
                          <strong>{key}</strong>
                        </td>
                        {comparisonItems.map((item) => (
                          <td key={item.name}>
                            {safeGet(item, `features.usage.${key}`)}
                          </td>
                        ))}
                      </tr>
                    )
                  )}

                {/* Unique Features */}
                <tr className="table-warning">
                  <td colSpan={comparisonItems.length + 1}>
                    <strong>Unique Features</strong>
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Special Features</strong>
                  </td>
                  {comparisonItems.map((item) => (
                    <td key={item.name}>
                      <ul className="list-unstyled mb-0">
                        {(() => {
                          const features = safeGet(
                            item,
                            "features.uniqueFeatures"
                          );
                          const featureArray = Array.isArray(features)
                            ? features
                            : ["N/A"];
                          return featureArray.map((feature) => (
                            <li key={feature}>{feature}</li>
                          ));
                        })()}
                      </ul>
                    </td>
                  ))}
                </tr>

                {/* Price Analysis */}
                <tr className="table-secondary">
                  <td colSpan={comparisonItems.length + 1}>
                    <strong>Price Analysis</strong>
                  </td>
                </tr>
                {comparisonItems[0]?.features?.priceAnalysis &&
                  Object.entries(comparisonItems[0].features.priceAnalysis).map(
                    ([key, _]) => (
                      <tr key={key}>
                        <td>
                          <strong>{key}</strong>
                        </td>
                        {comparisonItems.map((item) => (
                          <td key={item.name} className="text-center">
                            {safeGet(item, `features.priceAnalysis.${key}`)}
                          </td>
                        ))}
                      </tr>
                    )
                  )}
              </tbody>
            </Table>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowComparison(false)}>
            Close
          </Button>
          <Button
            variant="info"
            onClick={() => {
              // Show all available options for this component type
              const allOptions = getPartOptions(comparisonType) || [];
              setComparisonItems(allOptions.slice(0, 5)); // Show top 5 options
            }}
          >
            Show More Options
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Checkout Confirmation Modal */}
      <Modal
        show={showCheckoutModal}
        onHide={() => setShowCheckoutModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Your PC Build</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={12}>
              <h5>Build Summary</h5>
              <div className="mb-3">
                <strong>Usage Type:</strong>{" "}
                {usageTypes[usage]?.name || "Not selected"}
              </div>
              <div className="mb-3">
                <strong>Budget Range:</strong>{" "}
                {budgetRanges.find((r) => r.id === selectedRange)?.name ||
                  "Not selected"}
              </div>
              <div className="mb-3">
                <strong>Selected Components:</strong>
                <div className="border rounded p-3 mt-2">
                  {Object.entries(selectedComponents)
                    .filter(([key]) => key !== "cooler" && key !== "os")
                    .map(([key, component]) => (
                      <div
                        key={key}
                        className="d-flex justify-content-between align-items-center mb-2"
                      >
                        <div>
                          <strong>
                            {key === "gpu"
                              ? "Video Card"
                              : key === "ram"
                              ? "Memory"
                              : key === "psu"
                              ? "Power Supply"
                              : key === "cooling"
                              ? "CPU Cooler"
                              : key === "monitor"
                              ? "Monitor"
                              : key === "operating_system"
                              ? "Operating System"
                              : key.toUpperCase()}
                            :
                          </strong>{" "}
                          {component?.name || "Not selected"}
                        </div>
                        {component && (
                          <span className="text-primary fw-bold">
                            LKR {component.price.toLocaleString()}
                          </span>
                        )}
                      </div>
                    ))}
                  <hr />
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Total:</h5>
                    <h4 className="mb-0 text-primary">
                      LKR {totalPrice.toLocaleString()}
                    </h4>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => setShowCheckoutModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCheckoutConfirm}>
            Proceed to Payment
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Payment Popup */}
      <Checkout
        show={showPaymentModal}
        onHide={() => setShowPaymentModal(false)}
        customOrderItems={pcBuildItems}
        customOrderTotal={totalPrice}
        customOrderType="PC Build"
        onCustomOrderSuccess={handlePaymentSuccess}
      />

      {/* Technician Choice Modal */}
      <Modal
        show={showTechnicianChoice}
        onHide={() => setShowTechnicianChoice(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-success">
            <i className="bi bi-check-circle-fill me-2"></i>
            Payment Successful!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center mb-4">
            <div className="text-success" style={{ fontSize: "3rem" }}>
              ✅
            </div>
            <h4 className="text-success mb-2">
              Your PC Build Order is Confirmed!
            </h4>
            <p className="text-muted">What would you like to do next?</p>
          </div>

          <Row className="mb-4">
            <Col md={12}>
              <h5>Build Summary</h5>
              <div className="border rounded p-3">
                <div className="mb-2">
                  <strong>Usage Type:</strong>{" "}
                  {usageTypes[usage]?.name || "Not selected"}
                </div>
                <div className="mb-2">
                  <strong>Budget Range:</strong>{" "}
                  {budgetRanges.find((r) => r.id === selectedRange)?.name ||
                    "Not selected"}
                </div>
                <div className="mb-2">
                  <strong>Total Amount:</strong>{" "}
                  <span className="text-primary fw-bold">
                    LKR {totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </Col>
          </Row>

          <Row className="g-3">
            <Col md={6}>
              <Card className="h-100 text-center border-primary">
                <Card.Body>
                  <div className="mb-3">
                    <i
                      className="bi bi-list-ul"
                      style={{ fontSize: "2rem", color: "#0d6efd" }}
                    ></i>
                  </div>
                  <h6>View Your Orders</h6>
                  <p className="text-muted small">
                    Check the status of your PC build order and track its
                    progress.
                  </p>
                  <Button
                    variant="outline-primary"
                    className="w-100"
                    onClick={handleGoToOrders}
                  >
                    Go to Orders
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="h-100 text-center border-success">
                <Card.Body>
                  <div className="mb-3">
                    <i
                      className="bi bi-tools"
                      style={{ fontSize: "2rem", color: "#198754" }}
                    ></i>
                  </div>
                  <h6>Assign Technician</h6>
                  <p className="text-muted small">
                    Get a professional technician to build and set up your
                    custom PC.
                  </p>
                  <Button
                    variant="outline-success"
                    className="w-100"
                    onClick={handleAssignTechnician}
                  >
                    Assign Technician
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            onClick={() => setShowTechnicianChoice(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Clear Confirmation Modal */}
      <Modal
        show={showClearConfirmModal}
        onHide={handleCancelClear}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-exclamation-triangle text-warning me-2"></i>
            Clear All Components
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-3">
            Are you sure you want to clear all selected components? This action
            cannot be undone.
          </p>
          <div className="alert alert-warning mb-0">
            <small>
              <i className="bi bi-info-circle me-1"></i>
              This will remove all selected parts, reset your budget and usage
              preferences, and clear any saved progress.
            </small>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelClear}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmClear}>
            <i className="bi bi-trash me-1"></i>
            Clear All
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default PCBuilder;
