'use client';

import { FormEvent, useState } from 'react';

const categories = [
  ['🛍️', 'Produtos e serviços'], ['🎟️', 'Diversão e lazer'], ['🍽️', 'Alimentos e bebidas'],
  ['❤️', 'Bem-estar e saúde'], ['📚', 'Educação'], ['🛒', 'Mercados'],
];

export default function Home() {
  const [status, setStatus] = useState('');
  const [lucky, setLucky] = useState('');
  const [loading, setLoading] = useState(false);

  async function register(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setStatus(''); setLucky('');
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    try {
      const response = await fetch('/api/register', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Não foi possível concluir o cadastro.');
      setLucky(data.luckyNumber); setStatus('Cadastro concluído! Seu número da sorte está abaixo.');
      event.currentTarget.reset();
    } catch (error) { setStatus(error instanceof Error ? error.message : 'Erro inesperado.'); }
    finally { setLoading(false); }
  }

  return <main>
    <header className="topbar"><div className="container nav"><div className="brand"><span className="brandMark">CF</span><span>CLUBE <b>BENEFÍCIOS</b> FORTAL</span></div><nav><a href="#beneficios">Benefícios</a><a href="#categorias">Categorias</a><a href="#sorteio">Sorteio</a><a className="navCta" href="#cadastro">Quero participar</a></nav></div></header>
    <section className="hero"><div className="container heroGrid"><div><span className="eyebrow">UM CLUBE FEITO PARA VOCÊ</span><h1>Mais benefícios.<br/><strong>Mais economia.</strong><br/>Mais chances de ganhar.</h1><p>Tenha acesso a vantagens, parceiros e experiências especiais em um único lugar.</p><div className="heroActions"><a className="button primary" href="#cadastro">Cadastre-se gratuitamente</a><a className="button ghost" href="#beneficios">Conheça o clube</a></div></div><div className="heroCard"><span>MEMBRO DO CLUBE</span><strong>BENEFÍCIOS<br/>EXCLUSIVOS</strong><div className="cardLine"/><small>Descontos • vantagens • sorteios</small></div></div></section>
    <section id="beneficios" className="section"><div className="container"><div className="sectionHead"><span className="eyebrow">VANTAGENS</span><h2>Descontos incríveis em uma ampla gama de categorias</h2><p>Encontre oportunidades para economizar no dia a dia e aproveitar mais.</p></div><div id="categorias" className="categoryGrid">{categories.map(([icon,name])=><div className="category" key={name}><span>{icon}</span><b>{name}</b><small>Ver parceiros</small></div>)}</div></div></section>
    <section className="section alt"><div className="container featureGrid"><div><span className="eyebrow">ACESSO FACILITADO</span><h2>Use o clube em qualquer lugar com seu celular.</h2><p>Portal rápido, seguro e pensado para você consultar suas vantagens sem formulários ou complicações.</p><div className="checks"><span>✓ Acesso rápido</span><span>✓ Experiência responsiva</span><span>✓ Parceiros e ofertas</span></div></div><div className="phone"><div className="phoneScreen"><span>CLUBE</span><strong>Seu benefício<br/>está aqui.</strong><div className="miniOffer">ATÉ <b>70%</b> OFF</div></div></div></div></section>
    <section className="section tele"><div className="container"><span className="eyebrow">CUIDADO E CONVENIÊNCIA</span><h2>Telemedicina e benefícios para cuidar de você.</h2><div className="benefitRow"><div><b>⚡ Acesso imediato</b><p>Atendimento quando precisar.</p></div><div><b>🔄 Cuidado contínuo</b><p>Mais praticidade no acompanhamento.</p></div><div><b>⏱️ Agilidade</b><p>Menos espera, mais conveniência.</p></div><div><b>📱 Conveniência</b><p>Do seu celular, onde estiver.</p></div></div></div></section>
    <section id="sorteio" className="section draw"><div className="container drawBox"><div><span className="eyebrow">SORTEIO DO CLUBE</span><h2>Cadastre-se e receba seu número da sorte.</h2><p>Cada cadastro válido recebe automaticamente um número único para participar dos sorteios do clube.</p></div><a className="button primary" href="#cadastro">Participar agora</a></div></section>
    <section id="cadastro" className="section"><div className="container formWrap"><div className="sectionHead"><span className="eyebrow">NOVO ASSOCIADO</span><h2>Faça seu cadastro</h2><p>Preencha os dados abaixo. O número da sorte é gerado automaticamente pelo sistema.</p></div><form onSubmit={register} className="signup"><label>Nome completo<input name="name" required minLength={3} placeholder="Seu nome"/></label><label>E-mail<input name="email" type="email" required placeholder="voce@email.com"/></label><label>Telefone<input name="phone" required placeholder="(00) 00000-0000"/></label><label>CPF<input name="cpf" required placeholder="000.000.000-00"/></label><label className="full">Aceite de participação<label className="check"><input name="terms" type="checkbox" value="yes" required/> Li e aceito os termos de participação e a política de privacidade.</label></label><button className="button primary full" disabled={loading}>{loading ? 'Cadastrando...' : 'Concluir cadastro'}</button></form>{status && <div className="notice">{status}{lucky && <strong>Número da sorte: {lucky}</strong>}</div>}</div></section>
    <section className="support"><div className="container"><span className="eyebrow">PRECISA DE AJUDA?</span><h2>Ficou com alguma dúvida?</h2><p>Entre em contato com nosso atendimento.</p><a href="mailto:atendimento@clubebeneficiosfortal.com.br">atendimento@clubebeneficiosfortal.com.br</a></div></section>
    <footer><div className="container"><span>© 2026 Clube Benefícios Fortal</span><span>Todos os direitos reservados.</span></div></footer>
  </main>;
}
