'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks/useAuth'
import { DemandType, Contrepartie } from '@/types/database'

export default function CreateDemandPage() {
    const router = useRouter()
    const supabase = createClient()
    const { user, isDominante } = useAuth()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        amount: '',
        type: 'ponctuel' as DemandType,
        contrepartie: 'aucune' as Contrepartie,
        contrepartie_details: '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!user || !isDominante) {
            router.push('/login')
            return
        }

        setLoading(true)

        try {
            const { error } = await supabase
                .from('financial_demands')
                .insert({
                    dominante_id: user.id,
                    title: formData.title,
                    description: formData.description,
                    amount: parseFloat(formData.amount),
                    type: formData.type,
                    contrepartie: formData.contrepartie,
                    contrepartie_details: formData.contrepartie_details || null,
                    is_active: true,
                })

            if (error) throw error

            // Rediriger vers le dashboard
            router.push('/dashboard/dominante')
        } catch (error: any) {
            console.error('Error:', error)
            alert('Erreur lors de la création de la demande')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="relative min-h-screen w-full bg-[#f8f5f6] dark:bg-[#221011]">
            {/* Header */}
            <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="max-w-3xl mx-auto px-6 py-4">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-2"
                    >
                        ← Retour
                    </button>
                    <h1 className="text-2xl font-bold text-[#181111] dark:text-white">
                        Créer une demande financière
                    </h1>
                </div>
            </div>

            {/* Form */}
            <div className="max-w-3xl mx-auto px-6 py-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-[#181111] dark:text-white mb-2">
                            Titre *
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                            placeholder="Ex: Tribute mensuel"
                            className="w-full h-12 px-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-white/5 text-[#181111] dark:text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-[#181111] dark:text-white mb-2">
                            Description *
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                            rows={4}
                            placeholder="Décrivez cette demande financière..."
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-white/5 text-[#181111] dark:text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent resize-none"
                        />
                    </div>

                    {/* Amount */}
                    <div>
                        <label className="block text-sm font-medium text-[#181111] dark:text-white mb-2">
                            Montant (€) *
                        </label>
                        <input
                            type="number"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            required
                            min="1"
                            step="0.01"
                            placeholder="50.00"
                            className="w-full h-12 px-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-white/5 text-[#181111] dark:text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                        />
                    </div>

                    {/* Type */}
                    <div>
                        <label className="block text-sm font-medium text-[#181111] dark:text-white mb-2">
                            Type de paiement *
                        </label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value as DemandType })}
                            className="w-full h-12 px-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-white/5 text-[#181111] dark:text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                        >
                            <option value="ponctuel">Ponctuel - Paiement unique</option>
                            <option value="récurrent">Récurrent - Paiement mensuel</option>
                        </select>
                    </div>

                    {/* Contrepartie */}
                    <div>
                        <label className="block text-sm font-medium text-[#181111] dark:text-white mb-2">
                            Contrepartie *
                        </label>
                        <select
                            value={formData.contrepartie}
                            onChange={(e) => setFormData({ ...formData, contrepartie: e.target.value as Contrepartie })}
                            className="w-full h-12 px-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-white/5 text-[#181111] dark:text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                        >
                            <option value="aucune">Aucune - Tribute sans contrepartie</option>
                            <option value="dm_access">Accès DM - Possibilité de m'écrire</option>
                            <option value="content">Contenu débloqué - Photos ou vidéos</option>
                            <option value="autre">Autre - Préciser ci-dessous</option>
                        </select>
                    </div>

                    {/* Contrepartie Details */}
                    {(formData.contrepartie === 'autre' || formData.contrepartie === 'content') && (
                        <div>
                            <label className="block text-sm font-medium text-[#181111] dark:text-white mb-2">
                                Détails de la contrepartie
                            </label>
                            <textarea
                                value={formData.contrepartie_details}
                                onChange={(e) => setFormData({ ...formData, contrepartie_details: e.target.value })}
                                rows={3}
                                placeholder="Décrivez précisément ce que le contributeur recevra..."
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-white/5 text-[#181111] dark:text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent resize-none"
                            />
                        </div>
                    )}

                    {/* Disclaimer */}
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                            <strong>⚠️ Rappel important</strong><br />
                            Si vous définissez une contrepartie, vous devez la respecter. Cependant, vous gardez le droit de bloquer ou retirer l'accès à tout moment.
                        </p>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-14 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Création...' : 'Créer la demande'}
                    </button>
                </form>
            </div>
        </div>
    )
}
