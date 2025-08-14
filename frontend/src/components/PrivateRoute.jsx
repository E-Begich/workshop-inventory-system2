import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // provjera tokena
  if (!token) {
    return <Navigate to="/login" replace />; // redirect na login
  }
  return children; // ako postoji token, prikaži sadržaj
};

export default PrivateRoute;
