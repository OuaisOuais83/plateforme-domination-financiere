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
            // Récupérer les stats
            const { data: dominanteProfile } = await supabase
                .from('dominante_profiles')
                .select('total_earned, total_contributors')
                .eq('id', user.id)
                .single()

            const { count: demandsCount } = await supabase
                .from('financial_demands')
                .select('id', { count: 'exact', head: true })
                .eq('dominante_id', user.id)
                .eq('is_active', true)

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
        <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto shadow-2xl bg-[#f8f5f6] dark:bg-[#121212]">
            {/* Sticky Header - Template user_settings ligne 75-80 */}
            <div className="sticky top-0 z-50 flex items-center bg-white/95 dark:bg-[#1e1e1e]/95 backdrop-blur-md p-4 pb-3 justify-between border-b border-gray-100 dark:border-gray-800">
                <h2 className="text-xl font-extrabold leading-tight tracking-[-0.015em] flex-1 text-center pl-12 text-[#181111] dark:text-white">Dashboard</h2>
                <div className="flex w-12 items-center justify-end">
                    <button
                        onClick={() => router.push('/settings')}
                        className="text-[#f42536] text-base font-bold leading-normal tracking-[0.015em] shrink-0 hover:opacity-80 transition-opacity"
                    >
                        Settings
                    </button>
                </div>
            </div>

            {/* Scrollable Content - Template ligne 82 */}
            <div className="flex-1 flex flex-col gap-6 p-4">
                {/* Profile Header - Template ligne 84-119 */}
                <div className="flex flex-col items-center gap-4 pt-2">
                    <div className="relative group cursor-pointer">
                        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-32 w-32 border-4 border-white dark:border-gray-700 shadow-lg bg-gradient-to-br from-purple-400 to-pink-400">
                            <div className="w-full h-full flex items-center justify-center text-white text-5xl rounded-full">
                                👑
                            </div>
                        </div>
                        <div className="absolute bottom-1 right-1 bg-white dark:bg-[#1e1e1e] rounded-full p-2 shadow-md border border-gray-100 dark:border-gray-700">
                            <span className="material-symbols-outlined text-[#f42536] text-[20px] block">edit</span>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <h1 className="text-2xl font-extrabold leading-tight tracking-[-0.015em] text-center dark:text-white text-[#181111]">
                            {profile?.pseudonym}
                        </h1>
                        <p className="text-[#8a6064] dark:text-gray-400 text-sm font-medium leading-normal text-center mt-1">
                            Dominante • {stats.totalContributors} contributeurs
                        </p>
                    </div>

                    {/* Quick Action Grid - Template ligne 96-118 */}
                    <div className="grid grid-cols-3 gap-3 w-full mt-2">
                        <button
                            onClick={() => router.push('/dashboard/dominante/demands/create')}
                            className="flex flex-col items-center gap-2 p-3 bg-white dark:bg-[#1e1e1e] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 hover:scale-105 transition-transform"
                        >
                            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-300">
                                <span className="material-symbols-outlined">add</span>
                            </div>
                            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Demande</span>
                        </button>

                        <div className="relative flex flex-col items-center gap-2 p-3 bg-white dark:bg-[#1e1e1e] rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 scale-105 z-10">
                            <div className="absolute -top-3">
                                <span className="bg-[#f42536] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">TOP</span>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#f42536] to-orange-500 flex items-center justify-center text-white shadow-[#f42536]/30 shadow-lg">
                                <span className="material-symbols-outlined text-[28px]">trending_up</span>
                            </div>
                            <span className="text-xs font-bold text-[#f42536]">Boost</span>
                        </div>

                        <button
                            onClick={() => router.push('/messages')}
                            className="flex flex-col items-center gap-2 p-3 bg-white dark:bg-[#1e1e1e] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 hover:scale-105 transition-transform"
                        >
                            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-300">
                                <span className="material-symbols-outlined">chat_bubble</span>
                            </div>
                            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Messages</span>
                        </button>
                    </div>
                </div>

                {/* Stats Banner - Template ligne 121-136 Premium banner adapted */}
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#181111] to-[#3a2a2a] p-5 shadow-lg">
                    <div className="relative z-10 flex items-center justify-between gap-4">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <span className="bg-[#FFE5B4] text-[#181111] text-[10px] font-bold px-2 py-0.5 rounded-full">STATS</span>
                            </div>
                            <p className="text-[#FFE5B4] text-lg font-extrabold leading-tight">{stats.totalEarned.toFixed(2)}€ Total</p>
                            <p className="text-gray-300 text-xs font-medium leading-normal max-w-[160px]">{stats.activeDemands} demandes actives</p>
                        </div>
                        <button
                            onClick={() => router.push('/settings/stripe')}
                            className="flex shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-6 bg-white text-[#181111] text-sm font-bold shadow-md hover:bg-gray-50 transition-colors"
                        >
                            Stripe
                        </button>
                    </div>
                    <div className="absolute top-0 right-0 h-full w-1/2 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat"></div>
                </div>

                {/* Recent Payments Group - Template ligne 138-205 Discovery Settings adapted */}
                <div className="flex flex-col gap-3">
                    <h3 className="text-[#8a6064] dark:text-gray-400 text-sm font-bold uppercase tracking-wider px-2">Paiements Récents</h3>
                    <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                        {stats.recentPayments.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-6 text-center">
                                <div className="text-4xl mb-2">💸</div>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">Aucun paiement pour le moment</p>
                            </div>
                        ) : (
                            stats.recentPayments.map((payment: any, index) => (
                                <div
                                    key={payment.id}
                                    className={`flex items-center justify-between p-4 ${index !== stats.recentPayments.length - 1 ? 'border-b border-gray-100 dark:border-gray-800' : ''} hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-green-500">paid</span>
                                        <div className="flex flex-col">
                                            <p className="text-base font-bold dark:text-white text-[#181111]">{payment.contributor?.pseudonym || 'Anonyme'}</p>
                                            <p className="text-[#8a6064] dark:text-gray-400 text-sm">{new Date(payment.paid_at).toLocaleDateString('fr-FR')}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-green-600 dark:text-green-400 text-base font-bold">+{payment.amount}€</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Quick Actions Group - Template ligne 207-227 Control Profile adapted */}
                <div className="flex flex-col gap-3">
                    <h3 className="text-[#8a6064] dark:text-gray-400 text-sm font-bold uppercase tracking-wider px-2">Actions Rapides</h3>
                    <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                        <div
                            onClick={() => router.push('/dashboard/dominante/profile/edit')}
                            className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-[#f42536]">edit</span>
                                <p className="text-base font-bold dark:text-white text-[#181111]">Éditer Profil</p>
                            </div>
                            <span className="material-symbols-outlined text-gray-300 text-sm">arrow_forward_ios</span>
                        </div>

                        <div
                            onClick={() => router.push('/dashboard/dominante/demands/create')}
                            className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-[#f42536]">add_circle</span>
                                <p className="text-base font-bold dark:text-white text-[#181111]">Créer Demande</p>
                            </div>
                            <span className="material-symbols-outlined text-gray-300 text-sm">arrow_forward_ios</span>
                        </div>

                        <div
                            onClick={() => router.push('/messages')}
                            className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-[#f42536]">chat_bubble</span>
                                <p className="text-base font-bold dark:text-white text-[#181111]">Gérer DMs</p>
                            </div>
                            <span className="material-symbols-outlined text-gray-300 text-sm">arrow_forward_ios</span>
                        </div>
                    </div>
                </div>

                {/* Legal & Footer - Template ligne 229-252 */}
                <div className="flex flex-col gap-6 mt-2 mb-8">
                    <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 cursor-pointer">
                            <p className="text-base font-medium dark:text-white text-[#181111]">Analytics</p>
                            <span className="material-symbols-outlined text-gray-300 text-sm">arrow_forward_ios</span>
                        </div>
                        <div className="flex items-center justify-between p-4 cursor-pointer">
                            <p className="text-base font-medium dark:text-white text-[#181111]">Paramètres</p>
                            <span className="material-symbols-outlined text-gray-300 text-sm">arrow_forward_ios</span>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-4 mt-4">
                        <button
                            onClick={() => {
                                supabase.auth.signOut()
                                router.push('/login')
                            }}
                            className="w-full py-4 rounded-xl bg-gray-200 dark:bg-gray-800 text-[#181111] dark:text-white font-bold text-base hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                        >
                            Déconnexion
                        </button>
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 flex items-center justify-center">
                                <span className="text-3xl opacity-50">💎</span>
                            </div>
                            <p className="text-xs text-[#8a6064] dark:text-gray-500">Dashboard Dominante v1.0</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
