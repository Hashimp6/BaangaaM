import Box from "@mui/material/Box";
import NavBar from "../components/NavBar";
import Sidebar from "../components/SideCatagory";
import MiddleProducts from "../components/MiddleProducts";

function Products() {
  return (
    <div>
      <NavBar />
      <Box
        sx={{
          display: "flex",
          flexDirection: {
            xs: "column", 
            md: "row", 
          },
        }}
      >
        <Sidebar type={"product"} />
        <MiddleProducts />
      </Box>
    </div>
  );
}

export default Products;
