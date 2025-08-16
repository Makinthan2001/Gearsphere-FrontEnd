import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Spinner,
  Alert,
} from "react-bootstrap";
import {
  People,
  ClipboardCheck,
  GraphUp,
  Tools,
  Award,
} from "react-bootstrap-icons";
import axios from "axios";
import styles from "./AdminDashboard.module.css";
import LoadingScreen from "../../components/loading/LoadingScreen";

function AdminDashboard() {
  const [dashboard, setDashboard] = useState({
    latestCustomers: [],
    latestTechnicians: [],
    technicianCount: 0,
    latestMessages: [],
    latestReviews: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 350, // Placeholder
    pendingVerifications: 7, // Placeholder
    reports: 12, // Placeholder
    analytics: 1, // Placeholder
  });

  useEffect(() => {
    setLoading(true);
    axios
      .get(
        "http://localhost/gearsphere_api/GearSphere-BackEnd/getDashboardStats.php"
      )
      .then((res) => {
        setDashboard(res.data);
        setStats((prev) => ({
          ...prev,
          totalUsers:
            res.data.latestCustomers.length + res.data.technicianCount,
        }));
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load dashboard data");
        setLoading(false);
      });
  }, []);

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <Card className="h-100">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h6 className="text-muted mb-2">{title}</h6>
            <h3 className="mb-0">{value}</h3>
          </div>
          <div className={`bg-${color} bg-opacity-10 p-3 rounded`}>
            <Icon size={24} className={`text-${color}`} />
          </div>
        </div>
      </Card.Body>
    </Card>
  );

  if (loading)
    return (
      <LoadingScreen
        message="Loading Admin Dashboard"
        subMessage="Fetching system analytics and data"
      />
    );
  if (error)
    return (
      <Alert variant="danger" className="my-5">
        {error}
      </Alert>
    );

  return (
    <>
      {/* Hero Section */}
      <section
        className="py-5 bg-black text-white position-relative overflow-hidden mb-5"
        style={{
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          borderBottomLeftRadius: "2rem",
          borderBottomRightRadius: "2rem",
          boxShadow: "0 4px 32px rgba(0,0,0,0.10)",
          marginTop: 0,
          marginBottom: "2rem",
        }}
      >
        {/* Blurred background image */}
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            backgroundImage: `url(/src/images/pcpic2.jpeg)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(12px)",
            zIndex: 0,
            opacity: 0.7,
          }}
        ></div>
        {/* Overlay for darkening and contrast */}
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background:
              "radial-gradient(circle at 30% 50%, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0) 70%)",
            zIndex: 1,
          }}
        ></div>
        <Container className="py-5 position-relative" style={{ zIndex: 2 }}>
          <Row className="align-items-center">
            <Col lg={6} className="mb-5 mb-lg-0">
              <h1
                className="display-3 fw-bold mb-4 rise-up"
                style={{ animationDelay: "0s" }}
              >
                GearSphere <span className="text-primary">Admin Dashboard</span>
              </h1>
              <p
                className="lead mb-5 rise-up"
                style={{ animationDelay: "0.3s" }}
              >
                Monitor platform activity, manage users, and oversee all
                operations from one place.
              </p>
              <div
                className="d-flex gap-3 rise-up"
                style={{ animationDelay: "0.6s" }}
              >
                {/* Add admin-specific buttons here if needed */}
              </div>
            </Col>
            <Col
              lg={6}
              className="text-lg-end"
              style={{ backgroundBlendMode: "darken" }}
            >
              {/* Optionally add an admin-related image or animation here */}
            </Col>
          </Row>
        </Container>
        {/* Blurred background image */}
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            backgroundImage: `url(/src/images/pcpic2.jpeg)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            backgroundBlendMode: "darken",
            zIndex: 0,
            opacity: 1,
          }}
        ></div>
        {/* Overlay for darkening and contrast */}
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background:
              "radial-gradient(circle at 30% 50%, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0) 70%)",
            zIndex: 1,
          }}
        ></div>
      </section>
      {/* Existing Dashboard Content */}
      <Container className="py-5">
        <h1 className="mb-4">Admin Dashboard</h1>
        <Row className="g-4 mb-4">
          <Col md={6}>
            <StatCard
              title="Total Technician Count"
              value={dashboard.technicianCount}
              icon={People}
              color="primary"
            />
          </Col>
          <Col md={6}>
            <StatCard
              title="Total Customer Count"
              value={dashboard.latestCustomers.length}
              icon={People}
              color="success"
            />
          </Col>
        </Row>

        {/* Dashboard Data Tables */}
        <Row className="mt-5">
          <Col md={12} className={styles["dashboard-section"]}>
            <h4 className={styles["dashboard-title"]}>New Customers</h4>
            <Table
              className={styles["dashboard-table"]}
              striped
              bordered
              hover
              size="sm"
            >
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Registered</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.latestCustomers.map((c) => (
                  <tr key={c.user_id}>
                    <td>
                      {c.profile_image && (
                        <img
                          src={`http://localhost/gearsphere_api/GearSphere-BackEnd/profile_images/${c.profile_image}`}
                          alt=""
                          className={styles["dashboard-avatar"]}
                        />
                      )}
                      {c.name}
                    </td>
                    <td>{c.email}</td>
                    <td>{c.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
          <Col md={12} className={styles["dashboard-section"]}>
            <h4 className={styles["dashboard-title"]}>New Technicians</h4>
            <Table
              className={styles["dashboard-table"]}
              striped
              bordered
              hover
              size="sm"
            >
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Registered</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.latestTechnicians.map((t) => (
                  <tr key={t.user_id}>
                    <td>
                      {t.profile_image && (
                        <img
                          src={`http://localhost/gearsphere_api/GearSphere-BackEnd/profile_images/${t.profile_image}`}
                          alt=""
                          className={styles["dashboard-avatar"]}
                        />
                      )}
                      {t.name}
                    </td>
                    <td>{t.email}</td>
                    <td>{t.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col md={12} className={styles["dashboard-section"]}>
            <h4 className={styles["dashboard-title"]}>New Reviews</h4>
            <Table
              className={styles["dashboard-table"]}
              striped
              bordered
              hover
              size="sm"
            >
              <thead>
                <tr>
                  <th>Sender</th>
                  <th>Rating</th>
                  <th>Comment</th>
                  {/* <th>ID</th> */}
                  <th>Target Email</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.latestReviews.map((r) => (
                  <tr key={r.id}>
                    <td>
                      {r.sender_name} ({r.sender_type})
                    </td>
                    <td>{r.rating}</td>
                    <td>{r.comment}</td>
                    {/* <td>{r.target_id}</td> */}
                    <td>{r.target_email ? r.target_email : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
          <Col md={12} className={styles["dashboard-section"]}>
            <h4 className={styles["dashboard-title"]}>New Messages</h4>
            <Table
              className={styles["dashboard-table"]}
              striped
              bordered
              hover
              size="sm"
            >
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Message</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.latestMessages.map((m) => (
                  <tr key={m.message_id}>
                    <td>{m.name}</td>
                    <td>{m.email}</td>
                    <td style={{ maxWidth: 200, whiteSpace: "pre-line" }}>
                      {m.message}
                    </td>
                    <td>{m.date}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default AdminDashboard;
