const { expect } = require('chai');
const LoginPage = require('../pageobjects/login.page.js');
const FormsPage = require('../pageobjects/forms.page.js');
const SwipePage = require('../pageobjects/swipe.page.js');

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

    it('CT007 - Deve navegar para a tela de Swipe e verificar o carrossel', async () => {
        // Navega para a aba Swipe
        await SwipePage.navigateTo(SwipePage.btnSwipe);

        await SwipePage.carousel.waitForDisplayed({ timeout: 5000 });
        
        // Valida se o container do carrossel foi carregado com sucesso
        await browser.waitUntil(
        async () => await SwipePage.carouselContainer.isDisplayed(),
            {
                timeout: 30000,
                timeoutMsg: 'O carrossel não ficou visível após 30 segundos de tentativas'
            }
        );
        expect(isCarouselVisible).to.be.true;
    });
});