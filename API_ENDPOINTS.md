# 🚀 **API Endpoints - Unpacker Clone Frontend**

## **Базовая конфигурация**
- **Base URL**: `http://localhost:3001/api` (dev) / `https://yourdomain.com/api` (prod)
- **Timeout**: 10 секунд
- **Кэширование**: 5 минут для GET запросов
- **Авторизация**: Bearer Token

---

## **🔐 Authentication API**

### **POST** `/auth/login`
**Описание**: Вход в систему
```json
{
  "identifier": "email@example.com",
  "password": "password123"
}
```

### **POST** `/auth/register`
**Описание**: Регистрация пользователя
```json
{
  "firstName": "Иван",
  "lastName": "Иванов",
  "email": "ivan@example.com",
  "username": "ivan123",
  "password": "password123",
  "role": "buyer",
  "referralCode": "REF123"
}
```

### **POST** `/auth/telegram`
**Описание**: Авторизация через Telegram
```json
{
  "telegramId": "123456789",
  "firstName": "Иван",
  "lastName": "Иванов",
  "username": "ivan_telegram",
  "photoUrl": "https://t.me/i/userpic/320/photo.jpg"
}
```

### **GET** `/auth/me`
**Описание**: Получение профиля пользователя

### **POST** `/auth/logout`
**Описание**: Выход из системы

---

## **👤 Users API**

### **PUT** `/users/profile`
**Описание**: Обновление профиля
```json
{
  "firstName": "Иван",
  "lastName": "Иванов",
  "email": "ivan@example.com",
  "phone": "+7 (999) 123-45-67",
  "avatar": "https://example.com/avatar.jpg"
}
```

### **GET** `/users/referrals`
**Описание**: Получение рефералов пользователя

### **GET** `/users/balance`
**Описание**: Получение баланса пользователя

### **GET** `/users/notifications`
**Описание**: Получение уведомлений
**Параметры**: `limit`, `offset`, `unread`

### **PUT** `/users/notifications/{id}/read`
**Описание**: Отметить уведомление как прочитанное

### **PUT** `/users/notifications/read-all`
**Описание**: Отметить все уведомления как прочитанные

---

## **🛍️ Products API**

### **GET** `/products`
**Описание**: Получение списка товаров
**Параметры**: `search`, `category`, `brand`, `minPrice`, `maxPrice`, `sellerId`, `limit`, `offset`, `sortBy`, `sortOrder`

### **GET** `/products/{id}`
**Описание**: Получение товара по ID

### **POST** `/products`
**Описание**: Создание товара
```json
{
  "wbArticle": "12345678",
  "title": "Название товара",
  "description": "Описание товара",
  "price": 1000,
  "images": ["https://example.com/image1.jpg"],
  "category": "electronics",
  "brand": "Samsung"
}
```

### **PUT** `/products/{id}`
**Описание**: Обновление товара

### **DELETE** `/products/{id}`
**Описание**: Удаление товара

### **GET** `/products/my/products`
**Описание**: Получение моих товаров
**Параметры**: `limit`, `offset`, `isActive`

---

## **📢 Campaigns API**

### **GET** `/campaigns`
**Описание**: Получение кампаний
**Параметры**: `type`, `status`, `advertiserId`, `limit`, `offset`

### **GET** `/campaigns/{id}`
**Описание**: Получение кампании по ID

### **POST** `/campaigns`
**Описание**: Создание кампании
```json
{
  "title": "Название кампании",
  "description": "Описание кампании",
  "type": "product",
  "budget": 10000,
  "pricePerClick": 50,
  "maxClicks": 200,
  "startDate": "2024-01-01T00:00:00Z",
  "endDate": "2024-01-31T23:59:59Z",
  "productId": "product123"
}
```

### **PUT** `/campaigns/{id}`
**Описание**: Обновление кампании

### **POST** `/campaigns/{id}/start`
**Описание**: Запуск кампании

### **POST** `/campaigns/{id}/pause`
**Описание**: Пауза кампании

### **POST** `/campaigns/{id}/click`
**Описание**: Запись клика по кампании

### **GET** `/campaigns/my/campaigns`
**Описание**: Получение моих кампаний
**Параметры**: `status`, `limit`, `offset`

---

## **💬 Chat API**

### **GET** `/chat/chats`
**Описание**: Получение чатов
**Параметры**: `limit`, `offset`

### **POST** `/chat/chats`
**Описание**: Создание чата
```json
{
  "name": "Название чата",
  "isGroup": false,
  "participantIds": ["user1", "user2"]
}
```

### **GET** `/chat/chats/{chatId}/messages`
**Описание**: Получение сообщений чата
**Параметры**: `limit`, `cursor`

### **POST** `/chat/chats/{chatId}/messages`
**Описание**: Отправка сообщения
```json
{
  "content": "Текст сообщения",
  "type": "TEXT",
  "metadata": {}
}
```

### **PUT** `/chat/messages/{messageId}`
**Описание**: Редактирование сообщения

