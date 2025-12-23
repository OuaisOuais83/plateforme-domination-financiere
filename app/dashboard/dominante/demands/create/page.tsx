'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks/useAuth'

export default function CreateDemandPage() {
    const router = useRouter()
    const supabase = createClient()
    const { user } = useAuth()

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        amount: '',
        type: 'ponctuel' as 'ponctuel' | 'récurrent',
        contrepartie: 'aucune' as 'aucune' | 'dm_access' | 'content' | 'autre',
        contrepartie_details: ''
    })
    const [loading, setLoading] = useState(false)

    const handleSubmit = async () => {
        if (!user || !formData.title || !formData.amount) {
            alert('Titre et montant requis')
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
                    contrepartie_details: formData.contrepartie_details,
                    is_active: true
                })

            if (error) throw error

            router.push('/dashboard/dominante')
        } catch (error) {
            console.error('Error:', error)
            alert('Erreur lors de la création')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto shadow-2xl bg-[#f8f5f6] dark:bg-[#221011]">
            {/* TopAppBar - Template edit_profile ligne 56-64 */}
            <div className="sticky top-0 z-50 flex items-center bg-[#f8f5f6]/95 dark:bg-[#221011]/95 backdrop-blur-md p-4 pb-2 justify-between border-b border-gray-200 dark:border-gray-800">
                <div
                    onClick={() => router.back()}
                    className="flex size-12 shrink-0 items-center text-gray-500 dark:text-gray-400 cursor-pointer hover:text-[#f42536] transition-colors"
                >
                    <span className="material-symbols-outlined text-2xl">arrow_back_ios_new</span>
                </div>
                <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">Créer Demande</h2>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex w-12 items-center justify-end focus:outline-none"
                >
                    <p className="text-[#f42536] text-base font-bold leading-normal tracking-[0.015em] shrink-0 hover:opacity-80 disabled:opacity-50">
                        {loading ? '...' : 'Save'}
                    </p>
                </button>
            </div>

            {/* Scrollable Content - Template ligne 66 */}
            <div className="flex-1 flex flex-col pb-10">
                {/* Title Section - Template ligne 134-142 About Me adapted */}
                <div className="mt-4">
                    <h3 className="text-slate-900 dark:text-white tracking-tight text-xl font-bold leading-tight px-4 pb-2">Titre de la Demande</h3>
                    <div className="px-4">
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full rounded-xl border border-[#e6dbdc] dark:border-gray-700 bg-white dark:bg-[#351a1c] p-4 text-slate-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:border-[#f42536] focus:ring-[#f42536] text-base"
                            placeholder="Ex: Contribution mensuelle pour ma lifestyle"
                        />
                    </div>
                </div>

                {/* Description Section - Template ligne 134-142 */}
                <div className="mt-6">
                    <h3 className="text-slate-900 dark:text-white tracking-tight text-xl font-bold leading-tight px-4 pb-2">Description</h3>
                    <div className="px-4">
                        <div className="relative">
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full rounded-xl border border-[#e6dbdc] dark:border-gray-700 bg-white dark:bg-[#351a1c] p-4 text-slate-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:border-[#f42536] focus:ring-[#f42536] min-h-[120px] resize-none text-base"
                                placeholder="Décrivez votre demande..."
                            ></textarea>
                            <div className="absolute bottom-3 right-3 text-xs text-gray-400 dark:text-gray-500 font-medium">
                                {formData.description.length}/500
                            </div>
                        </div>
                    </div>
                </div>

                {/* Amount Section - Template ligne 171-214 Details adapted */}
                <div className="mt-6 px-4">
                    <h3 className="text-slate-900 dark:text-white tracking-tight text-xl font-bold leading-tight pb-2">Montant & Type</h3>
                    <div className="flex flex-col rounded-xl border border-[#e6dbdc] dark:border-gray-700 bg-white dark:bg-[#351a1c] overflow-hidden">
                        {/* Amount Row */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
                            <div className="flex items-center gap-3">
                                <div className="size-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500">
                                    <span className="material-symbols-outlined text-lg">euro</span>
                                </div>
                                <span className="text-base font-semibold text-slate-900 dark:text-white">Montant (€)</span>
                            </div>
                            <input
                                type="number"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                className="w-24 text-right bg-transparent text-gray-600 dark:text-gray-300 text-sm font-medium border-none focus:outline-none focus:text-[#f42536]"
                                placeholder="0"
                            />
                        </div>

                        {/* Type Row */}
                        <div className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-3">
                                <div className="size-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500">
                                    <span className="material-symbols-outlined text-lg">sync</span>
                                </div>
                                <span className="text-base font-semibold text-slate-900 dark:text-white">Type</span>
                            </div>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'ponctuel' | 'récurrent' })}
                                className="bg-transparent text-gray-600 dark:text-gray-300 text-sm font-medium border-none focus:outline-none focus:text-[#f42536] cursor-pointer"
                            >
                                <option value="ponctuel">Ponctuel</option>
                                <option value="récurrent">Récurrent</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Contrepartie Section - Template ligne 144-169 Interests adapted */}
                <div className="mt-6">
                    <div className="flex justify-between items-baseline px-4 pb-3">
                        <h3 className="text-slate-900 dark:text-white tracking-tight text-xl font-bold leading-tight">Contrepartie</h3>
                    </div>
                    <div className="px-4 flex flex-wrap gap-2">
                        <button
                            onClick={() => setFormData({ ...formData, contrepartie: 'aucune' })}
                            className={`px-4 py-2 rounded-full border-2 text-sm font-bold transition-all ${formData.contrepartie === 'aucune'
                                    ? 'border-[#f42536] bg-[#f42536]/10 text-[#f42536]'
                                    : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-[#351a1c] text-gray-600 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500'
                                }`}
                        >
                            Aucune ❌
                        </button>
                        <button
                            onClick={() => setFormData({ ...formData, contrepartie: 'dm_access' })}
                            className={`px-4 py-2 rounded-full border-2 text-sm font-bold transition-all ${formData.contrepartie === 'dm_access'
                                    ? 'border-[#f42536] bg-[#f42536]/10 text-[#f42536]'
                                    : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-[#351a1c] text-gray-600 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500'
                                }`}
                        >
                            Accès DM 💬
                        </button>
                        <button
                            onClick={() => setFormData({ ...formData, contrepartie: 'content' })}
                            className={`px-4 py-2 rounded-full border-2 text-sm font-bold transition-all ${formData.contrepartie === 'content'
                                    ? 'border-[#f42536] bg-[#f42536]/10 text-[#f42536]'
                                    : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-[#351a1c] text-gray-600 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500'
                                }`}
                        >
                            Contenu 📸
                        </button>
                        <button
                            onClick={() => setFormData({ ...formData, contrepartie: 'autre' })}
                            className={`px-4 py-2 rounded-full border-2 text-sm font-bold transition-all ${formData.contrepartie === 'autre'
                                    ? 'border-[#f42536] bg-[#f42536]/10 text-[#f42536]'
                                    : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-[#351a1c] text-gray-600 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500'
                                }`}
                        >
                            Autre ✨
                        </button>
                    </div>

                    {/* Autre Details */}
                    {formData.contrepartie === 'autre' && (
                        <div className="px-4 mt-3">
                            <input
                                type="text"
                                value={formData.contrepartie_details}
                                onChange={(e) => setFormData({ ...formData, contrepartie_details: e.target.value })}
                                className="w-full rounded-xl border border-[#e6dbdc] dark:border-gray-700 bg-white dark:bg-[#351a1c] p-3 text-slate-900 dark:text-white placeholder:text-gray-400 text-sm"
                                placeholder="Précisez..."
                            />
                        </div>
                    )}
                </div>

                {/* Disclaimer Section - Template ligne 118-132 Smart Photos toggle adapted */}
                <div className="px-4 py-2 mt-6 @container">
                    <div className="flex flex-1 flex-col items-start justify-between gap-4 rounded-xl border-2 border-yellow-300 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/20 p-5 shadow-sm">
                        <div className="flex flex-col gap-1">
                            <p className="text-yellow-800 dark:text-yellow-200 text-base font-bold leading-tight flex items-center gap-2">
                                ⚠️ ATTENTION
                            </p>
                            <p className="text-yellow-700 dark:text-yellow-300 text-sm font-normal leading-normal">
                                Le paiement ne garantit aucune interaction. L'accès aux DMs ou toute contrepartie est à votre discrétion exclusive.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer - Template ligne 275-282 */}
                <div className="mt-8 px-4 pb-8 flex flex-col items-center gap-4">
                    <button
                        onClick={handleSubmit}
                        disabled={loading || !formData.title || !formData.amount}
                        className="w-full py-4 rounded-xl bg-[#f42536] text-white font-bold hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400"
                    >
                        {loading ? 'Création...' : 'Créer la Demande'}
                    </button>
                    <div className="h-px w-full bg-gray-200 dark:bg-gray-800"></div>
                    <button
                        onClick={() => router.back()}
                        className="text-gray-400 dark:text-gray-600 font-semibold text-sm hover:text-[#f42536] transition-colors"
                    >
                        Annuler
                    </button>
                </div>
            </div>
        </div>
    )
}
