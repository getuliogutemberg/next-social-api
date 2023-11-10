const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());

// Configurar o CORS
app.use(cors());

// Simulando um banco de dados (substitua isso pelo seu banco de dados real)
const users = [
  {
    "name": "Getulio",
    "email": "getulio.dev@gmail.com",
    "password": "12345",
    "status": "loggedOut",
    "imageURL": "https://cdn.icon-icons.com/icons2/1141/PNG/512/1486395884-account_80606.png"
  },
  {
    "name": "mayra",
    "email": "mayra@email.com",
    "password": "12345",
    "status": "loggedOut",
    "imageURL": "https://cdn.icon-icons.com/icons2/1141/PNG/512/1486395884-account_80606.png"
  }
];
const whitelist = [
  {
    "title": "title",
    "description": "desc\n",
    "image": "caminho",
    "createdBy": {
      "name": "Getulio",
      "email": "getulio.dev@gmail.com",
      "status": "active",
      "imageURL": "https://cdn.icon-icons.com/icons2/1141/PNG/512/1486395884-account_80606.png"
    },
    "createdAt": "2023-11-10T02:10:29.599Z",
    "updatedAt": "2023-11-10T02:10:29.599Z"
  },
  {
    "title": "titulo",
    "description": "dasdasdadadasdas",
    "image": "https://steamuserimages-a.akamaihd.net/ugc/1678120729579339650/40A46978EF29C7099912D8CA459BBC9FAC764F2E/?imw=5000&imh=5000&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false",
    "createdBy": {
      "name": "Getulio",
      "email": "getulio.dev@gmail.com",
      "status": "active",
      "imageURL": "https://cdn.icon-icons.com/icons2/1141/PNG/512/1486395884-account_80606.png"
    },
    "createdAt": "2023-11-10T02:13:05.861Z",
    "updatedAt": "2023-11-10T02:13:05.861Z"
  },
  {
    "title": "outro",
    "description": "https://static.vecteezy.com/system/resources/previews/022/653/879/non_2x/fantasy-island-with-waterfalls-3d-illustration-elements-of-this-image-furnished-by-nasa-generative-ai-free-photo.jpg",
    "image": "https://static.vecteezy.com/system/resources/previews/022/653/879/non_2x/fantasy-island-with-waterfalls-3d-illustration-elements-of-this-image-furnished-by-nasa-generative-ai-free-photo.jpg",
    "createdBy": {
      "name": "mayra",
      "email": "mayra@email.com",
      "status": "active",
      "imageURL": "https://cdn.icon-icons.com/icons2/1141/PNG/512/1486395884-account_80606.png"
    },
    "createdAt": "2023-11-10T03:06:40.880Z",
    "updatedAt": "2023-11-10T03:06:40.880Z"
  }
];



// Importe e use as rotas definidas em Auth.js, Profile.js, Admin.js e outras rotas.
const authRoutes = require('./routes/Auth');
const profileRoutes = require('./routes/ProfileRoutes');
const adminRoutes = require('./routes/AdminRoutes');



app.post('/api/register', (req, res) => {
  const { name, email, password } = req.body;

  // Verificar se o email já está cadastrado
  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    return res.status(400).json({ error: 'Email already registered', message: "Usuário ja cadastrado", user: {name:existingUser.name,email:existingUser.email} });
  }

  // Criar novo usuário
  const newUser = { name, email, password ,status:'active',imageURL:'https://cdn.icon-icons.com/icons2/1141/PNG/512/1486395884-account_80606.png'};
  users.push(newUser);

  // Simular token de autenticação (substitua isso por um sistema real de autenticação)
  const authToken = 'capybaToken';

  return res.status(201).json({authToken,message:"Usuario criado com sucesso", user:newUser});
});

// Rota para login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  // Verificar se o usuário existe
  const userIndex = users.findIndex((user) => user.email === email && user.password === password);

  if (userIndex === -1) {
    return res.status(401).json({ error: 'User not found', message: 'Usuario nao Existe', user: null });
  }


  if (users[userIndex].status === 'active') {
    return res.status(401).json({ error: 'User already logged in', message: 'Usuario esta logado', user: {name:users[userIndex].name,email:users[userIndex].email,imageURL:users[userIndex].imageURL} });
  }
  // Alterar o valor da chave 'status' para 'active'
  users[userIndex].status = 'active';

  // Simular token de autenticação (substitua isso por um sistema real de autenticação)
  const authToken = 'capybaToken';

  return res.status(200).json({ authToken, user: { ...users[userIndex], status: 'active' }, message: 'Login efetuado com sucesso' });
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

  // Encontrar o usuário pelo email
  const userIndex = users.findIndex((user) => user.email === email);

  if (userIndex === -1) {
    return res.status(401).json({ error: 'User not found', message: 'Usuário não encontrado', user: null });
  }

  // Alterar o valor da chave 'status' para 'loggedOut'
  if (users[userIndex].status === 'active'){
    users[userIndex].status = 'loggedOut';
    return res.status(200).json({ message: 'Logout efetuado com sucesso' });

  } 

  return res.status(401).json({ error: 'User not logged in', message: 'Usuario não logado', user: null });
});

// Rota para obter todos os usuários
app.get('/api/users', (req, res) => {
  res.json(users);
});

app.post('/api/posts', (req, res) => {
  const { title, description, image, createdBy } = req.body;

  // Adicione a lógica para salvar o novo post no seu armazenamento (banco de dados, etc.)
  const newPost = {
    
    title,
    description,
    image,
    createdBy,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  try {
    whitelist.push(newPost);

    return res.status(201).json({ success: true, post: newPost });
    
  } catch (error) {
    console.error('Erro ao salvar o post:', error);
    return res.status(500).json({ success: false, error: 'Erro ao criar o post' });
  }


});

app.delete('/api/posts/:postId', (req, res) => {
  const postId = req.params.postId;

  // Adicione a lógica para remover o post do seu armazenamento
  const index = whitelist.findIndex(post => post.id === postId);

  if (index !== -1) {
    whitelist.splice(index, 1);
    return res.status(200).json({ success: true, message: 'Post removido com sucesso' });
  } else {
    return res.status(404).json({ success: false, message: 'Post não encontrado' });
  }
});

app.put('/api/posts/:postId', (req, res) => {
  const postId = req.params.postId;
  const { title, description, coverImage } = req.body;

  // Adicione a lógica para editar o post no seu armazenamento
  const index = whitelist.findIndex(post => post.id === postId);

  if (index !== -1) {
    whitelist[index] = {
      ...whitelist[index],
      title,
      description,
      coverImage,
      updatedAt: new Date(),
    };
    return res.status(200).json({ success: true, post: whitelist[index] });
  } else {
    return res.status(404).json({ success: false, message: 'Post não encontrado' });
  }
});

app.get('/api/posts', (req, res) => {
  // Adicione a lógica para retornar todos os posts do seu armazenamento
  return res.status(200).json({ success: true, posts: whitelist });
});


// Outras configurações do servidor...

app.listen(5000, () => {
  console.log('Servidor está ouvindo na porta 5000');
});