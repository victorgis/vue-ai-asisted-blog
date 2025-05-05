-- Database Schema for Blog AI Assistant

-- Users table to store user information
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    bio TEXT,
    avatar_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blog posts table to store user's blog drafts and published posts
CREATE TABLE blog_posts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255),
    content TEXT NOT NULL,
    summary TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'draft', -- draft, published, archived
    view_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP,
    
    CONSTRAINT valid_status CHECK (status IN ('draft', 'published', 'archived'))
);

-- AI suggestions table to store AI-generated content for blog posts
CREATE TABLE ai_suggestions (
    id SERIAL PRIMARY KEY,
    blog_post_id INTEGER NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
    suggestion_type VARCHAR(20) NOT NULL, -- title, summary, keywords
    content TEXT NOT NULL,
    is_applied BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_suggestion_type CHECK (suggestion_type IN ('title', 'summary', 'keywords'))
);

-- Blog post keywords/tags
CREATE TABLE keywords (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Junction table for blog posts and keywords (many-to-many)
CREATE TABLE blog_post_keywords (
    blog_post_id INTEGER NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
    keyword_id INTEGER NOT NULL REFERENCES keywords(id) ON DELETE CASCADE,
    PRIMARY KEY (blog_post_id, keyword_id)
);

-- Table for storing API usage statistics
CREATE TABLE api_usage (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    api_type VARCHAR(20) NOT NULL, -- openai, other_provider
    endpoint VARCHAR(100) NOT NULL, -- specific API endpoint used
    tokens_used INTEGER NOT NULL DEFAULT 0,
    cost DECIMAL(10, 6) DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance optimization
CREATE INDEX idx_blog_posts_user_id ON blog_posts(user_id);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_ai_suggestions_blog_post_id ON ai_suggestions(blog_post_id);
CREATE INDEX idx_ai_suggestions_type ON ai_suggestions(suggestion_type);
CREATE INDEX idx_api_usage_user_id ON api_usage(user_id);

-- Example database views

-- View for user dashboard statistics
CREATE VIEW user_dashboard_stats AS
SELECT 
    u.id AS user_id,
    u.username,
    COUNT(DISTINCT bp.id) AS total_posts,
    SUM(CASE WHEN bp.status = 'published' THEN 1 ELSE 0 END) AS published_posts,
    SUM(CASE WHEN bp.status = 'draft' THEN 1 ELSE 0 END) AS draft_posts,
    SUM(bp.view_count) AS total_views,
    MAX(bp.updated_at) AS last_activity
FROM 
    users u
LEFT JOIN 
    blog_posts bp ON u.id = bp.user_id
GROUP BY 
    u.id, u.username;

-- View for AI suggestion statistics
CREATE VIEW ai_suggestion_stats AS
SELECT 
    u.id AS user_id,
    u.username,
    ais.suggestion_type,
    COUNT(ais.id) AS total_suggestions,
    SUM(CASE WHEN ais.is_applied THEN 1 ELSE 0 END) AS applied_suggestions,
    COUNT(DISTINCT ais.blog_post_id) AS posts_with_suggestions
FROM 
    users u
JOIN 
    blog_posts bp ON u.id = bp.user_id
JOIN 
    ai_suggestions ais ON bp.id = ais.blog_post_id
GROUP BY 
    u.id, u.username, ais.suggestion_type;