# ADR-002: Physical Decoupling of the CMS Admin Portal

* **Status:** Accepted
* **Date:** 2026-10-06
* **Deciders:** Upgrader Boy Lead Engineering

---

## Context & Problem Statement
On the legacy site, the Admin CMS was bundled directly inside the public Next.js app bundle (`/app/admin/page.js`), inflating public bundle sizes (over 130KB of admin logic sent to regular visitors) and creating a single point of failure: an unhandled exception or memory spike during an admin operation could take down the entire public business website.

## Decision
Physically decouple the CMS Admin Portal into its own independent application (`apps/admin`) deployed to a dedicated subdomain (`admin.upgraderboy.com`).

## Consequences & Trade-offs
* **Positive:** Complete blast-radius containment. Admin crashes, high CPU loads, or security attacks on the admin interface have zero impact on the availability of `upgraderboy.com`. Public client bundles remain ultra-lean.
* **Negative:** Requires managing two separate deployment targets. Mitigated by automated CI/CD previews and shared configuration in Turborepo.
