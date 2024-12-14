'use client';

import React, { useState, useEffect, useMemo } from 'react';
import styles from './styles.module.css';

interface Restaurant {
  restaurantName: string;
  address: string;
}

export default function UserRestaurantList() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [allRestaurants, setAllRestaurants] = useState<Restaurant[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch all restaurants on initial load
  useEffect(() => {
    fetchAllRestaurants();
  }, []);

  // Fetch all restaurants from the consumerList endpoint
  const fetchAllRestaurants = async () => {
    const apiEndpoint =
      'https://x51lo0cnd3.execute-api.us-east-2.amazonaws.com/Stage1/consumerList';
    try {
      setLoading(true);
      const response = await fetch(apiEndpoint);
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      const data = await response.json();
      const restaurants = JSON.parse(data.body)?.data || [];
  
      // Normalize property names to match the format of `userSearchAvailableRestaurants`
      const normalizedRestaurants = restaurants.map((restaurant: any) => ({
        restaurantName: restaurant.restaurantName,
        address: restaurant.Address, // Normalize Address to address
      }));
  
      setRestaurants(normalizedRestaurants);
      setAllRestaurants(normalizedRestaurants); // Store for resetting filters
    } catch (error) {
      console.error('Error fetching all restaurants:', error);
      setError('Failed to load restaurants. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Filter restaurants using the userSearchAvailableRestaurants endpoint
  const filterRestaurants = async () => {
    const apiEndpoint =
      'https://x51lo0cnd3.execute-api.us-east-2.amazonaws.com/Stage1/userSearchAvailableRestaurants';

    if (!selectedDate) {
      setError('Please select a date to filter.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ searchDate: selectedDate }),
      });

      if (!response.ok) throw new Error(`Error: ${response.statusText}`);

      const responseData = await response.json();
      const filteredRestaurants = JSON.parse(responseData.body)?.availableRestaurants || [];
      setRestaurants(filteredRestaurants);
    } catch (error) {
      console.error('Error filtering restaurants:', error);
      setError('Failed to filter restaurants. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const timeOptions = useMemo(() => {
    const intervals = 48;
    const times = [];
    let time = new Date();
    time.setHours(0, 0, 0, 0);
    for (let i = 0; i < intervals; i++) {
      times.push(
        `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes()
          .toString()
          .padStart(2, '0')}`
      );
      time.setMinutes(time.getMinutes() + 30);
    }
    return times;
  }, []);

  const doAll = (restaurantName: string, restaurantAddress: string) => {
    sessionStorage.setItem('restaurantUsername', restaurantName);
    sessionStorage.setItem('restaurantAddress', restaurantAddress);
    window.location.href = '/view-reservations';
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.container}>
        {/* Filter Section */}
        <div className={styles.filter}>
          <label htmlFor="filter-date" className={styles.label}>
            Select Date:
          </label>
          <input
            type="date"
            id="filter-date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className={styles.input}
          />
          <label htmlFor="filter-time" className={styles.label}>
            Select Time:
          </label>
          <select
            id="filter-time"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className={styles.input}
          >
            <option value="">Select Time</option>
            {timeOptions.map((time, index) => (
              <option key={index} value={time}>
                {time}
              </option>
            ))}
          </select>
          <button onClick={filterRestaurants} className={styles.button}>
            Filter
          </button>
          <button
            onClick={() => setRestaurants(allRestaurants)} // Reset to all restaurants
            className={styles.button}
          >
            Reset
          </button>
        </div>

        {/* Error Message */}
        {error && <p className={styles.error}>{error}</p>}

        {/* Restaurant List */}
        <div className={styles.restaurantList}>
          {restaurants.length === 0 ? (
            <p>No restaurants available.</p>
          ) : (
            restaurants.map((restaurant, index) => (
              <div key={index} className={styles.restaurant}>
                <div className={styles.restaurantDetails}>
                  <img
                    src="/placeholder.png"
                    alt="Restaurant"
                    className={styles.restaurantImage}
                  />
                  <h3>{restaurant.restaurantName}</h3>
                  <p>{restaurant.address}</p>
                </div>
                <button
                  onClick={() => doAll(restaurant.restaurantName, restaurant.address)}
                  className={styles.button}
                >
                  View Reservations
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}