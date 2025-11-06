import React from 'react';

const metrics = [
  { label: 'Triagens realizadas', value: '12 mil+' },
  { label: 'Especialistas cadastrados', value: '320+' },
  { label: 'Famílias apoiadas', value: '4.5 mil+' }
];

const services = [
  {
    icon: '🧩',
    title: 'M-CHAT-R/F',
    description: 'Triagem para crianças de 16 a 30 meses focada em atenção conjunta, linguagem e comportamentos motores.',
    href: '/services/test/mchat'
  },
  {
    icon: '📋',
    title: 'ASSQ e AQ-10',
    description: 'Questionários para crianças, adolescentes e adultos, com perguntas de baixo estímulo visual.',
    href: '/services/test/assq'
  },
  {
    icon: '🩺',
    title: 'ADOS-2 e ADI-R',
    description: 'Protocolos observacionais e entrevistas estruturadas para especialistas credenciados na plataforma.',
    href: '/services/test/ados-2'
  }
];

const processSteps = [
  {
    icon: '1',
    title: 'Cadastro seguro',
    description: 'Escolha seu perfil, crie sua conta e acesse conteúdos educativos personalizados.'
  },
  {
    icon: '2',
    title: 'Triagem guiada',
    description: 'Escolha o teste adequado e responda perguntas com foco e acessibilidade.'
  },
  {
    icon: '3',
    title: 'Resultados claros',
    description: 'Receba orientações automáticas, classificações de risco e próximos passos.'
  },
  {
    icon: '4',
    title: 'Acompanhamento contínuo',
    description: 'Especialistas monitoram casos, geram dashboards e exportam dados anonimizados.'
  }
];

