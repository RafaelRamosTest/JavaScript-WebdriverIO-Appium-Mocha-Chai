const BasePage = require('./base.page');

class FormsPage extends BasePage {
    // Elementos da Tela
    get inputField() { return $('~text-input'); }
    get txtFieldResult() { return $('~input-text-result'); }
    get btnSwitch() { return $('~switch'); }
    get txtSwitchState() { return $('~switch-text'); }
    
    // Componente Dropdown
    get dropdownMenu() { return $('~Dropdown'); }
    
    // Opção específica dentro do Dropdown (Exemplo focado em Android)
    get optionAwesomeAndroid() { 
        return $('android=new UiSelector().text("webdriver.io is awesome")'); 
    }

    // Métodos de Ação
    async preencherTexto(texto) {
        await this.inputField.setValue(texto);
    }

    async alternarSwitch() {
        await this.btnSwitch.click();
    }

    async selecionarOpcaoDropdown() {
        await this.dropdownMenu.click();
        // Caso execute em iOS, você precisará mapear o picker correspondente aqui
        await this.optionAwesomeAndroid.waitForDisplayed({ timeout: 3000 });
        await this.optionAwesomeAndroid.click();
    }
}

module.exports = new FormsPage();