import React, { useState, useEffect } from "react";
import { Form, Button, Card, Row, Col, Alert, Spinner } from "react-bootstrap";
import axios from "axios";
import LoadingScreen from "../../components/loading/LoadingScreen";

export default function CustomerReviews() {
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({
    target_type: "technician",
    target_id: "",
    rating: 5,
    comment: "",
  });
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    async function fetchUserAndData() {
      setLoading(true);
      setAlert(null);
      try {
        // Get user session from backend
        const sessionResponse = await axios.get(
          "http://localhost/gearsphere_api/GearSphere-BackEnd/getSession.php",
          { withCredentials: true }
        );

        if (!sessionResponse.data.success) {
          setAlert({ type: "danger", msg: "Session expired. Please log in." });
          setLoading(false);
          return;
        }

        const currentUserId = sessionResponse.data.user_id;
        setUserId(currentUserId);
        // Fetch technicians
        const techsRes = await fetch(
          `http://localhost/gearsphere_api/GearSphere-BackEnd/getHiredTechnicians.php?user_id=${currentUserId}`,
          {
            credentials: "include",
          }
        );
        if (!techsRes.ok) throw new Error("Technician fetch failed");
        const techsJson = await techsRes.json();
        setTechnicians(Array.isArray(techsJson) ? techsJson : []);

        // Fetch reviews
        const reviewsRes = await fetch(
          `http://localhost/gearsphere_api/GearSphere-BackEnd/getReviews.php?user_id=${currentUserId}`,
          {
            credentials: "include",
          }
        );
        if (!reviewsRes.ok) throw new Error("Reviews fetch failed");
        const reviewsJson = await reviewsRes.json();
        setReviews(Array.isArray(reviewsJson) ? reviewsJson : []);
      } catch (e) {
        setAlert({ type: "danger", msg: "Failed to load data from server." });
        setTechnicians([]);
        setReviews([]);
      }
      setLoading(false);
    }

    fetchUserAndData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);

    if (!userId) {
      setAlert({ type: "danger", msg: "Session expired. Please log in." });
      return;
    }

    try {
      const submitData = { ...form, user_id: userId };
      if (form.target_type === "system") submitData.target_id = null;

      const res = await fetch(
        "http://localhost/gearsphere_api/GearSphere-BackEnd/addReview.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(submitData),
        }
      );

      const data = await res.json();
      if (data.success) {
        setAlert({ type: "success", msg: "Review submitted!" });
        setForm({ ...form, target_id: "", rating: 5, comment: "" });

        // Refresh reviews
        const reviewsRes = await fetch(
          `http://localhost/gearsphere_api/GearSphere-BackEnd/getReviews.php?user_id=${userId}`,
          {
            credentials: "include",
          }
        );
        const reviewsJson = await reviewsRes.json();
        setReviews(reviewsJson);
      } else {
        setAlert({
          type: "danger",
          msg: data.error || "Error submitting review",
        });
      }
    } catch (e) {
      setAlert({ type: "danger", msg: "Error submitting review" });
    }
  };

  // Show loading screen while data is being fetched
  if (loading) {
    return (
      <LoadingScreen
        message="Loading Reviews"
        subMessage="Fetching your review history"
      />
    );
  }

  return (
    <div className="container py-4">
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Submit a Review</Card.Title>
          {alert && <Alert variant={alert.type}>{alert.msg}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Review Type</Form.Label>
                  <Form.Select
                    name="target_type"
                    value={form.target_type}
                    onChange={handleChange}
                    required
                  >
                    <option value="technician">Technician</option>
                    <option value="system">General Feedback</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              {form.target_type === "technician" && (
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Select Technician</Form.Label>
                    <Form.Select
                      name="target_id"
                      value={form.target_id}
                      onChange={handleChange}
                      required={form.target_type === "technician"}
                      disabled={technicians.length === 0}
                    >
                      <option value="">Select a technician</option>
                      {technicians.map((tech) => (
                        <option key={tech.id} value={tech.id}>
                          {tech.name}
                        </option>
                      ))}
                    </Form.Select>
                    {technicians.length === 0 && !loading && (
                      <div className="text-muted small mt-2">
                        No assigned technicians found for you yet.
                      </div>
                    )}
                  </Form.Group>
                </Col>
              )}
            </Row>
            <Row className="mb-3">
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Rating</Form.Label>
                  <Form.Select
                    name="rating"
                    value={form.rating}
                    onChange={handleChange}
                    required
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n} ★
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Your Review</Form.Label>
              <Form.Control
                as="textarea"
                name="comment"
                value={form.comment}
                onChange={handleChange}
                rows={3}
              />
            </Form.Group>
            <Button
              type="submit"
              variant="primary"
              disabled={
                loading ||
                (form.target_type === "technician" && technicians.length === 0)
              }
            >
              {loading ? <Spinner size="sm" /> : "Submit Review"}
            </Button>
          </Form>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <Card.Title>Your Reviews</Card.Title>
          <Row>
            {reviews.length === 0 && (
              <Col>
                <Alert variant="info">No reviews yet.</Alert>
              </Col>
            )}
            {reviews.map((r) => (
              <Col md={6} key={r.id} className="mb-3">
                <Card>
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="fw-bold">
                        {r.target_type === "technician"
                          ? `Technician #${r.target_id}`
                          : "General Feedback"}
                      </span>

                      <span className="text-warning">{r.rating} ★</span>
                    </div>
                    <div>{r.comment}</div>
                    <div className="text-muted small mt-2">
                      Status: {r.status}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
}
