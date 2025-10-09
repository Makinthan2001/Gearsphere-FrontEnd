import React, { useEffect, useState } from "react";
import { Card, Button, Spinner, Table, Modal } from "react-bootstrap";
import LoadingScreen from "../../components/loading/LoadingScreen";
import { toast } from "react-toastify";

export default function AdminModerateReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost/gearsphere_api/GearSphere-BackEnd/getReviews.php")
      .then((res) => res.json())
      .then((data) => {
        setReviews(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  }, []);

  const moderate = async (id, status) => {
    try {
      const res = await fetch(
        "http://localhost/gearsphere_api/GearSphere-BackEnd/moderateReview.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, status }),
        }
      );
      const data = await res.json();
      if (data.success) {
        setReviews(reviews.map((r) => (r.id === id ? { ...r, status } : r)));
        toast.success(`Review ${status}`);
      } else {
        toast.error(data.error || "Error moderating review");
      }
    } catch (e) {
      toast.error("Error moderating review");
    }
  };

  return (
    <>
      {loading && (
        <LoadingScreen
          message="Loading Reviews"
          submessage="Fetching reviews for moderation"
        />
      )}
      <div className="container py-4">
        <Card>
          <Card.Body>
            <Card.Title>All Reviews</Card.Title>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Reviewer</th>
                  <th>Reviewer Type</th>
                  <th>Target</th>
                  <th>Target Email</th>
                  <th>Rating</th>
                  <th>Comment</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviews.length === 0 && (
                  <tr>
                    <td colSpan={7}>
                      <span className="text-muted">No reviews found.</span>
                    </td>
                  </tr>
                )}
                {reviews.map((r) => (
                  <tr key={r.id}>
                    <td>{r.sender_name}</td>
                    <td>{r.sender_type}</td>
                    <td>
                      {r.target_type === "system"
                        ? "System"
                        : `Technician #${r.target_id}`}
                    </td>
                    <td>{r.target_email ? r.target_email : "-"}</td>
                    <td>{r.rating}★</td>
                    <td>{r.comment}</td>
                    <td>{r.status}</td>
                    <td>
                      {r.status !== "approved" && (
                        <Button
                          size="sm"
                          variant="success"
                          className="me-1"
                          onClick={() => moderate(r.id, "approved")}
                        >
                          Approve
                        </Button>
                      )}
                      {r.status !== "rejected" && (
                        <Button
                          size="sm"
                          variant="warning"
                          className="me-1"
                          onClick={() => moderate(r.id, "rejected")}
                        >
                          Reject
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </div>
    </>
  );
}
