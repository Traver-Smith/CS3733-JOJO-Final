'use client';

import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';

export default function EditRestaurant() {
  const [restaurantName, setRestaurantName] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [tables, setTables] = useState<any[]>([]);
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


  const removeClosedDay = async () => {
    setIsLoading(true);
    setError("");
  
    try {
      const response = await fetch(
        "https://x51lo0cnd3.execute-api.us-east-2.amazonaws.com/Stage1/removeClosedDay",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            restaurantClosedID: restaurantAddress,
            closedDate: selectedDate,
          }),
        }
      );
  
      const result = await response.json();
  
      if (response.ok) {
        setClosedDays((prev) => prev.filter((day) => day !== selectedDate));
        alert(result.message || "Day successfully opened.");
        setSelectedDate(""); // Reset date picker
      } else {
        setError(result.message || "Failed to open the day.");
      }
    } catch (err: any) {
      console.error("Error opening the day:", err);
      setError("An unexpected error occurred while opening the day.");
    } finally {
      setIsLoading(false);
    }
  };

  const addClosedDay = async () => {
    setIsLoading(true);
    setError("");
  
    try {
      const response = await fetch(
        "https://jx7q3te4na.execute-api.us-east-2.amazonaws.com/Stage1/addClosedDay",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            restaurantClosedID: restaurantAddress,
            closedDays: selectedDate,
          }),
        }
      );
  
      const result = await response.json();
  
      if (response.ok) {
        setClosedDays((prev) => [...prev, selectedDate]);
        alert(result.message || "Day successfully closed.");
        setSelectedDate(""); // Reset date picker
      } else {
        setError(result.message || "Failed to close the day.");
      }
    } catch (err: any) {
      console.error("Error closing the day:", err);
      setError("An unexpected error occurred while closing the day.");
    } finally {
      setIsLoading(false);
    }
  };

