
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import RegisterPage from '../src/pages/Register';
import LoginForm from './pages/login';
import Home from './pages/Home';
// import LoginPage from './LoginPage'; // Create this component similarly

const App = () => {
  return (
    <Router>
      <CssBaseline />
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/Home" element={<Home/>} />
      </Routes>
    </Router> 
  );
};

export default App;
