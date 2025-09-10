#!/usr/bin/env node

/**
 * Скрипт для тестирования всех API endpoints приложения Unpacker Clone
 * 
 * Использование:
 * node test-api.js [baseUrl]
 * 
 * Примеры:
 * node test-api.js http://localhost:3001
 * node test-api.js https://api.unpacker-clone.com
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Конфигурация
const BASE_URL = process.argv[2] || 'http://localhost:3001';
const API_BASE = `${BASE_URL}/api`;

// Цвета для консоли
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Результаты тестов
const testResults = {
  passed: 0,
  failed: 0,
  total: 0,
  details: []
};

// Утилиты
const log = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

const logTest = (testName, status, details = '') => {
  const statusColor = status === 'PASS' ? 'green' : 'red';
  const statusSymbol = status === 'PASS' ? '✓' : '✗';
  
  log(`${statusSymbol} ${testName}`, statusColor);
  if (details) {
    log(`  ${details}`, 'yellow');
  }
  
  testResults.total++;
  if (status === 'PASS') {
    testResults.passed++;
  } else {
    testResults.failed++;
  }
  
  testResults.details.push({
    name: testName,
    status,
    details
  });
};

// Создание axios instance
const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Переменные для хранения данных между тестами
let authToken = null;
let userId = null;
let productId = null;
let dealId = null;
let messageId = null;

// Тестовые данные
const testData = {
  user: {
    firstName: 'Тест',
    lastName: 'Пользователь',
    email: 'test@example.com',
    username: 'testuser',
    password: 'testpassword123',
    role: 'buyer'
  },
  product: {
    wbArticle: 'TEST123456',
    title: 'Тестовый товар',
    description: 'Описание тестового товара',
    price: 1000,
    images: ['https://via.placeholder.com/300x300'],
    category: 'electronics',
    brand: 'TestBrand'
  },
  deal: {
    productId: null, // будет установлен после создания товара
    quantity: 1,
    totalPrice: 1000
  }
};

// Функции для тестирования API

async function testAuthEndpoints() {
  log('\n🔐 Тестирование аутентификации...', 'cyan');
  
  try {
    // Тест регистрации
    const registerResponse = await api.post('/auth/register', testData.user);
    if (registerResponse.status === 200 || registerResponse.status === 201) {
      logTest('POST /auth/register', 'PASS', 'Регистрация пользователя');
      authToken = registerResponse.data.token || registerResponse.data.data?.token;
      userId = registerResponse.data.userId || registerResponse.data.data?.id;
    } else {
      logTest('POST /auth/register', 'FAIL', `Статус: ${registerResponse.status}`);
    }
  } catch (error) {
    if (error.response?.status === 409) {
      logTest('POST /auth/register', 'PASS', 'Пользователь уже существует');
    } else {
      logTest('POST /auth/register', 'FAIL', error.response?.data?.message || error.message);
    }
  }

  try {
    // Тест входа
    const loginResponse = await api.post('/auth/login', {
      identifier: testData.user.email,
      password: testData.user.password
    });
    if (loginResponse.status === 200) {
      logTest('POST /auth/login', 'PASS', 'Вход в систему');
      authToken = loginResponse.data.token || loginResponse.data.data?.token;
      userId = loginResponse.data.userId || loginResponse.data.data?.id;
    } else {
      logTest('POST /auth/login', 'FAIL', `Статус: ${loginResponse.status}`);
    }
  } catch (error) {
    logTest('POST /auth/login', 'FAIL', error.response?.data?.message || error.message);
  }

  // Установка токена для последующих запросов
  if (authToken) {
    api.defaults.headers.Authorization = `Bearer ${authToken}`;
  }

  try {
    // Тест получения профиля
    const profileResponse = await api.get('/auth/me');
    if (profileResponse.status === 200) {
      logTest('GET /auth/me', 'PASS', 'Получение профиля пользователя');
    } else {
      logTest('GET /auth/me', 'FAIL', `Статус: ${profileResponse.status}`);
    }
  } catch (error) {
    logTest('GET /auth/me', 'FAIL', error.response?.data?.message || error.message);
  }
}

async function testUserEndpoints() {
  log('\n👤 Тестирование пользователей...', 'cyan');
  
  try {
    // Тест обновления профиля
    const updateResponse = await api.put('/users/profile', {
      firstName: 'Обновленное Имя',
      lastName: 'Обновленная Фамилия'
    });
    if (updateResponse.status === 200) {
      logTest('PUT /users/profile', 'PASS', 'Обновление профиля');
    } else {
      logTest('PUT /users/profile', 'FAIL', `Статус: ${updateResponse.status}`);
    }
  } catch (error) {
    logTest('PUT /users/profile', 'FAIL', error.response?.data?.message || error.message);
  }

  try {
    // Тест получения рефералов
    const referralsResponse = await api.get('/users/referrals');
    if (referralsResponse.status === 200) {
      logTest('GET /users/referrals', 'PASS', 'Получение рефералов');
    } else {
      logTest('GET /users/referrals', 'FAIL', `Статус: ${referralsResponse.status}`);
    }
  } catch (error) {
    logTest('GET /users/referrals', 'FAIL', error.response?.data?.message || error.message);
  }

  try {
    // Тест получения баланса
    const balanceResponse = await api.get('/users/balance');
    if (balanceResponse.status === 200) {
      logTest('GET /users/balance', 'PASS', 'Получение баланса');
    } else {
      logTest('GET /users/balance', 'FAIL', `Статус: ${balanceResponse.status}`);
    }
  } catch (error) {
    logTest('GET /users/balance', 'FAIL', error.response?.data?.message || error.message);
  }

  try {
    // Тест получения уведомлений
    const notificationsResponse = await api.get('/users/notifications');
    if (notificationsResponse.status === 200) {
      logTest('GET /users/notifications', 'PASS', 'Получение уведомлений');
    } else {
      logTest('GET /users/notifications', 'FAIL', `Статус: ${notificationsResponse.status}`);
    }
  } catch (error) {
    logTest('GET /users/notifications', 'FAIL', error.response?.data?.message || error.message);
  }
}

async function testProductEndpoints() {
  log('\n📦 Тестирование товаров...', 'cyan');
  
  try {
    // Тест получения списка товаров
    const productsResponse = await api.get('/products');
    if (productsResponse.status === 200) {
      logTest('GET /products', 'PASS', 'Получение списка товаров');
    } else {
      logTest('GET /products', 'FAIL', `Статус: ${productsResponse.status}`);
    }
  } catch (error) {
    logTest('GET /products', 'FAIL', error.response?.data?.message || error.message);
  }

  try {
    // Тест создания товара
    const createResponse = await api.post('/products', testData.product);
    if (createResponse.status === 200 || createResponse.status === 201) {
      logTest('POST /products', 'PASS', 'Создание товара');
      productId = createResponse.data.id || createResponse.data.data?.id;
      testData.deal.productId = productId;
    } else {
      logTest('POST /products', 'FAIL', `Статус: ${createResponse.status}`);
    }
  } catch (error) {
    logTest('POST /products', 'FAIL', error.response?.data?.message || error.message);
  }

  if (productId) {
    try {
      // Тест получения товара по ID
      const productResponse = await api.get(`/products/${productId}`);
      if (productResponse.status === 200) {
        logTest('GET /products/:id', 'PASS', 'Получение товара по ID');
      } else {
        logTest('GET /products/:id', 'FAIL', `Статус: ${productResponse.status}`);
      }
    } catch (error) {
      logTest('GET /products/:id', 'FAIL', error.response?.data?.message || error.message);
    }

    try {
      // Тест обновления товара
      const updateResponse = await api.put(`/products/${productId}`, {
        title: 'Обновленный товар',
        price: 1500
      });
      if (updateResponse.status === 200) {
        logTest('PUT /products/:id', 'PASS', 'Обновление товара');
      } else {
        logTest('PUT /products/:id', 'FAIL', `Статус: ${updateResponse.status}`);
      }
    } catch (error) {
      logTest('PUT /products/:id', 'FAIL', error.response?.data?.message || error.message);
    }
  }

  try {
    // Тест получения товаров пользователя
    const myProductsResponse = await api.get('/products/my/products');
    if (myProductsResponse.status === 200) {
      logTest('GET /products/my/products', 'PASS', 'Получение товаров пользователя');
    } else {
      logTest('GET /products/my/products', 'FAIL', `Статус: ${myProductsResponse.status}`);
    }
  } catch (error) {
    logTest('GET /products/my/products', 'FAIL', error.response?.data?.message || error.message);
  }
}

async function testDealEndpoints() {
  log('\n🤝 Тестирование сделок...', 'cyan');
  
  try {
    // Тест получения списка сделок
    const dealsResponse = await api.get('/deals');
    if (dealsResponse.status === 200) {
      logTest('GET /deals', 'PASS', 'Получение списка сделок');
    } else {
      logTest('GET /deals', 'FAIL', `Статус: ${dealsResponse.status}`);
    }
  } catch (error) {
    logTest('GET /deals', 'FAIL', error.response?.data?.message || error.message);
  }

  if (productId) {
    try {
      // Тест создания сделки
      const createResponse = await api.post('/deals', testData.deal);
      if (createResponse.status === 200 || createResponse.status === 201) {
        logTest('POST /deals', 'PASS', 'Создание сделки');
        dealId = createResponse.data.id || createResponse.data.data?.id;
      } else {
        logTest('POST /deals', 'FAIL', `Статус: ${createResponse.status}`);
      }
    } catch (error) {
      logTest('POST /deals', 'FAIL', error.response?.data?.message || error.message);
    }

    if (dealId) {
      try {
        // Тест получения сделки по ID
        const dealResponse = await api.get(`/deals/${dealId}`);
        if (dealResponse.status === 200) {
          logTest('GET /deals/:id', 'PASS', 'Получение сделки по ID');
        } else {
          logTest('GET /deals/:id', 'FAIL', `Статус: ${dealResponse.status}`);
        }
      } catch (error) {
        logTest('GET /deals/:id', 'FAIL', error.response?.data?.message || error.message);
      }
    }
  }
}

async function testPaymentEndpoints() {
  log('\n💳 Тестирование платежей...', 'cyan');
  
  if (productId) {
    try {
      // Тест создания платежа
      const paymentResponse = await api.post('/payment/create', {
        productId: productId,
        quantity: 1,
        totalPrice: 1000,
        userId: userId
      });
      if (paymentResponse.status === 200 || paymentResponse.status === 201) {
        logTest('POST /payment/create', 'PASS', 'Создание платежа');
      } else {
        logTest('POST /payment/create', 'FAIL', `Статус: ${paymentResponse.status}`);
      }
    } catch (error) {
      logTest('POST /payment/create', 'FAIL', error.response?.data?.message || error.message);
    }
  }
}

async function testAdminEndpoints() {
  log('\n⚙️ Тестирование админки...', 'cyan');
  
  try {
    // Тест получения статистики
    const statsResponse = await api.get('/admin/stats');
    if (statsResponse.status === 200) {
      logTest('GET /admin/stats', 'PASS', 'Получение статистики');
    } else {
      logTest('GET /admin/stats', 'FAIL', `Статус: ${statsResponse.status}`);
    }
  } catch (error) {
    logTest('GET /admin/stats', 'FAIL', error.response?.data?.message || error.message);
  }

  try {
    // Тест получения сообщений
    const messagesResponse = await api.get('/admin/messages');
    if (messagesResponse.status === 200) {
      logTest('GET /admin/messages', 'PASS', 'Получение сообщений');
    } else {
      logTest('GET /admin/messages', 'FAIL', `Статус: ${messagesResponse.status}`);
    }
  } catch (error) {
    logTest('GET /admin/messages', 'FAIL', error.response?.data?.message || error.message);
  }

  try {
    // Тест получения пользователей
    const usersResponse = await api.get('/admin/users');
    if (usersResponse.status === 200) {
      logTest('GET /admin/users', 'PASS', 'Получение пользователей');
    } else {
      logTest('GET /admin/users', 'FAIL', `Статус: ${usersResponse.status}`);
    }
  } catch (error) {
    logTest('GET /admin/users', 'FAIL', error.response?.data?.message || error.message);
  }
}

async function testChatEndpoints() {
  log('\n💬 Тестирование чата...', 'cyan');
  
  try {
    // Тест получения чатов
    const chatsResponse = await api.get('/chat/chats');
    if (chatsResponse.status === 200) {
      logTest('GET /chat/chats', 'PASS', 'Получение чатов');
    } else {
      logTest('GET /chat/chats', 'FAIL', `Статус: ${chatsResponse.status}`);
    }
  } catch (error) {
    logTest('GET /chat/chats', 'FAIL', error.response?.data?.message || error.message);
  }

  try {
    // Тест создания чата
    const createChatResponse = await api.post('/chat/chats', {
      name: 'Тестовый чат',
      isGroup: false,
      participantIds: [userId]
    });
    if (createChatResponse.status === 200 || createChatResponse.status === 201) {
      logTest('POST /chat/chats', 'PASS', 'Создание чата');
      const chatId = createChatResponse.data.id || createChatResponse.data.data?.id;
      
      if (chatId) {
        try {
          // Тест отправки сообщения
          const messageResponse = await api.post(`/chat/chats/${chatId}/messages`, {
            content: 'Тестовое сообщение',
            type: 'TEXT'
          });
          if (messageResponse.status === 200 || messageResponse.status === 201) {
            logTest('POST /chat/chats/:id/messages', 'PASS', 'Отправка сообщения');
          } else {
            logTest('POST /chat/chats/:id/messages', 'FAIL', `Статус: ${messageResponse.status}`);
          }
        } catch (error) {
          logTest('POST /chat/chats/:id/messages', 'FAIL', error.response?.data?.message || error.message);
        }
      }
    } else {
      logTest('POST /chat/chats', 'FAIL', `Статус: ${createChatResponse.status}`);
    }
  } catch (error) {
    logTest('POST /chat/chats', 'FAIL', error.response?.data?.message || error.message);
  }
}

async function testTransactionEndpoints() {
  log('\n💰 Тестирование транзакций...', 'cyan');
  
  try {
    // Тест получения транзакций
    const transactionsResponse = await api.get('/transactions');
    if (transactionsResponse.status === 200) {
      logTest('GET /transactions', 'PASS', 'Получение транзакций');
    } else {
      logTest('GET /transactions', 'FAIL', `Статус: ${transactionsResponse.status}`);
    }
  } catch (error) {
    logTest('GET /transactions', 'FAIL', error.response?.data?.message || error.message);
  }

  try {
    // Тест получения статистики транзакций
    const statsResponse = await api.get('/transactions/stats');
    if (statsResponse.status === 200) {
      logTest('GET /transactions/stats', 'PASS', 'Получение статистики транзакций');
    } else {
      logTest('GET /transactions/stats', 'FAIL', `Статус: ${statsResponse.status}`);
    }
  } catch (error) {
    logTest('GET /transactions/stats', 'FAIL', error.response?.data?.message || error.message);
  }
}

async function testUploadEndpoints() {
  log('\n📁 Тестирование загрузки файлов...', 'cyan');
  
  // Создаем тестовый файл
  const testFileContent = 'Тестовое содержимое файла';
  const testFile = new Blob([testFileContent], { type: 'text/plain' });
  const formData = new FormData();
  formData.append('file', testFile, 'test.txt');
  
  try {
    // Тест загрузки файла
    const uploadResponse = await api.post('/upload/file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    if (uploadResponse.status === 200 || uploadResponse.status === 201) {
      logTest('POST /upload/file', 'PASS', 'Загрузка файла');
    } else {
      logTest('POST /upload/file', 'FAIL', `Статус: ${uploadResponse.status}`);
    }
  } catch (error) {
    logTest('POST /upload/file', 'FAIL', error.response?.data?.message || error.message);
  }
}

async function cleanup() {
  log('\n🧹 Очистка тестовых данных...', 'yellow');
  
  if (productId) {
    try {
      await api.delete(`/products/${productId}`);
      logTest('DELETE /products/:id', 'PASS', 'Удаление тестового товара');
    } catch (error) {
      logTest('DELETE /products/:id', 'FAIL', error.response?.data?.message || error.message);
    }
  }

  if (authToken) {
    try {
      await api.post('/auth/logout');
      logTest('POST /auth/logout', 'PASS', 'Выход из системы');
    } catch (error) {
      logTest('POST /auth/logout', 'FAIL', error.response?.data?.message || error.message);
    }
  }
}

function generateReport() {
  log('\n📊 Отчет о тестировании API', 'bright');
  log('='.repeat(50), 'cyan');
  
  log(`\nВсего тестов: ${testResults.total}`, 'bright');
  log(`Прошло: ${testResults.passed}`, 'green');
  log(`Провалено: ${testResults.failed}`, 'red');
  
  const successRate = ((testResults.passed / testResults.total) * 100).toFixed(1);
  log(`Процент успеха: ${successRate}%`, successRate > 80 ? 'green' : 'yellow');
  
  if (testResults.failed > 0) {
    log('\n❌ Проваленные тесты:', 'red');
    testResults.details
      .filter(test => test.status === 'FAIL')
      .forEach(test => {
        log(`  • ${test.name}: ${test.details}`, 'red');
      });
  }
  
  // Сохранение отчета в файл
  const reportData = {
    timestamp: new Date().toISOString(),
    baseUrl: BASE_URL,
    summary: {
      total: testResults.total,
      passed: testResults.passed,
      failed: testResults.failed,
      successRate: parseFloat(successRate)
    },
    details: testResults.details
  };
  
  const reportPath = path.join(__dirname, 'api-test-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
  log(`\n📄 Отчет сохранен в: ${reportPath}`, 'cyan');
}

// Основная функция
async function main() {
  log('🚀 Запуск тестирования API Unpacker Clone', 'bright');
  log(`🌐 Базовый URL: ${BASE_URL}`, 'cyan');
  log('='.repeat(50), 'cyan');
  
  try {
    // Проверка доступности сервера
    await api.get('/health').catch(() => {
      log('⚠️  Сервер недоступен, но продолжаем тестирование...', 'yellow');
    });
    
    // Запуск тестов
    await testAuthEndpoints();
    await testUserEndpoints();
    await testProductEndpoints();
    await testDealEndpoints();
    await testPaymentEndpoints();
    await testAdminEndpoints();
    await testChatEndpoints();
    await testTransactionEndpoints();
    await testUploadEndpoints();
    
    // Очистка
    await cleanup();
    
    // Генерация отчета
    generateReport();
    
  } catch (error) {
    log(`\n💥 Критическая ошибка: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Запуск скрипта
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  testAuthEndpoints,
  testUserEndpoints,
  testProductEndpoints,
  testDealEndpoints,
  testPaymentEndpoints,
  testAdminEndpoints,
  testChatEndpoints,
  testTransactionEndpoints,
  testUploadEndpoints
};
