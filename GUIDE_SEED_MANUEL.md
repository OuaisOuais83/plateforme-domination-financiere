# 📝 Guide: Créer les Données de Test

Le script Node.js a échoué à cause d'un problème réseau. Voici la **méthode manuelle** (5 minutes) :

## Étape 1 : Créer les Utilisateurs dans Auth

1. Va sur : https://supabase.com/dashboard/project/rgtvtfzowljvbjgyhphs/auth/users
2. Clique **"Add user"** > **"Create new user"**
3. Crée **5 utilisateurs** avec ces emails :
   - `luna@test.com` (mot de passe: `TestPass123!`)
   - `scarlett@test.com` (mot de passe: `TestPass123!`)
   - `violet@test.com` (mot de passe: `TestPass123!`)
   - `aurora@test.com` (mot de passe: `TestPass123!`)
   - `noir@test.com` (mot de passe: `TestPass123!`)

4. **Pour chaque utilisateur** :
   - Clique sur l'utilisateur dans la liste
   - **COPIE son UUID** (ex: `a1b2c3d4-...`)

## Étape 2 : Modifier le Script SQL

1. Ouvre `supabase/seed_manual.sql`
2. **Remplace** les UUIDs :
   ```sql
   user_id_luna UUID := 'REMPLACER_PAR_UUID_LUNA';
   ```
   Par les vrais UUIDs copiés à l'étape 1

## Étape 3 : Exécuter le Script SQL

1. Va sur : https://supabase.com/dashboard/project/rgtvtfzowljvbjgyhphs/sql/new
2. **Colle TOUT** le contenu de `seed_manual.sql`
3. Clique **"Run"**

## Résultat

Tu auras :
- ✅ 5 profils dominantes complets
- ✅ 18 demandes financières actives
- ✅ Page `/discover` fonctionnelle avec des profils à swiper

## Alternative Ultra-Rapide (si tu veux automatiser)

Si tu veux que je crée un script qui fonctionne, on peut :
1. Utiliser l'API Supabase directement en HTTP (curl)
2. Ou créer un edge function Supabase

Dis-moi si tu veux continuer manuellement ou si tu préfères une autre solution automatisée !
