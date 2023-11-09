const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Importe e use as rotas definidas em Auth.js, Profile.js, Admin.js e outras rotas.
const authRoutes = require('./routes/Auth');
const profileRoutes = require('./routes/ProfileRoutes');
const adminRoutes = require('./routes/AdminRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/admin', adminRoutes);

app.post('/api/register', (req, res) => {
  // Recupere os dados do corpo da solicitação
  const { email, password } = req.body;

  // Valide os dados (faça as validações necessárias)

  // Execute a lógica de registro do usuário (salve no banco de dados, por exemplo)

  // Responda com uma mensagem de sucesso
  res.json({ message: 'Usuário registrado com sucesso de email:' + email + ' e senha:' + password });
});

// Outras configurações do servidor...

app.listen(5000, () => {
  console.log('Servidor está ouvindo na porta 5000');
});