import React, { useEffect, useState } from "react";
import { Table, Button, Spinner } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";

const ArhivedOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchArhivedOffers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/aplication/getArhivedOffers", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) throw new Error("Greška pri dohvaćanju arhiviranih ponuda");
      const data = await res.json();
      setOffers(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Jeste li sigurni da želite obrisati ovu ponudu?")) return;

    try {
      const res = await fetch(`/api/aplication/deleteOffer/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) throw new Error("Greška pri brisanju ponude");

      setOffers(offers.filter((offer) => offer.ID_offer !== id));
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchArhivedOffers();
  }, []);

  if (loading) return <Spinner animation="border" className="m-3" />;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Arhivirane ponude</h2>
      {offers.length === 0 ? (
        <p className="text-muted">Nema arhiviranih ponuda.</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Naziv</th>
              <th>Klijent</th>
              <th>Datum kreiranja</th>
              <th>Vrijedi do</th>
              <th>Akcije</th>
            </tr>
          </thead>
          <tbody>
            {offers.map((offer) => (
              <tr key={offer.ID_offer} className="text-muted" style={{ backgroundColor: "#f5f5f5" }}>
                <td>{offer.ID_offer}</td>
                <td>{offer.Title}</td>
                <td>{offer.ClientName}</td>
                <td>{new Date(offer.CreatedAt).toLocaleDateString()}</td>
                <td>{new Date(offer.ValidUntil).toLocaleDateString()}</td>
                <td>
                  {/* disabled gumbi */}
                  <Button variant="secondary" size="sm" disabled className="me-2">
                    Pregled
                  </Button>
                  <Button variant="secondary" size="sm" disabled className="me-2">
                    Uredi
                  </Button>
                  {/* jedini aktivan gumb */}
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(offer.ID_offer)}
                  >
                    <FaTrash /> Obriši
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default ArhivedOffers;
