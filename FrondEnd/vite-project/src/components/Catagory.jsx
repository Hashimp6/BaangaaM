import PropTypes from "prop-types";
import { Typography, Box } from "@mui/material";
import logo from "../../public/pics/logbg.jpg";

function Catagory({ category }) {
  console.log(category);
  return (
    <Box display="flex" flexDirection="column" alignItems="center" sx={{
      padding: "10px",}}>
      <Box
        component="img"
        src={category.categoryImage || logo} // Use category image if available, else use default logo
        alt={`${category.name} Image`}
        sx={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          border: "none",
          objectFit: "cover",
        }}
      />
      <Typography variant="body1" sx={{ marginTop: 1, textAlign: "center" }}>
        {category.categoryName || "Unnamed Category"}
      </Typography>
    </Box>
  );
}

Catagory.propTypes = {
  category: PropTypes.shape({
    imageSrc: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
};

export default Catagory;
