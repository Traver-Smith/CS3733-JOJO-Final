"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Use Next.js router for navigation
import styles from "./styles.module.css";

// Interface for the restaurant
interface Restaurant {
  restaurantName: string;
  Address: string;
}

// Interface for API response
interface RestaurantApiResponse {
  body: string; // JSON string containing restaurant data
}

export default function UserRestaurantList() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [allRestaurants, setAllRestaurants] = useState<Restaurant[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter(); // Next.js navigation hook

  useEffect(() => {
    fetchAllRestaurants();
  }, []);

  const fetchAllRestaurants = async () => {
    const apiEndpoint =
      "https://x51lo0cnd3.execute-api.us-east-2.amazonaws.com/Stage1/consumerList";
    try {
      setLoading(true);
      const response = await fetch(apiEndpoint);

      if (!response.ok) throw new Error(`Error: ${response.statusText}`);

      const data: RestaurantApiResponse = await response.json();
      const parsedData: Restaurant[] = JSON.parse(data.body)?.data || [];

      // Normalize the restaurant data
      const normalizedRestaurants: Restaurant[] = parsedData.map((restaurant) => ({
        restaurantName: restaurant.restaurantName,
        Address: restaurant.Address,
      }));

      setRestaurants(normalizedRestaurants);
      setAllRestaurants(normalizedRestaurants);
    } catch (error) {
      console.error("Error fetching all restaurants:", error);
      setError("Failed to load restaurants. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filterRestaurants = async () => {
    if (!selectedDate && !searchTerm) {
      setError("Please select a date or enter a search term to filter.");
      return;
    }
  
    try {
      setLoading(true);
      setError("");
  
      let filteredRestaurants: Restaurant[] = allRestaurants;
  
      // Filter by search term locally
      if (searchTerm) {
        const lowerSearchTerm = searchTerm.toLowerCase();
        filteredRestaurants = filteredRestaurants.filter(
          (restaurant) =>
            restaurant.restaurantName.toLowerCase().includes(lowerSearchTerm) ||
            restaurant.Address.toLowerCase().includes(lowerSearchTerm)
        );
      }
  
      // Fetch closed restaurants for the selected date
      if (selectedDate) {
        const apiEndpoint =
          "https://x51lo0cnd3.execute-api.us-east-2.amazonaws.com/Stage1/getClosedDays";
  
        const response = await fetch(apiEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ searchDate: selectedDate }),
        });
  
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
  
        const responseData: { closedRestaurants: Restaurant[] } = await response.json();
        const closedRestaurants: Restaurant[] =
          responseData.closedRestaurants || [];
  
        // Exclude closed restaurants from the filtered list
        filteredRestaurants = filteredRestaurants.filter(
          (restaurant) =>
            !closedRestaurants.some(
              (closed) =>
                closed.restaurantName === restaurant.restaurantName &&
                closed.Address === restaurant.Address
            )
        );
      }
  
      setRestaurants(filteredRestaurants);
    } catch (error) {
      console.error("Error filtering restaurants:", error);
      setError("Failed to filter restaurants. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  
  
  const resetFilters = () => {
    setSelectedDate("");
    setSearchTerm("");
    setRestaurants(allRestaurants);
    setError("");
  };

  const doAll = (restaurantName: string, restaurantAddress: string) => {
    //if (typeof window !== "undefined") {
      sessionStorage.setItem("restaurantUsername", restaurantName);
      sessionStorage.setItem("restaurantAddress", restaurantAddress);
      console.log(restaurantAddress);
      console.log(restaurantName)
    //}
    router.push("/view-reservations"); // Navigate using Next.js router
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
                  <p>{restaurant.Address}</p>
                </div>
                <button
                  onClick={() => doAll(restaurant.restaurantName, restaurant.Address)}
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
