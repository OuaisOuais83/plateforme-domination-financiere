'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks/useAuth'

export default function DiscoverPage() {
    const router = useRouter()
    const supabase = createClient()
    const { user, loading: authLoading, isContributeur } = useAuth()
    const [profiles, setProfiles] = useState<any[]>([])
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
                    bio_style,
                    dms_enabled,
                    dms_require_payment,
                    min_payment_for_dm,
                    total_contributors,
                    profile:profiles!inner (
                        id,
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
    const photoUrl = currentProfile.profile_photos?.[0]?.url || `https://source.unsplash.com/random/400x700?portrait&sig=${currentProfile.id}`

    return (
        <div className="relative flex h-screen w-full flex-col max-w-md mx-auto bg-[#f8f5f6] dark:bg-[#221011] shadow-2xl overflow-hidden">
            {/* Top Navigation - Template discovery__swipe_interface ligne 65-80 */}
            <header className="flex items-center justify-between px-6 py-4 pt-12 z-20">
                {/* Profile Icon */}
                <button
                    onClick={() => router.push(`/profile/${user?.id}`)}
                    className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white dark:bg-[#2a1517] shadow-sm"
                >
                    <div className="bg-center bg-no-repeat bg-cover rounded-full size-9 border-2 border-white dark:border-[#2a1517]">
                        <span className="flex items-center justify-center w-full h-full text-lg">👤</span>
                    </div>
                </button>

                {/* Logo / Title */}
                <div className="flex items-center gap-1">
                    <span className="text-[#f42536] text-2xl">🔥</span>
                    <h2 className="text-xl font-extrabold tracking-tight text-[#181111] dark:text-white">Discovery</h2>
                </div>

                {/* Filters */}
                <button className="flex size-10 items-center justify-center rounded-full bg-white dark:bg-[#2a1517] text-[#8a6064] dark:text-gray-300 shadow-sm transition-transform active:scale-95">
                    <span className="text-xl">⚙️</span>
                </button>
            </header>

            {/* Main Content Area - Template ligne 82-156 */}
            <main className="flex-1 relative flex flex-col items-center justify-center w-full px-4 pb-4">
                {/* Card Stack Container */}
                <div className="relative w-full h-full max-h-[600px] flex flex-col">
                    {/* Background Dummy Card (for depth) */}
                    <div className="absolute inset-0 bg-white dark:bg-[#2a1517] rounded-xl shadow-lg transform scale-95 translate-y-4 opacity-60 z-0"></div>

                    {/* Main Active Card */}
                    <div className="main-card relative w-full h-full bg-white dark:bg-[#1a0f10] rounded-xl shadow-xl overflow-hidden group z-10">
                        {/* Main Image */}
                        <div
                            className="absolute inset-0 bg-center bg-no-repeat bg-cover transition-transform duration-700 group-hover:scale-105"
                            style={{ backgroundImage: `url(${photoUrl})` }}
                        ></div>

                        {/* Top Gradient & Photo Indicators */}
                        <div className="absolute top-0 left-0 w-full p-3 bg-gradient-to-b from-black/40 to-transparent">
                            <div className="flex w-full flex-row items-center justify-center gap-1.5">
                                {[0, 1, 2, 3].map((i) => (
                                    <div
                                        key={i}
                                        className={`h-1 flex-1 rounded-full ${i === 0 ? 'bg-white shadow-sm' : 'bg-white/40 backdrop-blur-sm'}`}
                                    ></div>
                                ))}
                            </div>
                        </div>

                        {/* Bottom Content Overlay */}
                        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-20 pb-6 px-5 flex flex-col gap-2">
                            {/* Name & Verified */}
                            <div className="flex items-end gap-2 text-white">
                                <h1 className="text-3xl font-extrabold leading-none">{currentProfile.profile?.pseudonym}</h1>
                                <span className="text-blue-400 text-xl">✓</span>
                            </div>

                            {/* Persona & Stats */}
                            <div className="flex flex-col gap-1 text-white/90">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-white/80 text-lg">👑</span>
                                    <p className="text-sm font-medium">
                                        {currentProfile.persona === 'soft' && 'Soft Dominante'}
                                        {currentProfile.persona === 'strict' && 'Strict Dominante'}
                                        {currentProfile.persona === 'humiliating' && 'Humiliation'}
                                        {currentProfile.persona === 'other' && 'Autre style'}
                                    </p>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="text-white/80 text-lg">💰</span>
                                    <p className="text-sm font-medium">{currentProfile.financial_demands?.length || 0} demandes • {currentProfile.total_contributors} contributeurs</p>
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mt-2">
                                {currentProfile.persona && (
                                    <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-white border border-white/10">
                                        {currentProfile.persona}
                                    </span>
                                )}
                                {currentProfile.dms_enabled && (
                                    <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-white border border-white/10">
                                        {currentProfile.dms_require_payment ? `DM ${currentProfile.min_payment_for_dm}€` : 'DM Open'}
                                    </span>
                                )}
                                {currentProfile.bio_style && (
                                    <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-white border border-white/10">
                                        {currentProfile.bio_style.split(' ')[0]}
                                    </span>
                                )}
                            </div>

                            {/* Info Button */}
                            <button
                                onClick={() => handleViewProfile(currentProfile.id)}
                                className="absolute right-5 bottom-28 size-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20"
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_upward</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Action Buttons (Floating) - Template ligne 134-155 */}
                <div className="w-full flex justify-center items-center gap-4 mt-6 px-2">
                    {/* Rewind */}
                    <button className="group flex size-12 items-center justify-center rounded-full bg-white dark:bg-[#2a1517] text-yellow-500 shadow-lg hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-all active:scale-90 border border-gray-100 dark:border-gray-800">
                        <span className="material-symbols-outlined group-hover:scale-110 transition-transform" style={{ fontSize: '24px' }}>replay</span>
                    </button>

                    {/* Nope */}
                    <button
                        onClick={handleNext}
                        className="group flex size-14 items-center justify-center rounded-full bg-white dark:bg-[#2a1517] text-[#f42536] shadow-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all active:scale-90 border border-gray-100 dark:border-gray-800"
                    >
                        <span className="material-symbols-outlined group-hover:scale-110 transition-transform" style={{ fontSize: '32px' }}>close</span>
                    </button>

                    {/* Super Like */}
                    <button className="group flex size-12 items-center justify-center rounded-full bg-white dark:bg-[#2a1517] text-blue-500 shadow-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all active:scale-90 border border-gray-100 dark:border-gray-800">
                        <span className="material-symbols-outlined group-hover:scale-110 transition-transform" style={{ fontSize: '24px', fontVariationSettings: "'FILL' 1" }}>star</span>
                    </button>

                    {/* Like */}
                    <button
                        onClick={() => handleViewProfile(currentProfile.id)}
                        className="group flex size-14 items-center justify-center rounded-full bg-[#f42536] text-white shadow-xl shadow-[#f42536]/30 hover:bg-red-600 transition-all active:scale-90"
                    >
                        <span className="material-symbols-outlined group-hover:scale-110 transition-transform" style={{ fontSize: '32px', fontVariationSettings: "'FILL' 1" }}>favorite</span>
                    </button>

                    {/* Boost */}
                    <button className="group flex size-12 items-center justify-center rounded-full bg-white dark:bg-[#2a1517] text-purple-500 shadow-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all active:scale-90 border border-gray-100 dark:border-gray-800">
                        <span className="material-symbols-outlined group-hover:scale-110 transition-transform" style={{ fontSize: '24px' }}>bolt</span>
                    </button>
                </div>
            </main>

            {/* Bottom Navbar - Template ligne 158-173 */}
            <nav className="pb-6 pt-2 bg-white/80 dark:bg-[#221011]/80 backdrop-blur-lg border-t border-gray-100 dark:border-white/5">
                <div className="flex justify-around items-center px-4">
                    <a className="flex flex-col items-center gap-1 text-[#f42536]" href="/discover">
                        <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>style</span>
                    </a>
                    <a className="flex flex-col items-center gap-1 text-gray-400 dark:text-gray-500 hover:text-[#f42536] transition-colors" href="/matches">
                        <span className="material-symbols-outlined text-3xl">grid_view</span>
                    </a>
                    <a className="flex flex-col items-center gap-1 text-gray-400 dark:text-gray-500 hover:text-[#f42536] transition-colors" href="/messages">
                        <span className="material-symbols-outlined text-3xl">chat_bubble</span>
                    </a>
                    <a className="flex flex-col items-center gap-1 text-gray-400 dark:text-gray-500 hover:text-[#f42536] transition-colors" href={`/profile/${user?.id}`}>
                        <span className="material-symbols-outlined text-3xl">person</span>
                    </a>
                </div>
            </nav>
        </div>
    )
}
