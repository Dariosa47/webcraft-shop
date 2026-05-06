"use client";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

const translations = {
  hr: {
    brand: "KrpaDevelopment",
    about: "O meni",
    shop: "Shop",
    pricing: "Cijene",
    contact: "Kontakt",
    heroBadge: "GOTOVI WEB TEMPLATE-I + ADMIN PANEL",
    heroTitle: "Gotove web stranice koje sam uređuješ",
    heroText: "Nudim gotove template web stranica koji se u samo par minuta preprave i ne zahtijevaju nikakvo predznanje programiranja.",
    primary: "Pogledaj template",
    secondary: "Kontaktiraj me",
    latest: "Najnoviji template-i",
    latestText: "Zadnji dodani proizvodi iz shopa.",
    latestBadge: "NAJNOVIJI TEMPLATE",
    openProduct: "Otvori proizvod",
    aboutTitle: "Što nudim?",
    aboutText: "Izrađujem moderne web stranice za male biznise. Klijent dobije gotov dizajn, admin panel i mogućnost da sam mijenja tekstove, slike, cijene, galeriju i kontakt bez programiranja.",
    pricingTitle: "Cijene",
    templatePriceTitle: "Gotovi template-i",
    templatePrice: "100€ – 200€",
    templatePriceText: "Gotova web stranica prilagođena tvojem biznisu.",
    customPriceTitle: "Custom stranica",
    customPrice: "500€+",
    customPriceText: "Poseban dizajn i funkcionalnosti izrađene po dogovoru.",
    hostingPriceTitle: "Hosting + support",
    hostingPrice: "30€/mj",
    hostingPriceText: "Deploy, hosting, tehničko održavanje, support i manje izmjene. Sve mi riješimo za tebe.",
    contactTitle: "Pokrenimo tvoj web",
    contactText: "Javi mi se za demo, cijenu ili dogovor oko template-a.",
    whatsapp: "WhatsApp",
    email: "Email",
    footer: "Gotovi web template-i za male biznise",
    featureAdminTitle: "Admin panel",
    featureAdminText: "Klijent sam mijenja tekst, slike, cijene, galeriju i kontakt.",
    featureResponsiveTitle: "Responsive",
    featureResponsiveText: "Stranica radi na mobitelu, tabletu i računalu.",
    featureStyleTitle: "Boje i stil",
    featureStyleText: "Moguće je mijenjati boje, slike i sadržaj stranice.",
    featureWhatsappTitle: "WhatsApp",
    featureWhatsappText: "Direktan kontakt i rezervacije preko telefona ili WhatsAppa.",
    adminPanel: "Admin panel",
    services: "Usluge"
  },
  en: {
    brand: "KrpaDevelopment",
    about: "About",
    shop: "Shop",
    pricing: "Pricing",
    contact: "Contact",
    heroBadge: "READY-MADE WEBSITE TEMPLATES + ADMIN PANEL",
    heroTitle: "Ready-made websites you can edit yourself",
    heroText: "I offer ready-made website templates that can be customized in just a few minutes and require no programming knowledge.",
    primary: "View templates",
    secondary: "Contact me",
    latest: "Latest templates",
    latestText: "Newest products from the shop.",
    latestBadge: "LATEST TEMPLATE",
    openProduct: "Open product",
    aboutTitle: "What do I offer?",
    aboutText: "I build modern websites for small businesses. The client gets a finished design, admin panel and can edit texts, images, prices, gallery and contact details without programming.",
    pricingTitle: "Pricing",
    templatePriceTitle: "Ready-made templates",
    templatePrice: "100€ – 200€",
    templatePriceText: "A ready-made website customized for your business.",
    customPriceTitle: "Custom website",
    customPrice: "500€+",
    customPriceText: "Custom design and functionality built by agreement.",
    hostingPriceTitle: "Hosting + support",
    hostingPrice: "30€/mo",
    hostingPriceText: "Deploy, hosting, technical maintenance, support and smaller changes. We handle everything for you.",
    contactTitle: "Let’s launch your website",
    contactText: "Contact me for a demo, pricing or template agreement.",
    whatsapp: "WhatsApp",
    email: "Email",
    footer: "Ready-made website templates for small businesses",
    featureAdminTitle: "Admin panel",
    featureAdminText: "The client can edit text, images, prices, gallery and contact details.",
    featureResponsiveTitle: "Responsive",
    featureResponsiveText: "The website works on mobile, tablet and desktop.",
    featureStyleTitle: "Colors and style",
    featureStyleText: "Colors, images and website content can be changed.",
    featureWhatsappTitle: "WhatsApp",
    featureWhatsappText: "Direct contact and bookings via phone or WhatsApp.",
    adminPanel: "Admin panel",
    services: "Services"
  },
  de: {
    brand: "KrpaDevelopment",
    about: "Über mich",
    shop: "Shop",
    pricing: "Preise",
    contact: "Kontakt",
    heroBadge: "FERTIGE WEBSITE-TEMPLATES + ADMIN PANEL",
    heroTitle: "Fertige Webseiten die du selbst bearbeiten kannst",
    heroText: "Ich biete fertige Website-Templates an, die in wenigen Minuten angepasst werden können und keine Programmierkenntnisse benötigen.",
    primary: "Templates ansehen",
    secondary: "Kontakt",
    latest: "Neueste Templates",
    latestText: "Die neuesten Produkte aus dem Shop.",
    latestBadge: "NEUESTES TEMPLATE",
    openProduct: "Produkt öffnen",
    aboutTitle: "Was biete ich an?",
    aboutText: "Ich erstelle moderne Webseiten für kleine Unternehmen. Der Kunde bekommt ein fertiges Design, ein Admin Panel und kann Texte, Bilder, Preise, Galerie und Kontakt selbst ändern.",
    pricingTitle: "Preise",
    templatePriceTitle: "Fertige Templates",
    templatePrice: "100€ – 200€",
    templatePriceText: "Eine fertige Website, angepasst an dein Unternehmen.",
    customPriceTitle: "Custom Website",
    customPrice: "500€+",
    customPriceText: "Individuelles Design und Funktionen nach Absprache.",
    hostingPriceTitle: "Hosting + Support",
    hostingPrice: "30€/Monat",
    hostingPriceText: "Deploy, Hosting, technische Wartung, Support und kleinere Änderungen. Wir übernehmen alles für dich.",
    contactTitle: "Starten wir deine Website",
    contactText: "Melde dich für Demo, Preis oder Template-Abstimmung.",
    whatsapp: "WhatsApp",
    email: "E-Mail",
    footer: "Fertige Website-Templates für kleine Unternehmen",
    featureAdminTitle: "Admin Panel",
    featureAdminText: "Der Kunde kann Texte, Bilder, Preise, Galerie und Kontakt selbst ändern.",
    featureResponsiveTitle: "Responsive",
    featureResponsiveText: "Die Website funktioniert auf Handy, Tablet und Desktop.",
    featureStyleTitle: "Farben und Stil",
    featureStyleText: "Farben, Bilder und Website-Inhalte können geändert werden.",
    featureWhatsappTitle: "WhatsApp",
    featureWhatsappText: "Direkter Kontakt und Buchungen per Telefon oder WhatsApp.",
    adminPanel: "Admin Panel",
    services: "Leistungen"
  }
};

