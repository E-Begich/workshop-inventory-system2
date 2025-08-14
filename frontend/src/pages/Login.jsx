import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Lokalna validacija grešaka
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Resetiraj stare greške
    setError("");
    setEmailError("");
    setPasswordError("");

    let valid = true;

    if (!email) {
      setEmailError("Molimo unesite email adresu.");
      valid = false;
    } else if (!validateEmail(email)) {
      setEmailError("Unesite ispravan format email adrese.");
      valid = false;
    }

    if (!password) {
      setPasswordError("Molimo unesite lozinku.");
      valid = false;
    } else if (password.length < 6) {
      setPasswordError("Lozinka mora imati barem 6 znakova.");
      valid = false;
    }

    if (!valid) return;

    try {
      const response = await axios.post("/api/aplication/login", {
        Email: email,
        Password: password,
      });

      const { token, user } = response.data;

      // Spremi token za kasniju autorizaciju
      localStorage.setItem("token", token);
      localStorage.setItem("Name", user.Name);
      localStorage.setItem("Lastname", user.Lastname);
      localStorage.setItem("Role", user.Role);

      //console.log(response.data);
      toast.success(`Dobrodošao/la, ${user.Name} ${user.Lastname}`);

      setTimeout(() => {
        navigate("/homePage");
      }, 3500);

    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Greška pri prijavi");
      }
    }
  };

  return (
    <div className="d-flex flex-column" style={{ minHeight: "100vh", overflow: "hidden" }} >
      <main
        className="container d-flex justify-content-center align-items-center flex-grow-1"
        style={{
          paddingBottom: "60px",
          maxHeight: "calc(100vh - 60px)",
          overflow: "hidden",
        }}
      >
        <div
          className="row w-100"
          style={{
            maxWidth: "850px",
            width: "100%",
            maxHeight: "100%",
          }}
        >
          {/* Slika (sakrivena na manjim ekranima) */}
          <div className="col-md-6 d-none d-md-flex justify-content-center align-items-center">
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
              alt="Login illustration"
              className="img-fluid"
              style={{ maxHeight: "350px", objectFit: "contain" }}
            />
          </div>

          {/* Forma */}
          <div
            className="col-12 col-md-6 d-flex flex-column justify-content-center"
            style={{ maxHeight: "400px" }}
          >
            <form
              className="h-100 d-flex flex-column justify-content-between"
              onSubmit={handleSubmit}
            >
              <div>
                {/* Email */}
                <div className="form-outline mb-2">
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <label className="form-label" htmlFor="email">
                    Email adresa
                  </label>
                  {emailError && <small style={{ color: "red" }}>{emailError}</small>}
                </div>

                {/* Lozinka */}
                <div className="form-outline mb-3 position-relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="form-control"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <label className="form-label" htmlFor="password">
                    Lozinka
                  </label>
                  <span
                    onClick={() => setShowPassword(prev => !prev)}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "30%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                      color: "#555",
                      fontSize: "18px",
                      zIndex: 10,
                    }}
                    aria-label={showPassword ? "Sakrij lozinku" : "Prikaži lozinku"}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setShowPassword(prev => !prev);
                      }
                    }}
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </span>
                  {passwordError && <small style={{ color: "red" }}>{passwordError}</small>}
                </div>

                {/* Remember i zaboravljena lozinka */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="form-check">
                  </div>
                </div>

                {error && <p style={{ color: "red" }}>{error}</p>}
              </div>

              {/* Gumb */}
              <div className="text-center">
                <button className="btn btn-danger w-100 mb-3" type="submit">
                  Prijava
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        className="bg-danger text-white py-3 px-4"
        style={{
          position: "fixed",
          bottom: 0,
          width: "100%",
          height: "60px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 1000,
        }}
      >
        <div>© 2025. Sva prava pridržana.</div>
      </footer>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar newestOnTop />
    </div>
  );
};

export default Login;
