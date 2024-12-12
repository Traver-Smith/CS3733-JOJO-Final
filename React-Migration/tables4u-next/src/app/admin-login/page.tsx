"use client";

import React, { useState } from "react";
import styles from "./styles.module.css";

export default function AdminLogin() {
  const [error, setError] = useState<string>("");

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const email = (event.currentTarget.elements.namedItem("email") as HTMLInputElement).value;
    const password = (event.currentTarget.elements.namedItem("password") as HTMLInputElement).value;

    setError(""); // Reset error state

    try {
      const response = await fetch(
        "https://jx7q3te4na.execute-api.us-east-2.amazonaws.com/Stage2/loginAdministrator",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Login successful!");
        window.location.href = "/admin-restaurant-list";
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
          <label htmlFor="email">Email</label>
          <input type="text" id="email" name="email" placeholder="Enter your email" required />
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" placeholder="Enter your password" required />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}