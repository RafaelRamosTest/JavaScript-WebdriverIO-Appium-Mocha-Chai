import BasePage from './base.page.js';

class HomePage extends BasePage {
  // Seletores da tela inicial (Home)
  get welcomeMessage() { return '~welcome-message'; }
  get logoutButton() { return '~logout-button'; }
  get navigationMenu() { return '~navigation-menu'; }

  /**
   * Verifica se a tela inicial foi carregada corretamente.
   * @returns {Promise<boolean>}
   */
  async isHomeDisplayed() {
    return await this.isElementDisplayed(this.welcomeMessage);
  }

  /**
   * Realiza logout clicando no botão de sair.
   */
  async logout() {
    await this.tapElement(this.logoutButton);
  }

  /**
   * Abre o menu de navegação.
   */
  async openNavigationMenu() {
    await this.tapElement(this.navigationMenu);
  }
}

export default new HomePage();