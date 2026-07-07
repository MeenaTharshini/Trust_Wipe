// frontend/src/App.jsx
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Sidebar from "./components/Sidebar";
import PrivateRoute from "./components/PrivateRoute";

import Dashboard from "./pages/Dashboard";
import Devices from "./pages/Devices";
import Verification from "./pages/Verification";
import Certificates from "./pages/Certificates";
import Reports from "./pages/Reports";

import VerifyCertificate from "./pages/VerifyCertificate";
import Services from "./pages/Services";
import About from "./pages/About";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import "./App.css";

function Layout() {
  const location = useLocation();

  // Pages that should NOT display the sidebar
  const publicRoutes = [
    "/",
    "/login",
    "/register",
    "/services",
    "/about",
    "/verify",
    "/verify-certificate",
  ];

  const hideSidebar =
    publicRoutes.includes(location.pathname) ||
    location.pathname.startsWith("/verify/");

  return (
    <div className="app-layout">
      {!hideSidebar && <Sidebar />}

      <main className={hideSidebar ? "auth-content" : "main-content"}>
        <Routes>
          {/* ==========================================
              DEFAULT ROUTE
          ========================================== */}
          <Route path="/" element={<Home />} />

          {/* ==========================================
              PUBLIC ROUTES
          ========================================== */}
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/verify" element={<VerifyCertificate />} />
          <Route path="/verify/:id" element={<VerifyCertificate />} />

          {/* Backward compatibility */}
          <Route
            path="/verify-certificate"
            element={<Navigate to="/verify" replace />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ==========================================
              PROTECTED ROUTES
          ========================================== */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/:id"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/devices"
            element={
              <PrivateRoute>
                <Devices />
              </PrivateRoute>
            }
          />
          <Route
            path="/verification"
            element={
              <PrivateRoute>
                <Verification />
              </PrivateRoute>
            }
          />
          <Route
            path="/certificates"
            element={
              <PrivateRoute>
                <Certificates />
              </PrivateRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <PrivateRoute>
                <Reports />
              </PrivateRoute>
            }
          />

          {/* Legacy Route */}
          <Route
            path="/wipe-jobs"
            element={<Navigate to="/dashboard" replace />}
          />

          {/* ==========================================
              404
          ========================================== */}
          <Route
            path="*"
            element={
              <div className="not-found">
                <h1>404</h1>
                <p>Page Not Found</p>
              </div>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;