### **DELETE** `/chat/messages/{messageId}`
**Описание**: Удаление сообщения

### **POST** `/chat/chats/{chatId}/participants`
**Описание**: Добавление участника

### **POST** `/chat/chats/{chatId}/leave`
**Описание**: Покинуть чат

---

## **💰 Transactions API**

### **GET** `/transactions`
**Описание**: Получение транзакций
**Параметры**: `type`, `status`, `limit`, `offset`, `dateFrom`, `dateTo`

### **POST** `/transactions/withdrawal`
**Описание**: Запрос на вывод средств
```json
{
  "amount": 1000,
  "method": "bank_card",
  "details": {
    "cardNumber": "1234567890123456"
  }
}
```

### **GET** `/transactions/stats`
**Описание**: Получение статистики транзакций
**Параметры**: `period` (7d, 30d, 90d, 1y)

### **POST** `/transactions/{id}/cancel`
**Описание**: Отмена транзакции

---

## **🤝 Deals API**

### **GET** `/deals`
**Описание**: Получение сделок
**Параметры**: `status`, `buyerId`, `sellerId`, `limit`, `offset`

### **GET** `/deals/{id}`
**Описание**: Получение сделки по ID

### **POST** `/deals`
**Описание**: Создание сделки
```json
{
  "productId": "product123",
  "quantity": 2,
  "totalPrice": 2000,
  "paymentMethod": "card"
}
```

### **PUT** `/deals/{id}`
**Описание**: Обновление сделки

### **POST** `/deals/{id}/cancel`
**Описание**: Отмена сделки

### **GET** `/deals/my/deals`
**Описание**: Получение моих сделок
**Параметры**: `status`, `limit`, `offset`

---

## **💳 Payment API**

### **POST** `/payment/create`
**Описание**: Создание платежа
```json
{
  "productId": "product123",
  "quantity": 1,
  "totalPrice": 1000,
  "userId": "user123",
  "paymentMethod": "card"
}
```

### **GET** `/payment/{id}`
**Описание**: Получение платежа по ID

### **POST** `/payment/{id}/confirm`
**Описание**: Подтверждение платежа

### **POST** `/payment/{id}/cancel`
**Описание**: Отмена платежа

---

## **👨‍💼 Admin API**

### **GET** `/admin/stats`
**Описание**: Получение статистики админки

### **GET** `/admin/messages`
**Описание**: Получение сообщений поддержки
**Параметры**: `status`, `type`, `limit`, `offset`

### **POST** `/admin/messages/{messageId}/reply`
**Описание**: Ответ на сообщение поддержки

### **GET** `/admin/users`
**Описание**: Получение пользователей
**Параметры**: `role`, `verified`, `blocked`, `limit`, `offset`

### **PUT** `/admin/users/{userId}`
**Описание**: Обновление пользователя

### **POST** `/admin/users/{userId}/block`
**Описание**: Блокировка пользователя

### **POST** `/admin/users/{userId}/unblock`
**Описание**: Разблокировка пользователя

### **POST** `/admin/users/{userId}/verify`
**Описание**: Верификация пользователя

### **GET** `/admin/products`
**Описание**: Получение товаров для модерации
**Параметры**: `sellerId`, `category`, `status`, `limit`, `offset`

### **PUT** `/admin/products/{productId}`
**Описание**: Обновление товара (модерация)

### **DELETE** `/admin/products/{productId}`
**Описание**: Удаление товара

### **GET** `/admin/deals`
**Описание**: Получение сделок для модерации
**Параметры**: `status`, `buyerId`, `sellerId`, `limit`, `offset`

### **PUT** `/admin/deals/{dealId}/status`
**Описание**: Обновление статуса сделки

### **POST** `/admin/deals/{dealId}/resolve-dispute`
**Описание**: Разрешение спора

---

## **📤 Upload API**

### **POST** `/upload/file`
**Описание**: Загрузка одного файла
**Content-Type**: `multipart/form-data`

### **POST** `/upload/files`
**Описание**: Загрузка нескольких файлов
**Content-Type**: `multipart/form-data`

### **POST** `/upload/avatar`
**Описание**: Загрузка аватара
**Content-Type**: `multipart/form-data`

### **DELETE** `/upload/file/{filename}`
**Описание**: Удаление файла

### **GET** `/upload/file/{filename}/info`
**Описание**: Получение информации о файле

---

## **📊 Statistics API**

### **GET** `/statistics/user`
**Описание**: Получение статистики пользователя
**Параметры**: `period` (7d, 30d, 90d, 1y)

### **GET** `/statistics/product/{productId}`
**Описание**: Получение статистики товара
**Параметры**: `period` (7d, 30d, 90d, 1y)

### **GET** `/statistics/sales`
**Описание**: Получение статистики продаж
**Параметры**: `period` (7d, 30d, 90d, 1y)

---

## **🆘 Support API**

### **POST** `/support/message`
**Описание**: Отправка сообщения в поддержку
```json
{
  "subject": "Тема сообщения",
  "message": "Текст сообщения",
  "type": "support",
  "priority": "medium"
}
```

