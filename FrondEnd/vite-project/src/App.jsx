
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import RegisterPage from '../src/pages/Register';
import LoginForm from './pages/login';
import Home from './pages/Home';
import StoreLoginForm from './pages/storeLogin';
import StoreRegisterForm from './pages/storeReg';
import StoreForm from './pages/CreateStore';
import CropImage from './components/CropImage';
import AdminHome from './pages/AdminHome';
// import LoginPage from './LoginPage'; // Create this component similarly

const App = () => {
  return (
    <Router>
      <CssBaseline />
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/Home" element={<Home/>} />
        <Route path="/adminhome" element={<AdminHome/>} />
        <Route path="/storeLogin" element={<StoreLoginForm/>} />
        <Route path="/storeRegister" element={<StoreRegisterForm/>} />
        <Route path="/storedatas" element={<StoreForm/>} />
        <Route path="/cropImage" element={<CropImage/>} />
      </Routes>
    </Router> 
  );
};

export default App;
