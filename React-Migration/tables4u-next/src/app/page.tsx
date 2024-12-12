'use client';

import { NavigationProvider, useNavigation } from "./NavigationContext";
import React, {useState, useEffect}from 'react'
//import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import UserRestaurantList from "./user-rest-list/page"
import ViewReservations from "./view-reservations/page"
import RestaurantLogin from "./owner-login/page"

import styles from "./layout.module.css";
import AdminLogin from "./admin-login/page";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <NavigationProvider>
      <LayoutWithNavigation>{children}</LayoutWithNavigation>
    </NavigationProvider>
  );
}
  
  
function LayoutWithNavigation({ children }: { children: React.ReactNode }) {
  const { currentPage, setCurrentPage } = useNavigation();

  const navigateTo = (page: string) => {
    setCurrentPage(page);
  };

  return (
    <html lang="en">
      <body>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <button onClick={() => navigateTo("userRestaurantList")}>
              Make a Reservation
            </button>
          </div>
          <div className={styles.headerTitle}>
            <h1 className={styles.mainTitle}>Tables4u</h1>
            <h2 className={styles.subtitle}>Welcome</h2>
          </div>
          <div className={styles.headerRight}>
            <button onClick={() => navigateTo("adminLogin")}>Admin Login</button>
            <button onClick={() => navigateTo("restaurantLogin")}>Restaurant Login</button>
          </div>
        </header>
        
        
        
        <main>
          {currentPage === "home" && <UserRestaurantList />}
          {currentPage === "userRestaurantList" && <UserRestaurantList />}
          {currentPage === "viewReservations" && <ViewReservations />}
          {currentPage === "restaurantLogin" && <RestaurantLogin />}
          {currentPage === "adminLogin" && <AdminLogin />}
        </main>
      </body>
    </html>
  );
}
  
  
  /*const [currentPage, setCurrentPage] = useState<string>("home");
  const handleNavigation = (page: string) => {
    setCurrentPage(page);
  };

  return (
    <html lang="en">
      <body>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <button onClick={() => handleNavigation("userRestaurantList")}>
              Make a Reservation
            </button>
          </div>
          <div className={styles.headerTitle}>
            <h1 className={styles.mainTitle}>Tables4u</h1>
            <h2 className={styles.subtitle}>Welcome</h2>
          </div>
          <div className={styles.headerRight}>
            <button onClick={() => (window.location.href = "/adminLogin")}>Admin Login</button>
            <button onClick={() => (window.location.href = "/ownerLogin")}>Restaurant Login</button>
          </div>
        </header>
        <main>
          {currentPage === 'home' && <UserRestaurantList />}
          {currentPage === "userRestaurantList" && <UserRestaurantList />}
          {currentPage === "viewReservations" && <ViewReservations />}
        </main>
      </body>
    </html>
  );
}
*/
