import './App.css';
import Footer from './components/Footer';
import Header from './components/Header';
import { BrowserRouter as Router } from "react-router-dom";
import AppRouter from './Router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <Router>
        <Header />
        <AppRouter />
      </Router>
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
