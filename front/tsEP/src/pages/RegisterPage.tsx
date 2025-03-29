import { FormEvent, useState, useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { useNavigate } from "react-router"

export default function RegisterPage() {
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPwd, setConfirmPwd] = useState("")
  const [error, setError] = useState("")

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault()

    if (password !== confirmPwd) {
      setError("Les mots de passe ne correspondent pas.")
      return
    }

    let finalUsername = username.trim()
    if(!finalUsername.startsWith("@")) {
        finalUsername = "@" + finalUsername
    }

    if(finalUsername.length === 1) {
        setError("Veuillez saisir un username")
        return
    }


    try {
      const checkResponse = await fetch(
        `http://192.168.1.7:3000/users?username=${encodeURIComponent(finalUsername)}`
      )
      const existingUsers = await checkResponse.json()

      if (Array.isArray(existingUsers) && existingUsers.length > 0) {
        setError("Ce nom d'utilisateur est déjà pris !")
	return
      }
    } catch (err) {
      setError("Erreur verification du username : " + err)
      return
    }

    try {
      const response = await fetch("http://192.168.1.7:3000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: finalUsername, email, password, following: [] }),
      })

      if (!response.ok) {
        const errData = await response.json()
        setError(JSON.stringify(errData))
        return
      }

      const data = await response.json()

      login(data.accessToken, data.user)

      navigate("/feed")
    } catch (err) {
      setError("Une erreur est survenue : " + err)
    }
  }

  return (
    <div>
      <h1>Inscription</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleRegister}>
	<div>
	  <label>Username :</label>
	  <input
	    type="text"
	    value={username}
	    onChange={(e) => setUsername(e.target.value)}
	    required
	  />
	</div>

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

        <div>
          <label>Confirmer le mot de passe :</label>
          <input
            type="password"
            value={confirmPwd}
            onChange={(e) => setConfirmPwd(e.target.value)}
          />
        </div>

        <button type="submit">S'inscrire</button>
      </form>
    </div>
  )
}

