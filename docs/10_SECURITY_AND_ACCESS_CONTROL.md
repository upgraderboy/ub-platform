# 10: Security, Access Control & Hardening Playbook

This document defines the security architecture, Row-Level Security (RLS) policies, input sanitization rules, and protection against denial-of-service for the **UB Platform**.

---

## 1. Database Row-Level Security (RLS)

All database tables enforce strict RLS policies to guarantee that public visitors can never modify or delete data:

```sql
-- Public Content (Blogs, Projects, Resources, Memories, Testimonials)
-- 1. Anyone can read published items:
CREATE POLICY "Public read-only access for published content"
ON public.blogs FOR SELECT
USING (status = 'published');

-- 2. Only authenticated admins can insert, update, or delete:
CREATE POLICY "Admins have full CRUD access"
ON public.blogs FOR ALL
TO authenticated
USING (auth.jwt() ->> 'role' = 'admin');

-- Leads Table (Client Inquiries)
-- Anyone can INSERT a lead proposal; only admins can VIEW or UPDATE:
CREATE POLICY "Public can submit project leads"
ON public.leads FOR INSERT
WITH CHECK (true);

CREATE POLICY "Only admins can view leads"
ON public.leads FOR SELECT
TO authenticated
USING (auth.jwt() ->> 'role' = 'admin');
```

---

## 2. Input Sanitization & XSS Defense

* **Markdown Blog Reader:** Content rendered with `react-markdown` or custom blocks MUST pass through `rehype-sanitize` to strip malicious `<script>`, `<iframe>`, or `onload` attributes.
* **Form Inputs:** Form submissions in the Project Estimator and Contact section validate using Zod string sanitization to prevent SQL/NoSQL injection.

---

## 3. Rate Limiting & Bot Protection

* **Lead Submissions (`/contact` & `/services`):** Rate-limited to max 5 requests per IP per 10 minutes using Upstash Redis / Edge in-memory limiters.
* **AI Copilot (`/api/copilot`):** Rate-limited to 10 queries per session to prevent API credit exhaustion.
* **Admin Login (`/admin/login`):** Strict lockout after 5 failed attempts within 15 minutes.
