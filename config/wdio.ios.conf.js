const { config } = require('./wdio.shared.conf.js');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

// Variável para armazenar o caminho absoluto do ZIP dinâmico do iOS
let iosAppPathFinal = '';

function garantirAppIosAtualizado() {
    // Alinhado para salvar na pasta compartilhada ./src/apps
    const appDir = path.join(__dirname, '..', 'apps');
    
    if (!fs.existsSync(appDir)) {
        fs.mkdirSync(appDir, { recursive: true });
    }

    console.log('\n🔍 [WebdriverIO] Checando atualizações do aplicativo demo iOS no GitHub...');
    
    try {
        const releaseInfo = execSync('curl -s https://api.github.com/repos/webdriverio/native-demo-app/releases/latest').toString();
        const versionMatch = releaseInfo.match(/"tag_name":\s*"(.*?)"/);
        // Filtra especificamente o pacote .app.zip do simulador iOS
        const urlMatch = releaseInfo.match(/"browser_download_url":\s*"(.*?\.app\.zip)"/);

        if (versionMatch && urlMatch) {
            const versionTag = versionMatch[1];
            const downloadUrl = urlMatch[1];
            const zipName = `ios.simulator.wdio.native.app.${versionTag}.zip`;
            const zipPath = path.join(appDir, zipName);

            if (fs.existsSync(zipPath)) {
                console.log(`✅ [WebdriverIO] O ZIP do iOS local já está na última versão (${versionTag}).\n`);
                iosAppPathFinal = zipPath;
                return;
            }

            // Limpa versões antigas do iOS para não acumular lixo
            const arquivos = fs.readdirSync(appDir);
            arquivos.forEach(file => {
                if (file.startsWith('ios.simulator.wdio.native.app.') && file.endsWith('.zip')) {
                    fs.unlinkSync(path.join(appDir, file));
                }
            });

            console.log(`📥 [WebdriverIO] Baixando a nova versão iOS (${versionTag})...`);
            execSync(`curl -L "${downloadUrl}" -o "${zipPath}"`);
            console.log('✨ [WebdriverIO] Download do iOS concluído com sucesso!\n');
            
            iosAppPathFinal = zipPath;
        }
    } catch (error) {
        console.error('⚠️ [WebdriverIO] Não foi possível verificar atualizações do iOS: ', error.message);
        
        // Fallback: Se falhar a conexão, busca o ZIP que já estiver na pasta
        const arquivos = fs.readdirSync(appDir);
        const zipExistente = arquivos.find(file => file.startsWith('ios.simulator.wdio.native.app.') && file.endsWith('.zip'));
        if (zipExistente) {
            iosAppPathFinal = path.join(appDir, zipExistente);
            console.log(`📋 Usando o ZIP do iOS encontrado localmente: ${iosAppPathFinal}\n`);
        }
    }
}

// Executa a busca/download imediatamente antes de expor as configurações
garantirAppIosAtualizado();

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
  
  onPrepare: function (config, capabilities) {
    if (iosAppPathFinal) {
        console.log(`📱 Iniciando sessões de testes com o App iOS: ${iosAppPathFinal}\n`);
    } else {
        throw new Error('❌ Erro crítico: Nenhum arquivo .app.zip do iOS foi encontrado para iniciar os testes!');
    }
  },

  capabilities: [{
    platformName: 'iOS',
    'appium:automationName': 'XCUITest',
    // Injeta dinamicamente o caminho do arquivo real baixado
    'appium:app': iosAppPathFinal, 
    'appium:deviceName': 'iPhone 15',
    'appium:platformVersion': '17.2', // Versão de runtime estável padrão no runner macos-14
    'appium:wdaLaunchTimeout': 180000,      // Dá até 3 minutos para o WebDriverAgent inicializar no simulador
    'appium:wdaConnectionTimeout': 180000,  // Aumenta o tempo limite de comunicação com o driver do iOS
    'appium:commandTimeouts': 60000,
    maxInstances: 1,
  }],
  services: [
    ...config.services,
    ['appium', { args: { relaxedSecurity: true } }],
  ],
};