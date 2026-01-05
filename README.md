# TXLFORMA Frontend

Frontend React + Vite pour l'application TXLFORMA - Gestion de formations.

## 📋 Prérequis

- Node.js 20+
- npm ou yarn
- Backend déployé sur Render

## 🚀 Déploiement sur Vercel

### 1. Importer le projet

1. Allez sur https://vercel.com
2. Cliquez sur "Add New..." → "Project"
3. Importez votre repository GitHub `txlforma-frontend`

### 2. Configurer la variable d'environnement

Dans Vercel → Settings → Environment Variables, ajoutez :

```
VITE_API_BASE_URL=https://votre-backend.onrender.com/api
```

### 3. Déployer

Vercel détecte automatiquement Vite et déploie. Notez l'URL générée.

## 🔧 Développement local

### 1. Installer les dépendances

```bash
npm install
```

### 2. Créer le fichier `.env.local`

```bash
echo "VITE_API_BASE_URL=http://localhost:8080/api" > .env.local
```

### 3. Démarrer le serveur de développement

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

## 📁 Structure

```
front/txlforma-front/
├── src/
│   ├── api/           # Services API
│   ├── components/    # Composants React
│   ├── pages/         # Pages de l'application
│   ├── routes/        # Configuration des routes
│   └── utils/         # Utilitaires
├── public/            # Fichiers statiques
├── vercel.json        # Configuration Vercel
└── package.json       # Dépendances npm
```

## 🔒 Sécurité

**⚠️ CRITIQUE :**
- Les fichiers `.env*` contiennent vos secrets → **NE JAMAIS COMMITTER**
- Utilisez `.env.local` pour le développement local
- En production, utilisez les variables d'environnement sur Vercel

## 🛠️ Technologies

- React 19
- Vite 7
- React Router DOM
- Axios
- Tailwind CSS
- Ant Design
- Stripe.js

## 📦 Scripts

- `npm run dev` - Serveur de développement
- `npm run build` - Build pour la production
- `npm run preview` - Prévisualiser le build
- `npm run lint` - Linter ESLint

## 📚 Documentation

- `DEPLOYMENT.md` - Guide complet de déploiement
- `QUICK_START.md` - Guide rapide (5 min)
# txlforma-front
