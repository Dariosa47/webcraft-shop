"use client";
import { useEffect, useState } from "react";

export default function ShopPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((items) => setProducts(items.filter((p) => p.active)));
  }, []);

  return (
    <main>
      <style>{styles}</style>

      <nav className="nav">
        <a href="/" className="brand"><span>⚡</span> WebCraft</a>
        <a href="/" className="back">← Home</a>
      </nav>

      <section className="section">
        <p className="badge">TEMPLATE SHOP</p>
        <h1>Odaberi web template</h1>
        <p>Gotove web stranice koje se mogu prilagoditi tvom biznisu.</p>

        <div className="products">
          {products.map((product) => (
            <a className="productCard" href={`/shop/${product.slug}`} key={product.id}>
              <img src={product.coverImage} alt={product.title} />
              <h2>{product.title}</h2>
              <p>{product.shortDescription}</p>
              <strong>{product.price}</strong>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}

const styles = `
body { margin: 0; font-family: Arial, sans-serif; background: #070a13; color: white; }
* { box-sizing: border-box; }
a { color: inherit; }

.nav {
  height: 82px;
  padding: 0 64px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(7,10,19,.85);
  border-bottom: 1px solid rgba(255,255,255,.08);
}

.brand, .back {
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
  .nav { padding: 0 22px; }
  .section { padding: 60px 22px; }
  .products { grid-template-columns: 1fr; }
}
`;