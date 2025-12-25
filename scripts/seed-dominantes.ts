// Script de seed automatisé pour créer 5 profils dominantes
// Utilise l'Admin API de Supabase pour créer les users

import { createClient } from '@supabase/supabase-js'

// Configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY! // Clé service role (admin)

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Erreur: Variables d\'environnement manquantes')
    console.log('Assurez-vous que NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont définies')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
})

// Données des profils
const dominantes = [
    {
        email: 'luna@test.com',
        password: 'TestPass123!',
        pseudonym: 'Mistress Luna',
        date_of_birth: '1995-03-15',
        persona: 'soft',
        bio_style: 'Douce mais exigeante, je privilégie les relations respectueuses',
        description: 'Jeune dominante passionnée par le lifestyle. J\'aime les contributeurs dévoués qui comprennent leur place.',
        dms_enabled: true,
        dms_require_payment: true,
        min_payment_for_dm: 50,
        total_earned: 850.00,
        total_contributors: 12,
        demands: [
            { title: 'Contribution Café Quotidien', description: 'Aide-moi à commencer ma journée avec un bon café ☕', amount: 5.00, type: 'ponctuel', contrepartie: 'dm_access' },
            { title: 'Shopping Week-end', description: 'Contribue à mes achats de vêtements pour le week-end', amount: 75.00, type: 'ponctuel', contrepartie: 'content', contrepartie_details: 'Photo try-on' },
            { title: 'Abonnement Mensuel Doux', description: 'Support mensuel pour ta Mistress préférée', amount: 50.00, type: 'récurrent', contrepartie: 'dm_access' }
        ]
    },
    {
        email: 'scarlett@test.com',
        password: 'TestPass123!',
        pseudonym: 'Queen Scarlett',
        date_of_birth: '1992-07-22',
        persona: 'strict',
        bio_style: 'Discipline et obéissance. Pas de compromis.',
        description: 'Dominante expérimentée. Je n\'accepte que les contributeurs sérieux qui connaissent leur valeur. Mes règles sont strictes.',
        dms_enabled: true,
        dms_require_payment: true,
        min_payment_for_dm: 100,
        total_earned: 2450.00,
        total_contributors: 28,
        demands: [
            { title: 'Tribut de Soumission', description: 'Prouve ta valeur avec ce tribut obligatoire', amount: 100.00, type: 'ponctuel', contrepartie: 'aucune' },
            { title: 'Financement Spa Luxe', description: 'Je mérite le meilleur. Paie mon spa premium', amount: 200.00, type: 'ponctuel', contrepartie: 'aucune' },
            { title: 'Soumission Mensuelle', description: 'Engagement mensuel de servitude financière', amount: 150.00, type: 'récurrent', contrepartie: 'dm_access' }
        ]
    },
    {
        email: 'violet@test.com',
        password: 'TestPass123!',
        pseudonym: 'Goddess Violet',
        date_of_birth: '1997-11-08',
        persona: 'humiliating',
        bio_style: 'Tu n\'es rien sans moi. Chaque centime me revient de droit.',
        description: 'Experte en domination psychologique. Si tu es faible et pathétique, c\'est ta chance de servir une vraie Déesse.',
        dms_enabled: true,
        dms_require_payment: true,
        min_payment_for_dm: 75,
        total_earned: 3200.00,
        total_contributors: 35,
        demands: [
            { title: 'Taxe du Loser', description: 'Tu es pathétique. C\'est la taxe minimum pour exister', amount: 25.00, type: 'ponctuel', contrepartie: 'aucune' },
            { title: 'Financement Luxe Déesse', description: 'Paie pour mon style de vie supérieur que tu ne mérites pas', amount: 300.00, type: 'ponctuel', contrepartie: 'content', contrepartie_details: 'Photo exclusive' },
            { title: 'Abonnement Humiliation', description: 'Paiement mensuel pour rester dans ma vie', amount: 120.00, type: 'récurrent', contrepartie: 'dm_access' },
            { title: 'Tribut d\'Adoration', description: 'Montre ton dévouement à ta Déesse', amount: 80.00, type: 'ponctuel', contrepartie: 'autre', contrepartie_details: 'Message personnalisé' }
        ]
    },
    {
        email: 'aurora@test.com',
        password: 'TestPass123!',
        pseudonym: 'Princess Aurora',
        date_of_birth: '1998-05-03',
        persona: 'soft',
        bio_style: 'La vie de luxe que je mérite. Mes admirateurs financent mes rêves.',
        description: 'Jeune princesse qui aime les belles choses. Shopping, voyages, spa... tout ce qu\'une Princesse mérite. Cherche sponsors généreux.',
        dms_enabled: true,
        dms_require_payment: false,
        min_payment_for_dm: 0,
        total_earned: 1650.00,
        total_contributors: 18,
        demands: [
            { title: 'Manucure de Princesse', description: 'Mes ongles doivent être parfaits 💅', amount: 40.00, type: 'ponctuel', contrepartie: 'content', contrepartie_details: 'Selfie ongles' },
            { title: 'Shopping Shoes', description: 'J\'ai besoin de nouvelles chaussures de luxe', amount: 150.00, type: 'ponctuel', contrepartie: 'dm_access' },
            { title: 'Allowance Mensuelle', description: 'Mon argent de poche mensuel 👑', amount: 200.00, type: 'récurrent', contrepartie: 'dm_access' }
        ]
    },
    {
        email: 'noir@test.com',
        password: 'TestPass123!',
        pseudonym: 'Lady Noir',
        date_of_birth: '1993-09-30',
        persona: 'strict',
        bio_style: 'Mystérieuse et exigeante. Seuls les meilleurs peuvent approcher.',
        description: 'Dominante élégante et sophistiquée. Je sélectionne mes contributeurs avec soin. Qualité over quantité.',
        dms_enabled: true,
        dms_require_payment: true,
        min_payment_for_dm: 150,
        total_earned: 4100.00,
        total_contributors: 22,
        demands: [
            { title: 'Dîner Gastronomique', description: 'Contribution à mon dîner dans un restaurant étoilé', amount: 180.00, type: 'ponctuel', contrepartie: 'aucune' },
            { title: 'Tribute d\'Entrée', description: 'Pour avoir le privilège de me parler', amount: 50.00, type: 'ponctuel', contrepartie: 'dm_access' },
            { title: 'Membership Élite', description: 'Accès mensuel exclusif à mon cercle privé', amount: 250.00, type: 'récurrent', contrepartie: 'content', contrepartie_details: 'Photos exclusives mensuelles' }
        ]
    }
]

