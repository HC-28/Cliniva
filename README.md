# Cliniva — Integrated Medical History & Healthcare Management Ecosystem

> A modern, unified healthcare platform built with **React** and **Spring Boot**. 
> Designed to centralize patient medical records, streamline doctor consultations, automate pharmacy billing & inventory management, and provide complete hospital operations support.

---

## 🌟 Key Features

### 🏥 Centralized Patient Medical History
* **Unified Health Records**: Patients can store, maintain, and access their entire medical history, past diagnoses, lab reports, and treatment history in one central place.
* **Seamless Accessibility**: Access personal health records anytime, empowering patients with full visibility over their health profile.

### 👨‍⚕️ Doctor Portal & Consultation Management
* **Comprehensive Patient View**: Doctors can easily view full patient medical histories and diagnostic backgrounds prior to or during consultations.
* **Digital Prescriptions & Progress Notes**: Healthcare providers can update patient records, log clinical observations, add treatment plans, and prescribe required medications directly.

### 💊 Pharmacy Integration & Inventory Management
* **Automated Pharmacist Billing**: Works seamlessly for generating bills and invoices for pharmacists upon medication distribution.
* **Direct Medicine Stocking Insights**: Prescriptions from doctors feed directly into the pharmacy module, giving pharmacists immediate visibility on needed medicines and helping them know exactly which medicines to stock and maintain.

### 🏢 Full Hospital Management Capabilities
* **Role-Based Workflows**: Tailored dashboard experiences for Patients, Doctors, Nurses, Pharmacists, and Hospital Administrators.
* **Appointment Scheduling**: Effortless appointment booking, status tracking, and doctor availability schedules.
* **Operational Analytics & Billing**: Comprehensive billing management and patient administration suite.

---

## 📁 Project Structure

```
Cliniva/
├── backend/                   # Spring Boot REST API
│   ├── src/main/              # Java controllers, services & security
│   └── pom.xml                # Maven configuration
├── frontend/                  # React + Vite UI
│   ├── src/                   # Components, hooks, pages & state management
│   └── package.json           # Node dependencies
├── docker-compose.yml         # Container configuration
├── .env.example               # Environment variables template
└── README.md                  # Project documentation
```

---

## ⚙️ Prerequisites & Tech Stack

* **Frontend**: React 18, Vite, Lucide Icons
* **Backend**: Java 17+, Spring Boot 3.2, Spring Security, JPA/Hibernate
* **Database**: PostgreSQL 14+
* **Authentication**: JWT & Google OAuth2 Support

---

## 🔑 Configuration & Setup

### 1. Environment Setup
Copy `.env.example` to `.env` and fill in your configuration settings:
```bash
cp .env.example .env
```

### 2. Database Setup
Ensure PostgreSQL is running and execute the following SQL:
```sql
CREATE DATABASE cliniva_db;
```
The application auto-generates schema and required tables on boot.

---

## 🚀 Quick Start Guide

### 1. Running the Frontend
```bash
cd frontend
npm install
npm run dev
# App will run at http://localhost:5173
```

### 2. Running the Backend
```bash
cd backend
# Windows:
mvnw.cmd spring-boot:run

# Linux / macOS:
./mvnw spring-boot:run
# Backend API will run at http://localhost:8080
```

---

## 📝 License
This project is open-source under the MIT License.
