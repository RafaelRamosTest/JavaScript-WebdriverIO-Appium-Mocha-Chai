/**
 * Espera genérica até que um elemento esteja visível na tela.
 * Captura o seletor dinamicamente para enriquecer a mensagem de erro.
 * 
 * @param {WebdriverIO.Element} element - O elemento do WebdriverIO obtido via $() ou PageObject
 * @param {string} customMessage - Mensagem descritiva do que o elemento representa
 * @param {number} [timeout=30000] - Tempo máximo de espera em milissegundos (padrão: 30s)
 */
async function waitForElementToBeDisplayed(element, customMessage, timeout = 30000) {
    // Resolve o elemento caso ele venha como uma Promise de um PageObject
    const el = await element;
    
    // Captura o seletor usado no elemento (ex: "id:android:id/alertTitle" ou "text=...")
    const selectorName = el && el.selector ? `[Seletor: ${el.selector}]` : '[Seletor: Não identificado]';
    
    await browser.waitUntil(
        async () => {
            return el && typeof el.isDisplayed === 'function' ? await el.isDisplayed() : false;
        },
        {
            timeout: timeout,
            timeoutMsg: `Timeout de ${timeout}ms estourado. O elemento "${customMessage}" ${selectorName} não ficou visível na tela.`
        }
    );
}

/**
 * Realiza um swipe horizontal dentro de um elemento específico
 * @param {Element} element - O elemento contêiner (ex: o Carrossel inteiro)
 * @param {string} direction - 'left' para arrastar para a esquerda (avançar) ou 'right' para a direita (voltar)
 */
async function swipeHorizontal(element, direction) {
    // Pega o tamanho e a posição do carrossel na tela
    const location = await element.getLocation();
    const size = await element.getSize();

    // Calcula os pontos baseados no elemento
    const y = location.y + (size.height / 2); // Linha reta bem no meio vertical do carrossel
    const startX = direction === 'left' ? location.x + (size.width * 0.8) : location.x + (size.width * 0.2);
    const endX = direction === 'left' ? location.x + (size.width * 0.2) : location.x + (size.width * 0.8);

    await driver.performActions([
        {
            type: 'pointer',
            id: 'finger1',
            parameters: { pointerType: 'touch' },
            actions: [
                { type: 'pointerMove', duration: 0, x: startX, y: y },
                { type: 'pointerDown', button: 0 },
                { type: 'pointerMove', duration: 600, x: endX, y: y }, // 600ms de arrasto suave
                { type: 'pointerUp', button: 0 }
            ]
        }
    ]);
    
    // Uma pequena pausa para o Android terminar a animação física do swipe
    await driver.pause(1000);
}

module.exports = {
    waitForElementToBeDisplayed
};