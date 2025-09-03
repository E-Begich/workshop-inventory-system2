import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomePage from './pages/HomePage';
import ShowMaterials from './pages/ShowMaterials';
import ShowSupplier from './pages/ShowSupplier';
import ShowUser from './pages/ShowUser';
import ShowService from './pages/ShowService';
import CreateOffer from './pages/CreateOffer';
import CreateReceipt from './pages/CreateReceipt';
import ShowClient from './pages/ShowClient';
import ShowOffer from './pages/ShowOffer';
import ShowReceipt from './pages/ShowReceipt';
import ShowWarehouseChange from './pages/ShowWarehouseChange';
import Sidebar from "./components/Sidebar";
import TopNavBar from "./components/TopNavBar";
import Login from "./pages/Login";
import ArhivedOffers from "./pages/ArhivedOffers";
import PrivateRoute from "./components/PrivateRoute";  // koristimo PrivateRoute
import { jwtDecode } from "jwt-decode";


const Layout = ({ sidebarOpen, toggleSidebar }) => {
  return (
    <div className="d-flex">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div
        className="flex-grow-1"
        style={{
          marginLeft: sidebarOpen && window.innerWidth >= 768 ? "250px" : "0",
          minHeight: "100vh",
          transition: "margin-left 0.3s ease"
        }}
      >
        <TopNavBar />
        <div className="p-4" style={{ paddingTop: "80px" }}>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Sve rute koje traže login */}
            <Route path="/homePage" element={ <PrivateRoute> <HomePage /> </PrivateRoute> } />
            <Route path="/getAllMaterial" element={ <PrivateRoute> <ShowMaterials /> </PrivateRoute> }/>
            <Route path="/getAllSupplier" element={ <PrivateRoute> <ShowSupplier /> </PrivateRoute> } />
            <Route path="/getAllUsers" element={ <PrivateRoute> <ShowUser /> </PrivateRoute> } />
            <Route path="/getAllService" element={ <PrivateRoute> <ShowService /> </PrivateRoute> } />
            <Route path="/getAllClients" element={ <PrivateRoute> <ShowClient /> </PrivateRoute> } />
            <Route path="/addOffer" element={ <PrivateRoute> <CreateOffer /> </PrivateRoute> }/>
            <Route path="/addReceipt" element={ <PrivateRoute> <CreateReceipt /> </PrivateRoute> } />
            <Route path="/showOffer" element={ <PrivateRoute> <ShowOffer /> </PrivateRoute> } />
            <Route path="/showReceipt" element={ <PrivateRoute> <ShowReceipt /> </PrivateRoute> } />
            <Route path="/getArhivedOffers" element={ <PrivateRoute> <ArhivedOffers /> </PrivateRoute> } />
            <Route path="/showWarehouseChange" element={ <PrivateRoute> <ShowWarehouseChange /> </PrivateRoute> } />
          </Routes>
        </div>
      </div>
    </div>
  );
};

const AppWrapper = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Provjera isteka tokena
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const now = Date.now() / 1000; // sekunde

        if (decoded.exp < now) {
          alert("Prijava je istekla. Molimo prijavite se ponovno.");
          localStorage.removeItem("token");
          window.location.href = "/login"; // hard redirect
        }
      } catch (err) {
        console.error("Neispravan token:", err);
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
  }, [location]);

  // Ako smo na login stranici, ne prikazuj sidebar i navbar, samo login
  if (location.pathname === '/login') {
    return (
      <>
        <Login />
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar newestOnTop />
      </>
    );
  }

  return (
    <>
      <Layout sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar newestOnTop />
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
};

export default App;
