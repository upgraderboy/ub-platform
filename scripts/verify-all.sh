#!/usr/bin/env bash
set -e

echo "=========================================="
echo "🛡️  UB PLATFORM: FULL VERIFICATION SUITE"
echo "=========================================="

echo "1. Checking TypeScript across all workspaces..."
bun x turbo run check

echo "2. Running Linter..."
bun x turbo run lint

echo "3. Running Unit & Functional Tests..."
bun test

echo "=========================================="
echo "✅ ALL VERIFICATIONS PASSED SUCCESSFULLY!"
echo "=========================================="
