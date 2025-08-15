import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Table, InputGroup, FormControl } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import api from '../api/api';

const ShowOffer = () => {
    const [offers, setOffers] = useState([]);
    const [clients, setClients] = useState([]);
    const [users, setUsers] = useState([]);
    const [searchName, setSearchName] = useState('');
    const [searchUser, setSearchUser] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);//modal za brisanje
    const [deleteId, setDeleteId] = useState(null);//modal za brisanje
    const [selectedOffer, setSelectedOffer] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);//modal za odabir plaćanja
    const [paymentMethod, setPaymentMethod] = useState('');
    const [detailsModalVisible, setDetailsModalVisible] = useState(false);//modal za pregled ponude
    const [detailedOffer, setDetailedOffer] = useState(null);
    const [payments, setPayments] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const offersPerPage = 30;

    useEffect(() => {
        fetchOffers();
        fetchClients();
        fetchUsers();
        fetchPayments();
    }, []);

    const fetchOffers = async () => {
        try {
            const res = await api.get('/aplication/getAllOffer');
            setOffers(res.data);
        } catch (error) {
            console.error(error);
            toast.error('Ne mogu dohvatiti ponude.');
        }
    };

    const fetchClients = async () => {
        try {
            const res = await api.get('/aplication/getAllClients');
            setClients(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await api.get('/aplication/getAllUsers');
            setUsers(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchPayments = async () => {
        try {
            const res = await api.get('/aplication/getPaymentEnum');
            setPayments(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const getClientType = (id) => clients.find(c => c.ID_client === id)?.TypeClient || 'Nepoznato';
    const getClientName = (id) => {
        const c = clients.find(c => c.ID_client === id);
        if (!c) return 'Nepoznato';
        return c.TypeClient === 'Tvrtka' ? c.Name : c.ContactName;
    };
    const getUserName = (id) => users.find(u => u.ID_user === id)?.Name || 'Nepoznat';
    const formatDate = (dateString) => {
        const d = new Date(dateString);
        return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
    };

    const confirmDeleteOffer = (id) => {
        setDeleteId(id);
        setShowDeleteConfirm(true);
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/aplication/deleteOffer/${deleteId}`);
            toast.success('Ponuda obrisana.');
            fetchOffers();
        } catch (error) {
            console.error(error);
            toast.error('Brisanje ponude nije uspjelo.');
        } finally {
            setShowDeleteConfirm(false);
            setDeleteId(null);
        }
    };

    const openDetailsModal = async (id) => {
        try {
            const res = await api.get(`/aplication/getOfferWithDetails/${id}`);
            setDetailedOffer(res.data);
            setDetailsModalVisible(true);
        } catch (error) {
            console.error(error);
            toast.error('Ne mogu dohvatiti detalje ponude.');
        }
    };

    const handleCreateReceipt = async (offer) => {
        if (!offer || !paymentMethod) {
            toast.error('Odaberite ponudu i način plaćanja.');
            return;
        }
        try {
            await api.post('/aplication/createReceiptFromOffer', {
                ID_offer: offer.ID_offer,
                ID_user: offer.ID_user,
                PaymentMethod: paymentMethod
            });
            toast.success('Račun uspješno kreiran.');
            setShowPaymentModal(false);
            setPaymentMethod('');
            fetchOffers();
        } catch (error) {
            console.error(error);
            toast.error('Greška pri kreiranju računa.');
        }
    };

    const openPDF = async (offerId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await api.get(`/aplication/generateOfferPDF/${offerId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                responseType: 'blob'
            });

            const fileURL = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            window.open(fileURL, '_blank'); // Otvori PDF u novom tabu
        } catch (error) {
            console.error('Greška prilikom otvaranja PDF-a:', error);
            toast.error('Neuspješno otvaranje PDF-a');
        }
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
        setSortConfig({ key, direction });
    };

    const filteredOffers = offers.filter(o =>
        getClientName(o.ID_client).toLowerCase().includes(searchName.toLowerCase()) &&
        getUserName(o.ID_user).toLowerCase().includes(searchUser.toLowerCase())
    );

    if (sortConfig.key) {
        filteredOffers.sort((a, b) => {
            const aVal = a[sortConfig.key];
            const bVal = b[sortConfig.key];
            if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }

    const indexOfLast = currentPage * offersPerPage;
    const indexOfFirst = indexOfLast - offersPerPage;
    const currentOffers = filteredOffers.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredOffers.length / offersPerPage);

    const apiUrl = process.env.REACT_APP_API_URL;

    return (
        <div className="container px-3 mt-4">
            <div className="row align-items-center mb-3">
                <div className="col-12 col-md"><h2>Prikaz svih ponuda</h2></div>
                <div className="col-12 col-md-auto text-md-end">
                    <Button variant="danger">
                        <Link to="/addOffer" className="nav-link text-white">Dodaj novu ponudu</Link>
                    </Button>
                </div>
            </div>

            <div className="row g-3 mb-3">
                <div className="col-12 col-md-6 col-lg-4">
                    <InputGroup>
                        <FormControl placeholder="Pretraga po nazivu" value={searchName} onChange={e => setSearchName(e.target.value)} />
                    </InputGroup>
                </div>
                <div className="col-12 col-md-6 col-lg-4">
                    <InputGroup>
                        <FormControl placeholder="Pretraga po kreatoru" value={searchUser} onChange={e => setSearchUser(e.target.value)} />
                    </InputGroup>
                </div>
            </div>

            {currentOffers.length === 0 ? <p>Nema ponuda.</p> : (
                <div className="table-responsive">
                    <Table striped bordered hover size="sm">
                        <thead>
                            <tr>
                                {[
                                    { label: 'Broj ponude', key: 'ID_offer' },
                                    { label: 'Vrsta klijenta', key: 'Client.TypeClient' },
                                    { label: 'Klijent', key: 'Client.Name' },
                                    { label: 'Datum kreiranja', key: 'DateCreate' },
                                    { label: 'Datum isteka', key: 'DateEnd' },
                                    { label: 'Cijena (s PDV)', key: 'PriceTax' },
                                    { label: 'Ponudu kreirao', key: 'User.Name' },
                                ].map(({ label, key }) => (
                                    <th key={key} style={{ cursor: 'pointer' }} onClick={() => handleSort(key)}>
                                        {label} <span style={{ color: sortConfig.key === key ? 'black' : '#ccc' }}>
                                            {sortConfig.key === key ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '▲▼'}
                                        </span>
                                    </th>
                                ))}
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentOffers.map(offer => (
                                <tr key={offer.ID_offer}>
                                    <td>{offer.ID_offer}</td>
                                    <td>{getClientType(offer.ID_client)}</td>
                                    <td>{getClientName(offer.ID_client)}</td>
                                    <td>{formatDate(offer.DateCreate)}</td>
                                    <td>{formatDate(offer.DateEnd)}</td>
                                    <td>{Number(offer.PriceTax).toFixed(2)} €</td>
                                    <td>{getUserName(offer.ID_user)}</td>
                                    <td style={{ whiteSpace: 'nowrap' }}>
                                        <Button size="sm" className="me-2" onClick={() => openDetailsModal(offer.ID_offer)}>Otvori</Button>
                                        <Button size="sm" className="me-2" disabled={offer.HasReceipt} onClick={() => { setSelectedOffer(offer); setShowPaymentModal(true) }}>Kreiraj račun</Button>
                                        <Button variant="danger" size="sm" className="me-2" onClick={() => openPDF(offer.ID_offer)}>  Preuzmi PDF </Button>
                                        <Button size="sm" variant="danger" onClick={() => confirmDeleteOffer(offer.ID_offer)}>Obriši</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            )}

            {/* PAGINATION */}
            <div className="row align-items-center mt-3 px-2">
                <div className="col-12 col-md-6 mb-2 mb-md-0">
                    Prikazuje se {filteredOffers.length === 0 ? 0 : indexOfFirst + 1} - {Math.min(indexOfLast, filteredOffers.length)} od {filteredOffers.length} ponuda
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

            {/* Delete Confirm Modal */}
            <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Potvrda brisanja</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Jeste li sigurni da želite obrisati ovu ponudu?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>Odustani</Button>
                    <Button variant="danger" onClick={handleDelete}>Obriši</Button>
                </Modal.Footer>
            </Modal>

            {/* Payment Modal */}
            <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)}>
                <Modal.Header closeButton><Modal.Title>Odaberi način plaćanja</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Form.Select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                        <option value="">Odaberite način plaćanja</option>
                        {payments.map((p, idx) => <option key={idx} value={p}>{p}</option>)}
                    </Form.Select>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowPaymentModal(false)}>Otkaži</Button>
                    <Button variant="primary" onClick={() => handleCreateReceipt(selectedOffer)}>Kreiraj račun</Button>
                </Modal.Footer>
            </Modal>

            {/* Details Modal */}
            <Modal
                show={detailsModalVisible}
                onHide={() => setDetailsModalVisible(false)}
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Detalji ponude</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {!detailedOffer ? (
                        <p>Učitavanje...</p>
                    ) : (
                        <>
                            <p><strong>Broj ponude:</strong> R-{new Date(detailedOffer.DateCreate).getFullYear()}-{String(detailedOffer.ID_offer).padStart(5, '0')}</p>
                            <p><strong>Datum izrade:</strong> {formatDate(detailedOffer.DateCreate)}</p>
                            <p><strong>Datum isteka:</strong> {formatDate(detailedOffer.DateEnd)}</p>
                            <hr />
                            <p><strong>Klijent:</strong> {detailedOffer.Client?.TypeClient === 'Tvrtka' ? detailedOffer.Client?.Name : detailedOffer.Client?.ContactName}</p>
                            <p><strong>Email:</strong> {detailedOffer.Client?.Email}</p>
                            <hr />
                            <Table striped bordered hover size="sm">
                                <thead>
                                    <tr>
                                        <th>Naziv</th>
                                        <th>Vrsta</th>
                                        <th>Količina</th>
                                        <th>Jed. cijena bez PDV</th>
                                        <th>PDV %</th>
                                        <th>Iznos s PDV</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {detailedOffer.OfferItems.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.TypeItem}</td>
                                            <td>{item.TypeItem}</td>
                                            <td>{item.Amount}</td>
                                            <td>{Number(item.PriceNoTax).toFixed(2)} €</td>
                                            <td>{item.Tax} %</td>
                                            <td>{Number(item.PriceTax).toFixed(2)} €</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            <hr />
                            <p><strong>Ukupno bez PDV-a:</strong> {Number(detailedOffer.PriceNoTax).toFixed(2)} €</p>
                            <p><strong>PDV:</strong> {Number(detailedOffer.Tax).toFixed(2)} €</p>
                            <p><strong>Ukupno s PDV-om:</strong> {Number(detailedOffer.PriceTax).toFixed(2)} €</p>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    {detailedOffer && (
                        <Button variant="danger" className="me-2" onClick={() => openPDF(detailedOffer.ID_offer)}>  Preuzmi PDF </Button>
                    )}
                    <Button variant="secondary" onClick={() => setDetailsModalVisible(false)}>
                        Zatvori
                    </Button>
                </Modal.Footer>
            </Modal>


            <ToastContainer position="top-right" autoClose={3000} hideProgressBar newestOnTop />
        </div>
    );
};

export default ShowOffer;
