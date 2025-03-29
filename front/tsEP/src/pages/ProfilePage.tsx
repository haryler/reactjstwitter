// src/pages/ProfilePage.tsx
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import TweetsList, { Tweet } from "../components/TweetsList"

export default function ProfilePage() {
  const { token, user } = useContext(AuthContext)
  const [profileTweets, setProfileTweets] = useState<Tweet[]>([])

  useEffect(() => {
    if (!user) return

    fetch(`http://192.168.1.7:3000/tweets?authorId=${user.id}&_sort=createdAt&_order=desc`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => setProfileTweets(data))
      .catch((err) => console.error("Erreur chargement tweets du profil:", err))
  }, [token, user])

  return (
    <div>
      <h1>Mon Profil</h1>
      <p>Bienvenue {user?.username} ! Voici vos tweets :</p>

      <TweetsList tweets={profileTweets} setTweets={setProfileTweets} />
    </div>
  )
}

