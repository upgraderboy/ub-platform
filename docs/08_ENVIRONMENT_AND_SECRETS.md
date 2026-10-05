# 08: Environment Variables & Secrets Vault

This document defines the environment variables required across each application and package, with strict classification between **Public** (client-safe) and **Private** (server-only) credentials.

---

## 1. Secrets Classification & Security Rules

> ⚠️ **CRITICAL SECURITY RULE:**  
> Never prefix private database credentials, service role keys, or admin passwords with `NEXT_PUBLIC_` or `EXPO_PUBLIC_`. Private keys in client bundles will be exposed to the public internet.

---

## 2. Environment Variables Matrix

### A. Public Web Application (`apps/web/.env.example`)
```bash
# Public API & DB Client (Read-Only / RLS protected)
NEXT_PUBLIC_API_URL=https://api.upgraderboy.com
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key

# Analytics & Monitoring
NEXT_PUBLIC_SITE_URL=https://upgraderboy.com
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Public Feature Flags
NEXT_PUBLIC_ENABLE_AI_COPILOT=true
```

### B. CMS Admin Portal (`apps/admin/.env.example`)
```bash
# Admin Auth & Management
ADMIN_SESSION_SECRET=super-secret-random-32-character-string
SUPABASE_SERVICE_ROLE_KEY=your-service-role-admin-key

# Storage & Uploads
ASSET_STORAGE_BUCKET=ub-platform-assets
```

### C. Mobile App (`apps/mobile/.env.example`)
```bash
EXPO_PUBLIC_API_URL=https://api.upgraderboy.com
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

### D. AI Copilot Edge Worker (`packages/api` / Serverless)
```bash
GEMINI_API_KEY=your-gemini-api-key
OPENAI_API_KEY=your-openai-api-key
```
