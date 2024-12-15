"use client";

import React, { useState } from "react";
import styles from "./styles.module.css";

interface Reservation {
  reservationID: string;
  restaurantResID: string;
  reserveDate: string; // Format: YYYY-MM-DD
  reserveTime: string; // Format: HH:MM
  userEmail: string;
  numPeople: number;
}

export default function UserReservationLookup() {
  const [error, setError] = useState<string>("");
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState<boolean>(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [confirmationCode, setConfirmationCode] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const handleLookup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const emailInput = event.currentTarget.elements.namedItem("email") as HTMLInputElement;
    const email = emailInput.value.trim();

    setError("");
    setReservations([]);
    setLoading(true);

    try {
      const response = await fetch(
        "https://x51lo0cnd3.execute-api.us-east-2.amazonaws.com/Stage1/findExistingReservation",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        const parsedBody = JSON.parse(result.body);
        setReservations(parsedBody.data || []);
      } else {
        setError(result.error || "Could not find reservation. Please try again.");
      }
    } catch (error) {
      if (error instanceof Error) {
          console.error("Error message:", error.message);
      } 
  }finally {
      setLoading(false);
    }
  };

  const openCancelModal = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setIsCancelModalOpen(true);
};

  const closeCancelModal = () => {
    setIsCancelModalOpen(false);
    setSelectedReservation(null);
    setConfirmationCode("");
  };

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
    setSuccessMessage("");
  };

  const handleCancelReservation = async () => {
    if (!confirmationCode.trim()) {
      setError("Confirmation code is required to cancel the reservation.");
      return;
    }
  
    try {
      const response = await fetch(
        "https://x51lo0cnd3.execute-api.us-east-2.amazonaws.com/Stage1/cancelReservation",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: selectedReservation?.userEmail,
            confirmationCode: parseInt(confirmationCode, 10),
          }),
        }
      );
  
      const result = await response.json(); // Call once and use below
  
      if (result.statusCode!=200) {
        if (response.status === 404) {
          setError(result.error || "Reservation not found for the given email and confirmation code.");
          return;
        }
        setError(result.error || `An error occurred. Status: ${response.status}`);
        return;
      }
  
      // Success case
      const parsedBody = JSON.parse(result.body);
      setReservations((prev) =>
        prev.filter((res) => res.reservationID !== selectedReservation?.reservationID)
      );
      setSuccessMessage(parsedBody.message);
      setIsSuccessModalOpen(true);
      closeCancelModal();
    } catch (error) {
      if (error instanceof Error) {
          console.error("Error cancelling reservation:", error.message);
          setError("An unexpected error occurred. Please try again.");
      } else {
          console.error("Unknown error:", error);
          setError("An unknown error occurred.");
      }
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
                const date = new Date(res.reserveDate);
                const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()+1).padStart(2, '0')}`;

                return (
                  <li key={index}>
                    <p><strong>Reservation ID:</strong> {res.reservationID}</p>
                    <p><strong>Restaurant Address:</strong> {res.restaurantResID}</p>
                    <p><strong>Date:</strong> {formattedDate}</p>
                    <p><strong>Time:</strong> {res.reserveTime}</p>
                    <button
                      className={`${styles.redButton}`}
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

      {/* Cancel Modal */}
      {isCancelModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Cancel Reservation</h2>
            <p>
              Please enter the confirmation code to cancel the reservation at{" "}
              <strong>{selectedReservation?.restaurantResID}</strong>.
            </p>
            <input
              type="text"
              placeholder="Confirmation Code"
              value={confirmationCode}
              onChange={(e) => setConfirmationCode(e.target.value)}
              className={styles.input}
            />
            <div style={{ marginTop: "20px" }}>
              <button
                onClick={handleCancelReservation}
                className={`${styles.redButton}`}
              >
                Confirm Cancellation
              </button>
              <button onClick={closeCancelModal} className={styles.button}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {isSuccessModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Success</h2>
            <p>{successMessage}</p>
            <button onClick={closeSuccessModal} className={styles.button}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}