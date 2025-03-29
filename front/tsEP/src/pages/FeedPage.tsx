// src/pages/FeedPage.tsx
import { useContext, useEffect, useState, FormEvent } from "react"
import { AuthContext } from "../context/AuthContext"
import TweetsList, { Tweet } from "../components/TweetsList"
import UsersList from "../components/UsersList"

export default function FeedPage() {
  const { token, user } = useContext(AuthContext)
  const [tweets, setTweets] = useState<Tweet[]>([])
  const [newTweetContent, setNewTweetContent] = useState("")

  useEffect(() => {
    if (!user) return
    const followingIds = [...(user.following || []), user.id]
    const qs = followingIds.map((id) => `authorId=${id}`).join("&")

    fetch(`http://192.168.1.7:3000/tweets?${qs}&_sort=createdAt&_order=desc`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setTweets(data)
      })
      .catch((err) => console.error("Erreur chargement tweets:", err))
  }, [token, user])

  const handleCreateTweet = (e: FormEvent) => {
    e.preventDefault()

    if (!user) return

    const newTweet = {
      content: newTweetContent,
      authorId: user.id,
      authorUsername: user.username,
      createdAt: new Date().toISOString(),
      likedBy: []
    }

    fetch("http://192.168.1.7:3000/tweets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(newTweet)
    })
      .then((res) => res.json())
      .then((created) => {
        setTweets((prev) => [created, ...prev])
        setNewTweetContent("")
      })
      .catch((err) => console.error("Erreur création tweet:", err))
  };

  return (
    <div>
      <h1>Fil d'actualité</h1>

      <form onSubmit={handleCreateTweet}>
        <textarea
          value={newTweetContent}
          onChange={(e) => setNewTweetContent(e.target.value)}
          placeholder="max 280 caractères"
          required
          maxLength={280}
        />
        <button type="submit">Tweeter</button>
      </form>

    <TweetsList tweets={tweets} setTweets={setTweets} />
    <UsersList />
    </div>
  )
}

