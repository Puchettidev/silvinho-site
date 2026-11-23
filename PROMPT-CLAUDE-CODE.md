# Prompt para o Claude Code – Novo site Silvinho Eletrônica e Energia Solar

Copie tudo abaixo da linha e cole no Claude Code, com esta pasta aberta.

---

Você vai reformular o site da **Silvinho Eletrônica e Energia Solar** (Muriaé-MG). O objetivo agora é que o site seja **focado em energia solar** (venda e instalação de sistemas fotovoltaicos). A assistência técnica de eletrônicos continua no site, mas como seção secundária, porque os 30+ anos de loja são um argumento de confiança.

## O que já existe nesta pasta
- `index.html`, `style.css`, `script.js`: site atual de uma página (HTML/CSS/JS puros, sem framework). Hoje o foco é assistência técnica e o solar aparece como um item a mais.
- `montagem-solar.html`: animação pronta e testada, controlada pela rolagem. Uma casa em SVG é montada em 6 etapas (projeto → estrutura → painéis → inversor → ligação → sol nascendo e contador de economia). JS puro, com `position: sticky`, versão mobile e suporte a `prefers-reduced-motion`.
- `imagem/silvinho-hero.png`, `robots.txt`, `sitemap.xml`.

Leia todos os arquivos antes de começar.

## Regras técnicas
- Continue em **HTML, CSS e JS puros**, sem framework, sem build e sem bibliotecas pesadas. O site precisa abrir rápido no celular (a maioria dos clientes vem do Instagram e do WhatsApp).
- Mantenha a identidade visual: azul-marinho `#071B3B` / `#0A254F`, laranja `#FF7A00` / `#FFB000`, fonte Inter. Reaproveite as variáveis CSS que já existem.
- Pense primeiro no celular e depois adapte para telas grandes.
- Mantenha a acessibilidade: textos alternativos, contraste, foco visível e `prefers-reduced-motion`.
- Não apague arquivos. Se for substituir algo, salve o antigo como `index-antigo.html` e assim por diante.

## Estrutura da nova página inicial (nesta ordem)
1. **Topo (hero):** título focado em solar, por exemplo "Energia solar em Muriaé e região, com quem está na cidade há mais de 30 anos". Subtítulo curto, botão principal "Simular minha economia" (leva ao simulador) e botão secundário de WhatsApp.
2. **Animação de montagem:** integre o conteúdo de `montagem-solar.html` como seção da página, extraindo o CSS e o JS para os arquivos principais (ou para `montagem.css`/`montagem.js`), com seletores isolados para não conflitar com o resto.
3. **Simulador de economia:** a pessoa informa o valor médio da conta de luz (R$) e o tipo de ligação (mono/bi/trifásica). Mostre uma estimativa de potência do sistema (kWp), número aproximado de painéis, economia mensal e anual e tempo estimado de retorno. Deixe as constantes do cálculo (tarifa R$/kWh, geração média em kWh/kWp/mês para a Zona da Mata MG, potência do painel, custo médio por kWp) **no topo do JS, comentadas e fáceis de editar**. Exiba o aviso: "Estimativa. O valor final depende da visita técnica." Inclua um botão que abre o WhatsApp com os dados da simulação já escritos na mensagem.
4. **Como funciona:** 5 etapas (visita técnica → projeto → homologação na distribuidora → instalação → monitoramento).
5. **Obras realizadas:** galeria de instalações. Use espaços reservados com a classe `.placeholder` e um comentário `<!-- TROCAR: foto real -->`.
6. **Equipamentos e garantias:** painéis (garantia de desempenho de até 25 anos), inversor e estrutura. Marcas como espaço reservado.
7. **Financiamento:** seção curta dizendo que existem opções de financiamento, com espaço reservado para os bancos e parceiros.
8. **Depoimentos:** de clientes de energia solar (espaços reservados, sem inventar nomes reais).
9. **Perguntas frequentes (FAQ)**, com `<details>`: funciona em dia nublado? E à noite? O que muda com a Lei 14.300 (taxa mínima / Fio B)? Precisa de manutenção? Quanto tempo dura? Quanto tempo leva a instalação? Respostas corretas e honestas.
10. **Formulário de orçamento:** nome, cidade, valor médio da conta, tipo de imóvel (casa/comércio/rural) e tipo de telhado. Ao enviar, monta uma mensagem e abre o WhatsApp (sem backend).
11. **Também fazemos assistência técnica:** versão compacta dos serviços atuais (celulares, troca de tela, reparo em placa, drones, TVs, venda de aparelhos, seminovos, acessórios).
12. **Rodapé:** manter contato, endereço, horário e mapa atuais.

## Textos e honestidade
- Troque o "economize até 95%" por algo defensável, como "reduza sua conta de luz em até 90%*", com uma nota explicando a taxa mínima da distribuidora.
- Nunca invente números, depoimentos, quantidade de obras ou marcas. Tudo que for dado real da empresa entra como espaço reservado marcado com `TROCAR:`.
- Português do Brasil, tom próximo e confiável, sem exagero.

## SEO local
- Ajuste `<title>`, `description` e as tags Open Graph para o foco em solar ("energia solar Muriaé", "instalação de placas solares Muriaé MG").
- Use **URL absoluta** na `og:image` (`https://silvinhoeletronica.com.br/imagem/...`); hoje está relativa e não aparece quando o link é compartilhado.
- Adicione JSON-LD: `LocalBusiness` (ou `Electrician`) com endereço Rua Benedito Valadares, 88, Muriaé-MG, telefone, horários e `areaServed`, além de `FAQPage` com as perguntas do FAQ.
- Crie a página `energia-solar-muriae.html`, com conteúdo próprio voltado a SEO, e uma seção ou página com as cidades atendidas (espaço reservado: Muriaé, Miraí, Eugenópolis, Patrocínio do Muriaé, Laranjal, Rosário da Limeira, Vieiras… a confirmar).
- Atualize o `sitemap.xml`.

## Dados da empresa (já confirmados)
- Nome: Silvinho Eletrônica e Energia Solar
- Telefone/WhatsApp: (32) 3721-7064 → `https://wa.me/553237217064`
- Instagram: https://www.instagram.com/silvinhoeletronica/
- Endereço: Rua Benedito Valadares, 88, Muriaé-MG
- Horário: segunda a sexta, 09h às 18h; sábado, 09h às 13h
- Mais de 30 anos de experiência
- Domínio: https://silvinhoeletronica.com.br

## Dados que ainda faltam (deixe como espaço reservado `TROCAR:`)
- Fotos reais de instalações e quantidade de obras feitas
- Marcas de painéis e inversores
- Bancos e parceiros de financiamento
- Cidades atendidas confirmadas
- Valor real de economia para o contador da animação (hoje R$ 4.800/ano é exemplo)
- Depoimentos reais de clientes de energia solar

## Como trabalhar
1. Leia os arquivos e me mostre um plano curto antes de mexer em tudo.
2. Faça a página inicial primeiro, depois o simulador, o SEO e a página de Muriaé.
3. No final, abra o site no navegador, confira celular (375px) e computador (1280px) e me entregue uma lista de todos os `TROCAR:` que eu preciso preencher.
