const { config } = require('./wdio.shared.conf.js');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

// Variável para armazenar o caminho absoluto do APK dinâmico
let apkPathFinal = '';

function garantirApkAtualizado() {
    const appDir = path.join(__dirname, '..', 'apps');
    
    if (!fs.existsSync(appDir)) {
        fs.mkdirSync(appDir);
    }

    console.log('\n🔍 [WebdriverIO] Checando atualizações do aplicativo demo no GitHub...');
    
    try {
        const releaseInfo = execSync('curl -s https://api.github.com/repos/webdriverio/native-demo-app/releases/latest').toString();
        const versionMatch = releaseInfo.match(/"tag_name":\s*"(.*?)"/);
        const urlMatch = releaseInfo.match(/"browser_download_url":\s*"(.*?\.apk)"/);

        if (versionMatch && urlMatch) {
            const versionTag = versionMatch[1];
            const downloadUrl = urlMatch[1];
            const apkName = `android.wdio.native.app.${versionTag}.apk`;
            const apkPath = path.join(appDir, apkName);

            if (fs.existsSync(apkPath)) {
                console.log(`✅ [WebdriverIO] O APK local já está na última versão (${versionTag}).\n`);
                apkPathFinal = apkPath;
                return;
            }

            // Limpa versões antigas
            const arquivos = fs.readdirSync(appDir);
            arquivos.forEach(file => {
                if (file.startsWith('android.wdio.native.app.') && file.endsWith('.apk')) {
                    fs.unlinkSync(path.join(appDir, file));
                }
            });

            console.log(`📥 [WebdriverIO] Baixando a nova versão (${versionTag})...`);
            execSync(`curl -L "${downloadUrl}" -o "${apkPath}"`);
            console.log('✨ [WebdriverIO] Download concluído com sucesso!\n');
            
            apkPathFinal = apkPath;
        }
    } catch (error) {
        console.error('⚠️ [WebdriverIO] Não foi possível verificar atualizações: ', error.message);
        
        // Fallback: Se falhar a internet, busca o APK que já estiver na pasta
        const arquivos = fs.readdirSync(appDir);
        const apkExistente = arquivos.find(file => file.startsWith('android.wdio.native.app.') && file.endsWith('.apk'));
        if (apkExistente) {
            apkPathFinal = path.join(appDir, apkExistente);
            console.log(`📋 Usando o APK encontrado localmente: ${apkPathFinal}\n`);
        }
    }
}

// Executa a função imediatamente ao carregar o arquivo para definir a variável global antes do export
garantirApkAtualizado();

exports.config = {
  ...config,
  waitforTimeout: 60000,
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
    if (apkPathFinal) {
        console.log(`📱 Iniciando sessões de testes com o App: ${apkPathFinal}\n`);
    } else {
        throw new Error('❌ Erro crítico: Nenhum arquivo APK foi encontrado para iniciar os testes!');
    }
  },

  capabilities: [{
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    // Injeta dinamicamente o caminho absoluto do arquivo real descoberto/baixado
    'appium:app': apkPathFinal, 
    'appium:deviceName': 'Android_Local',
    'appium:ignoreHiddenApiPolicyError': true,
    'appium:adbExecTimeout': 60000,
    maxInstances: 1,
  }],
  services: [
    ...config.services,
    ['appium', { args: { relaxedSecurity: true } }],
  ],
};