const PERIODOS = [
  { id: "manha", nome: "Manhã", icone: "☀️", inicio: "09:00", fim: "12:00" },
  { id: "tarde", nome: "Tarde", icone: "🌤️", inicio: "13:00", fim: "18:00" },
  { id: "noite", nome: "Noite", icone: "🌙", inicio: "19:00", fim: "21:00" }
];
const CHAVE = "petshop-agendamentos";

const agenda = document.getElementById("agenda");
const inputDataAgenda = document.getElementById("data-agenda");
const modal = document.getElementById("modal");
const form = document.getElementById("form-agendamento");
const CAMPOS = ["tutor", "pet", "telefone", "servico", "data", "hora"];

let agendamentos = carregar();

function carregar() {
  try {
    const salvos = JSON.parse(localStorage.getItem(CHAVE));
    return Array.isArray(salvos) ? salvos : [];
  } catch {
    return [];
  }
}

function salvar() {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(agendamentos));
  } catch {
    /* sem armazenamento: a agenda vale só até recarregar a página */
  }
}

function hoje() {
  return new Date().toLocaleDateString("en-CA"); // AAAA-MM-DD no fuso local
}

function horaCurta(hora) {
  return hora.slice(0, 2) + "h";
}

function periodoDe(hora) {
  return PERIODOS.find((p) => hora >= p.inicio && hora <= p.fim);
}

function el(tag, classe, texto) {
  const e = document.createElement(tag);
  if (classe) e.className = classe;
  if (texto) e.textContent = texto; // textContent evita injetar HTML digitado pelo usuário
  return e;
}

function criarLinha(ag) {
  const li = el("li", "item");
  const info = el("div", "info");
  info.append(
    el("span", "pet", ag.pet),
    el("span", "tutor", `Tutor: ${ag.tutor}, ${ag.telefone}`),
    el("span", "servico", ag.servico)
  );
  const botao = el("button", "remover", "Remover");
  botao.type = "button";
  botao.setAttribute("aria-label", `Remover agendamento de ${ag.pet} às ${ag.hora}`);
  botao.addEventListener("click", () => remover(ag.id));
  li.append(el("time", "hora", ag.hora), info, botao);
  return li;
}

function renderizar() {
  const data = inputDataAgenda.value;
  agenda.replaceChildren(
    ...PERIODOS.map((p) => {
      const secao = el("section", `periodo ${p.id}`);
      secao.setAttribute("aria-labelledby", `titulo-${p.id}`);

      const cab = el("header", "periodo-cab");
      const icone = el("span", "icone", p.icone);
      icone.setAttribute("aria-hidden", "true");
      const nome = el("h2", "", p.nome);
      nome.id = `titulo-${p.id}`;
      cab.append(icone, nome, el("span", "janela", `${horaCurta(p.inicio)} às ${horaCurta(p.fim)}`));

      const lista = el("ul", "lista");
      const itens = agendamentos
        .filter((a) => a.data === data && periodoDe(a.hora)?.id === p.id)
        .sort((a, b) => a.hora.localeCompare(b.hora));
      if (itens.length) lista.append(...itens.map(criarLinha));
      else lista.append(el("li", "vazio", "Nenhum agendamento neste período."));

      secao.append(cab, lista);
      return secao;
    })
  );
}

function remover(id) {
  agendamentos = agendamentos.filter((a) => a.id !== id);
  salvar();
  renderizar();
}

function validar(v) {
  const erros = {};
  if (!v.tutor) erros.tutor = "Informe o nome do tutor.";
  if (!v.pet) erros.pet = "Informe o nome do pet.";

  const digitos = v.telefone.replace(/\D/g, "");
  if (!v.telefone) erros.telefone = "Informe o telefone.";
  else if (digitos.length < 10 || digitos.length > 11) erros.telefone = "Telefone inválido. Use DDD + número, ex.: (61) 99999-9999.";

  if (!v.servico) erros.servico = "Descreva o serviço.";
  if (!v.data) erros.data = "Escolha a data.";

  if (!v.hora) {
    erros.hora = "Escolha o horário.";
  } else if (!periodoDe(v.hora)) {
    const faixas = PERIODOS.map((p) => `${horaCurta(p.inicio)} às ${horaCurta(p.fim)}`).join(", ");
    erros.hora = `Horário indisponível. Atendemos das ${faixas}.`;
  } else if (v.data && agendamentos.some((a) => a.data === v.data && a.hora === v.hora)) {
    erros.hora = "Já existe um agendamento nesse horário nesta data.";
  }
  return erros;
}

function mostrarErros(erros) {
  CAMPOS.forEach((c) => {
    const campo = form.elements[c];
    document.getElementById(`erro-${c}`).textContent = erros[c] || "";
    if (erros[c]) campo.setAttribute("aria-invalid", "true");
    else campo.removeAttribute("aria-invalid");
  });
}

document.getElementById("btn-novo").addEventListener("click", () => {
  form.reset();
  mostrarErros({});
  form.elements.data.value = inputDataAgenda.value || hoje();
  modal.showModal(); // bloqueia o fundo
  form.elements.tutor.focus(); // foco inicial no primeiro campo
});

document.getElementById("btn-cancelar").addEventListener("click", () => modal.close());
modal.addEventListener("click", (evento) => {
  if (evento.target === modal) modal.close(); // clique no fundo escuro
});

form.addEventListener("submit", (evento) => {
  evento.preventDefault();
  const valores = Object.fromEntries(CAMPOS.map((c) => [c, form.elements[c].value.trim()]));
  const erros = validar(valores);
  mostrarErros(erros);

  const primeiroErro = CAMPOS.find((c) => erros[c]);
  if (primeiroErro) {
    form.elements[primeiroErro].focus();
    return;
  }

  agendamentos.push({ id: Date.now().toString(36) + Math.random().toString(36).slice(2), ...valores });
  salvar();
  inputDataAgenda.value = valores.data; // mostra a agenda da data agendada
  renderizar();
  modal.close();
});

inputDataAgenda.addEventListener("change", () => {
  if (!inputDataAgenda.value) inputDataAgenda.value = hoje();
  renderizar();
});

inputDataAgenda.value = hoje();
renderizar();
