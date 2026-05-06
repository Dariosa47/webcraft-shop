"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const translations = {
  hr: {
    brand: "KrpaDevelopment",
    home: "← Home",
    badge: "TEMPLATE SHOP",
    title: "Odaberi web template",
    text: "Gotove web stranice koje se mogu prilagoditi tvom biznisu.",
    empty: "Trenutno nema proizvoda."
  },
  en: {
    brand: "KrpaDevelopment",
    home: "← Home",
    badge: "TEMPLATE SHOP",
    title: "Choose a website template",
    text: "Ready-made websites that can be customized for your business.",
    empty: "No products yet."
  },
  de: {
    brand: "KrpaDevelopment",
    home: "← Home",
    badge: "TEMPLATE SHOP",
    title: "Wähle ein Website-Template",
    text: "Fertige Webseiten, die an dein Unternehmen angepasst werden können.",
    empty: "Noch keine Produkte."
  }
};

function productText(product, field, lang) {
  const key = `${field}_${lang}`;
  return product?.[key] || product?.[field] || "";
}

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [lang, setLang] = useState("hr");
  const t = translations[lang];

  useEffect(() => {
    async function loadProducts() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("active", true)
        .order("created_at", { ascending: false });

      if (!error) setProducts(data || []);
    }

    loadProducts();
  }, []);

  return (
    <main>
      <style>{styles}</style>

      <nav className="nav">
        <a href="/" className="brand">
          {t.brand}
        </a>

        <div className="navRight">
          <div className="lang">
            {["hr", "en", "de"].map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={lang === l ? "active" : ""}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          <a href="/" className="back">
            {t.home}
          </a>
        </div>
      </nav>

      <section className="section">
        <p className="badge">{t.badge}</p>
        <h1>{t.title}</h1>
        <p>{t.text}</p>

        {products.length === 0 && <p>{t.empty}</p>}

        <div className="products">
          {products.map((product) => (
            <a
              className="productCard"
              href={`/shop/${product.slug}?lang=${lang}`}
              key={product.id}
            >
              <img src={product.cover_image} alt={productText(product, "title", lang)} />
              <h2>{productText(product, "title", lang)}</h2>
              <p>{productText(product, "short_description", lang)}</p>
              <strong>{product.price}</strong>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}

const styles = `
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background: #070a13;
  color: white;
}

* {
  box-sizing: border-box;
}

a {
  color: inherit;
}

.nav {
  height: 82px;
  padding: 0 64px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(7,10,19,.85);
  border-bottom: 1px solid rgba(255,255,255,.08);
}

.brand,
.back {
  text-decoration: none;
  font-weight: 900;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand span {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #3b82f6, #a855f7);
}

.navRight {
  display: flex;
  align-items: center;
  gap: 14px;
}

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

.section {
  max-width: 1300px;
  margin: auto;
  padding: 90px 64px;
}

.badge {
  display: inline-block;
  color: #bfdbfe;
  font-weight: 900;
  letter-spacing: 2px;
}

h1 {
  font-size: clamp(42px, 6vw, 78px);
  margin: 14px 0;
  letter-spacing: -3px;
}

p {
  color: #cbd5e1;
  line-height: 1.7;
}

.products {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
  margin-top: 42px;
}

.productCard {
  text-decoration: none;
  background: rgba(255,255,255,.07);
  border: 1px solid rgba(255,255,255,.1);
  border-radius: 24px;
  padding: 22px;
  transition: .25s;
}

.productCard:hover {
  transform: translateY(-6px);
  background: rgba(255,255,255,.1);
}

.productCard img {
  width: 100%;
  height: 240px;
  object-fit: cover;
  border-radius: 18px;
}

.productCard strong {
  font-size: 34px;
}

@media (max-width: 900px) {
  .nav {
    padding: 18px 22px;
    height: auto;
    min-height: 82px;
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
  }

  .section {
    padding: 60px 22px;
  }

  .products {
    grid-template-columns: 1fr;
  }

  .navRight {
    flex-wrap: wrap;
  }
}
`;