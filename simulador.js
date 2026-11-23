/* =========================================================
   Simulador de economia + formulário de orçamento (WhatsApp)
   ========================================================= */

/* ---------------------------------------------------------
   CONSTANTES DO CÁLCULO — edite aqui
   --------------------------------------------------------- */

// Tarifa média cobrada por kWh, já com impostos (R$/kWh).
// TROCAR: confirme com uma conta de luz recente de cliente residencial da região
// (valor total da conta ÷ kWh consumidos).
const TARIFA_KWH = 1.05;

// Geração média mensal de 1 kWp instalado na Zona da Mata mineira (kWh/kWp/mês).
// Valor típico entre 110 e 125, considerando perdas. Ajuste pela experiência das obras reais.
const GERACAO_KWH_POR_KWP_MES = 118;

// Potência de cada painel usado nos orçamentos (W).
// TROCAR: potência do painel que a empresa mais instala.
const POTENCIA_PAINEL_W = 610;

// Custo médio do sistema instalado por kWp (R$/kWp), usado só para o tempo de retorno.
// TROCAR: custo médio real da empresa (equipamentos + instalação + projeto).
const CUSTO_MEDIO_POR_KWP = 4000;

// O retorno aparece como faixa ("3 a 4 anos"): o limite de cima é o cálculo × esta margem.
const MARGEM_RETORNO = 1.3;

// Consumo mínimo cobrado pela distribuidora (custo de disponibilidade), em kWh/mês.
const MINIMO_KWH = { mono: 30, bi: 50, tri: 100 };

// Lei 14.300 — parte do Fio B cobrada sobre a energia injetada e compensada.
// 2023: 0.15 · 2024: 0.30 · 2025: 0.45 · 2026: 0.60 · 2027: 0.75 · 2028: 0.90
const PERCENTUAL_FIO_B = 0.60;

// Quanto o Fio B representa da tarifa total (fração). Aproximação.
// TROCAR: confirme com a tabela tarifária da distribuidora local.
const PESO_FIO_B_NA_TARIFA = 0.28;

// Parte da energia gerada que é consumida na hora (não passa pela rede, não paga Fio B).
// Residências ficam em torno de 0.2 a 0.4. Usamos um valor conservador.
const FATOR_SIMULTANEIDADE = 0.25;

const WHATSAPP_NUMERO = "553237217064";

/* --------------------------------------------------------- */