function productText(product, field, lang) {
  const key = `${field}_${lang}`;
  return product?.[key] || product?.[field] || "";
}

export default function Home() {
  const [lang, setLang] = useState("hr");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const t = translations[lang];

  useEffect(() => {
    async function loadProducts() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("active", true)
        .order("created_at", { ascending: false })
        .limit(2);

      if (!error) setProducts(data || []);
    }

    loadProducts();
  }, []);

  const latestProduct = products[0];

  return (
    <main>
      <style>{styles}</style>

      <div className="page">
        <Nav t={t} lang={lang} setLang={setLang} drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />

        <section className="hero">
          <div>
            <div className="badge">✨ {t.heroBadge}</div>
            <h1>{t.heroTitle}</h1>
            <p>{t.heroText}</p>

            <div className="actions">
              <a href="/shop" className="primaryBtn">{t.primary}</a>
              <a href="#contact" className="secondaryBtn">{t.secondary}</a>
            </div>
          </div>

          <a href={latestProduct ? `/shop/${latestProduct.slug}` : "/shop"} className="mock">
            <div className="mockTop"><span></span><span></span><span></span></div>

            <div
              className="mockHero"
            style={{
  backgroundImage: latestProduct
    ? `linear-gradient(rgba(0,0,0,.45), rgba(0,0,0,.45)), url("${latestProduct.cover_image}")`
    : undefined,
  backgroundSize: "cover",
  backgroundPosition: "center"
}}
            >
              <p>{latestProduct ? t.latestBadge : "SALON TEMPLATE"}</p>
              <h2>{latestProduct ? productText(latestProduct, "title", lang) : t.adminPanel}</h2>
            </div>

            <div className="mockCards">
              <div>{latestProduct ? latestProduct.price : t.services}</div>
              <div>{t.adminPanel}</div>
              <div>{t.openProduct}</div>
            </div>
          </a>
        </section>

        <section id="about" className="section">
          <h2>{t.aboutTitle}</h2>
          <p>{t.aboutText}</p>

          <div className="features">
            <Card icon="🛠️" title={t.featureAdminTitle} text={t.featureAdminText} />
            <Card icon="📱" title={t.featureResponsiveTitle} text={t.featureResponsiveText} />
            <Card icon="🎨" title={t.featureStyleTitle} text={t.featureStyleText} />
            <Card icon="💬" title={t.featureWhatsappTitle} text={t.featureWhatsappText} />
          </div>
        </section>

        <section className="section">
          <div className="sectionHeader">
            <div>
              <h2>{t.latest}</h2>
              <p>{t.latestText}</p>
            </div>
            <a href="/shop" className="secondaryBtn">Shop →</a>
          </div>

          <div className="products">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} lang={lang} />
            ))}
          </div>
        </section>

        <section id="pricing" className="section">
          <h2>{t.pricingTitle}</h2>

          <div className="pricing">
            <div className="priceBox">
              <h3>{t.templatePriceTitle}</h3>
              <strong>{t.templatePrice}</strong>
              <p>{t.templatePriceText}</p>
            </div>

            <div className="priceBox">
              <h3>{t.customPriceTitle}</h3>
              <strong>{t.customPrice}</strong>
              <p>{t.customPriceText}</p>
            </div>

            <div className="priceBox">
              <h3>{t.hostingPriceTitle}</h3>
              <strong>{t.hostingPrice}</strong>
              <p>{t.hostingPriceText}</p>
            </div>
          </div>
        </section>

        <section id="contact" className="section">
          <div className="contactBox">
            <h2>{t.contactTitle}</h2>
            <p>{t.contactText}</p>

            <div className="actions center">
              <a href="https://wa.me/385994157416" target="_blank" className="primaryBtn">{t.whatsapp}</a>
              <a href="mailto:krpadevelopment@gmail.com" className="secondaryBtn">{t.email}</a>
            </div>
          </div>
        </section>

        <footer>© {new Date().getFullYear()} {t.brand} — {t.footer}</footer>
      </div>
    </main>
  );
}

