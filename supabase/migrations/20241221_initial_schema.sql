-- Migration: Initial Schema for Financial Domination Platform
-- Created: 2024-12-21

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table des profils utilisateurs
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('dominante', 'contributeur')),
  pseudonym TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  date_of_birth DATE NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  terms_accepted_at TIMESTAMPTZ,
  terms_version TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des profils dominantes (extend profiles)
CREATE TABLE public.dominante_profiles (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  description TEXT,
  persona TEXT CHECK (persona IN ('soft', 'strict', 'humiliating', 'other')),
  rules TEXT,
  dms_enabled BOOLEAN DEFAULT FALSE,
  dms_require_payment BOOLEAN DEFAULT TRUE,
  min_payment_for_dm NUMERIC(10,2),
  profile_visibility TEXT DEFAULT 'public' CHECK (profile_visibility IN ('public', 'paid')),
  leaderboard_visible BOOLEAN DEFAULT TRUE,
  stripe_account_id TEXT,
  total_contributors INTEGER DEFAULT 0,
  total_earned NUMERIC(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des photos de profil
CREATE TABLE public.profile_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  display_order INTEGER NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des demandes financières
CREATE TABLE public.financial_demands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dominante_id UUID NOT NULL REFERENCES public.dominante_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('ponctuel', 'récurrent')),
  contrepartie TEXT NOT NULL CHECK (contrepartie IN ('aucune', 'dm_access', 'content', 'autre')),
  contrepartie_details TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des paiements
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contributor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  dominante_id UUID NOT NULL REFERENCES public.dominante_profiles(id) ON DELETE CASCADE,
  demand_id UUID REFERENCES public.financial_demands(id) ON DELETE SET NULL,
  amount NUMERIC(10,2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('ponctuel', 'récurrent')),
  status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  stripe_payment_id TEXT UNIQUE,
  stripe_subscription_id TEXT,
  is_anonymous BOOLEAN DEFAULT FALSE,
  paid_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des conversations DM
CREATE TABLE public.dm_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dominante_id UUID NOT NULL REFERENCES public.dominante_profiles(id) ON DELETE CASCADE,
  contributor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'blocked', 'access_removed')),
  access_granted_at TIMESTAMPTZ,
  is_read_only BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(dominante_id, contributor_id)
);

-- Table des messages
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.dm_conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_pinned BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des réactions aux messages
CREATE TABLE public.message_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  emoji TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(message_id, user_id, emoji)
);

-- Table des notifications
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('payment_received', 'dm_access_granted', 'dm_access_revoked', 'dm_request', 'demand_published', 'new_message')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  related_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  related_demand_id UUID REFERENCES public.financial_demands(id) ON DELETE SET NULL,
  related_payment_id UUID REFERENCES public.payments(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des utilisateurs bloqués
CREATE TABLE public.blocked_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  blocked_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(blocker_id, blocked_id)
);

