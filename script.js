document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

async function initApp() {
    try {
        // Fetch all data in parallel
        const [services, testimonials, faq] = await Promise.all([
            fetch('data/services.json').then(res => res.json()),
            fetch('data/testimonials.json').then(res => res.json()),
            fetch('data/faq.json').then(res => res.json())
        ]);

        renderServices(services);
        renderTestimonials(testimonials);
        renderFAQ(faq);
    } catch (error) {
        console.error("Critical: Failed to load intelligence data.", error);
    }

    initCounters();
    initNavbar();
    simulateActiveUsers();
}

// 1. Dynamic Rendering
function renderServices(services) {
    const container = document.getElementById('services-container');
    if (!container) return;
    
    container.innerHTML = services.map(s => `
        <div class="glass-card p-8 rounded-3xl space-y-4 border-b-2 border-transparent hover:border-[#D4AF37]">
            <div class="text-4xl">${s.icon}</div>
            <h4 class="text-xl font-bold text-white">${s.title}</h4>
            <p class="text-sm text-slate-400 leading-relaxed">${s.desc}</p>
        </div>
    `).join('');
}

function renderTestimonials(testimonials) {
    const container = document.getElementById('testimonials-container');
    if (!container) return;

    // Implementation for a testimonial slider would go here
    console.log("Intelligence: Testimonials loaded", testimonials.length);
}

function renderFAQ(faq) {
    const container = document.getElementById('faq-container');
    if (!container) return;

    container.innerHTML = faq.map((f, i) => `
        <div class="glass-card rounded-2xl overflow-hidden">
            <button class="w-full p-6 text-left flex justify-between items-center text-white font-semibold" onclick="toggleFAQ(${i})">
                <span>${f.q}</span>
                <span class="text-[#D4AF37]" id="faq-icon-${i}">+</span>
            </button>
            <div class="hidden px-6 pb-6 text-slate-400 text-sm" id="faq-ans-${i}">
                ${f.a}
            </div>
        </div>
    `).join('');
}

window.toggleFAQ = (i) => {
    const ans = document.getElementById(`faq-ans-${i}`);
    const icon = document.getElementById(`faq-icon-${i}`);
    ans.classList.toggle('hidden');
    icon.textContent = ans.classList.contains('hidden') ? '+' : '-';
};

// 2. Animated Counters
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    const speed = 200;

    const startCounter = (counter) => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const inc = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(updateCount, 15);
            } else {
                counter.innerText = target + (target > 100 ? '+' : '');
            }
        };
        updateCount();
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entries[0].isIntersecting) startCounter(entry.target);
        });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
}

// 3. Navbar Interaction
function initNavbar() {
    const nav = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('bg-[#020609]/95', 'py-4', 'backdrop-blur-md', 'border-b', 'border-white/10');
            nav.classList.remove('bg-transparent', 'py-6');
        } else {
            nav.classList.remove('bg-[#020609]/95', 'py-4', 'backdrop-blur-md', 'border-b', 'border-white/10');
            nav.classList.add('bg-transparent', 'py-6');
        }
    });
}

// 4. Live Simulation (Dashboard Feel)
function simulateActiveUsers() {
    const userCounter = document.getElementById('online-users');
    if (!userCounter) return;
    setInterval(() => {
        const base = 840;
        userCounter.textContent = base + Math.floor(Math.random() * 20);
    }, 3000);
}