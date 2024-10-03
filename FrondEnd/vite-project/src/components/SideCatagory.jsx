import { Box, Stack, Typography } from "@mui/material";
import Catagory from "./Catagory";
import SearchSpace from "./SearchSpace";
import { useEffect, useState } from "react";
import axios from "axios";

function Sidebar({ type }) {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3200/catagory/all_catagory",
          { type }, {
            withCredentials: true 
          }
        );
        if (response.data.success) {
          setCategories(response.data.data);
        } else {
          setError(
            `Failed to fetch ${type} categories: ${response.data.message}`
          );
        }
      } catch (error) {
        setError(`Error fetching ${type} categories: ${error.message}`);
      }
    };

    fetchCategories();
  }, [type]);

  return (
    <Stack>
      <SearchSpace />

      <Box
        sx={{
          width: "11.5vw",
          height: "75vh",
          overflowY: "auto",
          "&::-webkit-scrollbar": { display: "none" },
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {" "}
        {error ? (
          <div>{error}</div>
        ) : (
          categories.map((category, index) => (
            <Catagory key={index} category={category} />
          ))
        )}
      </Box>
    </Stack>
  );
}

export default Sidebar;
