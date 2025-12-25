@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul

set URL=https://rgtvtfzowljvbjgyhphs.supabase.co
set KEY=sb_secret_Jj9Ms1VatEc4Z9HnFoDLjA_WCUFTvdR

echo 🌱 Seeding automatique via curl...
echo.

REM Profil 1: Mistress Luna
echo 📝 Création de Mistress Luna...
curl -s -X POST "%URL%/auth/v1/admin/users" ^
  -H "apikey: %KEY%" ^
  -H "Authorization: Bearer %KEY%" ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"luna@test.com\",\"password\":\"TestPass123!\",\"email_confirm\":true}" > temp1.json

for /f "tokens=2 delims=:" %%a in ('findstr /C:"\"id\"" temp1.json') do (
    set "ID1=%%a"
    set "ID1=!ID1:~2,-2!"
)

curl -s -X POST "%URL%/rest/v1/profiles" ^
  -H "apikey: %KEY%" ^
  -H "Authorization: Bearer %KEY%" ^
  -H "Content-Type: application/json" ^
  -H "Prefer: return=minimal" ^
  -d "{\"id\":\"!ID1!\",\"pseudonym\":\"Mistress Luna\",\"date_of_birth\":\"1995-03-15\",\"role\":\"dominante\",\"terms_accepted_at\":\"2024-01-01T00:00:00Z\",\"terms_version\":\"1.0\"}" >nul

curl -s -X POST "%URL%/rest/v1/dominante_profiles" ^
  -H "apikey: %KEY%" ^
  -H "Authorization: Bearer %KEY%" ^
  -H "Content-Type: application/json" ^
  -H "Prefer: return=minimal" ^
  -d "{\"id\":\"!ID1!\",\"persona\":\"soft\",\"bio_style\":\"Douce mais exigeante\",\"description\":\"Jeune dominante passionnée\",\"dms_enabled\":true,\"dms_require_payment\":true,\"min_payment_for_dm\":50,\"profile_visibility\":\"public\",\"total_earned\":850,\"total_contributors\":12}" >nul

curl -s -X POST "%URL%/rest/v1/financial_demands" ^
  -H "apikey: %KEY%" ^
  -H "Authorization: Bearer %KEY%" ^
  -H "Content-Type: application/json" ^
  -H "Prefer: return=minimal" ^
  -d "[{\"dominante_id\":\"!ID1!\",\"title\":\"Café Quotidien\",\"description\":\"Aide-moi ☕\",\"amount\":5,\"type\":\"ponctuel\",\"contrepartie\":\"dm_access\",\"is_active\":true},{\"dominante_id\":\"!ID1!\",\"title\":\"Shopping Week-end\",\"description\":\"Contribue\",\"amount\":75,\"type\":\"ponctuel\",\"contrepartie\":\"content\",\"contrepartie_details\":\"Photo\",\"is_active\":true},{\"dominante_id\":\"!ID1!\",\"title\":\"Abonnement Mensuel\",\"description\":\"Support\",\"amount\":50,\"type\":\"récurrent\",\"contrepartie\":\"dm_access\",\"is_active\":true}]" >nul

echo ✅ Mistress Luna créée

REM Profil 2: Queen Scarlett
echo 📝 Création de Queen Scarlett...
curl -s -X POST "%URL%/auth/v1/admin/users" ^
  -H "apikey: %KEY%" ^
  -H "Authorization: Bearer %KEY%" ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"scarlett@test.com\",\"password\":\"TestPass123!\",\"email_confirm\":true}" > temp2.json

for /f "tokens=2 delims=:" %%a in ('findstr /C:"\"id\"" temp2.json') do (
    set "ID2=%%a"
    set "ID2=!ID2:~2,-2!"
)

curl -s -X POST "%URL%/rest/v1/profiles" ^
  -H "apikey: %KEY%" ^
  -H "Authorization: Bearer %KEY%" ^
  -H "Content-Type: application/json" ^
  -H "Prefer: return=minimal" ^
  -d "{\"id\":\"!ID2!\",\"pseudonym\":\"Queen Scarlett\",\"date_of_birth\":\"1992-07-22\",\"role\":\"dominante\",\"terms_accepted_at\":\"2024-01-01T00:00:00Z\",\"terms_version\":\"1.0\"}" >nul

curl -s -X POST "%URL%/rest/v1/dominante_profiles" ^
  -H "apikey: %KEY%" ^
  -H "Authorization: Bearer %KEY%" ^
  -H "Content-Type: application/json" ^
  -H "Prefer: return=minimal" ^
  -d "{\"id\":\"!ID2!\",\"persona\":\"strict\",\"bio_style\":\"Discipline et obéissance\",\"description\":\"Dominante expérimentée\",\"dms_enabled\":true,\"dms_require_payment\":true,\"min_payment_for_dm\":100,\"profile_visibility\":\"public\",\"total_earned\":2450,\"total_contributors\":28}" >nul

