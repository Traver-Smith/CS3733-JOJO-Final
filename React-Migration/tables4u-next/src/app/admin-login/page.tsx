"use client";

import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import styles from "./styles.module.css";

export default function AdminLogin() {
  const [error, setError] = useState<string>("");
  const navigate = useNavigate(); // Add navigate hook

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const email = (event.currentTarget.elements.namedItem("email") as HTMLInputElement).value;
    const password = (event.currentTarget.elements.namedItem("password") as HTMLInputElement).value;

    setError(""); // Reset error state

    try {
      const response = await fetch(
        "https://x51lo0cnd3.execute-api.us-east-2.amazonaws.com/Stage1/loginAdmin",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (data.statusCode == 200) {
        alert("Login successful!");
        navigate("/adminRestaurantList")
      } else {
        setError(data.error || "Invalid credentials.");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div>
      <div className={styles.container}>
        <h1 className={styles.formTitle}>Admin Login</h1>
        <form className={styles.form} onSubmit={handleLogin}>
          {error && <div className={styles.error}>{error}</div>}
          <label htmlFor="email">Username</label>
          <input type="text" id="email" name="email" placeholder="Enter your email" required />
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" placeholder="Enter your password" required />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}