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
        <div className="relative min-h-screen w-full bg-[#f8f5f6] dark:bg-[#221011]">
            <div className="max-w-3xl mx-auto px-6 py-12">
                {/* Success Icon */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                        <span className="text-5xl">✅</span>
                    </div>
                    <h1 className="text-3xl font-bold text-[#181111] dark:text-white mb-2">
                        Paiement confirmé
                    </h1>
                    <p className="text-gray-500">
                        Merci pour votre contribution
                    </p>
                </div>

                {/* Payment Details */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-gray-700 mb-6">
                    <div className="text-center mb-6">
                        <div className="text-5xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                            {payment.amount}€
                        </div>
                        <div className="text-gray-500">
                            {new Date(payment.paid_at).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </div>
                    </div>

                    <div className="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-4">
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Demande</span>
                            <span className="font-medium text-[#181111] dark:text-white">
                                {payment.demand.title}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Dominante</span>
                            <span className="font-medium text-[#181111] dark:text-white">
                                {payment.dominante.profile.pseudonym}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Contrepartie</span>
                            <span className="font-medium text-[#181111] dark:text-white">
                                {payment.demand.contrepartie === 'aucune' && 'Aucune'}
                                {payment.demand.contrepartie === 'dm_access' && 'Accès DMs'}
                                {payment.demand.contrepartie === 'content' && 'Contenu'}
                                {payment.demand.contrepartie === 'autre' && payment.demand.contrepartie_details}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Disclaimer répété - selon plan ligne 1002 */}
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-300 dark:border-yellow-700 rounded-xl p-5 mb-6">
                    <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                        ⚠️ Rappel important
                    </p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 leading-relaxed">
                        Ce paiement ne garantit aucune interaction. L'accès aux DMs ou tout autre privilège est à la discrétion exclusive de <strong>{payment.dominante.profile.pseudonym}</strong>.
                    </p>
                </div>

                {/* Conditional message for DM access - selon plan ligne 1003 */}
                {payment.demand.contrepartie === 'dm_access' && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-700 rounded-xl p-4 mb-6">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                            💬 <strong>Demande d'accès DM envoyée</strong><br />
                            Vous serez notifié si {payment.dominante.profile.pseudonym} vous accorde l'accès aux messages privés.
                        </p>
                    </div>
                )}

                {/* CTAs - selon plan ligne 1004 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                        onClick={() => router.push(`/profile/${payment.dominante_id}`)}
                        className="h-12 rounded-full border-2 border-purple-600 text-purple-600 dark:text-purple-400 font-medium hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                    >
                        Voir le profil
                    </button>
                    <button
                        onClick={() => router.push('/discover')}
                        className="h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium transition-all shadow-lg"
                    >
                        Retour à la découverte
                    </button>
                </div>

                {/* Email confirmation notice */}
                <p className="text-xs text-center text-gray-400 mt-6">
                    Un email de confirmation a été envoyé à votre adresse.
                </p>
            </div>
        </div>
    )
}
