const axios = require('axios');

// Конфигурация
const FRONTEND_URL = 'http://localhost:3001';
const BACKEND_URL = 'http://localhost:3000';

// Глобальные переменные для тестирования
let authToken = '';
let testUserId = '';

// Функция для логирования
const log = (message, data = null) => {
  console.log(`\n🔍 ${message}`);
  if (data) {
    console.log(JSON.stringify(data, null, 2));
  }
};

// Функция для тестирования API endpoint
const testEndpoint = async (name, method, url, data = null, headers = {}) => {
  try {
    log(`Testing ${name}`, { method, url, data });
    
    const config = {
      method,
      url: `${BACKEND_URL}${url}`,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };
    
    if (data) {
      config.data = data;
    }
    
    const response = await axios(config);
    
    log(`✅ ${name} - SUCCESS`, {
      status: response.status,
      data: response.data
    });
    
    return response.data;
  } catch (error) {
    log(`❌ ${name} - ERROR`, {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      data: error.response?.data
    });
    throw error;
  }
};

// Тесты аутентификации
const testAuth = async () => {
  log('=== TESTING AUTHENTICATION ===');
  
  try {
    // Регистрация пользователя
    const timestamp = Date.now();
    const registerData = await testEndpoint(
      'User Registration',
      'POST',
      '/auth/register',
      {
        username: `testuser${timestamp}`,
        email: `test${timestamp}@example.com`,
        password: 'password123',
        firstName: 'Test',
        lastName: 'User'
      }
    );
    
    authToken = registerData.token;
    testUserId = registerData.user.id;
    
    // Вход в систему
    const loginData = await testEndpoint(
      'User Login',
      'POST',
      '/auth/login',
      {
        identifier: `testuser${timestamp}`,
        password: 'password123'
      }
    );
    
    authToken = loginData.token;
    
    // Получение профиля
    await testEndpoint(
      'Get Profile',
      'GET',
      '/auth/me',
      null,
      { Authorization: `Bearer ${authToken}` }
    );
    
    log('✅ Authentication tests completed successfully');
    return true;
  } catch (error) {
    log('❌ Authentication tests failed', error.message);
    return false;
  }
};

// Тесты товаров
const testProducts = async () => {
  log('=== TESTING PRODUCTS ===');
  
  try {
    // Создание товара
    const timestamp = Date.now();
    const productData = await testEndpoint(
      'Create Product',
      'POST',
      '/products',
      {
        wbArticle: `WB${timestamp}`,
        title: `Test Product ${timestamp}`,
        description: 'Test product description',
        price: 1000,
        category: 'Electronics',
        brand: 'TestBrand'
      },
      { Authorization: `Bearer ${authToken}` }
    );
    
    // Получение всех товаров
    await testEndpoint(
      'Get All Products',
      'GET',
      '/products',
      null,
      { Authorization: `Bearer ${authToken}` }
    );
    
    // Получение товара по ID
    await testEndpoint(
      'Get Product by ID',
      'GET',
      `/products/${productData.id}`,
      null,
      { Authorization: `Bearer ${authToken}` }
    );
    
    // Получение моих товаров
    await testEndpoint(
      'Get My Products',
      'GET',
      '/products/my/products',
      null,
      { Authorization: `Bearer ${authToken}` }
    );
    
    log('✅ Products tests completed successfully');
    return true;
  } catch (error) {
    log('❌ Products tests failed', error.message);
    return false;
  }
};

// Тесты сделок
const testDeals = async () => {
  log('=== TESTING DEALS ===');
  
  try {
    // Получение моих сделок
    await testEndpoint(
      'Get My Deals',
      'GET',
      '/deals/my/deals',
      null,
      { Authorization: `Bearer ${authToken}` }
    );
    
    // Получение всех сделок
    await testEndpoint(
      'Get All Deals',
      'GET',
      '/deals',
      null,
      { Authorization: `Bearer ${authToken}` }
    );
    
    log('✅ Deals tests completed successfully');
    return true;
  } catch (error) {
    log('❌ Deals tests failed', error.message);
    return false;
  }
};

// Тесты транзакций
const testTransactions = async () => {
  log('=== TESTING TRANSACTIONS ===');
  
  try {
    // Получение транзакций
    await testEndpoint(
      'Get Transactions',
      'GET',
      '/transactions',
      null,
      { Authorization: `Bearer ${authToken}` }
    );
    
    // Получение всех данных транзакций
    await testEndpoint(
      'Get All Transaction Data',
      'GET',
      '/transactions/all-data',
      null,
      { Authorization: `Bearer ${authToken}` }
    );
    
    // Получение статистики транзакций
    await testEndpoint(
      'Get Transaction Stats',
      'GET',
      '/transactions/stats',
      { period: '30d' },
      { Authorization: `Bearer ${authToken}` }
    );
    
    log('✅ Transactions tests completed successfully');
    return true;
  } catch (error) {
    log('❌ Transactions tests failed', error.message);
    return false;
  }
};

// Тесты платежей
const testPayments = async () => {
  log('=== TESTING PAYMENTS ===');
  
  try {
    // Создание платежа
    const paymentData = await testEndpoint(
      'Create Payment',
      'POST',
      '/payment/create',
      {
        amount: 1000,
        paymentMethod: 'card',
        description: 'Test payment',
        metadata: {
          productId: 'test-product-id',
          quantity: 1
        }
      },
      { Authorization: `Bearer ${authToken}` }
    );
    
    // Получение платежа
    await testEndpoint(
      'Get Payment',
      'GET',
      `/payment/${paymentData.id}`,
      null,
      { Authorization: `Bearer ${authToken}` }
    );
    
    log('✅ Payments tests completed successfully');
    return true;
  } catch (error) {
    log('❌ Payments tests failed', error.message);
    return false;
  }
};