### **GET** `/support/messages`
**Описание**: Получение сообщений поддержки
**Параметры**: `status`, `type`, `limit`, `offset`

### **GET** `/support/messages/{messageId}`
**Описание**: Получение сообщения поддержки по ID

### **POST** `/support/messages/{messageId}/reply`
**Описание**: Ответ на сообщение поддержки

---

## **🎓 Academy API**

### **GET** `/academy/courses`
**Описание**: Получение курсов
**Параметры**: `category`, `level`, `limit`, `offset`

### **GET** `/academy/courses/{courseId}`
**Описание**: Получение курса по ID

### **GET** `/academy/courses/{courseId}/lessons`
**Описание**: Получение уроков курса

### **GET** `/academy/courses/{courseId}/lessons/{lessonId}`
**Описание**: Получение урока по ID

### **POST** `/academy/courses/{courseId}/lessons/{lessonId}/complete`
**Описание**: Отметить урок как завершенный

### **GET** `/academy/progress`
**Описание**: Получение прогресса обучения
**Параметры**: `courseId`

---

## **🤝 Affiliate API**

### **GET** `/affiliate/stats`
**Описание**: Получение статистики партнерской программы

### **GET** `/affiliate/referrals`
**Описание**: Получение рефералов
**Параметры**: `status`, `limit`, `offset`

### **GET** `/affiliate/commissions`
**Описание**: Получение комиссий
**Параметры**: `status`, `dateFrom`, `dateTo`, `limit`, `offset`

### **POST** `/affiliate/payout`
**Описание**: Запрос на выплату
```json
{
  "amount": 1000,
  "method": "bank_card",
  "details": {
    "cardNumber": "1234567890123456"
  }
}
```

### **GET** `/affiliate/payouts`
**Описание**: Получение истории выплат
**Параметры**: `status`, `limit`, `offset`

---

## **📱 Telegram API**

### **GET** `/telegram/user/{telegramId}`
**Описание**: Получение информации о пользователе Telegram

### **GET** `/telegram/user/{telegramId}/photo`
**Описание**: Получение фото пользователя Telegram

### **GET** `/telegram/search/{username}`
**Описание**: Поиск пользователя Telegram по username

### **POST** `/telegram/verify/{telegramId}`
**Описание**: Верификация пользователя Telegram
```json
{
  "firstName": "Иван",
  "lastName": "Иванов",
  "username": "ivan_telegram",
  "photoUrl": "https://t.me/i/userpic/320/photo.jpg"
}
```

### **POST** `/social/connect`
**Описание**: Подключение социальной сети
```json
{
  "platform": "telegram",
  "username": "ivan_telegram",
  "url": "https://t.me/ivan_telegram",
  "telegramId": "123456789"
}
```

### **GET** `/social/links`
**Описание**: Получение социальных ссылок

### **PUT** `/social/links/{linkId}`
**Описание**: Обновление социальной ссылки
```json
{
  "username": "ivan_telegram",
  "url": "https://t.me/ivan_telegram",
  "verified": true
}
```

### **DELETE** `/social/links/{linkId}`
**Описание**: Удаление социальной ссылки

---

## **⚡ Кэширование**

### **Настройки кэша:**
- **Время жизни**: 5 минут для GET запросов
- **Автоматическая очистка**: 10 минут
- **Инвалидация**: При изменении данных
- **Предзагрузка**: Для часто используемых данных

### **Управление кэшем:**
```typescript
import { clearCache, invalidateQuery } from '@/hooks/use-cache'

// Очистить весь кэш
clearCache()

// Инвалидировать конкретный запрос
invalidateQuery(['products'])
```

---

## **🔧 Обработка ошибок**

### **HTTP статус коды:**
- **200**: Успех
- **400**: Неверный запрос
- **401**: Не авторизован
- **403**: Нет прав доступа
- **404**: Ресурс не найден
- **500**: Ошибка сервера

### **Автоматическая обработка:**
- **401**: Автоматический logout и редирект на логин
- **403**: Уведомление о недостатке прав
- **404**: Уведомление о ненайденном ресурсе
- **500**: Уведомление об ошибке сервера
- **Timeout**: Уведомление о превышении времени ожидания
- **Offline**: Уведомление об отсутствии интернета

---

## **📱 Telegram Mini App**

### **Интеграция:**
- **WebApp SDK**: `@twa-dev/sdk`
- **Haptic Feedback**: Вибрация при взаимодействии
- **Theme**: Автоматическое определение темы
- **User Data**: Получение данных пользователя из Telegram

### **Особенности:**
- **Responsive Design**: Адаптация под мобильные устройства
- **Touch Events**: Оптимизация для сенсорного управления
- **Fast Loading**: Быстрая загрузка и кэширование
- **Offline Support**: Работа в офлайн режиме

---

**Всего endpoints: 80+**  
**Поддержка кэширования: ✅**  
**Telegram Mini App: ✅**  
**TypeScript: ✅**  
**Error Handling: ✅**
