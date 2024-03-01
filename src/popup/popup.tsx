import React from "react";
import './popup.css'
import { Box, Button, Typography } from "@mui/material";

const Popup = () => {
    return (
      <Box sx={{ width: '100%', padding: 3, display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          background: '#F2ECEB',
          border: '1px solid #c9bebd',
          borderRadius: '10px',
          height: '60px',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography sx={{ font: '24px sans-serif', color: '2D2F31' }}>
          YouTube Smart Commentator
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 1,
          height: 200,
          background: '#F2ECEB',
          border: '1px solid #c9bebd',
          padding: 2,
          borderRadius: '10px',
        }}
      >
        <Typography sx={{ font: '20px sans-serif', color: '2D2F31' }}>About</Typography>
        <Typography sx={{ font: '13px sans-serif', color: '2D2F31', mt: 1, fontWeight: 'bold' }}>SmartCommentator is a powerful browser extension designed to enhance your YouTube commenting experience. With SmartCommentator, effortlessly generate insightful and personalized comments using advanced AI technology while browsing YouTube videos. </Typography>
      </Box>
      </Box>
    )
};

export default Popup;