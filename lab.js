// --- Ultra Fidelity Visual Engines + Procedural Chemistry ---

class ParticleEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.loop();
    }

    resize() {
        this.canvas.width = this.canvas.parentElement.clientWidth;
        this.canvas.height = this.canvas.parentElement.clientHeight;
    }

    spawn(rect, type) {
        const canvasRect = this.canvas.getBoundingClientRect();
        const cx = (rect.left - canvasRect.left) + rect.width / 2;
        const cy = (rect.top - canvasRect.top) + rect.height * 0.6;
        let count = 20; let speed = 2;

        if (type === 'fire') count = 40;
        if (type === 'explosion') count = 250;
        if (type === 'bubbles') count = 10;
        if (type === 'steam') count = 15;

        for (let i = 0; i < count; i++) {
            let p = {
                x: cx + (Math.random() - 0.5) * 40,
                y: cy,
                vx: (Math.random() - 0.5) * speed,
                vy: -Math.random() * speed - 1,
                life: 60 + Math.random() * 40,
                maxLife: 100,
                size: Math.random() * 5 + 2,
                type: type,
                color: null
            };

            if (type === 'fire') {
                const hue = 10 + Math.random() * 40;
                p.color = `hsla(${hue}, 100%, 60%, `;
                p.decay = 0.94;
                p.vy *= 2.5;
                p.x = cx + (Math.random() - 0.5) * 20;
            } else if (type === 'smoke' || type === 'steam') {
                const lightness = type === 'steam' ? 90 : 60;
                p.color = `hsla(0, 0%, ${lightness}%, `;
                p.decay = 0.995;
                p.size *= 3;
                p.vy *= 0.5;
            } else if (type === 'bubbles') {
                p.color = `hsla(190, 80%, 90%, `;
                p.decay = 1;
                p.vx *= 0.2;
                p.size = Math.random() * 3 + 1;
                p.y += 40;
            } else if (type === 'explosion') {
                const hue = Math.random() * 50;
                p.color = `hsla(${hue}, 100%, 70%, `;
                p.decay = 0.93;
                p.vy = (Math.random() - 0.5) * speed * 4;
            }
            this.particles.push(p);
        }
    }

    loop() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.globalCompositeOperation = 'screen';

        for (let i = this.particles.length - 1; i >= 0; i--) {
            let p = this.particles[i];
            p.x += p.vx; p.y += p.vy;

            if (p.type === 'fire') {
                p.size *= p.decay;
                p.vx += (Math.random() - 0.5) * 0.2;
            } else if (p.type === 'explosion') {
                p.vx *= 0.95; p.vy *= 0.95; p.vy += 0.1;
            } else if (p.type === 'bubbles') {
                p.vx = Math.sin(p.y * 0.1) * 0.5;
                if (p.y < 0) p.life = 0;
            }

            p.life--;
            let alpha = p.life / p.maxLife;
            if (p.type === 'fire') alpha *= alpha;

            this.ctx.fillStyle = p.color + alpha + ')';
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, Math.max(0, p.size), 0, Math.PI * 2);
            this.ctx.fill();

            if (p.life <= 0 || p.size < 0.1) this.particles.splice(i, 1);
        }
        this.ctx.globalCompositeOperation = 'source-over';
        requestAnimationFrame(() => this.loop());
    }
}

