# Save this as 'rollback.sh' in your V4 root
# It uses Git to reset only the specific folders the Agent touches
git checkout HEAD -- src/content/articles
git checkout HEAD -- src/components/ui
echo "⚠️ Rollback Complete: Articles and UI restored to last stable commit."