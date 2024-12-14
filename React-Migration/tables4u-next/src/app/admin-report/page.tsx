"use client";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";

interface TableData {
  tableID: number;
  tableNum: number;
  numSeats: number;
  hour: string;
  hasReservation: boolean;
  reservationID?: number;
}

interface HourData {
  hour: string;
  restaurantUtilization: string;
  tables: TableData[];
}

export default function AdminAvailabilityReport() {
  const [restaurantResID, setRestaurantResID] = useState("");
  const [reserveDate, setReserveDate] = useState("");
  const [availabilityData, setAvailabilityData] = useState<HourData[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedReservation, setSelectedReservation] = useState<number | null>(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const navigate = useNavigate(); // Add navigate hook

  const apiEndpoint =
    "https://x51lo0cnd3.execute-api.us-east-2.amazonaws.com/Stage1/generateAvailability";
  const cancelReservationEndpoint =
    "https://x51lo0cnd3.execute-api.us-east-2.amazonaws.com/Stage1/adminDeleteReservation";

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

  const handleCancelReservation = async () => {
    if (!selectedReservation) {
      alert("No reservation selected to cancel.");
      return;
    }
  
    try {
      const response = await fetch(cancelReservationEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reservationID: selectedReservation }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert(result.message || "Reservation cancelled successfully.");
        setIsCancelModalOpen(false);
        setSelectedReservation(null);
        fetchAvailability(); // Refresh availability
      } else {
        alert(result.message || "Failed to cancel the reservation.");
      }
    } catch (error: any) {
      console.error("Error cancelling reservation:", error);
      alert("An unexpected error occurred while cancelling the reservation.");
    }
  };

  return (
    <div>
      
      <div className={styles.container}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchAvailability();
          }}
          className={styles.form}
        >
          <div className={styles.formGroup}>
            <label htmlFor="restaurantResID">Restaurant Address:</label>
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

        {availabilityData && availabilityData.length > 0 && (
          <div className={styles.results}>
            <h2>Availability Report for {reserveDate}</h2>
            <div>Click on a booked timeslot to delete a reservation</div>
            <table className={styles.tableAvailability}>
              <thead>
                <tr>
                  <th>Hour</th>
                  {availabilityData[0].tables.map((table) => (
                    <th key={table.tableID}>Table {table.tableNum}</th>
                  ))}
                  <th>Utilization</th>
                </tr>
              </thead>
              <tbody>
                {availabilityData.map((hourData) => (
                  <tr key={hourData.hour}>
                    <td>{hourData.hour.split("T")[1].slice(0, 5)}</td>
                    {hourData.tables.map((table) => (
                      <td key={table.tableID}>
                        {table.hasReservation ? (
                          <button
                            className={styles.reservedButton}
                            onClick={() => {
                              setSelectedReservation(table.reservationID || null);
                              setIsCancelModalOpen(true);
                            }}
                          >
                            Booked
                          </button>
                        ) : (
                          <span className={styles.available}>Available</span>
                        )}
                      </td>
                    ))}
                    <td>{hourData.restaurantUtilization}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {isCancelModalOpen && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <h2>Cancel Reservation</h2>
              <p>Are you sure you want to cancel this reservation?</p>
              <div className={styles.modalActions}>
                <button
                  onClick={handleCancelReservation}
                  className={styles.redButton}
                >
                  Confirm
                </button>
                <button
                  onClick={() => setIsCancelModalOpen(false)}
                  className={styles.cancelButton}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
