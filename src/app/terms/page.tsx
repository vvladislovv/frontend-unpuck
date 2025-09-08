'use client'

import { MainLayout } from '@/components/layouts/main-layout'
import { ArrowLeftIcon, DocumentTextIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'

export default function TermsPage() {
  const router = useRouter()
  return (
    <MainLayout>
      <div className="min-h-screen bg-white">
        {/* Заголовок */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center space-x-3">
            <button onClick={() => router.back()} className="p-1 -ml-1">
              <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Пользовательское соглашение</h1>
          </div>
        </div>

        <div className="px-4 py-6">
          <div className="max-w-4xl mx-auto">
            {/* Информация о документе */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <DocumentTextIcon className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-blue-900">Информация о документе</h2>
              </div>
              <p className="text-sm text-blue-800">
                Версия: 2.1 | Дата последнего обновления: 18 января 2024 года | 
                Действует с: 1 января 2024 года
              </p>
            </div>

            {/* Содержание */}
            <div className="prose prose-sm max-w-none">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Общие положения</h2>
              <p className="text-gray-700 mb-4">
                Настоящее Пользовательское соглашение (далее — «Соглашение») регулирует отношения между 
                администрацией платформы (далее — «Администрация») и пользователями (далее — «Пользователь») 
                при использовании сервиса.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Принятие условий</h2>
              <p className="text-gray-700 mb-4">
                Используя платформу, вы подтверждаете, что прочитали, поняли и согласны соблюдать 
                настоящее Соглашение. Если вы не согласны с какими-либо условиями, пожалуйста, 
                не используйте платформу.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Описание сервиса</h2>
              <p className="text-gray-700 mb-4">
                Платформа предоставляет пользователям возможность:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                <li>Просматривать и приобретать товары от различных продавцов</li>
                <li>Создавать и управлять профилем пользователя</li>
                <li>Оставлять отзывы и оценки товарам</li>
                <li>Участвовать в партнерской программе</li>
                <li>Получать уведомления о статусе заказов</li>
              </ul>

              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Регистрация и аккаунт</h2>
              <p className="text-gray-700 mb-4">
                Для использования всех функций платформы необходимо создать аккаунт. При регистрации 
                вы обязуетесь предоставить достоверную информацию и поддерживать её актуальность.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Платежи и возвраты</h2>
              <p className="text-gray-700 mb-4">
                Все платежи обрабатываются через защищенные платежные системы. Возврат средств 
                осуществляется в соответствии с действующим законодательством РФ и политикой возвратов.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Ответственность</h2>
              <p className="text-gray-700 mb-4">
                Пользователь несет ответственность за:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                <li>Достоверность предоставленной информации</li>
                <li>Соблюдение законодательства РФ</li>
                <li>Безопасность своего аккаунта</li>
                <li>Своевременную оплату заказанных товаров</li>
              </ul>

              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Конфиденциальность</h2>
              <p className="text-gray-700 mb-4">
                Мы обязуемся защищать ваши персональные данные в соответствии с ФЗ-152 
                "О персональных данных" и нашей Политикой конфиденциальности.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Изменения в соглашении</h2>
              <p className="text-gray-700 mb-4">
                Администрация оставляет за собой право изменять настоящее Соглашение. 
                О существенных изменениях пользователи будут уведомлены заранее.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Разрешение споров</h2>
              <p className="text-gray-700 mb-4">
                Все споры решаются путем переговоров. При невозможности достижения соглашения 
                споры рассматриваются в суде по месту нахождения администрации.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Контактная информация</h2>
              <p className="text-gray-700 mb-4">
                По вопросам, связанным с настоящим Соглашением, обращайтесь:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                <li>Email: legal@example.com</li>
                <li>Телефон: +7 (800) 555-35-35</li>
                <li>Адрес: г. Москва, ул. Примерная, д. 1</li>
              </ul>

              <div className="bg-gray-50 rounded-lg p-4 mt-8">
                <p className="text-sm text-gray-600">
                  <strong>Дата вступления в силу:</strong> 1 января 2024 года<br/>
                  <strong>Последнее обновление:</strong> 18 января 2024 года
                </p>
              </div>
            </div>

            {/* Кнопки действий */}
            <div className="flex space-x-3 mt-8">
              <button className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
                Скачать PDF
              </button>
              <button className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50">
                Распечатать
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
