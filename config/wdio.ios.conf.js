const { config } = require('./wdio.shared.conf.js');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

// Variável para armazenar o caminho absoluto do ZIP dinâmico do iOS
let iosAppPathFinal = '';

function garantirAppIosAtualizado() {
    const appDir = path.join(__dirname, '..', 'apps');
    
    if (!fs.existsSync(appDir)) {
        fs.mkdirSync(appDir, { recursive: true });
    }

    console.log('\n🔍 [WebdriverIO] Checando atualizações do aplicativo demo iOS no GitHub...');
    
    try {
        // 🔐 Injeta o token padrão do GitHub Actions se disponível para contornar o limite de requisições anônimas
        const tokenHeader = process.env.GITHUB_TOKEN ? `-H "Authorization: token ${process.env.GITHUB_TOKEN}"` : '';
        const responseText = execSync(`curl -s ${tokenHeader} https://api.github.com/repos/webdriverio/native-demo-app/releases/latest`).toString();
        
        const releaseInfo = JSON.parse(responseText);
        
        // Valida se a resposta retornou os assets esperados ou se a API travou no limite/erro
        if (!releaseInfo || !releaseInfo.assets) {
            throw new Error(releaseInfo.message || 'Resposta inválida da API do GitHub (Sem assets listados).');
        }
        
        const versionTag = releaseInfo.tag_name;
        
        // Busca o asset dinamicamente que seja para o simulador iOS e termine em .zip
        const iosAsset = releaseInfo.assets.find(asset => 
            asset.name.toLowerCase().includes('ios') && 
            asset.name.toLowerCase().includes('simulator') && 
            asset.name.endsWith('.zip')
        );

        if (versionTag && iosAsset) {
            const downloadUrl = iosAsset.browser_download_url;
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
        } else {
            throw new Error('Não foi possível mapear a URL de download nas tags do GitHub Assets.');
        }
    } catch (error) {
        console.error('⚠️ [WebdriverIO] Não foi possível verificar atualizações do iOS: ', error.message);
        
        // 🔄 Fallback Seguro: Captura qualquer arquivo local presente na pasta apps
        console.log('🔄 Tentando recuperar último arquivo local disponível...');
        const arquivos = fs.existsSync(appDir) ? fs.readdirSync(appDir) : [];
        const zipExistente = arquivos.find(file => file.toLowerCase().includes('ios') && file.endsWith('.zip'));
        
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
  
  // Sobrescreve explicitamente o timeout do shared para 30 segundos
  waitforTimeout: 30000,
  
  // Porta fixa para evitar spawns em portas randômicas no CI
  port: 4723,

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
    // 🚨 SEGURANÇA MÁXIMA: Valida se a string não está vazia ou nula antes de iniciar os workers
    if (iosAppPathFinal && iosAppPathFinal.trim() !== '') {
        console.log(`📱 Iniciando sessões de testes com o App iOS: ${iosAppPathFinal}\n`);
        
        // Garante que TODOS os workers ativos recebam a string do caminho real
        capabilities.forEach(cap => {
            cap['appium:app'] = iosAppPathFinal;
        });
    } else {
        throw new Error('❌ Erro crítico interrompido no onPrepare: O caminho do arquivo .zip do iOS está vazio. O download falhou e não há fallback local na pasta /apps!');
    }
  },

  capabilities: [{
    platformName: 'iOS',
    'appium:automationName': 'XCUITest',
    'appium:app': iosAppPathFinal, 
    'appium:deviceName': 'iPhone 15',
    'appium:platformVersion': '17.2', 
    'appium:wdaLaunchTimeout': 180000,     
    'appium:wdaConnectionTimeout': 180000, 
    'appium:commandTimeouts': 60000,
    maxInstances: 1,
  }],
  
  services: [
    ...config.services.filter(s => s !== 'appium' && !(Array.isArray(s) && s[0] === 'appium')),
    ['appium', { 
        args: { 
            address: '127.0.0.1',
            port: 4723,
            relaxedSecurity: true 
        },
        command: 'appium'
    }],
  ],
};