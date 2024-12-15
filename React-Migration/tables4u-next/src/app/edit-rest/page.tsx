'use client';

import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';

interface Table {
  tableID: string;
  tableNum: number;
  numSeats: number;
}

export default function EditRestaurant() {
  const [restaurantName, setRestaurantName] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [tables, setTables] = useState<Table[]>([]);
  const [openTime, setOpenTime] = useState('');
  const [closeTime, setCloseTime] = useState('');
  const [openDays, setOpenDays] = useState<string[]>(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);
  const [error, setError] = useState('');
  const [closedDays, setClosedDays] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const restaurantAddress = typeof window !== 'undefined' ? sessionStorage.getItem('restaurantUsername') || '' : '';

  // Fetch restaurant details and tables on load
  useEffect(() => {
    renderRestaurant();
    fetchExistingTables();
  }, []);

  const renderRestaurant = async () => {
    setError('');
    if (!restaurantAddress) {
      setError('Restaurant address is missing. Please log in again.');
      return;
    }

    try {
      const response = await fetch(
        'https://x51lo0cnd3.execute-api.us-east-2.amazonaws.com/Stage1/getRestaurant',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address: restaurantAddress }),
        }
      );

      const data = await response.json();
      if (response.status === 200) {
        const restaurantData = JSON.parse(data.body)?.restaurant;
        if (!restaurantData) {
          setError('Error: No restaurant data returned from the API.');
          return;
        }

      setRestaurantName(restaurantData.restaurantName || "");
      sessionStorage.setItem("restaurantName", restaurantData.restaurantName || "");

      setOpenTime(restaurantData.openTime || "");
      setCloseTime(restaurantData.closeTime || "");

      const closedDaysArray = restaurantData.closedDays
        ? restaurantData.closedDays.split(",")
        : [];
      setClosedDays(closedDaysArray);

        const updatedOpenDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].filter(
          (day) => !closedDaysArray.includes(day)
        );
        setOpenDays(updatedOpenDays);

        setIsActive(!!restaurantData.isActive);
      } else {
        setError(data.error || 'Error retrieving restaurant details.');
      }
    } catch (error: any) {
      console.error('Error fetching restaurant details:', error);
      setError('An unexpected error occurred. Please try again later.');
    }
  };

  const fetchExistingTables = async () => {
    setError('');
    try {
      const response = await fetch('https://x51lo0cnd3.execute-api.us-east-2.amazonaws.com/Stage1/showTables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: restaurantAddress }),
      });

      const data = await response.json();
      const parsedData = JSON.parse(data.body)?.data || [];
      setTables(parsedData);
    } catch (error) {
      if (error instanceof Error) {
          console.error("Error message:", error.message);
      } 
  }
  };

  const addClosedDay = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(
        'https://x51lo0cnd3.execute-api.us-east-2.amazonaws.com/Stage1/addCloseDay',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            restaurantClosedID: restaurantAddress,
            closedDays: selectedDate,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setClosedDays((prev) => [...prev, selectedDate]);
        alert(result.message || 'Day successfully closed.');
        setSelectedDate('');
      } else {
        setError(result.message || 'Failed to close the day.');
      }
    } catch (err: any) {
      console.error('Error closing the day:', err);
      setError('An unexpected error occurred while closing the day.');
    } finally {
      setIsLoading(false);
    }
  };

  const removeClosedDay = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(
        'https://x51lo0cnd3.execute-api.us-east-2.amazonaws.com/Stage1/removeClosedDay',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            restaurantClosedID: restaurantAddress,
            closedDate: selectedDate,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setClosedDays((prev) => prev.filter((day) => day !== selectedDate));
        alert(result.message || 'Day successfully opened.');
        setSelectedDate('');
      } else {
        setError(result.message || 'Failed to open the day.');
      }
    } catch (err: any) {
      console.error('Error opening the day:', err);
      setError('An unexpected error occurred while opening the day.');
    } finally {
      setIsLoading(false);
    }
  };

  /*const handleDayChange = (day: string) => {
    if (openDays.includes(day)) {
      setOpenDays(openDays.filter((d) => d !== day));
    } else {
      setOpenDays([...openDays, day]);
    }
  };*/

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Edit Restaurant</h1>
        <p id="restaurant_name_display">Editing: {restaurantName || '(Restaurant Name)'}</p>
      </div>

      {/* Hours of Operation Section */}
      <div className={styles.section}>
        <h2>Hours of Operation</h2>
        <label htmlFor="opening_time">Opening Time:</label>
        <select
          id="opening_time"
          value={openTime}
          onChange={(e) => setOpenTime(e.target.value)}
          className={isActive ? styles.disabled : ''}
          disabled={isActive}
        >
          <option value="">Select Opening Time</option>
          <option value="06:00:00">6:00 AM</option>
          <option value="07:00:00">7:00 AM</option>
          <option value="08:00:00">8:00 AM</option>
          <option value="09:00:00">9:00 AM</option>
          <option value="10:00:00">10:00 AM</option>
          <option value="11:00:00">11:00 AM</option>
          <option value="12:00:00">12:00 PM</option>
          <option value="13:00:00">1:00 PM</option>
          <option value="14:00:00">2:00 PM</option>
          <option value="15:00:00">3:00 PM</option>
          <option value="16:00:00">4:00 PM</option>
          <option value="17:00:00">5:00 PM</option>
          <option value="18:00:00">6:00 PM</option>
          <option value="19:00:00">7:00 PM</option>
        </select>

        <label htmlFor="closing_time">Closing Time:</label>
        <select
          id="closing_time"
          value={closeTime}
          onChange={(e) => setCloseTime(e.target.value)}
          className={isActive ? styles.disabled : ''}
          disabled={isActive}
        >
          <option value="">Select Closing Time</option>
          <option value="10:00:00">10:00 AM</option>
          <option value="11:00:00">11:00 AM</option>
          <option value="12:00:00">12:00 PM</option>
          <option value="13:00:00">1:00 PM</option>
          <option value="14:00:00">2:00 PM</option>
          <option value="15:00:00">3:00 PM</option>
          <option value="16:00:00">4:00 PM</option>
          <option value="17:00:00">5:00 PM</option>
          <option value="18:00:00">6:00 PM</option>
          <option value="19:00:00">7:00 PM</option>
          <option value="20:00:00">8:00 PM</option>
          <option value="21:00:00">9:00 PM</option>
          <option value="22:00:00">10:00 PM</option>
          <option value="23:00:00">11:00 PM</option>
          
        </select>

        
      </div>

      {/* Tables Section */}
      <div className={styles.section}>
        <h2>Tables</h2>
        <div className={styles.addTableForm}>
          <input
            type="number"
            id="table_seats"
            placeholder="Number of seats"
            min="1"
            disabled={isActive}
            className={isActive ? styles.disabled : ''}
          />
          <input
            type="number"
            id="table_num"
            placeholder="Table Number"
            min="1"
            disabled={isActive}
            className={isActive ? styles.disabled : ''}
          />
          <button onClick={addTable} disabled={isActive}>Add Table</button>
        </div>
        <div className={styles.tableList} id="table_list">
          {tables.length === 0 ? (
            <p>No tables added yet.</p>
          ) : (
            tables.map((table) => (
              <div className={styles.tableItem} key={table.tableID} id={`table_${table.tableID}`}>
                <span>Table Number: {table.tableNum}</span>
                <span>Seats: {table.numSeats}</span>
                {!isActive && (
                  <button onClick={() => removeTable(table.tableNum)}>Remove</button>
                )}
              </div>
            ))
          )}
        </div>
        {error && <div className={styles.error} id="error_message">{error}</div>}
      </div>
      <div className={styles.section}>
  <h2>Manage Closed Days</h2>
  <label htmlFor="closed_day_picker">Select a Day:</label>
  <input
    type="date"
    id="closed_day_picker"
    value={selectedDate}
    onChange={(e) => setSelectedDate(e.target.value)}
    className={styles.input}
  />
  <div style={{ marginTop: "10px" }}>
    <button
      onClick={addClosedDay}
      className={styles.redButton}
      disabled={!selectedDate || isLoading}
    >
      Close Day
    </button>
    <button
      onClick={removeClosedDay}
      className={styles.greenButton}
      disabled={!selectedDate || isLoading}
    >
      Open Day
    </button>
  </div>
  {closedDays.length > 0 && (
    <div className={styles.closedDaysList}>
      <h3>Currently Closed Days:</h3>
      <ul>
        {closedDays.map((day, index) => (
          <li key={index}>{day}</li>
        ))}
      </ul>
    </div>
  )}
</div>
      <div className={styles.publishBtn}>
        <button onClick={saveRestaurant} disabled={isActive && tables.length === 0}>
          Save
        </button>
      </div>
      <div className={styles.activateBtn}>
        <button onClick={activateRestaurant} disabled={isActive}>Activate Restaurant</button>
      </div>
    </div>
  );
}