'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks/useAuth'

export default function DashboardDominantePage() {
    const router = useRouter()
    const supabase = createClient()
    const { user, profile, loading, isDominante } = useAuth()
    const [stats, setStats] = useState({
        totalEarned: 0,
        totalContributors: 0,
        activeDemands: 0,
        recentPayments: [] as any[]
    })

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login')
            return
        }

        if (!loading && !isDominante) {
            router.push('/discover')
            return
        }

        if (user && isDominante) {
            fetchStats()
        }
    }, [loading, user, isDominante, router])

    const fetchStats = async () => {
        if (!user) return

        try {
            // Récupérer les stats du profil dominante
            const { data: dominanteProfile } = await supabase
                .from('dominante_profiles')
                .select('total_earned, total_contributors')
                .eq('id', user.id)
                .single()

            // Récupérer le nombre de demandes actives
            const { count: demandsCount } = await supabase
                .from('financial_demands')
                .select('id', { count: 'exact', head: true })
                .eq('dominante_id', user.id)
                .eq('is_active', true)

            // Récupérer les paiements récents
            const { data: payments } = await supabase
                .from('payments')
                .select(`
                    id,
                    amount,
                    paid_at,
                    contributor:profiles!contributor_id(pseudonym)
                `)
                .eq('dominante_id', user.id)
                .eq('status', 'completed')
                .order('paid_at', { ascending: false })
                .limit(5)

            setStats({
                totalEarned: dominanteProfile?.total_earned || 0,
                totalContributors: dominanteProfile?.total_contributors || 0,
                activeDemands: demandsCount || 0,
                recentPayments: payments || []
            })
        } catch (error) {
            console.error('Error fetching stats:', error)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#f8f5f6] dark:bg-[#221011]">
                <div className="text-center">
                    <div className="text-4xl mb-4">💎</div>
                    <p className="text-[#181111] dark:text-white">Chargement...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="relative min-h-screen w-full bg-[#f8f5f6] dark:bg-[#221011]">
            {/* Header */}
            <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">💎</span>
                            <div>
                                <h1 className="text-xl font-bold text-[#181111] dark:text-white">
                                    Dashboard Dominante
                                </h1>
                                <p className="text-sm text-gray-500">
                                    Bienvenue, {profile?.pseudonym}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => router.push('/settings')}
                            className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:scale-105 transition-transform"
                        >
                            ⚙️
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Total Earned */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-500 text-sm font-medium">Revenus totaux</span>
                            <span className="text-2xl">💰</span>
                        </div>
                        <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                            {stats.totalEarned.toFixed(2)}€
                        </div>
                    </div>

                    {/* Total Contributors */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-500 text-sm font-medium">Contributeurs</span>
                            <span className="text-2xl">👥</span>
                        </div>
                        <div className="text-3xl font-bold text-pink-600 dark:text-pink-400">
                            {stats.totalContributors}
                        </div>
                    </div>

                    {/* Active Demands */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-500 text-sm font-medium">Demandes actives</span>
                            <span className="text-2xl">📋</span>
                        </div>
                        <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                            {stats.activeDemands}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-gray-700 mb-8">
                    <h2 className="text-lg font-bold text-[#181111] dark:text-white mb-4">
                        Actions rapides
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                            onClick={() => router.push('/dashboard/dominante/demands/create')}
                            className="flex items-center gap-3 p-4 border-2 border-purple-300 dark:border-purple-700 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                        >
                            <span className="text-2xl">➕</span>
                            <div className="text-left">
                                <div className="font-semibold text-[#181111] dark:text-white">Créer une demande</div>
                                <div className="text-sm text-gray-500">Nouvelle demande financière</div>
                            </div>
                        </button>

                        <button
                            onClick={() => router.push('/dashboard/dominante/profile/edit')}
                            className="flex items-center gap-3 p-4 border-2 border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors"
                        >
                            <span className="text-2xl">✏️</span>
                            <div className="text-left">
                                <div className="font-semibold text-[#181111] dark:text-white">Modifier le profil</div>
                                <div className="text-sm text-gray-500">Photos, bio, règles</div>
                            </div>
                        </button>

                        <button
                            onClick={() => router.push('/messages')}
                            className="flex items-center gap-3 p-4 border-2 border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors"
                        >
                            <span className="text-2xl">💬</span>
                            <div className="text-left">
                                <div className="font-semibold text-[#181111] dark:text-white">Messages</div>
                                <div className="text-sm text-gray-500">Gérer les DMs</div>
                            </div>
                        </button>

                        <button
                            onClick={() => router.push('/settings')}
                            className="flex items-center gap-3 p-4 border-2 border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors"
                        >
                            <span className="text-2xl">🔗</span>
                            <div className="text-left">
                                <div className="font-semibold text-[#181111] dark:text-white">Stripe Connect</div>
                                <div className="text-sm text-gray-500">Configurer les retraits</div>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Recent Payments */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-bold text-[#181111] dark:text-white mb-4">
                        Paiements récents
                    </h2>
                    {stats.recentPayments.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <div className="text-4xl mb-2">💸</div>
                            <p>Aucun paiement pour le moment</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {stats.recentPayments.map((payment: any) => (
                                <div
                                    key={payment.id}
                                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
                                >
                                    <div>
                                        <div className="font-medium text-[#181111] dark:text-white">
                                            {payment.contributor?.pseudonym || 'Anonyme'}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {new Date(payment.paid_at).toLocaleDateString('fr-FR')}
                                        </div>
                                    </div>
                                    <div className="text-lg font-bold text-green-600 dark:text-green-400">
                                        +{payment.amount}€
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
