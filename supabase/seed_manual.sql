-- Script SQL pour créer 5 profils dominantes avec données complètes
-- À exécuter dans Supabase Dashboard > SQL Editor

-- ⚠️ IMPORTANT : Avant d'exécuter ce script
-- 1. Va sur https://supabase.com/dashboard/project/rgtvtfzowljvbjgyhphs/auth/users
-- 2. Crée manuellement 5 utilisateurs avec ces emails (utilise n'importe quel mot de passe) :
--    - luna@test.com
--    - scarlett@test.com
--    - violet@test.com
--    - aurora@test.com
--    - noir@test.com
-- 3. COPIE l'UUID de chaque utilisateur créé
-- 4. REMPLACE les UUID ci-dessous par les vrais UUID

-- URLs des utilisateurs: Dash-> Auth -> Users, click sur chaque user pour voir son ID

-- Profil 1: Mistress Luna (SOFT)
DO $$
DECLARE
  user_id_luna UUID := 'REMPLACER_PAR_UUID_LUNA';
BEGIN
  -- Profile de base
  INSERT INTO profiles (id, pseudonym, date_of_birth, role, terms_accepted_at, terms_version)
  VALUES (user_id_luna, 'Mistress Luna', '1995-03-15', 'dominante', NOW(), '1.0');
  
  -- Profile dominante
  INSERT INTO dominante_profiles (
    id, persona, bio_style, description, 
    dms_enabled, dms_require_payment, min_payment_for_dm,
    profile_visibility, total_earned, total_contributors
  ) VALUES (
    user_id_luna, 'soft', 
    'Douce mais exigeante, je privilégie les relations respectueuses',
    'Jeune dominante passionnée par le lifestyle. J''aime les contributeurs dévoués qui comprennent leur place.',
    true, true, 50,
    'public', 850.00, 12
  );
  
  -- Demandes financières
  INSERT INTO financial_demands (dominante_id, title, description, amount, type, contrepartie, is_active) VALUES
  (user_id_luna, 'Contribution Café Quotidien', 'Aide-moi à commencer ma journée avec un bon café ☕', 5.00, 'ponctuel', 'dm_access', true),
  (user_id_luna, 'Shopping Week-end', 'Contribue à mes achats de vêtements pour le week-end', 75.00, 'ponctuel', 'content', true),
  (user_id_luna, 'Abonnement Mensuel Doux', 'Support mensuel pour ta Mistress préférée', 50.00, 'récurrent', 'dm_access', true);
  
  UPDATE financial_demands SET contrepartie_details = 'Photo try-on' 
  WHERE dominante_id = user_id_luna AND title = 'Shopping Week-end';
END $$;

-- Profil 2: Queen Scarlett (STRICT)
DO $$
DECLARE
  user_id_scarlett UUID := 'REMPLACER_PAR_UUID_SCARLETT';
BEGIN
  INSERT INTO profiles (id, pseudonym, date_of_birth, role, terms_accepted_at, terms_version)
  VALUES (user_id_scarlett, 'Queen Scarlett', '1992-07-22', 'dominante', NOW(), '1.0');
  
  INSERT INTO dominante_profiles (
    id, persona, bio_style, description, 
    dms_enabled, dms_require_payment, min_payment_for_dm,
    profile_visibility, total_earned, total_contributors
  ) VALUES (
    user_id_scarlett, 'strict', 
    'Discipline et obéissance. Pas de compromis.',
    'Dominante expérimentée. Je n''accepte que les contributeurs sérieux qui connaissent leur valeur. Mes règles sont strictes.',
    true, true, 100,
    'public', 2450.00, 28
  );
  
  INSERT INTO financial_demands (dominante_id, title, description, amount, type, contrepartie, is_active) VALUES
  (user_id_scarlett, 'Tribut de Soumission', 'Prouve ta valeur avec ce tribut obligatoire', 100.00, 'ponctuel', 'aucune', true),
  (user_id_scarlett, 'Financement Spa Luxe', 'Je mérite le meilleur. Paie mon spa premium', 200.00, 'ponctuel', 'aucune', true),
  (user_id_scarlett, 'Soumission Mensuelle', 'Engagement mensuel de servitude financière', 150.00, 'récurrent', 'dm_access', true);
END $$;

-- Profil 3: Goddess Violet (HUMILIATING)
DO $$
DECLARE
  user_id_violet UUID := 'REMPLACER_PAR_UUID_VIOLET';
BEGIN
  INSERT INTO profiles (id, pseudonym, date_of_birth, role, terms_accepted_at, terms_version)
  VALUES (user_id_violet, 'Goddess Violet', '1997-11-08', 'dominante', NOW(), '1.0');
  
  INSERT INTO dominante_profiles (
    id, persona, bio_style, description, 
    dms_enabled, dms_require_payment, min_payment_for_dm,
    profile_visibility, total_earned, total_contributors
  ) VALUES (
    user_id_violet, 'humiliating', 
    'Tu n''es rien sans moi. Chaque centime me revient de droit.',
    'Experte en domination psychologique. Si tu es faible et pathétique, c''est ta chance de servir une vraie Déesse.',
    true, true, 75,
    'public', 3200.00, 35
  );
  
  INSERT INTO financial_demands (dominante_id, title, description, amount, type, contrepartie, contrepartie_details, is_active) VALUES
  (user_id_violet, 'Taxe du Loser', 'Tu es pathétique. C''est la taxe minimum pour exister', 25.00, 'ponctuel', 'aucune', NULL, true),
  (user_id_violet, 'Financement Luxe Déesse', 'Paie pour mon style de vie supérieur que tu ne mérites pas', 300.00, 'ponctuel', 'content', 'Photo exclusive', true),
  (user_id_violet, 'Abonnement Humiliation', 'Paiement mensuel pour rester dans ma vie', 120.00, 'récurrent', 'dm_access', NULL, true),
  (user_id_violet, 'Tribut d''Adoration', 'Montre ton dévouement à ta Déesse', 80.00, 'ponctuel', 'autre', 'Message personnalisé', true);
END $$;

-- Profil 4: Princess Aurora (SOFT)
DO $$
DECLARE
  user_id_aurora UUID := 'REMPLACER_PAR_UUID_AURORA';
BEGIN
  INSERT INTO profiles (id, pseudonym, date_of_birth, role, terms_accepted_at, terms_version)
  VALUES (user_id_aurora, 'Princess Aurora', '1998-05-03', 'dominante', NOW(), '1.0');
  
  INSERT INTO dominante_profiles (
    id, persona, bio_style, description, 
    dms_enabled, dms_require_payment, min_payment_for_dm,
    profile_visibility, total_earned, total_contributors
  ) VALUES (
    user_id_aurora, 'soft', 
    'La vie de luxe que je mérite. Mes admirateurs financent mes rêves.',
    'Jeune princesse qui aime les belles choses. Shopping, voyages, spa... tout ce qu''une Princesse mérite. Cherche sponsors généreux.',
    true, false, 0,
    'public', 1650.00, 18
  );
  
  INSERT INTO financial_demands (dominante_id, title, description, amount, type, contrepartie, contrepartie_details, is_active) VALUES
  (user_id_aurora, 'Manucure de Princesse', 'Mes ongles doivent être parfaits 💅', 40.00, 'ponctuel', 'content', 'Selfie ongles', true),
  (user_id_aurora, 'Shopping Shoes', 'J''ai besoin de nouvelles chaussures de luxe', 150.00, 'ponctuel', 'dm_access', NULL, true),
  (user_id_aurora, 'Allowance Mensuelle', 'Mon argent de poche mensuel 👑', 200.00, 'récurrent', 'dm_access', NULL, true);
END $$;

-- Profil 5: Lady Noir (STRICT)
DO $$
DECLARE
  user_id_noir UUID := 'REMPLACER_PAR_UUID_NOIR';
BEGIN
  INSERT INTO profiles (id, pseudonym, date_of_birth, role, terms_accepted_at, terms_version)
  VALUES (user_id_noir, 'Lady Noir', '1993-09-30', 'dominante', NOW(), '1.0');
  
  INSERT INTO dominante_profiles (
    id, persona, bio_style, description, 
    dms_enabled, dms_require_payment, min_payment_for_dm,
    profile_visibility, total_earned, total_contributors
  ) VALUES (
    user_id_noir, 'strict', 
    'Mystérieuse et exigeante. Seuls les meilleurs peuvent approcher.',
    'Dominante élégante et sophistiquée. Je sélectionne mes contributeurs avec soin. Qualité over quantité.',
    true, true, 150,
    'public', 4100.00, 22
  );
  
  INSERT INTO financial_demands (dominante_id, title, description, amount, type, contrepartie, contrepartie_details, is_active) VALUES
  (user_id_noir, 'Dîner Gastronomique', 'Contribution à mon dîner dans un restaurant étoilé', 180.00, 'ponctuel', 'aucune', NULL, true),
  (user_id_noir, 'Tribute d''Entrée', 'Pour avoir le privilège de me parler', 50.00, 'ponctuel', 'dm_access', NULL, true),
  (user_id_noir, 'Membership Élite', 'Accès mensuel exclusif à mon cercle privé', 250.00, 'récurrent', 'content', 'Photos exclusives mensuelles', true);
END $$;

-- Vérification
SELECT 
  p.pseudonym,
  dp.persona,
  COUNT(fd.id) as nb_demandes
FROM profiles p
JOIN dominante_profiles dp ON p.id = dp.id
LEFT JOIN financial_demands fd ON p.id = fd.dominante_id
GROUP BY p.id, p.pseudonym, dp.persona
ORDER BY p.pseudonym;