class FluidSimulator {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.fillLevel = 0; this.targetFill = 0;
        this.color = '#89b4fa';
        this.time = 0;
        this.turbulence = 0; this.boil = 0;
        this.nodes = []; this.nodeCount = 20;
        for (let i = 0; i < this.nodeCount; i++) this.nodes.push(0);
        this.resize(); this.loop();
    }
    resize() {
        this.width = this.canvas.width = this.canvas.clientWidth;
        this.height = this.canvas.height = this.canvas.clientHeight;
    }
    update(dt) {
        this.time += dt;
        this.fillLevel += (this.targetFill - this.fillLevel) * 0.05;
        if (this.fillLevel < 0.1) return;
        const baseAmp = 0.5 + this.turbulence * 0.2;
        const waveSpeed = 0.02 + this.turbulence * 0.05;
        for (let i = 0; i < this.nodeCount; i++) {
            let y = Math.sin(i * 0.6 + this.time * waveSpeed) * baseAmp;
            y += Math.sin(i * 0.3 - this.time * waveSpeed * 1.5) * baseAmp * 0.5;
            if (this.boil > 20) y += (Math.random() - 0.5) * (this.boil / 30);
            this.nodes[i] = y;
        }
    }
    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        if (this.fillLevel < 1) return;
        const h = this.height; const w = this.width;
        const liquidY = h - (this.fillLevel / 100) * h;
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath(); this.ctx.moveTo(0, h);
        const step = w / (this.nodeCount - 1);
        for (let i = 0; i < this.nodeCount; i++) { this.ctx.lineTo(i * step, liquidY + this.nodes[i]); }
        this.ctx.lineTo(w, h); this.ctx.lineTo(0, h);
        this.ctx.shadowBlur = 15; this.ctx.shadowColor = this.color;
        this.ctx.fill(); this.ctx.shadowBlur = 0;
        if (this.boil > 20) {
            this.ctx.fillStyle = 'rgba(255,255,255,0.3)';
            const bubbleCount = Math.floor(this.boil / 25);
            for (let i = 0; i < bubbleCount; i++) {
                if (Math.random() > 0.95) {
                    const bx = Math.random() * w;
                    const by = liquidY + Math.random() * (h - liquidY);
                    const bz = Math.random() * 2 + 1;
                    this.ctx.beginPath();
                    this.ctx.arc(bx, by, bz, 0, Math.PI * 2);
                    this.ctx.fill();
                }
            }
        }
    }
    loop() { this.update(1); this.draw(); requestAnimationFrame(() => this.loop()); }
    setColor(hex) { this.color = hex; }
}

class LabController {
    constructor() {
        this.inventory = document.getElementById('chemical-inventory');
        this.autoList = document.getElementById('auto-functions');
        this.vessel = document.getElementById('main-vessel');
        this.heatSlider = document.getElementById('heat-slider');
        this.stirSlider = document.getElementById('stir-slider');
        this.tempDisplay = document.getElementById('temp-display');
        this.coil = document.getElementById('heater-coil');

        this.contents = [];
        this.temperature = 20;

        this.particles = new ParticleEngine('particle-overlay');
        this.fluid = new FluidSimulator('fluid-canvas');

        this.init();
    }

    init() {
        this.populateInventory();
        this.populateAutoRuns();
        this.setupInteractions();
        this.runHeatLoop();
        this.setupItemClick();
    }

    setupItemClick() {
        this.inventory.addEventListener('click', (e) => {
            const item = e.target.closest('.chem-item');
            if (item && item.dataset.id) this.addChemical(item.dataset.id);
        });
    }

    populateInventory() {
        this.inventory.innerHTML = '';
        const sorted = Object.keys(CHEMICALS).sort();
        for (let key of sorted) {
            const chem = CHEMICALS[key];
            const div = document.createElement('div');
            div.className = 'chem-item';
            div.draggable = true;
            div.dataset.id = key;
            div.innerHTML = `
                <div class="chem-color" style="background: ${chem.color}"></div>
                <div class="chem-name">${chem.name}</div>
            `;
            div.addEventListener('dragstart', (e) => e.dataTransfer.setData('chem', key));
            this.inventory.appendChild(div);
        }
    }

    populateAutoRuns() {
        this.autoList.innerHTML = '';
        EXPERIMENTS.forEach(exp => {
            const btn = document.createElement('button');
            btn.className = 'btn';
            btn.style.width = '100%';
            btn.style.marginBottom = '10px';
            btn.style.textAlign = 'left';
            btn.innerText = `Auto: ${exp.name}`;
            btn.onclick = () => this.runAutoSequence(exp);
            this.autoList.appendChild(btn);
        });
    }

    setupInteractions() {
        const stage = document.querySelector('.center-stage');
        stage.addEventListener('dragover', (e) => e.preventDefault());
        stage.addEventListener('drop', (e) => {
            e.preventDefault();
            const chemKey = e.dataTransfer.getData('chem');
            if (chemKey) this.addChemical(chemKey);
        });

        document.getElementById('reset-btn').onclick = () => this.resetVessel();
        document.getElementById('filter-btn').onclick = () => {
            this.showToast("Filtrare...", "info");
            const oldFill = this.fluid.targetFill;
            this.fluid.targetFill = 0;
            setTimeout(() => {
                this.contents = this.contents.filter(c => CHEMICALS[c].state !== 'solid' && CHEMICALS[c].state !== 'powder');
                this.fluid.targetFill = this.contents.length * 10;
                if (this.contents.length === 0) this.fluid.targetFill = 0;
                this.recalculateColor();
                this.showToast("Solide eliminate.", "success");
            }, 1200);
        };
    }

