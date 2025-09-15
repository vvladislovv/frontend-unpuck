const axios = require('axios');

async function testFrontendStatistics() {
  try {
    console.log('🧪 Тестируем фронтенд статистики...');
    
    // Сначала авторизуемся
    console.log('🔐 Авторизуемся...');
    
    const loginResponse = await axios.post('http://localhost:3000/auth/login', {
      identifier: 'user1@test.com',
      password: 'user1123'
    });
    
    const token = loginResponse.data.access_token;
    console.log('✅ Авторизован, токен получен');
    
    // Теперь тестируем эндпоинт статистики
    console.log('\n📊 Тестируем эндпоинт статистики...');
    
    const statsResponse = await axios.get('http://localhost:3000/statistics/user?period=30d', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Статистика получена:');
    console.log(JSON.stringify(statsResponse.data, null, 2));
    
    // Анализируем данные
    const stats = statsResponse.data;
    console.log('\n📋 Анализ данных для фронтенда:');
    console.log(`- Всего продуктов: ${stats.totalProducts}`);
    console.log(`- Активных продуктов: ${stats.activeProducts}`);
    console.log(`- Всего сделок: ${stats.totalDeals}`);
    console.log(`- Завершенных сделок: ${stats.completedDeals}`);
    console.log(`- Доходы: ₽${stats.totalRevenue}`);
    console.log(`- Расходы: ₽${stats.totalSpent}`);
    console.log(`- Всего рефералов: ${stats.totalReferrals}`);
    console.log(`- Заработано с рефералов: ₽${stats.referralEarnings}`);
    console.log(`- Всего транзакций: ${stats.totalTransactions}`);
    console.log(`- Завершенных транзакций: ${stats.completedTransactions}`);
    console.log(`- Ожидающих транзакций: ${stats.pendingTransactions}`);
    console.log(`- Чистый доход: ₽${stats.netIncome}`);
    console.log(`- Процент завершения: ${stats.completionRate}%`);
    console.log(`- Средняя сумма транзакции: ₽${stats.averageTransactionAmount}`);
    
    console.log('\n✅ Бэкенд работает корректно!');
    console.log('📱 Теперь фронтенд должен показывать эти реальные данные');
    
  } catch (error) {
    console.error('❌ Ошибка:', error.response?.data || error.message);
  }
}

testFrontendStatistics();
