class BasePage {
    // Menu de Navegação Inferior (TabBar) - Disponível globalmente
    get btnHome() { return $('~Home'); }
    get btnWebview() { return $('~Webview'); }
    get btnLogin() { return $('~Login'); }
    get btnForms() { return $('~Forms'); }
    get btnSwipe() { return $('~Swipe'); }
    get btnDrag() { return $('~Drag'); }

    /**
     * Navega para uma das abas principais do app
     * @param {WebdriverIO.Element} tabElement 
     */
    async navigateTo(tabElement) {
        await tabElement.waitForDisplayed({ timeout: 5000 });
        await tabElement.click();
    }
}

module.exports = BasePage;