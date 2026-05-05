"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((items) => {
        const found = items.find((p) => p.slug === params.slug);
        setProduct(found || false);
      });
  }, [params.slug]);

  if (product === null) return <p style={{ padding: 40 }}>Loading...</p>;

  if (product === false) {
    return (
      <main style={{ padding: 40, fontFamily: "Arial" }}>
        <h1>Proizvod nije pronađen</h1>
        <a href="/shop">Nazad na shop</a>
      </main>
    );
  }

  return (
    <main>
      <style>{styles}</style>

      <nav className="nav">
        <a href="/" className="brand"><span>⚡</span> WebCraft</a>
        <a href="/shop" className="back">← Shop</a>
      </nav>

      <section className="hero">
        <div>
          <p className="badge">TEMPLATE</p>
          <h1>{product.title}</h1>
          <p>{product.shortDescription}</p>
          <strong className="price">{product.price}</strong>

          <div className="actions">
            <a className="primaryBtn" href="https://wa.me/38599123456" target="_blank">
              Zatraži ovaj template
            </a>
            <a className="secondaryBtn" href="/shop">
              Svi template-i
            </a>
          </div>
        </div>

        <img src={product.coverImage} alt={product.title} />
      </section>

      <section className="section">
        <h2>Opis</h2>
        <p>{product.description}</p>

        {product.videoUrl && (
          <div className="video">
            <iframe
              src={product.videoUrl}
              title={product.title}
              allowFullScreen
            />
          </div>
        )}

        {product.images?.length > 0 && (
          <>
            <h2>Galerija</h2>
            <div className="gallery">
              {product.images.map((img, i) => (
                <img src={img} alt={`${product.title} ${i + 1}`} key={i} />
              ))}
            </div>
          </>
        )}
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

.hero {
  max-width: 1300px;
  margin: auto;
  padding: 90px 64px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 46px;
  align-items: center;
}

.badge {
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
  font-size: 18px;
}

.price {
  display: block;
  font-size: 48px;
  margin: 24px 0;
}

.hero img {
  width: 100%;
  height: 520px;
  object-fit: cover;
  border-radius: 34px;
  box-shadow: 0 30px 100px rgba(0,0,0,.45);
}

.actions {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}

.primaryBtn, .secondaryBtn {
  padding: 15px 22px;
  border-radius: 999px;
  text-decoration: none;
  font-weight: 900;
}

.primaryBtn {
  background: linear-gradient(135deg, #3b82f6, #a855f7);
}

.secondaryBtn {
  background: rgba(255,255,255,.06);
  border: 1px solid rgba(255,255,255,.14);
}

.section {
  max-width: 1000px;
  margin: auto;
  padding: 60px 64px 100px;
}

.section h2 {
  font-size: 38px;
}

.video {
  margin: 40px 0;
  aspect-ratio: 16 / 9;
  border-radius: 24px;
  overflow: hidden;
  background: #111827;
}

.video iframe {
  width: 100%;
  height: 100%;
  border: 0;
}

.gallery {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;
}

.gallery img {
  width: 100%;
  height: 280px;
  object-fit: cover;
  border-radius: 22px;
}

@media (max-width: 900px) {
  .nav { padding: 0 22px; }
  .hero { grid-template-columns: 1fr; padding: 60px 22px; }
  .section { padding: 50px 22px; }
  .gallery { grid-template-columns: 1fr; }
  .hero img { height: 340px; }
}
`;