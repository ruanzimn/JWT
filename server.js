const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Simulação de banco de dados
const users = [
    { username: 'Ruan', password: 'password1' }
];

const products = [
    { id: 1, nome: 'escova de dente', preco: '10.00' },
    { id: 2, nome: 'shampoo', preco: '40.00' }
];

const SECRET_KEY = 'secreta';

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// Endpoint de autenticação
app.post('/auth/login', (req, res) => {
    const { usuario, senha } = req.body;

    // Verifique se o usuário e senha estão corretos
    const user = users.find(u => u.username === usuario && u.password === senha);
    if (!user) return res.status(401).json({ message: 'Usuário ou senha inválidos' });

    // Gere um token JWT
    const token = jwt.sign({ username: user.username }, SECRET_KEY);
    res.json({ token });
});

// Endpoint protegido
app.get('/produtos', authenticateToken, (req, res) => {
    res.json({ produtos: products });
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
