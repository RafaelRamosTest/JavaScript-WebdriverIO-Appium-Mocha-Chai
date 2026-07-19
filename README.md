# 📱 Projeto de Automação Mobile - WebdriverIO

Este repositório contém a suíte de testes automatizados para aplicações mobile (Android e iOS), utilizando **WebdriverIO**, **Appium**, **Mocha** e **Chai**. O objetivo é garantir a qualidade das funcionalidades críticas através de testes funcionais end-to-end.

## 🚀 Tecnologias Utilizadas

*   **Framework:** [WebdriverIO](https://webdriver.io/)
*   **Mobile Engine:** [Appium](https://appium.io/)
*   **Linguagem:** JavaScript (Node.js)
*   **Assertion Library:** Chai
*   **Relatórios:** Allure Report
*   **CI/CD:** GitHub Actions

---

## ⚙️ Pré-requisitos

Para rodar este projeto localmente, certifique-se de ter instalado:

1.  **Node.js** (versão 20+)
2.  **Java SDK** (17+)
3.  **Appium Server** (instale via `npm install -g appium`)
4.  **Android Studio** (para rodar o emulador Android)
5.  **Xcode** (necessário para rodar o simulador iOS em macOS)
6.  **Appium Inspector** (Inspeção e Mapeamento de Elementos Mobile)

---

## 🛠️ Instalação e Execução

### 1. Clone o repositório
bash
git clone [https://github.com/seu-usuario/seu-repositorio.git](https://github.com/seu-usuario/seu-repositorio.git)
cd seu-repositorio

2. Instale as dependências
Bash
npm install
3. Executar testes localmente
Android: npm run test:android

iOS: npm run test:ios

⚙️ CI/CD (GitHub Actions)
O projeto utiliza GitHub Actions para execução automática de testes em cada push ou pull request. Os relatórios de execução são gerados via Allure Report e publicados automaticamente no GitHub Pages.

Pipeline Android: Configurado em .github/workflows/ci-android.yml, incluindo trava de segurança para o boot do emulador e geração automática do relatório.

Pipeline iOS: Configurado em .github/workflows/ci-ios.yml para execução em ambiente macOS.

📊 Relatórios de Execução
Ao executar os testes, os resultados são gerados na pasta allure-results. Para visualizar o relatório localmente:

Bash
npx allure generate allure-results --clean -o allure-report
npx allure open allure-report
## 📂 Estrutura do Projeto

```text
├── .github/workflows/  # Pipelines de CI/CD
├── allure-results/     # Resultados gerados pelos testes
├── apps/               # APKs e arquivos .app
├── config/             # Configurações do WebdriverIO
├── node_modules/       # Dependências do projeto
├── src/                # Código-fonte
│   ├── data/           # Massas de dados para testes
│   ├── pageobjects/    # Mapeamento de elementos (Page Objects)
│   ├── specs/          # Cenários de teste
│   └── utils/          # Funções utilitárias
├── .gitignore          # Arquivos ignorados pelo Git
├── package-lock.json   # Travamento de dependências
├── package.json        # Dependências e scripts
└── README.md           # Documentação do projeto