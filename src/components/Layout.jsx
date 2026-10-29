import { NavLink, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Layout() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const saved = localStorage.getItem("sgps-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const next = saved || (prefersDark ? "dark" : "light");
    setTheme(next);
    document.body.dataset.theme = next;
  }, []);

  useEffect(() => {
    document.body.dataset.theme = theme;
    localStorage.setItem("sgps-theme", theme);
  }, [theme]);

  const navItems = [
    { to: "/", label: "Home" },
    { to: "/app", label: "Practice App" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/curriculum", label: "Curriculum" },
    { to: "/privacy", label: "Privacy" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <>
      <header className="topbar">
        <div className="brand">
          <div className="logo">S</div>
          <div className="brand-copy">
            <span className="eyebrow">Indian vocal training</span>
            <h1>Sa Ga Pa Sargam</h1>
          </div>
        </div>

        <nav className="nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          className="ghost-btn"
          type="button"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? "Light mode" : "Dark mode"}
        </button>
      </header>

      <main className="page-content">
        <Outlet />
      </main>

      <footer className="footer">
        <div>© 2026 Sa Ga Pa Sargam</div>
        <div className="footer-links">
          <NavLink to="/privacy">Privacy</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </div>
      </footer>
    </>
  );
}