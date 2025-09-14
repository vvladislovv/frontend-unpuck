const axios = require('axios');

// Конфигурация
const BACKEND_URL = 'http://localhost:3000';

// Цвета для консоли
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testBackendLogs() {
  try {
    log('🔍 ТЕСТ BACKEND ЛОГОВ ДЛЯ ПРОВЕРКИ КОЛИЧЕСТВА ТОВАРОВ', 'bold');
    log('=' .repeat(60), 'cyan');
    
    log('📋 Инструкция: Смотрите логи backend в другом терминале!', 'yellow');
    log('   Backend должен показывать детальные логи запросов к /products', 'blue');
    log('', 'reset');
    
    // Тест 1: Базовый запрос без параметров
    log('📋 Тест 1: Базовый запрос без параметров', 'blue');
    try {
      const response = await axios.get(`${BACKEND_URL}/products`);
      
      if (response.data) {
        log(`✅ Получен ответ: ${response.data.products.length} товаров`, 'green');
        log(`📊 Пагинация: ${response.data.pagination.total} всего, страница ${response.data.pagination.page}/${response.data.pagination.pages}`, 'blue');
        
        // Показываем первые товары
        response.data.products.slice(0, 3).forEach((product, index) => {
          log(`   ${index + 1}. ${product.title} - ${product.price} ₽`, 'blue');
        });
      }
    } catch (error) {
      log(`❌ Ошибка: ${error.message}`, 'red');
    }
    
    // Тест 2: Запрос с лимитом
    log('📋 Тест 2: Запрос с лимитом 5', 'blue');
    try {
      const response = await axios.get(`${BACKEND_URL}/products?limit=5`);
      
      if (response.data) {
        log(`✅ Получен ответ: ${response.data.products.length} товаров`, 'green');
        log(`📊 Пагинация: ${response.data.pagination.total} всего, страница ${response.data.pagination.page}/${response.data.pagination.pages}`, 'blue');
      }
    } catch (error) {
      log(`❌ Ошибка: ${error.message}`, 'red');
    }
    
    // Тест 3: Запрос второй страницы
    log('📋 Тест 3: Запрос второй страницы', 'blue');
    try {
      const response = await axios.get(`${BACKEND_URL}/products?page=2&limit=5`);
      
      if (response.data) {
        log(`✅ Получен ответ: ${response.data.products.length} товаров`, 'green');
        log(`📊 Пагинация: ${response.data.pagination.total} всего, страница ${response.data.pagination.page}/${response.data.pagination.pages}`, 'blue');
      }
    } catch (error) {
      log(`❌ Ошибка: ${error.message}`, 'red');
    }
    
    // Тест 4: Запрос с поиском
    log('📋 Тест 4: Запрос с поиском "товар"', 'blue');
    try {
      const response = await axios.get(`${BACKEND_URL}/products?search=товар`);
      
      if (response.data) {
        log(`✅ Получен ответ: ${response.data.products.length} товаров`, 'green');
        log(`📊 Пагинация: ${response.data.pagination.total} всего, страница ${response.data.pagination.page}/${response.data.pagination.pages}`, 'blue');
      }
    } catch (error) {
      log(`❌ Ошибка: ${error.message}`, 'red');
    }
    
    // Тест 5: Запрос с категорией
    log('📋 Тест 5: Запрос с категорией "Красота"', 'blue');
    try {
      const response = await axios.get(`${BACKEND_URL}/products?category=Красота`);
      
      if (response.data) {
        log(`✅ Получен ответ: ${response.data.products.length} товаров`, 'green');
        log(`📊 Пагинация: ${response.data.pagination.total} всего, страница ${response.data.pagination.page}/${response.data.pagination.pages}`, 'blue');
      }
    } catch (error) {
      log(`❌ Ошибка: ${error.message}`, 'red');
    }
    
    // Тест 6: Запрос всех товаров без пагинации
    log('📋 Тест 6: Запрос всех товаров (большой лимит)', 'blue');
    try {
      const response = await axios.get(`${BACKEND_URL}/products?limit=100`);
      
      if (response.data) {
        log(`✅ Получен ответ: ${response.data.products.length} товаров`, 'green');
        log(`📊 Пагинация: ${response.data.pagination.total} всего, страница ${response.data.pagination.page}/${response.data.pagination.pages}`, 'blue');
        
        // Показываем все категории
        const categories = [...new Set(response.data.products.map(p => p.category))];
        log(`📂 Категории: ${categories.join(', ')}`, 'blue');
        
        // Показываем все бренды
        const brands = [...new Set(response.data.products.map(p => p.brand))];
        log(`🏷️ Бренды: ${brands.join(', ')}`, 'blue');
      }
    } catch (error) {
      log(`❌ Ошибка: ${error.message}`, 'red');
    }
    
    log('=' .repeat(60), 'cyan');
    log('🎉 ТЕСТ BACKEND ЛОГОВ ЗАВЕРШЕН', 'bold');
    log('', 'reset');
    log('📋 Что проверить в логах backend:', 'bold');
    log('1. Должны быть логи "🔍 Products query started"', 'blue');
    log('2. Должны быть логи "📦 Found X products out of Y total"', 'blue');
    log('3. Должны быть логи "📊 RESPONSE: Returning X products"', 'blue');
    log('4. Должны быть детали каждого товара', 'blue');
    log('5. Должна быть информация о пагинации', 'blue');
    log('', 'reset');
    log('🔗 Команда для просмотра логов backend:', 'bold');
    log('   В терминале с backend смотрите логи в реальном времени', 'blue');
    log('   Или проверьте файлы логов, если они настроены', 'blue');
    
  } catch (error) {
    log('=' .repeat(60), 'red');
    log('❌ ТЕСТ ЗАВЕРШИЛСЯ С ОШИБКОЙ', 'red');
    log(`Ошибка: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Запуск теста
if (require.main === module) {
  testBackendLogs();
}

module.exports = { testBackendLogs };



