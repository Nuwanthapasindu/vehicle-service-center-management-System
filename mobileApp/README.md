# 🚗 Vehicle Service Center Management System — Mobile App

> **Project Name:** Shine Depot (AutoMate)  
> **Platform:** React Native (Expo)  
> **Version:** 1.0.0  
> **Package ID (Android):** `com.shine.depot`  
> **EAS Project ID:** `b7baf0c2-0642-42f4-9278-fb7be373219a`

---

## 📋 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
4. [Architecture & Design Patterns](#4-architecture--design-patterns)
5. [Routing & Navigation](#5-routing--navigation)
6. [Screens & Modules](#6-screens--modules)
7. [State Management](#7-state-management)
8. [Authentication Flow](#8-authentication-flow)
9. [API Layer & Services](#9-api-layer--services)
10. [Real-time Communication](#10-real-time-communication)
11. [Components Library](#11-components-library)
12. [Validation Schemas](#12-validation-schemas)
13. [Utilities](#13-utilities)
14. [Constants & Enums](#14-constants--enums)
15. [Background Tasks & Notifications](#15-background-tasks--notifications)
16. [Color System](#16-color-system)
17. [Dependencies](#17-dependencies)
18. [Scripts & Running the App](#18-scripts--running-the-app)
19. [Environment Variables](#19-environment-variables)

---

## 1. Project Overview

**Shine Depot** (branded internally as "AutoMate") is a comprehensive **Vehicle Service Center Management System** built as a React Native mobile application using Expo. It serves two distinct user roles:

| Role | Description |
|------|-------------|
| **Admin** | Full access to manage bookings, customers, inventory, staff, invoices, supply chain, SMS campaigns, and analytics |
| **Mechanic** | Limited access to view and update job cards assigned to them |

The app acts as an operational hub for a vehicle service center, enabling end-to-end management of the service workflow — from customer onboarding and booking to job execution, invoicing, and inventory tracking.

---

## 2. Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | React Native `0.81.5` |
| **Platform** | Expo `~54.0.34` |
| **Router** | Expo Router `~6.0.23` (file-based routing) |
| **Navigation** | React Navigation Drawer `^7.5.0` |
| **State Management** | Redux Toolkit `^2.11.2` + Redux Thunk `^3.1.0` |
| **HTTP Client** | Axios `^1.7.9` |
| **Real-time** | Socket.IO Client `^4.8.3` |
| **Forms** | Formik `^2.4.9` + Yup `^1.7.1` |
| **Storage** | AsyncStorage `^2.2.0` + Expo SecureStore `^15.0.8` |
| **Icons** | Expo Vector Icons `^15.0.3` + Lucide React Native `^0.577.0` |
| **Animations** | React Native Reanimated `~4.1.1` |
| **Notifications** | Expo Notifications `^56.0.14` |
| **File Handling** | Expo File System `~19.0.22`, Expo Print `~15.0.8`, Expo Sharing `~14.0.8` |
| **Image Picker** | Expo Image Picker `~17.0.11` |
| **Background Tasks** | Expo Background Task `^56.0.15` + Expo Task Manager `^56.0.15` |
| **React Version** | React `19.1.0` |

---

## 3. Project Structure

```
mobileApp/
├── app/                          # Expo Router file-based routes
│   ├── _layout.jsx               # Root layout (Redux Provider, Auth, Socket)
│   ├── (onboarding)/             # Onboarding screens
│   │   └── index.jsx             # Onboarding welcome screen
│   ├── (auth)/                   # Authentication screens
│   │   ├── _layout.jsx
│   │   ├── Login.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── OtpVerification.jsx
│   │   └── PasswordReset.jsx
│   └── (protected)/              # Role-gated screens
│       ├── (admin)/              # Admin-only screens
│       │   ├── _layout.jsx       # Custom Drawer Navigator
│       │   ├── Dashboard.jsx
│       │   ├── notifications.jsx
│       │   ├── booking/          # Booking management
│       │   ├── customers/        # Customer management
│       │   ├── vehicles/         # Vehicle registry
│       │   ├── staff/            # Employee & team management
│       │   ├── (Inventory)/      # Inventory (category, stock, items)
│       │   ├── (InventoryLog)/   # Inventory logs (all / per-item)
│       │   ├── (InventoryAnalysis)/ # Inventory analytics
│       │   ├── supplychain/      # Suppliers & purchase orders
│       │   ├── serviceAndPackage/ # Service catalog & packages
│       │   ├── invoice/          # Invoices
│       │   ├── reviews/          # Review moderation
│       │   ├── timeslots/        # Time slot configuration
│       │   ├── gallery/          # Photo gallery management
│       │   ├── smsCampaign/      # SMS marketing campaigns
│       │   └── revenue/          # Revenue analytics (hidden drawer)
│       └── (mechanic)/           # Mechanic-only screens
│           ├── _layout.jsx
│           └── Home.jsx          # Mechanic job card view
├── components/                   # Reusable UI components
├── services/                     # API service modules
├── store/                        # Redux store & slices
├── context/                      # React Context providers
├── hooks/                        # Custom React hooks
├── schema/                       # Yup validation schemas
├── constants/                    # App-wide constants
├── utils/                        # Utility functions
├── templates/                    # PDF templates
├── assets/                       # Images, icons, fonts
├── app.json                      # Expo app configuration
└── package.json                  # Node dependencies
```

---

## 4. Architecture & Design Patterns

### Global App Wrapper (`app/_layout.jsx`)
The root layout bootstraps the entire application with the following provider hierarchy:

```
Redux Provider (store)
  └── AuthProvider (AuthContext)
        └── SocketProvider (SocketContext)
              └── <Slot /> (Expo Router screens)
                    └── Toast (global toast notifications)
```

**Key initialization steps at startup:**
1. `storeSubscribe()` — Syncs Redux access token to Axios headers
2. `tokenRefresh()` — Sets up JWT refresh flow
3. `ensureUploadDir()` — Creates local upload directory in device storage
4. `checkOnboardingStatus()` — Redirects to Login if onboarding was already seen

### Role-Based Access Control (RBAC)
The app enforces role-based routing at the navigation layer:
- **ADMIN** → `/(protected)/(admin)/` with a Drawer navigator
- **MECHANIC** → `/(protected)/(mechanic)/` with a simple layout

---

## 5. Routing & Navigation

The app uses **Expo Router** (file-based routing) with **React Navigation Drawer** for the admin section.

### Route Groups

| Group | Path | Purpose |
|-------|------|---------|
| Onboarding | `/(onboarding)/` | First-launch welcome screen |
| Auth | `/(auth)/` | Login, password reset flow |
| Admin Protected | `/(protected)/(admin)/` | Full admin dashboard & modules |
| Mechanic Protected | `/(protected)/(mechanic)/` | Mechanic job view |

### Admin Drawer Navigation

The admin section uses a **custom-styled Drawer navigator** with:
- Custom logo header (AutoMate / SHINE DEPOT branding)
- Active indicator bar on selected items
- Icon + label for each menu item
- Logout button in the footer

**Drawer Menu Items (in order):**

| # | Menu Item | Route | Icon |
|---|-----------|-------|------|
| 1 | Dashboard | `Dashboard` | `grid` |
| 2 | Bookings | `booking` | `calendar-outline` |
| 3 | Customers | `customers` | `people-circle-outline` |
| 4 | Vehicles | `vehicles` | `car-sport-outline` |
| 5 | Staff Management | `staff` | `people-outline` |
| 6 | Inventory | `(Inventory)` | `archive-outline` |
| 7 | Supply Chain | `supplychain` | `bus-outline` |
| 8 | Catalog & Packages | `serviceAndPackage` | `layers-outline` |
| 9 | Invoice | `invoice` | `newspaper-outline` |
| 10 | Reviews | `reviews` | `star-outline` |
| 11 | Time Slots | `timeslots` | `time-outline` |
| 12 | Gallery | `gallery` | `images-outline` |
| 13 | SMS Campaigns | `smsCampaign` | `mail-outline` |

**Hidden (no drawer label):**
- Revenue analytics (`revenue`)
- Notifications (`notifications`)
- Inventory Logs (`(InventoryLog)`)
- Inventory Analysis (`(InventoryAnalysis)`)

---

## 6. Screens & Modules

### 6.1 Auth Module (`app/(auth)/`)

| Screen | File | Description |
|--------|------|-------------|
| Login | `Login.jsx` | Email & password login with JWT |
| Forgot Password | `ForgotPassword.jsx` | Trigger OTP to registered email/phone |
| OTP Verification | `OtpVerification.jsx` | 6-digit OTP entry (react-native-otp-entry) |
| Password Reset | `PasswordReset.jsx` | Set new password after OTP verification |

### 6.2 Onboarding (`app/(onboarding)/`)

| Screen | File | Description |
|--------|------|-------------|
| Welcome | `index.jsx` | First-launch intro screen; sets `HAS_VIEWED_ONBOARDING` flag in AsyncStorage |

### 6.3 Admin Dashboard (`app/(protected)/(admin)/Dashboard.jsx`)
Admin home screen with key stats, quick actions, and an overview of service center activity.

### 6.4 Booking Management (`booking/`)

| Screen | Description |
|--------|-------------|
| `index.jsx` | Redirect entry point |
| `(tabs)/` | Tabbed booking view (e.g., Pending, Confirmed, Completed) |
| `[id].jsx` | Booking detail view with full service info, job card, and actions |
| `manage/` | Booking management actions (reschedule, cancel, assign mechanic) |

### 6.5 Customer Management (`customers/`)

| Screen | Description |
|--------|-------------|
| `index.jsx` | Customer list with search functionality |
| `[id]/` | Customer profile: vehicles, booking history, invoices |

### 6.6 Vehicle Registry (`vehicles/`)

| Screen | Description |
|--------|-------------|
| `index.jsx` | All registered vehicles list |
| `[id].jsx` | Vehicle detail: owner info, service history, specs |

### 6.7 Staff Management (`staff/`)

**Employee sub-module `(employee)/`:**

| Screen | Description |
|--------|-------------|
| `index.jsx` | Employee list |
| `add.jsx` | Add new employee with skills, role, contact |
| `[id].jsx` | Employee detail & edit |

**Team sub-module `(team)/`:**

| Screen | Description |
|--------|-------------|
| `index.jsx` | Team list |
| `add.jsx` | Create new team & assign members |
| `[id].jsx` | Team detail & edit |

### 6.8 Inventory Management (`(Inventory)/`)

Three sub-tabs:

| Sub-module | Description |
|-----------|-------------|
| `(category)/` | Manage inventory categories |
| `(inventory)/` | Core inventory items (CRUD) |
| `(stock)/` | Stock management & adjustments |

### 6.9 Inventory Logs (`(InventoryLog)/`)

| Sub-module | Description |
|-----------|-------------|
| `(all)/` | All inventory action logs across items |
| `(items)/` | Logs filtered per inventory item |

### 6.10 Inventory Analysis (`(InventoryAnalysis)/`)

| Screen | Description |
|--------|-------------|
| `index.jsx` | Visual analytics — stock levels, usage trends |

### 6.11 Supply Chain (`supplychain/`)

| Screen | Description |
|--------|-------------|
| `index.jsx` | Main supply chain view (Suppliers / Orders tabs) |
| `addSupplier.jsx` | Add a new supplier |
| `editSupplier.jsx` | Edit existing supplier details |
| `AddOrder.jsx` | Create new purchase order |
| `editOrder.jsx` | Edit existing purchase order |
| `(tabs)/` | Tab navigation for Suppliers and Supplies |
| `styles.js` | Module-specific StyleSheet |

### 6.12 Service Catalog & Packages (`serviceAndPackage/`)

| Sub-module | Description |
|-----------|-------------|
| `service/` | Define vehicle service types with pricing |
| `package/` | Bundle multiple services into packages with pricing tiers |

### 6.13 Invoice (`invoice/`)

| Screen | Description |
|--------|-------------|
| `index.jsx` | Invoice list view |
| `AddInvoice.jsx` | Create invoice: line items, discount, tax, payment |
| `[id].jsx` | Invoice detail with PDF generation & sharing |

### 6.14 Reviews (`reviews/`)

| Screen | Description |
|--------|-------------|
| `index.jsx` | All/Published filter tabs for customer reviews |
| `[id].jsx` | Review detail view |
| `report.jsx` | Review analytics and ratings report |

### 6.15 Time Slots (`timeslots/`)

| Screen | Description |
|--------|-------------|
| `index.jsx` | View and manage available time slots |
| `add.jsx` | Add new time slot configuration |
| `[id].jsx` | Edit existing time slot |

### 6.16 Gallery (`gallery/`)

| Screen | Description |
|--------|-------------|
| `index.jsx` | Photo gallery of the service center (multi-image upload & management) |

### 6.17 SMS Campaigns (`smsCampaign/`)

| Screen | Description |
|--------|-------------|
| `index.jsx` | SMS campaign history & SMS gateway status |
| `create.jsx` | Compose & schedule SMS campaigns |

### 6.18 Revenue (`revenue/`) — Hidden from Drawer

| Screen | Description |
|--------|-------------|
| `index.jsx` | Revenue analytics chart (accessible from Dashboard) |

### 6.19 Notifications (`notifications.jsx`)
Push notification history & in-app notifications list for admin.

### 6.20 Mechanic Home (`app/(protected)/(mechanic)/Home.jsx`)
Simplified view for mechanics showing their assigned job cards with status update actions (`PENDING` → `START` → `FINISH`).

---

## 7. State Management

### Redux Store (`store/`)

```
store/
├── index.js        # Store configuration
└── slices/
    └── authSlice.js  # Auth state
```

**Store Configuration (`store/index.js`):**
- Uses Redux Toolkit `configureStore`
- Single reducer: `auth`
- Middleware: `redux-thunk`
- `storeSubscribe` — automatically injects `Authorization: Bearer <token>` into all Axios requests when token changes

**Auth Slice (`authSlice.js`):**

| State Key | Type | Description |
|-----------|------|-------------|
| `user` | Object / null | Logged-in user profile (role, name, etc.) |
| `accessToken` | string / null | JWT personal access token |

| Action | Description |
|--------|-------------|
| `setUser(user)` | Set authenticated user profile |
| `setToken(token)` | Set access token |

---

## 8. Authentication Flow

```
App Start
    │
    ├─── Has Onboarded? ──No──→ (onboarding)/index.jsx
    │         │
    │        Yes
    │         ↓
    │    (auth)/Login.jsx
    │         │
    │    Login Success
    │         ↓
    │    Tokens stored in SecureStore
    │    User + Token → Redux Store
    │         │
    │    Role Check
    │    ┌────┴────┐
    │  ADMIN    MECHANIC
    │    │          │
    │ (admin)/  (mechanic)/
    │ Dashboard   Home
    │
    └─── Forgot Password Flow:
          ForgotPassword → OtpVerification → PasswordReset → Login
```

**Token Management:**
- **Access Token** — stored in `expo-secure-store` under `PERSONAL_ACCESS_TOKEN`
- **Refresh Token** — stored in `expo-secure-store` under `REFRESH_TOKEN`
- **Auto-refresh** — `tokenRefresh.js` service handles 401 responses
- **Logout** — clears both tokens from SecureStore, resets Redux state, navigates to Login

---

## 9. API Layer & Services

### Axios Configuration (`services/axios.defaults.js`)
- `baseURL`: `process.env.EXPO_PUBLIC_API_URL`
- `timeout`: 10,000ms
- **Request Interceptor**: Attaches `Authorization: Bearer <token>` from SecureStore
- **Response Interceptor**: On 401, triggers `tokenRefresh()` flow

### Service Modules (`services/`)

| Module | Description |
|--------|-------------|
| `booking/` | Booking CRUD: create, list, update status, cancel |
| `category/` | Inventory category operations |
| `gallery/` | Gallery image upload, list, delete |
| `inventory/` | Inventory item CRUD |
| `invoice/` | Invoice creation, listing, PDF generation |
| `jobCard/` | Job card management for mechanics |
| `notification/` | Fetch notification history |
| `package/` | Service package CRUD |
| `review/` | Review listing, publish/unpublish |
| `service/` | Service definition CRUD |
| `sms/` | SMS campaign creation, scheduling |
| `stock/` | Stock level adjustments |
| `supplychain/` | Supplier & purchase order management |
| `timeslot/` | Time slot CRUD |
| `user/` | User profile, employee, customer management |
| `vehicle/` | Vehicle registration & management |
| `tokenRefresh.js` | JWT token refresh logic |

---

## 10. Real-time Communication

### Socket.IO (`context/SocketContext.js`)

**Connection:** Only established for **ADMIN** role users after authentication.

```
Socket URL: EXPO_PUBLIC_API_URL (stripped of /api/v1 suffix)
Transport: WebSocket
Auth: Bearer <accessToken>
```

**Events:**

| Event | Action |
|-------|--------|
| `connect` | Logs successful connection |
| `connect_error` | Logs connection error |
| `newNotification` | Triggers device vibration (500ms) + Emits `REFRESH_NOTIFICATIONS` event + Shows in-app Toast banner |

**Toast on new notification:**
- Shows notification title & message
- Auto-hides after 6 seconds
- Tapping navigates to `/(protected)/(admin)/booking`

---

## 11. Components Library

### Shared Components (`components/`)

| Component | Description |
|-----------|-------------|
| `CustomButton.jsx` | Reusable styled button |
| `CustomInput.jsx` | Styled text input with label and error |
| `CustomImagePicker.jsx` | Single image selection with preview |
| `MultiImagePicker.jsx` | Multiple image selection & upload manager |
| `DropdownInput.jsx` | Styled dropdown/picker input |
| `CustomerSearchResult.jsx` | Search result row for customer lookup |
| `EmployeeCard.jsx` | Employee summary card |
| `VehicleCard.jsx` | Vehicle summary card with type icon |
| `SwipeableItemCard.jsx` | Swipeable card (edit/delete gesture support) |
| `TimeSlotCard.jsx` | Individual time slot display card |
| `GalleryItem.jsx` | Single gallery photo item |
| `GalleryList.jsx` | Gallery grid list renderer |
| `ReviewItem.jsx` | Customer review display with publish toggle |
| `SmsGatewayStatusCard.jsx` | SMS gateway health status display |
| `AddPricingTierModal.jsx` | Modal for adding pricing tiers to packages |

### Domain-Specific Components

| Folder | Components |
|--------|-----------|
| `components/booking/` | Booking-specific cards and views |
| `components/category/` | Category management components |
| `components/customers/` | Customer-specific UI components |
| `components/inventory/` | Inventory item cards and forms |
| `components/inventoryAnalysis/` | Analytics charts and summaries |
| `components/inventoryLogs/` | Log entry components |
| `components/stock/` | Stock adjustment UI |
| `components/supplychain/` | Supplier and order components |

---

## 12. Validation Schemas

All forms use **Formik** with **Yup** validation schemas defined in `schema/`:

| Schema File | Validates |
|-------------|-----------|
| `authSchemas.js` | Login, forgot password, OTP, reset password |
| `AddEmployeeSchema.js` | Add employee form (name, role, skills, contact) |
| `UpdateEmployeeSchema.js` | Update employee form |
| `CreateTeamSchema.js` | Create team form |
| `categorySchema.js` | Inventory category form |
| `inventorySchema.js` | Inventory item form (name, unit, quantity, price) |
| `inventoryAnalysisSchema.js` | Date range filter for analytics |
| `inventoryLogsSchema.js` | Log filter form |
| `invoice.schema.js` | Invoice creation form |
| `jobCardSchema.js` | Job card status update |
| `manageBooking.schema.js` | Booking management actions |
| `packageSchema.js` | Service package form |
| `purchaseOrder.schema.js` | Purchase order form |
| `review.schema.js` | Review filter/action form |
| `serviceSchema.js` | Service definition form |
| `smsCampaignSchema.js` | SMS campaign creation form |
| `stockSchema.js` | Stock adjustment form |
| `supplier.schema.js` | Supplier registration form |
| `timeslotSchema.js` | Time slot configuration form |

---

## 13. Utilities

| File | Description |
|------|-------------|
| `backgroundWorker.js` | Registers/unregisters background push notification task using Expo Task Manager |
| `dateUtils.js` | Date formatting helpers (display dates, parse API dates) |
| `formatPrice.js` | Currency/price formatting for display |
| `getImageFullUrl.js` | Constructs full image URL from relative path using API base URL |
| `getStatusColor.js` | Returns color code for booking/job card/invoice status strings |
| `pdfGenerator.js` | Generates and shares PDF files using Expo Print & Expo Sharing |
| `timeFormatter.js` | Time formatting utilities (12hr/24hr, duration calculations) |

---

## 14. Constants & Enums

### Enums (`constants/enums.js`)

| Enum Key | Values |
|----------|--------|
| `USER_ROLES` | `ADMIN`, `MECHANIC`, `CUSTOMER` |
| `GENDERS` | `MALE`, `FEMALE` |
| `VEHICLE_TYPES` | `CAR`, `VAN`, `SUV`, `JEEP` |
| `JOBCARD_STATUS` | `PENDING`, `START`, `FINISH` |
| `INVENTORY_UNIT_TYPES` | `Liters`, `Pieces`, `Units`, `Pairs`, `Sets` |
| `INVENTORY_ACTION_TYPES` | `Manual Adjustment`, `Invoice Sale`, `PO Receive`, `Restock` |
| `LOG_PERIODS` | `""` (All), `today`, `weekly`, `monthly`, `yearly`, `custom` |
| `PURCHASE_ORDER_STATUS` | `Draft`, `Sent`, `Received` |
| `MESSAGE_TYPES` | `INSTANT`, `SCHEDULE`, `PROMOTIONAL`, `TRANSACTIONAL` |
| `AVAILABLE_SKILLS` | `Engine Repair`, `Electrical`, `Body Wash`, `Diagnostics`, `Tire Service` |
| `INVOICE_STATUS` | `COMPLETED`, `WORK IN PROGRESS` |
| `SUPPLY_CHAIN_TABS` | `SUPPLIERS`, `SUPPLIES` |
| `SUPPLY_CHAIN_VIEWS` | `LIST`, `ADD_SUPPLIER`, `EDIT_SUPPLIER`, `ADD_ORDER`, `EDIT_ORDER` |
| `REVIEW_FILTER_TABS` | `All`, `Published` |
| `REVIEW_ACTION_LABELS` | `Publish`, `Unpublish` |

### Storage Keys (`constants/storageKeys.js`)

| Key | Storage Type | Purpose |
|-----|-------------|---------|
| `PERSONAL_ACCESS_TOKEN` | SecureStore | JWT access token |
| `REFRESH_TOKEN` | SecureStore | JWT refresh token |
| `HAS_VIEWED_ONBOARDING` | AsyncStorage | Onboarding completion flag |

---

## 15. Background Tasks & Notifications

### Background Notification Worker (`utils/backgroundWorker.js`)

- Registered **only for ADMIN** role users (via `AuthContext`)
- Uses `expo-background-task` and `expo-task-manager`
- Functions:
  - `registerBackgroundNotificationTask()` — Registers the background push notification fetch task
  - `unregisterBackgroundNotificationTask()` — Unregisters on logout or role change

### Hooks (`hooks/`)

| Hook | Description |
|------|-------------|
| `useAuth.js` | Shortcut to access `AuthContext` values (`isAuthenticated`, `profile`, `logout`) |
| `useAsyncStorage.js` | Async read/write/delete from AsyncStorage |
| `useSecureStorage.js` | Read/write/delete from Expo SecureStore |

---

## 16. Color System

Defined in `constants/colors.js`:

| Token | Hex | Usage |
|-------|-----|-------|
| `PRIMARY` | `#8EDB00` | Brand green — active states, highlights, buttons |
| `BACKGROUND_COLOR` | `#F8F9FA` | App background |
| `LIGHT` | `#FFFFFF` | Cards, drawer background |
| `DARK` | `#1A1D23` | Headers, primary text |
| `SECONDARY` | `#64748B` | Muted text, inactive icons |
| `BORDER_COLOR` | `#E2E8F0` | Input borders, separators |
| `DANGER_COLOR` | `#EF4444` | Error states, logout button |

---

## 17. Dependencies

### Runtime Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `expo` | `~54.0.34` | Core Expo SDK |
| `react-native` | `0.81.5` | Core RN framework |
| `expo-router` | `~6.0.23` | File-based routing |
| `@react-navigation/drawer` | `^7.5.0` | Drawer navigation |
| `@reduxjs/toolkit` | `^2.11.2` | Redux state management |
| `react-redux` | `^9.2.0` | Redux React bindings |
| `redux-thunk` | `^3.1.0` | Async Redux middleware |
| `axios` | `^1.7.9` | HTTP client |
| `socket.io-client` | `^4.8.3` | Real-time WebSocket client |
| `formik` | `^2.4.9` | Form state management |
| `yup` | `^1.7.1` | Schema validation |
| `expo-secure-store` | `^15.0.8` | Encrypted token storage |
| `@react-native-async-storage/async-storage` | `^2.2.0` | General key-value storage |
| `expo-notifications` | `^56.0.14` | Push notifications |
| `expo-background-task` | `^56.0.15` | Background processing |
| `expo-task-manager` | `^56.0.15` | Background task registry |
| `expo-image-picker` | `~17.0.11` | Camera/gallery image picker |
| `expo-file-system` | `~19.0.22` | File I/O operations |
| `expo-print` | `~15.0.8` | PDF printing |
| `expo-sharing` | `~14.0.8` | Native share sheet |
| `react-native-gesture-handler` | `~2.28.0` | Gesture detection |
| `react-native-reanimated` | `~4.1.1` | Animations |
| `react-native-toast-message` | `^2.3.3` | In-app toast notifications |
| `react-native-otp-entry` | `^1.8.5` | OTP input component |
| `@react-native-community/datetimepicker` | `8.4.4` | Native date/time picker |
| `@react-native-picker/picker` | `2.11.1` | Native dropdown picker |
| `lucide-react-native` | `^0.577.0` | Icon set |
| `@expo/vector-icons` | `^15.0.3` | Extended icon set (Ionicons etc.) |

---

## 18. Scripts & Running the App

```bash
# Install dependencies
yarn install

# Start Expo dev server
yarn start

# Run on Android
yarn android

# Run on iOS
yarn ios

# Run on Web
yarn web
```

> **Requires:** Node.js, Yarn, Expo CLI, and either Android Studio (Android) or Xcode (iOS)

---

## 19. Environment Variables

Create a `.env` file based on `.env.example`:

```env
EXPO_PUBLIC_API_URL=https://your-api-url.com/api/v1
```

| Variable | Description |
|----------|-------------|
| `EXPO_PUBLIC_API_URL` | Backend REST API base URL (also used to derive WebSocket URL by stripping `/api/v1`) |

> **Note:** The Socket.IO URL is derived dynamically: the `/api/v1` suffix is stripped from `EXPO_PUBLIC_API_URL` to get the root server URL.

---

## 📊 Module Summary

```
Total App Screens:        ~45+ screens
Total Service Modules:    16 API service domains
Total Validation Schemas: 19 Yup schemas
Total UI Components:      23+ reusable components
Total Utility Functions:  7 utility modules
User Roles:               2 (Admin, Mechanic)
Navigation Type:          Drawer (Admin) / Stack (Mechanic)
```

---

*Generated on: 2026-06-30 | Antigravity AI Documentation*
