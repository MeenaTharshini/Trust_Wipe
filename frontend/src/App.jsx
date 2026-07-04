import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Devices from "./pages/Devices";
import Verification from "./pages/Verification";
import Certificates from "./pages/Certificates";
import Reports from "./pages/Reports";
import VerifyCertificate from "./pages/VerifyCertificate";

import Login from "./pages/Login";
import Register from "./pages/Register";

import PrivateRoute from "./components/PrivateRoute";

import "./App.css";

function Layout() {
  const location = useLocation();

  const authPages = [
    "/login",
    "/register",
  ];

  const hideSidebar =
    authPages.includes(
      location.pathname
    );

  return (
    <div className="app-layout">

      {!hideSidebar && <Sidebar />}

      <main
        className={
          hideSidebar
            ? "auth-content"
            : "main-content"
        }
      >

        <Routes>

          {/* Public Routes */}

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          {/* Protected Routes */}

          <Route
            path="/"
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

          <Route
            path="/verify-certificate"
            element={
              <VerifyCertificate />
            }
          />

          <Route
            path="/verify/:id"
            element={
              <VerifyCertificate />
            }
          />

          <Route
            path="/wipe-jobs"
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />

          <Route
            path="*"
            element={
              <div className="not-found">
                <h1>404</h1>
                <p>
                  Page Not Found
                </p>
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