import React from 'react';
import { Paper, Typography, Box, Button } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const PaymentStatus = ({ status, onClose }) => {
  const isSuccess = status === 'success';

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        mt: 2, 
        bgcolor: isSuccess ? 'success.light' : 'error.light',
        color: 'white'
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
        {isSuccess ? (
          <CheckCircleOutlineIcon sx={{ fontSize: 60, mb: 2 }} />
        ) : (
          <ErrorOutlineIcon sx={{ fontSize: 60, mb: 2 }} />
        )}
        <Typography variant="h5" gutterBottom>
          {isSuccess ? 'Order Successful!' : 'Payment Failed'}
        </Typography>
        <Typography variant="body1" align="center" gutterBottom>
          {isSuccess 
            ? 'Your order has been placed successfully.' 
            : 'There was an issue processing your payment. Please try again.'}
        </Typography>
        <Button 
          variant="contained" 
          color={isSuccess ? 'primary' : 'error'}
          onClick={onClose}
          sx={{ mt: 2 }}
        >
          {isSuccess ? 'Continue Shopping' : 'Back to Cart'}
        </Button>
      </Box>
    </Paper>
  );
};

export default PaymentStatus;