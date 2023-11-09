const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());

// Configurar o CORS
app.use(cors());

// Simulando um banco de dados (substitua isso pelo seu banco de dados real)
const users = [];

// Importe e use as rotas definidas em Auth.js, Profile.js, Admin.js e outras rotas.
const authRoutes = require('./routes/Auth');
const profileRoutes = require('./routes/ProfileRoutes');
const adminRoutes = require('./routes/AdminRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/admin', adminRoutes);

app.post('/api/register', (req, res) => {
  const { name, email, password } = req.body;

  // Verificar se o email já está cadastrado
  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    return res.status(400).json({ error: 'Email already registered', message: "Usuário ja cadastrado", user: {name:existingUser.name,email:existingUser.email} });
  }

  // Criar novo usuário
  const newUser = { name, email, password ,status:'logouted'};
  users.push(newUser);

  return res.status(201).json({message:"Usuario criado com sucesso", user:newUser});
});

// Rota para login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  // Verificar se o usuário existe
  const user = users.find((user) => user.email === email && user.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials', message: "Credenciais invalidas" , user: null });
  }
  console.log(users)
  users.pop(user);
  console.log(users)


  users.push({ name: user.name, email: user.email ,password: user.password,status:'active'});
  console.log(users)

  // Simular token de autenticação (substitua isso por um sistema real de autenticação)
  const authToken = 'capybaToken';

  return res.status(200).json({ authToken, user: { name: user.name, email: user.email ,status:'active'},message:"Login efetuado com sucesso" });
});

// Rota para verificar a validade do email
app.get('/api/verify-email/:token', (req, res) => {
  const token = req.params.token;
  console.log(req.params)

  // Lógica para verificar a validade do token (pode envolver verificação no banco de dados, por exemplo)
 

  if (token === 'capybaToken') {
    res.status(200).json({ success: true, message: 'Email verificado com sucesso!' });
  } else {
    res.status(401).json({ error: 'Invalid token', message: 'Token de verificação inválido ou expirado.' });
  }
});

app.post('/api/logout', (req, res) => {
  const { email } = req.body;

  // Verificar se o usuário existe
  const user = users.find((user) => user.email === email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials', message: "Credenciais invalidas" , user: null });
  }
  // console.log(users)
  users.pop(user);
  // console.log(users)

  users.push({ name: user.name, email: user.email ,password: user.password,status:'logouted'});
  // console.log(users)

  return res.status(200).json({ message:"Logout efetuado com sucesso", user: { name: user.name, email: user.email } });
});

// Rota para obter todos os usuários
app.get('/api/users', (req, res) => {
  res.json(users);
});
// Outras configurações do servidor...

app.listen(5000, () => {
  console.log('Servidor está ouvindo na porta 5000');
});