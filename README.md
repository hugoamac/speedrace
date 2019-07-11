# Speed Race Relatório

Esta aplicação fornece uma api em NodeJS que exibe um relatório de uma corrida de kart.

### Tecnologias

Para o desenvolvimento desta aplicação foram utilizadas as seguintes tecnologias open source:

* [Node.js]
* [Express]
* [Mocha]
* [ChaiJS]
* [SinonJS]

### Instalação

Esta aplicação requer o [Node.js] v8+ para execução.


Clone este repositório com comando abaixo:

```sh
git clone git@github.com:hugoamac/speedrace.git
```

Instale as dependências e inicie a aplicação com os comando abaixo:

```sh
$ cd speedrace
$ npm install
$ npm start
```

Verifique no seu navegador de internet no endereço abaixo:

```sh
http://localhost:8080/api/relatorio
```

### Recursos

| VERB | Endpoint | Descrição |
| ------ | ------ | ------ |
| GET | / | Este recurso exibe boas vindas |
| GET | /api/relatorio/ | Este recurso exibe o relatório da corrida |

### Testes

Para executar os testes da aplicação  execute:

```sh
npm test
```

Licença
----

**Free Software Yeah!**