const renderRestaurant = async () => {
  setError("");
  if (!restaurantAddress) {
    setError("Restaurant address is missing. Please log in again.");
    return;
  }

  try {
    const response = await fetch(
      "https://jx7q3te4na.execute-api.us-east-2.amazonaws.com/Stage2/getRestaurant",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: restaurantAddress }),
      }
    );

    const data = await response.json();
    if (response.status === 200) {
      const restaurantData = JSON.parse(data.body)?.restaurant;
      if (!restaurantData) {
        setError("Error: No restaurant data returned from the API.");
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

      const updatedOpenDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].filter(
        (day) => !closedDaysArray.includes(day)
      );
      setOpenDays(updatedOpenDays);

      setIsActive(!!restaurantData.isActive);
    } else {
      setError(data.error || "Error retrieving restaurant details.");
    }
  } catch (error: any) {
    console.error("Error fetching restaurant details:", error);
    setError("An unexpected error occurred. Please try again later.");
  }
};

  const fetchExistingTables = async () => {
    setError('');
    try {
      const response = await fetch('https://jx7q3te4na.execute-api.us-east-2.amazonaws.com/Stage2/listTables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: restaurantAddress }),
      });

      const data = await response.json();
      const parsedData = JSON.parse(data.body)?.data || [];
      setTables(parsedData);
    } catch (error: any) {
      console.error('Error fetching existing tables:', error);
      setError('Error fetching existing tables.');
    }
  };

  const addTable = async () => {
    setError('');
    if (isActive) {
      setError('Cannot add tables after activation.');
      return;
    }

    const tableNumInput = document.getElementById('table_num') as HTMLInputElement;
    const tableSeatsInput = document.getElementById('table_seats') as HTMLInputElement;

    const tableNum = parseInt(tableNumInput?.value || '', 10);
    const numSeats = parseInt(tableSeatsInput?.value || '', 10);

    if (!tableNum || !numSeats) {
      setError('Please enter the number of seats and table number.');
      return;
    }

    const tableExists = tables.some((table) => table.tableNum === tableNum);
    if (tableExists) {
      setError(`Table number ${tableNum} already exists for this restaurant.`);
      return;
    }

    try {
      const response = await fetch('https://jx7q3te4na.execute-api.us-east-2.amazonaws.com/Stage2/addTable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          numSeats: numSeats,
          tableNum: tableNum,
          restaurantID: restaurantAddress,
        }),
      });

      const data = await response.json();

      if (data.statusCode === 200) {
        alert('Table added successfully!');
        fetchExistingTables();
        if (tableSeatsInput) tableSeatsInput.value = '';
        if (tableNumInput) tableNumInput.value = '';
      } else {
        setError(data.errorMessage || 'An error occurred while adding the table.');
      }
    } catch (error: any) {
      console.error('Error adding table:', error);
      setError('An unexpected error occurred. Please try again later.');
    }
  };

  const removeTable = async (tableNum: number) => {
    setError('');
    if (!restaurantAddress || !tableNum) {
      setError('Invalid request. Restaurant address or Table ID missing.');
      return;
    }

    const confirmDelete = window.confirm(`Are you sure you want to remove Table ${tableNum}?`);
    if (!confirmDelete) return;

    try {
      const response = await fetch('https://jx7q3te4na.execute-api.us-east-2.amazonaws.com/Stage2/removeTable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableNum: tableNum,
          restaurantID: restaurantAddress,
        }),
      });

      const data = await response.json();
      if (response.status === 200) {
        alert(`Table ${tableNum} removed successfully!`);
        setTables((prev) => prev.filter((table) => table.tableNum !== tableNum));
      } else {
        setError(data.error || `Failed to remove Table ${tableNum}.`);
      }
    } catch (error: any) {
      console.error('Error removing table:', error);
      setError('An unexpected error occurred. Please try again later.');
    }
  };

  const saveRestaurant = async () => {
    setError('');
    if (!openTime || !closeTime) {
      setError('Please select both opening and closing times.');
      return;
    }

    if (openDays.length === 0) {
      setError('Please select at least one day the restaurant is open.');
      return;
    }

    const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const closedDays = allDays.filter((day) => !openDays.includes(day)).join(',');

    const storedRestaurantName = typeof window !== 'undefined' ? sessionStorage.getItem('restaurantName') : '';

    try {
      const response = await fetch('https://jx7q3te4na.execute-api.us-east-2.amazonaws.com/Stage2/editRestaurant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantName: storedRestaurantName,
          address: restaurantAddress,
          openTime: openTime,
          closeTime: closeTime,
          closedDays: closedDays,
        }),
      });

      const data = await response.json();

      if (response.status === 200) {
        alert('Restaurant details saved successfully!');
        renderRestaurant();
      } else {
        setError(data.error || 'An error occurred while saving restaurant details.');
      }
    } catch (error: any) {
      console.error('Error saving restaurant details:', error);
      setError('An unexpected error occurred. Please try again later.');
    }
  };

  const activateRestaurant = async () => {
    setError('');
    if (!restaurantAddress) {
      setError('Restaurant address is missing. Please log in again.');
      return;
    }

    const confirmActivate = window.confirm('Are you sure you want to activate this restaurant?');
    if (!confirmActivate) return;

    try {
      const response = await fetch('https://jx7q3te4na.execute-api.us-east-2.amazonaws.com/Stage2/ActivateRestaurant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: restaurantAddress }),
      });

      const data = await response.json();

      if (response.status === 200) {
        alert('Restaurant activated successfully!');
        setIsActive(true);
      } else {
        setError(data.error || 'An error occurred while activating the restaurant.');
      }
    } catch (error: any) {
      console.error('Error activating restaurant:', error);
      setError('An unexpected error occurred. Please try again later.');
    }
  };

  const handleDayChange = (day: string) => {
    if (openDays.includes(day)) {
      setOpenDays(openDays.filter((d) => d !== day));
    } else {
      setOpenDays([...openDays, day]);
    }
  };

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
          <option value="18:00:00">6:00 PM</option>
          <option value="19:00:00">7:00 PM</option>
          <option value="20:00:00">8:00 PM</option>
          <option value="21:00:00">9:00 PM</option>
          <option value="22:00:00">10:00 PM</option>
          <option value="23:00:00">11:00 PM</option>
          <option value="00:00:00">12:00 AM</option>
        </select>

        <p>Select days the restaurant is open:</p>
        <div className={styles.daysOfWeek}>
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
            <label key={day}>
              <input
                type="checkbox"
                value={day}
                checked={openDays.includes(day)}
                onChange={() => handleDayChange(day)}
                disabled={isActive}
                className={isActive ? styles.disabled : ''}
              />{' '}
              {day}
            </label>
          ))}
        </div>
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