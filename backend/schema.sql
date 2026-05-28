-- MASIDY AGENTIC DATABASE SCHEMA WITH HARDENED RLS POLICIES
-- DATABASE: PostgreSQL (Supabase Compatible)

-- Enable UUID extension if not present
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    external_id VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 2. CONVERSATIONS TABLE
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 3. MESSAGES TABLE
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
    role VARCHAR(50) NOT NULL CONSTRAINT check_message_role CHECK (role IN ('system', 'user', 'assistant')),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 4. USER PROFILE TABLE
CREATE TABLE IF NOT EXISTS user_profile (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    class_name VARCHAR(100) DEFAULT 'Industrial Developer' NOT NULL,
    preferences JSONB DEFAULT '{}'::jsonb NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Enable RLS (Row Level Security) on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profile ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- SERVICE ROLE BYPASS (allows backend/FastAPI full access)
-- These policies allow the Supabase service_role key to bypass
-- RLS so the backend can read/write on behalf of any user.
-- ============================================================

-- Drop old policies first to avoid conflicts
DROP POLICY IF EXISTS "Users can only read and manage their own entry" ON users;
DROP POLICY IF EXISTS "Users can manage conversations belonging to them" ON conversations;
DROP POLICY IF EXISTS "Users can manage messages within their conversations" ON messages;
DROP POLICY IF EXISTS "Users can manage their personal profiles" ON user_profile;
DROP POLICY IF EXISTS "Service role bypass users" ON users;
DROP POLICY IF EXISTS "Service role bypass conversations" ON conversations;
DROP POLICY IF EXISTS "Service role bypass messages" ON messages;
DROP POLICY IF EXISTS "Service role bypass user_profile" ON user_profile;
DROP POLICY IF EXISTS "Authenticated users manage own data" ON users;
DROP POLICY IF EXISTS "Authenticated users manage own conversations" ON conversations;
DROP POLICY IF EXISTS "Authenticated users manage own messages" ON messages;
DROP POLICY IF EXISTS "Authenticated users manage own profile" ON user_profile;

-- USERS: service role full access + authenticated user own row
CREATE POLICY "Service role bypass users" ON users
    FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users manage own data" ON users
    FOR ALL TO authenticated
    USING (id = auth.uid() OR external_id = auth.uid()::text);

-- CONVERSATIONS: service role full access + authenticated user own rows
CREATE POLICY "Service role bypass conversations" ON conversations
    FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users manage own conversations" ON conversations
    FOR ALL TO authenticated
    USING (user_id IN (
        SELECT id FROM users WHERE id = auth.uid() OR external_id = auth.uid()::text
    ));

-- MESSAGES: service role full access + authenticated user own rows
CREATE POLICY "Service role bypass messages" ON messages
    FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users manage own messages" ON messages
    FOR ALL TO authenticated
    USING (conversation_id IN (
        SELECT c.id FROM conversations c
        JOIN users u ON c.user_id = u.id
        WHERE u.id = auth.uid() OR u.external_id = auth.uid()::text
    ));

-- USER PROFILE: service role full access + authenticated user own row
CREATE POLICY "Service role bypass user_profile" ON user_profile
    FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users manage own profile" ON user_profile
    FOR ALL TO authenticated
    USING (user_id IN (
        SELECT id FROM users WHERE id = auth.uid() OR external_id = auth.uid()::text
    ));

-- Indexes for maximum query throughput
CREATE INDEX IF NOT EXISTS idx_users_external ON users(external_id);
CREATE INDEX IF NOT EXISTS idx_conversations_user ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_user_profile_user ON user_profile(user_id);
