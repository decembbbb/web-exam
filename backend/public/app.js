// ===================== Frontend แบบ HTML + JS ธรรมดา =====================

const API = "http://localhost:3001";
const $ = (id) => document.getElementById(id); // ทางลัด แทน document.getElementById

// ======================= CATALOG =======================
async function loadCatalogs() {
  const res = await fetch(`${API}/catalogs`);
  const catalogs = await res.json();

  // ตาราง
  $("catalogTable").innerHTML = catalogs.map((c) => `
    <tr>
      <td>${c.id}</td>
      <td>${c.name}</td>
      <td>
        <button class="btn btn-sm btn-warning" onclick="editCatalog(${c.id}, '${c.name}')">แก้ไข</button>
        <button class="btn btn-sm btn-danger" onclick="deleteCatalog(${c.id})">ลบ</button>
      </td>
    </tr>`).join("");

  // dropdown ในฟอร์มหนังสือ
  $("bookCatalog").innerHTML = catalogs.map((c) => `<option value="${c.id}">${c.name}</option>`).join("");
}

$("catalogForm").addEventListener("submit", async (e) => {
  e.preventDefault(); // กันหน้าเว็บรีเฟรช
  const id = $("catalogId").value;
  const body = { name: $("catalogName").value };

  await fetch(id ? `${API}/catalogs/${id}` : `${API}/catalogs`, {
    method: id ? "PUT" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  resetCatalogForm();
  loadCatalogs();
  loadBooks(); // ชื่อหมวดในตารางหนังสืออาจเปลี่ยน
});

function editCatalog(id, name) {
  $("catalogId").value = id;
  $("catalogName").value = name;
}

async function deleteCatalog(id) {
  if (!confirm("ยืนยันการลบหมวดหมู่?")) return;
  await fetch(`${API}/catalogs/${id}`, { method: "DELETE" });
  loadCatalogs();
  loadBooks();
}

function resetCatalogForm() {
  $("catalogForm").reset();
  $("catalogId").value = "";
}
$("catalogCancel").addEventListener("click", resetCatalogForm);

// ======================= BOOKS =======================
async function loadBooks() {
  const res = await fetch(`${API}/books`);
  const books = await res.json();

  $("bookTable").innerHTML = books.map((b) => `
    <tr>
      <td>${b.cover ? `<img src="${API}/uploads/${b.cover}" width="60">` : "-"}</td>
      <td>${b.id}</td>
      <td>${b.title}</td>
      <td>${b.author}</td>
      <td>${b.publishedYear}</td>
      <td>${b.catalogName}</td>
      <td>${b.isAvailable ? "ยืมได้" : "ถูกยืม"}</td>
      <td>
        <button class="btn btn-sm btn-warning" onclick="editBook(${b.id})">แก้ไข</button>
        <button class="btn btn-sm btn-danger" onclick="deleteBook(${b.id})">ลบ</button>
      </td>
    </tr>`).join("");
}

$("bookForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = $("bookId").value;

  // มีไฟล์ → ต้องส่งเป็น FormData (ห้ามใส่ Content-Type เอง browser จะใส่ให้)
  const formData = new FormData();
  formData.append("title", $("title").value);
  formData.append("author", $("author").value);
  formData.append("publishedYear", $("publishedYear").value);
  formData.append("isAvailable", $("isAvailable").checked);
  formData.append("catalogId", $("bookCatalog").value);
  if ($("cover").files[0]) formData.append("cover", $("cover").files[0]); // ชื่อ "cover" ต้องตรงกับ upload.single("cover")

  const res = await fetch(id ? `${API}/books/${id}` : `${API}/books`, {
    method: id ? "PUT" : "POST",
    body: formData,
  });
  if (!res.ok) return alert("บันทึกไม่สำเร็จ");
  resetBookForm();
  loadBooks();
});

async function editBook(id) {
  const res = await fetch(`${API}/books/${id}`);
  const b = await res.json();
  $("bookId").value = b.id;
  $("title").value = b.title;
  $("author").value = b.author;
  $("publishedYear").value = b.publishedYear;
  $("isAvailable").checked = b.isAvailable;
  $("bookCatalog").value = b.catalogId;
}

async function deleteBook(id) {
  if (!confirm("ยืนยันการลบหนังสือ?")) return;
  await fetch(`${API}/books/${id}`, { method: "DELETE" });
  loadBooks();
}

function resetBookForm() {
  $("bookForm").reset();
  $("bookId").value = "";
}
$("bookCancel").addEventListener("click", resetBookForm);

// โหลดข้อมูลตอนเปิดหน้า
loadCatalogs();
loadBooks();
