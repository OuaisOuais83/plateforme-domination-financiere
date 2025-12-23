'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { UserRole } from '@/types/database'

export default function PersonalInfoPage() {
    const router = useRouter()
    const supabase = createClient()
    const [role, setRole] = useState<UserRole | null>(null)
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        pseudonym: '',
        dateOfBirth: '',
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        // Récupérer le rôle sélectionné
        if (typeof window !== 'undefined') {
            const selectedRole = localStorage.getItem('selectedRole') as UserRole
            if (!selectedRole) {
                router.push('/')
                return
            }
            setRole(selectedRole)
        }
    }, [router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        // Validations
        if (formData.password !== formData.confirmPassword) {
            setError('Les mots de passe ne correspondent pas')
            return
        }

        if (formData.password.length < 8) {
            setError('Le mot de passe doit contenir au moins 8 caractères')
            return
        }

        // Vérification d'âge (18+)
        const birthDate = new Date(formData.dateOfBirth)
        const today = new Date()
        const age = today.getFullYear() - birthDate.getFullYear()
        if (age < 18) {
            setError('Vous devez avoir au moins 18 ans')
            return
        }

        setLoading(true)

        try {
            // 1. Créer l'utilisateur dans Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
            })

            if (authError) throw authError
            if (!authData.user) throw new Error('Erreur lors de la création du compte')

            // 2. Créer le profil
            const { error: profileError } = await supabase
                .from('profiles')
                .insert({
                    id: authData.user.id,
                    role: role!,
                    pseudonym: formData.pseudonym,
                    email: formData.email,
                    date_of_birth: formData.dateOfBirth,
                })

            if (profileError) throw profileError

            // 3. Si dominante, créer le profil étendu
            if (role === 'dominante') {
                const { error: dominanteError } = await supabase
                    .from('dominante_profiles')
                    .insert({
                        id: authData.user.id,
                    })

                if (dominanteError) throw dominanteError
            }

            // 4. Si contributeur, créer les préférences
            if (role === 'contributeur') {
                const { error: prefsError } = await supabase
                    .from('contributor_preferences')
                    .insert({
                        id: authData.user.id,
                    })

                if (prefsError) throw prefsError
            }

            // Redirection vers la page de préférences
            router.push('/signup/preferences')
        } catch (error: any) {
            setError(error.message || 'Erreur lors de la création du compte')
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
                            <span className="text-sm font-medium text-[#181111] dark:text-white">Étape 1 sur 2</span>
                            <span className="text-sm text-gray-500">Informations personnelles</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                            <div className="w-1/2 h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-[#181111] dark:text-white text-3xl font-extrabold mb-2">
                        {role === 'dominante' ? 'Créez votre profil dominant' : 'Créez votre compte contributeur'}
                    </h1>

                    <p className="text-[#181111]/70 dark:text-white/70 mb-8">
                        {role === 'dominante'
                            ? 'Monétisez vos demandes financières'
                            : 'Découvrez et soutenez des dominantes'}
                    </p>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl">
                                <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-[#181111] dark:text-white mb-2">
                                Pseudonyme *
                            </label>
                            <input
                                type="text"
                                value={formData.pseudonym}
                                onChange={(e) => setFormData({ ...formData, pseudonym: e.target.value })}
                                required
                                className="w-full h-12 px-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-white/5 text-[#181111] dark:text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                                placeholder="Votre pseudonyme"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#181111] dark:text-white mb-2">
                                Email *
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                                className="w-full h-12 px-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-white/5 text-[#181111] dark:text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                                placeholder="votre@email.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#181111] dark:text-white mb-2">
                                Date de naissance * (18+ requis)
                            </label>
                            <input
                                type="date"
                                value={formData.dateOfBirth}
                                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                required
                                className="w-full h-12 px-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-white/5 text-[#181111] dark:text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#181111] dark:text-white mb-2">
                                Mot de passe *
                            </label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                                className="w-full h-12 px-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-white/5 text-[#181111] dark:text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                                placeholder="••••••••"
                            />
                            <p className="text-xs text-gray-500 mt-1">Minimum 8 caractères</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#181111] dark:text-white mb-2">
                                Confirmer le mot de passe *
                            </label>
                            <input
                                type="password"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                required
                                className="w-full h-12 px-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-white/5 text-[#181111] dark:text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-full h-14 px-5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all text-white text-lg font-bold leading-normal tracking-[0.015em] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                        >
                            <span className="truncate">{loading ? 'Création...' : 'Continuer'}</span>
                        </button>
                    </form>

                    {/* Back Link */}
                    <button
                        onClick={() => router.push('/')}
                        className="flex w-full items-center justify-center mt-4 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                    >
                        ← Retour
                    </button>
                </div>
            </div>
        </div>
    )
}
