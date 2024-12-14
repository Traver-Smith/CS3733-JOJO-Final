"use client";

import React from "react";
import Link from "next/link"; // Use Next.js' Link for navigation
import "./globals.css";
import styles from "./layout.module.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}

function Header() {
  // Function to get the current page title dynamically
  const getPageTitle = () => {
    if (typeof window !== "undefined") {
      const pathname = window.location.pathname;
      switch (pathname) {
        case "/adminReport":
          return "Admin Availability Report";
        case "/adminRestaurantList":
          return "Admin Restaurant List";
        case "/userRestaurantList":
          return "User Restaurant List";
        case "/UserReservationLookup":
          return "Reservation Lookup";
        case "/restaurantLogin":
          return "Restaurant Login";
        case "/adminLogin":
          return "Admin Login";
        case "/owner-login":
          return "Owner Login";
        case "/create-restaurant":
          return "Create Restaurant";
        case "/editRestaurant":
          return "Edit Restaurant";
        default:
          return "Tables4u";
      }
    }
    return "Tables4u";
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <Link href="/user-rest-list" className={styles.button}>
          Make a Reservation
        </Link>
        <Link href="/user-reservations" className={styles.button}>
          Lookup Reservation
        </Link>
      </div>
      <div className={styles.headerTitle}>
        <h1>Tables4u</h1>
        <h2>{getPageTitle()}</h2>
      </div>
      <div className={styles.headerRight}>
        <Link href="/admin-login" className={styles.button}>
          Admin Login
        </Link>
        <Link href="/owner-login" className={styles.button}>
          Restaurant Login/Create
        </Link>
      </div>
    </header>
  );
}
