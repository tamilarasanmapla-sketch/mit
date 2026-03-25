#!/usr/bin/env node
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const repoPath = 'C:\\Users\\tamil\\OneDrive\\Desktop\\new\\class\\ecom';
process.chdir(repoPath);

console.log('🔧 Git Push Script - E-Commerce Repository');
console.log('==========================================\n');

try {
  console.log('📁 Repository: ' + repoPath);
  console.log('🌳 Remote: git@github.com:tamilarasanmapla-sketch/e-com.git');
  
  // Check current branch
  const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
  console.log('📍 Current branch: ' + branch);
  
  console.log('\n--- Git Status ---');
  execSync('git status', { stdio: 'inherit' });
  
  console.log('\n\n➕ Staging all changes...');
  execSync('git add .', { stdio: 'inherit' });
  
  console.log('\n💾 Creating commit...');
  const commitMsg = 'Code update for e-commerce platform\n\nCo-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>';
  execSync(`git commit -m "${commitMsg}"`, { stdio: 'inherit', shell: 'cmd.exe' });
  
  console.log('\n🚀 Pushing to origin/' + branch + '...');
  execSync('git push origin ' + branch, { stdio: 'inherit' });
  
  console.log('\n✅ SUCCESS! Code pushed to tamilarasanmapla-sketch/e-com on branch ' + branch);
  console.log('📊 View your changes at: https://github.com/tamilarasanmapla-sketch/e-com/tree/' + branch);
  
} catch (error) {
  console.error('\n❌ ERROR: ' + error.message);
  console.log('\nMake sure you have:');
  console.log('  1. Git installed');
  console.log('  2. SSH keys configured for GitHub');
  console.log('  3. Committed the changes (or run git add . && git commit)');
  process.exit(1);
}
