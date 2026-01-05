# Configuration Stripe

## Installation des dépendances

Installez les packages Stripe nécessaires :

```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
```

## Configuration des variables d'environnement

Ajoutez votre clé publique Stripe dans le fichier `.env` :

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

Remplacez `pk_test_...` par votre clé publique Stripe (trouvable dans votre dashboard Stripe).

## Test avec les cartes de test Stripe

Pour tester le paiement, utilisez les cartes de test suivantes :

- **Carte de test réussie** : `4242 4242 4242 4242`
- **Date d'expiration** : N'importe quelle date future (ex: 12/34)
- **CVC** : N'importe quel code à 3 chiffres (ex: 123)
- **Code postal** : N'importe quel code postal (ex: 12345)

### Autres cartes de test

- **Carte nécessitant une authentification 3D Secure** : `4000 0025 0000 3155`
- **Carte refusée** : `4000 0000 0000 0002`

## Notes importantes

1. Assurez-vous que le backend est configuré avec la clé secrète Stripe
2. Le webhook Stripe doit être configuré pour mettre à jour le statut du paiement
3. En mode développement, utilisez `stripe listen` pour recevoir les webhooks localement

