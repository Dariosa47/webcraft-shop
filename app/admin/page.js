"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const emptyProduct = {
  title: "",
  title_hr: "",
  title_en: "",
  title_de: "",

  slug: "",
  price: "",

  short_description: "",
  short_description_hr: "",
  short_description_en: "",
  short_description_de: "",

  description: "",
  description_hr: "",
  description_en: "",
  description_de: "",

  cover_image: "",
  images: [],
  video_url: "",
  active: true
};

export default function AdminPage() {
  const [session, setSession] = useState(null);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [products, setProducts] = useState([]);
  const [current, setCurrent] = useState(emptyProduct);
  const [editingId, setEditingId] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) fetchProducts();
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchProducts();
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function login() {
    const { error } = await supabase.auth.signInWithPassword({
      email: loginData.email,
      password: loginData.password
    });

    if (error) alert("Krivi email ili lozinka.");
  }

  async function logout() {
    await supabase.auth.signOut();
    setSession(null);
  }

  async function fetchProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setProducts(data || []);
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

    if ((field === "title" || field === "title_hr") && !editingId) {
      updated.slug = slugify(value);
    }

    setCurrent(updated);
  }

  async function uploadToSupabase(file) {
    if (!file) return "";

    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, "-");
    const fileName = `${Date.now()}-${cleanName}`;

    const { error } = await supabase.storage
      .from("product-images")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false
      });

    if (error) {
      alert("Upload slike nije uspio.");
      console.error(error);
      return "";
    }

    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(fileName);

    return data.publicUrl;
  }

  async function uploadCover(file) {
    const url = await uploadToSupabase(file);
    if (!url) return;

    setCurrent({
      ...current,
      cover_image: url
    });
  }

  async function addGalleryImage(file) {
    const url = await uploadToSupabase(file);
    if (!url) return;

    setCurrent({
      ...current,
      images: [...(current.images || []), url]
    });
  }

  function deleteGalleryImage(index) {
    setCurrent({
      ...current,
      images: current.images.filter((_, i) => i !== index)
    });
  }

  async function saveProduct() {
    const finalTitle = current.title_hr || current.title;

    if (!finalTitle || !current.slug) {
      alert("Naslov HR ili osnovni naslov i slug su obavezni.");
      return;
    }

    const payload = {
      title: finalTitle,
      title_hr: current.title_hr || finalTitle,
      title_en: current.title_en,
      title_de: current.title_de,

      slug: current.slug,
      price: current.price,

      short_description: current.short_description_hr || current.short_description,
      short_description_hr: current.short_description_hr || current.short_description,
      short_description_en: current.short_description_en,
      short_description_de: current.short_description_de,

      description: current.description_hr || current.description,
      description_hr: current.description_hr || current.description,
      description_en: current.description_en,
      description_de: current.description_de,

      cover_image: current.cover_image,
      images: current.images || [],
      video_url: current.video_url,
      active: current.active
    };

    if (editingId) {
      const { error } = await supabase
        .from("products")
        .update(payload)
        .eq("id", editingId);

      if (error) {
        alert("Greška kod spremanja.");
        console.error(error);
        return;
      }
    } else {
      const { error } = await supabase
        .from("products")
        .insert(payload);

      if (error) {
        alert("Greška kod dodavanja.");
        console.error(error);
        return;
      }
    }

    setCurrent(emptyProduct);
    setEditingId(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    fetchProducts();
  }

  function editProduct(product) {
    setCurrent({
      ...emptyProduct,
      ...product,
      images: product.images || []
    });
    setEditingId(product.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteProduct(id) {
    if (!confirm("Obrisati proizvod?")) return;

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Brisanje nije uspjelo.");
      console.error(error);
      return;
    }

    fetchProducts();
  }

  function newProduct() {
    setCurrent(emptyProduct);
    setEditingId(null);
  }

  if (!session) {
    return (
      <div style={loginPage}>
        <div style={loginBox}>
          <h1>Admin login</h1>
          <p>Prijavi se sa Supabase admin emailom.</p>

          <input
            style={input}
            placeholder="Email"
            value={loginData.email}
            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
          />

          <input
            type="password"
            style={input}
            placeholder="Lozinka"
            value={loginData.password}
            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === "Enter") login();
            }}
          />

          <button style={saveButton} onClick={login}>
            Uđi
          </button>
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

          .gallery-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <div style={container}>
        <div className="admin-header" style={header}>
          <div>
            <h1 style={{ margin: 0 }}>Shop Admin</h1>
            <p style={{ color: "#cbd5e1" }}>Dodaj i uređuj template proizvode na HR / EN / DE.</p>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <a href="/" target="_blank" style={whiteButton}>
              Pogledaj web
            </a>
            <button onClick={logout} style={redButton}>
              Logout
            </button>
          </div>
        </div>

        <section style={card}>
          <h2>{editingId ? "Uredi proizvod" : "Dodaj novi proizvod"}</h2>

          <h3 style={subheading}>Osnovno</h3>

          <div className="two" style={two}>
            <div>
              <Label text="Naslov HR" />
              <input
                style={input}
                value={current.title_hr || ""}
                onChange={(e) => update("title_hr", e.target.value)}
              />
            </div>

            <div>
              <Label text="Slug/link proizvoda" />
              <input
                style={input}
                value={current.slug || ""}
                onChange={(e) => update("slug", e.target.value)}
              />
            </div>
          </div>

          <div className="two" style={two}>
            <div>
              <Label text="Naslov EN" />
              <input
                style={input}
                value={current.title_en || ""}
                onChange={(e) => update("title_en", e.target.value)}
              />
            </div>

            <div>
              <Label text="Naslov DE" />
              <input
                style={input}
                value={current.title_de || ""}
                onChange={(e) => update("title_de", e.target.value)}
              />
            </div>
          </div>

          <div className="two" style={two}>
            <div>
              <Label text="Cijena" />
              <input
                style={input}
                value={current.price || ""}
                onChange={(e) => update("price", e.target.value)}
              />
            </div>

            <div>
              <Label text="Video URL iframe/embed" />
              <input
                style={input}
                value={current.video_url || ""}
                onChange={(e) => update("video_url", e.target.value)}
              />
            </div>
          </div>

          <h3 style={subheading}>Kratki opis</h3>

          <Label text="Kratki opis HR" />
          <textarea
            style={textarea}
            value={current.short_description_hr || ""}
            onChange={(e) => update("short_description_hr", e.target.value)}
          />

          <Label text="Short description EN" />
          <textarea
            style={textarea}
            value={current.short_description_en || ""}
            onChange={(e) => update("short_description_en", e.target.value)}
          />

          <Label text="Kurzbeschreibung DE" />
          <textarea
            style={textarea}
            value={current.short_description_de || ""}
            onChange={(e) => update("short_description_de", e.target.value)}
          />

          <h3 style={subheading}>Dugi opis</h3>

          <Label text="Opis HR" />
          <textarea
            style={bigTextarea}
            value={current.description_hr || ""}
            onChange={(e) => update("description_hr", e.target.value)}
          />

          <Label text="Description EN" />
          <textarea
            style={bigTextarea}
            value={current.description_en || ""}
            onChange={(e) => update("description_en", e.target.value)}
          />

          <Label text="Beschreibung DE" />
          <textarea
            style={bigTextarea}
            value={current.description_de || ""}
            onChange={(e) => update("description_de", e.target.value)}
          />

          <h3 style={subheading}>Slike i video</h3>

          <Label text="Cover slika" />
          <input type="file" accept="image/*" style={input} onChange={(e) => uploadCover(e.target.files[0])} />

          {current.cover_image && (
            <img src={current.cover_image} alt="Cover" style={previewImage} />
          )}

          <Label text="Galerija slika" />
          <input type="file" accept="image/*" style={input} onChange={(e) => addGalleryImage(e.target.files[0])} />

          <div className="gallery-grid" style={galleryGrid}>
            {(current.images || []).map((img, i) => (
              <div key={i} style={galleryItem}>
                <img src={img} alt={`Slika ${i + 1}`} style={galleryImage} />
                <button style={redButton} onClick={() => deleteGalleryImage(i)}>
                  Obriši
                </button>
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
              <img src={p.cover_image} alt={p.title_hr || p.title} style={smallThumb} />

              <div>
                <strong>{p.title_hr || p.title}</strong>
                <p style={{ color: "#94a3b8", margin: "6px 0" }}>
                  /shop/{p.slug} — {p.price}
                </p>
                <p style={{ color: p.active ? "#86efac" : "#fca5a5" }}>
                  {p.active ? "Aktivan" : "Skriven"}
                </p>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button style={grayButton} onClick={() => editProduct(p)}>
                  Uredi
                </button>
                <button style={redButton} onClick={() => deleteProduct(p.id)}>
                  Obriši
                </button>
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

const subheading = {
  marginTop: 28,
  marginBottom: 10,
  color: "#e5e7eb"
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
  color: "white",
  marginBottom: 10
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