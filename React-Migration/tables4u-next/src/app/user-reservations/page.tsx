"use client";

import React, { useState } from "react";
import styles from "./styles.module.css";

export default function UserReservationLookup() {
  const [error, setError] = useState<string>("");
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState<boolean>(false);
  const [selectedReservation, setSelectedReservation] = useState<any>(null);
  const [confirmationCode, setConfirmationCode] = useState<string>("");

  const handleLookup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const emailInput = event.currentTarget.elements.namedItem("email") as HTMLInputElement;
    const email = emailInput.value.trim();

    setError("");
    setReservations([]);
    setLoading(true);

    try {
      const response = await fetch(
        "https://jx7q3te4na.execute-api.us-east-2.amazonaws.com/Stage2/findExistingReservation",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        const parsedBody = JSON.parse(result.body); // Convert `body` to an object
        setReservations(parsedBody.data || []); // Update reservations state
      } else {
        setError(result.error || "Could not find reservation. Please try again.");
      }
    } catch (err: any) {
      console.error("Error fetching reservation:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const openCancelModal = (reservation: any) => {
    setSelectedReservation(reservation);
    setIsCancelModalOpen(true);
  };

  const closeCancelModal = () => {
    setIsCancelModalOpen(false);
    setSelectedReservation(null);
    setConfirmationCode("");
  };

  const handleCancelReservation = async () => {
    if (!confirmationCode.trim()) {
      setError("Confirmation code is required to cancel the reservation.");
      return;
    }

    try {
      const response = await fetch(
        "https://jx7q3te4na.execute-api.us-east-2.amazonaws.com/Stage2/CancelReservation",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: selectedReservation.userEmail,
            confirmationCode: parseInt(confirmationCode, 10),
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setReservations((prev) =>
          prev.filter((res) => res.reservationID !== selectedReservation.reservationID)
        );
        closeCancelModal();
      } else {
        setError(result.error || "Could not cancel the reservation. Please try again.");
      }
    } catch (err: any) {
      console.error("Error cancelling reservation:", err);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div>
      <div className={styles.container}>
        <h1 className={styles.formTitle}>Reservation Lookup</h1>
        <form className={styles.form} onSubmit={handleLookup} method="POST">
          {error && <div className={styles.error}>{error}</div>}

          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            name="email"
            placeholder="Enter your email"
            required
            className={styles.input}
          />

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Looking up..." : "Lookup Reservation"}
          </button>
        </form>

        {reservations.length > 0 && (
          <div style={{ marginTop: "20px" }}>
            <h2>Your Reservations</h2>
            <ul>
            {reservations.map((res, index) => {
                const formattedDate = new Date(res.reserveDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                });

                return (
                    <li key={index}>
                    <p><strong>Reservation ID:</strong> {res.reservationID}</p>
                    <p><strong>Restaurant Address:</strong> {res.restaurantResID}</p>
                    <p><strong>Date:</strong> {formattedDate}</p>
                    <p><strong>Time:</strong> {res.reserveTime}</p>
                    <button
                        className={`${styles.redButton} ${styles.redButton}`}
                        onClick={() => openCancelModal(res)}
                    >
                        Cancel Reservation
                    </button>
                    <hr />
                    </li>
                );
                })}
            </ul>
          </div>
        )}
      </div>

      {isCancelModalOpen && (
  <div className={styles.modal}>
    <div className={styles.modalContent}>
      <h2>Cancel Reservation</h2>
      <p>
        Please enter the confirmation code to cancel the reservation at{" "}
        <strong>{selectedReservation.restaurantResID}</strong>.
      </p>
      <input
        type="text"
        placeholder="Confirmation Code"
        value={confirmationCode}
        onChange={(e) => setConfirmationCode(e.target.value)}
        className={styles.input}
      />
        <div style={{ marginTop: "20px" }}>
        <button onClick={handleCancelReservation} className={`${styles.redButton} ${styles.redButton}`}>
            Confirm Cancellation
        </button>
        <button onClick={closeCancelModal} className={styles.button}>
            Close
        </button>
        </div>
    </div>
  </div>
)}
    </div>
  );
}