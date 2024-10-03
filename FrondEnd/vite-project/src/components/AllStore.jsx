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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

function StoreTable() {
  const [stores, setStores] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3200/store/all_stores", {
          withCredentials: true 
        }
      );
      if (response.data.success) {
        setStores(response.data.data);
        console.log(response.data.data);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError("Error fetching stores: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:3200/store/${id}`, {
        withCredentials: true 
      });
      if (response.data.success) {
        fetchStores(); // Refresh the list after deletion
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError("Error deleting store: " + error.message);
    }
  };

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="store table">
        <TableHead>
          <TableRow>
            <TableCell>Sl No</TableCell>
            <TableCell>Store Name</TableCell>
            <TableCell>Email ID</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Logo</TableCell>
            <TableCell>Banner</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {stores.map((store, index) => (
            <TableRow
              key={store._id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell>{index + 1}</TableCell>
              <TableCell>{store.shopName}</TableCell>
              <TableCell>{store.email}</TableCell>
              <TableCell>{store.contact?.phone || "N/A"}</TableCell>
              <TableCell>{store.location}</TableCell>
              <TableCell>{store.address}</TableCell>
              <TableCell>{store.category}</TableCell>
              <TableCell>
                <img
                  src={store.logo}
                  alt="Logo"
                  style={{ width: 50, height: 50 }}
                />
              </TableCell>
              <TableCell>
                <img
                  src={store.banner}
                  alt="Banner"
                  style={{ width: 150, height: 50 }}
                />
              </TableCell>
              <TableCell>
                <IconButton
                  onClick={() => handleDelete(store._id)}
                  color="error"
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

export default StoreTable;
