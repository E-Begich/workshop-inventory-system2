import React, { useEffect, useState } from "react";
import { Table, Button, Spinner, Modal } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import api from "../api/api";
import { toast } from "react-toastify";

const ArhivedOffers = () => {
  const [offers, setOffers] = useState([]);
  const [clients, setClients] = useState([]);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedOfferId, setSelectedOfferId] = useState(null);

  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [offersRes, clientsRes, usersRes] = await Promise.all([
        api.get("/aplication/getArhivedOffers"),
        api.get("/aplication/getAllClients"),
        api.get("/aplication/getAllUsers"),
      ]);
      setOffers(offersRes.data);
      setClients(clientsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error(err);
      setError("Greška pri dohvaćanju arhiviranih ponuda");
    } finally {
      setLoading(false);
    }
  };

  const getClientType = (id) => clients.find(c => c.ID_client === id)?.TypeClient || "Nepoznato";
  const getClientName = (id) => {
    const c = clients.find(c => c.ID_client === id);
    if (!c) return "Nepoznato";
    return c.TypeClient === "Tvrtka" ? c.Name : c.ContactName;
  };
  const getUserName = (id) => users.find(u => u.ID_user === id)?.Name || "Nepoznat";
  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}.${d.getFullYear()}`;
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/aplication/deleteOffer/${id}`);
      setOffers(prev => prev.filter(offer => offer.ID_offer !== id));
      toast.success("Ponuda obrisana.");
    } catch (err) {
      console.error(err);
      toast.error("Greška pri brisanju ponude.");
    }
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  };

  let sortedOffers = [...offers];
  if (sortConfig.key) {
    sortedOffers.sort((a, b) => {
      let aVal, bVal;

      switch (sortConfig.key) {
        case "Client.TypeClient":
          aVal = getClientType(a.ID_client);
          bVal = getClientType(b.ID_client);
          break;
        case "Client.Name":
          aVal = getClientName(a.ID_client);
          bVal = getClientName(b.ID_client);
          break;
        case "User.Name":
          aVal = getUserName(a.ID_user);
          bVal = getUserName(b.ID_user);
          break;
        default:
          aVal = a[sortConfig.key];
          bVal = b[sortConfig.key];
      }

      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }

  if (loading) return <Spinner animation="border" className="m-3" />;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Arhivirane ponude</h2>
      {sortedOffers.length === 0 ? (
        <p className="text-muted">Nema arhiviranih ponuda.</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              {[
                { label: "Broj ponude", key: "ID_offer" },
                { label: "Vrsta klijenta", key: "Client.TypeClient" },
                { label: "Klijent", key: "Client.Name" },
                { label: "Datum kreiranja", key: "DateCreate" },
                { label: "Datum isteka", key: "DateEnd" },
                { label: "Cijena (s PDV)", key: "PriceTax" },
                { label: "Ponudu kreirao", key: "User.Name" }
              ].map(({ label, key }) => (
                <th key={key} style={{ cursor: "pointer" }} onClick={() => handleSort(key)}>
                  {label} <span style={{ color: sortConfig.key === key ? "black" : "#ccc" }}>
                    {sortConfig.key === key ? (sortConfig.direction === "asc" ? "▲" : "▼") : "▲▼"}
                  </span>
                </th>
              ))}
              <th>Akcije</th>
            </tr>
          </thead>
          <tbody>
            {sortedOffers.map(offer => (
              <tr key={offer.ID_offer} className="text-muted" style={{ backgroundColor: "#f5f5f5" }}>
                <td>{offer.ID_offer}</td>
                <td>{getClientType(offer.ID_client)}</td>
                <td>{getClientName(offer.ID_client)}</td>
                <td>{formatDate(offer.DateCreate)}</td>
                <td>{formatDate(offer.DateEnd)}</td>
                <td>{Number(offer.PriceTax).toFixed(2)} €</td>
                <td>{getUserName(offer.ID_user)}</td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      setSelectedOfferId(offer.ID_offer);
                      setShowDeleteConfirm(true);
                    }}
                  >
                    <FaTrash /> Obriši
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Potvrda brisanja</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Jeste li sigurni da želite obrisati ovu ponudu?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
            Odustani
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              handleDelete(selectedOfferId);
              setShowDeleteConfirm(false);
            }}
          >
            Obriši
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

export default ArhivedOffers;
