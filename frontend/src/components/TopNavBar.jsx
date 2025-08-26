import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Navbar, Container, Nav, Badge, Dropdown, Button } from "react-bootstrap";
import { FaBell, FaBars } from "react-icons/fa";

const TopNavBar = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();

  const [user] = useState({
    Name: localStorage.getItem("Name") || "",
    Lastname: localStorage.getItem("Lastname") || "",
    Role: localStorage.getItem("Role") || "",
  });

  const [unreadLogs, setUnreadLogs] = useState([]);

  const fetchUnreadLogs = async () => {
    try {
      const res = await fetch("/api/aplication/getUnreadActivityLogs", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error("Greška pri dohvaćanju nepročitanih logova");
      const data = await res.json();
      setUnreadLogs(data);
    } catch (err) {
      console.error(err);
    }
  };

  const markAsRead = async () => {
    try {
      const res = await fetch("/api/aplication/markLogsAsRead", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        await fetchUnreadLogs(); // refresh liste i badge-a
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUnreadLogs();
  }, []);

  const formatLog = (log) => {
    return `${log.ActionType} - ${log.EntityName || log.ObjectType}`;
  };

  useEffect(() => {
    fetchUnreadLogs();
    const interval = setInterval(fetchUnreadLogs, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm px-4">
      <Container fluid>
        <Navbar.Brand className="fw-bold text-danger">
          {user.Role === "admin" ? "ADMIN" : "ZAPOSLENIK"}
        </Navbar.Brand>
        {/* Hamburger za male ekrane */}
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
                Nepročitane aktivnosti
                <Badge bg="danger" pill className="ms-auto">{unreadLogs.length}</Badge>
              </Dropdown.Item>

              <Dropdown.Divider />

              {unreadLogs.length > 0 ? (
                unreadLogs.map((log) => (
                  <Dropdown.Item key={log.ID_change}>
                    {formatLog(log)} <br />
                    <small className="text-muted">{new Date(log.ChangeDate).toLocaleString()}</small>
                  </Dropdown.Item>
                ))
              ) : (
                <Dropdown.Item className="text-center text-muted">Nema novih logova</Dropdown.Item>
              )}

              {unreadLogs.length > 0 && (
                <>
                  <Dropdown.Divider />
                  <Dropdown.Item className="text-center text-primary" onClick={markAsRead}>
                    Označi sve kao pročitano
                  </Dropdown.Item>
                </>
              )}

              <Dropdown.Item onClick={handleLogout}>Odjava</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        {/* Veći ekrani */}
        <Nav className="ms-auto d-none d-lg-flex align-items-center gap-3">

          {/* Zvonce */}
          <Dropdown align="end">
            <Dropdown.Toggle variant="light" id="dropdown-bell" className="position-relative">
              <FaBell size={18} />
              {unreadLogs.length > 0 && (
                <Badge bg="danger" pill className="position-absolute top-0 start-100 translate-middle">
                  {unreadLogs.length}
                </Badge>
              )}
            </Dropdown.Toggle>

            <Dropdown.Menu style={{ minWidth: '300px' }}>
              {unreadLogs.length > 0 ? (
                unreadLogs.map((log) => (
                  <Dropdown.Item key={log.ID_change}>
                    {formatLog(log)} <br />
                    <small className="text-muted">{new Date(log.ChangeDate).toLocaleString()}</small>
                  </Dropdown.Item>
                ))
              ) : (
                <Dropdown.Item className="text-center text-muted">Nema novih logova</Dropdown.Item>
              )}
              {unreadLogs.length > 0 && (
                <>
                  <Dropdown.Divider />
                  <Dropdown.Item className="text-center text-primary" onClick={markAsRead}>
                    Označi sve kao pročitano
                  </Dropdown.Item>
                  <Dropdown.Item className="text-center text-primary" onClick={() => navigate("/showWarehouseChange")}>
                    Pogledaj sve aktivnosti
                  </Dropdown.Item>
                </>
              )}
            </Dropdown.Menu>
          </Dropdown>

          {/* Dropdown korisnika */}
          <Dropdown align="end">
            <Dropdown.Toggle variant="light" id="dropdown-user">
              {user.Name} {user.Lastname} ({user.Role})
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
