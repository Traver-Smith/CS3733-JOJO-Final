'use client';

import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";

interface Reservation {
  reserveTime: string; // Format: YYYY-MM-DDTHH:mm
  tableID: string;
}

interface Table {
  tableID: string;
  tableNum: string;
  numSeats: number;
}

export default function ViewReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(""); // YYYY-MM-DD format
  const restaurantName = sessionStorage.getItem("restaurantUsername") || "";
  const restaurantAddress = sessionStorage.getItem("restaurantAddress") || "";

  useEffect(() => {
    fetchReservations();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      calculateAvailableTimes(selectedDate);
    }
  }, [selectedDate, reservations]);

  const fetchReservations = async () => {
    try {
      const response = await fetch(
        "https://jx7q3te4na.execute-api.us-east-2.amazonaws.com/Stage2/getReservations",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ restaurantAddress }),
        }
      );

      if (!response.ok) throw new Error("Failed to fetch reservations");

      const data = await response.json();
      const responseBody = JSON.parse(data.body);

      setReservations(responseBody.reservations || []);
      setTables(responseBody.tables || []);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };

  const calculateAvailableTimes = (date: string) => {
    const reservedTimes = reservations
      .filter((res) => res.reserveTime.startsWith(date))
      .map((res) => new Date(res.reserveTime).toTimeString().slice(0, 5)); // Extract time HH:MM

    const openTime = "09:00"; // Replace with API value if available
    const closeTime = "21:00"; // Replace with API value if available
    const allTimes = generateTimeSlots(openTime, closeTime);

    setAvailableTimes(allTimes.filter((time) => !reservedTimes.includes(time)));
  };

  const generateTimeSlots = (openTime: string, closeTime: string): string[] => {
    const times: string[] = [];
    let current = new Date(`1970-01-01T${openTime}`);
    const end = new Date(`1970-01-01T${closeTime}`);

    while (current <= end) {
      times.push(current.toTimeString().slice(0, 5)); // HH:MM format
      current.setMinutes(current.getMinutes() + 60); // 
    }
    return times;
  };

  const makeReservation = async (
    tableNum: string,
    tableID: string,
    reserveTime: string,
    
  ) => {
    const emailInput = document.getElementById(
      `email_${tableID}_${reserveTime}`
    ) as HTMLInputElement;

    const numPeopleInput = document.getElementById(
      `numPeople_${tableID}_${reserveTime}`
    ) as HTMLInputElement;
    
    if (!emailInput) {
      alert("Please enter an email.");
      return;
    }
    console.log(emailInput.value)
    console.log(restaurantAddress)
    console.log(tableNum)
    console.log(reserveTime)
    console.log(selectedDate)
    console.log(numPeopleInput.value)
    try {
      const response = await fetch(
        "https://jx7q3te4na.execute-api.us-east-2.amazonaws.com/Stage2/makeReservation",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: emailInput.value,
            restaurantAddress,
            tableNum,
            reserveTime,
            reserveDate: selectedDate,
            numPeople: parseInt(numPeopleInput.value)
          }),
        }
      );

      const responseData = await response.json();
      if (responseData.statusCode === 201) {
        alert("Reservation successful!");
        fetchReservations(); // Refresh reservations
      } else {
        alert(responseData.error || "Failed to make reservation.");
      }
    } catch (error) {
      console.error("Error making reservation:", error);
      alert("An unexpected error occurred.");
    }
  };

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <div className={styles.headerTitle}>
          <h1>Viewing Reservations for {restaurantName}</h1>
        </div>
      </header>

      <div className={styles.filterContainer}>
        <label htmlFor="datePicker">Select a Date:</label>
        <input
          id="datePicker"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {selectedDate && (
        <div className={styles.timeContainer}>
          <label htmlFor="timePicker">Select a Time:</label>
          <select id="timePicker">
            {availableTimes.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className={styles.container}>
        {availableTimes.length > 0 ? (
          availableTimes.map((time) => (
            <div className={styles.timeSlot} key={time}>
              <h3>Available Time: {time}</h3>
              {tables.map((table) => (
                <div className={styles.tableItem} key={table.tableID}>
                  <span>
                    Table {table.tableNum} - Seats: {table.numSeats}
                  </span>
                  <input
                    type="email"
                    placeholder="Enter email"
                    id={`email_${table.tableID}_${time}`}
                  />
                  <input
                    type="numPeople"
                    placeholder="Party Size"
                    id={`numPeople_${table.tableID}_${time}`}
                  />
                  <button
                    onClick={() =>
                      makeReservation(table.tableNum, table.tableID, time)
                    }
                  >
                    Reserve
                  </button>
                </div>
              ))}
            </div>
          ))
        ) : (
          <p>No available times for the selected date.</p>
        )}
      </div>
    </div>
  );
}