-- Table des préférences contributeur
CREATE TABLE public.contributor_preferences (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  filter_dms_open BOOLEAN DEFAULT FALSE,
  filter_max_amount NUMERIC(10,2),
  filter_demand_types TEXT[],
  notifications_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes pour performance
CREATE INDEX idx_financial_demands_dominante ON public.financial_demands(dominante_id, is_active);
CREATE INDEX idx_payments_contributor ON public.payments(contributor_id, paid_at DESC);
CREATE INDEX idx_payments_dominante ON public.payments(dominante_id, paid_at DESC);
CREATE INDEX idx_dm_conversations_dominante ON public.dm_conversations(dominante_id, status);
CREATE INDEX idx_dm_conversations_contributor ON public.dm_conversations(contributor_id, status);
CREATE INDEX idx_messages_conversation ON public.messages(conversation_id, created_at DESC);
CREATE INDEX idx_notifications_user ON public.notifications(user_id, read, created_at DESC);
CREATE INDEX idx_profile_photos_user ON public.profile_photos(user_id, display_order);

-- Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dominante_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_demands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dm_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contributor_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_reactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles: Everyone can read, users can update their own
CREATE POLICY "Profiles are publicly readable" 
  ON public.profiles FOR SELECT 
  USING (true);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Dominante profiles: Public read, owner update
CREATE POLICY "Dominante profiles are publicly readable" 
  ON public.dominante_profiles FOR SELECT 
  USING (true);

CREATE POLICY "Dominantes can update their own profile" 
  ON public.dominante_profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Dominantes can insert their own profile"
  ON public.dominante_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Profile photos: Public read, owner write
CREATE POLICY "Profile photos are publicly readable"
  ON public.profile_photos FOR SELECT
  USING (true);

CREATE POLICY "Users can manage their own photos"
  ON public.profile_photos FOR ALL
  USING (auth.uid() = user_id);

-- Financial demands: Public read, dominante write
CREATE POLICY "Active demands are publicly readable"
  ON public.financial_demands FOR SELECT
  USING (is_active = true OR dominante_id IN (SELECT id FROM public.dominante_profiles WHERE id = auth.uid()));

CREATE POLICY "Dominantes can manage their demands"
  ON public.financial_demands FOR ALL
  USING (dominante_id = auth.uid());

-- Payments: Only involved parties can read
CREATE POLICY "Users can read their own payments"
  ON public.payments FOR SELECT
  USING (contributor_id = auth.uid() OR dominante_id = auth.uid());

CREATE POLICY "System can insert payments"
  ON public.payments FOR INSERT
  WITH CHECK (true); -- Will be restricted by service role

-- DM Conversations: Only involved parties
CREATE POLICY "Users can read their own conversations"
  ON public.dm_conversations FOR SELECT
  USING (contributor_id = auth.uid() OR dominante_id = auth.uid());

CREATE POLICY "Dominantes can update their conversations"
  ON public.dm_conversations FOR UPDATE
  USING (dominante_id = auth.uid());

CREATE POLICY "System can create conversations"
  ON public.dm_conversations FOR INSERT
  WITH CHECK (true);

-- Messages: Only conversation participants
CREATE POLICY "Users can read messages in their conversations"
  ON public.messages FOR SELECT
  USING (
    conversation_id IN (
      SELECT id FROM public.dm_conversations 
      WHERE contributor_id = auth.uid() OR dominante_id = auth.uid()
    )
  );

CREATE POLICY "Users can send messages in active conversations"
  ON public.messages FOR INSERT
  WITH CHECK (
    sender_id = auth.uid() AND
    conversation_id IN (
      SELECT id FROM public.dm_conversations 
      WHERE (contributor_id = auth.uid() OR dominante_id = auth.uid())
      AND status = 'active'
      AND (is_read_only = false OR dominante_id = auth.uid())
    )
  );

CREATE POLICY "Dominantes can pin messages"
  ON public.messages FOR UPDATE
  USING (
    conversation_id IN (
      SELECT id FROM public.dm_conversations WHERE dominante_id = auth.uid()
    )
  );

-- Notifications: Users can read their own
CREATE POLICY "Users can read their own notifications"
  ON public.notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE
  USING (user_id = auth.uid());

-- Blocked users: Users can manage their blocks
CREATE POLICY "Users can read their blocked list"
  ON public.blocked_users FOR SELECT
  USING (blocker_id = auth.uid());

CREATE POLICY "Users can block others"
  ON public.blocked_users FOR INSERT
  WITH CHECK (blocker_id = auth.uid());

CREATE POLICY "Users can unblock others"
  ON public.blocked_users FOR DELETE
  USING (blocker_id = auth.uid());

-- Contributor preferences: Users own their preferences
CREATE POLICY "Users can read their own preferences"
  ON public.contributor_preferences FOR SELECT
  USING (id = auth.uid());


CREATE POLICY "Users can update their own preferences"
  ON public.contributor_preferences FOR ALL
  USING (id = auth.uid());

-- Message reactions: Users can react
CREATE POLICY "Users can read reactions"
  ON public.message_reactions FOR SELECT
  USING (
    message_id IN (
      SELECT m.id FROM public.messages m
      JOIN public.dm_conversations c ON c.id = m.conversation_id
      WHERE c.contributor_id = auth.uid() OR c.dominante_id = auth.uid()
    )
  );

CREATE POLICY "Users can add reactions"
  ON public.message_reactions FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can remove their reactions"
  ON public.message_reactions FOR DELETE
  USING (user_id = auth.uid());

-- Functions

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dominante_profiles_updated_at BEFORE UPDATE ON public.dominante_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dm_conversations_updated_at BEFORE UPDATE ON public.dm_conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contributor_preferences_updated_at BEFORE UPDATE ON public.contributor_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
