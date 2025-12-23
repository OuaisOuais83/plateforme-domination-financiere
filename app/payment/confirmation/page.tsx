'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function PaymentConfirmationPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const supabase = createClient()
    const [payment, setPayment] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const paymentId = searchParams.get('payment_id')
        if (paymentId) {
            fetchPaymentDetails(paymentId)
        } else {
            setLoading(false)
        }
    }, [searchParams])

    const fetchPaymentDetails = async (paymentId: string) => {
        try {
            const { data } = await supabase
                .from('payments')
                .select(`
                    *,
                    demand:financial_demands!inner(
                        title,
                        contrepartie,
                        contrepartie_details
                    ),
                    dominante:dominante_profiles!inner(
                        profile:profiles!inner(pseudonym)
                    )
                `)
                .eq('id', paymentId)
                .eq('status', 'completed')
                .single()

            setPayment(data)
        } catch (error) {
            console.error('Error:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#f8f5f6] dark:bg-[#221011]">
                <div className="text-center">
                    <div className="text-4xl mb-4">⏳</div>
                    <p className="text-gray-500">Vérification du paiement...</p>
                </div>
            </div>
        )
    }

    if (!payment) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#f8f5f6] dark:bg-[#221011]">
                <div className="text-center max-w-md mx-auto px-6">
                    <div className="text-6xl mb-4">❌</div>
                    <h1 className="text-2xl font-bold text-[#181111] dark:text-white mb-2">
                        Paiement introuvable
                    </h1>
                    <p className="text-gray-500 mb-6">
                        Nous n'avons pas trouvé les détails de ce paiement.
                    </p>
                    <button
                        onClick={() => router.push('/discover')}
                        className="px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-medium"
                    >
                        Retour à la découverte
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-gray-800/50 flex justify-center items-end sm:items-center min-h-screen">
            {/* Main Container - Bottom Sheet Template Structure ligne 38-126 */}
            <div className="relative w-full max-w-md bg-[#f8f5f6] dark:bg-[#221011] rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                {/* Bottom Sheet Handle - Template ligne 40-42 */}
                <div className="flex flex-col items-center pt-4 pb-2 bg-[#f8f5f6] dark:bg-[#221011]">
                    <div className="h-1.5 w-12 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                </div>

                {/* Top App Bar - Template ligne 44-54 */}
                <div className="flex items-center px-6 py-2 justify-between bg-[#f8f5f6] dark:bg-[#221011]">
                    <div className="w-10"></div>
                    <h2 className="text-gray-900 dark:text-white text-lg font-bold leading-tight tracking-tight flex-1 text-center font-display">
                        Confirmation
                    </h2>
                    <div className="flex w-10 items-center justify-end">
                        <button
                            onClick={() => router.push('/discover')}
                            className="flex items-center justify-center rounded-full h-8 w-8 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>close</span>
                        </button>
                    </div>
                </div>

                {/* Scrollable Content Area - Template ligne 56 */}
                <div className="flex-1 overflow-y-auto px-6 pb-6">
                    {/* Hero Icon with Glow Effect - Template ligne 58-71 */}
                    <div className="flex flex-col items-center justify-center pt-8 pb-4">
                        <div className="relative group">
                            {/* Glowing Pulsing Effect - Template ligne 61 */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-[#f42536] to-orange-400 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                            <div className="relative w-32 h-32 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center border-4 border-white dark:border-gray-700">
                                <span className="text-6xl">✅</span>
                            </div>
                            {/* Badge - Template ligne 67-69 */}
                            <div className="absolute -bottom-2 -right-1 bg-[#f42536] text-white text-xs font-bold px-2 py-1 rounded-full border-2 border-white dark:border-gray-800 shadow-sm">
                                {payment.amount}€
                            </div>
                        </div>
                    </div>

                    {/* Headline Text - Template ligne 73-80 */}
                    <div className="flex flex-col items-center text-center space-y-1 pt-2">
                        <h2 className="text-gray-900 dark:text-white text-2xl font-display font-extrabold leading-tight">
                            Paiement Confirmé !
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium px-4 leading-relaxed">
                            Votre contribution de <span className="text-[#f42536] font-bold">{payment.amount}€</span> pour "{payment.demand.title}" a été traitée avec succès.
                        </p>
                    </div>

                    {/* Payment Details - Template ligne 82-86 style */}
                    <div className="flex flex-col items-center py-6 space-y-2">
                        <div className="text-gray-500 dark:text-gray-400 text-xs">
                            {new Date(payment.paid_at).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </div>
                        <div className="text-gray-600 dark:text-gray-300 text-sm font-medium">
                            Dominante: <strong>{payment.dominante.profile.pseudonym}</strong>
                        </div>
                        <div className="text-gray-600 dark:text-gray-300 text-sm">
                            Contrepartie: {payment.demand.contrepartie === 'aucune' && 'Aucune'}
                            {payment.demand.contrepartie === 'dm_access' && 'Accès DMs'}
                            {payment.demand.contrepartie === 'content' && 'Contenu'}
                            {payment.demand.contrepartie === 'autre' && payment.demand.contrepartie_details}
                        </div>
                    </div>

                    {/* Disclaimer - Template ligne 88-102 style as info card */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-6 border border-yellow-300 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/20">
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">⚠️</span>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-yellow-800 dark:text-yellow-200">Rappel important</span>
                                <span className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                                    Ce paiement ne garantit aucune interaction. L'accès aux DMs ou tout privilège est à la discrétion exclusive de {payment.dominante.profile.pseudonym}.
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Conditional DM Access Message */}
                    {payment.demand.contrepartie === 'dm_access' && (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-6 border border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20">
                            <div className="flex items-start gap-3">
                                <span className="text-2xl">💬</span>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-blue-800 dark:text-blue-200">Demande d'accès envoyée</span>
                                    <span className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                                        Vous serez notifié si {payment.dominante.profile.pseudonym} vous accorde l'accès aux DMs.
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons - Template ligne 109-118 */}
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => router.push(`/profile/${payment.dominante_id}`)}
                            className="relative w-full h-14 bg-[#f42536] hover:bg-red-600 text-white rounded-full font-display font-bold text-lg shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
                        >
                            Voir le profil
                        </button>
                        <button
                            onClick={() => router.push('/discover')}
                            className="w-full h-12 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 font-bold text-sm transition-colors"
                        >
                            Retour à la découverte
                        </button>
                    </div>

                    {/* Legal Footer - Template ligne 120-122 */}
                    <p className="text-[10px] text-center text-gray-400 dark:text-gray-500 mt-2 leading-tight px-4">
                        Un email de confirmation a été envoyé. Paiement sécurisé par Stripe.
                    </p>
                </div>

                {/* Bottom safe area spacer - Template ligne 125 */}
                <div className="h-6 w-full bg-[#f8f5f6] dark:bg-[#221011]"></div>
            </div>
        </div>
    )
}
