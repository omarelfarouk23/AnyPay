#!/bin/bash
# Generate Algerian Blue-Gold Assets for Anypay
# Run from project root: node scripts/generate-assets.js

node scripts/generate-assets.js

echo ""
echo "✅ Assets verified/placeholder created:"
echo "   - assets/icon.png (1024x1024) — main app icon"
echo "   - assets/splash.png (1024x1024) — splash screen background"
echo "   - assets/adaptive-icon.png (1024x1024) — Android adaptive icon"
echo "   - assets/favicon.png (64x64) — web favicon"
echo ""
echo "   الألوان: #1A2E6B (الأزرق الجزائري) + #F5A623 (الذهبي الجزائري)"
echo ""
echo "⚠️  استبدل هذه النماذج بالأصول المصممة احترافياً قبل الإصدار."
echo "   للويب: favicon.png يجب أن يكون 64x64 أو 192x192"
echo "   لـ Android: adaptive-icon.png يجب أن يكون 108x108 على الأقل"
