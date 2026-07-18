const { TimelineService } = require('wdio-timeline-reporter/timeline-service');
const path = require('path');

// Definir o baseDir o mais cedo possível para que esteja disponível nas capabilities
global.baseDir = path.join(__dirname, '..');

exports.config = {
  maxInstances: 1,
  // Serviços e Hooks compartilhados
  runner: 'local',
  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    timeout: 60000,
  },

  // Hooks globais
  beforeSession: (config, capabilities, specs) => {
    // Instância do TimelineService para relatórios unificados
    require('@babel/register');
  },
  before: (capabilities, specs) => {
    // Reassegura que o baseDir está disponível globalmente antes de cada teste
    global.baseDir = path.join(__dirname, '..');
  },
  afterSuite: (suite) => {
    // Códigos de limpeza pós-suíte
  },

  // Relatórios de execução
  reporters: [
    'spec',
    ['timeline', { outputDir: './reports', fileName: 'timeline-report.html' }],
  ],
  services: [
    [TimelineService],
  ],
};