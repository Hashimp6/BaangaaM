
import Box from "@mui/material/Box";
import NavBar from "../components/NavBar";
import Sidebar from "../components/SideCatagory";
import MiddleBar from "../components/MiddleBar";

function Home() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NavBar />
      <Box 
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          flex: 1,
        }}
      >
        <Sidebar type="shop" />
        <MiddleBar />
      </Box>
    </Box>
  );
}

export default Home;
