# Script PowerShell pour seed automatique via API Supabase
$ErrorActionPreference = "Continue"

$supabaseUrl = "https://rgtvtfzowljvbjgyhphs.supabase.co"
$serviceKey = "sb_secret_Jj9Ms1VatEc4Z9HnFoDLjA_WCUFTvdR"

$headers = @{
    "apikey" = $serviceKey
    "Authorization" = "Bearer $serviceKey"
    "Content-Type" = "application/json"
}

Write-Host "🌱 Début du seeding automatique...`n" -ForegroundColor Green

# Données des profils
$dominantes = @(
    @{
        email = "luna@test.com"
        password = "TestPass123!"
        pseudonym = "Mistress Luna"
        date_of_birth = "1995-03-15"
        persona = "soft"
        bio_style = "Douce mais exigeante"
        description = "Jeune dominante passionnée par le lifestyle."
        dms_enabled = $true
        dms_require_payment = $true
        min_payment_for_dm = 50
        total_earned = 850.00
        total_contributors = 12
        demands = @(
            @{ title = "Café Quotidien"; description = "Aide-moi ☕"; amount = 5.00; type = "ponctuel"; contrepartie = "dm_access" },
            @{ title = "Shopping Week-end"; description = "Contribue à mes achats"; amount = 75.00; type = "ponctuel"; contrepartie = "content"; contrepartie_details = "Photo" },
            @{ title = "Abonnement Mensuel"; description = "Support mensuel"; amount = 50.00; type = "récurrent"; contrepartie = "dm_access" }
        )
    },
    @{
        email = "scarlett@test.com"
        password = "TestPass123!"
        pseudonym = "Queen Scarlett"
        date_of_birth = "1992-07-22"
        persona = "strict"
        bio_style = "Discipline et obéissance"
        description = "Dominante expérimentée. Règles strictes."
        dms_enabled = $true
        dms_require_payment = $true
        min_payment_for_dm = 100
        total_earned = 2450.00
        total_contributors = 28
        demands = @(
            @{ title = "Tribut de Soumission"; description = "Prouve ta valeur"; amount = 100.00; type = "ponctuel"; contrepartie = "aucune" },
            @{ title = "Spa Luxe"; description = "Je mérite le meilleur"; amount = 200.00; type = "ponctuel"; contrepartie = "aucune" },
            @{ title = "Soumission Mensuelle"; description = "Engagement mensuel"; amount = 150.00; type = "récurrent"; contrepartie = "dm_access" }
        )
    },
    @{
        email = "violet@test.com"
        password = "TestPass123!"
        pseudonym = "Goddess Violet"
        date_of_birth = "1997-11-08"
        persona = "humiliating"
        bio_style = "Tu n'es rien sans moi"
        description = "Experte en domination psychologique."
        dms_enabled = $true
        dms_require_payment = $true
        min_payment_for_dm = 75
        total_earned = 3200.00
        total_contributors = 35
        demands = @(
            @{ title = "Taxe du Loser"; description = "Taxe minimum"; amount = 25.00; type = "ponctuel"; contrepartie = "aucune" },
            @{ title = "Luxe Déesse"; description = "Style supérieur"; amount = 300.00; type = "ponctuel"; contrepartie = "content"; contrepartie_details = "Photo" },
            @{ title = "Abonnement Humiliation"; description = "Mensuel"; amount = 120.00; type = "récurrent"; contrepartie = "dm_access" },
            @{ title = "Tribut Adoration"; description = "Dévouement"; amount = 80.00; type = "ponctuel"; contrepartie = "autre"; contrepartie_details = "Message" }
        )
    },
    @{
        email = "aurora@test.com"
        password = "TestPass123!"
        pseudonym = "Princess Aurora"
        date_of_birth = "1998-05-03"
        persona = "soft"
        bio_style = "Vie de luxe"
        description = "Princesse qui aime les belles choses."
        dms_enabled = $true
        dms_require_payment = $false
        min_payment_for_dm = 0
        total_earned = 1650.00
        total_contributors = 18
        demands = @(
            @{ title = "Manucure"; description = "Ongles parfaits 💅"; amount = 40.00; type = "ponctuel"; contrepartie = "content"; contrepartie_details = "Selfie" },
            @{ title = "Shopping Shoes"; description = "Chaussures luxe"; amount = 150.00; type = "ponctuel"; contrepartie = "dm_access" },
            @{ title = "Allowance"; description = "Argent de poche 👑"; amount = 200.00; type = "récurrent"; contrepartie = "dm_access" }
        )
    },
    @{
        email = "noir@test.com"
        password = "TestPass123!"
        pseudonym = "Lady Noir"
        date_of_birth = "1993-09-30"
        persona = "strict"
        bio_style = "Mystérieuse et exigeante"
        description = "Élégante et sophistiquée."
        dms_enabled = $true
        dms_require_payment = $true
        min_payment_for_dm = 150
        total_earned = 4100.00
        total_contributors = 22
        demands = @(
            @{ title = "Dîner Gastronomique"; description = "Restaurant étoilé"; amount = 180.00; type = "ponctuel"; contrepartie = "aucune" },
            @{ title = "Tribute Entrée"; description = "Privilège de parler"; amount = 50.00; type = "ponctuel"; contrepartie = "dm_access" },
            @{ title = "Membership Élite"; description = "Cercle privé"; amount = 250.00; type = "récurrent"; contrepartie = "content"; contrepartie_details = "Photos" }
        )
    }
)