curl -s -X POST "%URL%/rest/v1/financial_demands" ^
  -H "apikey: %KEY%" ^
  -H "Authorization: Bearer %KEY%" ^
  -H "Content-Type: application/json" ^
  -H "Prefer: return=minimal" ^
  -d "[{\"dominante_id\":\"!ID2!\",\"title\":\"Tribut de Soumission\",\"description\":\"Prouve ta valeur\",\"amount\":100,\"type\":\"ponctuel\",\"contrepartie\":\"aucune\",\"is_active\":true},{\"dominante_id\":\"!ID2!\",\"title\":\"Spa Luxe\",\"description\":\"Le meilleur\",\"amount\":200,\"type\":\"ponctuel\",\"contrepartie\":\"aucune\",\"is_active\":true},{\"dominante_id\":\"!ID2!\",\"title\":\"Soumission Mensuelle\",\"description\":\"Engagement\",\"amount\":150,\"type\":\"récurrent\",\"contrepartie\":\"dm_access\",\"is_active\":true}]" >nul

echo ✅ Queen Scarlett créée

REM Profil 3: Goddess Violet
echo 📝 Création de Goddess Violet...
curl -s -X POST "%URL%/auth/v1/admin/users" ^
  -H "apikey: %KEY%" ^
  -H "Authorization: Bearer %KEY%" ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"violet@test.com\",\"password\":\"TestPass123!\",\"email_confirm\":true}" > temp3.json

for /f "tokens=2 delims=:" %%a in ('findstr /C:"\"id\"" temp3.json') do (
    set "ID3=%%a"
    set "ID3=!ID3:~2,-2!"
)

curl -s -X POST "%URL%/rest/v1/profiles" ^
  -H "apikey: %KEY%" ^
  -H "Authorization: Bearer %KEY%" ^
  -H "Content-Type: application/json" ^
  -H "Prefer: return=minimal" ^
  -d "{\"id\":\"!ID3!\",\"pseudonym\":\"Goddess Violet\",\"date_of_birth\":\"1997-11-08\",\"role\":\"dominante\",\"terms_accepted_at\":\"2024-01-01T00:00:00Z\",\"terms_version\":\"1.0\"}" >nul

curl -s -X POST "%URL%/rest/v1/dominante_profiles" ^
  -H "apikey: %KEY%" ^
  -H "Authorization: Bearer %KEY%" ^
  -H "Content-Type: application/json" ^
  -H "Prefer: return=minimal" ^
  -d "{\"id\":\"!ID3!\",\"persona\":\"humiliating\",\"bio_style\":\"Tu n'es rien sans moi\",\"description\":\"Experte en domination psychologique\",\"dms_enabled\":true,\"dms_require_payment\":true,\"min_payment_for_dm\":75,\"profile_visibility\":\"public\",\"total_earned\":3200,\"total_contributors\":35}" >nul

curl -s -X POST "%URL%/rest/v1/financial_demands" ^
  -H "apikey: %KEY%" ^
  -H "Authorization: Bearer %KEY%" ^
  -H "Content-Type: application/json" ^
  -H "Prefer: return=minimal" ^
  -d "[{\"dominante_id\":\"!ID3!\",\"title\":\"Taxe du Loser\",\"description\":\"Taxe minimum\",\"amount\":25,\"type\":\"ponctuel\",\"contrepartie\":\"aucune\",\"is_active\":true},{\"dominante_id\":\"!ID3!\",\"title\":\"Luxe Déesse\",\"description\":\"Style supérieur\",\"amount\":300,\"type\":\"ponctuel\",\"contrepartie\":\"content\",\"contrepartie_details\":\"Photo\",\"is_active\":true},{\"dominante_id\":\"!ID3!\",\"title\":\"Abonnement Humiliation\",\"description\":\"Mensuel\",\"amount\":120,\"type\":\"récurrent\",\"contrepartie\":\"dm_access\",\"is_active\":true},{\"dominante_id\":\"!ID3!\",\"title\":\"Tribut Adoration\",\"description\":\"Dévouement\",\"amount\":80,\"type\":\"ponctuel\",\"contrepartie\":\"autre\",\"contrepartie_details\":\"Message\",\"is_active\":true}]" >nul

echo ✅ Goddess Violet créée

REM Profil 4: Princess Aurora
echo 📝 Création de Princess Aurora...
curl -s -X POST "%URL%/auth/v1/admin/users" ^
  -H "apikey: %KEY%" ^
  -H "Authorization: Bearer %KEY%" ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"aurora@test.com\",\"password\":\"TestPass123!\",\"email_confirm\":true}" > temp4.json

for /f "tokens=2 delims=:" %%a in ('findstr /C:"\"id\"" temp4.json') do (
    set "ID4=%%a"
    set "ID4=!ID4:~2,-2!"
)

curl -s -X POST "%URL%/rest/v1/profiles" ^
  -H "apikey: %KEY%" ^
  -H "Authorization: Bearer %KEY%" ^
  -H "Content-Type: application/json" ^
  -H "Prefer: return=minimal" ^
  -d "{\"id\":\"!ID4!\",\"pseudonym\":\"Princess Aurora\",\"date_of_birth\":\"1998-05-03\",\"role\":\"dominante\",\"terms_accepted_at\":\"2024-01-01T00:00:00Z\",\"terms_version\":\"1.0\"}" >nul