(() => {
    const brl = (n) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
    const num = (n, d = 1) => n.toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d });
    const waLink = (texto) => `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(texto)}`;
    const NOMES_LIGACAO = { mono: "Monofásica", bi: "Bifásica", tri: "Trifásica" };

    // Aceita "350", "350,50", "1.200,00", "R$ 1200"
    function lerValor(texto) {
        let t = String(texto).replace(/[^\d.,]/g, "");
        if (t.includes(",")) t = t.replace(/\./g, "").replace(",", ".");
        else if (/\.\d{3}$/.test(t)) t = t.replace(/\./g, "");
        const v = parseFloat(t);
        return Number.isFinite(v) ? v : NaN;
    }

    function calcular(conta, ligacao) {
        const consumo = conta / TARIFA_KWH;                       // kWh/mês
        const minimo = MINIMO_KWH[ligacao];
        const compensavel = Math.max(0, consumo - minimo);        // kWh que o sistema pode abater
        if (compensavel <= 0) return null;

        const kwpIdeal = compensavel / GERACAO_KWH_POR_KWP_MES;
        const paineis = Math.max(1, Math.ceil((kwpIdeal * 1000) / POTENCIA_PAINEL_W));
        const kwp = (paineis * POTENCIA_PAINEL_W) / 1000;

        const gerado = kwp * GERACAO_KWH_POR_KWP_MES;
        const abatido = Math.min(gerado, compensavel);
        const injetado = abatido * (1 - FATOR_SIMULTANEIDADE);
        const custoFioB = injetado * TARIFA_KWH * PESO_FIO_B_NA_TARIFA * PERCENTUAL_FIO_B;

        const economiaMes = Math.max(0, abatido * TARIFA_KWH - custoFioB);
        const economiaAno = economiaMes * 12;
        const investimento = kwp * CUSTO_MEDIO_POR_KWP;
        const retornoAnos = economiaAno > 0 ? investimento / economiaAno : Infinity;

        return { consumo, kwp, paineis, economiaMes, economiaAno, retornoAnos, pct: economiaMes / conta };
    }

    /* ---------- Simulador ---------- */
    const form = document.getElementById("sim-form");
    if (form) {
        const out = {
            mes: document.getElementById("sim-eco-mes"),
            pct: document.getElementById("sim-eco-pct"),
            ano: document.getElementById("sim-eco-ano"),
            kwp: document.getElementById("sim-kwp"),
            paineis: document.getElementById("sim-paineis"),
            retorno: document.getElementById("sim-retorno"),
            wa: document.getElementById("sim-whatsapp"),
            erro: document.getElementById("sim-erro"),
        };
        const inputConta = document.getElementById("sim-conta");

        function limpar() {
            ["mes", "ano", "kwp", "paineis", "retorno"].forEach((k) => { out[k].textContent = "—"; });
            out.pct.textContent = "";
            out.wa.href = waLink("Olá! Quero fazer uma simulação de energia solar.");
        }

        function mostrarErro(msg) {
            out.erro.textContent = msg;
            out.erro.hidden = !msg;
            inputConta.setAttribute("aria-invalid", msg ? "true" : "false");
        }

        function atualizar() {
            const conta = lerValor(inputConta.value);
            const ligacao = form.elements.ligacao.value || "bi";

            if (!Number.isFinite(conta) || conta <= 0) {
                mostrarErro(inputConta.value.trim() ? "Digite um valor válido, por exemplo 350." : "");
                limpar();
                return;
            }

            const r = calcular(conta, ligacao);
            if (!r) {
                mostrarErro("Com essa conta, o consumo fica perto do mínimo cobrado pela distribuidora. Fale com a gente para avaliar o seu caso.");
                limpar();
                return;
            }
            mostrarErro("");

            let retornoTxt = "—";
            if (Number.isFinite(r.retornoAnos)) {
                const de = Math.max(1, Math.floor(r.retornoAnos));
                const ate = Math.max(de + 1, Math.ceil(r.retornoAnos * MARGEM_RETORNO));
                retornoTxt = `${de} a ${ate} anos`;
            }
            out.mes.textContent = brl(r.economiaMes);
            out.pct.textContent = `cerca de ${Math.round(r.pct * 100)}% da sua conta`;
            out.ano.textContent = brl(r.economiaAno);
            out.kwp.textContent = `${num(r.kwp, 2)} kWp`;
            out.paineis.textContent = `${r.paineis} de ${POTENCIA_PAINEL_W} W`;
            out.retorno.textContent = retornoTxt;

            out.wa.href = waLink(
                "Olá! Fiz a simulação de energia solar no site:\n" +
                `• Conta média: ${brl(conta)}\n` +
                `• Ligação: ${NOMES_LIGACAO[ligacao]}\n` +
                `• Sistema estimado: ${num(r.kwp, 2)} kWp (${r.paineis} painéis)\n` +
                `• Economia estimada: ${brl(r.economiaMes)}/mês (${brl(r.economiaAno)}/ano)\n` +
                `• Retorno estimado: ${retornoTxt}\n` +
                "Gostaria de agendar uma visita técnica."
            );
        }

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            atualizar();
            document.getElementById("sim-resultado").scrollIntoView({ behavior: "smooth", block: "nearest" });
        });
        form.addEventListener("input", atualizar);
        form.addEventListener("change", atualizar);
        atualizar();
    }

    /* ---------- Formulário de orçamento ---------- */
    const orc = document.getElementById("orc-form");
    if (orc) {
        const erro = document.getElementById("orc-erro");

        orc.addEventListener("submit", (e) => {
            e.preventDefault();
            const f = orc.elements;
            const nome = f.nome.value.trim();
            const cidade = f.cidade.value.trim();
            const conta = lerValor(f.conta.value);

            const faltando = [];
            if (!nome) faltando.push(f.nome);
            if (!cidade) faltando.push(f.cidade);
            if (!Number.isFinite(conta) || conta <= 0) faltando.push(f.conta);

            [f.nome, f.cidade, f.conta].forEach((i) => i.setAttribute("aria-invalid", faltando.includes(i) ? "true" : "false"));

            if (faltando.length) {
                erro.textContent = "Preencha nome, cidade e o valor da conta para continuar.";
                erro.hidden = false;
                faltando[0].focus();
                return;
            }
            erro.hidden = true;

            const texto =
                "Olá! Quero um orçamento de energia solar.\n" +
                `• Nome: ${nome}\n` +
                `• Cidade: ${cidade}\n` +
                `• Conta média: ${brl(conta)}\n` +
                `• Imóvel: ${f.imovel.value}\n` +
                `• Telhado: ${f.telhado.value}`;

            window.open(waLink(texto), "_blank", "noopener");
        });
    }
})();