    addChemical(key) {
        if (!CHEMICALS[key]) return;
        this.contents.push(key);
        this.showToast(`Adăugat: ${CHEMICALS[key].name}`, "info");

        this.updateVisuals();
        this.recalculateColor();
        this.checkReactions();

        this.fluid.turbulence += 5;
        setTimeout(() => this.fluid.turbulence -= 5, 400);
    }

    recalculateColor() {
        if (this.contents.length === 0) return;
        let r = 0, g = 0, b = 0, count = 0;
        this.contents.forEach(key => {
            const hex = CHEMICALS[key].color;
            if (hex.length === 7) {
                r += parseInt(hex.substring(1, 3), 16);
                g += parseInt(hex.substring(3, 5), 16);
                b += parseInt(hex.substring(5, 7), 16);
                count++;
            }
        });
        if (count > 0) {
            r = Math.floor(r / count); g = Math.floor(g / count); b = Math.floor(b / count);
            this.fluid.setColor(`rgb(${r},${g},${b})`);
        }
    }

    updateVisuals() {
        if (this.contents.length === 0) {
            this.fluid.targetFill = 0; return;
        }
        this.fluid.targetFill = Math.min(this.contents.length * 10, 95);
    }

    runHeatLoop() {
        setInterval(() => {
            const targetHeat = parseInt(this.heatSlider.value);
            const targetTemp = targetHeat * 5 + 20;
            const stirVal = parseInt(this.stirSlider.value);

            if (this.temperature < targetTemp) this.temperature += (targetTemp - this.temperature) * 0.05;
            if (this.temperature > targetTemp) this.temperature -= 1;

            const boilIntensity = Math.max(0, this.temperature - 90);
            this.fluid.boil = boilIntensity;
            this.fluid.turbulence = (stirVal / 10) + (boilIntensity / 20);

            this.tempDisplay.innerText = `${Math.floor(this.temperature)}°C`;
            if (this.temperature > 50) {
                this.coil.classList.add('on');
                this.coil.style.opacity = (this.temperature / 400);
            } else {
                this.coil.classList.remove('on');
            }
            this.checkReactions();
        }, 100);
    }

    checkReactions() {
        const counts = {};
        const tags = new Set();
        const chemicals = [];

        this.contents.forEach(k => {
            counts[k] = (counts[k] || 0) + 1;
            const c = CHEMICALS[k];
            chemicals.push(c);
            if (c.tags) c.tags.forEach(t => tags.add(t));
        });

        for (let exp of RECIPES) {
            const inputsMet = exp.inputs.every(i => counts[i] > 0);
            if (!inputsMet) continue;
            if (exp.conditions.heat && this.temperature < 100) continue;
            this.processResult(exp);
            return;
        }

        const rect = this.vessel.getBoundingClientRect();

        if (counts['sodium'] && counts['water']) {
            this.processProcedural("Explozie Sodiu!", "sodium", "water", "naoh", "explosion");
            return;
        }

        if (tags.has('acid') && tags.has('base')) {
            const acid = chemicals.find(c => c.tags.includes('acid'));
            const base = chemicals.find(c => c.tags.includes('base'));
            if (acid && base) {
                this.showToast(`Neutralizare: ${acid.name} + ${base.name}`, "success");
                this.replaceChemicals([acid.id, base.id], "salt_water");
                this.temperature += 40;
                this.particles.spawn(rect, 'steam');
                return;
            }
        }

        if (tags.has('flammable')) {
            const fuel = chemicals.find(c => c.tags.includes('flammable'));
            const flashPoint = fuel.flash_point || 200;
            if (this.temperature > flashPoint) {
                this.showToast(`${fuel.name} a luat foc!`, "warning");
                this.replaceChemicals([fuel.id], "ash");
                this.temperature += 100;
                this.particles.spawn(rect, 'fire');
                this.particles.spawn(rect, 'smoke');
                return;
            }
        }

        if (this.temperature > 110 && counts['water']) {
            if (Math.random() > 0.8) {
                this.removeOne('water');
                this.particles.spawn(rect, 'steam');
            }
        }
    }

