import { useEffect, useState } from 'react';

export default function WarehouseChangeList() {
  const [changes, setChanges] = useState([]);
  const [filterType, setFilterType] = useState(''); // ObjectType filter

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

  const filteredChanges = changes.filter(c =>
    filterType ? c.ObjectType === filterType : true
  );

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Pregled Promjena</h1>
      <hr />
      <div className="mb-4">
        <label className="mr-2">Filtriraj po tipu entiteta: </label>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border p-1 rounded"
        >
          <option value="">Svi</option>
          <option value="Materijal">Materijal</option>
          <option value="Ponuda">Ponuda</option>
          <option value="Racun">Racun</option>
          <option value="Klijent">Klijent</option>
          <option value="Dobavljac">Dobavljac</option>
        </select>
      </div>

      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">Datum</th>
            <th className="border px-2 py-1">Korisnik</th>
            <th className="border px-2 py-1">Tip akcije</th>
            <th className="border px-2 py-1">Entitet</th>
            <th className="border px-2 py-1">ID Entiteta</th>
            <th className="border px-2 py-1">Materijal</th>
            <th className="border px-2 py-1">Količina</th>
            <th className="border px-2 py-1">Napomena</th>
          </tr>
        </thead>
        <tbody>
          {filteredChanges.map((c) => (
            <tr key={c.ID_change} className="hover:bg-gray-50">
              <td className="border px-2 py-1">{new Date(c.ChangeDate).toLocaleString()}</td>
              <td className="border px-2 py-1">{c.User?.Name || c.ID_user}</td>
              <td className="border px-2 py-1">{c.ActionType}</td>
              <td className="border px-2 py-1">{c.ObjectType}</td>
              <td className="border px-2 py-1">{c.ObjectID}</td>
              <td className="border px-2 py-1">{c.materialName || c.Material?.NameMaterial || '-'}</td>
              <td className="border px-2 py-1">{c.Amount ?? '-'}</td>
              <td className="border px-2 py-1">{c.Note || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
