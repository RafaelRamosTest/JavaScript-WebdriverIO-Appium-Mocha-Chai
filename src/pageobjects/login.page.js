const BasePage = require('./base.page');

class LoginPage extends BasePage {
    // Alternador de Abas
    get tabLogin() { return $('~button-login-container'); }
    get tabSignUp() { return $('~button-sign-up-container'); }

    // Campos de Entrada
    get inputEmail() { return $('~input-email'); }
    get inputPassword() { return $('~input-password'); }
    get inputRepeatPassword() { return $('~input-repeat-password'); }

    // Botões de Ação
    get btnSubmitLogin() { return $('~button-LOGIN'); }
    get btnSubmitSignUp() { return $('~button-SIGN UP'); }

    // Mensagens de Validação de Erro
    get errorInvalidEmail() { return $('text=Please enter a valid email address'); }
    get errorShortPassword() { return $('text=Please enter at least 8 characters'); }

    // Alerta de Sucesso (Pop-up nativo)
    get alertTitleAndroid() { return $('id=android:id/alertTitle'); }
    get alertTitleIOS() { return $('*//XCUIElementTypeAlert'); }

    // Métodos Auxiliares de Ação
    async preencherLogin(email, senha) {
        await this.tabLogin.click();
        await this.inputEmail.setValue(email);
        await this.inputPassword.setValue(senha);
        await this.btnSubmitLogin.click();
    }

    async preencherCadastro(email, senha, confirmarSenha) {
        await this.tabSignUp.click();
        await this.inputEmail.setValue(email);
        await this.inputPassword.setValue(senha);
        await this.inputRepeatPassword.setValue(confirmarSenha);
        await this.btnSubmitSignUp.click();
    }
}

module.exports = new LoginPage();