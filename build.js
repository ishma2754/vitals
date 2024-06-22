const { execSync } = require('child_process');

const type = process.env.TYPE;

if (type === 'server') {
  execSync('cd server && npm install', { stdio: 'inherit' });
} else {
  execSync('cd client && npm install', { stdio: 'inherit' });
}
