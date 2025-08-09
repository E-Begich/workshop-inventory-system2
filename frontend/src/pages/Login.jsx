import React from "react";

const Login = () => {
  return (
    <div
      className="d-flex flex-column"
      style={{ minHeight: "100vh", overflow: "hidden" }}
    >
      {/* Centrirani sadržaj */}
      <main
        className="container d-flex justify-content-center align-items-center flex-grow-1"
        style={{
          paddingBottom: "60px", // visina footera
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
            <form className="h-100 d-flex flex-column justify-content-between">

              <div>
                <div className="form-outline mb-2">
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    placeholder="Enter email"
                  />
                  <label className="form-label" htmlFor="email">
                    Email address
                  </label>
                </div>

                <div className="form-outline mb-3">
                  <input
                    type="password"
                    id="password"
                    className="form-control"
                    placeholder="Password"
                  />
                  <label className="form-label" htmlFor="password">
                    Password
                  </label>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="rememberMe"
                    />
                    <label className="form-check-label ms-2" htmlFor="rememberMe">
                      Remember me
                    </label>
                  </div>
                  <a href="#!" className="text-body">
                    Forgot password?
                  </a>
                </div>
              </div>

              <div className="text-center">
                <button className="btn btn-danger w-100 mb-3">Login</button>

              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Fiksirani footer */}
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
        <div>© 2025. All rights reserved.</div>
      </footer>
    </div>
  );
};

export default Login;
