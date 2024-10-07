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
  Collapse,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import axios from "axios";

function Row(props) {
  const { store, index, handleDelete } = props;
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {store.shopName}
        </TableCell>
        {!isMobile && (
          <>
            <TableCell>{store.email}</TableCell>
            <TableCell>{store.contact?.phone || "N/A"}</TableCell>
            <TableCell>{store.location}</TableCell>
          </>
        )}
        <TableCell>
          <IconButton
            onClick={() => handleDelete(store._id)}
            color="error"
            size={isMobile ? "small" : "medium"}
          >
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Store Details
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableBody>
                  {isMobile && (
                    <>
                      <TableRow>
                        <TableCell component="th" scope="row">Email</TableCell>
                        <TableCell>{store.email}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">Phone</TableCell>
                        <TableCell>{store.contact?.phone || "N/A"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">Location</TableCell>
                        <TableCell>{store.location}</TableCell>
                      </TableRow>
                    </>
                  )}
                  <TableRow>
                    <TableCell component="th" scope="row">Address</TableCell>
                    <TableCell>{store.address}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">Category</TableCell>
                    <TableCell>{store.category}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">Logo</TableCell>
                    <TableCell>
                      <img
                        src={store.logo}
                        alt="Logo"
                        style={{ width: 50, height: 50 }}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">Banner</TableCell>
                    <TableCell>
                      <img
                        src={store.banner}
                        alt="Banner"
                        style={{ width: 150, height: 50 }}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

function StoreTable() {
  const [stores, setStores] = useState([]);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const response = await axios.get(
       `${import.meta.env.VITE_Backend_api}/store/all_stores`,
        {
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
      const response = await axios.delete(`${import.meta.env.VITE_Backend_api}/store/${id}`, {
        withCredentials: true
      });
      if (response.data.success) {
        fetchStores();
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
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Store Name</TableCell>
            {!isMobile && (
              <>
                <TableCell>Email ID</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Location</TableCell>
              </>
            )}
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {stores.map((store, index) => (
            <Row key={store._id} store={store} index={index} handleDelete={handleDelete} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default StoreTable;