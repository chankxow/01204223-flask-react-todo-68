# 🆓 การ Deploy ฟรี (ไม่เสียตังครับ)

## 🌐 Frontend: GitHub Pages (ฟรี)

### ขั้นตอนที่ 1: ตั้งค่า GitHub Pages
1. ไปที่ Repository ของคุณบน GitHub
2. ไปที่ Settings → Pages
3. เลือก "GitHub Actions" เป็น source
4. สร้าง GitHub repository และ push code ขึ้นไป

### ขั้นตอนที่ 2: Push ไป GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/todo-app.git
git push -u origin main
```

## 🚀 Backend: Render (ฟรี)

### ขั้นตอนที่ 1: สมัคร Render
1. ไปที่ https://render.com
2. สมัครด้วย GitHub (ฟรี)
3. เชื่อมต่อ repository

### ขั้นตอนที่ 2: Deploy Backend
1. คลิก "New" → "Web Service"
2. เลือก repository ของคุณ
3. ตั้งค่า:
   - Name: `todo-api`
   - Runtime: `Python 3`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python main.py`
   - Plan: Free

### ขั้นตอนที่ 3: Environment Variables
ตั้งค่าตัวแปรแวดล้อม:
```
PORT=8080
SQLALCHEMY_DATABASE_URI=sqlite:///todo.db
JWT_SECRET_KEY=your-secret-key-change-this
PRODUCTION_URL=https://your-username.github.io/todo-app
```

## 🔧 อัพเดท API URL ใน Frontend

หลังจาก deploy backend เสร็จ จะได้ URL เช่น:
`https://todo-api.onrender.com`

อัพเดทไฟล์ `frontend/src/config/api.js`:
```javascript
export const API_BASE_URL = isDevelopment 
  ? 'http://localhost:5000'
  : 'https://todo-api.onrender.com';
```

## 📋 ข้อดีของวิธีฟรี

### GitHub Pages (Frontend)
- ✅ ฟรี 100%
- ✅ Custom domain ฟรี
- ✅ SSL certificate ฟรี
- ✅ Unlimited bandwidth
- ✅ GitHub integration

### Render (Backend)
- ✅ ฟรี 750 hours/month
- ✅ PostgreSQL database ฟรี
- ✅ Auto-deploy จาก GitHub
- ✅ SSL certificate ฟรี
- ❌ Sleep หลัง 15 นาทีไม่ใช้ (แต่ตื่นเองได้ใน 30 วินาที)

## 🚀 ขั้นตอนสุดท้าย

1. **Deploy Frontend**: Push ไป GitHub → จะ auto-deploy ไป GitHub Pages
2. **Deploy Backend**: Connect repository กับ Render → จะ auto-deploy
3. **อัพเดท API URL**: ใส่ URL ของ Render backend
4. **ทดสอบ**: เปิดเว็บที่ GitHub Pages URL

## 🌐 URL ที่ได้

- Frontend: `https://your-username.github.io/todo-app`
- Backend: `https://todo-api.onrender.com`
- API: `https://todo-api.onrender.com/api/*`

## 🔄 Alternative อื่นๆ

ถ้าไม่ชอบ Render สามารถใช้:
- **Vercel** (ฟรี) - สำหรับ backend
- **Railway** (ฟรี $5 credit) - สำหรับ backend  
- **Fly.io** (ฟรี shared CPU) - สำหรับ backend

ทั้งหมดนี้ฟรีครับ! 🎉
