const { expect } = require('chai');
const FormsPage = require('../pageobjects/forms.page.js');

describe('Fluxo de Componentes de Formulário - Desafio Mobile', () => {

    beforeEach(async () => {
        // Garante que a navegação para a tela de formulários é feita antes de cada cenário
        await FormsPage.navigateTo(FormsPage.btnForms);
    });

    it('CT008 - Deve digitar no campo de texto e validar o espelhamento em tempo real', async () => {
        const textoTeste = 'QA Automação 2026';
        
        // Insere o texto no campo usando o Page Object
        await FormsPage.preencherTexto(textoTeste);
        
        // Valida se o texto digitado é refletido no componente de resultado (Chai assertion)
        const textoResultado = await FormsPage.txtFieldResult.getText();
        expect(textoResultado).to.equal(textoTeste);
    });

    it('CT009 - Deve alternar o estado do componente Switch e validar alteração de texto', async () => {
        // Captura o texto inicial do Switch (geralmente inicia desativado)
        const textoInicial = await FormsPage.txtSwitchState.getText();
        
        // Clica para alterar o Switch
        await FormsPage.alternarSwitch();
        
        // Valida se o texto mudou após o clique
        const textoFinal = await FormsPage.txtSwitchState.getText();
        expect(textoInicial).to.not.equal(textoFinal);
    });

    it('CT010 - Deve abrir o menu suspenso (Dropdown) e selecionar a opção correta', async () => {
        // Executa a ação de clicar no dropdown e selecionar o item correspondente
        await FormsPage.selecionarOpcaoDropdown();
        
        // Valida se o texto da opção selecionada agora é exibido no cabeçalho do componente Dropdown
        const textoDropdown = await FormsPage.dropdownMenu.getText();
        expect(textoDropdown).to.include('webdriver.io is awesome');
    });
});