export const Header = ({ onLoginClick, isAuthenticated, role, onLogout }) => (
  <header className="sticky-nav" id="inicio">
    <div className="container nav-bar">
      <a href="#inicio" style={{ color: '#ffffff', fontWeight: 700, fontSize: '1.25rem' }}>Plataa</a>
      <nav>
        <ul className="nav-links">
          <li><a href="#inicio" className="active">Início</a></li>
          <li><a href="#sobre">Sobre</a></li>
          <li><a href="#servicos">Serviços</a></li>
          <li><a href="#equipe">Equipe</a></li>
          <li><a href="#processo">Como funciona</a></li>
          <li><a href="#contato">Contato</a></li>
          {isAuthenticated && (
            <>
              <li><a href="#dashboard">Dashboard</a></li>
              <li>
                <button type="button" className="btn btn-outline" onClick={onLogout} style={{ padding: '0.35rem 1rem' }}>
                  Sair
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
      {!isAuthenticated && (
        <button className="btn btn-outline" type="button" onClick={onLoginClick}>
          Entrar
        </button>
      )}
    </div>
  </header>
);

export const Hero = () => (
  <section className="hero" id="hero">
    <div className="container" style={{ position: 'relative', zIndex: 1 }}>
      <h1>Plataa - Plataforma de Triagem e Atendimento ao Autista</h1>
      <p>
        Um ecossistema completo para responsáveis e especialistas acompanharem sinais do Transtorno do Espectro Autista com acolhimento,
        ciência e tecnologia.
      </p>
      <a href="#servicos" className="btn btn-primary">Ver serviços</a>
    </div>
  </section>
);

export const Institutional = () => (
  <section className="section" id="sobre">
    <div className="container two-column">
      <div>
        <h2 className="section-title">Plataa: inclusão e apoio</h2>
        <p style={{ lineHeight: 1.8, marginBottom: '1.5rem' }}>
          Somos uma plataforma digital dedicada à triagem e acompanhamento contínuo de pessoas com TEA. Aqui você encontra conteúdos
          educativos sobre o espectro autista, materiais detalhados sobre ADOS-2 e ADI-R e orientações práticas para famílias e
          profissionais de saúde.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          {metrics.map((metric) => (
            <div key={metric.label} className="card" style={{ flex: '1 1 160px', textAlign: 'center' }}>
              <p style={{ fontSize: '2rem', fontWeight: 700, color: '#007bff' }}>{metric.value}</p>
              <p style={{ marginTop: '0.5rem', color: '#4b5563' }}>{metric.label}</p>
            </div>
          ))}
        </div>
        <a href="#contato" className="btn btn-outline">Fale com a equipe</a>
      </div>
      <img src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80" alt="Equipe multidisciplinar" loading="lazy" />
    </div>
  </section>
);

export const Services = () => (
  <section className="section" id="servicos" style={{ backgroundColor: '#f8f9fa' }}>
    <div className="container">
      <h2 className="section-title">Triagem especializada</h2>
      <p className="section-subtitle">Cards interativos com os principais protocolos de triagem oferecidos pela Plataa.</p>
      <div className="grid cards-grid">
        {services.map((service) => (
          <article key={service.title} className="card">
            <div className="card-icon" aria-hidden>{service.icon}</div>
            <h3>{service.title}</h3>
            <p style={{ margin: '1rem 0', lineHeight: 1.6 }}>{service.description}</p>
            <a className="btn btn-primary" href={service.href}>Read more</a>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export const Process = () => (
  <section className="section" id="processo">
    <div className="container">
      <h2 className="section-title">Triagem e atendimento</h2>
      <p className="section-subtitle">Acompanhe as etapas para responsáveis, especialistas e pesquisadores.</p>
      <div className="grid process-grid">
        {processSteps.map((step) => (
          <article key={step.title} className="card">
            <div className="card-icon" aria-hidden>{step.icon}</div>
            <h3>{step.title}</h3>
            <p style={{ marginTop: '0.75rem', lineHeight: 1.6 }}>{step.description}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export const TeamSection = () => (
  <section className="section" id="equipe">
    <div className="container">
      <h2 className="section-title">Equipe multidisciplinar</h2>
      <p className="section-subtitle">Neuropsicologia, fonoaudiologia, terapia ocupacional e psiquiatria em um único hub digital.</p>
      <div className="grid cards-grid">
        {[1, 2, 3].map((item) => (
          <article key={item} className="card">
            <div className="card-icon" aria-hidden>👩‍⚕️</div>
            <h3>Especialista {item}</h3>
            <p style={{ marginTop: '0.75rem', lineHeight: 1.6 }}>
              Atendimento humanizado, alinhado às diretrizes internacionais de triagem e acompanhamento do TEA.
            </p>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export const ContactSection = () => (
  <section className="section" id="contato">
    <div className="container">
      <h2 className="section-title">Entre em contato</h2>
      <p className="section-subtitle">Nossa equipe retorna em até 48 horas úteis.</p>
      <form className="card" style={{ maxWidth: '640px', margin: '0 auto' }} action="/api/v1/platform/contact/submit" method="post">
        <div className="form-group">
          <label htmlFor="contato-nome">Nome</label>
          <input id="contato-nome" name="nome" type="text" required />
        </div>
        <div className="form-group">
          <label htmlFor="contato-email">E-mail</label>
          <input id="contato-email" name="email" type="email" required />
        </div>
        <div className="form-group">
          <label htmlFor="contato-mensagem">Mensagem</label>
          <textarea id="contato-mensagem" name="mensagem" rows="4" style={{ borderRadius: '12px', border: '1px solid #d1d5db', padding: '0.75rem' }} required></textarea>
        </div>
        <button className="btn btn-primary" type="submit">Enviar mensagem</button>
      </form>
    </div>
  </section>
);

export const Footer = () => (
  <footer className="footer">
    <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <p>© 2024 Plataa. Plataforma de triagem e atendimento ao autista.</p>
      <a href="https://plataa.example.com/politica" target="_blank" rel="noreferrer">Política de privacidade</a>
    </div>
  </footer>
);
