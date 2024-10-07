import { Box, Stack, Typography, useMediaQuery } from "@mui/material";
import Catagory from "./Catagory";
import SearchSpace from "./SearchSpace";
import { useEffect, useState } from "react";
import axios from "axios";

function Sidebar({ type }) {
  const isMobile = useMediaQuery("(max-width:600px)");
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3200/catagory/all_catagory",
          { type },
          {
            withCredentials: true,
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
      <Box
        sx={{
          display: { xs: "none", md: "block" },
          borderBottom: "1px solid rgba(0,0,0,0.1)",
        }}
      >
        <SearchSpace />
      </Box>

      <Box
        sx={{
          width: { xs: "100%", md: "200px" },
          height: { xs: "auto", md: "75vh" },
          overflowX: { xs: "auto", md: "hidden" },
          overflowY: { xs: "hidden", md: "auto" },
          display: "flex",
          flexDirection: { xs: "row", md: "column" },
          "&::-webkit-scrollbar": { display: "none" },
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
