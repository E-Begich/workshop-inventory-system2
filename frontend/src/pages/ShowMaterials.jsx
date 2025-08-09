import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Table, InputGroup, FormControl } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const ShowMaterials = () => {
  const [selectedMaterialId, setSelectedMaterialId] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [location, setLocation] = useState([]);
  const [unit, setUnit] = useState([]);
  const [typeChange, setTypeChange] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    NameMaterial: '',
    CodeMaterial: '',
    Amount: '',
    Unit: '',
    Location: '',
    Description: '',
    MinAmount: '',
    PurchasePrice: '',
    SellingPrice: '',
    ID_supplier: '',
    TypeChange: ''
  });
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [searchNaziv, setSearchNaziv] = useState('');
  const [searchSifra, setSearchSifra] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const materialsPerPage = 30;

  useEffect(() => {
    fetchMaterials();
    fetchSuppliers();
    fetchLocation();
    fetchUnit();
    fetchTypeChange();
  }, []);

  const fetchMaterials = async () => {
    try {
      const res = await axios.get('/api/aplication/getAllMaterial');
      setMaterials(res.data);
    } catch (error) {
      console.error('Greška pri dohvaćanju dobavljača', error);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get('/api/aplication/getAllSupplier');
      setSuppliers(res.data);
    } catch (error) {
      console.error('Greška pri dohvaćanju dobavljača', error);
    }
  };

  const fetchLocation = async () => {
    try {
      const res = await axios.get('/api/aplication/getLocationEnum');
      setLocation(res.data);
    } catch (error) {
      console.error('Greška pri dohvaćanju Lokacije', error);
    }
  };

  const fetchUnit = async () => {
    try {
      const res = await axios.get('/api/aplication/getUnitEnum');
      setUnit(res.data);
    } catch (error) {
      console.error('Greška pri dohvaćanju Lokacije', error);
    }
  };

  const fetchTypeChange = async () => {
    try {
      const res = await axios.get('/api/aplication/getTypeChangeEnum');
      setTypeChange(res.data);
    } catch (error) {
      console.error('Greška pri dohvaćanju Lokacije', error);
    }
  };

  const getSupplierName = (id) => {
    const supplier = suppliers.find(s => s.ID_supplier === id);
    return supplier ? (supplier.Name || supplier.ContactName) : 'Nepoznato';
  };



  const handleAddMaterial = async () => {
    try {
      await axios.post('/api/aplication/addMaterial', formData);
      setShowModal(false);
      fetchMaterials();
      toast.success('Materijal uspješno dodan!');
      setFormData({
        NameMaterial: '',
        CodeMaterial: '',
        Amount: '',
        Unit: '',
        Location: '',
        Description: '',
        MinAmount: '',
        PurchasePrice: '',
        SellingPrice: '',
        ID_supplier: '',
        TypeChange: ''
      });
    } catch (error) {
      console.error('Greška prilikom dodavanja materijala', error);
      toast.error('Greška prilikom dodavanja!');
    }
  };


  const handleEditMaterial = async () => {
    try {
      await axios.put(`/api/aplication/updateMaterial/${selectedMaterialId}`, formData);
      setShowModal(false);
      fetchMaterials();
      toast.success('Materijal uspješno ažuriran!');
      setFormData({
        NameMaterial: '',
        CodeMaterial: '',
        Amount: '',
        Unit: '',
        Location: '',
        Description: '',
        MinAmount: '',
        PurchasePrice: '',
        SellingPrice: '',
        ID_supplier: '',
        TypeChange: ''
      });
      setIsEditing(false);
      setSelectedMaterialId(null);
    } catch (error) {
      console.error('Greška prilikom uređivanja materijala', error);
      toast.error('Greška prilikom uređivanja!');
    }
  };


  const handleDelete = async () => {
    try {
      await axios.delete(`/api/aplication/deleteMaterial/${deleteId}`);
      setShowDeleteConfirm(false);
      fetchMaterials();
      toast.success('Materijal uspješno obrisan!');
    } catch (error) {
      console.error('Greška prilikom brisanja', error);
      toast.error('Greška prilikom brisanja!');
    }
  };

  const openEditModal = (material) => {
    setIsEditing(true);
    setSelectedMaterialId(material.ID_material);
    setFormData({
      NameMaterial: material.NameMaterial || '',
      CodeMaterial: material.CodeMaterial || '',
      Amount: material.Amount || '',
      Unit: material.Unit || '',
      Location: material.Location || '',
      Description: material.Description || '',
      MinAmount: material.MinAmount || '',
      PurchasePrice: material.PurchasePrice || '',
      SellingPrice: material.SellingPrice || '',
      ID_supplier: material.ID_supplier || '',
      TypeChange: material.TypeChange || ''
    });
    setShowModal(true);
  };

  const sortedMaterials = [...materials].filter((m) =>
    m.NameMaterial.toLowerCase().includes(searchNaziv.toLowerCase()) &&
    m.CodeMaterial.toLowerCase().includes(searchSifra.toLowerCase())
  );

  if (sortConfig.key) {
    sortedMaterials.sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  const indexOfLast = currentPage * materialsPerPage;
  const indexOfFirst = indexOfLast - materialsPerPage;
  const currentMaterials = sortedMaterials.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sortedMaterials.length / materialsPerPage);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="container-fluid px-2 mt-4">
      {/* Naslov i gumb */}
      <div className="row align-items-center mb-3">
        <div className="col-12 col-md">
          <h2 className="mb-0">Materijali</h2>
        </div>
        <div className="col-12 col-md-auto mt-2 mt-md-0 text-md-end">
          <Button variant="danger" onClick={() => {
            setFormData({
              NameMaterial: '',
              CodeMaterial: '',
              Amount: '',
              Unit: '',
              Location: '',
              Description: '',
              MinAmount: '',
              PurchasePrice: '',
              SellingPrice: '',
              ID_supplier: '',
              TypeChange: ''
            });
            setIsEditing(false);
            setShowModal(true);
          }}>
            Dodaj materijal
          </Button>
        </div>
      </div>

      {/* Filteri (pretraga) */}
      <div className="row g-3 mb-3">
        <div className="col-12 col-md-6 col-lg-4">
          <InputGroup>
            <FormControl
              placeholder="Pretraga po nazivu"
              value={searchNaziv}
              onChange={(e) => setSearchNaziv(e.target.value)}
            />
          </InputGroup>
        </div>
        <div className="col-12 col-md-6 col-lg-4">
          <InputGroup>
            <FormControl
              placeholder="Pretraga po šifri"
              value={searchSifra}
              onChange={(e) => setSearchSifra(e.target.value)}
            />
          </InputGroup>
        </div>
      </div>

      <div className="table-responsive">
        <Table striped bordered hover size="sm" className="mb-3">
          <thead>
            <tr>
              {[
                { label: 'ID', key: 'ID_material' },
                { label: 'Naziv', key: 'NameMaterial' },
                { label: 'Šifra', key: 'CodeMaterial' },
                { label: 'Količina', key: 'Amount' },
                { label: 'Jedinica', key: 'Unit' },
                { label: 'Lokacija', key: 'Location' },
                { label: 'Opis', key: 'Description' },
                { label: 'Min. količina', key: 'MinAmount' },
                { label: 'Nab. cijena', key: 'PurchasePrice' },
                { label: 'Prod. cijena', key: 'SellingPrice' },
                { label: 'Dobavljač', key: 'ID_supplier' },
                { label: 'Tip promjene', key: 'TypeChange' },
              ].map(({ label, key }) => (
                <th key={key} onClick={() => handleSort(key)} style={{ cursor: 'pointer' }}>
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
              <th>Ukupna nabavna cijena</th>
              <th>Ukupna prodajna cijena</th>
            </tr>
          </thead>
          <tbody>
            {currentMaterials.map(mat => (
              <tr key={mat.ID_material}>
                <td>{mat.ID_material}</td>
                <td>{mat.NameMaterial}</td>
                <td>{mat.CodeMaterial}</td>
                <td>{mat.Amount}</td>
                <td>{mat.Unit}</td>
                <td>{mat.Location}</td>
                <td>{mat.Description}</td>
                <td>{mat.MinAmount}</td>
                <td>{mat.PurchasePrice}</td>
                <td>{mat.SellingPrice}</td>
                <td>{getSupplierName(mat.ID_supplier)}</td>
                <td>{mat.TypeChange}</td>
                <td>{(parseFloat(mat.PurchasePrice) * parseFloat(mat.Amount)).toFixed(2)}</td>
                <td>{(parseFloat(mat.SellingPrice) * parseFloat(mat.Amount)).toFixed(2)}</td>
                <td style={{ whiteSpace: 'nowrap' }}>
                  <Button variant="warning" size="sm" className="me-2" onClick={() => openEditModal(mat)}>Uredi</Button>
                  <Button variant="danger" size="sm" onClick={() => {
                    setDeleteId(mat.ID_material);
                    setShowDeleteConfirm(true);
                  }}>
                    Obriši
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <div className="mt-2 fw-bold text-end">
        <div>
          Ukupna nabavna cijena (prikazano): {
            currentMaterials.reduce((acc, mat) =>
              acc + parseFloat(mat.PurchasePrice || 0) * parseFloat(mat.Amount || 0), 0
            ).toFixed(2)
          } €
        </div>
        <div>
          Ukupna prodajna cijena (prikazano): {
            currentMaterials.reduce((acc, mat) =>
              acc + parseFloat(mat.SellingPrice || 0) * parseFloat(mat.Amount || 0), 0
            ).toFixed(2)
          } €
        </div>
      </div>


      {/* PAGINACIJA */}
      <div className="row align-items-center mt-3 px-2">
        <div className="col-12 col-md-6 mb-2 mb-md-0">
          Prikazuje se {sortedMaterials.length === 0 ? 0 : indexOfFirst + 1} - {Math.min(indexOfLast, sortedMaterials.length)} od {sortedMaterials.length} materijala
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
      <Modal show={showModal} onHide={() => {
        setShowModal(false);
        setFormData({
          NameMaterial: '',
          CodeMaterial: '',
          Amount: '',
          Unit: '',
          Location: '',
          Description: '',
          MinAmount: '',
          PurchasePrice: '',
          SellingPrice: '',
          ID_supplier: '',
          TypeChange: ''
        });
        setIsEditing(false);
        setSelectedMaterialId(null);
      }}
      >
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Uredi materijal' : 'Dodaj materijal'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <Form>
            <Form.Group>
              <Form.Label>Naziv materijala</Form.Label>
              <Form.Control
                type="text"
                value={formData.NameMaterial}
                onChange={(e) => setFormData({ ...formData, NameMaterial: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Šifra materijala</Form.Label>
              <Form.Control
                type="text"
                value={formData.CodeMaterial}
                onChange={(e) => setFormData({ ...formData, CodeMaterial: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Količina</Form.Label>
              <Form.Control
                type="number"
                value={formData.Amount}
                onChange={(e) => setFormData({ ...formData, Amount: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Jedinica</Form.Label>
              <Form.Select
                value={formData.Unit}
                onChange={(e) => setFormData({ ...formData, Unit: e.target.value })}
              >
                <option value="">Odaberi jedinicu</option>
                {unit.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Odaberi lokaciju</Form.Label>
              <Form.Select
                value={formData.Location}
                onChange={(e) => setFormData({ ...formData, Location: e.target.value })}
              >
                <option value="">Odaberi lokaciju</option>
                {location.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group>
              <Form.Label>Opis </Form.Label>
              <Form.Control
                type="text"
                value={formData.Description}
                onChange={(e) => setFormData({ ...formData, Description: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Minimalna količina (količina nakon koje bi trebalo napraviti narudžbu)</Form.Label>
              <Form.Control
                type="number"
                value={formData.MinAmount}
                onChange={(e) => setFormData({ ...formData, MinAmount: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Nabavna cijena (bez PDV-a)</Form.Label>
              <Form.Control
                type="number"
                value={formData.PurchasePrice}
                onChange={(e) => setFormData({ ...formData, PurchasePrice: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Prodajna cijena (bez PDV-a)</Form.Label>
              <Form.Control
                type="number"
                value={formData.SellingPrice}
                onChange={(e) => setFormData({ ...formData, SellingPrice: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Dobavljač</Form.Label>
              <Form.Select
                value={formData.ID_supplier}
                onChange={(e) => setFormData({ ...formData, ID_supplier: e.target.value })}
              >
                <option value="">Odaberi dobavljača</option>
                {suppliers.map(supplier => (
                  <option key={supplier.ID_supplier} value={supplier.ID_supplier}>
                    {supplier.Name ? supplier.Name : supplier.ContactName}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Vrsta promjene</Form.Label>
              <Form.Select
                value={formData.TypeChange}
                onChange={(e) => setFormData({ ...formData, TypeChange: e.target.value })}
              >
                <option value="">Odaberi vrstu promjene</option>
                {typeChange.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Zatvori</Button>
          <Button variant="success" onClick={isEditing ? handleEditMaterial : handleAddMaterial}>
            {isEditing ? 'Spremi izmjene' : 'Spremi'}
          </Button>

        </Modal.Footer>
      </Modal>

      {/* MODAL ZA POTVRDU BRISANJA */}
      <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Potvrda brisanja</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Jeste li sigurni da želite obrisati ovaj materijal?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>Odustani</Button>
          <Button variant="danger" onClick={handleDelete}>Obriši</Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar newestOnTop />
    </div>
  );
};

export default ShowMaterials;
