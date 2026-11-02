# Book Catalog — CRUD 2 ตาราง + อัปโหลดรูปปก

## รัน Backend (มีหน้าเว็บ HTML+JS ในตัว)
```bash
cd backend
npm install
node index.js
```
เปิด http://localhost:3001

## รัน Frontend แบบ Next.js (ถ้าต้องใช้)
```bash
npx create-next-app@latest frontend
```
เอา `frontend-next/app/page.js` ไปแทน `frontend/app/page.js` แล้ว
```bash
cd frontend
npm run dev
```
เปิด http://localhost:3000 (backend ต้องรันค้างไว้ด้วย)

## API
| Method | URL | ทำอะไร | Status |
|---|---|---|---|
| GET | /catalogs, /books | ดูทั้งหมด | 200 |
| GET | /catalogs/:id, /books/:id | ดูทีละรายการ | 200 / 404 |
| POST | /catalogs (JSON), /books (FormData + cover) | เพิ่ม | 201 |
| PUT | /catalogs/:id, /books/:id | แก้ไข | 200 / 404 |
| DELETE | /catalogs/:id, /books/:id | ลบ | 200 / 404 |

## เปลี่ยนเป็นระบบอื่น
1. ใช้ Cmd+Shift+F ค้นหา `books` / `catalogs` แล้วแทนที่ด้วยชื่อใหม่
2. แก้ฟิลด์ใน `toBookData()` ใน index.js
3. แก้ช่องกรอกและหัวตารางใน index.html + app.js (หรือ page.js)

## Error ที่เจอบ่อย
- `CORS` ใน Console → ลืม `app.use(cors())`
- `req.body` เป็น undefined → ลืม `app.use(express.json())` หรือส่ง FormData แต่ไม่มี `upload.single(...)`
- `xxx is not defined` → พิมพ์ชื่อตัวแปรผิด ดูเลขบรรทัดใน error
- รูปไม่ขึ้น → ชื่อช่อง `cover` ใน FormData ต้องตรงกับ `upload.single("cover")`
- `EADDRINUSE` → มีเซิร์ฟเวอร์รันค้างอยู่ ปิดด้วย Ctrl+C
