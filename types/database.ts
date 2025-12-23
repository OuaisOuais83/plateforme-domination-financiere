export type UserRole = 'dominante' | 'contributeur';

export type Persona = 'soft' | 'strict' | 'humiliating' | 'other';

export type DemandType = 'ponctuel' | 'récurrent';

export type Contrepartie = 'aucune' | 'dm_access' | 'content' | 'autre';

export type ConversationStatus = 'pending' | 'active' | 'blocked' | 'access_removed';

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface Profile {
    id: string;
    role: UserRole;
    pseudonym: string;
    email: string;
    date_of_birth: string;
    verified: boolean;
    terms_accepted_at?: string;
    terms_version?: string;
    created_at: string;
    updated_at: string;
}

export interface DominanteProfile {
    id: string;
    description?: string;
    persona?: Persona;
    rules?: string;
    dms_enabled: boolean;
    dms_require_payment: boolean;
    min_payment_for_dm?: number;
    profile_visibility: 'public' | 'paid';
    leaderboard_visible: boolean;
    stripe_account_id?: string;
    total_contributors: number;
    total_earned: number;
    created_at: string;
    updated_at: string;
}

export interface ProfilePhoto {
    id: string;
    user_id: string;
    url: string;
    display_order: number;
    uploaded_at: string;
}

export interface FinancialDemand {
    id: string;
    dominante_id: string;
    title: string;
    description: string;
    amount: number;
    type: DemandType;
    contrepartie: Contrepartie;
    contrepartie_details?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Payment {
    id: string;
    contributor_id: string;
    dominante_id: string;
    demand_id?: string;
    amount: number;
    type: DemandType;
    status: PaymentStatus;
    stripe_payment_id?: string;
    stripe_subscription_id?: string;
    is_anonymous: boolean;
    paid_at: string;
    created_at: string;
}

export interface DMConversation {
    id: string;
    dominante_id: string;
    contributor_id: string;
    status: ConversationStatus;
    access_granted_at?: string;
    is_read_only: boolean;
    created_at: string;
    updated_at: string;
}

export interface Message {
    id: string;
    conversation_id: string;
    sender_id: string;
    content: string;
    is_pinned: boolean;
    read_at?: string;
    created_at: string;
}

export interface ContributorPreferences {
    id: string;
    filter_dms_open: boolean;
    filter_max_amount?: number;
    filter_demand_types?: string[];
    notifications_enabled: boolean;
    created_at: string;
    updated_at: string;
}

// Extended types with relations

export interface DominanteProfileWithRelations extends DominanteProfile {
    profile: Profile;
    profile_photos: ProfilePhoto[];
    financial_demands: FinancialDemand[];
}

export interface ProfileWithRole extends Profile {
    dominante_profile?: DominanteProfile;
    contributor_preferences?: ContributorPreferences;
}
