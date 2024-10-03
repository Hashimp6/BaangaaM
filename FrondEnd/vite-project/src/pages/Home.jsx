
import Box from "@mui/material/Box";
import NavBar from "../components/NavBar";
import Sidebar from "../components/SideCatagory";
import MiddleBar from "../components/MiddleBar";

function Home() {
  return (
    <div>
      <NavBar />
      <Box display="flex">
        <Sidebar type={"shop"} />
        <MiddleBar />
      </Box>
    </div>
  );
}

export default Home;
