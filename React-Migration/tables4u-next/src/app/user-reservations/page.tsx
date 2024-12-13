"use client";

import React, { useState } from "react";
import styles from "./styles.module.css";

export default function UserReservationLookup() {
  const [error, setError] = useState<string>("");
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleLookup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const emailInput = event.currentTarget.elements.namedItem("email") as HTMLInputElement;
    const confirmationInput = event.currentTarget.elements.namedItem("confirmationCode") as HTMLInputElement;

    const email = emailInput.value.trim();
    const confirmationCode = confirmationInput.value.trim();

    setError(""); 
    setReservations([]);
    setLoading(true);

    try {
      // Call the provided Lambda endpoint
      const response = await fetch(
        "https://jx7q3te4na.execute-api.us-east-2.amazonaws.com/Stage2/findExistingReservation",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }), 
          // NOTE: The current Lambda does not handle confirmationCode.
          // Once the backend supports it, you can add it as well:
          // body: JSON.stringify({ email, confirmationCode })
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Successfully retrieved reservations
        setReservations(data.data || []);
      } else {
        // If there's an error
        setError(data.error || "Could not find reservation. Please try again.");
      }
    } catch (err: any) {
      console.error("Error fetching reservation:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className={styles.container}>
        <h1 className={styles.formTitle}>Reservation Lookup</h1>
        <form className={styles.form} onSubmit={handleLookup}>
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

          <label htmlFor="confirmationCode">Confirmation Code / Reservation ID</label>
          <input 
            type="text"
            id="confirmationCode"
            name="confirmationCode"
            placeholder="Enter your confirmation code or reservation ID"
            className={styles.input}
          />

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Looking up..." : "Lookup Reservation"}
          </button>
        </form>

        {/* Display reservations if any */}
        {reservations.length > 0 && (
          <div style={{ marginTop: "20px" }}>
            <h2>Your Reservations</h2>
            <ul>
              {reservations.map((res, index) => (
                <li key={index}>
                  {/* Display relevant reservation details here */}
                  <p><strong>Reservation ID:</strong> {res.reservationID}</p>
                  <p><strong>Restaurant ID:</strong> {res.restaurantID}</p>
                  <p><strong>Date:</strong> {res.reservationDate}</p>
                  <p><strong>Time:</strong> {res.reservationTime}</p>
                  {/* Add more fields as needed based on your DB schema */}
                  <hr />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}