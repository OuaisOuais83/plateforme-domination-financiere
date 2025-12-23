'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks/useAuth'
import { DominanteProfileWithRelations } from '@/types/database'
import Image from 'next/image'

export default function DiscoverPage() {
    const router = useRouter()
    const supabase = createClient()
    const { user, profile, loading: authLoading, isContributeur } = useAuth()

    const [profiles, setProfiles] = useState<DominanteProfileWithRelations[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login')
            return
        }

        if (!authLoading && !isContributeur) {
            router.push('/dashboard/dominante')
            return
        }

        fetchProfiles()
    }, [authLoading, user, isContributeur, router])

    const fetchProfiles = async () => {
        try {
            const { data, error } = await supabase
                .from('dominante_profiles')
                .select(`
          id,
          description,
          persona,
          dms_enabled,
          dms_require_payment,
          min_payment_for_dm,
          total_contributors,
          profile:profiles!inner (
            pseudonym
          ),
          profile_photos (
            url,
            display_order
          ),
          financial_demands!inner (
            id,
            title,
            amount,
            type,
            contrepartie,
            is_active
          )
        `)
                .eq('profile_visibility', 'public')
                .eq('financial_demands.is_active', true)
                .order('created_at', { ascending: false })
                .limit(20)

            if (error) throw error

            // Transformer les données
            const transformedProfiles = data?.map(p => ({
                ...p,
                profile: Array.isArray(p.profile) ? p.profile[0] : p.profile,
            })) || []

            setProfiles(transformedProfiles as any)
        } catch (error) {
            console.error('Error fetching profiles:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleNext = () => {
        if (currentIndex < profiles.length - 1) {
            setCurrentIndex(currentIndex + 1)
        } else {
            // Recharger de nouveaux profils
            fetchProfiles()
            setCurrentIndex(0)
        }
    }

    const handleViewProfile = (profileId: string) => {
        router.push(`/profile/${profileId}`)
    }

    if (authLoading || loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#f8f5f6] dark:bg-[#221011]">
                <div className="text-center">
                    <div className="text-4xl mb-4">💎</div>
                    <p className="text-[#181111] dark:text-white">Chargement...</p>
                </div>
            </div>
        )
    }

    if (profiles.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#f8f5f6] dark:bg-[#221011] px-6">
                <div className="text-center max-w-md">
                    <div className="text-6xl mb-4">🔍</div>
                    <h2 className="text-2xl font-bold text-[#181111] dark:text-white mb-2">
                        Aucun profil disponible
                    </h2>
                    <p className="text-[#181111]/70 dark:text-white/70">
                        Revenez plus tard pour découvrir de nouvelles dominantes
                    </p>
                </div>
            </div>
        )
    }

    const currentProfile = profiles[currentIndex]

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col bg-[#f8f5f6] dark:bg-[#221011]">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">💎</span>
                    <span className="font-bold text-[#181111] dark:text-white">Découverte</span>
                </div>
                <button
                    onClick={() => router.push('/settings')}
                    className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:scale-105 transition-transform"
                >
                    ⚙️
                </button>
            </div>

            {/* Main Profile Card */}
            <div className="flex-1 flex items-center justify-center px-6 py-8">
                <div className="w-full max-w-md">
                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
                        {/* Profile Image */}
                        <div className="relative h-[500px] bg-gradient-to-br from-purple-400 to-pink-400">
                            {currentProfile.profile_photos?.[0]?.url ? (
                                <Image
                                    src={currentProfile.profile_photos[0].url}
                                    alt={currentProfile.profile?.pseudonym || 'Profile'}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-white text-6xl">
                                    👑
                                </div>
                            )}

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                            {/* Profile Info Overlay */}
                            <div className="absolute bottom-0 left-0 right-0 p-6">
                                <h2 className="text-white text-3xl font-extrabold mb-2">
                                    {currentProfile.profile?.pseudonym}
                                </h2>

                                {/* Persona Badge */}
                                {currentProfile.persona && (
                                    <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-3">
                                        {currentProfile.persona === 'soft' && '🌸 Soft'}
                                        {currentProfile.persona === 'strict' && '⚡ Strict'}
                                        {currentProfile.persona === 'humiliating' && '🔥 Humiliation'}
                                        {currentProfile.persona === 'other' && '✨ Autre'}
                                    </div>
                                )}

                                {/* DM Status */}
                                <div className="flex items-center gap-2 text-white text-sm">
                                    {currentProfile.dms_enabled ? (
                                        currentProfile.dms_require_payment ? (
                                            <>
                                                <span>💬 DMs après {currentProfile.min_payment_for_dm}€</span>
                                            </>
                                        ) : (
                                            <span>💬 DMs ouverts</span>
                                        )
                                    ) : (
                                        <span>🔒 DMs fermés</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Profile Details */}
                        <div className="p-6">
                            {/* Description */}
                            {currentProfile.description && (
                                <p className="text-[#181111] dark:text-white mb-4">
                                    {currentProfile.description}
                                </p>
                            )}

                            {/* Demands Preview */}
                            <div className="mb-4">
                                <h3 className="text-sm font-semibold text-[#181111] dark:text-white mb-3 flex items-center gap-2">
                                    💰 Demandes actives ({currentProfile.financial_demands?.length || 0})
                                </h3>
                                <div className="space-y-2">
                                    {currentProfile.financial_demands?.slice(0, 3).map((demand) => (
                                        <div
                                            key={demand.id}
                                            className="p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-xl"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="font-medium text-[#181111] dark:text-white text-sm">
                                                        {demand.title}
                                                    </div>
                                                    <div className="text-xs text-gray-600 dark:text-gray-400">
                                                        {demand.contrepartie === 'aucune' && '❌ Aucune contrepartie'}
                                                        {demand.contrepartie === 'dm_access' && '💬 Accès DM possible'}
                                                        {demand.contrepartie === 'content' && '📸 Contenu débloqué'}
                                                        {demand.contrepartie === 'autre' && '✨ Autre'}
                                                    </div>
                                                </div>
                                                <div className="font-bold text-purple-600 dark:text-purple-400 text-lg ml-3">
                                                    {demand.amount}€
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
                                <div>👥 {currentProfile.total_contributors} contributeurs</div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button
                                    onClick={handleNext}
                                    className="flex-1 h-14 rounded-full border-2 border-gray-300 dark:border-gray-600 text-[#181111] dark:text-white font-bold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Suivant →
                                </button>
                                <button
                                    onClick={() => handleViewProfile(currentProfile.id)}
                                    className="flex-1 h-14 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold transition-all shadow-lg"
                                >
                                    Voir le profil
                                </button>
                            </div>

                            {/* Disclaimer */}
                            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl">
                                <p className="text-xs text-yellow-800 dark:text-yellow-200 text-center">
                                    ⚠️ Le paiement ne garantit aucune interaction
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Progress Indicator */}
                    <div className="flex justify-center gap-1 mt-6">
                        {profiles.map((_, index) => (
                            <div
                                key={index}
                                className={`h-1 rounded-full transition-all ${index === currentIndex
                                        ? 'bg-purple-600 w-8'
                                        : 'bg-gray-300 dark:bg-gray-600 w-1'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
