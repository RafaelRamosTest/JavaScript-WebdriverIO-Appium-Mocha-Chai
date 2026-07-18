const BasePage = require('./base.page');

class SwipePage extends BasePage {
    // CORREÇÃO: Removido o seletor duplicado. O ID correto do componente é o ID de acessibilidade '~carousel'
    get carouselContainer() { return $('//*[@resource-id="Carousel"]'); }
    get listCards() { return $$('~card'); }
    
    // Texto de validação específico dentro do card ativo (Útil se quiser usar de checkpoint)
    get txtCardActive() { 
        return $('android=new UiSelector().text("FULLY OPEN SOURCE")'); 
    }

    /**
     * CORREÇÃO: Método para pegar o item usando a estratégia nativa exata do UiAutomator
     * @param {number} index - Índice da instância do card (0 a 5)
     */
    getCarouselItem(index) {
        return $(`android=new UiSelector().description("card").instance(${index})`);
    }

    /**
     * Percorre o carrossel avançando até o último item
     */
    async percorrerCarrosselAteOFinal() {
        for (let i = 0; i < 5; i++) { // O carrossel tem 6 opções (0 a 5). Vamos arrastar 5 vezes para a direita.
            await this.deslizarCarrossel('right');
        }
    }

    /**
     * Percorre o carrossel voltando até o item inicial
     */
    async retornarCarrosselAoInicio() {
        for (let i = 5; i > 0; i--) {
            await this.deslizarCarrossel('left');
        }
    }

    /**
     * Gerencia o gesto de rolagem horizontal nativo do Android
     * @param {'left'|'right'} direction - 'right' avança os cards, 'left' volta os cards
     */
    async deslizarCarrossel(direction) {
        // 1. Garante que o carrossel está pronto e visível na tela antes de interagir
        //await this.carouselContainer.waitForDisplayed({ timeout: 5000 });

        for (let tentativa = 0; tentativa < 2; tentativa++) {
            // 2. Executa o comando nativo do Android estável baseado no elemento real do carrossel
            await driver.execute('mobile: scrollGesture', {
                elementId: await this.carouselContainer.elementId,
                direction: direction,
                percent: 0.99, // Mantido em 99% para amplitude máxima por tentativa
                speed: 2500    // Velocidade moderada para o React Native registrar o toque
            });
        }

        // 3. Aguarda a física do carrossel estabilizar o próximo card no centro
        await driver.pause(1500);
    }
   
    /**
     * Valida se todas as 6 opções do carrossel existem na árvore do app sem fazer scroll
     * @returns {Promise<boolean>}
     */
    async validarTodosOsItensDoCarrossel() {
        // Garante que o contêiner principal carregou na tela
        await this.carouselContainer.waitForDisplayed({ timeout: 5000 });

        // Passa por todas as instâncias (0 a 5) checando a árvore XML
        for (let i = 0; i < 2; i++) {
            const item = this.getCarouselItem(i);
            
            // isExisting verifica se o elemento está presente no código, mesmo oculto lateralmente
            const existe = await item.isExisting();
            
            if (!existe) {
                throw new Error(`O card do carrossel na instância (${i}) não foi encontrado na árvore do app!`);
            }
        }
        return true;
    }
}

module.exports = new SwipePage();