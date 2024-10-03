import Box from "@mui/material/Box";
import NavBar from "../components/NavBar";
import Sidebar from "../components/SideCatagory";
import MiddleBar from "../components/MiddleBar";
import MiddleProducts from "../components/MiddleProducts";

function Products() {
  return (
    <div>
      <NavBar />
      <Box display="flex">
        <Sidebar type={"product"} />
        <MiddleProducts />
      </Box>
    </div>
  );
}

export default Products;
