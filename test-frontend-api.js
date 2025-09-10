#!/usr/bin/env node

/**
 * Тест для проверки API вызовов в браузере
 * Запускается в контексте Next.js приложения
 */

const puppeteer = require('puppeteer');

async function testFrontendAPI() {
  console.log('🚀 Запуск тестирования фронтенд API...');
  
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Перехватываем сетевые запросы
  const requests = [];
  const responses = [];
  
  page.on('request', request => {
    if (request.url().includes('/api/')) {
      requests.push({
        url: request.url(),
        method: request.method(),
        headers: request.headers()
      });
    }
  });
  
  page.on('response', response => {
    if (response.url().includes('/api/')) {
      responses.push({
        url: response.url(),
        status: response.status(),
        statusText: response.statusText()
      });
    }
  });
  
  try {
    // Переходим на главную страницу
    console.log('📱 Загружаем главную страницу...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    
    // Ждем загрузки компонентов
    await page.waitForTimeout(3000);
    
    // Переходим на страницу каталога
    console.log('📦 Тестируем каталог...');
    await page.goto('http://localhost:3000/catalog', { waitUntil: 'networkidle0' });
    await page.waitForTimeout(2000);
    
    // Переходим на страницу сделок
    console.log('🤝 Тестируем сделки...');
    await page.goto('http://localhost:3000/deals', { waitUntil: 'networkidle0' });
    await page.waitForTimeout(2000);
    
    // Переходим на страницу статистики
    console.log('📊 Тестируем статистику...');
    await page.goto('http://localhost:3000/statistics', { waitUntil: 'networkidle0' });
    await page.waitForTimeout(2000);
    
    // Переходим на админ панель
    console.log('⚙️ Тестируем админку...');
    await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle0' });
    await page.waitForTimeout(2000);
    
    console.log('\n📊 Результаты тестирования:');
    console.log('='.repeat(50));
    
    if (requests.length === 0) {
      console.log('⚠️  API запросы не обнаружены');
      console.log('   Это может означать, что:');
      console.log('   1. Сервер недоступен и используется fallback на моковые данные');
      console.log('   2. Компоненты не загружаются корректно');
    } else {
      console.log(`✅ Обнаружено ${requests.length} API запросов:`);
      requests.forEach((req, index) => {
        console.log(`   ${index + 1}. ${req.method} ${req.url}`);
      });
      
      console.log(`\n📡 Получено ${responses.length} ответов:`);
      responses.forEach((res, index) => {
        const status = res.status >= 200 && res.status < 300 ? '✅' : '❌';
        console.log(`   ${index + 1}. ${status} ${res.status} ${res.url}`);
      });
    }
    
    // Проверяем консольные ошибки
    const errors = await page.evaluate(() => {
      return window.consoleErrors || [];
    });
    
    if (errors.length > 0) {
      console.log('\n❌ Ошибки в консоли:');
      errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error}`);
      });
    } else {
      console.log('\n✅ Ошибок в консоли не обнаружено');
    }
    
  } catch (error) {
    console.error('❌ Ошибка тестирования:', error.message);
  } finally {
    await browser.close();
  }
}

// Запуск теста
if (require.main === module) {
  testFrontendAPI().catch(console.error);
}

module.exports = { testFrontendAPI };
