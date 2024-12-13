'use client';

import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";

interface AvailabilitySlot {
  hour: string; // Format: YYYY-MM-DDTHH:00:00
  hasReservation: boolean;
}

interface TableData {
  tableID: string;
  tableNum: string;
  numSeats: number;
  availability: AvailabilitySlot[];
}

type TimeMap = Record<string, { tableID: string; tableNum: string; numSeats: number }[]>;


export default function ViewReservations() {
  //const [availabilityData, setAvailabilityData] = useState<TableData[]>([]);
  const [availabilityData, setAvailabilityData] = useState<TimeMap>({});
  const [selectedDate, setSelectedDate] = useState<string>(""); // YYYY-MM-DD
  const restaurantName = sessionStorage.getItem("restaurantUsername") || "";
  const restaurantAddress = sessionStorage.getItem("restaurantAddress") || "";

  useEffect(() => {
    // Fetch availability whenever the selectedDate changes
    if (selectedDate) {
      fetchAvailability(selectedDate);
    }
  }, [selectedDate]);

  const fetchAvailability = async (date: string) => {
    try {
      const response = await fetch("https://jx7q3te4na.execute-api.us-east-2.amazonaws.com/Stage2/ViewAvailableTables", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restaurantResID: restaurantAddress, reserveDate: date }),
      });

      if (!response.ok) throw new Error("Failed to fetch availability");

      const data = await response.json();

      const parsedData = JSON.parse(data.body)
      console.log(parsedData)
      
      // data.data is the array of tables with their availability
      const tableData: TableData[] = parsedData.data;
      
      
      if (tableData.length > 0) {
        const timeMap: TimeMap = {};

        for (const table of tableData) {
          for (const slot of table.availability) {
            if (!slot.hasReservation) {
              if (!timeMap[slot.hour]) {
                timeMap[slot.hour] = [];
              }
              // Add the table info without the availability array
              // Add table info without the availability array
              timeMap[slot.hour].push({
                tableID: table.tableID,
                tableNum: table.tableNum,
                numSeats: table.numSeats,
              });
            }
          }
        }
        setAvailabilityData(timeMap);
      }
    } catch (error) {
      console.error("Error fetching availability:", error);
    }
  };

  const makeReservation = async (tableNum: string, tableID: string, time: string) => {
    // time is currently "HH:MM". We need the full format for the reservation.
    // The reservation endpoint likely needs the time in a known format.
    // The selected date is known, so we can construct "YYYY-MM-DDTHH:MM".
    const reserveTime = time; // For the makeReservation call, we might just send HH:MM if that's what the endpoint expects.
                              // If it expects full datetime, use: `${selectedDate}T${time}:00`

    const emailInput = document.getElementById(`email_${tableID}_${time}`) as HTMLInputElement;
    const numPeopleInput = document.getElementById(`numPeople_${tableID}_${time}`) as HTMLInputElement;

    if (!emailInput || !emailInput.value) {
      alert("Please enter an email.");
      return;
    }

    if (!numPeopleInput || !numPeopleInput.value) {
      alert("Please enter the number of people.");
      return;
    }

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
            reserveTime, // If necessary, adjust format to full datetime: `${selectedDate}T${time}:00`
            reserveDate: selectedDate,
            numPeople: parseInt(numPeopleInput.value)
          }),
        }
      );

      const responseData = await response.json();
      const parsedData = JSON.parse(responseData.body)
      if (responseData.statusCode === 201) {
        alert("Reservation successful!, Your confirmation code is: " + (parsedData.reservationID));
        if (selectedDate) {
          fetchAvailability(selectedDate); // Refresh availability
        }
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
        <div className={styles.container}>
          {Object.keys(availabilityData).length > 0 ? (
            Object.keys(availabilityData)
              .sort()
              .map((timeSlot) => {
                const displayTime = timeSlot.substring(11, 16); // Extract HH:MM from YYYY-MM-DDTHH:MM:SS
                const tablesForTime = availabilityData[timeSlot];

                return (
                  <div className={styles.timeSlot} key={timeSlot}>
                    <h3>Available Time: {displayTime}</h3>
                    {tablesForTime.map((table) => (
                      <div className={styles.tableItem} key={table.tableID}>
                        <span>
                          Table {table.tableNum} - Seats: {table.numSeats}
                        </span>
                        <input
                          type="email"
                          placeholder="Enter email"
                          id={`email_${table.tableID}_${displayTime}`}
                        />
                        <input
                          type="number"
                          placeholder="Party Size"
                          id={`numPeople_${table.tableID}_${displayTime}`}
                        />
                        <button
                          onClick={() => makeReservation(table.tableNum, table.tableID, displayTime)}
                        >
                          Reserve
                        </button>
                      </div>
                    ))}
                  </div>
                );
              })
          ) : (
            <p>No available times for the selected date.</p>
          )}
        </div>
      )}
    </div>
  );
}
