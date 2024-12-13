"use client";

import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";

interface TableAvailability {
  hour: string;
  hasReservation: boolean;
}

interface TableData {
  tableID: number;
  tableNum: number;
  numSeats: number;
  availability: TableAvailability[];
}

export default function AdminAvailabilityReport() {
  const [restaurantResID, setRestaurantResID] = useState("");
  const [reserveDate, setReserveDate] = useState("");
  const [availabilityData, setAvailabilityData] = useState<TableData[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const apiEndpoint =
    "https://jx7q3te4na.execute-api.us-east-2.amazonaws.com/Stage2/adminReport";

  const fetchAvailability = async () => {
    if (!restaurantResID || !reserveDate) {
      alert("Please provide both the restaurant ID and reservation date.");
      return;
    }

    setLoading(true);
    setError("");
    setAvailabilityData(null);

    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restaurantResID, reserveDate }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch availability.");
      }

      const parsedData = JSON.parse(result.body).data;
      setAvailabilityData(parsedData);
    } catch (error: any) {
      console.error("Error fetching availability:", error);
      setError(error.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button onClick={() => alert("Redirecting to Admin Home...")}>
            Admin Home
          </button>
        </div>
        <div className={styles.headerTitle}>
          <h1>Tables4u</h1>
          <h2>Admin Availability Report</h2>
        </div>
        <div className={styles.headerRight}>
          <button onClick={() => (window.location.href = "/adminLogin")}>Admin Login</button>
          <button onClick={() => (window.location.href = "/ownerLogin")}>Restaurant Login</button>
        </div>
      </header>
      <div className={styles.container}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchAvailability();
          }}
          className={styles.form}
        >
          <div className={styles.formGroup}>
            <label htmlFor="restaurantResID">Restaurant ID:</label>
            <input
              type="text"
              id="restaurantResID"
              value={restaurantResID}
              onChange={(e) => setRestaurantResID(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="reserveDate">Reservation Date:</label>
            <input
              type="date"
              id="reserveDate"
              value={reserveDate}
              onChange={(e) => setReserveDate(e.target.value)}
              required
            />
          </div>
          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? "Loading..." : "Fetch Availability"}
          </button>
        </form>

        {error && <p className={styles.error}>Error: {error}</p>}

        {availabilityData && (
  <div className={styles.results}>
    <h2>Availability Report for {reserveDate}</h2>
    {/* Extract all unique hours from the first table (assuming all have same slots) */}
    {availabilityData.length > 0 && (
      <table className={styles.tableAvailability}>
        <thead>
          <tr>
            <th>Hour</th>
            {availabilityData.map(table => (
              <th key={table.tableID}>Table {table.tableNum} (Seats: {table.numSeats})</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {availabilityData[0].availability.map((slot, index) => {
            const timeOnly = slot.hour.split("T")[1].slice(0, 5);
            return (
              <tr key={slot.hour}>
                <td>{timeOnly}</td>
                {availabilityData.map(table => {
                  const tableSlot = table.availability[index];
                  return (
                    <td key={table.tableID}>
                      {tableSlot.hasReservation ? (
                        <span className={styles.reserved}>Booked</span>
                      ) : (
                        <span className={styles.available}>Available</span>
                      )}
                    </td>
                  )
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    )}
  </div>
)}
      </div>
    </div>
  );
}
