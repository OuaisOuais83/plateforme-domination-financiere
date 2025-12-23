'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks/useAuth'
import { DominanteProfileWithRelations } from '@/types/database'
import Image from 'next/image'

export default function ProfileViewPage() {
    const params = useParams()
    const router = useRouter()
    const supabase = createClient()
    const { user } = useAuth()

    const [profile, setProfile] = useState<DominanteProfileWithRelations | null>(null)
    const [loading, setLoading] = useState(true)
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)

    const profileId = params?.id as string

    useEffect(() => {
        if (profileId) {
            fetchProfile()
        }
    }, [profileId])

    const fetchProfile = async () => {
        try {
            const { data, error } = await supabase
                .from('dominante_profiles')
                .select(`
          id,
          description,
          persona,
          rules,
          dms_enabled,
          dms_require_payment,
          min_payment_for_dm,
          total_contributors,
          total_earned,
          leaderboard_visible,
          profile:profiles!inner (
            pseudonym,
            created_at
          ),
          profile_photos (
            id,
            url,
            display_order
          ),
          financial_demands (
            id,
            title,
            description,
            amount,
            type,
            contrepartie,
            contrepartie_details,
            is_active,
            created_at
          )
        `)
                .eq('id', profileId)
                .single()

            if (error) throw error

            setProfile({
                ...data,
                profile: Array.isArray(data.profile) ? data.profile[0] : data.profile,
            } as any)
        } catch (error) {
            console.error('Error:', error)
            router.push('/discover')
        } finally {
            setLoading(false)
        }
    }

    const handlePayDemand = (demandId: string) => {
        router.push(`/payment/${demandId}`)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#f8f5f6] dark:bg-[#221011]">
                <p>Chargement...</p>
            </div>
        )
    }

    if (!profile) {
        return null
    }

    const photos = profile.profile_photos?.sort((a, b) => a.display_order - b.display_order) || []
    const activeDemands = profile.financial_demands?.filter(d => d.is_active) || []

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col bg-[#f8f5f6] dark:bg-[#221011]">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <button
                    onClick={() => router.back()}
                    className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:scale-105 transition-transform"
                >
                    ←
                </button>
                <h1 className="font-bold text-[#181111] dark:text-white">Profil</h1>
                <div className="w-10"></div>
            </div>

            <div className="flex-1 overflow-y-auto">
                <div className="max-w-2xl mx-auto">
                    {/* Photo Gallery */}
                    {photos.length > 0 && (
                        <div className="relative h-[500px] bg-gradient-to-br from-purple-400 to-pink-400">
                            <Image
                                src={photos[currentPhotoIndex]?.url || ''}
                                alt={profile.profile?.pseudonym || ''}
                                fill
                                className="object-cover"
                            />

                            {/* Photo Navigation */}
                            {photos.length > 1 && (
                                <>
                                    <div className="absolute top-4 right-4 flex gap-1">
                                        {photos.map((_, index) => (
                                            <div
                                                key={index}
                                                className={`h-1 w-8 rounded-full ${index === currentPhotoIndex
                                                        ? 'bg-white'
                                                        : 'bg-white/50'
                                                    }`}
                                            />
                                        ))}
                                    </div>

                                    {currentPhotoIndex > 0 && (
                                        <button
                                            onClick={() => setCurrentPhotoIndex(currentPhotoIndex - 1)}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/50"
                                        >
                                            ←
                                        </button>
                                    )}

                                    {currentPhotoIndex < photos.length - 1 && (
                                        <button
                                            onClick={() => setCurrentPhotoIndex(currentPhotoIndex + 1)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/50"
                                        >
                                            →
                                        </button>
                                    )}
                                </>
                            )}

                            {/* Profile Info Overlay */}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                                <h2 className="text-white text-4xl font-extrabold mb-2">
                                    {profile.profile?.pseudonym}
                                </h2>

                                {profile.persona && (
                                    <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                                        {profile.persona === 'soft' && '🌸 Soft'}
                                        {profile.persona === 'strict' && '⚡ Strict'}
                                        {profile.persona === 'humiliating' && '🔥 Humiliation'}
                                        {profile.persona === 'other' && '✨ Autre'}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Profile Content */}
                    <div className="p-6 space-y-6">
                        {/* Description */}
                        {profile.description && (
                            <div>
                                <h3 className="text-lg font-bold text-[#181111] dark:text-white mb-2">
                                    À propos
                                </h3>
                                <p className="text-[#181111]/80 dark:text-white/80 leading-relaxed">
                                    {profile.description}
                                </p>
                            </div>
                        )}

                        {/* Rules */}
                        {profile.rules && (
                            <div>
                                <h3 className="text-lg font-bold text-[#181111] dark:text-white mb-2">
                                    📜 Règles
                                </h3>
                                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-xl">
                                    <p className="text-[#181111]/80 dark:text-white/80 leading-relaxed whitespace-pre-wrap">
                                        {profile.rules}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* DM Status */}
                        <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-700 rounded-xl">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xl">💬</span>
                                <h3 className="font-bold text-[#181111] dark:text-white">
                                    Accès aux Messages
                                </h3>
                            </div>
                            <p className="text-[#181111]/80 dark:text-white/80 text-sm">
                                {profile.dms_enabled ? (
                                    profile.dms_require_payment ? (
                                        <>DMs disponibles après paiement de {profile.min_payment_for_dm}€</>
                                    ) : (
                                        <>DMs ouverts - Vous pouvez écrire directement</>
                                    )
                                ) : (
                                    <>DMs fermés - Cette dominante n'accepte pas de messages</>
                                )}
                            </p>
                        </div>

                        {/* Stats */}
                        {profile.leaderboard_visible && (
                            <div className="flex gap-4">
                                <div className="flex-1 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-center">
                                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                        {profile.total_contributors}
                                    </div>
                                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                        Contributeurs
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Financial Demands */}
                        <div>
                            <h3 className="text-lg font-bold text-[#181111] dark:text-white mb-4 flex items-center gap-2">
                                💰 Demandes Financières ({activeDemands.length})
                            </h3>

                            {activeDemands.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    Aucune demande active pour le moment
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {activeDemands.map((demand) => (
                                        <div
                                            key={demand.id}
                                            className="p-5 bg-white dark:bg-gray-800 border-2 border-purple-200 dark:border-purple-700 rounded-2xl hover:shadow-lg transition-shadow"
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-[#181111] dark:text-white text-lg mb-1">
                                                        {demand.title}
                                                    </h4>
                                                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                        {demand.type === 'ponctuel' ? '💳 Paiement ponctuel' : '🔄 Paiement récurrent'}
                                                    </div>
                                                </div>
                                                <div className="text-right ml-4">
                                                    <div className="text-3xl font-extrabold text-purple-600 dark:text-purple-400">
                                                        {demand.amount}€
                                                    </div>
                                                    {demand.type === 'récurrent' && (
                                                        <div className="text-xs text-gray-500">/mois</div>
                                                    )}
                                                </div>
                                            </div>

                                            <p className="text-[#181111]/80 dark:text-white/80 text-sm mb-3 leading-relaxed">
                                                {demand.description}
                                            </p>

                                            {/* Contrepartie */}
                                            <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                                                <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                                                    Contrepartie
                                                </div>
                                                <div className="text-sm text-[#181111] dark:text-white">
                                                    {demand.contrepartie === 'aucune' && '❌ Aucune contrepartie'}
                                                    {demand.contrepartie === 'dm_access' && '💬 Possibilité d\'accès aux DMs'}
                                                    {demand.contrepartie === 'content' && '📸 Contenu débloqué'}
                                                    {demand.contrepartie === 'autre' && `✨ ${demand.contrepartie_details || 'Autre'}`}
                                                </div>
                                            </div>

                                            {/* Warning + CTA */}
                                            <div className="space-y-2">
                                                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl">
                                                    <p className="text-xs text-yellow-800 dark:text-yellow-200 leading-relaxed">
                                                        ⚠️ <strong>Rappel :</strong> Ce paiement ne garantit aucune interaction. L'accès aux DMs ou toute autre contrepartie est à la discrétion exclusive de la dominante.
                                                    </p>
                                                </div>

                                                <button
                                                    onClick={() => handlePayDemand(demand.id)}
                                                    className="w-full h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold transition-all shadow-lg"
                                                >
                                                    Payer {demand.amount}€
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
