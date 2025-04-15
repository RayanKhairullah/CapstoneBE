# API Neurofin Auth & Expenses API  Documentation

## Tecnology
- **Bahasa:** `Java Script`
- **Framework:** `Hapi.Js`
- **Database:** `PostgreSQL`
- **ORM:** `Prisma`
- **dependencies:**  
```json
  "scripts": {
    "dev": "nodemon src/server.js",
    "postinstall": "prisma generate",
    "start": "node api/index.js"
  },
  "dependencies": {
    "@hapi/boom": "^10.0.1",
    "@hapi/hapi": "^21.4.0",
    "@hapi/joi": "^17.1.1",
    "@prisma/client": "^6.6.0",
    "bcrypt": "^5.1.1",
    "cors": "^2.8.5",
    "dotenv": "^16.4.7",
    "joi": "^17.13.3",
    "jsonwebtoken": "^9.0.2",
    "nanoid": "^3.3.6",
    "nodemailer": "^6.10.0",
    "pg": "^8.14.1",
    "pg-hstore": "^2.3.4",
    "pino": "^9.6.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.9",
    "prisma": "^6.6.0"
  }
```
- **Deploy database:** `Supabase` 

---
## API Auth Origin
- [ API Auth Origin ](https://github.com/AgungADL/Capstone-backend-auth)
---

## Fitur Utama
- **Register**
- **Login**
- **verify Email**
- **mengambil data user**
- **logut**
- **Menambahkan Pengeluaran (Add Expense)**
- **Melihat Semua Pengeluaran (Get All Expenses)**
- **Melihat Detail Pengeluaran Berdasarkan ID (Get Expense by ID)**
- **Memperbarui Pengeluaran Berdasarkan ID (Update Expense by ID)**
- **Menghapus Pengeluaran Berdasarkan ID (Delete Expense by ID)**

---

## schema.prisma

```sql
generator client {
  provider = "prisma-client-js"
  output   = "../src/generated/prisma"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

model User {
  id               Int      @id @default(autoincrement())
  username         String
  email            String   @unique
  password         String
  verified         Boolean  @default(false)
  verificationCode String?
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  expenses Expense[]
}

model Expense {
  expenseid        String   @id 
  id_user          Int
  category         String
  uangmasuk        Decimal  @default(0.0) @db.Decimal(15, 2)
  uangkeluar       Decimal  @default(0.0) @db.Decimal(15, 2)
  uangakhir        Decimal  @db.Decimal(15, 2)
  description      String?
  transaction_date DateTime
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  user             User     @relation(fields: [id_user], references: [id])
}
```

---

## Instalasi

### Clone Repository
```bash
git clone <repository-url>
cd NeuroFin
```

### Instal Dependencies
```bash
npm install
```

### .Env
Ganti file `.env.example` menjadi `.env` dan sesuaikan isi konfigurasinya
```
# Connect to Supabase via connection pooling.
DATABASE_URL=your_database_url
# Direct connection to the database. Used for migrations.
DIRECT_URL=your_database_url

# email service configuration
EMAIL_SERVICE=gmail
EMAIL_USER=yourgmail@gmail.com
EMAIL_PASS=your_app_password

JWT_SECRET=your_jwt_secret
PORT=9000
```

### Migrasi Database
Pastikan folder migrations "contoh: 20250415062651_init" sudah ada, jika belum dapat jalankan perintah:
```bash
npx prisma migrate dev --name init

untuk mengekstrak schema database kedalam migration.sql
```

### Menjalankan Server di Local
```bash
npm run dev
```
Server akan berjalan di [http://localhost:9000](http://localhost:9000).

---

## Endpoint API

**Headers:** `Content-Type: application/json` untuk endpoint register, verify-email, dan login
### Register 
- **URL:** `POST  /register`
- **Request example:**
  ```json
  {
    "username": "username",
    "email": "emailemail@gmail.com",
    "password": "securepassword"
  }
  ```
- **Response:**
  ```json
  {
      "status": "success",
      "message": "Registrasi berhasil, cek email untuk verifikasi"
  }
  ```

### Verify Email 
- **URL:** `POST /verify-email`
- **Request example:**
  ```json
      {
        "email": "emailemail@gmail.com",
        "code": "pfoGvpK1ba"
      }
  ```
- **Response:**
  ```json
  {
      "status": "success",
      "message": "Email berhasil diverifikasi"
  }
  ```

### Login 
- **URL:** `POST /login`
- **Request example:**
  ```json
  {
    "email": "emailbudi@gmail.com",
    "password": "securepassword"
  }
  ```
- **Response:**
  ```json
  {
      "status": "success",
      "message": "Login berhasil",
      "data": {
          "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1iYWtyaW4yxxxxxx9tIiwiaWF0IjoxNzQ0NTk1NDU2LCJleHAiOjE3NDQ2MDk4NTZ9.eddfrgYbKQNR1Px0q9KhPwuElfELvVnTblrANSifth0"
      }
  }
  ```

**Headers:** 
`Content-Type: application/json` 
`Authorization: Bearer {{authToken}}`
untuk header semua endpoint expense, me dan logout
### 1. Create Expense

- **URL:** `POST /expenses`
- **Request example:**
  ```json
  {
    "category": "Food",
    "uangMasuk": 0,
    "uangKeluar": 50000,
    "uangAkhir": 950000,
    "description": "Lunch with friends",
    "transaction_date": "2025-03-28"
  }
  ```
- **Response:**
  ```json
  {
    "status": "success",
    "message": "Expense berhasil ditambahkan",
    "data": {
      "expenseid": "random11char"
    }
  }
  ```

### 2. Get All Expenses

- **URL:** `GET /expenses`
- **Response:**
  ```json
  {
    "status": "success",
    "data": {
      "expenses": [
        {
          "expenseid": "random11char",
          "category": "Food",
          "uangmasuk": 0,
          "uangkeluar": 50000,
          "uangakhir": 950000,
          "description": "Lunch with friends",
          "transaction_date": "2025-03-28",
          "createdAt": "2025-03-28T12:00:00.000Z",
          "updatedAt": "2025-03-28T12:00:00.000Z"
        }
      ]
    }
  }
  ```

### 3. Get Expense by ID

- **URL:** `GET /expenses/{expenseid}`

- **Response (Jika Ditemukan):**
  ```json
  {
    "status": "success",
    "data": {
      "expense": {
        "expenseid": "random11char",
        "category": "Food",
        "uangmasuk": 0,
        "uangkeluar": 50000,
        "uangakhir": 950000,
        "description": "Lunch with friends",
        "transaction_date": "2025-03-28",
        "createdAt": "2025-03-28T12:00:00.000Z",
        "updatedAt": "2025-03-28T12:00:00.000Z"
      }
    }
  }
  ```

- **Response (Jika Tidak Ditemukan):**
  ```json
  {
    "status": "fail",
    "message": "Expense tidak ditemukan"
  }
  ```

### 4. Update Expense by ID

- **URL:** `PUT /expenses/{expenseid}`
- **Request:**
  ```json
  {
    "category": "Transport",
    "uangMasuk": 0,
    "uangKeluar": 20000,
    "uangAkhir": 930000,
    "description": "Taxi fare",
    "transaction_date": "2025-03-28"
  }
  ```
- **Response (Jika Berhasil):**
  ```json
  {
    "status": "success",
    "message": "Expense berhasil diperbarui"
  }
  ```
- **Response (Jika Tidak Ditemukan):**
  ```json
  {
    "status": "fail",
    "message": "Expense gagal diperbarui. Id tidak ditemukan"
  }
  ```

### 5. Delete Expense by ID

- **URL:** `DELETE /expenses/{expenseid}`
- **Response (Jika Berhasil):**
  ```json
  {
    "status": "success",
    "message": "Expense berhasil dihapus"
  }
  ```
- **Response (Jika Tidak Ditemukan):**
  ```json
  {
    "status": "fail",
    "message": "Expense gagal dihapus. Id tidak ditemukan"
  }
  ```
  
  ### 6. Me

- **URL:** `GET /me`
- **Response (Jika Berhasil):**
  ```json
  {
      "status": "success",
      "message": "Berhasil mendapatkan data user",
      "data": {
          "id": 1,
          "username": "user",
          "email": "emailbudi@gmail.com",
          "verified": true,
          "createdAt": "2025-04-15T06:38:50.433Z"
      }
  }
  ```
- **Response (Jika Tidak Ditemukan):**
  ```json
  {
      "status": "fail",
      "statusCode": 401,
      "message": "Token tidak valid atau kadaluarsa"
  }
  ```

  ### 7. Logout

- **URL:** `POST /logout`
- **Response (Jika Berhasil):**
  ```json
  {
      "status": "success",
      "message": "Logout berhasil"
  }
  ```
- **Response (Jika Tidak Ditemukan):**
  ```json
  {
      "status": "fail",
      "statusCode": 401,
      "message": "Token tidak valid atau kadaluarsa"
  }
  ```
---

## Error Handling

Semua error dikembalikan dalam format berikut:
```json
{
  "status": "fail",
  "message": "Deskripsi error"
}
```

---

## Testing

Gunakan file Postman Collection pada folder postman untuk menguji API:
- **Collection:** `[NeuroFin] Expense API TEST.postman_collection.json`
- **Environment:** `[NeuroFin] Expenses API Environtment.postman_environment.json`

---

## Kontributor

- **Backend Developer:** Rayan Khairullah Al Rafy  & [ Agung Arya Dwipa Laksana ](https://github.com/AgungADL/Capstone-backend-auth)
- **From:** NeuroFin Project