"use client";

import React from "react";
import styles from "./layout.module.css";

export default function HomePage() {
  return (
    <div className={styles.container}>
      <h1>Welcome to Tables4u!</h1>
      <p>Select an option from the navigation above to get started.</p>
    </div>
  );
}