// Тесты кампаний
const testCampaigns = async () => {
  log('=== TESTING CAMPAIGNS ===');
  
  try {
    // Получение всех кампаний
    await testEndpoint(
      'Get All Campaigns',
      'GET',
      '/campaigns',
      null,
      { Authorization: `Bearer ${authToken}` }
    );
    
    // Получение моих кампаний
    await testEndpoint(
      'Get My Campaigns',
      'GET',
      '/campaigns/my/campaigns',
      null,
      { Authorization: `Bearer ${authToken}` }
    );
    
    log('✅ Campaigns tests completed successfully');
    return true;
  } catch (error) {
    log('❌ Campaigns tests failed', error.message);
    return false;
  }
};

// Тесты академии
const testAcademy = async () => {
  log('=== TESTING ACADEMY ===');
  
  try {
    // Получение курсов
    await testEndpoint(
      'Get Courses',
      'GET',
      '/academy/courses',
      null,
      { Authorization: `Bearer ${authToken}` }
    );
    
    // Получение прогресса
    await testEndpoint(
      'Get Progress',
      'GET',
      '/academy/progress',
      null,
      { Authorization: `Bearer ${authToken}` }
    );
    
    log('✅ Academy tests completed successfully');
    return true;
  } catch (error) {
    log('❌ Academy tests failed', error.message);
    return false;
  }
};

// Тесты статистики
const testStatistics = async () => {
  log('=== TESTING STATISTICS ===');
  
  try {
    // Получение статистики пользователя
    await testEndpoint(
      'Get User Statistics',
      'GET',
      '/statistics/user',
      { period: '30d' },
      { Authorization: `Bearer ${authToken}` }
    );
    
    // Получение статистики продаж
    await testEndpoint(
      'Get Sales Statistics',
      'GET',
      '/statistics/sales',
      null,
      { Authorization: `Bearer ${authToken}` }
    );
    
    log('✅ Statistics tests completed successfully');
    return true;
  } catch (error) {
    log('❌ Statistics tests failed', error.message);
    return false;
  }
};

// Тесты пользователей
const testUsers = async () => {
  log('=== TESTING USERS ===');
  
  try {
    // Получение пользователя по ID
    await testEndpoint(
      'Get User by ID',
      'GET',
      `/users/${testUserId}`,
      null,
      { Authorization: `Bearer ${authToken}` }
    );
    
    // Обновление профиля
    await testEndpoint(
      'Update Profile',
      'PUT',
      '/users/profile',
      {
        firstName: 'Updated Test',
        lastName: 'Updated User'
      },
      { Authorization: `Bearer ${authToken}` }
    );
    
    // Получение рефералов
    await testEndpoint(
      'Get Referrals',
      'GET',
      '/users/referrals',
      null,
      { Authorization: `Bearer ${authToken}` }
    );
    
    // Получение баланса
    await testEndpoint(
      'Get Balance',
      'GET',
      '/users/balance',
      null,
      { Authorization: `Bearer ${authToken}` }
    );
    
    // Получение уведомлений
    await testEndpoint(
      'Get Notifications',
      'GET',
      '/users/notifications',
      null,
      { Authorization: `Bearer ${authToken}` }
    );
    
    log('✅ Users tests completed successfully');
    return true;
  } catch (error) {
    log('❌ Users tests failed', error.message);
    return false;
  }
};

// Тесты чатов
const testChats = async () => {
  log('=== TESTING CHATS ===');
  
  try {
    // Получение чатов
    await testEndpoint(
      'Get Chats',
      'GET',
      '/chat/chats',
      null,
      { Authorization: `Bearer ${authToken}` }
    );
    
    log('✅ Chats tests completed successfully');
    return true;
  } catch (error) {
    log('❌ Chats tests failed', error.message);
    return false;
  }
};

// Основная функция тестирования
const runTests = async () => {
  log('🚀 Starting Frontend API Tests...');
  
  const results = {
    auth: false,
    products: false,
    deals: false,
    transactions: false,
    payments: false,
    campaigns: false,
    academy: false,
    statistics: false,
    users: false,
    chats: false
  };
  
  try {
    // Тестируем аутентификацию
    results.auth = await testAuth();
    
    if (results.auth) {
      // Тестируем остальные модули
      results.products = await testProducts();
      results.deals = await testDeals();
      results.transactions = await testTransactions();
      results.payments = await testPayments();
      results.campaigns = await testCampaigns();
      results.academy = await testAcademy();
      results.statistics = await testStatistics();
      results.users = await testUsers();
      results.chats = await testChats();
    }
    
    // Выводим результаты
    log('=== TEST RESULTS ===');
    Object.entries(results).forEach(([module, success]) => {
      log(`${success ? '✅' : '❌'} ${module.toUpperCase()}: ${success ? 'PASSED' : 'FAILED'}`);
    });
    
    const passedCount = Object.values(results).filter(Boolean).length;
    const totalCount = Object.keys(results).length;
    
    log(`\n📊 SUMMARY: ${passedCount}/${totalCount} modules passed`);
    
    if (passedCount === totalCount) {
      log('🎉 ALL TESTS PASSED! Frontend is ready for production.');
    } else {
      log('⚠️ Some tests failed. Check the logs above for details.');
    }
    
  } catch (error) {
    log('💥 TESTS FAILED', error.message);
  }
};

// Запускаем тесты
runTests();
