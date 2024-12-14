'use client';

import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './globals.css';
import UserRestaurantList from './user-rest-list/page';
import ViewReservations from './view-reservations/page';
import RestaurantLogin from './owner-login/page';
import AdminLogin from './admin-login/page';
import AdminReport from './admin-report/page';
import styles from './layout.module.css';
import { NavigationProvider } from './NavigationContext';
import OwnerLogin from './owner-login/page';
import CreateRestaurant from './create-rest/page';
import UserReservationLookup from './user-reservations/page';
import EditRestaurant from './edit-rest/page';
import AdminRestaurantList from './admin-rest-list/page';

export default function App() {
  return (
    <NavigationProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<UserRestaurantList />} />
            <Route path="/userRestaurantList" element={<UserRestaurantList />} />
            <Route path="/UserReservationLookup" element={<UserReservationLookup />} />
            <Route path="/restaurantLogin" element={<RestaurantLogin />} />
            <Route path="/adminLogin" element={<AdminLogin />} />
            <Route path="/adminReport" element={<AdminReport />} />
            <Route path="/ownerLogin" element={<OwnerLogin />} />
            <Route path="/createRestaurant" element={<CreateRestaurant />} />
            <Route path="/editRestaurant" element={<EditRestaurant />} />
            <Route path="/adminRestaurantList" element={<AdminRestaurantList />} />
          </Routes>
        </Layout>
      </Router>
    </NavigationProvider>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
}

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const navigateTo = (page: string) => {
    navigate(page === 'home' ? '/' : `/${page}`);
  };

  // Determine the current page title dynamically based on the route
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/adminReport':
        return 'Admin Availability Report';
      case '/adminRestaurantList':
        return 'Admin Restaurant List';
      case '/userRestaurantList':
        return 'User Restaurant List';
      case '/UserReservationLookup':
        return 'Reservation Lookup';
      case '/restaurantLogin':
        return 'Restaurant Login';
      case '/adminLogin':
        return 'Admin Login';
      case '/ownerLogin':
        return 'Owner Login';
      case '/createRestaurant':
        return 'Create Restaurant';
      case '/editRestaurant':
        return 'Edit Restaurant';
      default:
        return 'Tables4u';
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <button className={styles.button} onClick={() => navigateTo('userRestaurantList')}>
          Make a Reservation
        </button>
        <button className={styles.button} onClick={() => navigateTo('UserReservationLookup')}>
          Lookup Reservation
        </button>
      </div>
      <div className={styles.headerTitle}>
        <h1>Tables4u</h1>
        <h2>{getPageTitle()}</h2>
      </div>
      <div className={styles.headerRight}>
        <button className={styles.button} onClick={() => navigateTo('adminLogin')}>
          Admin Login
        </button>
        <button className={styles.button} onClick={() => navigateTo('restaurantLogin')}>
          Restaurant Login/Create
        </button>
      </div>
    </header>
  );
}
