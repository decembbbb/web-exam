# Book Catalog: CRUD 2 ตาราง + อัปโหลดรูปปก

โค้ดตั้งต้นสำหรับสอบ Web (Express + HTML/JS) ใช้แก้ให้ตรงกับ Swagger ของโจทย์

> ⚠️ **ห้ามเปิด AI ทุกชนิด** (เว็บ AI, extension AI, Copilot) มีเก็บ log internet และอัดหน้าจอ **ทุจริตติด F ทุกรายวิชา**

---

## 0. ก่อนเริ่มสอบ (ไปถึงก่อน 10–15 นาที)

- [ ] เปิด CMD แล้วพิมพ์ `node -v` และ `npm -v` ต้องขึ้นเลขเวอร์ชัน
- [ ] เปิด VS Code ได้
- [ ] เข้า `github.com/decembbbb/web-exam` ได้
- [ ] ฟังอาจารย์ว่า **ส่งงานที่ไหน** แล้วจดไว้
- [ ] ปิดแอป/แท็บ/extension ที่เป็น AI ให้หมด

### ถ้า `node -v` ไม่ขึ้นเลข

1. เปิด **nodejs.org** → Download → เลือก **LTS**
2. เลือก **Windows Installer (.msi)** → ดับเบิลคลิก → Next ไปเรื่อยๆ
3. ดูผล
   - ขึ้น **Finish** = ติดตั้งสำเร็จ
   - ถามรหัส admin / "You need administrator privileges" / "Access denied" = **ไม่มีสิทธิ์** → **เรียกอาจารย์หรือ TA ทันที**
4. ติดตั้งเสร็จ → **ปิด CMD / VS Code แล้วเปิดใหม่** → พิมพ์ `node -v` อีกครั้ง

> npm มากับ Node.js อยู่แล้ว ติดตั้งตัวเดียวได้ทั้งคู่

---

## 1. โหลดโค้ดและรัน

1. เปิด `github.com/decembbbb/web-exam` → ปุ่มเขียว **Code** → **Download ZIP** (ไม่ต้อง login)
2. แตก zip → เปิดโฟลเดอร์ใน VS Code (**File → Open Folder**)
3. **Terminal → New Terminal** แล้วพิมพ์

```bash
cd backend
npm install
node index.js
```

4. เปิด `localhost:3001` ต้องเห็นหน้า Book Catalog
5. ลองเพิ่มหนังสือพร้อมรูป 1 เล่ม เพื่อเช็กว่าโค้ดตั้งต้นใช้ได้ **ก่อนแก้อะไร**

---

## 2. อ่าน Swagger แล้วทำ "แผนที่ชื่อ"

- ดู **path** เช่น `/categories`, `/products`
- เลื่อนล่างสุด เปิด **Schemas** จดชื่อฟิลด์และชนิดข้อมูล
  - `integer` / `number` = ตัวเลข
  - `string` = ข้อความ
  - `boolean` = true / false

| ของเรา | โจทย์ |
|---|---|
| catalogs | ตาราง 1 (พหูพจน์) |
| catalog | ตาราง 1 (เอกพจน์) |
| books | ตาราง 2 (พหูพจน์) |
| book | ตาราง 2 (เอกพจน์) |
| title, author, publishedYear, isAvailable, catalogId, cover | ฟิลด์ตามโจทย์ |

---

## 3. เปลี่ยนชื่อทั้งโปรเจกต์

1. หยุดเซิร์ฟเวอร์ก่อน: **Ctrl + C**
2. **Ctrl + Shift + H** (Mac: Cmd + Shift + H)
3. เปิดปุ่ม **AB** (Preserve Case) ไว้เสมอ
4. เช็กว่ารายการผลค้นหา **ไม่มี node_modules** แล้วกด **Replace All**

**ลำดับสำคัญ ทำคำที่มี s ก่อน**

1. `catalogs` → ...
2. `catalog` → ...
3. `books` → ...
4. `book` → ...
5. ฟิลด์ทีละคำ

> ⚠️ สะกดคำใหม่ให้ถูกก่อนกด Replace All (เช่น `categories` ไม่ใช่ `catagories`)
>
> ⚠️ ถ้าแทนที่ `title` ให้เช็ก `public/index.html` ว่า `<title>` ยังเป็น `<title>`

---

## 4. แก้ทีละไฟล์

### `backend/index.js`
- ฟังก์ชัน `to...Data()`: ฟิลด์ตัวเลขต้องครอบ `Number()`
  ```js
  if (body.price !== undefined) data.price = Number(body.price);
  ```
