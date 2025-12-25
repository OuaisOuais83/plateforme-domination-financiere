'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
    const router = useRouter()
    const supabase = createClient()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            console.log('🔵 Tentative de connexion pour:', email)
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) {
                console.error('❌ Erreur signInWithPassword:', error)
                throw error
            }

            console.log('✅ Connexion réussie, User ID:', data.user.id)

            // Récupérer le profil pour savoir où rediriger
            console.log('🔵 Récupération du profil...')
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', data.user.id)
                .single()

            if (profileError) {
                console.error('❌ Erreur récupération profil:', profileError)
                // On continue quand même, par défaut vers discover si pas de role
            }

            console.log('✅ Profil récupéré:', profile)

            // Redirection selon le rôle
            if (profile?.role === 'dominante') {
                console.log('🔀 Redirection vers /dashboard/dominante')
                router.push('/dashboard/dominante')
            } else {
                console.log('🔀 Redirection vers /discover')
                router.replace('/discover') // Utiliser replace pour éviter le back
            }
        } catch (error: any) {
            console.error('❌ Erreur catchée:', error)
            setError(error.message || 'Erreur de connexion')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col bg-[#f8f5f6] dark:bg-[#221011]">
            <div className="flex-1 flex flex-col justify-center items-center px-6">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <div className="flex justify-center mb-8">
                        <div className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 py-2 px-4 rounded-full">
                            <span className="text-white font-bold text-lg">💎 Domination</span>
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-[#181111] dark:text-white text-3xl font-extrabold text-center mb-2">
                        Connexion
                    </h1>

                    <p className="text-[#181111]/70 dark:text-white/70 text-center mb-8">
                        Accédez à votre compte
                    </p>

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-4">
                        {error && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl">
                                <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-[#181111] dark:text-white mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full h-12 px-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-white/5 text-[#181111] dark:text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                                placeholder="votre@email.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#181111] dark:text-white mb-2">
                                Mot de passe
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full h-12 px-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-white/5 text-[#181111] dark:text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="flex justify-end">
                            <a
                                href="/forgot-password"
                                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                            >
                                Mot de passe oublié ?
                            </a>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-full h-14 px-5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all text-white text-lg font-bold leading-normal tracking-[0.015em] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="truncate">{loading ? 'Connexion...' : 'Se Connecter'}</span>
                        </button>
                    </form>

                    {/* Sign Up Link */}
                    <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
                        Pas encore de compte ?{' '}
                        <a href="/" className="text-purple-600 hover:text-purple-700 font-semibold">
                            Créer un compte
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}
