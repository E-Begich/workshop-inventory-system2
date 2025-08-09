import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button, Table, InputGroup, FormControl } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

const ShowReceipt = () => {
    const [receipts, setReceipts] = useState([]);
    const [clients, setClients] = useState([]);
    const [users, setUsers] = useState([]);
    const [searchName, setSearchName] = useState('');
    const [searchUser, setSearchUser] = useState('');
    const [detailsModalVisible, setDetailsModalVisible] = useState(false);
    const [detailedReceipt, setDetailedReceipt] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const receiptsPerPage = 30;

    useEffect(() => {
        fetchReceipts();
        fetchClients();
        fetchUsers();
    }, []);

    const fetchReceipts = async () => {
        try {
            const res = await axios.get('/api/aplication/getAllReceipt');
            setReceipts(res.data);
        } catch (error) {
            console.error('Greška pri dohvaćanju računa:', error);
            toast.error('Ne mogu dohvatiti račune.');
        }
    };

    const fetchClients = async () => {
        try {
            const res = await axios.get('/api/aplication/getAllClients');
            setClients(res.data);
        } catch (error) {
            console.error('Greška pri dohvaćanju klijenata', error);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await axios.get('/api/aplication/getAllUsers');
            setUsers(res.data);
        } catch (error) {
            console.error('Greška pri dohvaćanju korisnika', error);
        }
    };

    const getClientName = (id) => {
        const client = clients.find(c => c.ID_client === id);
        return client ? (client.TypeClient === 'Tvrtka' ? client.Name : client.ContactName) : 'Nepoznato';
    };

    const getUserName = (id) => {
        const user = users.find(u => u.ID_user === id);
        return user ? user.Name : 'Nepoznat';
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };

    const openDetailsModal = async (id) => {
        try {
            const res = await axios.get(`/api/aplication/getReceiptWithDetails/${id}`);
            setDetailedReceipt(res.data);
            setDetailsModalVisible(true);
        } catch (error) {
            console.error('Greška pri dohvaćanju detalja računa:', error);
            toast.error('Ne mogu dohvatiti detalje računa.');
        }
    };

    const filteredReceipts = receipts.filter((receipt) => {
        const clientName = getClientName(receipt.ID_client).toLowerCase();
        const userName = getUserName(receipt.ID_user).toLowerCase();

        return (
            clientName.includes(searchName.toLowerCase()) &&
            userName.includes(searchUser.toLowerCase())
        );
    });

    if (sortConfig.key) {
        filteredReceipts.sort((a, b) => {
            const aVal = a[sortConfig.key];
            const bVal = b[sortConfig.key];
            if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }

    const indexOfLast = currentPage * receiptsPerPage;
    const indexOfFirst = indexOfLast - receiptsPerPage;
    const currentReceipts = filteredReceipts.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredReceipts.length / receiptsPerPage);

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const apiUrl = process.env.REACT_APP_API_URL;

    return (
        <div className="container px-3 mt-4">
            <div className="row align-items-center mb-3">
                <div className="col-12 col-md">
                    <h2 className="mb-0">Prikaz svih računa</h2>
                </div>
            </div>

            <div className="row g-3 mb-3">
                <div className="col-12 col-md-6 col-lg-4">
                    <InputGroup>
                        <FormControl
                            placeholder="Pretraga po klijentu"
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                        />
                    </InputGroup>
                </div>
                <div className="col-12 col-md-6 col-lg-4">
                    <InputGroup>
                        <FormControl
                            placeholder="Pretraga po kreatoru"
                            value={searchUser}
                            onChange={(e) => setSearchUser(e.target.value)}
                        />
                    </InputGroup>
                </div>
            </div>

            {currentReceipts.length === 0 ? (
                <p>Nema računa.</p>
            ) : (
                <div className="table-responsive">
                    <Table striped bordered hover size="sm" className="mb-3">
                        <thead>
                            <tr>
                                {[
                                    { label: 'Broj računa', key: 'ID_receipt' },
                                    { label: 'Klijent', key: 'Client.Name' },
                                    { label: 'Datum', key: 'DateCreate' },
                                    { label: 'Ukupno (s PDV)', key: 'PriceTax' },
                                    { label: 'Korisnik', key: 'User.Name' },
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
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentReceipts.map((receipt) => (
                                <tr key={receipt.ID_receipt}>
                                    <td>{receipt.ID_receipt}</td>
                                    <td>{getClientName(receipt.ID_client)}</td>
                                    <td>{formatDate(receipt.DateCreate)}</td>
                                    <td>{Number(receipt.PriceTax).toFixed(2)} €</td>
                                    <td>{getUserName(receipt.ID_user)}</td>
                                    <td>
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            className="me-2"
                                            onClick={() => openDetailsModal(receipt.ID_receipt)}
                                        >
                                            Otvori
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            className="me-2"
                                            onClick={() => window.open(`${apiUrl}/api/aplication/generateReceiptPDF/${receipt.ID_receipt}`, '_blank')}
                                        >
                                            Izvezi PDF
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            )}

            <div className="row align-items-center mt-3 px-2">
                <div className="col-12 col-md-6 mb-2 mb-md-0">
                    Prikazuje se {filteredReceipts.length === 0 ? 0 : indexOfFirst + 1} - {Math.min(indexOfLast, filteredReceipts.length)} od {filteredReceipts.length} računa
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

            <Modal
                show={detailsModalVisible}
                onHide={() => setDetailsModalVisible(false)}
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Detalji računa</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {!detailedReceipt ? (
                        <p>Učitavanje...</p>
                    ) : (
                        <>
                            <p><strong>Broj računa:</strong> R-{new Date(detailedReceipt.DateCreate).getFullYear()}-{String(detailedReceipt.ID_receipt).padStart(5, '0')}</p>
                            <p><strong>Datum:</strong> {formatDate(detailedReceipt.DateCreate)}</p>
                            <hr />
                            <p><strong>Klijent:</strong> {detailedReceipt.Client?.TypeClient === 'Tvrtka' ? detailedReceipt.Client?.Name : detailedReceipt.Client?.ContactName}</p>
                            <p><strong>Email:</strong> {detailedReceipt.Client?.Email}</p>
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
                                    {detailedReceipt.ReceiptItems.map((item, index) => (
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
                            <p><strong>Ukupno bez PDV-a:</strong> {Number(detailedReceipt.PriceNoTax).toFixed(2)} €</p>
                            <p><strong>PDV:</strong> {Number(detailedReceipt.Tax).toFixed(2)} €</p>
                            <p><strong>Ukupno s PDV-om:</strong> {Number(detailedReceipt.PriceTax).toFixed(2)} €</p>
                            <p><strong>Način plaćanja:</strong> {detailedReceipt.PaymentMethod || 'Nije definirano'}</p>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    {detailedReceipt && (
                        <Button
                            variant="danger"
                            onClick={() => window.open(`${apiUrl}/api/aplication/generateReceiptPDF/${detailedReceipt.ID_receipt}`, '_blank')}
                        >
                            📄 Preuzmi PDF
                        </Button>
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

export default ShowReceipt;

