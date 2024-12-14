"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Use Next.js' router for navigation
import styles from "./styles.module.css";

interface Restaurant {
  restaurantName: string;
  address: string;
  isActive: number;
}

export default function AdminRestaurantList() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const router = useRouter(); // Use Next.js' router
  const apiEndpoint =
    "https://x51lo0cnd3.execute-api.us-east-2.amazonaws.com/Stage1/adminList";
  const deleteApiEndpoint =
    "https://x51lo0cnd3.execute-api.us-east-2.amazonaws.com/Stage1/adminDeleteRestaurant";

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await fetch(apiEndpoint);
      const data = await response.json();
      const parsedData = JSON.parse(data.body).data;
      setRestaurants(parsedData);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    }
  };

  const deleteRestaurant = async (address: string, name: string) => {
    const confirmation = confirm(`Are you sure you want to delete "${name}"?`);
    if (!confirmation) return;

    try {
      const response = await fetch(deleteApiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message || `Restaurant "${name}" deleted successfully.`);
        fetchRestaurants();
      } else {
        alert(result.error || "Failed to delete the restaurant.");
      }
    } catch (error) {
      console.error("Error deleting restaurant:", error);
      alert("An error occurred while deleting the restaurant.");
    }
  };

  return (
    <div>
      <div className={styles.container}>
        <div className={styles.restaurantList}>
          <h1>Admin Restaurant List</h1>
        </div>
        <div className={styles.buttonBox}>
          <button
            className={styles.reportButton}
            onClick={() => router.push("/admin-report")} // Use router.push
          >
            View Availability Reports
          </button>
        </div>
      </div>

      <div className={styles.container}>
        {restaurants.map((restaurant, index) => (
          <div key={index} className={styles.restaurant}>
            <div className={styles.restaurantHeader}>
              <h3>{restaurant.restaurantName}</h3>
            </div>
            <p className={styles.status}>
              Status:{" "}
              <span
                className={
                  restaurant.isActive === 1 ? styles.active : styles.inactive
                }
              >
                {restaurant.isActive === 1 ? "Active" : "Inactive"}
              </span>
            </p>
            <p className={styles.address}>Address: {restaurant.address}</p>
            <div className={styles.actions}>
              <button
                className={styles.deleteButton}
                onClick={() =>
                  deleteRestaurant(restaurant.address, restaurant.restaurantName)
                }
              >
                Delete Restaurant
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
