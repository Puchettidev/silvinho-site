Revisei e reformulei o site da Silvinho Energia Solar nesta pasta. As mudanças já estão nos arquivos, ainda sem commit. Quero que você confira e publique.

## O que mudou (não refaça, só confira)
- `index.html`: página mais enxuta. Saíram as seções vazias (obras, equipamentos, depoimentos, "como funciona") e entrou a seção `#kits` com kits reais (5,20 kWp com 8 placas e inversor de 3 kW; 16 placas com inversor de 8 kW; card "A gente financia"). O topo é novo, com o slogan "A melhor da região em preço e qualidade".
- `tema.css` (novo): visual com céu azul, morro verde, laranja e títulos em Montserrat itálico. É carregado depois de `style.css` e `montagem.css`.
- Ícones novos em `imagem/` (`icone.svg`, `icone-192.png`, `icone-512.png`, `icone-32.png`, `apple-touch-icon.png`), além de `favicon.ico`, `site.webmanifest` e a imagem de compartilhamento `imagem/og-silvinho.png`.
- Contatos atualizados em `index.html`, `energia-solar-muriae.html` e `simulador.js`:
  - WhatsApp: (32) 98459-6667 → `wa.me/5532984596667`
  - Fixo: (32) 3721-7064 (mantido)
  - Endereço: Av. Monteiro de Castro, 361, Barra, Muriaé-MG (ao lado da Vidraçaria Muriaé)
  - Instagram: https://www.instagram.com/silvinhoeletronica.peres/

## Tarefas
1. Rode `git status` e `git diff --stat` e me mostre o resumo do que mudou.
2. Confira se ainda existe em algum `.html` o endereço antigo ("Benedito Valadares"), o WhatsApp antigo (`wa.me/553237217064`), o Instagram antigo (`instagram.com/silvinhoeletronica/`) ou algum texto "TROCAR:" visível na página. Corrija o que encontrar. Os comentários "TROCAR" dentro do `simulador.js` podem ficar.
3. Remova do `style.css` e do `index.html` o CSS e o markup que ficaram sem uso por causa das seções retiradas (`.placeholder`, `.finance`, `.equip`, depoimentos, obras, `.hero-backdrop`), sem quebrar nada.
4. A imagem `imagem/silvinho-hero.png` (1,8 MB) não é mais usada na página inicial. Confira se ainda é referenciada em algum lugar; se não for, mova para `imagem/_nao-usado/`.
5. Atualize o `sitemap.xml`, com o `lastmod` de hoje nas duas páginas.
6. Abra o site num servidor local e confira no celular (375px) e no computador (1280px): menu, animação de montagem, simulador (os botões de WhatsApp precisam abrir com o número 5532984596667), formulário de orçamento, perguntas frequentes e rodapé. Verifique também se não há erros no console.
7. Faça o commit com uma mensagem clara em português e dê `git push` para publicar na Vercel. Depois me passe o link e confirme se o deploy terminou sem erro.
8. Confira na Vercel se o domínio `silvinhoeletronica.com.br` está ligado a este projeto. Se não estiver, me explique o passo a passo para ligar, sem mudar o DNS por conta própria.

No final, me entregue uma lista curta do que ainda depende de mim (fotos das obras, horários da loja nova, qual WhatsApp usar etc.).
