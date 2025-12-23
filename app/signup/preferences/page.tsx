'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { UserRole, Persona } from '@/types/database'

export default function PreferencesPage() {
    const router = useRouter()
    const supabase = createClient()
    const [role, setRole] = useState<UserRole | null>(null)
    const [userId, setUserId] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    // État pour dominante
    const [dominantePrefs, setDominantePrefs] = useState({
        persona: 'soft' as Persona,
        dmsEnabled: false,
        dmsRequirePayment: true,
        minPaymentForDM: 50,
        profileVisibility: 'public' as 'public' | 'paid',
    })

    // État pour contributeur
    const [contributeurPrefs, setContributeurPrefs] = useState({
        filterDmsOpen: false,
        filterMaxAmount: 500,
        notificationsEnabled: true,
    })

    useEffect(() => {
        // Récupérer l'utilisateur connecté
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/login')
                return
            }

            setUserId(user.id)

            // Récupérer le rôle
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single()

            if (profile) {
                setRole(profile.role)
            }
        }

        getUser()
    }, [router, supabase])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            if (role === 'dominante') {
                // Mettre à jour le profil dominante
                const { error } = await supabase
                    .from('dominante_profiles')
                    .update({
                        persona: dominantePrefs.persona,
                        dms_enabled: dominantePrefs.dmsEnabled,
                        dms_require_payment: dominantePrefs.dmsRequirePayment,
                        min_payment_for_dm: dominantePrefs.minPaymentForDM,
                        profile_visibility: dominantePrefs.profileVisibility,
                    })
                    .eq('id', userId)

                if (error) throw error

                // Rediriger vers onboarding/welcome (selon plan ligne 278)
                router.push('/onboarding/welcome')
            } else {
                // Mettre à jour les préférences contributeur
                const { error } = await supabase
                    .from('contributor_preferences')
                    .update({
                        filter_dms_open: contributeurPrefs.filterDmsOpen,
                        filter_max_amount: contributeurPrefs.filterMaxAmount,
                        notifications_enabled: contributeurPrefs.notificationsEnabled,
                    })
                    .eq('id', userId)

                if (error) throw error

                // Rediriger vers onboarding/welcome (selon plan ligne 278)
                router.push('/onboarding/welcome')
            }
        } catch (error: any) {
            console.error('Error:', error)
            alert('Erreur lors de la sauvegarde')
        } finally {
            setLoading(false)
        }
    }

    if (!role) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Chargement...</p>
            </div>
        )
    }

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col bg-[#f8f5f6] dark:bg-[#221011]">
            <div className="flex-1 flex flex-col justify-center items-center px-6 py-12">
                <div className="w-full max-w-md">
                    {/* Progress */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-[#181111] dark:text-white">Étape 2 sur 2</span>
                            <span className="text-sm text-gray-500">Préférences</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                            <div className="w-full h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-[#181111] dark:text-white text-3xl font-extrabold mb-2">
                        {role === 'dominante' ? 'Configurez votre profil' : 'Vos préférences'}
                    </h1>

                    <p className="text-[#181111]/70 dark:text-white/70 mb-8">
                        {role === 'dominante'
                            ? 'Définissez votre style et vos paramètres'
                            : 'Personnalisez votre expérience de découverte'}
                    </p>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* DOMINANTE PREFERENCES */}
                        {role === 'dominante' && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-[#181111] dark:text-white mb-2">
                                        Persona
                                    </label>
                                    <select
                                        value={dominantePrefs.persona}
                                        onChange={(e) => setDominantePrefs({ ...dominantePrefs, persona: e.target.value as Persona })}
                                        className="w-full h-12 px-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-white/5 text-[#181111] dark:text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                                    >
                                        <option value="soft">Soft - Bienveillante</option>
                                        <option value="strict">Strict - Exigeante</option>
                                        <option value="humiliating">Humiliating - Dégradante</option>
                                        <option value="other">Autre</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#181111] dark:text-white mb-2">
                                        Visibilité du profil
                                    </label>
                                    <select
                                        value={dominantePrefs.profileVisibility}
                                        onChange={(e) => setDominantePrefs({ ...dominantePrefs, profileVisibility: e.target.value as 'public' | 'paid' })}
                                        className="w-full h-12 px-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-white/5 text-[#181111] dark:text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                                    >
                                        <option value="public">Public - Visible par tous</option>
                                        <option value="paid">Payant - Accès après paiement</option>
                                    </select>
                                </div>

                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-[#181111] dark:text-white">
                                        Accès aux DMs
                                    </label>

                                    <label className="flex items-center gap-3 p-4 border border-gray-300 dark:border-gray-700 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5">
                                        <input
                                            type="radio"
                                            checked={!dominantePrefs.dmsEnabled}
                                            onChange={() => setDominantePrefs({ ...dominantePrefs, dmsEnabled: false })}
                                            className="w-5 h-5 text-purple-600"
                                        />
                                        <div>
                                            <div className="font-medium text-[#181111] dark:text-white">Fermés</div>
                                            <div className="text-sm text-gray-500">Personne ne peut vous écrire</div>
                                        </div>
                                    </label>

                                    <label className="flex items-center gap-3 p-4 border border-gray-300 dark:border-gray-700 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5">
                                        <input
                                            type="radio"
                                            checked={dominantePrefs.dmsEnabled && dominantePrefs.dmsRequirePayment}
                                            onChange={() => setDominantePrefs({ ...dominantePrefs, dmsEnabled: true, dmsRequirePayment: true })}
                                            className="w-5 h-5 text-purple-600"
                                        />
                                        <div>
                                            <div className="font-medium text-[#181111] dark:text-white">Après paiement</div>
                                            <div className="text-sm text-gray-500">Requiert un paiement minimum</div>
                                        </div>
                                    </label>

                                    {dominantePrefs.dmsEnabled && dominantePrefs.dmsRequirePayment && (
                                        <div className="ml-8">
                                            <label className="block text-sm font-medium text-[#181111] dark:text-white mb-2">
                                                Montant minimum (€)
                                            </label>
                                            <input
                                                type="number"
                                                value={dominantePrefs.minPaymentForDM}
                                                onChange={(e) => setDominantePrefs({ ...dominantePrefs, minPaymentForDM: parseInt(e.target.value) })}
                                                min="1"
                                                className="w-full h-12 px-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-white/5 text-[#181111] dark:text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                                            />
                                        </div>
                                    )}

                                    <label className="flex items-center gap-3 p-4 border border-gray-300 dark:border-gray-700 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5">
                                        <input
                                            type="radio"
                                            checked={dominantePrefs.dmsEnabled && !dominantePrefs.dmsRequirePayment}
                                            onChange={() => setDominantePrefs({ ...dominantePrefs, dmsEnabled: true, dmsRequirePayment: false })}
                                            className="w-5 h-5 text-purple-600"
                                        />
                                        <div>
                                            <div className="font-medium text-[#181111] dark:text-white">Ouverts</div>
                                            <div className="text-sm text-gray-500">Tout le monde peut vous écrire</div>
                                        </div>
                                    </label>
                                </div>
                            </>
                        )}

                        {/* CONTRIBUTEUR PREFERENCES */}
                        {role === 'contributeur' && (
                            <>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-3 p-4 border border-gray-300 dark:border-gray-700 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5">
                                        <input
                                            type="checkbox"
                                            checked={contributeurPrefs.filterDmsOpen}
                                            onChange={(e) => setContributeurPrefs({ ...contributeurPrefs, filterDmsOpen: e.target.checked })}
                                            className="w-5 h-5 text-purple-600 rounded"
                                        />
                                        <div>
                                            <div className="font-medium text-[#181111] dark:text-white">Afficher uniquement DMs ouverts</div>
                                            <div className="text-sm text-gray-500">Ne voir que les dominantes acceptant les messages</div>
                                        </div>
                                    </label>

                                    <label className="flex items-center gap-3 p-4 border border-gray-300 dark:border-gray-700 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5">
                                        <input
                                            type="checkbox"
                                            checked={contributeurPrefs.notificationsEnabled}
                                            onChange={(e) => setContributeurPrefs({ ...contributeurPrefs, notificationsEnabled: e.target.checked })}
                                            className="w-5 h-5 text-purple-600 rounded"
                                        />
                                        <div>
                                            <div className="font-medium text-[#181111] dark:text-white">Notifications</div>
                                            <div className="text-sm text-gray-500">Recevoir des notifications</div>
                                        </div>
                                    </label>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#181111] dark:text-white mb-2">
                                        Montant maximum des demandes (€)
                                    </label>
                                    <input
                                        type="number"
                                        value={contributeurPrefs.filterMaxAmount}
                                        onChange={(e) => setContributeurPrefs({ ...contributeurPrefs, filterMaxAmount: parseInt(e.target.value) })}
                                        min="0"
                                        className="w-full h-12 px-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-white/5 text-[#181111] dark:text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Ne voir que les demandes jusqu'à ce montant</p>
                                </div>
                            </>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-full h-14 px-5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all text-white text-lg font-bold leading-normal tracking-[0.015em] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-8"
                        >
                            <span className="truncate">{loading ? 'Sauvegarde...' : 'Terminer'}</span>
                        </button>
                    </form>

                    {/* Back Link */}
                    <button
                        onClick={() => router.back()}
                        className="flex w-full items-center justify-center mt-4 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                    >
                        ← Retour
                    </button>
                </div>
            </div>
        </div>
    )
}
