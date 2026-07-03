import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, Typography, Box, Divider, CircularProgress, Alert } from '@mui/material';
import { getActivityDetail, getActivityRecommendation } from '../services/api'; 

const ActivityDetail = () => {
    const { id } = useParams();
    const [activity, setActivity] = useState(null);
    const [recommendations, setRecommendations] = useState(null);
    
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [aiLoading, setAiLoading] = useState(true);

    useEffect(() => {
        const fetchAIRecommendations = async () => {
            try {
                const recRes = await getActivityRecommendation(id);
                setRecommendations(recRes.data); 
                setAiLoading(false); 
            } catch (recErr) {
                if (recErr.response && recErr.response.status === 404) {
                    // Suppress console error to keep logs clean, just try again
                    setTimeout(fetchAIRecommendations, 3000); 
                } else {
                    setAiLoading(false); 
                }
            }
        };

        const fetchAllData = async () => {
            setIsLoading(true);
            try {
                const activityRes = await getActivityDetail(id);
                setActivity(activityRes.data);
                setIsLoading(false);
                
                setAiLoading(true);
                fetchAIRecommendations();
            } catch (err) {
                console.error("Failed to fetch core activity:", err);
                setError("Failed to load activity details. It may not exist.");
                setIsLoading(false);
            }
        };
        
        if (id) fetchAllData();
    }, [id]);

    if (isLoading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
    } 

    if (error) {
        return <Box sx={{ p: 2 }}><Alert severity="error">{error}</Alert></Box>;
    }

    if (!activity) return null;

    // Helper function to make the text before the colon bold (since DB saves it as "Area: Description")
    const formatBulletPoint = (text) => {
        const splitIndex = text.indexOf(':');
        if (splitIndex !== -1) {
            return (
                <>
                    <strong>{text.substring(0, splitIndex + 1)}</strong> 
                    {text.substring(splitIndex + 1)}
                </>
            );
        }
        return text;
    };

    return (
       <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: '4px', boxShadow: 3, backgroundColor: '#f9f9f9' }}>
        
        <Card sx={{ p: 2, mb: 2 }}>
            <CardContent>
                <Typography variant="h5" gutterBottom>Activity Details</Typography>
                <Typography variant="body1">Type: {activity.type}</Typography>
                <Typography variant="body1">Duration: {activity.duration} minutes</Typography>
                <Typography variant="body1">Calories Burned: {activity.caloriesBurned}</Typography>
            </CardContent>
        </Card>

        <Card sx={{ p: 2 }}>
            <CardContent>
                <Typography variant="h5" color="primary" gutterBottom>
                    AI Coach Insights
                </Typography>

                {aiLoading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                        <CircularProgress size={20} />
                        <Typography>AI is analyzing your workout...</Typography>
                    </Box>
                ) : recommendations ? (
                    <>
                        {/* Mapped to MongoDB "recommendation" field */}
                        <Typography variant="h6" sx={{ mt: 2 }}>Overall Analysis</Typography>
                        <Typography paragraph>{recommendations.recommendation}</Typography>
                        
                        <Divider sx={{ my: 2 }} />
                        
                        {/* Mapped to MongoDB "improvements" array of strings */}
                        <Typography variant="h6">Areas for Improvement</Typography>
                        {recommendations.improvements?.map((improvement, index) => (
                            <Typography key={index} paragraph>
                                • {formatBulletPoint(improvement)}
                            </Typography>
                        ))}

                        <Divider sx={{ my: 2 }} />

                        {/* Mapped to MongoDB "suggestions" array of strings */}
                        <Typography variant="h6">Workout Suggestions</Typography>
                        {recommendations.suggestions?.map((suggestion, index) => (
                            <Typography key={index} paragraph>
                                • {formatBulletPoint(suggestion)}
                            </Typography>
                        ))}

                        <Divider sx={{ my: 2 }} />

                        {/* Safety (Already correct, but styled to match) */}
                        <Typography variant="h6">Safety Guidelines</Typography>
                        {recommendations.safety?.map((safety, index) => (
                            <Typography key={index} paragraph>
                                • {safety}
                            </Typography>
                        ))}
                    </>
                ) : (
                    <Alert severity="info" sx={{ mt: 2 }}>
                        AI insights could not be generated for this workout.
                    </Alert>
                )}
            </CardContent>
        </Card>

       </Box>
    );
};

export default ActivityDetail;