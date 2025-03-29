import { FormEvent, useState, useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { useNavigate } from "react-router"

export default function LoginPage() {
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch("http://192.168.1.7:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errData = await response.json()
        setError(errData)
        return
      }

      const data = await response.json()
      login(data.accessToken, data.user)
      navigate("/feed")
    } catch (err) {
      setError("Une erreur est survenue : " + err)
    }
  };

  return (
    <div>
      <h1>Connexion</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleLogin}>
        <div>
          <label>Email :</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label>Mot de passe :</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit">Se connecter</button>
      </form>
    </div>
  )
}