async function seedDatabase() {
    console.log('🌱 Début du seeding...\n')

    for (const dominante of dominantes) {
        try {
            console.log(`📝 Création de ${dominante.pseudonym}...`)

            // 1. Créer le user dans auth.users
            const { data: authData, error: authError } = await supabase.auth.admin.createUser({
                email: dominante.email,
                password: dominante.password,
                email_confirm: true // Auto-confirmer l'email
            })

            if (authError) {
                console.error(`   ❌ Erreur auth: ${authError.message}`)
                continue
            }

            const userId = authData.user.id
            console.log(`   ✅ User créé (${userId})`)

            // 2. Créer le profil de base
            const { error: profileError } = await supabase
                .from('profiles')
                .insert({
                    id: userId,
                    pseudonym: dominante.pseudonym,
                    date_of_birth: dominante.date_of_birth,
                    role: 'dominante',
                    terms_accepted_at: new Date().toISOString(),
                    terms_version: '1.0'
                })

            if (profileError) {
                console.error(`   ❌ Erreur profile: ${profileError.message}`)
                continue
            }

            console.log(`   ✅ Profile créé`)

            // 3. Créer le profil dominante
            const { error: dominanteError } = await supabase
                .from('dominante_profiles')
                .insert({
                    id: userId,
                    persona: dominante.persona,
                    bio_style: dominante.bio_style,
                    description: dominante.description,
                    dms_enabled: dominante.dms_enabled,
                    dms_require_payment: dominante.dms_require_payment,
                    min_payment_for_dm: dominante.min_payment_for_dm,
                    profile_visibility: 'public',
                    total_earned: dominante.total_earned,
                    total_contributors: dominante.total_contributors
                })

            if (dominanteError) {
                console.error(`   ❌ Erreur dominante_profile: ${dominanteError.message}`)
                continue
            }

            console.log(`   ✅ Dominante profile créé`)

            // 4. Créer les demandes financières
            const demands = dominante.demands.map(d => ({
                dominante_id: userId,
                title: d.title,
                description: d.description,
                amount: d.amount,
                type: d.type,
                contrepartie: d.contrepartie,
                contrepartie_details: d.contrepartie_details || null,
                is_active: true
            }))

            const { error: demandsError } = await supabase
                .from('financial_demands')
                .insert(demands)

            if (demandsError) {
                console.error(`   ❌ Erreur demands: ${demandsError.message}`)
                continue
            }

            console.log(`   ✅ ${demands.length} demandes créées`)
            console.log(`   🎉 ${dominante.pseudonym} - COMPLET\n`)

        } catch (error) {
            console.error(`   ❌ Erreur générale:`, error)
        }
    }

    console.log('✅ Seeding terminé!')
    console.log('\n📊 Résumé:')
    console.log(`   - 5 profils dominantes créés`)
    console.log(`   - 18 demandes financières actives`)
    console.log(`\n🚀 Tu peux maintenant te connecter avec un compte contributeur et swiper sur /discover`)
}

// Exécuter le seed
seedDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('❌ Erreur fatale:', error)
        process.exit(1)
    })
