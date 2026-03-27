Projeto: GBastos.Hexagon-Skill_Test_Frontend


Descrição

O GBastos.Hexagon-Skill_Test_Frontend é uma aplicação Angular 20 standalone components, específicamente construída para 
consumir a API GBastos.Hexagon-Skill_Test_Backend.


A aplicação possui:

 - Tela de Login com autenticação via JWT
 - Dashboard avançado com grid de dados
 - Busca e filtragem em tempo real
 - Paginação
 - Sorting por coluna
 - Inline edit (edição direta na tabela)
 - Linha selecionada persistente
 - Botões de Atualizar e Excluir integrados ao backend
 - O frontend foi desenvolvido para ser modular, escalável e pronto para produção.


Tecnologias Utilizadas:

 - Angular 21 – framework principal do frontend
 - Standalone Components – sem AppModule, componentes independentes
 - Angular Forms / NgModel – para binding de campos e filtros
 - Angular Material – para UI/UX (tabela, inputs, botões, snackbars, paginator)
 - RxJS – para chamadas assíncronas e observables
 - TypeScript – linguagem principal
 - JWT – autenticação e autorização


Funcionalidades

Login

 - Autenticação via API backend (/api/auth/login)
 - Recebe JWT e armazena no localStorage
 - Redireciona para o Dashboard após login
 - Dashboard
 - Grid avançado exibindo dados do backend
   -> Busca / filtro em tempo real
   -> Paginação com Angular Material Paginator
   -> Sorting por coluna (clique no cabeçalho)
   -> Inline edit: permite atualizar dados diretamente na tabela
   -> Linha selecionada destacada
   -> Botões Atualizar / Excluir integrados ao backend
   -> Logout funcional


Notificações

Feedback de sucesso/erro usando MatSnackBar


Pré-requisitos

 - Node.js ≥ 18.x
 - Angular CLI ≥ 16.x
 - Backend GBastos.Hexagon-Skill_Test_Backend rodando


Instalação

 - Clonar o repositório:
 - git clone https://github.com/RiderSet/GBastos.Hexagon-Skill_Test_Frontend.git
 - cd GBastos.Hexagon-Skill_Test_Frontend
 - Instalar dependências:
 - npm install
 - Rodar a aplicação: ng serve


Acesse no navegador: http://localhost:4200

Certifique-se de que a API backend esteja rodando e acessível em https://localhost:5017 ou ajuste a URL no ApiService.


Configuração do Backend

No arquivo core/api.service.ts, configure a URL base da API:

private baseUrl = 'https://localhost:5017/api';


Essa URL deve apontar para o backend GBastos.Hexagon-Skill_Test_Backend. Portanto, o backend desta aplicação deve estar rodando.
