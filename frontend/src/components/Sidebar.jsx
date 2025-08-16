// src/components/Sidebar.jsx
import React, { useState } from "react";
import './Sidebar.css';
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap"; // Dodano

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [isIzradaOpen, setIsIzradaOpen] = useState(false);
  const toggleIzrada = () => setIsIzradaOpen(!isIzradaOpen);

  const [isPovijestOpen, setIsPovijestOpen] = useState(false);
  const togglePovijest = () => setIsPovijestOpen(!isPovijestOpen);

  return (
    <>
      {/* Hamburger gumb */}
      <Button
        variant="danger"
        className="d-md-none m-2"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        <i className="fas fa-bars" />
      </Button>

      <div
        className={`sidebar d-flex flex-column text-white vh-100 p-3 ${isOpen ? "sidebar-open" : ""}`}
      >
        <h4 className="mb-4">Ovdje ide logo</h4>

        <ul className="nav nav-pills flex-column mb-auto">
          <li className="nav-item mb-2">
            <Link to="/homePage" className="nav-link text-white">
              <i className="fas fa-tachometer-alt me-2" />
              Početna
            </Link>
          </li>

          <li className="nav-item mb-2">
            <Link to="/getAllUsers" className="nav-link text-white">
              <i className="fas fa-folder me-2" />
              Korisnici - zaposlenici
            </Link>
          </li>

          <li className="nav-item mb-2">
            <Link to="/getAllClients" className="nav-link text-white">
              <i className="fas fa-folder me-2" />
              Klijenti
            </Link>
          </li>

          <li className="nav-item mb-2">
            <Link to="/getAllMaterial" className="nav-link text-white">
              <i className="fas fa-folder me-2" />
              Materijali
            </Link>
          </li>

          <li className="nav-item mb-2">
            <Link to="/getAllSupplier" className="nav-link text-white">
              <i className="fas fa-folder me-2" />
              Dobavljači
            </Link>
          </li>

          <li className="nav-item mb-2">
            <Link to="/getAllService" className="nav-link text-white">
              <i className="fas fa-folder me-2" />
              Usluge
            </Link>
          </li>

          {/* Izrada dropdown */}
          <li className="nav-item mb-2">
            <Button
              variant="link"
              className="text-white bg-transparent border-0 w-100 text-start d-flex justify-content-between align-items-center"
              onClick={toggleIzrada}
            >
              <span>
                <i className="fas fa-folder me-2" />
                Izrada
              </span>
              <i className={`fas fa-chevron-${isIzradaOpen ? "up" : "down"}`} />
            </Button>

            {isIzradaOpen && (
              <ul className="nav flex-column ms-3">
                <li className="nav-item mb-1">
                  <Link to="/addOffer" className="nav-link text-white">
                    <i className="fas fa-file-alt me-2" />
                    Izrada ponude
                  </Link>
                </li>
                <li className="nav-item mb-1">
                  <Link to="/addReceipt" className="nav-link text-white">
                    <i className="fas fa-file-invoice-dollar me-2" />
                    Izrada računa
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Povijest dropdown */}
          <li className="nav-item mb-2">
            <Button
              variant="link"
              className="text-white bg-transparent border-0 w-100 text-start d-flex justify-content-between align-items-center"
              onClick={togglePovijest}
            >
              <span>
                <i className="fas fa-folder me-2" />
                Povijest
              </span>
              <i className={`fas fa-chevron-${isPovijestOpen ? "up" : "down"}`} />
            </Button>

            {isPovijestOpen && (
              <ul className="nav flex-column ms-3">
                <li className="nav-item mb-1">
                  <Link to="/showOffer" className="nav-link text-white">
                    <i className="fas fa-history me-2" />
                    Povijest ponuda
                  </Link>
                </li>
                <li className="nav-item mb-1">
                  <Link to="/showReceipt" className="nav-link text-white">
                    <i className="fas fa-receipt me-2" />
                    Povijest računa
                  </Link>
                </li>
              </ul>
            )}
          </li>

          <li className="nav-item mb-2">
            <Link to="/showWarehouseChange" className="nav-link text-white">
              <i className="fas fa-folder me-2" />
              Aktivnosti
            </Link>
          </li>
        </ul>

        {/* Dugme za zatvaranje sidebar-a */}
        <Button
          variant="light"
          className="rounded-circle sidebar-close-btn d-md-none"
          onClick={toggleSidebar}
          aria-label="Close sidebar"
        >
          &times;
        </Button>
      </div>
    </>
  );
};

export default Sidebar;
