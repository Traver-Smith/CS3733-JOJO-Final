'use client';

import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';

export default function EditRestaurant() {
    const [restaurantName, setRestaurantName] = useState('');
    const [isActive, setIsActive] = useState(false);
    const [tables, setTables] = useState<any[]>([]);
    const [openTime, setOpenTime] = useState('');
    const [closeTime, setCloseTime] = useState('');
    const [openDays, setOpenDays] = useState<string[]>([]);
    const [error, setError] = useState('');

    const restaurantAddress = typeof window !== 'undefined' ? sessionStorage.getItem('restaurantUsername') || '' : '';

    useEffect(() => {
        renderRestaurant();
        fetchExistingTables();
    }, []);

    const renderRestaurant = async () => {
        try {
            const response = await fetch('https://jx7q3te4na.execute-api.us-east-2.amazonaws.com/Stage2/getRestaurant', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ address: restaurantAddress }),
            });
            const data = await response.json();
            if (response.status === 200) {
                const restaurantData = JSON.parse(data.body)?.restaurant;
                setRestaurantName(restaurantData.restaurantName || '');
                setOpenTime(restaurantData.openTime || '');
                setCloseTime(restaurantData.closeTime || '');
                setOpenDays(
                    ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].filter(
                        (day) => !restaurantData.closedDays.split(',').includes(day)
                    )
                );
                setIsActive(!!restaurantData.isActive);
            } else {
                setError(data.error || 'Failed to fetch restaurant details.');
            }
        } catch (error) {
            setError('An unexpected error occurred.');
            console.error(error);
        }
    };

    const fetchExistingTables = async () => {
        try {
            const response = await fetch('https://jx7q3te4na.execute-api.us-east-2.amazonaws.com/Stage2/listTables', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ address: restaurantAddress }),
            });
            const data = await response.json();
            const tablesData = JSON.parse(data.body)?.data || [];
            setTables(tablesData);
        } catch (error) {
            setError('Error fetching existing tables.');
            console.error(error);
        }
    };

    const addTable = async () => {
        const tableNum = parseInt((document.getElementById('table_num') as HTMLInputElement).value, 10);
        const numSeats = parseInt((document.getElementById('table_seats') as HTMLInputElement).value, 10);

        if (!tableNum || !numSeats) {
            setError('Please enter valid table details.');
            return;
        }

        try {
            const response = await fetch('https://jx7q3te4na.execute-api.us-east-2.amazonaws.com/Stage2/addTable', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tableNum, numSeats, restaurantID: restaurantAddress }),
            });
            if (response.status === 200) {
                fetchExistingTables();
            } else {
                const data = await response.json();
                setError(data.error || 'Failed to add table.');
            }
        } catch (error) {
            setError('An error occurred.');
            console.error(error);
        }
    };

    const saveRestaurant = async () => {
        try {
            const closedDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].filter(
                (day) => !openDays.includes(day)
            );

            const response = await fetch('https://jx7q3te4na.execute-api.us-east-2.amazonaws.com/Stage2/editRestaurant', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    restaurantName,
                    address: restaurantAddress,
                    openTime,
                    closeTime,
                    closedDays: closedDays.join(','),
                }),
            });
            if (response.status === 200) {
                alert('Restaurant saved successfully!');
            } else {
                const data = await response.json();
                setError(data.error || 'Failed to save restaurant.');
            }
        } catch (error) {
            setError('An unexpected error occurred.');
            console.error(error);
        }
    };

    return (
        <div>
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <button onClick={() => alert('Redirecting to Make a Reservation')}>Make a Reservation</button>
                </div>
                <div className={styles.headerTitle}>
                    <h1 className={styles.mainTitle}>Tables4u</h1>
                    <h2 className={styles.subtitle}>Edit Restaurant</h2>
                </div>
                <div className={styles.headerRight}>
                    <button onClick={() => alert('Redirecting to Admin Login')}>Admin Login</button>
                    <button onClick={() => alert('Redirecting to Restaurant Login')}>Restaurant Login</button>
                </div>
            </header>

            <div className={styles.container}>
                <h1>Edit Restaurant</h1>
                <p>Editing: {restaurantName || '(Restaurant Name)'}</p>

                <div className={styles.section}>
                    <h2>Hours of Operation</h2>
                    <label>Opening Time:</label>
                    <select value={openTime} onChange={(e) => setOpenTime(e.target.value)}>
                        <option value="">Select Opening Time</option>
                        {['06:00:00', '07:00:00', '08:00:00'].map((time) => (
                            <option key={time} value={time}>
                                {time}
                            </option>
                        ))}
                    </select>
                    <label>Closing Time:</label>
                    <select value={closeTime} onChange={(e) => setCloseTime(e.target.value)}>
                        <option value="">Select Closing Time</option>
                        {['18:00:00', '19:00:00', '20:00:00'].map((time) => (
                            <option key={time} value={time}>
                                {time}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}