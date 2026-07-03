import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Added Box and Button for the empty state UI
import { Card, CardContent, Typography, Grid, Box, Button } from '@mui/material';
// Ensure getActivities is imported!
import { getActivities } from '../services/api'; 

const ActivityList = () => {
    const [activities, setActivities] = useState([]);
    const navigate = useNavigate();

    const fetchActivities = async () => {
        try {
            const response = await getActivities(); 
            
            // DEBUGGING STEP: Log the raw data to see if the ID has a ":1" attached
            console.log("DATA FROM BACKEND:", response.data); 
            
            setActivities(response.data);
        } catch (error) {
            console.error("Error fetching activities:", error);
        }
    };

    useEffect(() => {
        fetchActivities();
    }, []);

    // RESUME-READY POLISH: Handle the Empty State gracefully
    if (activities?.length === 0) {
        return (
            <Box sx={{ textAlign: 'center', mt: 5, p: 3 }}>
                <Typography variant="h5" gutterBottom>
                    No activities found!
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    It looks like you haven't tracked any workouts yet. Time to get moving!
                </Typography>
                {/* Note: Update '/log-activity' if your creation route is named differently */}
                <Button variant="contained" color="primary" onClick={() => navigate('/log-activity')}>
                    Log a Workout
                </Button>
            </Box>
        );
    }

    return (
        <Grid container spacing={2}>
            {
                // Optional chaining just in case activities is undefined
                activities?.map((activity) => (
                    <Grid 
                        item // Required by standard Grid
                        key={activity.id}
                        xs={12} sm={6} md={4} // Sizing props go directly on the Grid element
                        sx={{ p: 2, border: '1px solid #ccc', borderRadius: '4px', boxShadow: 3, backgroundColor: '#f9f9f9' }}
                    >
                        <Card 
                            sx={{ cursor: 'pointer', height: '100%' }}
                            onClick={() => navigate(`/activities/${activity.id}`)}
                        >
                            <CardContent> 
                                <Typography variant="h6"> 
                                    {activity.type}
                                </Typography>
                                <Typography>
                                    Duration: {activity.duration} mins
                                </Typography>
                                <Typography> 
                                    Calories: {activity.caloriesBurned} kcal
                                </Typography>
                            </CardContent> 
                        </Card> 
                    </Grid>
                ))
            }
        </Grid>
    );
}

export default ActivityList;