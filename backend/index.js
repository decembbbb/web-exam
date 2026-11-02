// ===================== Backend: Book + Catalog (CRUD 2 ตาราง + อัปโหลดรูปปก) =====================
// รัน: npm install  แล้ว  node index.js   → http://localhost:3001
// วันสอบ: เปลี่ยนชื่อ books / catalogs และฟิลด์ ให้ตรงโจทย์ (ใช้ Cmd+F ค้นหาแล้วแทนที่)

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
app.use(cors());                 // ให้ frontend คนละพอร์ตเรียกได้ (ลืม = CORS error)
app.use(express.json());         // ให้อ่าน req.body ที่เป็น JSON ได้ (ลืม = req.body undefined)
app.use("/uploads", express.static("uploads")); // เปิดให้ดูรูปที่อัปโหลด: http://localhost:3001/uploads/ชื่อไฟล์
app.use(express.static("public"));             // หน้าเว็บ HTML+JS: http://localhost:3001

// ---------- ตั้งค่าอัปโหลดไฟล์ (multer) ----------
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // ตั้งชื่อไฟล์ใหม่กันชื่อซ้ำ
  },
});
const upload = multer({ storage });

// ---------- ข้อมูลจำลอง (แทนฐานข้อมูล) ----------
let catalogs = [
  { id: 1, name: "Programming" },
  { id: 2, name: "Novel" },
];

let books = [
  { id: 1, title: "Clean Code", author: "Robert C. Martin", publishedYear: 2008, isAvailable: true, catalogId: 1, cover: null },
  { id: 2, title: "Harry Potter", author: "J.K. Rowling", publishedYear: 1997, isAvailable: false, catalogId: 2, cover: null },
];

// สร้าง id ใหม่ = id มากสุด + 1
const nextId = (list) => (list.length > 0 ? Math.max(...list.map((x) => x.id)) + 1 : 1);

// ======================================================================
// ตารางที่ 1: CATALOGS
// ======================================================================
app.get("/catalogs", (req, res) => {
  res.status(200).json(catalogs);
});

app.get("/catalogs/:id", (req, res) => {
  const catalog = catalogs.find((c) => c.id == req.params.id);
  if (!catalog) return res.status(404).json({ message: "ไม่พบหมวดหมู่" });
  res.status(200).json(catalog);
});

app.post("/catalogs", (req, res) => {
  if (!req.body.name) return res.status(400).json({ message: "กรุณาใส่ชื่อหมวดหมู่" });
  const newCatalog = { id: nextId(catalogs), name: req.body.name };
  catalogs.push(newCatalog);
  res.status(201).json(newCatalog);
});

app.put("/catalogs/:id", (req, res) => {
  const index = catalogs.findIndex((c) => c.id == req.params.id);
  if (index === -1) return res.status(404).json({ message: "ไม่พบหมวดหมู่" });
  catalogs[index] = { ...catalogs[index], ...req.body, id: catalogs[index].id };
  res.status(200).json(catalogs[index]);
});

app.delete("/catalogs/:id", (req, res) => {
  const index = catalogs.findIndex((c) => c.id == req.params.id);
  if (index === -1) return res.status(404).json({ message: "ไม่พบหมวดหมู่" });
  catalogs.splice(index, 1);
  res.status(200).json({ message: "ลบหมวดหมู่แล้ว" });
});

// ======================================================================
// ตารางที่ 2: BOOKS (มี catalogId ชี้ไปตาราง catalogs + มีรูปปก)
// ======================================================================

// แปลงค่าจากฟอร์ม (FormData ส่งมาเป็น string ทั้งหมด) ให้เป็นชนิดที่ถูก
function toBookData(body) {
  const data = {};
  if (body.title !== undefined) data.title = body.title;
  if (body.author !== undefined) data.author = body.author;
  if (body.publishedYear !== undefined) data.publishedYear = Number(body.publishedYear);
  if (body.isAvailable !== undefined) data.isAvailable = body.isAvailable === true || body.isAvailable === "true";
  if (body.catalogId !== undefined) data.catalogId = Number(body.catalogId);
  return data;
}

// GET ทั้งหมด (แนบชื่อ catalog ไปด้วย)
app.get("/books", (req, res) => {
  const result = books.map((b) => ({
    ...b,
    catalogName: catalogs.find((c) => c.id == b.catalogId)?.name || "-",
  }));
  res.status(200).json(result);
});

app.get("/books/:id", (req, res) => {
  const book = books.find((b) => b.id == req.params.id);
  if (!book) return res.status(404).json({ message: "ไม่พบหนังสือ" });
  res.status(200).json(book);
});

// POST เพิ่ม: upload.single("cover") = รับไฟล์จากช่องชื่อ cover
app.post("/books", upload.single("cover"), (req, res) => {
  const newBook = {
    id: nextId(books),
    ...toBookData(req.body),
    cover: req.file ? req.file.filename : null,
  };
  if (!newBook.title) return res.status(400).json({ message: "กรุณาใส่ชื่อหนังสือ" });
  books.push(newBook);
  res.status(201).json(newBook);
});

// PUT แก้ไข: ถ้าส่งรูปใหม่มาก็เปลี่ยนรูป ถ้าไม่ส่งใช้รูปเดิม
app.put("/books/:id", upload.single("cover"), (req, res) => {
  const index = books.findIndex((b) => b.id == req.params.id);
  if (index === -1) return res.status(404).json({ message: "ไม่พบหนังสือ" });
  books[index] = {
    ...books[index],
    ...toBookData(req.body),
    id: books[index].id,
    cover: req.file ? req.file.filename : books[index].cover,
  };
  res.status(200).json(books[index]);
});

app.delete("/books/:id", (req, res) => {
  const index = books.findIndex((b) => b.id == req.params.id);
  if (index === -1) return res.status(404).json({ message: "ไม่พบหนังสือ" });
  books.splice(index, 1);
  res.status(200).json({ message: "ลบหนังสือแล้ว" });
});

app.listen(3001, () => console.log("Server running at http://localhost:3001"));
