"use client"; // ต้องมี เพราะใช้ useState / useEffect / onClick

// ===================== Frontend แบบ Next.js =====================
// สร้างโปรเจกต์: npx create-next-app@latest frontend  (ตอบ No ทั้งหมด ยกเว้น App Router = Yes)
// แล้วเอาไฟล์นี้ไปแทน app/page.js  →  npm run dev  →  http://localhost:3000

import { useEffect, useState } from "react";

const API = "http://localhost:3001";
const emptyBook = { title: "", author: "", publishedYear: "", isAvailable: false, catalogId: "" };

export default function Home() {
  const [catalogs, setCatalogs] = useState([]);
  const [books, setBooks] = useState([]);

  const [catalogName, setCatalogName] = useState("");
  const [editCatalogId, setEditCatalogId] = useState(null);

  const [book, setBook] = useState(emptyBook);
  const [cover, setCover] = useState(null);
  const [editBookId, setEditBookId] = useState(null);

  async function load() {
    setCatalogs(await (await fetch(`${API}/catalogs`)).json());
    setBooks(await (await fetch(`${API}/books`)).json());
  }
  useEffect(() => { load(); }, []);

  // ---------- CATALOG ----------
  async function saveCatalog(e) {
    e.preventDefault();
    await fetch(editCatalogId ? `${API}/catalogs/${editCatalogId}` : `${API}/catalogs`, {
      method: editCatalogId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: catalogName }),
    });
    setCatalogName(""); setEditCatalogId(null); load();
  }

  async function deleteCatalog(id) {
    if (!confirm("ยืนยันการลบหมวดหมู่?")) return;
    await fetch(`${API}/catalogs/${id}`, { method: "DELETE" });
    load();
  }

  // ---------- BOOK ----------
  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setBook({ ...book, [name]: type === "checkbox" ? checked : value });
  }

  async function saveBook(e) {
    e.preventDefault();
    const fd = new FormData(); // มีไฟล์ → ใช้ FormData (ไม่ต้องใส่ Content-Type)
    fd.append("title", book.title);
    fd.append("author", book.author);
    fd.append("publishedYear", book.publishedYear);
    fd.append("isAvailable", book.isAvailable);
    fd.append("catalogId", book.catalogId || catalogs[0]?.id || "");
    if (cover) fd.append("cover", cover);

    const res = await fetch(editBookId ? `${API}/books/${editBookId}` : `${API}/books`, {
      method: editBookId ? "PUT" : "POST",
      body: fd,
    });
    if (!res.ok) return alert("บันทึกไม่สำเร็จ");
    setBook(emptyBook); setCover(null); setEditBookId(null);
    e.target.reset(); // ล้างช่องเลือกไฟล์
    load();
  }

  function editBook(b) {
    setEditBookId(b.id);
    setBook({ title: b.title, author: b.author, publishedYear: b.publishedYear, isAvailable: b.isAvailable, catalogId: b.catalogId });
  }

  async function deleteBook(id) {
    if (!confirm("ยืนยันการลบหนังสือ?")) return;
    await fetch(`${API}/books/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <main style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h1>Book Catalog</h1>

      {/* ===== Catalog ===== */}
      <h2>หมวดหมู่</h2>
      <form onSubmit={saveCatalog}>
        <input value={catalogName} onChange={(e) => setCatalogName(e.target.value)} placeholder="ชื่อหมวดหมู่" required />
        <button>{editCatalogId ? "บันทึกการแก้ไข" : "เพิ่ม"}</button>
        {editCatalogId && <button type="button" onClick={() => { setEditCatalogId(null); setCatalogName(""); }}>ยกเลิก</button>}
      </form>
      <table border="1" cellPadding="6">
        <thead><tr><th>ID</th><th>ชื่อ</th><th>จัดการ</th></tr></thead>
        <tbody>
          {catalogs.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td><td>{c.name}</td>
              <td>
                <button onClick={() => { setEditCatalogId(c.id); setCatalogName(c.name); }}>แก้ไข</button>
                <button onClick={() => deleteCatalog(c.id)}>ลบ</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ===== Books ===== */}
      <h2>หนังสือ</h2>
      <form onSubmit={saveBook}>
        <input name="title" value={book.title} onChange={handleChange} placeholder="ชื่อหนังสือ" required />
        <input name="author" value={book.author} onChange={handleChange} placeholder="ผู้แต่ง" />
        <input name="publishedYear" type="number" value={book.publishedYear} onChange={handleChange} placeholder="ปีที่พิมพ์" />
        <select name="catalogId" value={book.catalogId} onChange={handleChange}>
          {catalogs.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <label><input name="isAvailable" type="checkbox" checked={book.isAvailable} onChange={handleChange} /> ยืมได้</label>
        <input type="file" accept="image/*" onChange={(e) => setCover(e.target.files[0])} />
        <button>{editBookId ? "บันทึกการแก้ไข" : "เพิ่ม"}</button>
        {editBookId && <button type="button" onClick={() => { setEditBookId(null); setBook(emptyBook); }}>ยกเลิก</button>}
      </form>
      <table border="1" cellPadding="6">
        <thead><tr><th>ปก</th><th>ID</th><th>ชื่อ</th><th>ผู้แต่ง</th><th>ปี</th><th>หมวด</th><th>สถานะ</th><th>จัดการ</th></tr></thead>
        <tbody>
          {books.map((b) => (
            <tr key={b.id}>
              <td>{b.cover ? <img src={`${API}/uploads/${b.cover}`} width="60" /> : "-"}</td>
              <td>{b.id}</td><td>{b.title}</td><td>{b.author}</td><td>{b.publishedYear}</td>
              <td>{b.catalogName}</td><td>{b.isAvailable ? "ยืมได้" : "ถูกยืม"}</td>
              <td>
                <button onClick={() => editBook(b)}>แก้ไข</button>
                <button onClick={() => deleteBook(b.id)}>ลบ</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
