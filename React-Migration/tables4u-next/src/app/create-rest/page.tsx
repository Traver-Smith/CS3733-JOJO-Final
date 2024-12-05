\'use client';

import React, { useState } from 'react';
import styles from './styles.module.css';

export default function CreateRestaurant() {
    const [restaurantName, setRestaurantName] = useState('');
    const [restaurantAddress, setRestaurantAddress] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const apiEndpoint = 'https://jx7q3te4na.execute-api.us-east-2.amazonaws.com/Stage2/CreateRestaurant';

    const createRestaurant = async () => {
        setErrorMessage('');
        setSuccessMessage('');

        // Validate input
        if (!restaurantName || !restaurantAddress) {
            setErrorMessage('Please fill in all required fields.');
            return;
        }

        const payload = { restaurantName, address: restaurantAddress };

        try {
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const responseJson = await response.json();

            if (response.status === 200) {
                const result = JSON.parse(responseJson.body);
                setSuccessMessage(result.message || 'Restaurant created successfully!');
                setRestaurantName('');
                setRestaurantAddress('');

                if (result.restaurantPassword) {
                    alert(`Your restaurant password is: ${result.restaurantPassword}`);
                } else {
                    console.warn('No restaurant password found in the response.');
                }
            } else {
                setErrorMessage(responseJson.error || 'An unexpected error occurred.');
            }
        } catch (error) {
            console.error('Error creating restaurant:', error);
            setErrorMessage('Failed to connect to the server. Please try again later.');
        }
    };

    return (
        <div>
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <button onClick={() => alert('Redirecting to Make a Reservation page...')}>
                        Make a Reservation
                    </button>
                </div>
                <div className={styles.headerTitle}>
                    <h1 className={styles.mainTitle}>Tables4u</h1>
                    <h2 className={styles.subtitle}>Create Restaurant</h2>
                </div>
                <div className={styles.headerRight}>
                    <button onClick={() => alert('Redirecting to Admin Login')}>Admin Login</button>
                    <button onClick={() => alert('Redirecting to Restaurant Login')}>Restaurant Login</button>
                </div>
            </header>
            <div className={styles.container}>
                <h1 className={styles.formTitle}>Create Restaurant</h1>
                <form
                    className={styles.form}
                    onSubmit={(e) => {
                        e.preventDefault();
                        createRestaurant();
                    }}
                >
                    <label htmlFor="restaurantName">Restaurant Name</label>
                    <input
                        type="text"
                        id="restaurantName"
                        value={restaurantName}
                        onChange={(e) => setRestaurantName(e.target.value)}
                        placeholder="Enter the restaurant name"
                        required
                    />
                    <label htmlFor="restaurantAddress">Restaurant Address</label>
                    <input
                        type="text"
                        id="restaurantAddress"
                        value={restaurantAddress}
                        onChange={(e) => setRestaurantAddress(e.target.value)}
                        placeholder="Enter the restaurant address"
                        required
                    />
                    <button type="button" onClick={createRestaurant} className={styles.primaryButton}>
                        Create Restaurant
                    </button>
                    {errorMessage && <p className={styles.error}>{errorMessage}</p>}
                    {successMessage && <p className={styles.success}>{successMessage}</p>}
                </form>
            </div>
        </div>
    );
}