import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Table, InputGroup, FormControl } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../api/api';


const ShowSuppliers = () => {
  const [selectedSupplierId, setSelectedSupplierId] = useState(null);
  const [type, setType] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [searchContactName, setSearchContactName] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const suppliersPerPage = 30;


  const [formData, setFormData] = useState({
    Type: '',
    Name: '',
    PersonalNumber: '',
    ContactName: '',
    Contact: '',
    Email: '',
    Address: '',
    City: '',
    PostalCode: '',
    Country: ''
  });

  useEffect(() => {
    fetchSuppliers();
    fetchType();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await api.get('/aplication/getAllSupplier');
      setSuppliers(res.data);
    } catch (error) {
      console.error('Greška pri dohvaćanju dobavljača', error);
    }
  };

  const fetchType = async () => {
    try {
      const res = await api.get('/aplication/getTypeEnum');
      setType(res.data);
    } catch (error) {
      console.error('Greška pri dohvaćanju tipa klijenta', error);
    }
  };

  const validateForm = (data) => {
    if (!data.Type) {
      showError('Unesite Vrstu dobavljača.');
      return false;
    }
    // Tip Tvrtka - provjera Naziva i OIB-a
    if (data.TypeClient === 'Tvrtka') {
      if (!formData.Name || formData.Name.trim() === '') {
        showError("Naziv tvrtke je obavezan.");
        return false;
      }
      if (!data.PersonalNumber || !/^\d{11}$/.test(formData.PersonalNumber)) {
        showError("OIB mora sadržavati točno 11 brojeva.");
        return false;
      }
    }
    if (!data.ContactName) {
      showError('Unesite ime i prezime.');
      return false;
    }
    if (!data.Contact) {
      showError('Unesite kontakt.');
      return false;
    }
    if (!data.Email) {
      showError('Unesite email.');
      return false;
    }
    // provjera valjanosti emaila
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.Email)) {
      showError('Email mora biti u ispravnom formatu (npr. korisnik@example.com).');
      return false;
    }
    if (!data.Address) {
      showError('Odaberite adresu.');
      return false;
    }
    if (!data.City) {
      showError('Odaberite grad.');
      return false;
    }
    if (!data.PostalCode) {
      showError('Odaberite poštanski broj.');
      return false;
    }
    if (!data.Country) {
      showError('Odaberite Državu.');
      return false;
    }
    return true;
  };


  let errorToastId = null;

  const showError = (msg) => {
    if (errorToastId && toast.isActive(errorToastId)) return;

    errorToastId = toast.error(msg, {
      autoClose: 3000,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    });

    return errorToastId;
  };


  const handleAddSupplier = async () => {
    if (!validateForm(formData)) return;
    try {
      await api.post('/aplication/addSupplier', formData);
      setShowModal(false);
      fetchSuppliers();
      toast.success('Dobavljač uspješno dodan!');
      setFormData({
        Type: '',
        Name: '',
        PersonalNumber: '',
        ContactName: '',
        Contact: '',
        Email: '',
        Address: '',
        City: '',
        PostalCode: '',
        Country: ''
      })
    } catch (error) {
      console.error('Greška prilikom dodavanja dobavljača', error);
      toast.error('Greška prilikom dodavanja!');
    }
  };

  const handleEditSupplier = async () => {
    if (!validateForm(formData)) return;
    try {
      await api.put(`/aplication/updateSupplier/${selectedSupplierId}`, formData);
      setShowModal(false);
      fetchSuppliers();
      toast.success('Dobavljač ažuriran!');
      setFormData({
        Type: '',
        Name: '',
        PersonalNumber: '',
        ContactName: '',
        Contact: '',
        Email: '',
        Address: '',
        City: '',
        PostalCode: '',
        Country: ''
      })
      resetForm();
      setIsEditing(false);
      setSelectedSupplierId(null);
    } catch (error) {
      console.error('Greška prilikom ažuriranja', error);
      toast.error('Greška prilikom ažuriranja!');
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/aplication/deleteSupplier/${deleteId}`);
      setShowDeleteConfirm(false);
      fetchSuppliers();
      toast.success('Dobavljač je uspješno obrisan!');
    } catch (error) {
      console.error('Greška prilikom brisanja', error);
      toast.error('Greška prilikom brisanja!');
    }
  };

  const resetForm = () => {
    setFormData({
      Type: '',
      Name: '',
      PersonalNumber: '',
      ContactName: '',
      Contact: '',
      Email: '',
      Address: '',
      City: '',
      PostalCode: '',
      Country: ''
    });
  };

  const openEditModal = (supplier) => {
    setIsEditing(true);
    setSelectedSupplierId(supplier.ID_supplier);
    setFormData({
      Type: supplier.Type || '',
      Name: supplier.Name || '',
      PersonalNumber: supplier.PersonalNumber || '',
      ContactName: supplier.ContactName || '',
      Contact: supplier.Contact || '',
      Email: supplier.Email || '',
      Address: supplier.Address || '',
      City: supplier.City || '',
      PostalCode: supplier.PostalCode || '',
      Country: supplier.Country || ''
    })
    setShowModal(true);
  };


 const sortedSuppliers = [...suppliers].filter((m) =>
  (m.Name || "").toLowerCase().includes(searchName.toLowerCase()) &&
  (m.ContactName || "").toLowerCase().includes(searchContactName.toLowerCase())
);

if (sortConfig.key) {
  sortedSuppliers.sort((a, b) => {
    const aVal = a[sortConfig.key] ?? ""; // fallback ako je null/undefined
    const bVal = b[sortConfig.key] ?? "";

    if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });
}

const indexOfLast = currentPage * suppliersPerPage;
const indexOfFirst = indexOfLast - suppliersPerPage;
const currentSuppliers = sortedSuppliers.slice(indexOfFirst, indexOfLast);
const totalPages = Math.ceil(sortedSuppliers.length / suppliersPerPage);

const handleSort = (key) => {
  let direction = "asc";
  if (sortConfig.key === key && sortConfig.direction === "asc") {
    direction = "desc";
  }
  setSortConfig({ key, direction });
};


  return (
    <div className="container px-3 mt-4">
      {/* Naslov i gumb */}
      <div className="row align-items-center mb-3">
        <div className="col-12 col-md">
          <h2 className="mb-0">Dobavljači</h2>
        </div>
        <div className="col-12 col-md-auto mt-2 mt-md-0 text-md-end">
          <Button
            variant="danger" onClick={() => {
              setFormData({
                Type: '',
                Name: '',
                PersonalNumber: '',
                ContactName: '',
                Contact: '',
                Email: '',
                Address: '',
                City: '',
                PostalCode: '',
                Country: ''
              })
              resetForm();
              setIsEditing(false);
              setShowModal(true);
            }}
          >
            Dodaj dobavljača
          </Button>
        </div>
      </div>

      {/* Filteri (pretraga) */}
      <div className="row g-3 mb-3">
        <div className="col-12 col-md-6 col-lg-4">
          <InputGroup>
            <FormControl
              placeholder="Pretraga po nazivu"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
          </InputGroup>
        </div>
        <div className="col-12 col-md-6 col-lg-4">
          <InputGroup>
            <FormControl
              placeholder="Pretraga po kontakt osobi"
              value={searchContactName}
              onChange={(e) => setSearchContactName(e.target.value)}
            />
          </InputGroup>
        </div>
      </div>


      <div className="table-responsive">
        <Table striped bordered hover size="sm" className="mb-3">
          <thead>
            <tr>
              {[
                { label: 'ID', key: 'ID_supplier' },
                { label: 'Vrsta klijenta', key: 'Type' },
                { label: 'Naziv', key: 'Name' },
                { label: 'OIB', key: 'PersonalNumber' },
                { label: 'Kontakt osoba', key: 'ContactName' },
                { label: 'Kontakt', key: 'Contact' },
                { label: 'Email', key: 'Email' },
                { label: 'Adresa', key: 'Address' },
                { label: 'Grad', key: 'City' },
                { label: 'Poštanski broj', key: 'PostalCode' },
                { label: 'Država', key: 'Country' },
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
            {currentSuppliers.map(mat => (
              <tr key={mat.ID_supplier}>
                <td>{mat.ID_supplier}</td>
                <td>{mat.Type}</td>
                <td>{mat.Name}</td>
                <td>{mat.PersonalNumber}</td>
                <td>{mat.ContactName}</td>
                <td>{mat.Contact}</td>
                <td>{mat.Email}</td>
                <td>{mat.Address}</td>
                <td>{mat.City}</td>
                <td>{mat.PostalCode}</td>
                <td>{mat.Country}</td>

                <td style={{ whiteSpace: 'nowrap' }}>
                  <Button variant="warning" size="sm" className="me-2" onClick={() => openEditModal(mat)}>Uredi</Button>
                  <Button variant="danger" size="sm" onClick={() => {
                    setDeleteId(mat.ID_supplier);
                    setShowDeleteConfirm(true);
                  }}>
                    Obriši
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table >
      </div >

      {/* PAGINATION */}
      <div className="row align-items-center mt-3 px-2">
        <div className="col-12 col-md-6 mb-2 mb-md-0">
          Prikazuje se {sortedSuppliers.length === 0 ? 0 : indexOfFirst + 1} - {Math.min(indexOfLast, sortedSuppliers.length)} od {sortedSuppliers.length} dobavljača
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
          <span className="align-middle mx-2">Stranica {currentPage} / {totalPages}</span>
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

      {/* MODAL ZA DODAVANJE/UREĐIVANJE */}
      < Modal show={showModal} onHide={() => {
        setShowModal(false);
        resetForm();
        setFormData({
          Type: '',
          Name: '',
          PersonalNumber: '',
          ContactName: '',
          Contact: '',
          Email: '',
          Address: '',
          City: '',
          PostalCode: '',
          Country: ''
        })
        setIsEditing(false);
        setSelectedSupplierId(null);
      }}
      >
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Uredi dobavljača' : 'Dodaj dobavljača'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Tip dobavljača</Form.Label>
              <Form.Select
                value={formData.Type}
                onChange={(e) => {
                  const selectedType = e.target.value;
                  setFormData(prev => ({
                    ...prev,
                    Type: selectedType,
                    Name: selectedType === 'Tvrtka' ? '' : prev.Name,  // opcionalno: očisti Name
                  }));
                }}
              >
                <option value="">Odaberi tip dobavljača</option>
                {type.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group>
              <Form.Label>Naziv</Form.Label>
              <Form.Control
                type="text"
                value={formData.Name}
                onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
                disabled={formData.Type !== 'Tvrtka'}  // ✅ samo tvrtke mogu unositi
                placeholder={formData.Type !== 'Tvrtka' ? 'Nije potrebno za fizičku osobu' : ''}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>OIB</Form.Label>
              <Form.Control
                type="text"
                maxLength={11}
                value={formData.PersonalNumber}
                onChange={(e) => setFormData({ ...formData, PersonalNumber: e.target.value })}
                disabled={formData.Type !== 'Tvrtka'} // ✅ isto kao iznad
                placeholder={formData.Type !== 'Tvrtka' ? 'Nije potrebno za fizičku osobu' : ''}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Ime i prezime osobe</Form.Label>
              <Form.Control
                type="text"
                value={formData.ContactName}
                onChange={(e) => setFormData({ ...formData, ContactName: e.target.value })}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Kontakt broj</Form.Label>
              <Form.Control
                type="text"
                value={formData.Contact}
                onChange={(e) => setFormData({ ...formData, Contact: e.target.value })}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                value={formData.Email}
                onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Ulica i broj</Form.Label>
              <Form.Control
                type="text"
                value={formData.Address}
                onChange={(e) => setFormData({ ...formData, Address: e.target.value })}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Grad</Form.Label>
              <Form.Control
                type="text"
                value={formData.City}
                onChange={(e) => setFormData({ ...formData, City: e.target.value })}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Poštanski broj</Form.Label>
              <Form.Control
                type="text"
                value={formData.PostalCode}
                onChange={(e) => setFormData({ ...formData, PostalCode: e.target.value })}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Država</Form.Label>
              <Form.Control
                type="text"
                value={formData.Country}
                onChange={(e) => setFormData({ ...formData, Country: e.target.value })}
              />
            </Form.Group>

          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Zatvori</Button>
          <Button variant="success" onClick={isEditing ? handleEditSupplier : handleAddSupplier}>
            {isEditing ? 'Spremi izmjene' : 'Spremi'}
          </Button>
        </Modal.Footer>
      </Modal >

      {/* MODAL ZA POTVRDU BRISANJA */}
      < Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Potvrda brisanja</Modal.Title>
        </Modal.Header>
        <Modal.Body>Jeste li sigurni da želite obrisati ovog dobavljača?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>Odustani</Button>
          <Button variant="danger" onClick={handleDelete}>Obriši</Button>
        </Modal.Footer>
      </Modal >

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar newestOnTop />
    </div >
  );
};

export default ShowSuppliers;
