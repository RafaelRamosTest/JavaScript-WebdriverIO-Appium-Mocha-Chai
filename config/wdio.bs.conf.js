const { config } = require('./wdio.shared.conf.js');

exports.config = {
  ...config,
  // Configs para BrowserStack (Opcional)
  user: process.env.BROWSERSTACK_USER,
  key: process.env.BROWSERSTACK_KEY,
  capabilities: [{
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:platformVersion': '13.0',
    'appium:deviceName': 'Google Pixel 7',
    'appium:app': process.env.BROWSERSTACK_APP_ID,
    'bstack:options': {
      userName: process.env.BROWSERSTACK_USER,
      accessKey: process.env.BROWSERSTACK_KEY,
      projectName: 'WebdriverIO Mobile Tests',
      sessionName: 'Android Test Session',
      appiumVersion: '2.0.0',
    },
  }],
  services: [
    ...config.services,
    ['browserstack'],
  ],
};