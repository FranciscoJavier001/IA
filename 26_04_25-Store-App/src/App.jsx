import { useState, useEffect, useRef } from "react";

const CATEGORIES = ["Bebidas", "Botanas", "Lácteos", "Panadería", "Carnes", "Limpieza", "Otro"];

const CATEGORY_COLORS = {
  "Bebidas": "#3b82f6",
  "Botanas": "#f59e0b",
  "Lácteos": "#8b5cf6",
  "Panadería": "#d97706",
  "Carnes": "#ef4444",
  "Limpieza": "#10b981",
  "Otro": "#6b7280",
};

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function formatDate(ts) {
  return new Date(ts).toLocaleDateString("es-MX", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
  });
}

const UNITS = ["pieza", "kg", "litro", "paquete", "caja", "bolsa", "gramo", "ml"];

const emptyForm = { name: "", price: "", unit: "pieza", category: "Otro" };

export default function App() {
  const [products, setProducts] = useState(() => {
    try { return JSON.parse(localStorage.getItem("catalogo_products")) || []; } catch { return []; }
  });
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("Todas");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [historyModal, setHistoryModal] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast, setToast] = useState(null);
  const nameRef = useRef();

  useEffect(() => {
    localStorage.setItem("catalogo_products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    if (modalOpen && nameRef.current) nameRef.current.focus();
  }, [modalOpen]);

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  }

  function openAdd() {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(p) {
    setEditing(p.id);
    setForm({ name: p.name, price: p.price, unit: p.unit, category: p.category });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditing(null);
    setForm(emptyForm);
  }

  function handleSave() {
    const name = form.name.trim();
    const price = parseFloat(form.price);
    if (!name) return showToast("El nombre no puede estar vacío.", "error");
    if (isNaN(price) || price < 0) return showToast("Ingresa un precio válido.", "error");

    if (editing) {
      setProducts(prev => prev.map(p => {
        if (p.id !== editing) return p;
        const priceChanged = p.price !== price;
        return {
          ...p,
          name,
          price,
          unit: form.unit,
          category: form.category,
          updatedAt: Date.now(),
          priceHistory: priceChanged
            ? [...(p.priceHistory || []), { price: p.price, changedAt: Date.now() }]
            : p.priceHistory || [],
        };
      }));
      showToast("Producto actualizado ✓");
    } else {
      const newP = {
        id: generateId(),
        name,
        price,
        unit: form.unit,
        category: form.category,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        priceHistory: [],
      };
      setProducts(prev => [newP, ...prev]);
      showToast("Producto agregado ✓");
    }
    closeModal();
  }

  function handleDelete(id) {
    setProducts(prev => prev.filter(p => p.id !== id));
    setDeleteConfirm(null);
    showToast("Producto eliminado.", "error");
  }

  const usedCategories = ["Todas", ...CATEGORIES.filter(c => products.some(p => p.category === c))];

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === "Todas" || p.category === filterCat;
    return matchSearch && matchCat;
  });

  const grouped = {};
  if (filterCat === "Todas") {
    filtered.forEach(p => {
      if (!grouped[p.category]) grouped[p.category] = [];
      grouped[p.category].push(p);
    });
  } else {
    grouped[filterCat] = filtered;
  }

  const recentlyUpdated = (p) => {
    if (!p.priceHistory || p.priceHistory.length === 0) return false;
    const last = p.priceHistory[p.priceHistory.length - 1];
    return (Date.now() - last.changedAt) < 1000 * 60 * 60 * 48;
  };

  return (
    <div style={styles.root}>
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div>
            <div style={styles.storeBadge}>🏪 Mi Tienda</div>
            <h1 style={styles.title}>Catálogo</h1>
          </div>
          <button style={styles.addBtn} onClick={openAdd}>
            <span style={{ fontSize: 20, lineHeight: 1 }}>+</span> Agregar
          </button>
        </div>

        <div style={styles.searchRow}>
          <div style={styles.searchWrap}>
            <span style={styles.searchIcon}>🔍</span>
            <input
              style={styles.searchInput}
              placeholder="Buscar producto..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button style={styles.clearBtn} onClick={() => setSearch("")}>✕</button>
            )}
          </div>
        </div>

        <div style={styles.tabs}>
          {usedCategories.map(c => (
            <button
              key={c}
              style={{
                ...styles.tab,
                ...(filterCat === c ? {
                  background: c === "Todas" ? "#f59e0b" : CATEGORY_COLORS[c],
                  color: "#fff",
                  borderColor: "transparent",
                } : {}),
              }}
              onClick={() => setFilterCat(c)}
            >{c}</button>
          ))}
        </div>
      </header>

      <main style={styles.main}>
        {filtered.length === 0 ? (
          <div style={styles.empty}>
            <div style={{ fontSize: 48 }}>🛒</div>
            <p style={{ color: "#9ca3af", marginTop: 12 }}>
              {products.length === 0 ? "Agrega tu primer producto." : "No se encontraron resultados."}
            </p>
          </div>
        ) : (
          Object.entries(grouped).map(([cat, items]) => (
            <section key={cat} style={styles.section}>
              {filterCat === "Todas" && (
                <div style={styles.catHeader}>
                  <span style={{ ...styles.catDot, background: CATEGORY_COLORS[cat] || "#6b7280" }} />
                  <span style={styles.catTitle}>{cat}</span>
                  <span style={styles.catCount}>{items.length}</span>
                </div>
              )}
              <div style={styles.grid}>
                {items.map(p => (
                  <div key={p.id} style={styles.card}>
                    <div style={{ ...styles.cardAccent, background: CATEGORY_COLORS[p.category] || "#6b7280" }} />
                    <div style={styles.cardBody}>
                      <div style={styles.cardTop}>
                        <span style={styles.productName}>{p.name}</span>
                        {recentlyUpdated(p) && (
                          <span style={styles.updatedBadge}>↑ precio</span>
                        )}
                      </div>
                      <div style={styles.unitLabel}>por {p.unit}</div>
                      <div style={styles.priceRow}>
                        <span style={styles.price}>${p.price.toFixed(2)}</span>
                      </div>
                      <div style={styles.cardActions}>
                        {p.priceHistory && p.priceHistory.length > 0 && (
                          <button style={styles.histBtn} onClick={() => setHistoryModal(p)}>
                            📋 Historial
                          </button>
                        )}
                        <button style={styles.editBtn} onClick={() => openEdit(p)}>Editar</button>
                        <button style={styles.deleteBtn} onClick={() => setDeleteConfirm(p.id)}>✕</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))
        )}
      </main>

      {modalOpen && (
        <div style={styles.overlay} onClick={e => { if (e.target === e.currentTarget) closeModal(); }}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>{editing ? "Editar producto" : "Nuevo producto"}</h2>
              <button style={styles.closeBtn} onClick={closeModal}>✕</button>
            </div>
            <div style={styles.modalBody}>
              <label style={styles.label}>Nombre</label>
              <input
                ref={nameRef}
                style={styles.input}
                placeholder="Ej. Coca-Cola 1L"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                onKeyDown={e => e.key === "Enter" && handleSave()}
              />
              <label style={styles.label}>Precio ($)</label>
              <input
                style={styles.input}
                type="number"
                min="0"
                step="0.5"
                placeholder="0.00"
                value={form.price}
                onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                onKeyDown={e => e.key === "Enter" && handleSave()}
              />
              <label style={styles.label}>Unidad</label>
              <select style={styles.input} value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))}>
                {UNITS.map(u => <option key={u}>{u}</option>)}
              </select>
              <label style={styles.label}>Categoría</label>
              <div style={styles.catGrid}>
                {CATEGORIES.map(c => (
                  <button
                    key={c}
                    style={{
                      ...styles.catPill,
                      background: form.category === c ? CATEGORY_COLORS[c] : "#1f2937",
                      color: form.category === c ? "#fff" : "#9ca3af",
                      borderColor: form.category === c ? CATEGORY_COLORS[c] : "#374151",
                    }}
                    onClick={() => setForm(f => ({ ...f, category: c }))}
                  >{c}</button>
                ))}
              </div>
            </div>
            <div style={styles.modalFooter}>
              <button style={styles.cancelBtn} onClick={closeModal}>Cancelar</button>
              <button style={styles.saveBtn} onClick={handleSave}>
                {editing ? "Guardar cambios" : "Agregar producto"}
              </button>
            </div>
          </div>
        </div>
      )}

      {historyModal && (
        <div style={styles.overlay} onClick={e => { if (e.target === e.currentTarget) setHistoryModal(null); }}>
          <div style={{ ...styles.modal, maxWidth: 420 }}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Historial de precios</h2>
              <button style={styles.closeBtn} onClick={() => setHistoryModal(null)}>✕</button>
            </div>
            <div style={styles.modalBody}>
              <div style={styles.histProductName}>{historyModal.name}</div>
              <div style={styles.timeline}>
                {[...historyModal.priceHistory].reverse().map((h, i) => (
                  <div key={i} style={styles.timelineItem}>
                    <div style={styles.timelineDot} />
                    <div>
                      <div style={styles.timelinePrice}>${h.price.toFixed(2)}</div>
                      <div style={styles.timelineDate}>{formatDate(h.changedAt)}</div>
                    </div>
                  </div>
                ))}
                <div style={styles.timelineItem}>
                  <div style={{ ...styles.timelineDot, background: "#10b981" }} />
                  <div>
                    <div style={{ ...styles.timelinePrice, color: "#10b981" }}>
                      ${historyModal.price.toFixed(2)} <span style={{ fontSize: 11, color: "#6b7280" }}>precio actual</span>
                    </div>
                    <div style={styles.timelineDate}>{formatDate(historyModal.updatedAt)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div style={styles.overlay}>
          <div style={{ ...styles.modal, maxWidth: 360 }}>
            <div style={styles.modalBody}>
              <div style={{ textAlign: "center", padding: "8px 0 16px" }}>
                <div style={{ fontSize: 36 }}>🗑️</div>
                <p style={{ color: "#f3f4f6", marginTop: 8, fontWeight: 600 }}>¿Eliminar producto?</p>
                <p style={{ color: "#9ca3af", fontSize: 13 }}>Esta acción no se puede deshacer.</p>
              </div>
            </div>
            <div style={styles.modalFooter}>
              <button style={styles.cancelBtn} onClick={() => setDeleteConfirm(null)}>Cancelar</button>
              <button style={{ ...styles.saveBtn, background: "#ef4444" }} onClick={() => handleDelete(deleteConfirm)}>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div style={{
          ...styles.toast,
          background: toast.type === "error" ? "#ef4444" : "#10b981",
        }}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}

const styles = {
  root: {
    minHeight: "100vh",
    background: "#0f1117",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    color: "#f3f4f6",
  },
  header: {
    background: "#111827",
    borderBottom: "1px solid #1f2937",
    padding: "20px 20px 0",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  headerInner: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  storeBadge: {
    fontSize: 12,
    color: "#f59e0b",
    fontWeight: 600,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: 800,
    margin: 0,
    letterSpacing: "-0.02em",
    color: "#f9fafb",
  },
  addBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "#f59e0b",
    color: "#0f1117",
    border: "none",
    borderRadius: 10,
    padding: "10px 18px",
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  searchRow: { marginBottom: 14 },
  searchWrap: { position: "relative", display: "flex", alignItems: "center" },
  searchIcon: { position: "absolute", left: 12, fontSize: 14, pointerEvents: "none" },
  searchInput: {
    width: "100%",
    background: "#1f2937",
    border: "1px solid #374151",
    borderRadius: 10,
    padding: "10px 36px 10px 36px",
    color: "#f3f4f6",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
  },
  clearBtn: {
    position: "absolute", right: 10, background: "none", border: "none",
    color: "#6b7280", cursor: "pointer", fontSize: 14, padding: 4,
  },
  tabs: { display: "flex", gap: 8, overflowX: "auto", paddingBottom: 12, scrollbarWidth: "none" },
  tab: {
    background: "transparent",
    border: "1px solid #374151",
    borderRadius: 20,
    padding: "6px 14px",
    color: "#9ca3af",
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    whiteSpace: "nowrap",
    transition: "all 0.15s",
  },
  main: { padding: "20px 16px 80px", maxWidth: 900, margin: "0 auto" },
  empty: { textAlign: "center", padding: "80px 20px" },
  section: { marginBottom: 32 },
  catHeader: { display: "flex", alignItems: "center", gap: 8, marginBottom: 12 },
  catDot: { width: 10, height: 10, borderRadius: "50%", flexShrink: 0 },
  catTitle: {
    fontWeight: 700, fontSize: 13, letterSpacing: "0.06em",
    textTransform: "uppercase", color: "#9ca3af",
  },
  catCount: {
    background: "#1f2937", color: "#6b7280", borderRadius: 20,
    padding: "1px 8px", fontSize: 11, fontWeight: 600,
  },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 },
  card: {
    background: "#111827", border: "1px solid #1f2937", borderRadius: 14,
    overflow: "hidden", display: "flex", flexDirection: "column",
  },
  cardAccent: { height: 4, width: "100%" },
  cardBody: { padding: "14px 14px 12px", display: "flex", flexDirection: "column", gap: 4, flex: 1 },
  cardTop: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 6 },
  productName: { fontWeight: 700, fontSize: 15, color: "#f9fafb", lineHeight: 1.3 },
  updatedBadge: {
    background: "#fef3c7", color: "#92400e", fontSize: 10, fontWeight: 700,
    padding: "2px 6px", borderRadius: 6, whiteSpace: "nowrap", flexShrink: 0,
  },
  unitLabel: { fontSize: 12, color: "#6b7280" },
  priceRow: { marginTop: 4 },
  price: { fontSize: 22, fontWeight: 800, color: "#f59e0b", letterSpacing: "-0.02em" },
  cardActions: { display: "flex", gap: 6, marginTop: 10, alignItems: "center" },
  histBtn: {
    background: "#1f2937", border: "1px solid #374151", borderRadius: 8,
    color: "#9ca3af", fontSize: 11, padding: "5px 8px", cursor: "pointer", fontWeight: 500,
  },
  editBtn: {
    background: "#1f2937", border: "1px solid #374151", borderRadius: 8,
    color: "#d1d5db", fontSize: 12, padding: "5px 12px", cursor: "pointer",
    fontWeight: 600, marginLeft: "auto",
  },
  deleteBtn: {
    background: "transparent", border: "1px solid #374151", borderRadius: 8,
    color: "#ef4444", fontSize: 13, padding: "5px 8px", cursor: "pointer", lineHeight: 1,
  },
  overlay: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
    backdropFilter: "blur(4px)", display: "flex", alignItems: "center",
    justifyContent: "center", zIndex: 100, padding: 16,
  },
  modal: {
    background: "#111827", border: "1px solid #1f2937",
    borderRadius: 18, width: "100%", maxWidth: 480, overflow: "hidden",
  },
  modalHeader: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "18px 20px 14px", borderBottom: "1px solid #1f2937",
  },
  modalTitle: { margin: 0, fontSize: 17, fontWeight: 700, color: "#f9fafb" },
  closeBtn: {
    background: "#1f2937", border: "none", borderRadius: 8, color: "#9ca3af",
    width: 28, height: 28, cursor: "pointer", fontSize: 13,
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  modalBody: { padding: "18px 20px", display: "flex", flexDirection: "column", gap: 10 },
  label: {
    fontSize: 12, fontWeight: 600, color: "#9ca3af",
    letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: -4,
  },
  input: {
    background: "#1f2937", border: "1px solid #374151", borderRadius: 10,
    padding: "10px 12px", color: "#f3f4f6", fontSize: 14, outline: "none",
    width: "100%", boxSizing: "border-box",
  },
  catGrid: { display: "flex", flexWrap: "wrap", gap: 6 },
  catPill: {
    border: "1px solid", borderRadius: 20, padding: "5px 12px",
    fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
  },
  modalFooter: {
    display: "flex", gap: 10, padding: "14px 20px",
    borderTop: "1px solid #1f2937", justifyContent: "flex-end",
  },
  cancelBtn: {
    background: "#1f2937", border: "1px solid #374151", borderRadius: 10,
    color: "#9ca3af", padding: "10px 18px", fontSize: 14, cursor: "pointer", fontWeight: 600,
  },
  saveBtn: {
    background: "#f59e0b", border: "none", borderRadius: 10,
    color: "#0f1117", padding: "10px 20px", fontSize: 14, cursor: "pointer", fontWeight: 700,
  },
  histProductName: { fontWeight: 700, fontSize: 16, color: "#f9fafb", marginBottom: 16 },
  timeline: {
    display: "flex", flexDirection: "column", gap: 14,
    borderLeft: "2px solid #1f2937", paddingLeft: 18, marginLeft: 6,
  },
  timelineItem: { display: "flex", alignItems: "flex-start", gap: 12, position: "relative" },
  timelineDot: {
    width: 10, height: 10, borderRadius: "50%", background: "#6b7280",
    flexShrink: 0, marginTop: 4, marginLeft: -25,
  },
  timelinePrice: { fontWeight: 700, fontSize: 15, color: "#f3f4f6" },
  timelineDate: { fontSize: 12, color: "#6b7280", marginTop: 2 },
  toast: {
    position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
    color: "#fff", fontWeight: 600, fontSize: 13, padding: "10px 20px",
    borderRadius: 10, zIndex: 200, boxShadow: "0 4px 20px rgba(0,0,0,0.4)", whiteSpace: "nowrap",
  },
};
