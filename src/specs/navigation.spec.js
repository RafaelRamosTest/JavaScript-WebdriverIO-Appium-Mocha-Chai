const { expect } = require('chai');
const LoginPage = require('../pageobjects/login.page.js');
const FormsPage = require('../pageobjects/forms.page.js');
const SwipePage = require('../pageobjects/swipe.page.js');
const Utils = require('../utils/utils.js');

describe('Fluxo de Navegação - Desafio Mobile', () => {

    beforeEach(async () => {
        // Garante que o teste sempre começa a partir da tela Home
        // Usamos a LoginPage apenas para acessar o método herdado da BasePage
        await LoginPage.navigateTo(LoginPage.btnHome); 
    });
    
    it('CT005 - Deve navegar para a tela de Login através da TabBar inferior', async () => {
        // Usa o método herdado da BasePage para navegar
        await LoginPage.navigateTo(LoginPage.btnLogin);
        
        // Valida se um elemento exclusivo da tela de login (o alternador de abas) está visível
        const isTabLoginVisible = await LoginPage.tabLogin.isDisplayed();
        expect(isTabLoginVisible).to.be.true;
    });

    it('CT006 - Deve navegar para a tela de Formulários (Forms) e verificar os elementos', async () => {
        // Navega para a aba Forms usando a instância do FormsPage (que também herda da BasePage)
        await FormsPage.navigateTo(FormsPage.btnForms);
        
        // Valida se o campo de input exclusivo da tela de Forms está visível
        const isInputVisible = await FormsPage.inputField.isDisplayed();
        expect(isInputVisible).to.be.true;
    });

    it('CT007 - Deve validar a existência de todas as opções do carrossel na árvore de elementos', async () => {
        await SwipePage.navigateTo(SwipePage.btnSwipe); 
        
        // 1. Valida se o contêiner principal do carrossel está visível
        await Utils.waitForElementToBeDisplayed(SwipePage.carouselContainer, 'Contêiner do Carrossel');
        expect(await SwipePage.carouselContainer.isDisplayed()).to.be.true;

        // 2. Valida a existência estática de todos os cards (0 a 5) de uma vez só
        const todosExistem = await SwipePage.validarTodosOsItensDoCarrossel();
        expect(todosExistem).to.be.true;
    });
});