curl -s -X POST "%URL%/rest/v1/dominante_profiles" ^
  -H "apikey: %KEY%" ^
  -H "Authorization: Bearer %KEY%" ^
  -H "Content-Type: application/json" ^
  -H "Prefer: return=minimal" ^
  -d "{\"id\":\"!ID4!\",\"persona\":\"soft\",\"bio_style\":\"Vie de luxe\",\"description\":\"Princesse qui aime les belles choses\",\"dms_enabled\":true,\"dms_require_payment\":false,\"min_payment_for_dm\":0,\"profile_visibility\":\"public\",\"total_earned\":1650,\"total_contributors\":18}" >nul

curl -s -X POST "%URL%/rest/v1/financial_demands" ^
  -H "apikey: %KEY%" ^
  -H "Authorization: Bearer %KEY%" ^
  -H "Content-Type: application/json" ^
  -H "Prefer: return=minimal" ^
  -d "[{\"dominante_id\":\"!ID4!\",\"title\":\"Manucure\",\"description\":\"Ongles parfaits 💅\",\"amount\":40,\"type\":\"ponctuel\",\"contrepartie\":\"content\",\"contrepartie_details\":\"Selfie\",\"is_active\":true},{\"dominante_id\":\"!ID4!\",\"title\":\"Shopping Shoes\",\"description\":\"Chaussures luxe\",\"amount\":150,\"type\":\"ponctuel\",\"contrepartie\":\"dm_access\",\"is_active\":true},{\"dominante_id\":\"!ID4!\",\"title\":\"Allowance\",\"description\":\"Argent de poche 👑\",\"amount\":200,\"type\":\"récurrent\",\"contrepartie\":\"dm_access\",\"is_active\":true}]" >nul

echo ✅ Princess Aurora créée

REM Profil 5: Lady Noir
echo 📝 Création de Lady Noir...
curl -s -X POST "%URL%/auth/v1/admin/users" ^
  -H "apikey: %KEY%" ^
  -H "Authorization: Bearer %KEY%" ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"noir@test.com\",\"password\":\"TestPass123!\",\"email_confirm\":true}" > temp5.json

for /f "tokens=2 delims=:" %%a in ('findstr /C:"\"id\"" temp5.json') do (
    set "ID5=%%a"
    set "ID5=!ID5:~2,-2!"
)

curl -s -X POST "%URL%/rest/v1/profiles" ^
  -H "apikey: %KEY%" ^
  -H "Authorization: Bearer %KEY%" ^
  -H "Content-Type: application/json" ^
  -H "Prefer: return=minimal" ^
  -d "{\"id\":\"!ID5!\",\"pseudonym\":\"Lady Noir\",\"date_of_birth\":\"1993-09-30\",\"role\":\"dominante\",\"terms_accepted_at\":\"2024-01-01T00:00:00Z\",\"terms_version\":\"1.0\"}" >nul

curl -s -X POST "%URL%/rest/v1/dominante_profiles" ^
  -H "apikey: %KEY%" ^
  -H "Authorization: Bearer %KEY%" ^
  -H "Content-Type: application/json" ^
  -H "Prefer: return=minimal" ^
  -d "{\"id\":\"!ID5!\",\"persona\":\"strict\",\"bio_style\":\"Mystérieuse et exigeante\",\"description\":\"Élégante et sophistiquée\",\"dms_enabled\":true,\"dms_require_payment\":true,\"min_payment_for_dm\":150,\"profile_visibility\":\"public\",\"total_earned\":4100,\"total_contributors\":22}" >nul

curl -s -X POST "%URL%/rest/v1/financial_demands" ^
  -H "apikey: %KEY%" ^
  -H "Authorization: Bearer %KEY%" ^
  -H "Content-Type: application/json" ^
  -H "Prefer: return=minimal" ^
  -d "[{\"dominante_id\":\"!ID5!\",\"title\":\"Dîner Gastronomique\",\"description\":\"Restaurant étoilé\",\"amount\":180,\"type\":\"ponctuel\",\"contrepartie\":\"aucune\",\"is_active\":true},{\"dominante_id\":\"!ID5!\",\"title\":\"Tribute Entrée\",\"description\":\"Privilège de parler\",\"amount\":50,\"type\":\"ponctuel\",\"contrepartie\":\"dm_access\",\"is_active\":true},{\"dominante_id\":\"!ID5!\",\"title\":\"Membership Élite\",\"description\":\"Cercle privé\",\"amount\":250,\"type\":\"récurrent\",\"contrepartie\":\"content\",\"contrepartie_details\":\"Photos\",\"is_active\":true}]" >nul

echo ✅ Lady Noir créée

del temp1.json temp2.json temp3.json temp4.json temp5.json 2>nul

echo.
echo ✅ Seeding terminé!
echo 📊 5 profils dominantes + 18 demandes créées
echo 🚀 Va sur /discover pour voir les profils!
