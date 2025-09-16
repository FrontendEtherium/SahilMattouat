import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Card, CardContent, Typography, Box, LinearProgress } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

const BookingSuccessful = () => {
    const [counter, setCounter] = useState(5);
    const history = useHistory();

    useEffect(() => {
        const timer = counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
        if (counter === 0) {
            history.push('/');
        }
        return () => clearInterval(timer);
    }, [counter, history]);

    const progress = (counter / 5) * 100;

    return (
        <Box 
            display="flex" 
            justifyContent="center" 
            alignItems="center" 
            minHeight="100vh"
            bgcolor="#f4f6f8"
        >
            <Card style={{ maxWidth: 500, width: '90%', textAlign: 'center', padding: '2rem', borderRadius: '15px', boxShadow: '0 8px 16px 0 rgba(0,0,0,0.1)' }}>
                <CardContent>
                    <CheckCircleIcon style={{ fontSize: 80, color: '#4caf50' }} />
                    <Typography variant="h4" component="h1" style={{ margin: '1rem 0', fontWeight: 'bold', color: '#333' }}>
                        Booking Successful!
                    </Typography>
                    <Typography variant="body1" style={{ marginBottom: '2rem', color: '#555' }}>
                        Your appointment has been confirmed. Thank you for choosing All Cures.
                    </Typography>
                    <Typography variant="body2" style={{ marginBottom: '0.5rem', color: '#777' }}>
                        Redirecting to homepage in {counter} seconds...
                    </Typography>
                    <LinearProgress variant="determinate" value={100 - progress} style={{ height: '10px', borderRadius: '5px' }} />
                </CardContent>
            </Card>
        </Box>
    );
};

export default BookingSuccessful;