    processProcedural(msg, input1, input2, output, visual) {
        this.showToast(msg, "success");
        this.replaceChemicals([input1, input2], output);
        const rect = this.vessel.getBoundingClientRect();
        this.particles.spawn(rect, visual);
        if (visual === 'explosion') {
            this.vessel.classList.add('shake');
            setTimeout(() => this.vessel.classList.remove('shake'), 500);
        }
    }

    replaceChemicals(targets, result) {
        targets.forEach(t => {
            const idx = this.contents.indexOf(t);
            if (idx > -1) this.contents.splice(idx, 1);
        });
        this.contents.push(result);
        this.updateVisuals();
        this.recalculateColor();
    }

    removeOne(key) {
        const idx = this.contents.indexOf(key);
        if (idx > -1) this.contents.splice(idx, 1);
        this.updateVisuals();
    }

    processResult(exp) {
        this.contents = [exp.output];
        this.updateVisuals();
        this.recalculateColor();

        const rect = this.vessel.getBoundingClientRect();
        if (exp.visual_type) {
            this.particles.spawn(rect, exp.visual_type);
        }

        if (exp.visual_type === 'explosion') {
            this.vessel.classList.add('shake');
            setTimeout(() => this.vessel.classList.remove('shake'), 500);
            this.resetVessel();
        } else {
            this.showResultOverlay(exp);
        }
    }

    showResultOverlay(exp) {
        const overlay = document.getElementById('result-overlay');
        const title = document.getElementById('result-title');
        const desc = document.getElementById('result-desc');
        const product = CHEMICALS[exp.output];

        title.innerText = "Reacție Reușită!";
        desc.innerText = `${exp.message}\n\nRezultat: ${product ? product.name : exp.output}`;
        overlay.classList.remove('hidden');
    }

    resetVessel() {
        this.contents = [];
        this.updateVisuals();
        this.temperature = 20;
        this.heatSlider.value = 0;
        this.stirSlider.value = 0;
        this.fluid.boil = 0;
        this.fluid.turbulence = 0;
        document.getElementById('result-overlay').classList.add('hidden');
        this.showToast("Vas curățat.", "info");
    }

    showToast(msg, type) {
        const container = document.getElementById('toast-container');
        const existing = Array.from(container.children).find(t => t.dataset.msg === msg);

        if (existing) {
            let count = parseInt(existing.dataset.count) + 1;
            existing.dataset.count = count;
            existing.innerHTML = `${msg} <span class="toast-count">x${count}</span>`;

            existing.classList.remove('pop');
            void existing.offsetWidth; // trigger reflow
            existing.classList.add('pop');

            clearTimeout(existing.timeoutId);
            existing.timeoutId = setTimeout(() => this.removeToast(existing), 3000);
            return;
        }

        // --- SINGLE TOAST MODE ---
        // Remove ALL other toasts to prevent stacking "one under another"
        Array.from(container.children).forEach(t => t.remove());

        const toast = document.createElement('div');
        toast.className = 'toast pop';
        toast.dataset.msg = msg;
        toast.dataset.count = 1;
        toast.style.borderLeftColor = type === 'success' ? '#69f0ae' : (type === 'warning' ? '#ff7675' : '#64b5f6');
        toast.innerText = msg;

        container.appendChild(toast);
        toast.timeoutId = setTimeout(() => this.removeToast(toast), 3000);
    }

    removeToast(t) {
        t.style.opacity = '0';
        setTimeout(() => t.remove(), 300);
    }

    async runAutoSequence(exp) {
        this.resetVessel();
        this.showToast(`AUTO: ${exp.name}`, "info");
        await this.wait(500);
        for (let chem of exp.inputs) {
            this.addChemical(chem); await this.wait(800);
        }
        if (exp.conditions.heat) {
            this.showToast("Se încălzește...", "info");
            let i = 0;
            const heatUp = setInterval(() => {
                i += 5; this.heatSlider.value = i;
                if (i >= 50) clearInterval(heatUp);
            }, 50);
            await this.wait(2500);
        }
    }
    wait(ms) { return new Promise(r => setTimeout(r, ms)); }
}

window.lab = new LabController();
