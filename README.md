## 📖 Overview
The **Workshop Inventory System** is a web application designed for a **small business**, specifically an **upholstery workshop**, to manage inventory efficiently.  

**Key features include:**  
- User-friendly interface for managing inventory  
- Backend API for data processing and storage  
- Data validation, route protection, and user authentication  
- Prevent deletion of critical records  
- Filtering, sorting, pagination  
- PDF generation for quotes and invoices  

The system is **scalable** and can be adapted for larger business systems.

---

## ⚙️ Technologies
- **Frontend:** `ReactJS` + `Bootstrap`  
- **Backend:** `Node.js` + `Express`  
- **Database:** `MySQL` via `Sequelize ORM`  
- **Other:** `dotenv` for environment variables, PDF generation  

---

## 🛠 Features
- **CRUD operations** for inventory items  
- **Secure routes and authentication**  
- **Data validation** to maintain database integrity  
- **Filter, sort, and paginate** inventory data  
- **PDF generation** for quotes and invoices  

---

## 🏗 System Architecture
- Frontend communicates with backend via REST API
- Backend handles business logic, validation, and database operations
- Database is connected via Sequelize ORM
- Modular design allows independent development of frontend and backend

---

## 💻 Installation (Local) 
 Configure database credentials  

### 1️⃣ Clone the repository
- git clone git@github.com:E-Begich/workshop-inventory-system2.git
### 2️⃣ Install backend dependencies
- cd workshop-inventory-system2/backend

npm install

 ### 3️⃣ Configure environment variables
- Create a .env file inside the backend folder:

DB_HOST=your_host

DB_USER=your_user

DB_PASS=your_password

DB_NAME=your_database

DB_PORT=3306

PORT=8080

### 4️⃣ Start the backend server
- node server.js

- The server will run on the port defined in .env (default 8080)

### 5️⃣ Navigate to the frontend folder
- cd workshop-inventory-system2/frontend
### 6️⃣ Install frontend dependencies
- npm install
### 7️⃣ Start the frontend application
-  npm start
  
### The application will start in the browser at:

👉 http://localhost:3000

---

> ⚠️ Make sure the backend server is running before starting the frontend application.

---

## 🔗 API Endpoints

| Method | Endpoint      | Description                     |
|-------:|---------------|---------------------------------|
| GET    | `/items`      | Retrieve all inventory items    |
| POST   | `/items`      | Add a new inventory item        |
| PUT    | `/items/:id`  | Update an existing inventory item |
| DELETE | `/items/:id`  | Delete an inventory item        |

> Additional endpoints for authentication, PDF generation, etc. can be added here.

---

## ▶️ Usage
- Access the backend API locally via http://localhost:8080
- Connect your frontend to the backend API to manage inventory data
- Supports pagination, sorting, filtering, and PDF document generation

 ---
  
## 📝 Notes

- Current deployment is intended for **local testing**  
- Can be hosted on a cloud platform such as **Railway**, **Render**, or **Heroku**  
- Ensure environment variables are correctly set before running the project  
- Database access requires either a **local MySQL instance** or a free online MySQL hosting
