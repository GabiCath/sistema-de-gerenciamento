const estoque = carregarEstoque();
const lista = document.getElementById('estoqueList');
const sugestoes = document.getElementById('sugestoes');

document.getElementById('addForm').addEventListener('submit', e => {
  e.preventDefault();

  const nome = document.getElementById('nome').value;
  const origem = document.getElementById('origem').value;
  const validade = document.getElementById('validade').value;
  const kit = document.getElementById('kit').checked;
  const amostra = document.getElementById('amostra').checked;

  const novoLote = {
    id: Date.now(),
    nome,
    origem,
    validade,
    tipo: "grão",
    gourmet: true,
    kit,
    amostra
  };

  estoque.push(novoLote);
  salvarEstoque();
  alert(`Novo lote de "${nome}" adicionado!`);

  document.getElementById('addForm').reset();
  renderizarEstoque();
  renderSugestoes();
});

function renderizarEstoque() {
  const filtroValidade = document.getElementById('filtroValidade').checked;
  const hoje = new Date().toISOString().split('T')[0];
  lista.innerHTML = '';

  const lotesFiltrados = estoque.filter(lote => {
    if (filtroValidade && lote.validade < hoje) return false;
    return true;
  });

  if (lotesFiltrados.length === 0) {
    lista.innerHTML = '<li>Nenhum lote disponível.</li>';
    return;
  }

  lotesFiltrados.forEach(lote => {
    const item = document.createElement('li');
    item.innerHTML = `
      <strong>${lote.nome}</strong> (Grão Gourmet)<br>
      Origem: ${lote.origem} <br>
      Validade: ${lote.validade} <br>
      ${lote.kit ? '🎁 Kit Promocional<br>' : ''}
      ${lote.amostra ? '☕ Amostra Grátis<br>' : ''}
      <button onclick="removerLote(${lote.id})">Remover</button>
    `;
    lista.appendChild(item);
  });
}

function removerLote(id) {
  const index = estoque.findIndex(l => l.id === id);
  if (index !== -1) {
    alert(`Lote "${estoque[index].nome}" removido.`);
    estoque.splice(index, 1);
    salvarEstoque();
    renderizarEstoque();
    renderSugestoes();
  }
}

function renderSugestoes() {
  sugestoes.innerHTML = '';

  if (estoque.length === 0) {
    sugestoes.innerHTML = '<div class="sugestoes-box">Nenhum item no estoque.</div>';
    return;
  }

  const sugestao = estoque[Math.floor(Math.random() * estoque.length)];
  sugestoes.innerHTML = `
    <div class="sugestoes-box">
      Você pode gostar de: <strong>${sugestao.nome}</strong> (Grão Gourmet, Origem: ${sugestao.origem})
    </div>
  `;
}

function salvarEstoque() {
  localStorage.setItem('estoqueCafeGourmet', JSON.stringify(estoque));
}

function carregarEstoque() {
  const dados = localStorage.getItem('estoqueCafeGourmet');
  return dados ? JSON.parse(dados) : [];
}

document.getElementById('filtroValidade').addEventListener('change', () => {
  renderizarEstoque();
});

renderizarEstoque();
renderSugestoes();

// Revela o botão ao clicar duas vezes na área secreta
document.getElementById('revelarBtn').addEventListener('dblclick', () => {
  document.getElementById('limparEstoqueBtn').style.display = 'inline-block';
  alert('Botão de limpeza revelado!');
});

// Segurança total no clique: com senha
document.getElementById('limparEstoqueBtn').addEventListener('click', () => {
  const senha = prompt('Digite a senha para limpar o estoque:');
  if (senha === 'cafegourmet123') {
    const confirmar = confirm('Tem certeza que deseja apagar TODO o estoque? Esta ação não pode ser desfeita.');
    if (confirmar) {
      estoque.length = 0;
      localStorage.removeItem('estoqueCafeGourmet');
      renderizarEstoque();
      renderSugestoes();
      alert('Estoque completamente limpo!');
    }
  } else {
    alert('Senha incorreta! Ação cancelada.');
  }
});

  
  
