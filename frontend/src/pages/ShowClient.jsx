import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Table, InputGroup, FormControl } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../api/api';

const ShowClient = () => {
    const [selectedClientId, setSelectedClientId] = useState(null);
    const [clients, setClients] = useState([]);
    const [type, setType] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [searchName, setSearchName] = useState('');
    const [searchContactName, setSearchContactName] = useState('');
    const [deleteId, setDeleteId] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const clientsPerPage = 30;


    const [formData, setFormData] = useState({
        TypeClient: '',
        Name: '',
        PersonalNumber: '',
        ContactName: '',
        Contact: '',
        Email: '',
        Address: '',
        City: '',
        PostalCode: '',
        Country: '',
    });

    useEffect(() => {
        fetchClients();
        fetchType();
    }, []);

    const fetchClients = async () => {
        try {
            const res = await api.get('/aplication/getAllClients');
            setClients(res.data);
        } catch (error) {
            console.error('Greška pri dohvaćanju klijenata', error);
        }
    };

    const fetchType = async () => {
        try {
            const res = await api.get('/aplication/getTypeClientEnum');
            setType(res.data);
        } catch (error) {
            console.error('Greška pri dohvaćanju tipa klijenta', error);
        }
    };

    const handleAddClient = async () => {
        if (!isFormValid()) return; // validation
        try {
            await api.post('/aplication/addClient', formData);
            setShowModal(false);
            fetchClients();
            toast.success('Klijent uspješno dodan!');
            setFormData({
                TypeClient: '',
                Name: '',
                PersonalNumber: '',
                ContactName: '',
                Contact: '',
                Email: '',
                Address: '',
                City: '',
                PostalCode: '',
                Country: '',
            })
        } catch (error) {
            console.error('Greška prilikom dodavanja klijenta', error);
            toast.error('Greška prilikom dodavanja klijenta!');
        }
    };

    const handleEditClient = async () => {
        if (!isFormValid()) return; // validacija
        try {
            await api.put(`/aplication/updateClient/${selectedClientId}`, formData);
            setShowModal(false);
            fetchClients();
            toast.success('Klijent je ažuriran!');
            setFormData({
                TypeClient: '',
                Name: '',
                PersonalNumber: '',
                ContactName: '',
                Contact: '',
                Email: '',
                Address: '',
                City: '',
                PostalCode: '',
                Country: '',
            })
            resetForm();
            setIsEditing(false);
            setSelectedClientId(null);
        } catch (error) {
            console.error('Greška prilikom ažuriranja klijenta', error);
            toast.error('Greška prilikom ažuriranja klijenta!');
        }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/aplication/deleteClient/${deleteId}`);
            setShowDeleteConfirm(false);
            fetchClients();
            toast.success('Klijent je uspješno obrisan!');
        } catch (error) {
            console.error('Greška prilikom brisanja', error);
            toast.error('Greška prilikom brisanja!');
        }
    };

    const resetForm = () => {
        setFormData({
            TypeClient: '',
            Name: '',
            PersonalNumber: '',
            ContactName: '',
            Contact: '',
            Email: '',
            Address: '',
            City: '',
            PostalCode: '',
            Country: '',
        });
    };

    const isFormValid = () => {
        // Tip Tvrtka - provjera Naziva i OIB-a
        if (formData.TypeClient === 'Tvrtka') {
            if (!formData.Name || formData.Name.trim() === '') {
                showError("Naziv tvrtke je obavezan.");
                return false;
            }
            if (!formData.PersonalNumber || !/^\d{11}$/.test(formData.PersonalNumber)) {
                showError("OIB mora sadržavati točno 11 brojeva.");
                return false;
            }
        }

        // Kontakt osoba obavezno
        if (!formData.ContactName || formData.ContactName.trim() === '') {
            showError("Ime i prezime kontakt osobe je obavezno.");
            return false;
        }

        // Kontakt broj obavezno
        if (!formData.Contact || formData.Contact.trim() === '') {
            showError("Kontakt broj je obavezan.");
            return false;
        }

        // Email provjera
        if (!formData.Email || formData.Email.trim() === '') {
            showError("Email je obavezan.");
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.Email)) {
            showError("Email mora biti u ispravnom formatu (npr. korisnik@example.com).");
            return false;
        }

        // Adresa broj obavezno
        if (!formData.Address || formData.Address.trim() === '') {
            showError("Adresa je obavezna.");
            return false;
        }

        // Kontakt broj obavezno
        if (!formData.City || formData.City.trim() === '') {
            showError("Grad je obavezan.");
            return false;
        }

        // Kontakt broj obavezno
        if (!formData.PostalCode || formData.PostalCode.trim() === '') {
            showError("Poštanski broj je obavezan.");
            return false;
        }

        // Država broj obavezno
        if (!formData.Country || formData.Country.trim() === '') {
           showError("Država je obavezna.");
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

    const openEditModal = (clients) => {
        setIsEditing(true);
        setSelectedClientId(clients.ID_client);
        setFormData({
            TypeClient: clients.TypeClient || '',
            Name: clients.Name || '',
            PersonalNumber: clients.PersonalNumber || '',
            ContactName: clients.ContactName || '',
            Contact: clients.Contact || '',
            Email: clients.Email || '',
            Address: clients.Address || '',
            City: clients.City || '',
            PostalCode: clients.PostalCode || '',
            Country: clients.Country || ''
        })
        setShowModal(true);
    };

    const sortedClients = [...clients].filter((m) =>
        m.Name.toLowerCase().includes(searchName.toLowerCase()) &&
        m.ContactName.toLowerCase().includes(searchContactName.toLowerCase())
    );

    if (sortConfig.key) {
        sortedClients.sort((a, b) => {
            const aVal = a[sortConfig.key];
            const bVal = b[sortConfig.key];
            if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }

    const indexOfLast = currentPage * clientsPerPage;
    const indexOfFirst = indexOfLast - clientsPerPage;
    const currentClients = sortedClients.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(sortedClients.length / clientsPerPage);

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    return (
        <div className="container px-3 mt-4">
            {/* Naslov i gumb */}
            <div className="row align-items-center mb-3">
                <div className="col-12 col-md">
                    <h2 className="mb-0">Klijenti</h2>
                </div>
                <div className="col-12 col-md-auto mt-2 mt-md-0 text-md-end">
                    <Button
                        variant="danger" onClick={() => {
                            setFormData({
                                TypeClient: '',
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
                        Dodaj klijenta
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
                                { label: 'ID', key: 'ID_client' },
                                { label: 'Vrsta klijenta', key: 'TypeClient' },
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
                        {currentClients.map(mat => (
                            <tr key={mat.ID_client}>
                                <td>{mat.ID_client}</td>
                                <td>{mat.TypeClient}</td>
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
                                        setDeleteId(mat.ID_client);
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
                    Prikazuje se {sortedClients.length === 0 ? 0 : indexOfFirst + 1} - {Math.min(indexOfLast, sortedClients.length)} od {sortedClients.length} dobavljača
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
                    TypeClient: '',
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
                setSelectedClientId(null);
            }}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? 'Uredi klijenta' : 'Dodaj klijenta'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-2">
                            <Form.Label>Tip klijenta</Form.Label>
                            <Form.Select
                                value={formData.TypeClient}
                                onChange={(e) => {
                                    const selectedType = e.target.value;
                                    setFormData(prev => ({
                                        ...prev,
                                        TypeClient: selectedType,
                                        Name: selectedType === 'Tvrtka' ? '' : prev.Name,  // opcionalno: očisti Name
                                    }));
                                }}
                            >
                                <option value="">Odaberi vrstu klijenta</option>
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
                                disabled={formData.TypeClient !== 'Tvrtka'} // ✅ samo za Tvrtka
                                placeholder={formData.TypeClient !== 'Tvrtka' ? 'Nije potrebno za fizičku osobu' : ''}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>OIB</Form.Label>
                            <Form.Control
                                type="text"
                                maxLength={11}
                                value={formData.PersonalNumber}
                                onChange={(e) => setFormData({ ...formData, PersonalNumber: e.target.value })}
                                disabled={formData.TypeClient !== 'Tvrtka'} // ✅ isto pravilo
                                placeholder={formData.TypeClient !== 'Tvrtka' ? 'Nije potrebno za fizičku osobu' : ''}
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
                    <Button variant="success" onClick={isEditing ? handleEditClient : handleAddClient}>
                        {isEditing ? 'Spremi izmjene' : 'Spremi'}
                    </Button>
                </Modal.Footer>
            </Modal >

            {/* MODAL ZA POTVRDU BRISANJA */}
            < Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Potvrda brisanja</Modal.Title>
                </Modal.Header>
                <Modal.Body>Jeste li sigurni da želite obrisati ovog klijenta?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>Odustani</Button>
                    <Button variant="danger" onClick={handleDelete}>Obriši</Button>
                </Modal.Footer>
            </Modal >

            <ToastContainer position="top-right" autoClose={3000} hideProgressBar newestOnTop />
        </div >


    );
};


export default ShowClient
