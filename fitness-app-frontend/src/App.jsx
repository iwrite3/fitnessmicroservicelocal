// 1. We must import React and the specific hooks we are using
import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from 'react-oauth2-code-pkce';

// 2. Import the dispatch hook from Redux
import { useDispatch } from 'react-redux';

// 3. Import your setCredentials action
import { setCredentials } from './store/authSlice';

// 4. We use react-router-dom for web apps
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from "react-router-dom"; 

// 5. Import the Button component 
import Button from '@mui/material/Button'; 
import { Box } from '@mui/material';
import ActivityForm from './components/ActivityForm';
import ActivityList from './components/ActivityList';
import ActivityDetail from './components/ActivityDetail';
const ActivitiesPage = () => {
 return ( 
  <Box component="section" sx={{  p: 2 , border: '1px dashed #ccc', borderRadius: '4px', boxShadow: 3, backgroundColor: '#f9f9f9' }}> 
  
   {/* FIX: Removed the 's' so it perfectly matches the prop in ActivityForm */}
   <ActivityForm onActivityAdded={() => window.location.reload()} />
   
   <ActivityList /> 
  </Box>
 );
}
function App() {
  const { token, tokenData, logIn, logOut, isAuthenticated } = useContext(AuthContext);
  const dispatch = useDispatch();
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    // FIX: Added 'tokenData' to the if-statement guard clause
    if (token && tokenData) {
      dispatch(setCredentials({ token, user: tokenData }));
      setAuthReady(true);
    }
  }, [token, tokenData, dispatch]); 

  return (
    <Router>
    { !token ? (
      <Button 
        variant="contained" 
        color="primary"
        onClick={() => {
          logIn(); 
        }} 
      > 
        Login 
      </Button> ) : (

//         <div>
// <pre>{JSON.stringify(tokenData , null , 2)}</pre>
//  <pre>{JSON.stringify(token , null , 2)}</pre> 
//       </div>
<Box component="main" sx={{  p: 2 , border: '1px solid #ccc', borderRadius: '4px', boxShadow: 3, backgroundColor: '#f9f9f9' }}>
 <Routes>
   <Route path="/activities" element={<ActivitiesPage />} />
   <Route path="/activities/:id" element={<ActivityDetail />} />
      <Route path="/" element={token ? <Navigate to= "/activities" replace  /> : <div> Welcome! Please Login  </div>} />
 </Routes> 
 </Box>   )
      }
    </Router>
  )
}

export default App;