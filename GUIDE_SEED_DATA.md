# Guide - Créer les Comptes Test Dominantes

## Étape 1: Créer les utilisateurs dans Supabase Auth

1. **Ouvrir Supabase Dashboard** : https://supabase.com/dashboard
2. **Aller dans Authentication > Users**
3. **Créer 5 nouveaux users** avec le bouton "Add User"

Créer ces 5 comptes (email + password temporaire) :

```
Email: luna@test.com
Password: TestPass123!
```

```
Email: scarlett@test.com
Password: TestPass123!
```

```
Email: violet@test.com
Password: TestPass123!
```

```
Email: aurora@test.com
Password: TestPass123!
```

```
Email: noir@test.com
Password: TestPass123!
```

4. **Noter les UUIDs** de chaque user créé

## Étape 2: Modifier le script SQL

1. Ouvrir `supabase/seed_dominantes.sql`
2. Remplacer les UUIDs placeholders par les vrais UUIDs :
   - `aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa` → UUID de luna@test.com
   - `bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb` → UUID de scarlett@test.com
   - `cccccccc-cccc-cccc-cccc-cccccccccccc` → UUID de violet@test.com
   - `dddddddd-dddd-dddd-dddd-dddddddddddd` → UUID de aurora@test.com
   - `eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee` → UUID de noir@test.com

## Étape 3: Exécuter le script SQL

1. **Aller dans SQL Editor** dans Supabase Dashboard
2. **Coller le contenu modifié** de `seed_dominantes.sql`
3. **Exécuter** (Run)

## Étape 4: Vérifier dans l'app

1. Se connecter avec un compte contributeur (ou créer un nouveau compte avec rôle "contributeur")
2. Aller sur `/discover`
3. Swiper les 5 profils !

## Données créées

- ✅ 5 profils dominantes complets
- ✅ 18 demandes financières actives
- ✅ Stats réalistes (revenus, contributeurs)
- ✅ Variété de personas et prix

## Alternative rapide (sans modifier SQL)

Si tu veux tester rapidement SANS créer les vrais users auth :

1. Créer juste 1 compte dominante via l'app normalement
2. Aller dans le SQL Editor
3. Dupliquer ce profil 4 fois en changeant juste le pseudonym et la description
4. Créer les demandes manuellement via l'interface

Mais la méthode avec le script SQL est plus complète !
