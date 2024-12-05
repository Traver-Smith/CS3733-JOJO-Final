'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import styles from './styles.module.css';

interface Restaurant {
  restaurantName: string;
  Address: string;
}

export default function UserRestaurantList() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    const apiEndpoint = 'https://jx7q3te4na.execute-api.us-east-2.amazonaws.com/Stage2/ConsumerList';
    try {
      setLoading(true);
      const response = await fetch(apiEndpoint);
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      const data = await response.json();
      const restaurants = JSON.parse(data.body)?.data || [];
      setRestaurants(restaurants);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
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

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Link href="/make-reservation">
            <button className={styles.button}>Make a Reservation</button>
          </Link>
        </div>
        <div className={styles.headerTitle}>
          <h1>Tables4u</h1>
          <h2 className={styles.subtitle}>List of Restaurants</h2>
        </div>
        <div className={styles.headerRight}>
          <Link href="/admin/login">
            <button className={styles.button}>Admin Login</button>
          </Link>
          <Link href="/restaurant/login">
            <button className={styles.button}>Restaurant Login/Create</button>
          </Link>
        </div>
      </header>

      {/* Filters */}
      <div className={styles.container}>
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
          <button
            onClick={() => alert('Filter logic here')}
            className={styles.button}
          >
            Filter
          </button>
        </div>

        {/* Restaurants */}
        <div className={styles.restaurantList}>
          {restaurants.map((restaurant, index) => (
            <div key={index} className={styles.restaurant}>
              <div className={styles.restaurantDetails}>
                <img
                  src="/placeholder.png"
                  alt="Restaurant"
                  className={styles.restaurantImage}
                />
                <h3>{restaurant.restaurantName}</h3>
                <p>{restaurant.Address}</p>
              </div>
              <button
                onClick={() =>
                  alert(`Viewing reservations for ${restaurant.restaurantName}`)
                }
                className={styles.button}
              >
                View Reservations
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}