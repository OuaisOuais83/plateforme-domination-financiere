'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserRole } from '@/types/database'

export default function HomePage() {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)

  const handleRoleSelection = (role: UserRole) => {
    setSelectedRole(role)
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedRole', role)
    }
  }

  const handleCreateAccount = () => {
    if (!selectedRole) {
      alert('Veuillez sélectionner votre rôle')
      return
    }
    router.push('/signup/personal-info')
  }

  const handleSignIn = () => {
    router.push('/login')
  }

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden font-display">
      {/* Hero Visual Section - EXACT STRUCTURE FROM TEMPLATE */}
      <div className="relative w-full h-[60vh] flex-shrink-0">
        <div
          className="w-full h-full bg-center bg-no-repeat bg-cover rounded-b-[3rem] overflow-hidden relative shadow-lg"
          style={{ backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
        >
          {/* Gradient Overlay - FROM TEMPLATE */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60"></div>

          {/* Logo Overlay Top Center - FROM TEMPLATE */}
          <div className="absolute top-12 left-0 right-0 flex justify-center z-10">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md py-2 px-4 rounded-full border border-white/30">
              <span className="text-white font-bold text-lg tracking-wide">💎 Domination</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section - EXACT STRUCTURE FROM TEMPLATE */}
      <div className="flex-1 flex flex-col justify-end relative -mt-4 z-10">
        <div className="w-full max-w-md mx-auto px-6 flex flex-col items-center pb-6">
          {/* Headline Text - FROM TEMPLATE */}
          <h1 className="text-[#181111] dark:text-white tracking-tight text-[32px] font-extrabold leading-tight text-center pt-6">
            Soumission Financière, Contrôle Total
          </h1>

          {/* Body Text - FROM TEMPLATE */}
          <p className="text-[#181111]/70 dark:text-white/70 text-base font-medium leading-normal py-4 text-center max-w-[280px]">
            {!selectedRole && "Sélectionnez votre rôle pour commencer"}
            {selectedRole === 'dominante' && "Monétisez vos demandes financières, gardez le contrôle total."}
            {selectedRole === 'contributeur' && "Découvrez des dominantes et soumettez-vous volontairement."}
          </p>

          {/* Role Selection OR Actions Container - TEMPLATE BUTTON STRUCTURE */}
          {!selectedRole && (
            <div className="w-full flex flex-col gap-3 mt-4">
              {/* Dominante Button - PRIMARY COLOR FROM TEMPLATE */}
              <button
                onClick={() => handleRoleSelection('dominante')}
                className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-full h-14 px-5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-colors text-white text-lg font-bold leading-normal tracking-[0.015em] shadow-lg shadow-purple-600/30"
              >
                <span className="truncate">Je suis Dominante</span>
              </button>

              {/* Contributeur Button - SECONDARY STYLE FROM TEMPLATE */}
              <button
                onClick={() => handleRoleSelection('contributeur')}
                className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-full h-14 px-5 bg-transparent border-2 border-gray-200 dark:border-gray-700 hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-[#181111] dark:text-white text-lg font-bold leading-normal tracking-[0.015em]"
              >
                <span className="truncate">Je suis Contributeur</span>
              </button>
            </div>
          )}

          {/* Actions after role selection */}
          {selectedRole && (
            <div className="w-full flex flex-col gap-3 mt-4">
              {/* Create Account Button - PRIMARY FROM TEMPLATE */}
              <button
                onClick={handleCreateAccount}
                className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-full h-14 px-5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-colors text-white text-lg font-bold leading-normal tracking-[0.015em] shadow-lg shadow-purple-600/30"
              >
                <span className="truncate">Créer un Compte</span>
              </button>

              {/* Sign In Button - SECONDARY FROM TEMPLATE */}
              <button
                onClick={handleSignIn}
                className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-full h-14 px-5 bg-transparent border-2 border-gray-200 dark:border-gray-700 hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-[#181111] dark:text-white text-lg font-bold leading-normal tracking-[0.015em]"
              >
                <span className="truncate">Se Connecter</span>
              </button>

              {/* Change Role Button */}
              <button
                onClick={() => setSelectedRole(null)}
                className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm font-medium"
              >
                <span className="truncate">← Changer de rôle</span>
              </button>
            </div>
          )}

          {/* Disclaimer - ADAPTED FROM PLAN */}
          <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl">
            <p className="text-xs text-yellow-800 dark:text-yellow-200 leading-relaxed text-center">
              ⚠️ <strong>Cette plateforme n'est pas un service de dating.</strong><br />
              Le paiement ne garantit aucune interaction.
            </p>
          </div>

          {/* Footer Terms - EXACT FROM TEMPLATE */}
          <p className="text-xs text-center text-gray-400 leading-relaxed max-w-xs mt-6 pb-[env(safe-area-inset-bottom,20px)]">
            En vous inscrivant, vous acceptez nos{' '}
            <a className="underline hover:text-purple-600" href="/legal/terms">CGU</a>
            {' '}&{' '}
            <a className="underline hover:text-purple-600" href="/legal/privacy">Politique de Confidentialité</a>.
          </p>
        </div>
      </div>
    </div>
  )
}
