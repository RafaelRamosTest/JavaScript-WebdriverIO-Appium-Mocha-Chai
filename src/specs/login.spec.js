const { expect } = require('chai');
const testData = require('../data/userCredentials.json');
const LoginPage = require('../pageobjects/login.page.js');
const Utils = require('../utils/utils.js');

describe('Fluxo de Login - Desafio Mobile', () => {
    
    beforeEach(async () => {
        // O app abre na Home. Navegamos para a tela de Login usando a TabBar herdada na LoginPage
        await LoginPage.navigateTo(LoginPage.btnLogin);
    });

    it('CT001 - Deve logar com sucesso com credenciais válidas', async () => {
        const user = testData.validUser; 
        
        // Executa a ação de login mapeada no Page Object
        await LoginPage.preencherLogin(user.email, user.password);
        
        // 1. Primeira Validação: Aguarda e valida o Título do Alerta ("Success")
        await Utils.waitForElementToBeDisplayed(LoginPage.alertTitleSuccess, 'Título do Alerta de Sucesso');
        expect(await LoginPage.alertTitleSuccess.getText()).to.include('Success');

        // 2. Segunda Validação: Aguarda e valida o texto do corpo do Alerta ("You are logged in!")
        await Utils.waitForElementToBeDisplayed(LoginPage.alertMessageSuccess, 'Mensagem do Alerta de Sucesso');
        expect(await LoginPage.alertMessageSuccess.getText()).to.equal('You are logged in!');

        // 3. Ação Final: Fecha o modal clicando no botão OK
        await Utils.waitForElementToBeDisplayed(LoginPage.btnAlertOk, 'Botão OK do Alerta');
        await LoginPage.btnAlertOk.click();
    });

    it('CT002 - Não deve logar com e-mail inválido', async () => {
        const user = testData.invalidEmailUser;
        
        await LoginPage.preencherLogin(user.email, user.password);
        
        // Valida se a mensagem de erro específica de e-mail inválido está visível
        const emailError = await $('-android uiautomator:new UiSelector().text("Please enter a valid email address")');
        await Utils.waitForElementToBeDisplayed(emailError, 'Mensagem de Erro de E-mail Inválido');
        expect(await emailError.isDisplayed()).to.be.true;
    });

    it('CT003 - Não deve logar com senha curta', async () => {
        const user = testData.shortPasswordUser;
        
        await LoginPage.preencherLogin(user.email, user.password);
        
        // Valida se a mensagem de erro específica de senha curta está visível
        const passwordError = await $('-android uiautomator:new UiSelector().text("Please enter at least 8 characters")');
        await Utils.waitForElementToBeDisplayed(passwordError, 'Mensagem de Erro de Senha Curta');
        expect(await passwordError.isDisplayed()).to.be.true;
    });

    it('CT004 - Deve exibir texto de erro correto para formato de e-mail inválido', async () => {
        const user = testData.invalidEmailUser;
        
        await LoginPage.preencherLogin(user.email, user.password);
        
        // Captura o texto do elemento de erro e valida com Chai (em inglês, conforme o app nativo)
        const errorText = await LoginPage.errorInvalidEmail.getText();
        expect(errorText).to.include('Please enter a valid email address');
    });
});