- ฟิลด์ boolean ใช้ `=== true || === "true"`
- ข้อมูลตัวอย่าง `let ... = [ ... ]` เปลี่ยนให้ตรงโจทย์
- ถ้าฟิลด์ไฟล์ไม่ใช่ `image` → แก้ `upload.single("ชื่อฟิลด์")`

### `backend/public/index.html`
- ป้ายภาษาไทย (placeholder, หัวตาราง)
- ช่องตัวเลขใส่ `type="number"`

### `backend/public/app.js`
- ข้อความสถานะ เช่น `${b.inStock ? "มีของ" : "หมด"}`
- `formData.append("ชื่อฟิลด์", ...)` ต้องตรงโจทย์

### ถ้าโจทย์มีฟิลด์ เพิ่ม / น้อยกว่า ของเรา
แก้ให้ครบ 5 ที่: `to...Data()`, ข้อมูลตัวอย่าง, `index.html` (ช่องกรอก + หัวตาราง), `app.js` (แถวตาราง, formData, ฟังก์ชัน edit)

---

## 5. ใส่ HTML/CSS ของอาจารย์ (อาจารย์ให้มา ขาดแค่ JS)

ไฟล์หน้าเว็บอยู่ที่ **`backend/public/index.html`** (ไม่ใช่ `backend/index.js`)

- **ไฟล์เดียว:** ก๊อปทั้งหมด → เปิด `public/index.html` → Ctrl + A → วางทับ → Save
- **หลายไฟล์:** ลากทุกไฟล์ไปวางในโฟลเดอร์ `public`
- **ห้ามลบ** `app.js` และโฟลเดอร์ `uploads`

**เช็ก `</body>`** (ป้ายปิดส่วนเนื้อหาหน้าเว็บ อยู่ล่างสุดของไฟล์)

```html
  <script src="app.js"></script>
</body>
</html>
```

ถ้าไม่มีบรรทัด `<script src="app.js"></script>` ให้พิมพ์เพิ่ม **ก่อน `</body>`**

**แก้ id ใน `app.js` ให้ตรงกับ HTML อาจารย์**
- HTML อาจารย์: `<input id="productName">` → app.js: `$("name")` เปลี่ยนเป็น `$("productName")`
- ต้องเช็ก id ของ: ฟอร์ม, ช่องกรอกทุกช่อง, ช่องไฟล์, dropdown, checkbox, ช่องซ่อน id, `tbody` ของตาราง, ปุ่มยกเลิก
- ถ้า HTML อาจารย์ไม่มี id → ใส่ id เองในแท็กนั้น

---

## 6. ทดสอบก่อนส่ง (ทำครบทุกข้อ)

> แก้โค้ดทุกครั้ง: **Save → Ctrl + C → `node index.js` → รีเฟรชเบราว์เซอร์**

**ตารางที่ 1**
- [ ] ดูรายการได้
- [ ] เพิ่มได้
- [ ] แก้ไขได้
- [ ] ลบได้

**ตารางที่ 2**
- [ ] ดูรายการได้ (ชื่อหมวดขึ้นถูก)
- [ ] เพิ่มพร้อมรูปได้ (รูปขึ้นในตาราง)
- [ ] แก้ไขได้ (เปลี่ยนรูปได้ / ไม่เลือกรูปแล้วรูปเดิมไม่หาย)
- [ ] ลบได้

**API (เปิดในเบราว์เซอร์)**
- [ ] `localhost:3001/products` → เห็น JSON
- [ ] `localhost:3001/products/1` → เห็นรายการเดียว
- [ ] `localhost:3001/products/999` → `{"message":"ไม่พบ..."}`
- [ ] ชื่อฟิลด์ใน JSON ตรงกับ Swagger ทุกตัว
- [ ] กด **F12 → Console** ไม่มีตัวแดง

---

## 7. ส่งงาน

1. แคปหน้าจอที่มีข้อมูล + รูป (Windows: **Win + Shift + S**)
2. **Ctrl + C** หยุดเซิร์ฟเวอร์
3. **ลบโฟลเดอร์ `node_modules`** (คลิกขวา → Delete)
4. zip: คลิกขวาโฟลเดอร์ → **Send to → Compressed (zipped) folder**
5. ตั้งชื่อมีรหัสนิสิต เช่น `67160118_web.zip`
6. ส่งตามที่อาจารย์บอก (e-learning BUU / Classroom / ลิงก์ GitHub / ไดรฟ์กลาง)
7. **เช็กว่าไฟล์ขึ้นจริง** ก่อนออกจากห้อง

