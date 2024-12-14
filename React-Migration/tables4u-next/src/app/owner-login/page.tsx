'use client';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import styles from './styles.module.css';
import { useNavigation } from '../NavigationContext'; // Adjust the import path as needed
export default function RestaurantLogin() {
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { setCurrentPage } = useNavigation();

    const navigate = useNavigate(); // For navigation

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      setError(''); // Clear any previous error messages
      const response = await fetch(
        'https://x51lo0cnd3.execute-api.us-east-2.amazonaws.com/Stage1/loginRestaurant',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address, restaurantPassword: password }),
        }
      );

      const data = await response.json();

      if (response.status === 200) {
        // Save username in session storage
        sessionStorage.setItem('restaurantUsername', address);

        // Redirect to the edit restaurant page
        navigate('/editRestaurant');
      } else {
        setError(data.error || 'Invalid address or password.');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
      console.error('Error during login:', err);
    }
  };

    
    return (
        <div>


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
                        onClick={() => window.location.href = "/create-rest"}
                    >
                        Create Restaurant
                    </button>
                </form>
            </div>
        </div>
    );
}