'use client';

import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';

interface Restaurant {
  restaurantName: string;
  address: string;
}

export default function UserRestaurantList() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [allRestaurants, setAllRestaurants] = useState<Restaurant[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [searchTerm, setSearchTerm] = useState(''); // Search term for filtering by name or address
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

      const normalizedRestaurants = restaurants.map((restaurant: any) => ({
        restaurantName: restaurant.restaurantName,
        address: restaurant.Address, // Normalize Address to address
      }));

      setRestaurants(normalizedRestaurants);
      setAllRestaurants(normalizedRestaurants);
    } catch (error) {
      console.error('Error fetching all restaurants:', error);
      setError('Failed to load restaurants. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Filter restaurants using either date, search term, or both
  const filterRestaurants = async () => {
    if (!selectedDate && !searchTerm) {
      setError('Please select a date or enter a search term to filter.');
      return;
    }

    if (!selectedDate) {
      // Filter only by search term if no date is selected
      const filteredBySearchTerm = allRestaurants.filter((restaurant: Restaurant) =>
        restaurant.restaurantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setRestaurants(filteredBySearchTerm);
      setError('');
      return;
    }

    const apiEndpoint =
      'https://x51lo0cnd3.execute-api.us-east-2.amazonaws.com/Stage1/userSearchAvailableRestaurants';

    try {
      setLoading(true);
      setError('');

      // Fetch restaurants based on the selected date
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ searchDate: selectedDate }),
      });

      if (!response.ok) throw new Error(`Error: ${response.statusText}`);

      const responseData = await response.json();
      const filteredByDate =
        JSON.parse(responseData.body)?.availableRestaurants || [];

      // Filter by name or address if the search term exists
      const filtered = filteredByDate.filter((restaurant: Restaurant) => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        return (
          restaurant.restaurantName.toLowerCase().includes(lowerSearchTerm) ||
          restaurant.address.toLowerCase().includes(lowerSearchTerm)
        );
      });

      setRestaurants(filtered);
    } catch (error) {
      console.error('Error filtering restaurants:', error);
      setError('Failed to filter restaurants. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setSelectedDate(''); // Clear date field
    setSearchTerm(''); // Clear search term
    setRestaurants(allRestaurants); // Reset to all restaurants
    setError(''); // Clear error message
  };

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
        {/* Search Section */}
        <div className={styles.filter}>
          <label htmlFor="search" className={styles.label}>
            Filter by Restaurant Name:
          </label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.input}
            placeholder="Enter restaurant name or address"
          />
        </div>

        {/* Filter Section */}
        <div className={styles.filter}>
          <label htmlFor="filter-date" className={styles.label}>
            Filter by Date:
          </label>
          <input
            type="date"
            id="filter-date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className={styles.input}
          />

          <button onClick={filterRestaurants} className={styles.button}>
            Filter
          </button>
          <button onClick={resetFilters} className={styles.button}>
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
