const BasePage = require('./base.page');

class SwipePage extends BasePage {
    // Elementos do Carrossel
    get carouselContainer() { return $('~carousel'); }
    get listCards() { return $$('~card'); }
    
    // Texto de validação específico dentro do card ativo
    get txtCardActive() { 
        return $('android=new UiSelector().text("FULLY OPEN SOURCE")'); 
    }

    /**
     * Executa um swipe horizontal simulado para mover os cards
     */
    async deslizarCarrosselParaEsquerda() {
        await this.carouselContainer.waitForDisplayed({ timeout: 5000 });
        
        // Atalho rápido do WebdriverIO para swipe direcional
        await driver.execute('mobile: scroll', { 
            direction: 'right', // Desloca para a direita expondo o próximo card da esquerda
            element: await this.carouselContainer.elementId 
        });
    }
}

module.exports = new SwipePage();