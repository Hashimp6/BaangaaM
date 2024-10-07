import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

function UserTable() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3200/user/allUsers", {
        withCredentials: true,
      });
      if (response.data.success) {
        setUsers(response.data.data);
        console.log(response.data.data);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError("Error fetching users: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:3200/user/deleteUser/${id}`,
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        fetchUsers(); // Refresh the list after deletion
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError("Error deleting user: " + error.message);
    }
  };

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: { xs: 300, sm: 650 } }} aria-label="user table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
              Sl No
            </TableCell>
            <TableCell>Name</TableCell>
            <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
              Email
            </TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user, index) => (
            <TableRow
              key={user._id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                {index + 1}
              </TableCell>
              <TableCell>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography variant="body1">{user.name}</Typography>
                  {isMobile && (
                    <Typography variant="body2" color="textSecondary">
                      {user.email}
                    </Typography>
                  )}
                </Box>
              </TableCell>
              <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                {user.email}
              </TableCell>
              <TableCell>
                <IconButton
                  onClick={() => handleDelete(user._id)}
                  color="error"
                  size={isMobile ? "small" : "medium"}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default UserTable;
