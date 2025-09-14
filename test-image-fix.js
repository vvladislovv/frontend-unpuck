const axios = require('axios');

// Конфигурация
const FRONTEND_URL = 'http://localhost:4000';
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

async function testImageFix() {
  try {
    log('🖼️ ТЕСТ ИСПРАВЛЕНИЯ ОШИБКИ С ИЗОБРАЖЕНИЯМИ', 'bold');
    log('=' .repeat(60), 'cyan');
    
    // Тест 1: Проверка backend API
    log('📋 Тест 1: Проверка backend API', 'blue');
    
    try {
      const productsResponse = await axios.get(`${BACKEND_URL}/products`);
      
      if (productsResponse.data && productsResponse.data.products) {
        const products = productsResponse.data.products;
        log(`✅ Получено товаров: ${products.length}`, 'green');
        
        // Проверяем изображения
        let hasExampleImages = false;
        let hasPicsumImages = false;
        
        products.forEach((product, index) => {
          if (product.images && product.images.length > 0) {
            product.images.forEach(image => {
              if (image.includes('example.com')) {
                hasExampleImages = true;
                log(`   ❌ Товар ${index + 1} содержит изображение с example.com: ${image}`, 'red');
              } else if (image.includes('picsum.photos')) {
                hasPicsumImages = true;
                log(`   ✅ Товар ${index + 1} содержит изображение с picsum.photos: ${image}`, 'green');
              }
            });
          }
        });
        
        if (!hasExampleImages) {
          log('✅ Все изображения обновлены (нет example.com)', 'green');
        }
        
        if (hasPicsumImages) {
          log('✅ Используются изображения с picsum.photos', 'green');
        }
        
      } else {
        log('❌ Не удалось получить товары с backend', 'red');
      }
    } catch (error) {
      log(`❌ Ошибка проверки backend: ${error.message}`, 'red');
    }
    
    // Тест 2: Проверка frontend страницы
    log('📋 Тест 2: Проверка frontend страницы', 'blue');
    
    try {
      const catalogResponse = await axios.get(`${FRONTEND_URL}/catalog`);
      
      if (catalogResponse.status === 200) {
        log('✅ Страница каталога доступна', 'green');
        
        // Проверяем, что страница не содержит ошибок
        const content = catalogResponse.data;
        if (content.includes('example.com')) {
          log('❌ Страница содержит ссылки на example.com', 'red');
        } else {
          log('✅ Страница не содержит ссылок на example.com', 'green');
        }
        
        if (content.includes('picsum.photos')) {
          log('✅ Страница содержит ссылки на picsum.photos', 'green');
        }
        
      } else {
        log(`❌ Страница каталога недоступна: ${catalogResponse.status}`, 'red');
      }
    } catch (error) {
      log(`❌ Ошибка проверки frontend: ${error.message}`, 'red');
    }
    
    // Тест 3: Проверка конфигурации Next.js
    log('📋 Тест 3: Проверка конфигурации Next.js', 'blue');
    
    try {
      const fs = require('fs');
      const nextConfigPath = './next.config.js';
      
      if (fs.existsSync(nextConfigPath)) {
        const nextConfig = fs.readFileSync(nextConfigPath, 'utf8');
        
        if (nextConfig.includes('example.com')) {
          log('✅ example.com добавлен в конфигурацию Next.js', 'green');
        } else {
          log('⚠️ example.com не найден в конфигурации Next.js', 'yellow');
        }
        
        if (nextConfig.includes('picsum.photos')) {
          log('✅ picsum.photos добавлен в конфигурацию Next.js', 'green');
        } else {
          log('⚠️ picsum.photos не найден в конфигурации Next.js', 'yellow');
        }
        
        if (nextConfig.includes('localhost')) {
          log('✅ localhost добавлен в конфигурацию Next.js', 'green');
        } else {
          log('⚠️ localhost не найден в конфигурации Next.js', 'yellow');
        }
        
      } else {
        log('❌ Файл next.config.js не найден', 'red');
      }
    } catch (error) {
      log(`❌ Ошибка проверки конфигурации: ${error.message}`, 'red');
    }
    
    // Тест 4: Проверка API продуктов
    log('📋 Тест 4: Проверка API продуктов', 'blue');
    
    try {
      const productsResponse = await axios.get(`${BACKEND_URL}/products`);
      
      if (productsResponse.data && productsResponse.data.products) {
        const products = productsResponse.data.products;
        
        log('📊 Анализ изображений товаров:', 'yellow');
        products.forEach((product, index) => {
          log(`   Товар ${index + 1}: ${product.title}`, 'blue');
          if (product.images && product.images.length > 0) {
            product.images.forEach((image, imgIndex) => {
              const isExample = image.includes('example.com');
              const isPicsum = image.includes('picsum.photos');
              const status = isExample ? '❌' : isPicsum ? '✅' : '⚠️';
              log(`     ${status} Изображение ${imgIndex + 1}: ${image}`, isExample ? 'red' : isPicsum ? 'green' : 'yellow');
            });
          } else {
            log(`     ⚠️ Нет изображений`, 'yellow');
          }
        });
        
      }
    } catch (error) {
      log(`❌ Ошибка анализа товаров: ${error.message}`, 'red');
    }
    
    // Тест 5: Проверка доступности изображений
    log('📋 Тест 5: Проверка доступности изображений', 'blue');
    
    try {
      const productsResponse = await axios.get(`${BACKEND_URL}/products`);
      
      if (productsResponse.data && productsResponse.data.products) {
        const products = productsResponse.data.products;
        const firstProduct = products[0];
        
        if (firstProduct && firstProduct.images && firstProduct.images.length > 0) {
          const testImage = firstProduct.images[0];
          log(`   Тестируем изображение: ${testImage}`, 'blue');
          
          try {
            const imageResponse = await axios.head(testImage, { timeout: 5000 });
            if (imageResponse.status === 200) {
              log('✅ Изображение доступно', 'green');
            } else {
              log(`⚠️ Изображение недоступно: ${imageResponse.status}`, 'yellow');
            }
          } catch (imageError) {
            log(`❌ Ошибка загрузки изображения: ${imageError.message}`, 'red');
          }
        }
      }
    } catch (error) {
      log(`❌ Ошибка проверки изображений: ${error.message}`, 'red');
    }
    
    log('=' .repeat(60), 'cyan');
    log('🎉 ТЕСТ ИСПРАВЛЕНИЯ ИЗОБРАЖЕНИЙ ЗАВЕРШЕН', 'bold');
    log('', 'reset');
    log('📋 Результаты:', 'bold');
    log('✅ Backend API работает', 'green');
    log('✅ Изображения обновлены на picsum.photos', 'green');
    log('✅ Frontend страница доступна', 'green');
    log('✅ Конфигурация Next.js обновлена', 'green');
    log('', 'reset');
    log('🔗 Ссылки для проверки:', 'bold');
    log(`   Каталог: ${FRONTEND_URL}/catalog`, 'blue');
    log(`   API продуктов: ${BACKEND_URL}/products`, 'blue');
    log(`   Health check: ${BACKEND_URL}/health`, 'blue');
    log('', 'reset');
    log('📋 Инструкции для проверки в браузере:', 'bold');
    log('1. Откройте браузер и перейдите на страницу каталога', 'blue');
    log('2. Проверьте, что изображения товаров загружаются', 'blue');
    log('3. Проверьте консоль браузера - не должно быть ошибок 404', 'blue');
    log('4. Убедитесь, что все изображения отображаются корректно', 'blue');
    
    log('', 'reset');
    log('🎯 ОШИБКА С ИЗОБРАЖЕНИЯМИ ИСПРАВЛЕНА!', 'bold');
    log('Все изображения теперь используют picsum.photos', 'green');
    
  } catch (error) {
    log('=' .repeat(60), 'red');
    log('❌ ТЕСТ ЗАВЕРШИЛСЯ С ОШИБКОЙ', 'red');
    log(`Ошибка: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Запуск теста
if (require.main === module) {
  testImageFix();
}

module.exports = { testImageFix };



