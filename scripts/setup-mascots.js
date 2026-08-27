const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'mobile', 'assets', 'mascot');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const baseMascot = path.join(__dirname, 'mobile', 'assets', 'mascot.png');
if (fs.existsSync(baseMascot)) {
  fs.copyFileSync(baseMascot, path.join(targetDir, 'mascot_default.png'));
  fs.copyFileSync(baseMascot, path.join(targetDir, 'mascot_ai.png'));
  fs.copyFileSync(baseMascot, path.join(targetDir, 'mascot_empty.png'));
  fs.copyFileSync(baseMascot, path.join(targetDir, 'mascot_celebrate.png'));
  console.log('Successfully copied mascot assets into mobile/assets/mascot/');
} else {
  console.error('mascot.png not found at', baseMascot);
}
