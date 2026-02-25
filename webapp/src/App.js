import './App.css';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Reviews from './pages/Reviews';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
  
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from './components/Header';


function App() {
  return (
    <>
      <Router>
      <Header />
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
      </Router>
      <Footer />
    </>
  );
}

export default App;
