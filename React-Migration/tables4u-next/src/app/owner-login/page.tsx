'use client';

import React, { useState } from 'react';
import styles from './styles.module.css';
import { useNavigation } from '../NavigationContext'; // Adjust the import path as needed

export default function RestaurantLogin() {
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { setCurrentPage } = useNavigation();

    const navigateTo = (page: string) => {
        setCurrentPage(page);
    };

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            setError(''); // Clear any previous error messages
            const response = await fetch(
                'https://jx7q3te4na.execute-api.us-east-2.amazonaws.com/Stage2/loginRestaurant',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ address, restaurantPassword: password }),
                }
            );

            const data = await response.json();

            if (response.status === 200) {
                // Save username and password in session storage
                sessionStorage.setItem('restaurantUsername', address);
                sessionStorage.setItem('restaurantPassword', password);

                // Redirect to the edit restaurant page (adjust this key as needed)
                navigateTo('editRestaurant');
            } else {
                setError(data.error || 'Invalid address or password.');
            }
        } catch (err) {
            setError('An error occurred. Please try again later.');
            console.error('Error during login:', err);
        }
    };

    // Optional: If you want the same header with navigation buttons,
    // you can include it here. Adjust 'navigateTo' arguments as needed.
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
                        onClick={() => navigateTo('createRestaurant')}
                    >
                        Create Restaurant
                    </button>
                </form>
            </div>
        </div>
    );
}