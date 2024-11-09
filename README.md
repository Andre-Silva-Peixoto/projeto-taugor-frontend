# Projeto Taugor - Gestão de Documentos de Funcionários

Este projeto é uma aplicação de gestão de documentos de funcionários, desenvolvida como parte de um teste avaliativo. O sistema foi construído com React JS e utiliza o Firebase para gerenciar autenticação, banco de dados e armazenamento de arquivos.

## Desenvolvedor

- **André Silva Peixoto**

## Tecnologias Utilizadas

- **Front-end:** React JS, Material UI (usando um componente), TypeScript
- **Back-end:** Firebase Functions (em vez de um servidor Node.js tradicional)
- **Banco de Dados:** Firebase Firestore
- **Armazenamento de Arquivos:** Firebase Storage
- **Autenticação:** Firebase Authentication
- **Manipulação de PDFs:** `pdf-lib`

## Funcionalidades

1. **Cadastro de Funcionários:** Possibilidade de cadastrar novos funcionários com informações como nome, sexo, endereço, telefone, data de nascimento, cargo, data de admissão, setor, salário, e foto de perfil.
2. **Atualização e Exclusão:** Permite a atualização de dados dos funcionários cadastrados, bem como sua exclusão.
3. **Histórico de Alterações:** Registra o histórico de alterações dos documentos dos funcionários.
4. **Visualização de Documentos PDF:** Geração e visualização de perfis de funcionários em formato PDF.
5. **Paginação de Resultados:** Lista de funcionários com paginação, permitindo ao usuário definir quantos funcionários deseja ver por página.
6. **Validação de Campos:** Implementação de validações para garantir que os dados sejam cadastrados corretamente.

## Pré-requisitos

- Node.js
- Firebase CLI (caso queira realizar o deploy)

## Instalação e Configuração

1. Clone o repositório:
   ```bash
   git clone https://github.com/Andre-Silva-Peixoto/projeto-taugor-frontend.git
   ```
2. Navegue até a pasta do projeto:
   ```bash
   cd projeto-taugor-frontend
   ```
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Crie um arquivo `.env` com as variáveis de ambiente necessárias para o Firebase.

## Scripts Disponíveis

- **`npm start`**: Inicia a aplicação em modo de desenvolvimento.
- **`npm run build`**: Compila o aplicativo para produção.
- **`firebase deploy`**: Publica o projeto no Firebase (caso configurado).

## Estrutura do Projeto

- **`src/components`**: Componentes reutilizáveis, como `funcionarioPdf`, etc.
- **`src/pages`**: Páginas principais da aplicação.
- **`src/styles`**: Estilos globais e arquivos de estilos específicos.


## Observações

Este projeto foi desenvolvido por **André Silva Peixoto** como parte de um teste avaliativo, e representa uma solução eficiente e escalável para a gestão de documentos e perfis de funcionários em ambiente corporativo.