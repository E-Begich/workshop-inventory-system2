import { useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';


const ShowWarehouseChange = () => {
  const [changes, setChanges] = useState([]);
  const [filterType, setFilterType] = useState(''); // ObjectType filter
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 15;

  useEffect(() => {
    async function fetchChanges() {
      try {
        const token = localStorage.getItem("token"); // uzmi token iz localStorage
        const res = await fetch('/api/aplication/getAllChanges', {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // dodaj token
          }
        });

        if (!res.ok) {
          throw new Error(`HTTP greška! status: ${res.status}`);
        }

        const data = await res.json();
        // osiguraj da je data niz
        setChanges(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Greška pri učitavanju promjena:', err);
      }
    }

    fetchChanges();
  }, []);

  // filter
  const filteredChanges = changes.filter((c) =>
    filterType ? c.ObjectType === filterType : true
  );

  // sort
  if (sortConfig.key) {
    filteredChanges.sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // paginacija
  const indexOfLast = currentPage * logsPerPage;
  const indexOfFirst = indexOfLast - logsPerPage;
  const currentChanges = filteredChanges.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredChanges.length / logsPerPage);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };


  return (
  <div className="container px-3 mt-4">
    {/* Naslov */}
    <div className="row align-items-center mb-3">
      <div className="col-12 col-md">
        <h2 className="mb-0">Pregled promjena</h2>
      </div>
    </div>

    {/* Filteri */}
    <div className="row g-3 mb-3">
      <div className="col-12 col-md-6 col-lg-4">
        <label className="form-label">Filtriraj po tipu entiteta:</label>
        <select
          value={filterType}
          onChange={(e) => {
            setFilterType(e.target.value);
            setCurrentPage(1);
          }}
          className="form-select"
        >
          <option value="">Svi</option>
          <option value="Materijal">Materijal</option>
          <option value="Ponuda">Ponuda</option>
          <option value="Racun">Račun</option>
          <option value="Klijent">Klijent</option>
          <option value="Dobavljac">Dobavljač</option>
        </select>
      </div>
    </div>

    {/* TABLICA */}
    <div className="table-responsive">
      <Table striped bordered hover size="sm" className="mb-3">
        <thead>
          <tr>
            {[
              { label: 'Datum', key: 'ChangeDate' },
              { label: 'Korisnik', key: 'ID_user' },
              { label: 'Akcija', key: 'ActionType' },
              { label: 'Entitet', key: 'ObjectType' },
              { label: 'ID', key: 'ObjectID' },
              { label: 'Naziv/broj', key: 'EntityName' },
              { label: 'Dodatno', key: 'Amount' },
              { label: 'Napomena', key: 'Note' },
            ].map(({ label, key }) => (
              <th
                key={key}
                onClick={() => handleSort(key)}
                style={{ cursor: 'pointer' }}
              >
                {label}{' '}
                <span style={{ color: sortConfig.key === key ? 'black' : '#ccc' }}>
                  {sortConfig.key === key
                    ? sortConfig.direction === 'asc'
                      ? '▲'
                      : '▼'
                    : '▲▼'}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentChanges.map((c) => (
            <tr key={c.ID_change}>
              <td>{new Date(c.ChangeDate).toLocaleString()}</td>
              <td>{c.User?.Name || c.ID_user}</td>
              <td>{c.ActionType}</td>
              <td>{c.ObjectType}</td>
              <td>{c.ObjectID}</td>
              <td>{c.EntityName || '-'}</td>
              <td>{c.Amount ?? '-'}</td>
              <td>{c.Note || '-'}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>

    {/* PAGINACIJA */}
    <div className="row align-items-center mt-3 px-2">
      <div className="col-12 col-md-6 mb-2 mb-md-0">
        Prikazuje se {filteredChanges.length === 0 ? 0 : indexOfFirst + 1} -{' '}
        {Math.min(indexOfLast, filteredChanges.length)} od {filteredChanges.length} promjena
      </div>
      <div className="col-12 col-md-6 text-md-end">
        <Button
          variant="secondary"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => prev - 1)}
          className="me-2"
        >
          Prethodna
        </Button>
        <span className="align-middle mx-2">
          Stranica {currentPage} / {totalPages}
        </span>
        <Button
          variant="secondary"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(prev => prev + 1)}
          className="ms-2"
        >
          Sljedeća
        </Button>
      </div>
    </div>
  </div>
);
 };
 export default ShowWarehouseChange;
