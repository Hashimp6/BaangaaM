import { Box, TextField, InputAdornment, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";


function SearchSpace() {
  return (
    <div>
      <Box
        sx={{
          height: "10vh",
          width: "18vw",
          margin: "1vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TextField
          variant="outlined"
          placeholder="Search..."
          size="small"
          sx={{
            width: "15vw",
            borderRadius: "30px", // Rounded shape
            flexGrow: 1,
            "& .MuiOutlinedInput-root": {
              borderRadius: "30px", // Rounded shape for the input itself

              "&:hover fieldset": {
                borderColor: "#a0a0a0", // Border color on hover
              },
              "&.Mui-focused fieldset": {
                borderColor: "teal", // Focused border color
              },
            },
            "& .MuiInputBase-input": {
              paddingLeft: "16px", // Adjust padding as needed
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  sx={{ p: 0, color: "text.secondary" }}
                  aria-label="search"
                >
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </div>
  );
}

export default SearchSpace;
