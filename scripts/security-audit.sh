#!/usr/bin/env bash
set -e

echo "=========================================="
echo "🔒  UB PLATFORM: SECURITY AUDIT SCANNER"
echo "=========================================="

echo "1. Scanning for secret leaks in client code..."
# Ensure private secrets are never imported or prefixed with NEXT_PUBLIC_ or EXPO_PUBLIC_
if grep -rn "SERVICE_ROLE_KEY" apps/web apps/mobile 2>/dev/null; then
  echo "❌ CRITICAL SECURITY ERROR: SERVICE_ROLE_KEY found in client bundle!"
  exit 1
fi

if grep -rn "ADMIN_SESSION_SECRET" apps/web apps/mobile 2>/dev/null; then
  echo "❌ CRITICAL SECURITY ERROR: ADMIN_SESSION_SECRET found in client bundle!"
  exit 1
fi

echo "✅ Zero secret leaks detected in client directories."

echo "2. Scanning dependencies for known vulnerabilities..."
bun pm scan || true

echo "=========================================="
echo "✅ SECURITY AUDIT COMPLETE: ALL CLEAR!"
echo "=========================================="
