🧑‍💻 Developer : Kittikarn  Panyu 
Provide steps for running the application :
==============================================================
# 📱 QUIZ ISLAND APP
======================================================A========
แอปเล่นเกมตอบคำถามพร้อมระบบจัดเก็บคะแนนและสรุปผลแบบเรียลไทม์ พัฒนาด้วย React Native + Expo

# 🧩 Features

- ✅ เริ่มเกมใหม่พร้อมสร้าง Session ผ่าน API
- ✅ ดึงคำถามแบบสุ่มผ่าน WebAPI
- ✅ ส่งคำตอบและแสดงผลลัพธ์ทันที
- ✅ สรุปคะแนนหลังจบเกม
- ✅ ดูประวัติผู้เล่นย้อนหลังพร้อมรายละเอียด
- ✅ บันทึกชื่อผู้เล่นและคะแนนด้วย AsyncStorage

# 🚀 Getting Started

# 1. Clone the project
 
git clone <your-repo-url>
cd quiz_island_app

# 2. Install dependencies
npm install

# 3. Start the app
npx expo start

# 🛠 Project Structure
quiz_island_app/
├── app/
│   └── (tabs)/
│       ├── index.tsx            # หน้า Home
│       ├── HistoryScreen.tsx    # หน้าประวัติผู้เล่น
│       └── QuestionScreen.tsx   # หน้าคำถาม
│
├── screens/
│   └── SummaryScreen.tsx        # หน้าสรุปผล
│
├── services/
│   └── api.ts                   # API calls (createSession, getSummary)
│
├── App.tsx                      # Navigation หลัก
 
# 📸 Screens
HomeScreen: กรอกชื่อผู้เล่นและเริ่มเกม
QuestionScreen: แสดงคำถามพร้อมตัวเลือกคำตอบ
SummaryScreen: สรุปคะแนนหลังจบเกม
HistoryScreen: จัดอันดับผู้เล่นย้อนหลัง

# 🌐 Backend API
เชื่อมต่อกับ API:  https://webapi.icydune-a1052ab7.southeastasia.azurecontainerapps.io/api/v1/Quiz
Endpoints ที่ใช้:
POST /Session → สร้าง session ใหม่
GET /Questions/{sessionId} → ดึงคำถาม
POST /Answer → ส่งคำตอบ
GET /Summary/{sessionId} → ดูผลรวมของ session
