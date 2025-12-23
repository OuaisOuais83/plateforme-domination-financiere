'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const FUNDAMENTAL_RULES = [
    {
        icon: '💰',
        title: 'Le paiement n\'achète rien',
        description: 'Tout paiement exprime une soumission volontaire. Aucune interaction n\'est garantie.',
        isWarning: true,
    },
    {
        icon: '👑',
        title: 'Toute interaction est un privilège',
        description: 'Seule la dominante décide d\'accepter ou refuser les messages, sans justification.',
        isWarning: false,
    },
    {
        icon: '🔒',
        title: 'Contrôle total côté dominante',
        description: 'La dominante peut bloquer, retirer l\'accès ou refuser à tout moment.',
        isWarning: false,
    },
    {
        icon: '⚠️',
        title: 'Aucun remboursement',
        description: 'Tous les paiements sont définitifs et irréversibles.',
        isWarning: true,
    },
]

export default function OnboardingWelcomePage() {
    const router = useRouter()
    const supabase = createClient()
    const [accepted, setAccepted] = useState(false)
    const [loading, setLoading] = useState(false)
    const [currentSlide, setCurrentSlide] = useState(0)

    const handleAccept = async () => {
        if (!accepted) {
            alert('Vous devez accepter les règles pour continuer')
            return
        }

        setLoading(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/login')
                return
            }

            // Récupérer le rôle de l'utilisateur
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single()

            // Enregistrer l'acceptation des règles
            const { error } = await supabase
                .from('profiles')
                .update({
                    terms_accepted_at: new Date().toISOString(),
                    terms_version: '1.0',
                })
                .eq('id', user.id)

            if (error) throw error

            // Rediriger selon le rôle (selon plan ligne 170-171)
            if (profile?.role === 'dominante') {
                router.push('/dashboard/dominante')
            } else {
                router.push('/discover')
            }
        } catch (error) {
            console.error('Error:', error)
            alert('Erreur lors de la sauvegarde')
        } finally {
            setLoading(false)
        }
    }

    const nextSlide = () => {
        if (currentSlide < FUNDAMENTAL_RULES.length - 1) {
            setCurrentSlide(currentSlide + 1)
        }
    }

    const prevSlide = () => {
        if (currentSlide > 0) {
            setCurrentSlide(currentSlide - 1)
        }
    }

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col bg-[#f8f5f6] dark:bg-[#221011]">
            <div className="flex-1 flex flex-col justify-center items-center px-6 py-12">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <div className="flex justify-center mb-8">
                        <div className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 py-2 px-4 rounded-full">
                            <span className="text-white font-bold text-lg">💎 Domination</span>
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-[#181111] dark:text-white text-3xl font-extrabold text-center mb-2">
                        Règles Fondamentales
                    </h1>

                    <p className="text-[#181111]/70 dark:text-white/70 text-center mb-8">
                        Vous devez comprendre et accepter ces règles pour utiliser la plateforme
                    </p>

                    {/* Slides Container */}
                    <div className="relative mb-8">
                        <div className="overflow-hidden">
                            <div
                                className="flex transition-transform duration-300 ease-in-out"
                                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                            >
                                {FUNDAMENTAL_RULES.map((rule, index) => (
                                    <div key={index} className="min-w-full">
                                        <div className={`p-6 rounded-2xl border-2 ${rule.isWarning
                                            ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
                                            : 'bg-purple-50 dark:bg-purple-900/20 border-purple-300 dark:border-purple-700'
                                            }`}>
                                            <div className="text-5xl mb-4 text-center">{rule.icon}</div>
                                            <h3 className="text-xl font-bold text-[#181111] dark:text-white text-center mb-3">
                                                {rule.title}
                                            </h3>
                                            <p className="text-[#181111]/80 dark:text-white/80 text-center leading-relaxed">
                                                {rule.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Navigation Arrows */}
                        {currentSlide > 0 && (
                            <button
                                onClick={prevSlide}
                                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
                            >
                                ←
                            </button>
                        )}

                        {currentSlide < FUNDAMENTAL_RULES.length - 1 && (
                            <button
                                onClick={nextSlide}
                                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
                            >
                                →
                            </button>
                        )}

                        {/* Dots Indicator */}
                        <div className="flex justify-center gap-2 mt-6">
                            {FUNDAMENTAL_RULES.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    className={`w-2 h-2 rounded-full transition-all ${index === currentSlide
                                        ? 'bg-purple-600 w-6'
                                        : 'bg-gray-300 dark:bg-gray-600'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Additional Disclaimers */}
                    <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200 leading-relaxed">
                            <strong>⚠️ Attention</strong><br />
                            Cette plateforme n'est <strong>PAS</strong> un service de dating ou de rencontre.
                            C'est une plateforme transactionnelle de domination financière.
                        </p>
                    </div>

                    {/* Acceptance Checkbox */}
                    <label className="flex items-start gap-3 p-4 border-2 border-purple-300 dark:border-purple-700 rounded-xl cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/10 mb-6">
                        <input
                            type="checkbox"
                            checked={accepted}
                            onChange={(e) => setAccepted(e.target.checked)}
                            className="w-5 h-5 text-purple-600 rounded mt-0.5 flex-shrink-0"
                        />
                        <div className="text-sm">
                            <div className="font-semibold text-[#181111] dark:text-white mb-1">
                                J'accepte les règles fondamentales
                            </div>
                            <div className="text-gray-600 dark:text-gray-400">
                                Je comprends que le paiement ne garantit aucune interaction et que toute interaction est un privilège décidé exclusivement par la dominante.
                            </div>
                        </div>
                    </label>

                    {/* Continue Button */}
                    <button
                        onClick={handleAccept}
                        disabled={!accepted || loading}
                        className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-full h-14 px-5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all text-white text-lg font-bold leading-normal tracking-[0.015em] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-400"
                    >
                        <span className="truncate">
                            {loading ? 'Vérification...' : accepted ? 'J\'accepte et je continue' : 'Vous devez accepter pour continuer'}
                        </span>
                    </button>

                    {/* Back Link */}
                    <button
                        onClick={() => router.push('/')}
                        className="flex w-full items-center justify-center mt-4 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                    >
                        ← Retour à l'accueil
                    </button>

                    {/* Legal Links */}
                    <p className="text-xs text-center text-gray-400 leading-relaxed mt-6">
                        En continuant, vous acceptez également nos{' '}
                        <a className="underline hover:text-purple-600" href="/legal/terms">CGU</a>
                        {' '}et notre{' '}
                        <a className="underline hover:text-purple-600" href="/legal/privacy">Politique de Confidentialité</a>.
                    </p>
                </div>
            </div>
        </div>
    )
}
