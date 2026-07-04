import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import VerifyCertificate from "./pages/VerifyCertificate";
import Dashboard from "./pages/Dashboard";
import Devices from "./pages/Devices";
import Verification from "./pages/Verification";
import Certificates from "./pages/Certificates";
import Reports from "./pages/Reports";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">

        <Sidebar />

        <main className="main-content">

          <Routes>

            <Route
              path="/"
              element={<Dashboard />}
            />

            <Route
              path="/devices"
              element={<Devices />}
            />

            <Route
              path="/verification"
              element={<Verification />}
            />

            <Route
              path="/certificates"
              element={<Certificates />}
            />
            <Route
  path="/verify-certificate"
  element={<VerifyCertificate />}
/>
            <Route
              path="/reports"
              element={<Reports />}
            />
            <Route path="/verify/:id" element={<VerifyCertificate/>} />
            <Route
              path="/wipe-jobs"
              element={<Navigate to="/" replace />}
            />

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
    </BrowserRouter>
  );
}

export default App;