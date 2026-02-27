// 🌙 MOONFINANCE - DATABASE CONNECTION
// 🚀 INICIALIZAÇÃO E TRATAMENTO DE CONEXÃO REMOTA
// // 🚀 Explicação: Usamos variáveis de ambiente (.env) para não expor senhas no código.

const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Criando a pool de conexões para aguentar múltiplos acessos
const pool = mysql.createPool(dbConfig);

// 💡 Teste de conexão imediato para validar o MySQL Remoto
pool.getConnection()
    .then(conn => {
        console.log("✅ CONEXÃO COM O BANCO NA HOSTGATOR SUCESSO! 🐱🐶");
        conn.release();
    })
    .catch(err => {
        console.error("// ❌ FALHA NA CONEXÃO REMOTA:", err.message);
        console.log("// 💡 Dica: Verifique se o IP está liberado no 'MySQL Remoto' do cPanel.");
    });

module.exports = pool;