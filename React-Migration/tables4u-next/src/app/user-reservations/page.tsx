"use client";

import React, { useState } from "react";
import styles from "./styles.module.css";

export default function UserReservationLookup() {
  const [error, setError] = useState<string>("");
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleLookup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Form submitted, preventDefault called."); // Debugging line

    const emailInput = event.currentTarget.elements.namedItem("email") as HTMLInputElement;
    const confirmationInput = event.currentTarget.elements.namedItem("confirmationCode") as HTMLInputElement;

    const email = emailInput.value.trim();
    const confirmationCode = confirmationInput.value.trim();
   



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
        // Parse the stringified body field
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
                        <hr />
                    </li>
                    );
                })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}