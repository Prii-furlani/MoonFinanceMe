// 🌙 MOONFINANCE API - CORE SYSTEM (V1.0)
// 🚀 INICIALIZAÇÃO, RASTREABILIDADE TOTAL E REGRAS DE NEGÓCIO (LGPD COMPLIANT)
// // 🚀 Explicação para a Aprendiz: Este é o cérebro que controla quem entra, quem sai e o que acontece lá dentro.

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs'); // 🔐 Criptografia de senhas
const jwt = require('jsonwebtoken'); // 🎫 Crachá de acesso (Token)
require('dotenv').config();

const db = require('./db'); 

const app = express();
app.use(cors());
app.use(express.json());

// =========================================================================
// 📝 FUNÇÃO GLOBAL DE AUDITORIA (LOGS)
// // 🚀 Didática: Esta função é a nossa 'Câmera 24h'. Nada escapa.
// =========================================================================
const registrarLog = async (usuarioId, acao, tabela, registroId, detalhes, req) => {
    try {
        const query = `
            INSERT INTO logs_sistema (usuario_id, acao, tabela_afetada, registro_id, detalhes, ip_origem) 
            VALUES (?, ?, ?, ?, ?, ?)`;
        
        await db.query(query, [
            usuarioId, 
            acao, 
            tabela, 
            registroId, 
            JSON.stringify(detalhes), 
            req.ip || '0.0.0.0'
        ]);
        console.log(`// 📝 LOG: ${acao} registrado.`);
    } catch (err) {
        console.error("// ❌ ERRO DE LOG:", err.message);
    }
};

// =========================================================================
// 👤 MÓDULO DE USUÁRIOS (AUTH & PRIVACIDADE)
// =========================================================================

// [CREATE] - Registrar Novo Usuário (Com Aceite de LGPD)
app.post('/api/usuarios/registrar', async (req, res) => {
    // 🚀 INICIALIZAÇÃO E VERIFICAÇÃO DE TERMOS DE USO
    const { nome, email, senha, genero, termo_aceite } = req.body;

    if (!termo_aceite) {
        return res.status(400).json({ error: "É necessário aceitar os termos da LGPD para continuar." });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(senha, salt);

        const query = `
            INSERT INTO usuarios (nome, email, senha, genero, plano, termo_aceite, data_aceite) 
            VALUES (?, ?, ?, ?, 'PREMIUM', true, NOW())`;
        
        const [result] = await db.query(query, [nome, email, senhaHash, genero]);
        const novoId = result.insertId;

        // 📝 LOG: Registro de novo usuário
        await registrarLog(novoId, 'CADASTRO_USUARIO', 'usuarios', novoId, { 
            mensagem: "Usuário aceitou termos LGPD e criou conta Premium.",
            plano_inicial: "PREMIUM"
        }, req);

        res.status(201).json({ success: true, message: "Bem-vinda ao MoonFinance! 🌙" });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: "E-mail já em uso." });
        res.status(500).json({ error: "Erro ao criar conta." });
    }
});

// [READ] - Login de Usuário
app.post('/api/usuarios/login', async (req, res) => {
    const { email, senha } = req.body;

    try {
        const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ? AND ativo = true', [email]);
        
        if (rows.length === 0) return res.status(401).json({ error: "Credenciais inválidas." });

        const usuario = rows[0];
        const senhaValida = await bcrypt.compare(senha, usuario.senha);

        if (!senhaValida) return res.status(401).json({ error: "Credenciais inválidas." });

        // 🎫 Geração de Token (Crachá Digital)
        const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // 📝 LOG: Entrada no sistema
        await registrarLog(usuario.id, 'LOGIN', 'usuarios', usuario.id, { info: "Login efetuado via Web" }, req);

        res.json({ 
            token, 
            usuario: { id: usuario.id, nome: usuario.nome, plano: usuario.plano } 
        });
    } catch (err) {
        res.status(500).json({ error: "Erro no servidor." });
    }
});

// [UPDATE] - Alteração de Dados de Perfil
app.put('/api/usuarios/perfil/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, genero, telefone } = req.body;

    try {
        const [antigo] = await db.query('SELECT nome, genero, telefone FROM usuarios WHERE id = ?', [id]);
        
        await db.query('UPDATE usuarios SET nome = ?, genero = ?, telefone = ? WHERE id = ?', [nome, genero, telefone, id]);

        // 📝 LOG: O que mudou?
        await registrarLog(id, 'UPDATE_PERFIL', 'usuarios', id, { antes: antigo[0], depois: { nome, genero, telefone } }, req);

        res.json({ success: true, message: "Perfil atualizado!" });
    } catch (err) {
        res.status(500).json({ error: "Erro ao atualizar." });
    }
});

// [DELETE] - Exclusão de Conta (Direito ao Esquecimento LGPD)
app.delete('/api/usuarios/excluir/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // // 🚀 AJUSTE PARA RASTREABILIDADE: Antes de apagar, logamos o encerramento.
        await registrarLog(id, 'EXCLUSAO_CONTA', 'usuarios', id, { 
            aviso: "Usuário solicitou exclusão total dos dados (Art. 18 LGPD).",
            status_final: "DADOS_APAGADOS_VIA_CASCADE"
        }, req);

        // Devido ao ON DELETE CASCADE no banco, apagar o usuário limpa lancamentos, pets, etc.
        await db.query('DELETE FROM usuarios WHERE id = ?', [id]);

        res.json({ success: true, message: "Sua conta e todos os dados vinculados foram apagados permanentemente." });
    } catch (err) {
        res.status(500).json({ error: "Erro ao excluir conta." });
    }
});

// =========================================================================
// 🚀 INICIALIZAÇÃO DO SERVIDOR
// =========================================================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`\n// 🌙 MOONFINANCE OPERANDO NA PORTA ${PORT}`);
    console.log(`// 🛡️ MÓDULO LGPD ATIVO: Rastreabilidade total habilitada.\n`);
});