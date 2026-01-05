# Services API - Documentation

Ce dossier contient tous les services pour interagir avec l'API backend. Tous les services suivent une structure cohérente et retournent des objets avec `{ success: boolean, data?: any, error?: string }`.

## Importation

Importez les services individuellement :

```javascript
import { authService } from "./api/auth.service";
import { formationService } from "./api/formation.service";
```

## Services disponibles

### authService

Gestion de l'authentification et de l'autorisation.

- `login(email, password)` - Connexion d'un utilisateur
- `register(data)` - Inscription d'un nouvel utilisateur
- `logout()` - Déconnexion et nettoyage du localStorage
- `isAuthenticated()` - Vérifie si l'utilisateur est authentifié
- `getRole()` - Récupère le rôle de l'utilisateur actuel
- `getCurrentUser()` - Récupère les informations de l'utilisateur actuel

### userService

Gestion des utilisateurs.

- `getAllUsers()` - Récupère tous les utilisateurs (ADMIN uniquement)
- `getCurrentUser()` - Récupère l'utilisateur actuellement connecté
- `getUserById(userId)` - Récupère un utilisateur par son ID
- `getFormateurs()` - Récupère tous les formateurs (ADMIN uniquement)
- `createUser(userData)` - Crée un nouvel utilisateur (ADMIN uniquement)
- `updateUser(userId, updatedData)` - Met à jour un utilisateur
- `deleteUser(userId)` - Supprime un utilisateur (ADMIN uniquement)

### categoryService

Gestion des catégories de formations.

- `getAllCategories()` - Récupère toutes les catégories
- `getCategoryById(categoryId)` - Récupère une catégorie par son ID
- `createCategory(categoryData)` - Crée une nouvelle catégorie (ADMIN uniquement)
- `updateCategory(categoryId, updatedData)` - Met à jour une catégorie (ADMIN uniquement)
- `deleteCategory(categoryId)` - Supprime une catégorie (ADMIN uniquement)

### formationService

Gestion des formations.

- `getAllFormations()` - Récupère toutes les formations
- `getFormationsByCategory(categoryId)` - Récupère les formations d'une catégorie
- `getFormationById(formationId)` - Récupère une formation par son ID
- `createFormation(formationData)` - Crée une nouvelle formation (ADMIN uniquement)
- `updateFormation(formationId, updatedData)` - Met à jour une formation (ADMIN uniquement)
- `deleteFormation(formationId)` - Supprime une formation (ADMIN uniquement)

### sessionService

Gestion des sessions de formation.

- `getAllSessions(params)` - Récupère toutes les sessions (filtres optionnels)
- `getSessionsByFormation(formationId)` - Récupère les sessions d'une formation
- `getSessionsByFormateur(formateurId)` - Récupère les sessions d'un formateur
- `getSessionById(sessionId)` - Récupère une session par son ID
- `getFormateurs()` - Récupère tous les formateurs disponibles
- `createSession(sessionData)` - Crée une nouvelle session (ADMIN uniquement)
- `updateSession(sessionId, updatedData)` - Met à jour une session (ADMIN uniquement)
- `deleteSession(sessionId)` - Supprime une session (ADMIN uniquement)

### panierService

Gestion du panier d'achat.

- `getPanier()` - Récupère le panier de l'utilisateur connecté
- `addSessionToPanier(sessionId)` - Ajoute une session au panier
- `removeSessionFromPanier(sessionId)` - Retire une session du panier
- `clearPanier()` - Vide le panier

### paymentService

Gestion des paiements (Stripe).

- `createCheckoutSession(panierId)` - Crée une session de checkout Stripe
- `syncCheckoutSession(sessionId)` - Synchronise une session de checkout

### participationService

Gestion des participations aux sessions.

- `getMyParticipations()` - Récupère les participations de l'utilisateur connecté
- `getParticipationsBySession(sessionId)` - Récupère les participants d'une session (FORMATEUR/ADMIN uniquement)

### attestationService

Gestion des attestations de formation.

- `generateAttestation(participationId)` - Génère une attestation pour une participation
- `downloadAttestation(attestationId)` - Télécharge une attestation en PDF
- `getMyAttestations()` - Récupère toutes les attestations de l'utilisateur connecté
- `regenerateAttestation(attestationId)` - Régénère une attestation (ADMIN uniquement)

### emargementService

Gestion des émargements.

- `signParticipation(participationId, signatureData)` - Signe une participation (émargement)
- `getEmargementsBySession(sessionId)` - Récupère les émargements d'une session (FORMATEUR/ADMIN uniquement)
- `getEmargementByParticipation(participationId)` - Récupère l'émargement d'une participation

### noteService

Gestion des notes des participants.

- `getNotesBySession(sessionId)` - Récupère les notes d'une session (FORMATEUR/ADMIN uniquement)
- `createNote(participationId, noteValue)` - Crée une note pour une participation (FORMATEUR uniquement)
- `updateNote(noteId, noteValue)` - Met à jour une note (FORMATEUR uniquement)
- `getMyNotes()` - Récupère toutes les notes de l'utilisateur connecté
- `getNoteByParticipation(participationId)` - Récupère la note d'une participation

### statisticsService

Gestion des statistiques (ADMIN uniquement).

- `getGlobalStatistics(startDate, endDate)` - Récupère les statistiques globales (dates optionnelles)
- `getAllFormateursStatistics()` - Récupère les statistiques de tous les formateurs
- `getFormateurStatistics(formateurId)` - Récupère les statistiques d'un formateur
- `getSessionDetails(sessionId)` - Récupère les détails statistiques d'une session

## Upload de fichiers

Les uploads de fichiers sont gérés directement dans les composants en utilisant l'instance `api` :

```javascript
import api from "./api/api";

const formData = new FormData();
formData.append("file", file);
const response = await api.post("/files/upload/formations", formData, {
  headers: { "Content-Type": "multipart/form-data" },
});
```

Les endpoints disponibles sont :

- `/files/upload/users` - Upload d'image utilisateur
- `/files/upload/formations` - Upload d'image formation
- `/files/upload/categories` - Upload d'image catégorie
