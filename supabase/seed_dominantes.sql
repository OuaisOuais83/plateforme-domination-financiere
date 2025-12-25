-- Script de seed pour 5 profils dominantes avec demandes
-- À exécuter dans le SQL Editor de Supabase

-- NOTE: Les auth.users doivent être créés via Supabase Auth UI ou API
-- Ce script suppose que les user IDs existent déjà dans auth.users

-- Étape 1: Créer les profils de base
-- IMPORTANT: Remplacer les UUIDs ci-dessous par de vrais UUIDs de auth.users créés dans Supabase Auth

-- Profil 1: Mistress Luna - Soft dominante
INSERT INTO profiles (id, pseudonym, date_of_birth, role, terms_accepted_at, terms_version)
VALUES 
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Mistress Luna', '1995-03-15', 'dominante', NOW(), '1.0')
ON CONFLICT (id) DO NOTHING;

INSERT INTO dominante_profiles (id, persona, bio_style, description, dms_enabled, dms_require_payment, min_payment_for_dm, profile_visibility, total_earned, total_contributors)
VALUES 
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'soft', 'Douce mais exigeante, je privilégie les relations respectueuses', 'Jeune dominante passionnée par le lifestyle. J''aime les contributeurs dévoués qui comprennent leur place.', true, true, 50, 'public', 850.00, 12)
ON CONFLICT (id) DO NOTHING;

-- Profil 2: Queen Scarlett - Strict dominante
INSERT INTO profiles (id, pseudonym, date_of_birth, role, terms_accepted_at, terms_version)
VALUES 
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Queen Scarlett', '1992-07-22', 'dominante', NOW(), '1.0')
ON CONFLICT (id) DO NOTHING;

INSERT INTO dominante_profiles (id, persona, bio_style, description, dms_enabled, dms_require_payment, min_payment_for_dm, profile_visibility, total_earned, total_contributors)
VALUES 
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'strict', 'Discipline et obéissance. Pas de compromis.', 'Dominante expérimentée. Je n''accepte que les contributeurs sérieux qui connaissent leur valeur. Mes règles sont strictes.', true, true, 100, 'public', 2450.00, 28)
ON CONFLICT (id) DO NOTHING;

-- Profil 3: Goddess Violet - Humiliating
INSERT INTO profiles (id, pseudonym, date_of_birth, role, terms_accepted_at, terms_version)
VALUES 
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Goddess Violet', '1997-11-08', 'dominante', NOW(), '1.0')
ON CONFLICT (id) DO NOTHING;

INSERT INTO dominante_profiles (id, persona, bio_style, description, dms_enabled, dms_require_payment, min_payment_for_dm, profile_visibility, total_earned, total_contributors)
VALUES 
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'humiliating', 'Tu n''es rien sans moi. Chaque centime me revient de droit.', 'Experte en domination psychologique. Si tu es faible et pathétique, c''est ta chance de servir une vraie Déesse.', true, true, 75, 'public', 3200.00, 35)
ON CONFLICT (id) DO NOTHING;

-- Profil 4: Princess Aurora - Soft lifestyle
INSERT INTO profiles (id, pseudonym, date_of_birth, role, terms_accepted_at, terms_version)
VALUES 
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Princess Aurora', '1998-05-03', 'dominante', NOW(), '1.0')
ON CONFLICT (id) DO NOTHING;

INSERT INTO dominante_profiles (id, persona, bio_style, description, dms_enabled, dms_require_payment, min_payment_for_dm, profile_visibility, total_earned, total_contributors)
VALUES 
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'soft', 'La vie de luxe que je mérite. Mes admirateurs financent mes rêves.', 'Jeune princesse qui aime les belles choses. Shopping, voyages, spa... tout ce qu''une Princesse mérite. Cherche sponsors généreux.', true, false, 0, 'public', 1650.00, 18)
ON CONFLICT (id) DO NOTHING;

-- Profil 5: Lady Noir - Strict & mysterious
INSERT INTO profiles (id, pseudonym, date_of_birth, role, terms_accepted_at, terms_version)
VALUES 
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Lady Noir', '1993-09-30', 'dominante', NOW(), '1.0')
ON CONFLICT (id) DO NOTHING;

