"use client";
import { useEffect, useState } from "react";

const ADMIN_PASSWORD = "1234";

const emptyProduct = {
  title: "",
  slug: "",
  price: "",
  shortDescription: "",
  description: "",
  coverImage: "",
  images: [],
  videoUrl: "",
  active: true
};

export default function AdminPage() {
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const [products, setProducts] = useState([]);
  const [current, setCurrent] = useState(emptyProduct);
  const [editingId, setEditingId] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("mainAdminAuth") === "true") {
      setAuthorized(true);
    }

    fetchProducts();
  }, []);

  function fetchProducts() {
    fetch("/api/products")
      .then((r) => r.json())
      .then(setProducts);
  }

  function login() {
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem("mainAdminAuth", "true");
      setAuthorized(true);
    } else {
      alert("Kriva lozinka");
    }
  }

  function logout() {
    localStorage.removeItem("mainAdminAuth");
    setAuthorized(false);
  }

  function slugify(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/č/g, "c")
      .replace(/ć/g, "c")
      .replace(/š/g, "s")
      .replace(/đ/g, "d")
      .replace(/ž/g, "z")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function update(field, value) {
    const updated = { ...current, [field]: value };

    if (field === "title" && !editingId) {
      updated.slug = slugify(value);
    }

    setCurrent(updated);
  }

  function uploadImage(field, file) {
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setCurrent({
        ...current,
        [field]: reader.result
      });
    };

    reader.readAsDataURL(file);
  }

  function addGalleryImage(file) {
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setCurrent({
        ...current,
        images: [...(current.images || []), reader.result]
      });
    };

    reader.readAsDataURL(file);
  }

  function deleteGalleryImage(index) {
    setCurrent({
      ...current,
      images: current.images.filter((_, i) => i !== index)
    });
  }

  function saveProduct() {
    if (!current.title || !current.slug) {
      alert("Naslov i slug su obavezni.");
      return;
    }

    let updatedProducts;

    if (editingId) {
      updatedProducts = products.map((p) =>
        p.id === editingId ? { ...current, id: editingId } : p
      );
    } else {
      const newProduct = {
        ...current,
        id: Date.now(),
        createdAt: new Date().toISOString().slice(0, 10)
      };

      updatedProducts = [...products, newProduct];
    }

    fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedProducts)
    }).then(() => {
      setProducts(updatedProducts);
      setCurrent(emptyProduct);
      setEditingId(null);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  function editProduct(product) {
    setCurrent(product);
    setEditingId(product.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteProduct(id) {
    if (!confirm("Obrisati proizvod?")) return;

    const updated = products.filter((p) => p.id !== id);

    fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updated)
    }).then(() => {
      setProducts(updated);
    });
  }

  function newProduct() {
    setCurrent(emptyProduct);
    setEditingId(null);
  }

  if (!authorized) {
    return (
      <div style={loginPage}>
        <div style={loginBox}>
          <h1>Admin login</h1>
          <p>Lozinka za uređivanje shopa.</p>

          <input
            type="password"
            style={input}
            value={password}
            placeholder="Lozinka"
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") login();
            }}
          />

          <button style={saveButton} onClick={login}>Uđi</button>
        </div>
      </div>
    );
  }

  return (
    <main style={page}>
      <style>{`
        * { box-sizing: border-box; }

        @media (max-width: 800px) {
          .admin-header {
            flex-direction: column;
            align-items: flex-start !important;
          }

          .two {
            grid-template-columns: 1fr !important;
          }

          .product-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <div style={container}>
        <div className="admin-header" style={header}>
          <div>
            <h1 style={{ margin: 0 }}>Shop Admin</h1>
            <p style={{ color: "#cbd5e1" }}>Dodaj i uređuj svoje template proizvode.</p>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <a href="/" target="_blank" style={whiteButton}>Pogledaj web</a>
            <button onClick={logout} style={redButton}>Logout</button>
          </div>
        </div>

        <section style={card}>
          <h2>{editingId ? "Uredi proizvod" : "Dodaj novi proizvod"}</h2>

          <div className="two" style={two}>
            <div>
              <Label text="Naslov proizvoda" />
              <input style={input} value={current.title} onChange={(e) => update("title", e.target.value)} />
            </div>

            <div>
              <Label text="Slug/link proizvoda" />
              <input style={input} value={current.slug} onChange={(e) => update("slug", e.target.value)} />
            </div>
          </div>

          <div className="two" style={two}>
            <div>
              <Label text="Cijena" />
              <input style={input} value={current.price} onChange={(e) => update("price", e.target.value)} />
            </div>

            <div>
              <Label text="Video URL iframe/embed" />
              <input style={input} value={current.videoUrl} onChange={(e) => update("videoUrl", e.target.value)} />
            </div>
          </div>

          <Label text="Kratki opis" />
          <textarea style={textarea} value={current.shortDescription} onChange={(e) => update("shortDescription", e.target.value)} />

          <Label text="Dugi opis" />
          <textarea style={bigTextarea} value={current.description} onChange={(e) => update("description", e.target.value)} />

          <Label text="Cover slika" />
          <input type="file" accept="image/*" style={input} onChange={(e) => uploadImage("coverImage", e.target.files[0])} />

          {current.coverImage && (
            <img src={current.coverImage} alt="Cover" style={previewImage} />
          )}

          <Label text="Galerija slika" />
          <input type="file" accept="image/*" style={input} onChange={(e) => addGalleryImage(e.target.files[0])} />

          <div style={galleryGrid}>
            {(current.images || []).map((img, i) => (
              <div key={i} style={galleryItem}>
                <img src={img} alt={`Slika ${i + 1}`} style={galleryImage} />
                <button style={redButton} onClick={() => deleteGalleryImage(i)}>Obriši</button>
              </div>
            ))}
          </div>

          <label style={toggle}>
            <input
              type="checkbox"
              checked={current.active}
              onChange={(e) => update("active", e.target.checked)}
            />
            Proizvod aktivan/prikazan u shopu
          </label>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button style={saveButton} onClick={saveProduct}>
              {editingId ? "Spremi izmjene" : "Dodaj proizvod"}
            </button>

            <button style={grayButton} onClick={newProduct}>
              Novi prazni proizvod
            </button>
          </div>

          {saved && <p style={{ color: "#86efac", fontWeight: 800 }}>Spremljeno ✅</p>}
        </section>

        <section style={card}>
          <h2>Svi proizvodi</h2>

          {products.map((p) => (
            <div className="product-row" key={p.id} style={productRow}>
              <img src={p.coverImage} alt={p.title} style={smallThumb} />

              <div>
                <strong>{p.title}</strong>
                <p style={{ color: "#94a3b8", margin: "6px 0" }}>
                  /shop/{p.slug} — {p.price}
                </p>
                <p style={{ color: p.active ? "#86efac" : "#fca5a5" }}>
                  {p.active ? "Aktivan" : "Skriven"}
                </p>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button style={grayButton} onClick={() => editProduct(p)}>Uredi</button>
                <button style={redButton} onClick={() => deleteProduct(p.id)}>Obriši</button>
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}

function Label({ text }) {
  return <p style={label}>{text}</p>;
}

const loginPage = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #0f172a, #1e293b)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
  fontFamily: "Arial, sans-serif",
  padding: 20
};

const loginBox = {
  width: "100%",
  maxWidth: 380,
  background: "#111827",
  border: "1px solid #334155",
  borderRadius: 20,
  padding: 28
};

const page = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #0f172a, #1e293b)",
  color: "white",
  fontFamily: "Arial, sans-serif",
  padding: 40
};

const container = {
  maxWidth: 1000,
  margin: "auto"
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 28
};

const card = {
  background: "#111827",
  border: "1px solid #334155",
  borderRadius: 20,
  padding: 24,
  marginBottom: 24
};

const two = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 14
};

const label = {
  color: "#cbd5e1",
  fontSize: 13,
  marginBottom: 6,
  marginTop: 16
};

const input = {
  width: "100%",
  padding: 12,
  borderRadius: 10,
  border: "1px solid #334155",
  background: "#0f172a",
  color: "white"
};

const textarea = {
  ...input,
  minHeight: 90,
  resize: "vertical"
};

const bigTextarea = {
  ...input,
  minHeight: 150,
  resize: "vertical"
};

const saveButton = {
  padding: "13px 18px",
  borderRadius: 12,
  border: "none",
  background: "#2563eb",
  color: "white",
  fontWeight: 900,
  cursor: "pointer"
};

const redButton = {
  padding: "10px 13px",
  borderRadius: 10,
  border: "none",
  background: "#dc2626",
  color: "white",
  fontWeight: 800,
  cursor: "pointer"
};

const grayButton = {
  padding: "10px 13px",
  borderRadius: 10,
  border: "none",
  background: "#475569",
  color: "white",
  fontWeight: 800,
  cursor: "pointer"
};

const whiteButton = {
  padding: "10px 13px",
  borderRadius: 10,
  background: "white",
  color: "#111827",
  textDecoration: "none",
  fontWeight: 900
};

const previewImage = {
  width: "100%",
  maxHeight: 300,
  objectFit: "cover",
  borderRadius: 14,
  marginTop: 12
};

const galleryGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: 12,
  marginTop: 14
};

const galleryItem = {
  background: "#0f172a",
  border: "1px solid #334155",
  borderRadius: 14,
  padding: 10
};

const galleryImage = {
  width: "100%",
  height: 120,
  objectFit: "cover",
  borderRadius: 10,
  marginBottom: 8
};

const toggle = {
  display: "flex",
  gap: 10,
  alignItems: "center",
  margin: "18px 0"
};

const productRow = {
  display: "grid",
  gridTemplateColumns: "110px 1fr auto",
  gap: 16,
  alignItems: "center",
  padding: 14,
  border: "1px solid #334155",
  borderRadius: 16,
  marginBottom: 12,
  background: "#0f172a"
};

const smallThumb = {
  width: 110,
  height: 80,
  objectFit: "cover",
  borderRadius: 12
};