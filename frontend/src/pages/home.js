// 🌙 MOONFINANCE - LANDING PAGE PRINCIPAL
// 🚀 FOCO: CONVERSÃO E EXPLICAÇÃO DE DIFERENCIAIS
// // 🚀 Didática: O Header é fixo para que o botão de 'Login' esteja sempre à mão.

import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      {/* 🛡️ HEADER E NAVEGAÇÃO */}
      <header className="main-header">
        <div className="logo">🌙 MoonFinance</div>
        <nav>
          <button className="btn-secondary">Entrar</button>
          <button className="btn-primary">Criar Minha Conta</button>
        </nav>
      </header>

      {/* 🚀 SEÇÃO HERO (O IMPACTO) */}
      <section className="hero">
        <h1>Suas finanças em harmonia com sua rotina <span>Pet & Glow</span>.</h1>
        <p>O único sistema que entende que o gasto com a Lua e a Sofy é tão importante quanto o seu cronograma de estética.</p>
        <div className="hero-btns">
          <button className="btn-lg">Começar Agora (Grátis)</button>
        </div>
      </section>

      {/* ✨ DIFERENCIAIS (O QUE DÁ PRA FAZER) */}
      <section className="features">
        <h2>Por que o MoonFinance é diferente?</h2>
        <div className="feature-grid">
          
          <div className="feature-card">
            <div className="icon">🐾</div>
            <h3>Gestão Individual de Pets</h3>
            <p>Separe os gastos da Lua e da Sofy. Saiba exatamente quanto custa o bem-estar de cada uma.</p>
          </div>

          <div className="feature-card">
            <div className="icon">💅</div>
            <h3>Estética Inteligente</h3>
            <p>Cronograma para unhas e procedimentos intercalados. Previsão de gastos que se repetem sozinhos.</p>
          </div>

          <div className="feature-card">
            <div className="icon">💳</div>
            <h3>Cartão sem Sustos</h3>
            <p>Cálculo automático de fechamento de fatura e parcelamentos que rolam para o mês certo.</p>
          </div>

          <div className="feature-card">
            <div className="icon">🏠</div>
            <h3>Meta do Apartamento</h3>
            <p>Rastreie cada centavo economizado para o seu novo lar com gráficos de evolução em tempo real.</p>
          </div>

        </div>
      </section>

      {/* 🛡️ LGPD & SEGURANÇA */}
      <footer className="home-footer">
        <p>© 2026 MoonFinance - Seus dados protegidos sob as regras da LGPD. 🔐</p>
      </footer>
    </div>
  );
};

export default Home;