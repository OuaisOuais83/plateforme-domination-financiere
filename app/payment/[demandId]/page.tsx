'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks/useAuth'

export default function PaymentPage({ params }: { params: { demandId: string } }) {
    const router = useRouter()
    const supabase = createClient()
    const { user, isContributeur } = useAuth()
    const [loading, setLoading] = useState(false)
    const [accepted, setAccepted] = useState(false)
    const [demand, setDemand] = useState<any>(null)

    useEffect(() => {
        if (!user || !isContributeur) {
            router.push('/login')
            return
        }
        fetchDemand()
    }, [user, isContributeur])

    const fetchDemand = async () => {
        const { data } = await supabase
            .from('financial_demands')
            .select(`
                *,
                dominante:dominante_profiles!inner(
                    id,
                    persona,
                    profile:profiles!inner(pseudonym)
                )
            `)
            .eq('id', params.demandId)
            .eq('is_active', true)
            .single()

        setDemand(data)
    }

    const handlePayment = async () => {
        if (!accepted) {
            alert('Vous devez accepter les conditions')
            return
        }

        setLoading(true)

        try {
            // TODO: Appel API Stripe Checkout
            // const response = await fetch('/api/stripe/create-checkout', {
            //     method: 'POST',
            //     body: JSON.stringify({ demandId: params.demandId })
            // })
            // const { checkoutUrl } = await response.json()
            // window.location.href = checkoutUrl

            alert('Intégration Stripe à venir')
        } catch (error) {
            console.error('Error:', error)
            alert('Erreur lors du paiement')
        } finally {
            setLoading(false)
        }
    }

    if (!demand) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#f8f5f6] dark:bg-[#221011]">
                <p className="text-gray-500">Chargement...</p>
            </div>
        )
    }

    return (
        <div className="relative min-h-screen w-full bg-[#f8f5f6] dark:bg-[#221011]">
            {/* Header */}
            <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="max-w-3xl mx-auto px-6 py-4">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-2"
                    >
                        ← Retour
                    </button>
                    <h1 className="text-2xl font-bold text-[#181111] dark:text-white">
                        Paiement
                    </h1>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-3xl mx-auto px-6 py-8">
                {/* Demand Details */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-gray-700 mb-6">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h2 className="text-xl font-bold text-[#181111] dark:text-white mb-1">
                                {demand.title}
                            </h2>
                            <p className="text-sm text-gray-500">
                                Par {demand.dominante.profile.pseudonym}
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                                {demand.amount}€
                            </div>
                            <div className="text-xs text-gray-500">
                                {demand.type === 'récurrent' ? 'Par mois' : 'Paiement unique'}
                            </div>
                        </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {demand.description}
                    </p>

                    <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium text-gray-700 dark:text-gray-200">Contrepartie :</span>
                        <span className="text-gray-600 dark:text-gray-400">
                            {demand.contrepartie === 'aucune' && 'Aucune'}
                            {demand.contrepartie === 'dm_access' && 'Accès aux DMs'}
                            {demand.contrepartie === 'content' && 'Contenu débloqué'}
                            {demand.contrepartie === 'autre' && demand.contrepartie_details}
                        </span>
                    </div>
                </div>

                {/* Disclaimers - Répétés 3 fois selon plan ligne 1195 */}
                <div className="space-y-4 mb-6">
                    {/* Disclaimer 1 */}
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-xl">
                        <p className="text-sm text-red-800 dark:text-red-200 font-semibold">
                            ⚠️ ATTENTION : Ce paiement n'implique aucune interaction garantie
                        </p>
                        <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                            Le paiement exprime une soumission volontaire. Aucune réponse, aucune interaction, aucun privilège n'est garanti.
                        </p>
                    </div>

                    {/* Disclaimer 2 */}
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-xl">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                            <strong>Règle fondamentale :</strong> L'accès aux DMs ou tout autre privilège est à la discrétion exclusive de {demand.dominante.profile.pseudonym}.
                        </p>
                    </div>

                    {/* Disclaimer 3 */}
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-xl">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            ℹ️ Tous les paiements sont définitifs et non remboursables.
                        </p>
                    </div>
                </div>

                {/* Confirmation en 2 étapes - selon plan ligne 963-965 */}
                <div className="mb-6">
                    <label className="flex items-start gap-3 p-4 border-2 border-purple-300 dark:border-purple-700 rounded-xl cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/10">
                        <input
                            type="checkbox"
                            checked={accepted}
                            onChange={(e) => setAccepted(e.target.checked)}
                            className="w-5 h-5 text-purple-600 rounded mt-0.5 flex-shrink-0"
                        />
                        <div className="text-sm">
                            <div className="font-semibold text-[#181111] dark:text-white mb-1">
                                Je comprends et j'accepte
                            </div>
                            <div className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                Je confirme avoir lu et compris que ce paiement de <strong>{demand.amount}€</strong> ne garantit aucune interaction, réponse ou privilège.
                                Toute interaction est un privilège décidé exclusivement par {demand.dominante.profile.pseudonym}.
                            </div>
                        </div>
                    </label>
                </div>

                {/* Payment Button */}
                <button
                    onClick={handlePayment}
                    disabled={!accepted || loading}
                    className="w-full h-14 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-400"
                >
                    {loading ? 'Traitement...' : accepted ? `Payer ${demand.amount}€` : 'Vous devez accepter pour continuer'}
                </button>

                <p className="text-xs text-center text-gray-400 mt-4">
                    Paiement sécurisé par Stripe
                </p>
            </div>
        </div>
    )
}
