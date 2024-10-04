import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Menu, 
  MenuItem, 
  Typography, 
  Avatar, 
  Box, 
  Button,
  Divider
} from '@mui/material';
import { logout } from '../redux/slices/users/usersSlic'; // Adjust path as needed

const UserMenu = ({ anchorElUser, handleCloseUserMenu }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.user.userInfo?.user);

  const handleLogout = () => {
    dispatch(logout());
    handleCloseUserMenu();
    navigate('/login');
  };

  return (
    <Menu
      anchorEl={anchorElUser}
      open={Boolean(anchorElUser)}
      onClose={handleCloseUserMenu}
      PaperProps={{
        sx: {
          width: '300px',
          p: 2
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar 
          sx={{ 
            bgcolor: 'teal', 
            width: 56, 
            height: 56,
            fontSize: '24px'
          }}
        >
          {userInfo?.name ? userInfo.name[0].toUpperCase() : 'U'}
        </Avatar>
        <Box sx={{ ml: 2 }}>
          <Typography variant="h6">{userInfo?.name || 'User'}</Typography>
          <Typography variant="body2" color="text.secondary">
            {userInfo?.email}
          </Typography>
        </Box>
      </Box>
      
      <Divider sx={{ my: 1 }} />
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
          Contact Details
        </Typography>
        {userInfo?.phone && (
          <Typography variant="body2">
            Phone: {userInfo.phone}
          </Typography>
        )}
        {userInfo?.address && (
          <>
            <Typography variant="body2">
              {userInfo.address.houseName}
            </Typography>
            <Typography variant="body2">
              {userInfo.address.city}, {userInfo.address.state} {userInfo.address.postalCode}
            </Typography>
          </>
        )}
      </Box>
      
      <Button 
        onClick={handleLogout}
        variant="outlined"
        color="primary"
        fullWidth
        sx={{ 
          borderColor: 'teal', 
          color: 'teal',
          '&:hover': {
            borderColor: 'teal',
            backgroundColor: 'rgba(0, 128, 128, 0.04)'
          }
        }}
      >
        Logout
      </Button>
    </Menu>
  );
};

export default UserMenu;