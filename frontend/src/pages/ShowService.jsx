import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Table, InputGroup, FormControl } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ShowService = () => {
    const [selectedServiceId, setSelectedServiceId] = useState(null);
    const [service, setService] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        Name: '',
        Description: '',
        PriceNoTax: '',
        Tax: '25', // može biti automatski 25%
        PriceTax: '',
    });
    const [deleteId, setDeleteId] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [searchName, setSearchName] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const servicePerPage = 30;

    useEffect(() => {
        fetchService();

        const price = parseFloat(formData.PriceNoTax) || 0;
        // Koristi 25 samo ako je Tax prazan string i PriceNoTax nije prazan
        const taxPercent = formData.Tax === '' && formData.PriceNoTax !== ''
            ? 25
            : parseFloat(formData.Tax) || 0;

        const taxAmount = (price * taxPercent) / 100;
        const priceTax = price + taxAmount;

        setFormData(prev => ({
            ...prev,
            PriceTax: priceTax.toFixed(2),
        }));
    }, [formData.PriceNoTax, formData.Tax]);

    const fetchService = async () => {
        try {
            const res = await axios.get('/api/aplication/getAllService');
            setService(res.data);
        } catch (error) {
            console.error('Greška pri dohvaćanju usluga', error);
        }
    };

    const handleAddService = async () => {
        // Pripremi podatke za slanje – ako je Tax prazan, postavi 25
        const serviceData = {
            ...formData,
            Tax: formData.Tax === '' || formData.Tax == null ? 25 : formData.Tax
        };

        try {
            await axios.post('/api/aplication/addService', serviceData);
            setShowModal(false);
            fetchService();
            toast.success('Usluga je uspješno dodana!');
            setFormData({
                Name: '',
                Description: '',
                PriceNoTax: '',
                Tax: '', // može biti automatski 25%
                PriceTax: '',
            });
        } catch (error) {
            console.error('Greška prilikom dodavanja usluge', error);
            toast.error('Greška prilikom dodavanja usluge!');
        }
    };

    const handleEditService = async () => {
        try {
            await axios.put(`/api/aplication/updateService/${selectedServiceId}`, formData);
            setShowModal(false);
            fetchService();
            toast.success('Usluga je uspješno ažurirana!');
            setFormData({
                Name: '',
                Description: '',
                PriceNoTax: '',
                Tax: '', // može biti automatski 25%
                PriceTax: '',
            });
            setIsEditing(false);
            setSelectedServiceId(null);
        } catch (error) {
            console.error('Greška prilikom uređivanja usluge', error);
            toast.error('Greška prilikom uređivanja usluge!');
        }
    };


    const handleDelete = async () => {
        try {
            await axios.delete(`/api/aplication/deleteService/${deleteId}`);
            setShowDeleteConfirm(false);
            fetchService();
            toast.success('Usluga je uspješno obrisana!');
        } catch (error) {
            console.error('Greška prilikom brisanja', error);
            toast.error('Greška prilikom brisanja!');
        }
    };

    const openEditModal = (service) => {
        setIsEditing(true);
        setSelectedServiceId(service.ID_service);
        setFormData({
            Name: service.Name || '',
            Description: service.Description || '',
            Amount: service.Amount || '',
            PriceNoTax: service.PriceNoTax || '',
            Tax: service.Tax || '',
            PriceTax: service.PriceTax || ''
        });
        setShowModal(true);
    };

    const sortedService = [...service].filter((m) =>
        m.Name.toLowerCase().includes(searchName.toLowerCase())
    );

    if (sortConfig.key) {
        sortedService.sort((a, b) => {
            const aVal = a[sortConfig.key];
            const bVal = b[sortConfig.key];
            if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }

    const indexOfLast = currentPage * servicePerPage;
    const indexOfFirst = indexOfLast - servicePerPage;
    const currentService = sortedService.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(sortedService.length / servicePerPage);

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
                    <h2 className="mb-0">Usluge</h2>
                </div>
                <div className="col-12 col-md-auto mt-2 mt-md-0 text-md-end">
                    <Button
                        variant="danger" onClick={() => {
                            setFormData({
                                Name: '',
                                Description: '',
                                PriceNoTax: '',
                                Tax: '', // može biti automatski 25%
                                PriceTax: '',
                            });
                            setIsEditing(false);
                            setShowModal(true);
                        }}
                    >
                        Dodaj uslugu
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
            </div>

            <div className="table-responsive">
                <Table striped bordered hover size="sm" className="mb-3">
                    <thead>
                        <tr>
                            {[
                                { label: 'ID', key: 'ID_service' },
                                { label: 'Naziv', key: 'Name' },
                                { label: 'Opis', key: 'Description' },
                                { label: 'Cijena bez PDV-a', key: 'PriceNoTax' },
                                { label: 'PDV', key: 'Tax' },
                                { label: 'Cijena sa PDV-om', key: 'PriceTax' }
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
                        {currentService.map(mat => (
                            <tr key={mat.ID_service}>
                                <td>{mat.ID_service}</td>
                                <td>{mat.Name}</td>
                                <td>{mat.Description}</td>
                                <td>{mat.PriceNoTax}</td>
                                <td> {mat.Tax}%</td>
                                <td>{mat.PriceTax}</td>

                                <td style={{ whiteSpace: 'nowrap' }}>
                                    <Button variant="warning" size="sm" className="me-2" onClick={() => openEditModal(mat)}>Uredi</Button>
                                    <Button variant="danger" size="sm" onClick={() => {
                                        setDeleteId(mat.ID_service);
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
                    Prikazuje se {sortedService.length === 0 ? 0 : indexOfFirst + 1} - {Math.min(indexOfLast, sortedService.length)} od {sortedService.length} usluga
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
                setFormData({
                    Name: '',
                    Description: '',
                    PriceNoTax: '',
                    Tax: '',
                    PriceTax: '',
                });
                setIsEditing(false);
                setSelectedServiceId(null);
            }}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? 'Uredi uslugu' : 'Dodaj uslugu'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Naziv</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.Name}
                                onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Opis</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.Description}
                                onChange={(e) => setFormData({ ...formData, Description: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Cijena bez PDV-a</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.PriceNoTax}
                                onChange={(e) => setFormData({ ...formData, PriceNoTax: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>PDV</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.Tax}
                                placeholder='25%'
                                onChange={(e) => setFormData({ ...formData, Tax: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Cijena sa PDV</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.PriceTax}
                                onChange={(e) => setFormData({ ...formData, PriceTax: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Zatvori</Button>
                    <Button variant="success" onClick={isEditing ? handleEditService : handleAddService}>
                        {isEditing ? 'Spremi izmjene' : 'Spremi'}
                    </Button>
                </Modal.Footer>
            </Modal >

            {/* MODAL ZA POTVRDU BRISANJA */}
            <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Potvrda brisanja</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Jeste li sigurni da želite obrisati ovu uslugu?
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


export default ShowService
