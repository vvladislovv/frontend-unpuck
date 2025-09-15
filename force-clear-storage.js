// Скрипт для принудительной очистки localStorage
console.log('🧹 Принудительная очистка localStorage...');

// Очищаем все ключи связанные с авторизацией
const keysToRemove = ['auth_token', 'token', 'authToken', 'access_token', 'auth-storage'];
keysToRemove.forEach(key => {
  localStorage.removeItem(key);
  console.log(`✅ Удален ключ: ${key}`);
});

// Очищаем весь localStorage
localStorage.clear();
console.log('✅ Весь localStorage очищен');

// Перезагружаем страницу
window.location.reload();
console.log('🔄 Страница перезагружается...');
