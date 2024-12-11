'use client';

import React from 'react'
//import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import styles from "./layout.module.css";
  
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <button onClick={() => window.location.href = "/view-reservations"}>
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
        <main>{children}</main>
      </body>
    </html>
  );
}