INSERT INTO dominante_profiles (id, persona, bio_style, description, dms_enabled, dms_require_payment, min_payment_for_dm, profile_visibility, total_earned, total_contributors)
VALUES 
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'strict', 'Mystérieuse et exigeante. Seuls les meilleurs peuvent approcher.', 'Dominante élégante et sophistiquée. Je sélectionne mes contributeurs avec soin. Qualité over quantité.', true, true, 150, 'public', 4100.00, 22)
ON CONFLICT (id) DO NOTHING;

-- Étape 2: Créer les demandes financières actives

-- Demandes pour Mistress Luna (soft)
INSERT INTO financial_demands (dominante_id, title, description, amount, type, contrepartie, contrepartie_details, is_active)
VALUES 
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Contribution Café Quotidien', 'Aide-moi à commencer ma journée avec un bon café ☕', 5.00, 'ponctuel', 'dm_access', NULL, true),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Shopping Week-end', 'Contribue à mes achats de vêtements pour le week-end', 75.00, 'ponctuel', 'content', 'Photo try-on', true),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Abonnement Mensuel Doux', 'Support mensuel pour ta Mistress préférée', 50.00, 'récurrent', 'dm_access', NULL, true);

-- Demandes pour Queen Scarlett (strict)
INSERT INTO financial_demands (dominante_id, title, description, amount, type, contrepartie, contrepartie_details, is_active)
VALUES 
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Tribut de Soumission', 'Prouve ta valeur avec ce tribut obligatoire', 100.00, 'ponctuel', 'aucune', NULL, true),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Financement Spa Luxe', 'Je mérite le meilleur. Paie mon spa premium', 200.00, 'ponctuel', 'aucune', NULL, true),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Soumission Mensuelle', 'Engagement mensuel de servitude financière', 150.00, 'récurrent', 'dm_access', NULL, true);

-- Demandes pour Goddess Violet (humiliating)
INSERT INTO financial_demands (dominante_id, title, description, amount, type, contrepartie, contrepartie_details, is_active)
VALUES 
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Taxe du Loser', 'Tu es pathétique. C''est la taxe minimum pour exister', 25.00, 'ponctuel', 'aucune', NULL, true),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Financement Luxe Déesse', 'Paie pour mon style de vie supérieur que tu ne mérites pas', 300.00, 'ponctuel', 'content', 'Photo exclusive', true),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Abonnement Humiliation', 'Paiement mensuel pour rester dans ma vie', 120.00, 'récurrent', 'dm_access', NULL, true),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Tribut d''Adoration', 'Montre ton dévouement à ta Déesse', 80.00, 'ponctuel', 'autre', 'Message personnalisé', true);

-- Demandes pour Princess Aurora (soft spoiled)
INSERT INTO financial_demands (dominante_id, title, description, amount, type, contrepartie, contrepartie_details, is_active)
VALUES 
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Manucure de Princesse', 'Mes ongles doivent être parfaits 💅', 40.00, 'ponctuel', 'content', 'Selfie ongles', true),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Shopping Shoes', 'J''ai besoin de nouvelles chaussures de luxe', 150.00, 'ponctuel', 'dm_access', NULL, true),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Allowance Mensuelle', 'Mon argent de poche mensuel 👑', 200.00, 'récurrent', 'dm_access', NULL, true);

-- Demandes pour Lady Noir (strict selective)
INSERT INTO financial_demands (dominante_id, title, description, amount, type, contrepartie, contrepartie_details, is_active)
VALUES 
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Dîner Gastronomique', 'Contribution à mon dîner dans un restaurant étoilé', 180.00, 'ponctuel', 'aucune', NULL, true),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Tribute d''Entrée', 'Pour avoir le privilège de me parler', 50.00, 'ponctuel', 'dm_access', NULL, true),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Membership Élite', 'Accès mensuel exclusif à mon cercle privé', 250.00, 'récurrent', 'content', 'Photos exclusives mensuelles', true);

-- Résumé des données créées:
-- 5 profils dominantes
-- 18 demandes financières actives au total
-- Variété de personas (soft, strict, humiliating)
-- Variété de prix (5€ à 300€)
-- Différents types de contreparties
-- Stats réalistes (total_earned, total_contributors)
