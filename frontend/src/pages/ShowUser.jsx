import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Table } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ShowUser = () => {
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [users, setUsers] = useState([]);
    const [role, setRole] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
    const sortedUsers = [...users];
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 30;

    const [formData, setFormData] = useState({
        Name: '',
        Lastname: '',
        Email: '',
        Contact: '',
        Password: '',
        Role: ''
    });

    useEffect(() => {
        fetchUsers();
        fetchRole();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await axios.get('/api/aplication/getAllUsers');
            setUsers(res.data);
        } catch (error) {
            console.error('Greška pri dohvaćanju korisnika', error);
        }
    };

    const fetchRole = async () => {
        try {
            const res = await axios.get('/api/aplication/getRoleEnum');
            setRole(res.data);
        } catch (error) {
            console.error('Greška pri dohvaćanju uloge', error);
        }
    };

    const handleAddUser = async () => {
        try {
            await axios.post('/api/aplication/addUser', formData);
            setShowModal(false);
            fetchUsers();
            toast.success('Korisnik uspješno dodan!');
            setFormData({
                Name: '',
                Lastname: '',
                Email: '',
                Contact: '',
                Password: '',
                Role: ''
            });
        } catch (error) {
            console.error('Greška prilikom dodavanja korisnika', error);
            toast.error('Greška prilikom dodavanja!');
        }
    };

    const handleEditUser = async () => {
        try {
            await axios.put(`/api/aplication/updateUser/${selectedUserId}`, formData);
            setShowModal(false);
            fetchUsers();
            toast.success('Korisnik ažuriran!');
            setFormData({
                Name: '',
                Lastname: '',
                Email: '',
                Contact: '',
                Password: '',
                Role: ''
            });
            setIsEditing(false);
            setSelectedUserId(null);
        } catch (error) {
            console.error('Greška prilikom ažuriranja', error);
            toast.error('Greška prilikom ažuriranja!');
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/aplication/deleteUser/${deleteId}`);
            setShowDeleteConfirm(false);
            fetchUsers();
            toast.success('Korisnik je uspješno obrisan!');
        } catch (error) {
            console.error('Greška prilikom brisanja', error);
            toast.error('Greška prilikom brisanja!');
        }
    };

    const openEditModal = (user) => {
        setIsEditing(true);
        setSelectedUserId(user.ID_user);
        setFormData({
            Name: user.Name || '',
            Lastname: user.Lastname || '',
            Email: user.Email || '',
            Contact: user.Contact || '',
            Password: user.Password || '',
            Role: user.Role || ''
        })
        setShowModal(true);
    };


    if (sortConfig.key) {
        sortedUsers.sort((a, b) => {
            const aVal = a[sortConfig.key];
            const bVal = b[sortConfig.key];
            if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }

    const indexOfLast = currentPage * usersPerPage;
    const indexOfFirst = indexOfLast - usersPerPage;
    const currentUsers = sortedUsers.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(sortedUsers.length / usersPerPage);

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
                    <h2 className="mb-0">Korisnici - zaposlenici</h2>
                </div>
                <div className="col-12 col-md-auto mt-2 mt-md-0 text-md-end">
                    <Button
                        variant="danger" onClick={() => {
                            setFormData({
                                Name: '',
                                Lastname: '',
                                Email: '',
                                Contact: '',
                                Password: '',
                                Role: ''
                            })
                            setIsEditing(false);
                            setShowModal(true);
                        }}
                    >
                        Dodaj korisnika
                    </Button>
                </div>
            </div>
            <div className="table-responsive">
                <Table striped bordered hover size="sm" className="mb-3">
                    <thead>
                        <tr>
                            {[
                                { label: 'ID', key: 'ID_user' },
                                { label: 'Ime', key: 'Name' },
                                { label: 'Prezime', key: 'Lastname' },
                                { label: 'Email', key: 'Email' },
                                { label: 'Kontakt', key: 'Contact' },
                                { label: 'Lozinka', key: 'Password' },
                                { label: 'Uloga', key: 'Role' }
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
                        {currentUsers.map(mat => (
                            <tr key={mat.ID_user}>
                                <td>{mat.ID_user}</td>
                                <td>{mat.Name}</td>
                                <td>{mat.Lastname}</td>
                                <td>{mat.Email}</td>
                                <td>{mat.Contact}</td>
                                <td>{mat.Password}</td>
                                <td>{mat.Role}</td>

                                <td style={{ whiteSpace: 'nowrap' }}>
                                    <Button variant="warning" size="sm" className="me-2" onClick={() => openEditModal(mat)}>Uredi</Button>
                                    <Button variant="danger" size="sm" onClick={() => {
                                        setDeleteId(mat.ID_user);
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
                    Prikazuje se {sortedUsers.length === 0 ? 0 : indexOfFirst + 1} - {Math.min(indexOfLast, sortedUsers.length)} od {sortedUsers.length} korisnika
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
                    Lastname: '',
                    Email: '',
                    Contact: '',
                    Password: '',
                    Role: ''
                })
                setIsEditing(false);
                setSelectedUserId(null);
            }}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? 'Uredi korisnika' : 'Dodaj Korisnika'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Ime</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.Name}
                                onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Prezime</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.Lastname}
                                onChange={(e) => setFormData({ ...formData, Lastname: e.target.value })}
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
                            <Form.Label>Kontakt</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.Contact}
                                onChange={(e) => setFormData({ ...formData, Contact: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.Password}
                                onChange={(e) => setFormData({ ...formData, Password: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Uloga</Form.Label>
                            <Form.Select
                                value={formData.Role}
                                onChange={(e) => setFormData({ ...formData, Role: e.target.value })}
                            >
                                <option value="">Odaberi ulogu</option>
                                {role.map((loc) => (
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
                    <Button variant="success" onClick={isEditing ? handleEditUser : handleAddUser}>
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
                    Jeste li sigurni da želite obrisati ovog korisnika?
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

export default ShowUser
