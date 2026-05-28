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

-- Create dynamic security access control policies
-- For the simplicity of standard Supabase anonymous user access mapping (auth.uid()):

-- USERS POLICIES
CREATE POLICY "Users can only read and manage their own entry" ON users
    FOR ALL
    USING (id = auth.uid() OR external_id = auth.jwt() ->> 'sub');

-- CONVERSATIONS POLICIES
CREATE POLICY "Users can manage conversations belonging to them" ON conversations
    FOR ALL
    USING (user_id = auth.uid() OR user_id IN (
        SELECT id FROM users WHERE external_id = auth.jwt() ->> 'sub'
    ));

-- MESSAGES POLICIES
CREATE POLICY "Users can manage messages within their conversations" ON messages
    FOR ALL
    USING (conversation_id IN (
        SELECT id FROM conversations WHERE user_id = auth.uid() OR user_id IN (
            SELECT id FROM users WHERE external_id = auth.jwt() ->> 'sub'
        )
    ));

-- USER PROFILE POLICIES
CREATE POLICY "Users can manage their personal profiles" ON user_profile
    FOR ALL
    USING (user_id = auth.uid() OR user_id IN (
        SELECT id FROM users WHERE external_id = auth.jwt() ->> 'sub'
    ));

-- Indeces for maximum visual search throughput
CREATE INDEX IF NOT EXISTS idx_users_external ON users(external_id);
CREATE INDEX IF NOT EXISTS idx_conversations_user ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_user_profile_user ON user_profile(user_id);
