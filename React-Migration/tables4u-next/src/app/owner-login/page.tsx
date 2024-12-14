"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Use Next.js router for navigation
import styles from "./styles.module.css";

export default function RestaurantLogin() {
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter(); // Next.js navigation

  useEffect(() => {
    // Clear error when address or password changes
    if (error) {
      setError("");
    }
  }, [address, password]);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      setError(""); // Clear any previous error messages
      const response = await fetch(
        "https://x51lo0cnd3.execute-api.us-east-2.amazonaws.com/Stage1/loginRestaurant",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address, restaurantPassword: password }),
        }
      );

      const data = await response.json();

      if (data.statusCode === 200) {
        // Save username in session storage
        if (typeof window !== "undefined") {
          sessionStorage.setItem("restaurantUsername", address);
        }

        // Redirect to the edit restaurant page
        router.push("/edit-rest");
      } else {
        setError(data.error || "Invalid address or password.");
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
      console.error("Error during login:", err);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.formTitle}>Restaurant Owner Login</h1>
      <form className={styles.form} onSubmit={handleLogin}>
        {error && <div className={styles.error}>{error}</div>}
        <label htmlFor="username">Restaurant Address</label>
        <input
          type="text"
          id="username"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter your restaurant address"
          required
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />
        <button type="submit">Login</button>
        <button
          type="button"
          className={styles.secondaryButton}
          onClick={() => router.push("/create-rest")}
        >
          Create Restaurant
        </button>
      </form>
    </div>
  );
}
