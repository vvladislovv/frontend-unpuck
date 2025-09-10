# 📍 Расположение API Endpoints

## 📁 Файл с API endpoints:
**`/Users/evochka/Desktop/Unpacker Clone/frontend/src/lib/api.ts`**

## 🔗 Все API endpoints (45+):

### 🔐 Аутентификация (`authAPI`)
```javascript
POST /api/auth/register     - Регистрация пользователя
POST /api/auth/login        - Вход в систему  
GET  /api/auth/me          - Получение профиля
POST /api/auth/logout       - Выход из системы
```

### 👤 Пользователи (`usersAPI`)
```javascript
PUT  /api/users/profile                    - Обновление профиля
GET  /api/users/referrals                  - Получение рефералов
GET  /api/users/balance                    - Получение баланса
GET  /api/users/notifications              - Получение уведомлений
PUT  /api/users/notifications/:id/read     - Отметка прочитанным
PUT  /api/users/notifications/read-all     - Все прочитаны
```

### 📦 Товары (`productsAPI`)
```javascript
GET    /api/products              - Список товаров
GET    /api/products/:id          - Товар по ID
POST   /api/products              - Создание товара
PUT    /api/products/:id          - Обновление товара
DELETE /api/products/:id          - Удаление товара
GET    /api/products/my/products  - Товары пользователя
```

### 🤝 Сделки (`dealsAPI`)
```javascript
GET  /api/deals              - Список сделок
GET  /api/deals/:id          - Сделка по ID
POST /api/deals              - Создание сделки
PUT  /api/deals/:id          - Обновление сделки
POST /api/deals/:id/cancel   - Отмена сделки
GET  /api/deals/my/deals     - Сделки пользователя
```

### 💳 Платежи (`paymentAPI`)
```javascript
POST /api/payment/create     - Создание платежа
GET  /api/payment/:id        - Информация о платеже
POST /api/payment/:id/confirm - Подтверждение платежа
POST /api/payment/:id/cancel  - Отмена платежа
```

### ⚙️ Админка (`adminAPI`)
```javascript
GET  /api/admin/stats                    - Статистика
GET  /api/admin/messages                 - Сообщения
POST /api/admin/messages/:id/reply       - Ответ на сообщение
GET  /api/admin/users                    - Пользователи
PUT  /api/admin/users/:id                - Обновление пользователя
POST /api/admin/users/:id/block          - Блокировка пользователя
POST /api/admin/users/:id/unblock        - Разблокировка пользователя
POST /api/admin/users/:id/verify         - Верификация пользователя
GET  /api/admin/products                 - Товары админки
PUT  /api/admin/products/:id             - Обновление товара админки
DELETE /api/admin/products/:id           - Удаление товара админки
GET  /api/admin/deals                    - Сделки админки
```

### 💬 Чат/Поддержка (`chatAPI`, `supportAPI`)
```javascript
GET  /api/chat/chats                     - Чаты
POST /api/chat/chats                     - Создание чата
GET  /api/chat/chats/:id/messages        - Сообщения чата
POST /api/chat/chats/:id/messages        - Отправка сообщения
PUT  /api/chat/messages/:id              - Редактирование сообщения
DELETE /api/chat/messages/:id            - Удаление сообщения
POST /api/support/message                - Отправка сообщения в поддержку
GET  /api/support/messages               - Сообщения поддержки
```

### 💰 Транзакции (`transactionsAPI`)
```javascript
GET  /api/transactions                   - Транзакции
POST /api/transactions/withdrawal        - Запрос на вывод средств
GET  /api/transactions/stats             - Статистика транзакций
POST /api/transactions/:id/cancel        - Отмена транзакции
```

### 📁 Загрузка файлов (`uploadAPI`)
```javascript
POST /api/upload/file                    - Загрузка файла
POST /api/upload/files                   - Загрузка нескольких файлов
POST /api/upload/avatar                  - Загрузка аватара
DELETE /api/upload/file/:filename        - Удаление файла
GET  /api/upload/file/:filename/info     - Информация о файле
```

### 📊 Статистика (`statisticsAPI`)
```javascript
GET /api/statistics/user                 - Статистика пользователя
GET /api/statistics/product/:id          - Статистика товара
GET /api/statistics/sales                - Статистика продаж
```

### 🎓 Академия (`academyAPI`)
```javascript
GET  /api/academy/courses                           - Курсы
GET  /api/academy/courses/:id                       - Курс по ID
GET  /api/academy/courses/:id/lessons               - Уроки курса
GET  /api/academy/courses/:id/lessons/:lessonId     - Урок по ID
POST /api/academy/courses/:id/lessons/:lessonId/complete - Завершение урока
```

### 🤝 Партнерская программа (`affiliateAPI`)
```javascript
GET  /api/affiliate/stats                - Статистика партнерки
GET  /api/affiliate/referrals            - Рефералы
GET  /api/affiliate/commissions          - Комиссии
POST /api/affiliate/payout               - Запрос выплаты
GET  /api/affiliate/payouts              - История выплат
```

## 🔧 Настройка

### Базовый URL:
```javascript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
```

### Переменные окружения:
Создайте файл `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## ✅ Интеграция в компоненты

### Каталог (`src/components/catalog/product-grid.tsx`):
```javascript
import { productsAPI } from '@/lib/api'

// Загрузка товаров
const response = await productsAPI.getProducts(params)
```

### Сделки (`src/components/deals/deals-content.tsx`):
```javascript
import { dealsAPI } from '@/lib/api'

// Загрузка сделок
const response = await dealsAPI.getMyDeals({ limit: 50, offset: 0 })
```

### Админка (`src/app/admin/page.tsx`):
```javascript
import { adminAPI } from '@/lib/api'

// Загрузка статистики
const statsResponse = await adminAPI.getStats()
// Загрузка сообщений
const messagesResponse = await adminAPI.getMessages({ limit: 50 })
```

### Статистика (`src/app/statistics/page.tsx`):
```javascript
import { statisticsAPI } from '@/lib/api'

// Загрузка статистики пользователя
const response = await statisticsAPI.getUserStats({ period: '30d' })
```

## 🚀 Тестирование

### Запуск тестов API:
```bash
npm run test:api:local    # Тест с локальным сервером
npm run test:api:prod     # Тест с продакшн сервером
```

### Запуск приложения:
```bash
npm run dev               # Разработка
npm run build             # Сборка
npm run start             # Продакшн
```

## 📍 Где находятся ручки:

**Все API endpoints находятся в одном файле:**
`/Users/evochka/Desktop/Unpacker Clone/frontend/src/lib/api.ts`

Этот файл содержит:
- Настройку axios instance
- Interceptors для авторизации и обработки ошибок
- 14 API модулей с 45+ endpoints
- Все функции для работы с сервером
