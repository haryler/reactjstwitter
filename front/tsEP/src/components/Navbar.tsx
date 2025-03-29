import { useContext } from "react";
import { Link, useNavigate } from "react-router"
import { AuthContext } from "../context/AuthContext"

export default function Navbar() {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={{ display: "flex", gap: "1rem", padding: "1rem", background: "#eee" }}>

      {token ? (
        <>
          <Link to="/feed">Fil</Link>
          <Link to="/profile">Profil</Link>
          <button onClick={handleLogout}>Se déconnecter</button>
        </>
      ) : (
        <>
          <Link to="/login">Connexion</Link>
          <Link to="/register">Inscription</Link>
        </>
      )}
    </nav>
  );
}

