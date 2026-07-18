const { expect } = require('chai');
const testData = require('../data/userCredentials.json');
const LoginPage = require('../pageobjects/login.page.js');

describe('Fluxo de Login - Desafio Mobile', () => {
    
    beforeEach(async () => {
        // O app abre na Home. Navegamos para a tela de Login usando a TabBar herdada na LoginPage
        await LoginPage.navigateTo(LoginPage.btnLogin);
    });

    it('CT001 - Deve logar com sucesso com credenciais válidas', async () => {
        const user = testData.validUser; // Puxando o usuário válido do seu JSON
        
        // Executa a ação de login mapeada no Page Object
        await LoginPage.preencherLogin(user.email, user.password);
        
        // Validação usando o alerta nativo de sucesso que o app exibe
        // Dependendo do SO executado, valida o alerta correspondente
        const isAndroidAlert = await LoginPage.alertTitleAndroid.isDisplayed();
        expect(isAndroidAlert).to.be.true;
    });

    it('CT002 - Não deve logar com e-mail inválido', async () => {
        const user = testData.invalidEmailUser;
        
        await LoginPage.preencherLogin(user.email, user.password);
        
        // Valida se a mensagem de erro específica de e-mail inválido está visível
        const isErrorVisible = await LoginPage.errorInvalidEmail.isDisplayed();
        expect(isErrorVisible).to.be.true;
    });

    it('CT003 - Não deve logar com senha curta', async () => {
        const user = testData.shortPasswordUser;
        
        await LoginPage.preencherLogin(user.email, user.password);
        
        // Valida se a mensagem de erro específica de senha curta está visível
        const isErrorVisible = await LoginPage.errorShortPassword.isDisplayed();
        expect(isErrorVisible).to.be.true;
    });

    it('CT004 - Deve exibir texto de erro correto para formato de e-mail inválido', async () => {
        const user = testData.invalidEmailUser;
        
        await LoginPage.preencherLogin(user.email, user.password);
        
        // Captura o texto do elemento de erro e valida com Chai (em inglês, conforme o app nativo)
        const errorText = await LoginPage.errorInvalidEmail.getText();
        expect(errorText).to.include('Please enter a valid email address');
    });
});