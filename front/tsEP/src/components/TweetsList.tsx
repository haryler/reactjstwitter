// src/components/TweetsList.tsx
import { useContext, useState, FormEvent } from "react"
import { AuthContext } from "../context/AuthContext"

export interface Tweet {
  id: number
  content: string
  authorId: number
  authorUsername: string
  createdAt: string
  likedBy?: number[]
}

interface TweetsListProps {
  tweets: Tweet[]
  setTweets: React.Dispatch<React.SetStateAction<Tweet[]>>
}

export default function TweetsList({ tweets, setTweets }: TweetsListProps) {
  const { token, user } = useContext(AuthContext)

  const [editTweetId, setEditTweetId] = useState<number | null>(null)
  const [editContent, setEditContent] = useState("")

  const handleDeleteTweet = (id: number) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce tweet ?")) return

    fetch(`http://192.168.1.7:3000/tweets/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(() => {
        setTweets((prev) => prev.filter((t) => t.id !== id))
      })
      .catch((err) => console.error("Erreur suppression tweet:", err))
  }

  const handleEditClick = (tweet: Tweet) => {
    setEditTweetId(tweet.id)
    setEditContent(tweet.content)
  }

  const handleCancelEdit = () => {
    setEditTweetId(null)
    setEditContent("")
  }

  const handleUpdateTweet = (e: FormEvent) => {
    e.preventDefault()
    if (editTweetId === null) return

    fetch(`http://192.168.1.7:3000/tweets/${editTweetId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ content: editContent })
    })
      .then((res) => res.json())
      .then((updatedTweet) => {
        setTweets((prev) =>
          prev.map((t) => (t.id === editTweetId ? updatedTweet : t))
        )
        setEditTweetId(null)
        setEditContent("")
      })
      .catch((err) => console.error("Erreur modification tweet:", err))
  }

  const handleToggleLike = async (tweet: Tweet) => {
    if (!user) return

    const hasLiked = tweet.likedBy?.includes(user.id)
    let newLikedBy: number[]

    if (hasLiked) {
      newLikedBy = tweet.likedBy!.filter((id) => id !== user.id)
    } else {
      newLikedBy = tweet.likedBy ? [...tweet.likedBy, user.id] : [user.id]
    }

    try {
      const res = await fetch(`http://192.168.1.7:3000/tweets/${tweet.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ likedBy: newLikedBy }),
      })
      const updatedTweet = await res.json()
      setTweets((prev) =>
        prev.map((t) => (t.id === tweet.id ? updatedTweet : t))
      )
    } catch (err) {
      console.error("Erreur lors du like/unlike:", err)
    }
  }

  return (
    <div>
      {tweets.map((tweet) => (
        <div
          key={tweet.id}
          style={{ border: "1px solid #ccc", margin: "10px 0", padding: "10px" }}
        >
          {editTweetId === tweet.id ? (
            <form onSubmit={handleUpdateTweet}>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                maxLength={280}
                style={{ width: "100%", marginBottom: "10px" }}
              />
              <button type="submit">Enregistrer</button>
              <button type="button" onClick={handleCancelEdit} style={{ marginLeft: "10px" }}>
                Annuler
              </button>
            </form>
          ) : (
            <>
              <p>{tweet.content}</p>
              <small>
                Tweeté par {tweet.authorUsername} – {new Date(tweet.createdAt).toLocaleString()}
              </small>
              <div style={{ marginTop: "10px" }}>
                <button onClick={() => handleToggleLike(tweet)}>
                  {tweet.likedBy && tweet.likedBy.includes(user!.id)
                    ? "Unlike"
                    : "Like"}
                </button>{" "}
                <span>{tweet.likedBy ? tweet.likedBy.length : 0} likes</span>
              </div>

              {tweet.authorId === user?.id && (
                <div style={{ marginTop: "10px" }}>
                  <button onClick={() => handleEditClick(tweet)}>Modifier</button>
                  <button onClick={() => handleDeleteTweet(tweet.id)} style={{ marginLeft: "10px" }}>
                    Supprimer
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  )
}

