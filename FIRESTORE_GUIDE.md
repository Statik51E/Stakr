# 🔥 Système de Comptes Firestore pour Stakr

## 📋 Vue d'ensemble

Stakr intègre maintenant un système complet de comptes utilisateurs utilisant **Firebase Authentication** et **Firestore** pour la persistance cloud des données.

## 🚀 Fonctionnalités

### ✅ Authentification
- **Inscription** avec email/mot de passe + nom d'utilisateur
- **Connexion** sécurisée
- **Réinitialisation** de mot de passe
- **Déconnexion** automatique

### ✅ Persistance Cloud
- **Sauvegarde automatique** des données dans Firestore
- **Synchronisation** entre appareils
- **Sécurité** : les clés API ne sont PAS sauvegardées dans le cloud
- **Fallback** vers localStorage si déconnecté

### ✅ Interface Utilisateur
- Bouton **👤 Mon Compte** dans le header
- **Modales** d'authentification élégantes
- **Panneau de compte** avec infos utilisateur
- **Export** des données personnelles

## 🛠️ Architecture Technique

### Structure Firestore
```
users/{userId}/
├── user document (profil, stats)
├── data/state (état de l'app)
└── assets/ (images, fonds d'écran)
    ├── chatBgImg
    ├── stageBgImg
    └── messageImages
```

### Sécurité
- **Règles Firestore** : chaque utilisateur ne voit que ses propres données
- **Authentification requise** pour accéder aux données cloud
- **Chiffrement** des données en transit

## 📖 Guide d'utilisation

### Pour les utilisateurs

1. **Créer un compte** :
   - Cliquer sur **👤 Mon Compte**
   - Choisir "Créer un compte"
   - Remplir email, mot de passe, nom d'utilisateur

2. **Se connecter** :
   - Cliquer sur **👤 Mon Compte**
   - Choisir "Se connecter"
   - Entrer email + mot de passe

3. **Synchronisation** :
   - Une fois connecté, vos données sont automatiquement sauvegardées dans le cloud
   - Vous pouvez accéder à vos données depuis n'importe quel appareil

### Pour les développeurs

#### Configuration Firebase
Le projet utilise déjà une configuration Firebase existante. Assurez-vous que :

1. **Firestore** est activé dans la console Firebase
2. **Authentication** avec Email/Password est activé
3. Les **règles de sécurité** sont configurées :

```javascript
// Règles Firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

#### Fonctions principales

```javascript
// Authentification
signUp(email, password, username)     // Créer compte
signIn(email, password)               // Se connecter
signOut()                            // Se déconnecter
resetPassword(email)                 // Reset mot de passe

// Données
saveUserData()                       // Sauvegarde Firestore
loadUserData()                       // Chargement Firestore
exportUserData()                     // Export JSON
```

## 🔧 Personnalisation

### UI/UX
- Les modales utilisent le thème existant de Stakr
- Responsive design pour mobile
- Animations fluides

### Données sauvegardées
- **État complet** de l'application (conversations, projets, quêtes)
- **Apparence** personnalisée (fonds d'écran)
- **Images** des messages
- **Statistiques** utilisateur

### Non sauvegardé (sécurité)
- Clés API Groq (restent en localStorage)
- Données sensibles de configuration

## 🐛 Dépannage

### Problèmes courants

1. **"Erreur lors de la création du compte"**
   - Vérifier que l'email n'est pas déjà utilisé
   - Mot de passe doit faire au moins 6 caractères

2. **Données ne se synchronisent pas**
   - Vérifier la connexion internet
   - S'assurer d'être connecté au compte

3. **Perte de données**
   - Les données sont toujours sauvegardées en localStorage
   - Utiliser "Exporter mes données" pour backup

### Debug
Ouvrir la console développeur pour voir :
- Messages d'authentification Firebase
- Logs de sauvegarde Firestore
- Erreurs de synchronisation

## 🚀 Évolutions futures

- **Synchronisation temps réel** entre appareils
- **Partage de projets** entre utilisateurs
- **Classements globaux** sécurisés
- **Backup automatique** programmé
- **Récupération de compte** améliorée

---

**🎯 Résultat** : Stakr devient une vraie application multi-utilisateur avec persistance cloud sécurisée !</content>
<parameter name="filePath">c:\Users\67luc\stakr\FIRESTORE_GUIDE.md