> ทำไมต้องลบ `node_modules`: เป็นโค้ดของแพ็กเกจที่โหลดมา ใหญ่มาก และโหลดใหม่ได้ด้วย `npm install` เพราะ `package.json` จดไว้แล้ว

---

## 8. ติดปัญหา → วิธีแก้

| อาการ | สาเหตุ / วิธีแก้ |
|---|---|
| `xxx is not defined` | พิมพ์ชื่อผิด ดูเลขบรรทัดใน error เช่น `index.js:43` |
| `Cannot read properties of undefined` | อ่านค่าจากของที่ไม่มี เช่น `req.param` ต้องเป็น `req.params` |
| `CORS` ใน Console | ขาด `app.use(cors())` |
| `req.body` เป็น undefined | ขาด `app.use(express.json())` หรือส่ง FormData แต่ route ไม่มี `upload.single(...)` |
| `EADDRINUSE` | มีเซิร์ฟเวอร์รันค้าง กด Ctrl + C หรือปิด Terminal เก่า |
| รูปไม่ขึ้น | ชื่อใน `formData.append("image")` ต้องตรงกับ `upload.single("image")` |
| แก้แล้วไม่เปลี่ยน | ลืม Save / ลืมรันเซิร์ฟเวอร์ใหม่ / ลืมรีเฟรช |
| 404 ทุก route | path ขาด `/` ข้างหน้า เช่น `"products/:id"` ต้องเป็น `"/products/:id"` |
| ปุ่มกดแล้วไม่มีอะไรเกิดขึ้น | id ใน `app.js` ไม่ตรงกับ HTML / ไม่มี `<script src="app.js">` |
| ตารางว่าง ไม่มี error | เช็ก `tbody` id ตรงกับ `app.js` / เปิด `localhost:3001/products` ดูว่ามีข้อมูลไหม |
| ราคาเป็น `"25"` (มีเครื่องหมายคำพูด) | ลืมครอบ `Number()` ใน `to...Data()` |
| `npm install` ขึ้น "running scripts is disabled" | ใน VS Code Terminal กดลูกศรข้าง + → เลือก **Command Prompt** แล้วพิมพ์ใหม่ |
| `npm install` ช้า/ค้าง | รอ หรือเช็กเน็ต ถ้าไม่ได้จริงๆ เรียกอาจารย์ |
| ค้นหาภาษาไทยไม่เจอ | ค้นด้วยคำภาษาอังกฤษในบรรทัดเดียวกันแทน |

**ติดอะไรไม่รู้: เช็ก 3 อย่างนี้ก่อนเสมอ**
1. ชื่อสะกดตรงกันไหม (ตัวแปร, id, ฟิลด์)
2. Save แล้วหรือยัง
3. รันเซิร์ฟเวอร์ใหม่ + รีเฟรชแล้วหรือยัง

---

## 9. ปุ่มลัด Windows (เครื่องแล็บ)

| ทำอะไร | Windows | Mac |
|---|---|---|
| Save | Ctrl + S | Cmd + S |
| ค้นหาในไฟล์ | Ctrl + F | Cmd + F |
| ค้นหา + แทนที่ทุกไฟล์ | Ctrl + Shift + H | Cmd + Shift + H |
| เลือกทั้งหมด | Ctrl + A | Cmd + A |
| หยุดเซิร์ฟเวอร์ | Ctrl + C | Ctrl + C |
| แคปหน้าจอ | Win + Shift + S | Cmd + Shift + 4 |
| เปิด Console เบราว์เซอร์ | F12 | Cmd + Option + J |

---

## API

| Method | URL | ทำอะไร | Status |
|---|---|---|---|
| GET | /catalogs, /books | ดูทั้งหมด | 200 |
| GET | /catalogs/:id, /books/:id | ดูทีละรายการ | 200 / 404 |
| POST | /catalogs (JSON), /books (FormData + cover) | เพิ่ม | 201 |
| PUT | /catalogs/:id, /books/:id | แก้ไข | 200 / 404 |
| DELETE | /catalogs/:id, /books/:id | ลบ | 200 / 404 |

**Status code:** 200 สำเร็จ · 201 สร้างใหม่สำเร็จ · 404 ไม่พบ · 400 ข้อมูลไม่ครบ
