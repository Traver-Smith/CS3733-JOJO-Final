"use client";

import React, { useState } from "react";
import styles from "./styles.module.css";

export default function UserReservationLookup() {
  const [error, setError] = useState<string>("");

  // Handle the form submit event for reservation lookup
  const handleLookup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const email = (event.currentTarget.elements.namedItem("email") as HTMLInputElement).value;
    const confirmationCode = (event.currentTarget.elements.namedItem("confirmationCode") as HTMLInputElement).value;

    setError(""); // Reset error state

    try {
      // ------------------------------------------------------
      // const response = await fetch("YOUR_RESERVATION_LOOKUP_API_ENDPOINT", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email, confirmationCode }),
      // });
      //
      // const data = await response.json();
      //
      // if (response.ok) {
      //   // Handle successful reservation lookup, e.g.:
      //   // window.location.href = `/user-reservation-details?reservationId=${data.reservationId}`;
      // } else {
      //   setError(data.error || "Could not find reservation. Please try again.");
      // }
      //
      // Since we have no actual endpoint at this moment, we'll just simulate:
      setTimeout(() => {
        alert(`This would display reservation details for ${email} with code: ${confirmationCode}`);
      }, 500);
      // ------------------------------------------------------
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
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
            required
            className={styles.input}
          />

          <button type="submit" className={styles.button}>Lookup Reservation</button>
        </form>
      </div>
    </div>
  );
}