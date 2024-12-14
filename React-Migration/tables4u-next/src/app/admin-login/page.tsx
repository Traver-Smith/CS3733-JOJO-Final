"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Next.js router for navigation
import styles from "./styles.module.css";

export default function AdminLogin() {
  const [error, setError] = useState<string>("");
  const router = useRouter(); // Use Next.js' useRouter for navigation

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const email = (event.currentTarget.elements.namedItem("email") as HTMLInputElement).value;
    const password = (event.currentTarget.elements.namedItem("password") as HTMLInputElement).value;

    setError(""); // Clear any previous error messages

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

      if (data.statusCode === 200) {
        alert("Login successful!");
        router.push("/admin-rest-list"); // Navigate to the admin restaurant list page
      } else {
        setError(data.error || "Invalid credentials.");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.formTitle}>Admin Login</h1>
      <form className={styles.form} onSubmit={handleLogin}>
        {error && <div className={styles.error}>{error}</div>}
        <label htmlFor="email">Username</label>
        <input type="text" id="email" name="email" placeholder="Enter your email" required />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Enter your password"
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