foreach ($dom in $dominantes) {
    try {
        Write-Host "📝 Création de $($dom.pseudonym)..." -ForegroundColor Cyan
        
        # 1. Créer l'utilisateur Auth
        $authBody = @{
            email = $dom.email
            password = $dom.password
            email_confirm = $true
        } | ConvertTo-Json
        
        $authResponse = Invoke-RestMethod -Uri "$supabaseUrl/auth/v1/admin/users" -Method Post -Headers $headers -Body $authBody
        $userId = $authResponse.id
        Write-Host "   ✅ User créé ($userId)" -ForegroundColor Green
        
        # 2. Créer le profile
        $profileBody = @{
            id = $userId
            pseudonym = $dom.pseudonym
            date_of_birth = $dom.date_of_birth
            role = "dominante"
            terms_accepted_at = (Get-Date -Format "o")
            terms_version = "1.0"
        } | ConvertTo-Json
        
        Invoke-RestMethod -Uri "$supabaseUrl/rest/v1/profiles" -Method Post -Headers $headers -Body $profileBody | Out-Null
        Write-Host "   ✅ Profile créé" -ForegroundColor Green
        
        # 3. Créer le profile dominante
        $domProfileBody = @{
            id = $userId
            persona = $dom.persona
            bio_style = $dom.bio_style
            description = $dom.description
            dms_enabled = $dom.dms_enabled
            dms_require_payment = $dom.dms_require_payment
            min_payment_for_dm = $dom.min_payment_for_dm
            profile_visibility = "public"
            total_earned = $dom.total_earned
            total_contributors = $dom.total_contributors
        } | ConvertTo-Json
        
        Invoke-RestMethod -Uri "$supabaseUrl/rest/v1/dominante_profiles" -Method Post -Headers $headers -Body $domProfileBody | Out-Null
        Write-Host "   ✅ Dominante profile créé" -ForegroundColor Green
        
        # 4. Créer les demandes
        $demandsArray = @()
        foreach ($demand in $dom.demands) {
            $demandsArray += @{
                dominante_id = $userId
                title = $demand.title
                description = $demand.description
                amount = $demand.amount
                type = $demand.type
                contrepartie = $demand.contrepartie
                contrepartie_details = $demand.contrepartie_details
                is_active = $true
            }
        }
        
        $demandsBody = $demandsArray | ConvertTo-Json
        Invoke-RestMethod -Uri "$supabaseUrl/rest/v1/financial_demands" -Method Post -Headers $headers -Body $demandsBody | Out-Null
        Write-Host "   ✅ $($dom.demands.Count) demandes créées" -ForegroundColor Green
        Write-Host "   🎉 $($dom.pseudonym) - COMPLET`n" -ForegroundColor Magenta
        
    } catch {
        Write-Host "   ❌ Erreur: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n✅ Seeding terminé!" -ForegroundColor Green
Write-Host "`n📊 Résumé:" -ForegroundColor Yellow
Write-Host "   - 5 profils dominantes créés" -ForegroundColor White
Write-Host "   - 18 demandes financières actives" -ForegroundColor White
Write-Host "`n🚀 Tu peux maintenant:" -ForegroundColor Yellow
Write-Host "   1. Te connecter avec un compte contributeur" -ForegroundColor White
Write-Host "   2. Aller sur /discover pour voir les profils" -ForegroundColor White