function Nav({ t, lang, setLang, drawerOpen, setDrawerOpen }) {
  return (
    <>
      <nav className="nav">
        <a href="/" className="brand"><span>⚡</span> {t.brand}</a>

        <div className="desktopNav">
          <a href="/#about">{t.about}</a>
          <a href="/shop">{t.shop}</a>
          <a href="/#pricing">{t.pricing}</a>
          <a href="/#contact">{t.contact}</a>
          <Lang lang={lang} setLang={setLang} />
        </div>

        <button className="hamburger" onClick={() => setDrawerOpen(true)}>☰</button>
      </nav>

      <div className={`backdrop ${drawerOpen ? "open" : ""}`} onClick={() => setDrawerOpen(false)} />

      <aside className={`drawer ${drawerOpen ? "open" : ""}`}>
        <div className="drawerTop">
          <strong>{t.brand}</strong>
          <button onClick={() => setDrawerOpen(false)}>✕</button>
        </div>

        <a onClick={() => setDrawerOpen(false)} href="/#about">{t.about}</a>
        <a onClick={() => setDrawerOpen(false)} href="/shop">{t.shop}</a>
        <a onClick={() => setDrawerOpen(false)} href="/#pricing">{t.pricing}</a>
        <a onClick={() => setDrawerOpen(false)} href="/#contact">{t.contact}</a>

        <div style={{ marginTop: 20 }}>
          <Lang lang={lang} setLang={setLang} />
        </div>
      </aside>
    </>
  );
}

