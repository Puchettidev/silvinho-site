/* =========================================================
   Animação de montagem do sistema solar (controlada pela rolagem)
   Extraída de montagem-solar.html.
   ========================================================= */

// TROCAR: valor real de economia anual de um cliente típico (hoje é só um exemplo).
const MTG_ECONOMIA_ANUAL_EXEMPLO = 4800;

(() => {
    const sec = document.getElementById("montagem");
    if (!sec) return;

    const NS = "http://www.w3.org/2000/svg";
    const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
    const ease = (t) => 1 - Math.pow(1 - t, 3); // easeOutCubic
    const easeBack = (t) => { const c = 1.6; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };

    // Telhado como trapézio: ponto (u,v) com u 0..1 esquerda→direita, v 0..1 baixo→topo
    const BL = [148, 306], BR = [652, 306], TL = [210, 180], TR = [590, 180];
    const pt = (u, v) => {
        const lx = BL[0] + (TL[0] - BL[0]) * v, rx = BR[0] + (TR[0] - BR[0]) * v;
        const y = BL[1] + (TL[1] - BL[1]) * v;
        return [lx + (rx - lx) * u, y];
    };
    const poly = (pts) => pts.map((p) => p.join(",")).join(" ");
    const el = (tag, attrs, parent) => {
        const e = document.createElementNS(NS, tag);
        for (const k in attrs) e.setAttribute(k, attrs[k]);
        parent.appendChild(e);
        return e;
    };

    const parts = [];
    const addPart = (node, a, b, dx, dy, rot, back = false) => {
        parts.push({ node, a, b, dx, dy, rot, back, c: [0, 0] });
    };

    // Trilhos
    const gT = document.getElementById("mtg-trilhos");
    [0.2, 0.42, 0.6, 0.82].forEach((v, i) => {
        const p1 = pt(0.06, v), p2 = pt(0.94, v);
        const g = el("g", {}, gT);
        el("line", { x1: p1[0], y1: p1[1], x2: p2[0], y2: p2[1], stroke: "#cfd8e6", "stroke-width": 5, "stroke-linecap": "round" }, g);
        addPart(g, 0.10 + i * 0.03, 0.20 + i * 0.03, -700, 0, 0);
    });

    // Painéis: 2 linhas x 5 colunas
    const gP = document.getElementById("mtg-paineis");
    const rows = [[0.1, 0.48], [0.54, 0.92]], cols = 5, uMin = 0.08, uMax = 0.92, gap = 0.012;
    const panelShine = [];
    let k = 0;
    rows.forEach(([v0, v1]) => {
        for (let c = 0; c < cols; c++) {
            const u0 = uMin + (uMax - uMin) * c / cols + gap, u1 = uMin + (uMax - uMin) * (c + 1) / cols - gap;
            const g = el("g", {}, gP);
            const quad = poly([pt(u0, v0), pt(u1, v0), pt(u1, v1), pt(u0, v1)]);
            el("polygon", { points: quad, fill: "url(#mtg-gPanel)", stroke: "#dfe7f3", "stroke-width": 2 }, g);
            for (let j = 1; j < 3; j++) {
                const u = u0 + (u1 - u0) * j / 3, a = pt(u, v0), b = pt(u, v1);
                el("line", { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: "#4f7fc4", "stroke-width": 1 }, g);
            }
            const mid = (v0 + v1) / 2, a = pt(u0, mid), b = pt(u1, mid);
            el("line", { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: "#4f7fc4", "stroke-width": 1 }, g);
            panelShine.push(el("polygon", { points: quad, fill: "#FFB000", opacity: 0 }, g));
            const start = 0.25 + k * 0.028;
            // deslocamentos fixos (pseudoaleatórios) para a animação ser sempre igual
            const r1 = Math.sin(k * 12.9898) * 0.5, r2 = Math.cos(k * 78.233) * 0.5;
            addPart(g, start, start + 0.07, r1 * 300, -620, r2 * 70, true);
            k++;
        }
    });

    addPart(document.getElementById("mtg-inversor"), 0.56, 0.66, 320, 0, 20, true);

    // Raios do sol
    const gR = document.getElementById("mtg-raios");
    for (let i = 0; i < 12; i++) {
        const a = i * Math.PI / 6;
        el("line", { x1: 680 + Math.cos(a) * 54, y1: 90 + Math.sin(a) * 54, x2: 680 + Math.cos(a) * 72, y2: 90 + Math.sin(a) * 72 }, gR);
    }

    // centros para rotação
    parts.forEach((p) => { const b = p.node.getBBox(); p.c = [b.x + b.width / 2, b.y + b.height / 2]; });

    const cabo = document.getElementById("mtg-cabo");
    const L = cabo.getTotalLength();
    cabo.style.strokeDasharray = L;

    const gPart = document.getElementById("mtg-particulas");
    const dots = Array.from({ length: 10 }, () => el("circle", { r: 5, fill: "#FFE08a", filter: "url(#mtg-glow)", opacity: 0 }, gPart));

    const sol = document.getElementById("mtg-sol"), led = document.getElementById("mtg-led");
    const steps = sec.querySelectorAll(".mtg-steps li");
    const stepAt = [0, 0.10, 0.25, 0.56, 0.66, 0.80];
    const counter = document.getElementById("mtg-counter");
    const valor = document.getElementById("mtg-valor");
    const barra = document.getElementById("mtg-barra");
    const sticky = sec.querySelector(".mtg-sticky");
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const brl = (n) => "R$ " + Math.round(n).toLocaleString("pt-BR");

    let p = 0, target = 0, running = false, visible = false;

    function draw(now) {
        parts.forEach((d) => {
            const raw = clamp((p - d.a) / (d.b - d.a));
            const e = d.back ? easeBack(raw) : ease(raw), r = 1 - e;
            d.node.setAttribute("transform", `translate(${d.dx * r} ${d.dy * r}) rotate(${d.rot * r} ${d.c[0]} ${d.c[1]})`);
            d.node.style.opacity = clamp(raw * 3);
        });
        cabo.style.strokeDashoffset = L * (1 - clamp((p - 0.66) / 0.12));

        const s = ease(clamp((p - 0.78) / 0.12));
        sol.setAttribute("opacity", s);
        sol.setAttribute("transform", `translate(0 ${160 * (1 - s)})`);
        gR.setAttribute("transform", `rotate(${now / 40} 680 90)`);
        sticky.style.setProperty("--mtg-sky-top", s > 0 ? `rgb(${6 + 20 * s},${20 + 55 * s},${44 + 90 * s})` : "#06142c");
        sticky.style.setProperty("--mtg-sky-bot", s > 0 ? `rgb(${10 + 60 * s},${37 + 80 * s},${79 + 100 * s})` : "#0A254F");
        panelShine.forEach((n, i) => n.setAttribute("opacity", s * (0.12 + 0.08 * Math.sin(now / 400 + i))));
        led.setAttribute("fill", s > 0.5 ? "#3ddc84" : "#5b6b82");

        const f = clamp((p - 0.88) / 0.06);
        dots.forEach((d, i) => {
            const q = cabo.getPointAtLength(((now / 3000 + i / dots.length) % 1) * L);
            d.setAttribute("cx", q.x); d.setAttribute("cy", q.y); d.setAttribute("opacity", f);
        });

        counter.classList.toggle("show", p > 0.86);
        valor.textContent = brl(MTG_ECONOMIA_ANUAL_EXEMPLO * ease(clamp((p - 0.86) / 0.12)));
        barra.style.width = (p * 100) + "%";

        let cur = 0;
        stepAt.forEach((a, i) => { if (p >= a) cur = i; });
        steps.forEach((li, i) => { li.classList.toggle("active", i === cur); li.classList.toggle("done", i < cur); });
    }

    function loop(now) {
        p += (target - p) * 0.12; // suavização
        draw(now);
        if (visible) requestAnimationFrame(loop); else running = false;
    }

    function start() {
        if (!running) { running = true; requestAnimationFrame(loop); }
    }

    function onScroll() {
        const r = sec.getBoundingClientRect(), total = sec.offsetHeight - innerHeight;
        target = total > 0 ? clamp(-r.top / total) : 1;
    }

    if (reduce) {
        // Sem animação: mostra a cena pronta, com o sol e a economia final.
        p = 1;
        draw(0);
        counter.classList.add("show");
        steps.forEach((li) => { li.classList.remove("done"); li.classList.add("active"); });
        return;
    }

    // Só anima enquanto a seção está na tela (economiza bateria no celular)
    new IntersectionObserver((entries) => {
        visible = entries[0].isIntersecting;
        if (visible) { onScroll(); start(); }
    }).observe(sec);

    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    onScroll();
    p = target;
    draw(performance.now());
})();
