'use client';

import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';

interface Reservation {
  reserveTime: string;
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
  const [hours, setHours] = useState<string[]>([]);
  const restaurantName = sessionStorage.getItem('restaurantUsername') || '';
  const restaurantAddress = sessionStorage.getItem('restaurantAddress') || '';

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await fetch(
        'https://jx7q3te4na.execute-api.us-east-2.amazonaws.com/Stage2/getReservations',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ restaurantAddress }),
        }
      );

      if (!response.ok) throw new Error('Failed to fetch reservations');

      const data = await response.json();
      const responseBody = JSON.parse(data.body);

      setReservations(responseBody.reservations || []);
      setTables(responseBody.tables || []);
      setHours(calculateHours(responseBody.openTime, responseBody.closeTime));
    } catch (error) {
      console.error('Error fetching reservations:', error.message);
    }
  };

  const calculateHours = (openTime: string, closeTime: string): string[] => {
    const hours: string[] = [];
    let current = new Date(`1970-01-01T${openTime}`);
    const end = new Date(`1970-01-01T${closeTime}`);

    while (current <= end) {
      hours.push(current.toTimeString().slice(0, 5)); // HH:MM format
      current.setHours(current.getHours() + 1);
    }
    return hours;
  };

  const toggleAccordion = (index: number) => {
    const content = document.getElementById(`accordion-content-${index}`);
    if (content) {
      content.style.display =
        content.style.display === 'block' ? 'none' : 'block';
    }
  };

  const makeReservation = async (
    tableNum: string,
    tableID: string,
    reserveTime: string
  ) => {
    const emailInput = document.getElementById(
      `email_${tableID}_${reserveTime}`
    ) as HTMLInputElement;

    if (!emailInput || !emailInput.value) {
      alert('Please enter an email.');
      return;
    }

    try {
      const response = await fetch(
        'https://jx7q3te4na.execute-api.us-east-2.amazonaws.com/Stage2/makeReservation',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: emailInput.value,
            restaurantAddress,
            tableNum,
            reserveTime,
          }),
        }
      );

      const responseData = await response.json();
      if (responseData.statusCode === 201) {
        alert('Reservation successful!');
        fetchReservations(); // Refresh reservations
      } else {
        alert(responseData.error || 'Failed to make reservation.');
      }
    } catch (error) {
      console.error('Error making reservation:', error.message);
      alert('An unexpected error occurred.');
    }
  };

  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerTitle}>
          <h1>Tables4u - View Reservations</h1>
        </div>
        <p className={styles.restaurantNameDisplay}>
          Viewing: {restaurantName}
        </p>
      </header>

      {/* Accordion Container */}
      <div className={styles.container}>
        {hours.map((hour, index) => {
          const reservedTableIDs = reservations
            .filter((res) => res.reserveTime.startsWith(hour))
            .map((res) => res.tableID);

          const availableTables = tables.filter(
            (table) => !reservedTableIDs.includes(table.tableID)
          );

          return (
            <div className={styles.accordion} key={hour}>
              <button
                className={styles.accordionHeader}
                onClick={() => toggleAccordion(index)}
              >
                {hour}
              </button>
              <div
                className={styles.accordionContent}
                id={`accordion-content-${index}`}
              >
                {availableTables.length > 0 ? (
                  availableTables.map((table) => (
                    <div className={styles.tableItem} key={table.tableID}>
                      <span>
                        Table {table.tableNum} - Seats: {table.numSeats}
                      </span>
                      <input
                        type="email"
                        placeholder="Enter email"
                        id={`email_${table.tableID}_${hour}`}
                      />
                      <button
                        onClick={() =>
                          makeReservation(table.tableNum, table.tableID, hour)
                        }
                      >
                        Reserve
                      </button>
                    </div>
                  ))
                ) : (
                  <p>No tables available at this time.</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}