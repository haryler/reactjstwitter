# Documentation Technique – Clone de Twitter

Ce projet est un clone simplifié de Twitter développé avec React, TypeScript et Vite, utilisant JSON Server (avec json-server-auth) pour simuler une API REST. Il permet l'authentification, la gestion des tweets (création, édition, suppression), le suivi d'utilisateurs (follow/unfollow) et le like des tweets.

## Technologies et Architecture

- **Front-end :** React, TypeScript, Vite, React Router.
- **Back-end :** JSON Server + json-server-auth.
- **Architecture :**
  - `src/components` : Navbar, PrivateRoute, TweetsList, UsersList.
  - `src/context` : AuthContext pour la gestion de l'authentification.
  - `src/pages` : FeedPage, ProfilePage, LoginPage, RegisterPage, NotFoundPage.
  - `db.json` : Collections `users` (incluant `following`) et `tweets` (avec `likedBy`).

## Structure du Code

- **Entrée :** `main.tsx` (encapsule l'application dans `AuthProvider`).
- **Routage :** `App.tsx` (définit les routes et intègre la `Navbar`).
- **Contexte :** `AuthContext.tsx` (gère token, user et fonctions d’authentification).
- **Pages :** Gestion de l’authentification (LoginPage, RegisterPage), fil d’actualité (FeedPage) et profil (ProfilePage).
- **Composants :** 
  - `TweetsList.tsx` pour l'affichage et la gestion CRUD des tweets.
  - `UsersList.tsx` pour afficher et gérer le suivi des utilisateurs.
  - `Navbar.tsx` et `PrivateRoute.tsx` pour la navigation et la protection des routes.
