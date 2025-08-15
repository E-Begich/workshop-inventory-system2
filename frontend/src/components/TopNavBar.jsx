import React, { useState } from "react";
import { Navbar, Container, Nav, Badge, Dropdown, Button } from "react-bootstrap";
import { FaBell, FaEnvelope, FaBars } from "react-icons/fa";

const TopNavBar = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  // Dohvat korisničkih podataka iz localStorage
  const [user] = useState({
    Name: localStorage.getItem("Name") || "",
    Lastname: localStorage.getItem("Lastname") || "",
    Role: localStorage.getItem("Role") || "",
  });

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login"; // ili koristi navigate iz react-router
  };

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm px-4">
      <Container fluid>
        <Navbar.Brand className="fw-bold text-danger">ADMIN</Navbar.Brand>

        {/* Hamburger button za male ekrane */}
        <div className="d-lg-none ms-auto">
          <Button variant="light" onClick={() => setShowDropdown(!showDropdown)}>
            <FaBars />
          </Button>

          <Dropdown show={showDropdown} onToggle={() => setShowDropdown(!showDropdown)} align="end">
            <Dropdown.Menu>
              <Dropdown.Item className="d-flex align-items-center">
                <span className="me-2 text-muted">{user.Name} {user.Lastname}</span>
              </Dropdown.Item>
              <Dropdown.Item className="d-flex align-items-center">
                <FaBell className="me-2" />
                Notifications
                <Badge bg="danger" pill className="ms-auto">3+</Badge>
              </Dropdown.Item>
              <Dropdown.Item className="d-flex align-items-center">
                <FaEnvelope className="me-2" />
                Messages
                <Badge bg="danger" pill className="ms-auto">7</Badge>
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout}>
                Odjava
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        {/* Veći ekrani */}
        <Nav className="ms-auto d-none d-lg-flex align-items-center gap-4">
          <div className="position-relative">
            <FaBell size={18} />
            <Badge bg="danger" pill className="position-absolute top-0 start-100 translate-middle">3+</Badge>
          </div>

          <div className="position-relative">
            <FaEnvelope size={18} />
            <Badge bg="danger" pill className="position-absolute top-0 start-100 translate-middle">7</Badge>
          </div>

          <div className="vr" /> {/* Okomita linija */}

          <Dropdown align="end">
            <Dropdown.Toggle variant="light" id="dropdown-user" className="d-flex align-items-center">
              <span className="me-2 text-muted">{user.Name} {user.Lastname} ({user.Role})</span>
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={handleLogout}>Odjava</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default TopNavBar;
