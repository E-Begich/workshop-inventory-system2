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
import Sidebar from "./components/Sidebar";
import TopNavBar from "./components/TopNavBar";
import Login from "./pages/Login";

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
            <Route path="/homePage" element={<HomePage />} />
            <Route path="/getAllMaterial" element={<ShowMaterials />} />
            <Route path="/getAllSupplier" element={<ShowSupplier />} />
            <Route path="/getAllUsers" element={<ShowUser />} />
            <Route path="/getAllService" element={<ShowService />} />
            <Route path="/getAllClients" element={<ShowClient />} />
            <Route path="/addOffer" element={<CreateOffer />} />
            <Route path="/addReceipt" element={<CreateReceipt />} />
            <Route path="/showOffer" element={<ShowOffer />} />
            <Route path="/showReceipt" element={<ShowReceipt />} />
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
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
