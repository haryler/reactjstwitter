// src/components/UsersList.tsx
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../context/AuthContext"

interface UserData {
  id: number
  username: string
  email: string
  following?: number[]
}

export default function UsersList() {
  const { token, user, updateCurrentUser } = useContext(AuthContext)
  const [allUsers, setAllUsers] = useState<UserData[]>([])

  useEffect(() => {
    fetch("http://192.168.1.7:3000/users", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => setAllUsers(data))
      .catch((err) => console.error("Erreur chargement utilisateurs:", err))
  }, [token])

  const handleFollow = async (targetId: number) => {
    if (!user || !updateCurrentUser) return

    const newFollowing = [...(user.following || []), targetId]

    try {
      const res = await fetch(`http://192.168.1.7:3000/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ following: newFollowing })
      })
      const updatedUser = await res.json()

      updateCurrentUser(updatedUser)
    } catch (err) {
      console.error("Erreur follow:", err)
    }
  }

  const handleUnfollow = async (targetId: number) => {
    if (!user || !updateCurrentUser) return
    const newFollowing = (user.following || []).filter((id) => id !== targetId)

    try {
      const res = await fetch(`http://192.168.1.7:3000/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ following: newFollowing })
      })
      const updatedUser = await res.json()
      updateCurrentUser(updatedUser)
    } catch (err) {
      console.error("Erreur unfollow:", err)
    }
  }

  const filteredUsers = allUsers.filter((u) => u.id !== user?.id)

  return (
    <div style={{ border: "1px solid #aaa", padding: "1rem", marginTop: "2rem" }}>
      <h2>Autres utilisateurs</h2>
      {filteredUsers.map((u) => {
        const isFollowed = user?.following?.includes(u.id)

        return (
          <div key={u.id} style={{ marginBottom: "0.5rem" }}>
            <strong>{u.username}</strong> (ID {u.id})
            {"  "}
            {isFollowed ? (
              <button onClick={() => handleUnfollow(u.id)}>Unfollow</button>
            ) : (
              <button onClick={() => handleFollow(u.id)}>Follow</button>
            )}
          </div>
        )
      })}
    </div>
  )
}

