const { config } = require('./wdio.shared.conf.js');
const path = require('path');

// Caminho atualizado para a release oficial do Native Demo App
const androidAppPath = path.join(global.baseDir, './apps/android.wdio.native.app.v2.2.0.apk');
console.log(`\n📱 Iniciando testes com o App Android: ${androidAppPath}\n`);

exports.config = {
  ...config,
  specs: [
    path.join(__dirname, '../src/specs/**/*.js')
  ],
  autoCompileOpts: {
    autoCompile: false,
    tsNodeOpts: {
      skipProject: true
    }
  },
  // Capacidades específicas para Android (Emulador)
  capabilities: [{
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': 'Pixel_4',
    'appium:platformVersion': '11',
    'appium:app': androidAppPath,
    'appium:noReset': true,
    'appium:newCommandTimeout': 240,
  }],
  services: [
    ...config.services,
    ['appium', { args: { relaxedSecurity: true } }],
  ],
};