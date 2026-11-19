
/* =========================================
   TEMR — INTERACTION LAYER
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const content = window.TEMR_CONTENT;

    const app = document.querySelector("#app");

    const sector = document.body.dataset.sector;
    const page = document.body.dataset.page;

    const isHome = document.body.classList.contains("home-page");

    let language = localStorage.getItem("temr-language") || "it";

    /* =====================================
       LANGUAGE
       ===================================== */

    function setLanguage(lang) {

        language = lang;

        localStorage.setItem("temr-language", lang);

        document.documentElement.lang = lang;

        document.querySelectorAll("[data-i18n]").forEach(element => {

            const path = element.dataset.i18n.split(".");

            let value = content[lang];

            path.forEach(key => {
                value = value?.[key];
            });

            if (typeof value === "string") {
                element.innerHTML = value;
            }

        });

        document.querySelectorAll("[data-current-language]").forEach(el => {
            el.textContent = lang.toUpperCase();
        });

        document.querySelectorAll("[data-next-language]").forEach(el => {
            el.textContent = lang === "it" ? "EN" : "IT";
        });

    }

    function setupLanguageButton() {

        document.querySelectorAll("[data-language-toggle]").forEach(button => {

            button.addEventListener("click", () => {

                const nextLanguage = language === "it" ? "en" : "it";

                setLanguage(nextLanguage);

            });

        });

    }

    /* =====================================
       FOOTER YEAR
       ===================================== */

    document.querySelectorAll("[data-year]").forEach(element => {
        element.textContent = new Date().getFullYear();
    });

    /* =====================================
       HOME PAGE
       ===================================== */

    if (isHome) {

        setLanguage(language);
        setupLanguageButton();

        return;

    }

    /* =====================================
       SECTOR CONFIGURATION
       ===================================== */

    const isSecurity = sector === "security";

    document.body.classList.toggle("security-theme", isSecurity);

    const sectorContent = content[language][sector];

    const pageContent = sectorContent.pages[page];

    if (!pageContent) {
        app.innerHTML = "<h1>Page not found</h1>";
        return;
    }

    /* =====================================
       PAGE RENDERING
       ===================================== */

    function renderPage() {

        const currentContent = content[language][sector];
        const currentPage = currentContent.pages[page];

        const base = "../";
        const homeLink = "index.html";

        const navItems = [
            {
                page: "home",
                label: language === "it" ? "HOME" : "HOME",
                url: "index.html"
            },
            {
                page: "about",
                label: content[language].header.about,
                url: "about.html"
            },
            {
                page: "products",
                label: content[language].header.products,
                url: "products.html"
            },
            {
                page: "contacts",
                label: content[language].header.contacts,
                url: "contacts.html"
            }
        ];

        const nav = navItems.map(item => `
            <a
                href="${item.url}"
                class="${page === item.page ? "active" : ""}"
            >
                ${item.label}
            </a>
        `).join("");

        const features = currentPage.features.map((feature, index) => `
            <article class="feature-card reveal">

                <span class="feature-number">
                    0${index + 1}
                </span>

                <h3>${feature.title}</h3>

                <p>${feature.text}</p>

            </article>
        `).join("");

        const paragraphs = currentPage.sectionText.map(text => `
            <p>${text}</p>
        `).join("");

        const contactSection = page === "contacts" ? `
            <div class="contact-layout">

                <div class="contact-info">

                    <div class="contact-item">
                        <span>EMAIL</span>
                        <p>
                            <a href="mailto:info@temr-srl.it">info@temr-srl.it</a><br>
                            <a href="mailto:commerciale@temr-srl.it">commerciale@temr-srl.it</a>
                        </p>
                    </div>

                    <div class="contact-item">
                        <span>PHONE</span>
                        <p><a href="tel:3348630415">3348630415</a></p>
                    </div>

                    <div class="contact-item">
                        <span>LOCATION</span>
                        <p>ROMA (RM) VIA DEI CASTANI 170 CAP 000171</p>
                    </div>

                </div>

                <form class="contact-form" id="contact-form">

                    <div class="form-group">
                        <label for="name">
                            ${language === "it" ? "Nome" : "Name"}
                        </label>
                        <input id="name" name="name" type="text" required>
                    </div>

                    <div class="form-group">
                        <label for="email">Email</label>
                        <input id="email" name="email" type="email" required>
                    </div>

                    <div class="form-group">
                        <label for="subject">
                            ${language === "it" ? "Oggetto" : "Subject"}
                        </label>
                        <input id="subject" name="subject" type="text" required>
                    </div>

                    <div class="form-group">
                        <label for="message">
                            ${language === "it" ? "Messaggio" : "Message"}
                        </label>
                        <textarea id="message" name="message" rows="5" required></textarea>
                    </div>

                    <div class="form-actions">
                        <button type="button" class="form-submit" data-recipient="info@temr-srl.it">
                            ${language === "it" ? "INVIA A INFO →" : "SEND TO INFO →"}
                        </button>

                        <button type="button" class="form-submit" data-recipient="commerciale@temr-srl.it">
                            ${language === "it" ? "INVIA A COMMERCIALE →" : "SEND TO SALES →"}
                        </button>
                    </div>

                    <p class="form-note" id="form-note" aria-live="polite"></p>
                </form>

            </div>
        ` : "";

        const contentSection = page === "contacts"
            ? contactSection
            : `
                <div class="content-grid">

                    <div>
                        <span class="section-label">
                            ${currentPage.label}
                        </span>

                        <h2 style="margin-top:30px">
                            ${currentPage.sectionTitle}
                        </h2>
                    </div>

                    <div class="content-text">
                        ${paragraphs}
                    </div>

                </div>

                ${page === "home" ? `
                    <div class="image-block reveal"
                         style="margin-top:80px">

                        <img
                            src="${base}assets/img/${sector}-about.jpg"
                            alt="${currentContent.name}"
                            onerror="this.style.display='none'"
                        >

                    </div>
                ` : ""}
            `;

        app.innerHTML = `

            <header class="site-header">

                <a href="${base}index.html" class="brand">
                    <img
                        src="${base}assets/img/logo-temr.png"
                        alt="TEMR S.r.l."
                    >
                </a>

                <nav class="main-nav" id="main-nav">
                    ${nav}
                </nav>

                <div class="header-right">

                    <span class="header-caption">
                        ${currentContent.name}
                    </span>

                    <button
                        class="language-switch"
                        data-language-toggle
                        aria-label="Change language"
                    >
                        <span data-current-language>
                            ${language.toUpperCase()}
                        </span>

                        <span class="language-divider">/</span>

                        <span data-next-language>
                            ${language === "it" ? "EN" : "IT"}
                        </span>

                    </button>

                    <button
                        class="nav-toggle"
                        id="nav-toggle"
                        aria-label="Open navigation"
                        aria-expanded="false"
                        aria-controls="main-nav"
                    >
                        ☰
                    </button>

                </div>

            </header>

            <main class="page-enter">

                <section class="page-hero">

                    <div class="eyebrow">
                        ${currentPage.eyebrow}
                    </div>

                    <h1>${currentPage.title}</h1>

                    <p>${currentPage.description}</p>

                </section>

                <section class="container section-padding">

                    ${contentSection}

                </section>

                ${currentPage.features.length > 0 ? `

                    <section class="container"
                             style="padding-bottom:120px">

                        <div class="feature-grid">
                            ${features}
                        </div>

                    </section>

                ` : ""}

                <section class="division-switch">

                    <div class="container">

                        <a href="${base}${isSecurity ? "infrastructure" : "security"}/index.html">

                            <span class="eyebrow">
                                ${language === "it" ? "SCOPRI ANCHE" : "DISCOVER ALSO"}
                            </span>

                            <h2>
                                ${isSecurity ? "Infrastructure ↗" : "Cybersecurity ↗"}
                            </h2>

                        </a>

                    </div>

                </section>

            </main>

            <footer class="site-footer">

                <img
                    class="footer-logo"
                    src="${base}assets/img/logo-temr.png"
                    alt="TEMR S.r.l."
                >

                <div class="footer-company-details">
                    <div class="footer-detail-stack">
                        <a href="mailto:info@temr-srl.it">info@temr-srl.it</a>
                        <a href="mailto:commerciale@temr-srl.it">commerciale@temr-srl.it</a>
                    </div>
                    <a href="tel:3348630415">3348630415</a>
                    <div class="footer-detail-stack">
                        <span>ROMA (RM) VIA DEI CASTANI 170 CAP 000171</span>
                        <span>P.IVA: 13517171008</span>
                    </div>
                </div>

                <span>
                    ${content[language].footer.rights}
                </span>

                <a href="${base}index.html">
                    TEMR — GROUP ↗
                </a>

            </footer>

        `;

        setupLanguageButton();
        setupMobileMenu();
        setupReveal();
        setupContactForm();

    }

    /* =====================================
       MOBILE MENU
       ===================================== */

    function setupMobileMenu() {

        const toggle = document.querySelector("#nav-toggle");
        const nav = document.querySelector("#main-nav");

        if (!toggle || !nav) return;

        toggle.addEventListener("click", () => {

            const isOpen = nav.classList.toggle("open");

            toggle.setAttribute("aria-expanded", isOpen);

            toggle.textContent = isOpen ? "×" : "☰";

        });

    }

    /* =====================================
       REVEAL ANIMATIONS
       ===================================== */

    function setupReveal() {

        const elements = document.querySelectorAll(".reveal");

        if (!("IntersectionObserver" in window)) {

            elements.forEach(element => {
                element.classList.add("visible");
            });

            return;
        }

        const observer = new IntersectionObserver(entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("visible");

                    observer.unobserve(entry.target);

                }

            });

        }, {
            threshold: 0.12
        });

        elements.forEach(element => observer.observe(element));

    }

    /* =====================================
       CONTACT FORM
       ===================================== */

    function setupContactForm() {

        const form = document.querySelector("#contact-form");

        if (!form) return;

        const buttons = form.querySelectorAll("[data-recipient]");
        const name = form.querySelector("#name");
        const email = form.querySelector("#email");
        const subject = form.querySelector("#subject");
        const message = form.querySelector("#message");
        const note = form.querySelector("#form-note");

        buttons.forEach(button => {
            button.addEventListener("click", () => {
                if (!form.reportValidity()) return;

                const recipient = button.dataset.recipient;
                const mailSubject = encodeURIComponent(subject.value);
                const mailBody = encodeURIComponent(
                    `Nome: ${name.value}\n` +
                    `Email: ${email.value}\n\n` +
                    `${message.value}`
                );

                window.location.href =
                    `mailto:${recipient}?subject=${mailSubject}&body=${mailBody}`;

                form.reset();
                note.textContent = language === "it"
                    ? "Messaggio preparato e modulo azzerato."
                    : "Message prepared and form cleared.";
            });
        });
    }

    /* =====================================
       INITIALIZATION
       ===================================== */

    renderPage();

    /*
     * Re-render when changing language.
     * Language is stored in localStorage.
     */

    document.addEventListener("click", event => {

        const button = event.target.closest("[data-language-toggle]");

        if (!button) return;

        const next = language === "it" ? "en" : "it";

        setTimeout(() => {

            renderPage();

        }, 0);

    });

});
