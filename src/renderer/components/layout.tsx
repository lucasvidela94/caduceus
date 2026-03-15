import { Outlet, Link, useLocation } from "react-router-dom";
import type { ReactElement } from "react";
import "./layout.css";

const NAV_ITEMS = [
  { path: "/", label: "Dashboard" },
  { path: "/patients", label: "Pacientes" },
  { path: "/patients/new", label: "Nuevo Paciente" }
] as const;

export const Layout = (): ReactElement => {
  const location = useLocation();

  return (
    <div className="layout">
      <nav className="nav">
        <ul className="nav-list">
          {NAV_ITEMS.map((item) => (
            <li key={item.path} className="nav-item">
              <Link
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? "nav-link--active" : ""}`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
};
