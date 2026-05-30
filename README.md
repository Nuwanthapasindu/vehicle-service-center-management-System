# Vehicle Service Center Management System

A full-stack, enterprise-grade solution for managing vehicle service centers. This system streamlines operations including booking management, inventory tracking, invoicing, and customer feedback.

## 🚀 Overview

This project consists of a comprehensive backend API, a modern web dashboard for administrators, and a mobile application for customers and service personnel.

### Key Features

- **🔐 Robust Security**: Role-Based Access Control (RBAC) with JWT authentication for Admin, Mechanic, and Customer roles. Sanitized search queries with regex protection and query limit enforcement.
- **📅 Booking System**: Real-time slot management with capacity constraints, automated scheduling, booking details status tracking, and phone dialer integration.
- **🛠 Service Management**: Integrated Job Cards to track vehicle service progress from start to finish, with customizable service packages.
- **📦 Inventory & Supply**:
  - Real-time stock level tracking with low-stock alerts.
  - Automatic inventory deduction upon invoice completion.
  - Purchase Order (PO) management and Supplier tracking (featuring interactive supplier contact modal).
  - Tab-based supply chain navigation, detailed stock movement logs, and reorder alerts.
- **💰 Financial & Billing Module**:
  - Dynamic invoice generation for parts and labor with selectable base pricing tiers and manual charge overrides.
  - Comprehensive income reporting with custom date ranges.
  - Styled PDF invoices displaying package service lists as columns and branded header options (logo, address, and operating hours).
- **⭐ Customer Feedback & Gallery**:
  - Review moderation system with internal approval workflows and admin reply functionality.
  - Full-stack photo gallery module supporting multi-image upload, paginated viewing, and atomic cleanup/rollback mechanisms on failure.
- **📈 Analytical Dashboard**: Real-time stats and business metrics, featuring internal SMS gateway status fetching within the dashboard.
- **💬 SMS & Socket Notifications**:
  - Real-time Socket.io alerts notifying admins immediately upon customer booking registration.
  - Branded, automated transactional SMS alerts (OTP verification, password resets, and booking confirmations/reschedules/cancellations) with toast notifications for SMS gateway error handling.
- **📣 SMS Campaign Management**: Bulk promotional or transactional SMS dispatches to active customers with paginated logs and infinite scroll campaign list.
- **🚗 Public Web Portal**:
  - Optimized navbar link ordering (**Home → Gallery → Reviews → About Us → Contact Us**) for enhanced user experience.
  - Dynamic footer loading the first 4 active services dynamically from the backend service package records.
  - Integrated official social links (Instagram/Facebook `@shinedepotlk`) and official customer support hotline (`+94 76 315 3797`).
  - Custom infinite scrolling supported brands marquee ribbon dynamically parsed from service packages.
- **📱 Mobile App Enhancements**:
  - Dedicated bottom tab navigation to display customer invoices with complete billing summaries.
  - Registered vehicles drawer screen with custom card layout, search filter, pagination, and details view (including soft-deleted vehicles).
  - Centralized Stack navigation architecture and abstracted API client services.

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
