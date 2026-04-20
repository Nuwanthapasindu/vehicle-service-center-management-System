# Vehicle Service Center Management System

A full-stack, enterprise-grade solution for managing vehicle service centers. This system streamlines operations including booking management, inventory tracking, invoicing, and customer feedback.

## 🚀 Overview

This project consists of a comprehensive backend API, a modern web dashboard for administrators, and a mobile application for customers and service personnel.

### Key Features

- **🔐 Robust Security**: Role-Based Access Control (RBAC) with JWT authentication for Admin, Mechanic, and Customer roles.
- **📅 Booking System**: Real-time slot management with capacity constraints and automated scheduling.
- **🛠 Service Management**: Integrated Job Cards to track vehicle service progress from start to finish.
- **📦 Inventory & Supply**:
  - Real-time stock level tracking.
  - Automatic inventory deduction upon invoice completion.
  - Purchase Order (PO) management and Supplier tracking.
  - Detailed stock movement logs and reorder alerts.
- **💰 Financial Module**:
  - Dynamic invoice generation for parts and labor.
  - Comprehensive income reporting with custom date ranges.
- **⭐ Customer Feedback**:
  - Review moderation system with internal approval workflows.
  - Admin reply functionality for enhanced customer engagement.
- **📈 Analytical Dashboard**: Real-time stats and breakdowns for quick decision-making.

---

## 🛠 Tech Stack

### Backend (`/server`)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Validation**: Joi
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest & Supertest

### Web Dashboard (`/webapp`)
- **Frontend**: React.jsx
- **Build Tool**: Vite
- **Styling**: Vanilla CSS (Native CSS)
- **Deployment**: Dockerized with Nginx

### Mobile App (`/mobileApp`)
- **Framework**: React Native / Expo
- **Navigation**: Expo Router

---

## 🚦 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- Docker (Optional)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd vehicle-service-center-management-System
   ```

2. **Backend Setup:**
   ```bash
   cd server
   npm install
   # Create a .env file with JWT_SECRET, MONGO_URI, and PORT
   npm run dev
   ```

3. **Webapp Setup:**
   ```bash
   cd webapp
   npm install
   npm run dev
   ```

4. **Mobile App Setup:**
   ```bash
   cd mobileApp
   npm install
   npx expo start
   ```

---

## 🧪 Testing

The backend includes a comprehensive test suite (Unit & Integration).

To run all tests:
```bash
cd server
npm run test:all
```

---

## 🐳 Docker Deployment

The project is container-ready. You can use Docker Compose to spin up the entire stack:

```bash
docker-compose up --build
```

---

## 📄 API Documentation

Once the server is running, you can access the interactive Swagger documentation at:
`http://localhost:<PORT>/api-docs`

---

## 👥 Contributors

- **Nuwantha Pasindu** ([@nuwanthapasindu](https://github.com/nuwanthapasindu))
- **Thisal D** ([@thisal-d](https://github.com/thisal-d))
- **Malki Yasara** ([@malkiyasara](https://github.com/malkiyasara))
- **Chamidu** ([@Chamidu2k04](https://github.com/Chamidu2k04))
- **Dilum** ([@Dizzy-kr](https://github.com/Dizzy-kr))
- **Tharani** ([@Tharani131](https://github.com/Tharani131))

---
*Developed for University Projects.*
