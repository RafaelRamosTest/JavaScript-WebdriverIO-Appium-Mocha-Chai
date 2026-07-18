const { config } = require('./wdio.shared.conf.js');
const path = require('path');

// Mapeia o caminho do ZIP do Simulador iOS de forma robusta
const iosAppPath = path.join(__dirname, '../apps/ios.simulator.wdio.native.app.v2.2.0.zip');
console.log(`\n🍏 Iniciando testes com o App iOS: ${iosAppPath}\n`);

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
  // Capacidades específicas para iOS (Simulador)
  capabilities: [{
    platformName: 'iOS',
    'appium:automationName': 'XCUITest',         // Driver correto para iOS
    'appium:deviceName': 'iPhone 15',            // Nome do simulador configurado no seu Mac/Xcode
    'appium:platformVersion': '17.2',            // Altere para a versão do iOS instalada no seu simulador
    'appium:app': iosAppPath,                    // Variável correta com o caminho do zip do iOS
    'appium:noReset': true,
    'appium:newCommandTimeout': 240,
  }],

  // Mescla os serviços compartilhados (se existirem) com o serviço local do Appium
  services: [
    ...(config.services || []),
    ['appium', { args: { relaxedSecurity: true } }],
  ],
};