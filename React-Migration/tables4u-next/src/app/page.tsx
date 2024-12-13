'use client';

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import './globals.css';
import UserRestaurantList from './user-rest-list/page';
import ViewReservations from './view-reservations/page';
import RestaurantLogin from './owner-login/page';
import AdminLogin from './admin-login/page';
import AdminReport from './admin-report/page';
import styles from './layout.module.css';
import { NavigationProvider, useNavigation } from './NavigationContext';
import OwnerLogin from './owner-login/page';
import CreateRestaurant from './create-rest/page';


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <NavigationProvider>
      <Router>
        <LayoutWithNavigation>{children}</LayoutWithNavigation>
      </Router>
    </NavigationProvider>
  );
}

function LayoutWithNavigation({ children }: { children: React.ReactNode }) {
  const { currentPage, setCurrentPage } = useNavigation();
  const navigate = useNavigate();

  const navigateTo = (page: string) => {
    setCurrentPage(page);
    navigate(page === 'home' ? '/' : `/${page}`);
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button onClick={() => navigateTo('userRestaurantList')}>
            Make a Reservation
          </button>
        </div>
        <div className={styles.headerTitle}>
          <h1 className={styles.mainTitle}>Tables4u</h1>
          <h2 className={styles.subtitle}>Welcome</h2>
        </div>
        <div className={styles.headerRight}>
          <button onClick={() => navigateTo('adminLogin')}>Admin Login</button>
          <button onClick={() => navigateTo('restaurantLogin')}>Restaurant Login</button>
        </div>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<UserRestaurantList />} />
          <Route path="/userRestaurantList" element={<UserRestaurantList />} />
          <Route path="/viewReservations" element={<ViewReservations />} />
          <Route path="/restaurantLogin" element={<RestaurantLogin />} />
          <Route path="/adminLogin" element={<AdminLogin />} />
          <Route path="/adminReport" element={<AdminReport />} />
          <Route path="/ownerLogin" element={<OwnerLogin />} />
          <Route path="/createRestaurant" element={<CreateRestaurant />} />
        </Routes>
        {children}
      </main>
    </>
  );
}
