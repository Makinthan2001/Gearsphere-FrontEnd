import React, { useState, useEffect, useMemo } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Form,
} from "react-bootstrap";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import LoadingScreen from "../../components/loading/LoadingScreen";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  const [timeRange, setTimeRange] = useState("month");
  const [metricType, setMetricType] = useState("revenue");
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const url = `http://localhost/gearsphere_api/GearSphere-BackEnd/getSellerAnalytics.php`;
    fetch(url, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) throw new Error(data.message || "Unknown error");
        setAnalyticsData(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Memoize chart data to ensure it updates when metricType changes
  // Must be called before early returns to maintain hook order
  const chartData = useMemo(() => {
    if (!analyticsData) {
      return { salesTrendData: null, categoryData: null };
    }

    // Generate months dynamically based on backend data
    function getMonthsFromBackendData() {
      // Use the periods directly from the backend data
      const backendPeriods = (analyticsData.salesTrend || []).map(
        (item) => item.period
      );

      // If we have backend data, use those periods
      if (backendPeriods.length > 0) {
        return backendPeriods.sort(); // Sort to ensure chronological order
      }

      // Fallback: generate last 6 months including current
      const months = [];
      const currentDate = new Date();
      for (let i = 5; i >= 0; i--) {
        const date = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() - i,
          1
        );
        const monthString = date.toISOString().slice(0, 7);
        months.push(monthString);
      }
      return months;
    }

    // Always use current month as the latest month to ensure it's included
    const currentMonth = new Date().toISOString().slice(0, 7); // Should be "2025-08"
    const lastNMonths = getMonthsFromBackendData(); // Use dynamic months from backend
    const salesTrendMap = {};
    (analyticsData.salesTrend || []).forEach((item) => {
      salesTrendMap[item.period] = item;
    });
    const normalizedSalesTrend = lastNMonths.map((period) => ({
      period,
      revenue: salesTrendMap[period]?.revenue || 0,
      orders: salesTrendMap[period]?.orders || 0,
    }));

    // Format month labels for better readability (e.g., "Aug 2025" instead of "2025-08")
    const formatMonthLabel = (monthString) => {
      const date = new Date(monthString + "-01");
      return date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
    };

    const salesTrendData = {
      labels: normalizedSalesTrend.map((item) => formatMonthLabel(item.period)),
      datasets: [
        {
          label: metricType === "revenue" ? "Revenue" : "Orders",
          data: normalizedSalesTrend.map((item) =>
            metricType === "revenue" ? item.revenue : item.orders
          ),
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    };

    const categoryData = {
      labels: (analyticsData.categoryPerformance || []).map(
        (item) => item.category
      ),
      datasets: [
        {
          data: (analyticsData.categoryPerformance || []).map(
            (item) => item.percentage
          ),
          backgroundColor: [
            "rgba(255, 99, 132, 0.5)",
            "rgba(54, 162, 235, 0.5)",
            "rgba(255, 206, 86, 0.5)",
            "rgba(255, 205, 86, 0.5)",
            "rgba(75, 192, 192, 0.5)",
            "rgba(153, 102, 255, 0.5)",
            "rgba(255, 159, 64, 0.5)",
            "rgba(199, 199, 199, 0.5)",
            "rgba(83, 102, 255, 0.5)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(255, 205, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
            "rgba(199, 199, 199, 1)",
            "rgba(83, 102, 255, 1)",
          ],
          borderWidth: 1,
        },
      ],
    };

    return { salesTrendData, categoryData };
  }, [analyticsData, metricType]);

  if (loading)
    return (
      <LoadingScreen
        message="Loading Analytics"
        submessage="Fetching seller performance data"
      />
    );
  if (error)
    return (
      <div className="text-center py-5 text-danger">
        <h4>{error}</h4>
      </div>
    );
  if (!analyticsData) return null;

  const salesTrendOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Sales Trend",
      },
    },
  };

  const categoryOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Category Distribution",
      },
    },
  };

  const formatCurrency = (amount) => {
    return "LKR " + Number(amount).toLocaleString("en-LK");
  };

  const formatPercentage = (value) => {
    return `${value}%`;
  };

  return (
    <Container className="py-5">
      <h1 className="text-center mb-5">Analytics Dashboard</h1>

      <Row className="mb-4">
        <Col md={4}>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <h6 className="text-muted mb-2">Total Revenue</h6>
              <h3>{formatCurrency(analyticsData.summary.totalRevenue)}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <h6 className="text-muted mb-2">Total Orders</h6>
              <h3>{analyticsData.summary.totalOrders}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <h6 className="text-muted mb-2">Average Order Value</h6>
              <h3>{formatCurrency(analyticsData.summary.averageOrderValue)}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="mb-0">Sales Trend</h5>
                <div className="d-flex gap-2">
                  <Form.Select
                    style={{ width: "150px" }}
                    value={metricType}
                    onChange={(e) => setMetricType(e.target.value)}
                  >
                    <option value="revenue">Revenue</option>
                    <option value="orders">Orders</option>
                  </Form.Select>
                </div>
              </div>
              <div style={{ height: "300px" }}>
                {chartData.salesTrendData ? (
                  <Line
                    key={metricType}
                    data={chartData.salesTrendData}
                    options={salesTrendOptions}
                  />
                ) : (
                  <div className="d-flex align-items-center justify-content-center h-100">
                    <span className="text-muted">No data available</span>
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <h5 className="mb-4">Category Distribution</h5>
              <div style={{ height: "300px" }}>
                {chartData.categoryData ? (
                  <Pie
                    data={chartData.categoryData}
                    options={categoryOptions}
                  />
                ) : (
                  <div className="d-flex align-items-center justify-content-center h-100">
                    <span className="text-muted">No data available</span>
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={12}>
          <Card className="shadow-sm">
            <Card.Body>
              <h5 className="mb-4">Top Performing Products</h5>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Sales</th>
                    <th>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {(analyticsData.topProducts || []).map((product) => (
                    <tr key={product.product_id}>
                      <td>{product.name}</td>
                      <td>{product.sales}</td>
                      <td>{formatCurrency(product.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* <Row>
        <Col md={12}>
          <Card className="shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="mb-0">Export Reports</h5>
                <div className="d-flex gap-2">
                  <Button variant="outline-primary">Export Sales Report</Button>
                  <Button variant="outline-primary">
                    Export Product Report
                  </Button>
                </div>
              </div>
              <p className="text-muted">
                Generate detailed reports for sales, products, and customer
                analytics. Reports can be exported in CSV or PDF format.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row> */}
    </Container>
  );
};

export default Analytics;
