# Golden Raspberry Awards API (Outsera)

### Para rodar o projeto

Requisitos: node v23.7.0

Em uma instância do terminal execute os seguintes comandos:

- Faça o clone do repositório

```
git clone https://github.com/adrianomantovani/golden-raspberry-awards-api.git
```

- Acesse a pasta golden-raspberry-awards-api

```
cd golden-raspberry-awards-api
```

- Instale as dependências

```
npm install
```

- Inicie a aplicação

```
npm start
```

A aplicação será iniciada e estará ouvindo na porta 3333
(Server started on port: 3333 🚀)

### Para Acessar as rotas criadas

Rotas GET:

[http://localhost:3333/intervals](http://localhost:3333/intervals) - lista o produtor com o maior intervalo entre dois prêmios consecutivos, e o que obteve dois prêmios mais rápido (conforme especificação de formato)

[http://localhost:3333/winners](http://localhost:3333/winners) - lista individual dos produtores que já venceram o prêmio, ordenada por ano

[http://localhost:3333/movies](http://localhost:3333/movies) - lista de todos os filmes (convertido do arquivo "Movielist.csv")
