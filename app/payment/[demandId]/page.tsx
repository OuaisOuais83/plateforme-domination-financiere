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
        <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden pb-32 bg-[#f8f5f6] dark:bg-[#221011]">
            {/* TopAppBar - Structure exacte du template premium_subscription_code.html ligne 51-59 */}
            <div className="sticky top-0 z-50 flex items-center bg-[#f8f5f6]/90 dark:bg-[#221011]/90 backdrop-blur-md p-4 pb-2 justify-between">
                <div
                    onClick={() => router.back()}
                    className="text-[#181111] dark:text-white flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer transition-colors"
                >
                    <span className="material-symbols-outlined text-2xl">close</span>
                </div>
                <h2 className="text-[#181111] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
                    Paiement
                </h2>
                <div className="flex w-16 items-center justify-end"></div>
            </div>

            {/* Headline & Body - Structure template ligne 61-68 */}
            <div className="flex flex-col items-center pt-2">
                <h1 className="text-[#181111] dark:text-white tracking-tight text-[32px] font-extrabold leading-tight px-6 text-center pb-2">
                    {demand.title} <span className="text-[#f42536]">— {demand.amount}€</span>
                </h1>
                <p className="text-slate-600 dark:text-slate-400 text-base font-medium leading-normal pb-6 pt-1 px-8 text-center">
                    Demande par {demand.dominante.profile.pseudonym} • {demand.type === 'récurrent' ? 'Paiement récurrent' : 'Paiement unique'}
                </p>
            </div>

            {/* Carousel (Disclaimers) - Adaptation du carousel template ligne 84-133 */}
            <div className="w-full mb-8">
                <div className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory px-4 pb-4">
                    <div className="flex items-stretch gap-4">
                        {/* Disclaimer Card 1 */}
                        <div className="flex h-full flex-col gap-3 rounded-2xl min-w-[280px] w-[280px] snap-center">
                            <div className="w-full bg-gradient-to-br from-red-500 to-red-700 aspect-[4/5] rounded-2xl flex flex-col relative overflow-hidden shadow-lg">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <div className="absolute bottom-4 left-4 right-4">
                                    <span className="text-white mb-2 text-3xl">⚠️</span>
                                    <p className="text-white text-lg font-bold leading-tight">Aucune Interaction Garantie</p>
                                    <p className="text-white/80 text-xs font-medium mt-1">
                                        Ce paiement n'implique aucune réponse, interaction ou privilège garanti. Il exprime uniquement votre soumission volontaire.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Disclaimer Card 2 */}
                        <div className="flex h-full flex-col gap-3 rounded-2xl min-w-[280px] w-[280px] snap-center">
                            <div className="w-full bg-gradient-to-br from-yellow-500 to-orange-600 aspect-[4/5] rounded-2xl flex flex-col relative overflow-hidden shadow-lg">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <div className="absolute bottom-4 left-4 right-4">
                                    <span className="text-white mb-2 text-3xl">🔒</span>
                                    <p className="text-white text-lg font-bold leading-tight">Règle Fondamentale</p>
                                    <p className="text-white/80 text-xs font-medium mt-1">
                                        {demand.dominante.profile.pseudonym} décide seule de l'accès aux DMs et de tout autre privilège. Aucun droit acquis.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Disclaimer Card 3 */}
                        <div className="flex h-full flex-col gap-3 rounded-2xl min-w-[280px] w-[280px] snap-center">
                            <div className="w-full bg-gradient-to-br from-gray-600 to-gray-800 aspect-[4/5] rounded-2xl flex flex-col relative overflow-hidden shadow-lg">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <div className="absolute bottom-4 left-4 right-4">
                                    <span className="text-white mb-2 text-3xl">ℹ️</span>
                                    <p className="text-white text-lg font-bold leading-tight">Paiements Définitifs</p>
                                    <p className="text-white/80 text-xs font-medium mt-1">
                                        Tous les paiements sont non remboursables. Aucune réclamation ne sera acceptée.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pricing Card (Demand Details) - Basé sur template ligne 137-178 */}
            <div className="flex flex-col px-4 gap-4 w-full max-w-lg mx-auto mb-6">
                <div className="relative cursor-default">
                    <div className="flex flex-col p-6 rounded-2xl border-2 border-[#f42536] bg-white dark:bg-[#2d1a1b] shadow-lg">
                        <div className="mb-4">
                            <span className="text-2xl font-bold text-[#181111] dark:text-white">{demand.title}</span>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{demand.description}</p>
                        </div>

                        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Contrepartie</span>
                                <span className="text-base font-semibold text-[#181111] dark:text-white">
                                    {demand.contrepartie === 'aucune' && 'Aucune'}
                                    {demand.contrepartie === 'dm_access' && 'Accès DMs'}
                                    {demand.contrepartie === 'content' && 'Contenu débloqué'}
                                    {demand.contrepartie === 'autre' && demand.contrepartie_details}
                                </span>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-3xl font-bold text-[#f42536]">{demand.amount}€</span>
                                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                    {demand.type === 'récurrent' ? 'Par mois' : 'Unique'}
                                </span>
                            </div>
                        </div>

                        {/* Confirmation en 2 étapes */}
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={accepted}
                                onChange={(e) => setAccepted(e.target.checked)}
                                className="w-5 h-5 text-[#f42536] rounded mt-0.5 flex-shrink-0"
                            />
                            <div className="text-sm">
                                <div className="font-semibold text-[#181111] dark:text-white mb-1">
                                    Je comprends et j'accepte
                                </div>
                                <div className="text-gray-600 dark:text-gray-400 leading-relaxed text-xs">
                                    Je confirme que ce paiement de <strong>{demand.amount}€</strong> ne garantit aucune interaction.
                                    Tout privilège est décidé exclusivement par {demand.dominante.profile.pseudonym}.
                                </div>
                            </div>
                        </label>
                    </div>
                </div>
            </div>

            {/* Sticky CTA Footer - Structure exacte template ligne 181-192 */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#f8f5f6] via-[#f8f5f6] to-transparent dark:from-[#221011] dark:via-[#221011] pt-12 z-40">
                <div className="max-w-md mx-auto w-full flex flex-col items-center gap-3">
                    <button
                        onClick={handlePayment}
                        disabled={!accepted || loading}
                        className="w-full bg-[#f42536] hover:bg-red-600 active:scale-95 text-white font-bold text-lg py-4 rounded-full shadow-lg shadow-[#f42536]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400"
                    >
                        {loading ? 'Traitement...' : accepted ? `Payer ${demand.amount}€` : 'Acceptez pour continuer'}
                    </button>
                    <div className="flex gap-4 text-xs font-medium text-slate-400 dark:text-slate-500">
                        <span>Paiement sécurisé par Stripe</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
