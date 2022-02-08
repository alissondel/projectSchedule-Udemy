// Essa configuração faz para não subir os arquivos para o github
require('dotenv').config();

const express = require('express');
const app = express();

const mongoose = require('mongoose');

mongoose.connect(process.env.CONNECTIONSTRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Abriu a conexão com sucesso brother');
    // app.emit => Emite um sinal para conexão do bd, inicie primeiro do que o servidor localhost;
    app.emit('Pronto');
  })
  .catch(e => console.log(`Não deu certo sua conexão brother. ${e}`));

  const session = require('express-session');
  const MongoStore = require('connect-mongo');
  const flash = require('connect-flash');

const routes = require('./routes');
const path = require('path');

const helmet = require('helmet');

const csrf = require('csurf');
const {middlewareGlobal, checkCsrfError, csrfMiddleware } = require('./src/middlewares/middleware')

app.use(helmet());
app.use(express.urlencoded({ extended: true }));
// app.use =>  É um middleware
app.use(express.static(path.resolve(__dirname, 'public')));

const sessionOptions = session({
  secret: 'akasdfj0út23453456+54qt23qv qwf qwer qwer qwer asdasdasdasda a6()',
  store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge:1000 * 60 * 60 * 24 *7, //Calculo de 7 dias de sessão
    httpOnly: true
  }
});

app.use(sessionOptions);
app.use(flash());

app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

// Nossos próprios middlewares
app.use(csrf());
app.use(middlewareGlobal);
app.use(checkCsrfError);
app.use(csrfMiddleware);
app.use(routes);

// A função que executa primiro a conexão do bd e depois o servidor localhost;
app.on('Pronto', () => {
  app.listen(3000, () => {
    console.log('Acessar http://localhost:3000');
    console.log('Servidor executando na porta 3000');
  });
  
})