function Lang({ lang, setLang }) {
  return (
    <div className="lang">
      {["hr", "en", "de"].map((l) => (
        <button key={l} onClick={() => setLang(l)} className={lang === l ? "active" : ""}>
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

function Card({ icon, title, text }) {
  return (
    <div className="card">
      <div className="icon">{icon}</div>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

function ProductCard({ product, lang }) {
  return (
    <a className="productCard" href={`/shop/${product.slug}`}>
      <img src={product.cover_image} alt={productText(product, "title", lang)} />
      <div>
        <h3>{productText(product, "title", lang)}</h3>
        <p>{productText(product, "short_description", lang)}</p>
        <strong>{product.price}</strong>
      </div>
    </a>
  );
}

const styles = `
* { box-sizing: border-box; }
body { margin: 0; font-family: Arial, sans-serif; background: #070a13; color: white; overflow-x: hidden; }
html { scroll-behavior: smooth; }
a { color: inherit; }

.page {
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(59,130,246,.22), transparent 35%),
    radial-gradient(circle at top right, rgba(168,85,247,.20), transparent 30%),
    #070a13;
}

.nav {
  height: 82px;
  padding: 0 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(7,10,19,.75);
  backdrop-filter: blur(18px);
  border-bottom: 1px solid rgba(255,255,255,.08);
}

.brand {
  text-decoration: none;
  font-size: 21px;
  font-weight: 900;
  display: flex;
  gap: 10px;
  align-items: center;
}

.brand span {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #3b82f6, #a855f7);
}

.desktopNav {
  display: flex;
  align-items: center;
  gap: 26px;
  color: #cbd5e1;
  font-size: 14px;
}

.desktopNav a { text-decoration: none; }
.desktopNav a:hover { color: white; }

.lang {
  display: flex;
  gap: 6px;
  background: rgba(255,255,255,.08);
  border: 1px solid rgba(255,255,255,.1);
  padding: 5px;
  border-radius: 999px;
}

.lang button {
  border: none;
  background: transparent;
  color: #cbd5e1;
  border-radius: 999px;
  padding: 7px 10px;
  cursor: pointer;
  font-weight: 800;
}

.lang button.active {
  background: white;
  color: #070a13;
}

.hamburger {
  display: none;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,.12);
  background: rgba(255,255,255,.08);
  color: white;
  font-size: 24px;
}

.backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.55);
  opacity: 0;
  pointer-events: none;
  z-index: 80;
  transition: .25s;
}

.backdrop.open {
  opacity: 1;
  pointer-events: auto;
}

.drawer {
  position: fixed;
  inset: 0 auto 0 0;
  width: 310px;
  max-width: 86vw;
  background: #0f172a;
  z-index: 90;
  padding: 24px;
  transform: translateX(-105%);
  transition: .35s ease;
  border-right: 1px solid rgba(255,255,255,.1);
}

.drawer.open { transform: translateX(0); }

.drawerTop {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.drawerTop button {
  background: rgba(255,255,255,.08);
  border: 1px solid rgba(255,255,255,.1);
  color: white;
  border-radius: 12px;
  padding: 10px 14px;
}

.drawer a {
  display: block;
  text-decoration: none;
  padding: 16px 0;
  border-bottom: 1px solid rgba(255,255,255,.08);
  font-weight: 800;
}

.hero {
  min-height: calc(100vh - 82px);
  max-width: 1300px;
  margin: auto;
  padding: 80px 64px;
  display: grid;
  grid-template-columns: 1.05fr .95fr;
  gap: 50px;
  align-items: center;
}

.badge {
  display: inline-flex;
  padding: 10px 14px;
  border-radius: 999px;
  background: rgba(59,130,246,.14);
  border: 1px solid rgba(59,130,246,.3);
  color: #bfdbfe;
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 1px;
  margin-bottom: 22px;
}

.hero h1 {
  font-size: clamp(46px, 7vw, 86px);
  line-height: .95;
  letter-spacing: -4px;
  margin: 0 0 24px;
  background: linear-gradient(135deg, white, #93c5fd, #c084fc);
  -webkit-background-clip: text;
  color: transparent;
}

.hero p, .section p {
  color: #cbd5e1;
  font-size: 18px;
  line-height: 1.7;
}

.actions {
  display: flex;
  gap: 14px;
  margin-top: 32px;
  flex-wrap: wrap;
}

.actions.center { justify-content: center; }

.primaryBtn, .secondaryBtn {
  padding: 15px 22px;
  border-radius: 999px;
  text-decoration: none;
  font-weight: 900;
  transition: .25s;
}

.primaryBtn {
  background: linear-gradient(135deg, #3b82f6, #a855f7);
  box-shadow: 0 20px 45px rgba(59,130,246,.25);
}

.secondaryBtn {
  background: rgba(255,255,255,.06);
  border: 1px solid rgba(255,255,255,.14);
}

.primaryBtn:hover, .secondaryBtn:hover {
  transform: translateY(-3px);
}

.mock {
  min-height: 540px;
  border-radius: 34px;
  padding: 20px;
  background: linear-gradient(145deg, rgba(255,255,255,.13), rgba(255,255,255,.04));
  border: 1px solid rgba(255,255,255,.12);
  box-shadow: 0 30px 100px rgba(0,0,0,.45);
  overflow: hidden;
  animation: bounceProduct 2.8s ease-in-out infinite;
  text-decoration: none;
  color: inherit;
  display: block;
  cursor: pointer;
}

.mockTop {
  height: 44px;
  background: #e5e7eb;
  border-radius: 22px 22px 0 0;
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 0 16px;
}

.mockTop span {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: #94a3b8;
}

.mockHero {
  height: 250px;
  background:
    linear-gradient(rgba(0,0,0,.45), rgba(0,0,0,.45)),
    url("https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80");
  background-size: cover;
  background-position: center;
  padding: 28px;
}

.mockHero p { color: #bfdbfe; font-weight: 900; letter-spacing: 3px; }
.mockHero h2 { font-size: 42px; margin: 20px 0; }

.mockCards {
  background: #f8fafc;
  color: #111827;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  padding: 22px;
  border-radius: 0 0 22px 22px;
}

.mockCards div {
  min-height: 95px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 16px;
  font-weight: 900;
}

.section {
  max-width: 1300px;
  margin: auto;
  padding: 105px 64px;
}

.section h2 {
  font-size: clamp(34px, 5vw, 58px);
  letter-spacing: -2px;
  margin: 0 0 18px;
}

.sectionHeader {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 20px;
}

.features {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
  margin-top: 42px;
}

.card, .productCard, .priceBox {
  background: rgba(255,255,255,.07);
  border: 1px solid rgba(255,255,255,.1);
  border-radius: 24px;
  padding: 24px;
  transition: .25s;
}

.card:hover, .productCard:hover, .priceBox:hover {
  transform: translateY(-6px);
  background: rgba(255,255,255,.1);
}

.icon {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  background: linear-gradient(135deg, #3b82f6, #a855f7);
  display: grid;
  place-items: center;
  margin-bottom: 18px;
}

.products {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 22px;
  margin-top: 42px;
}

.productCard {
  text-decoration: none;
  display: block;
  overflow: hidden;
}

.productCard img {
  width: 100%;
  height: 260px;
  border-radius: 18px;
  object-fit: cover;
  margin-bottom: 18px;
}

.productCard strong {
  font-size: 34px;
}

.pricing {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
  margin-top: 42px;
}

.priceBox strong {
  display: block;
  font-size: 48px;
  margin: 12px 0;
}

.contactBox {
  border-radius: 34px;
  padding: 44px;
  background: linear-gradient(135deg, rgba(59,130,246,.18), rgba(168,85,247,.16));
  border: 1px solid rgba(255,255,255,.12);
  text-align: center;
}

footer {
  padding: 34px;
  text-align: center;
  color: #94a3b8;
  border-top: 1px solid rgba(255,255,255,.08);
}

@keyframes bounceProduct {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-16px) scale(1.02); }
}

@media (max-width: 960px) {
  .nav { padding: 0 22px; }
  .desktopNav { display: none; }
  .hamburger { display: block; }
  .hero { grid-template-columns: 1fr; padding: 58px 22px; }
  .mock { min-height: 420px; }
  .section { padding: 76px 22px; }
  .features, .products, .pricing { grid-template-columns: 1fr; }
  .mockCards { grid-template-columns: 1fr; }
  .sectionHeader { flex-direction: column; align-items: start; }
}
`;