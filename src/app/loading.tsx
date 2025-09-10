export default function Loading() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        {/* Анимированный логотип */}
        <div className="mb-8">
          <div className="relative">
            <div className="w-16 h-16 mx-auto bg-blue-600 rounded-full flex items-center justify-center animate-pulse">
              <span className="text-white text-2xl font-bold">U</span>
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-bounce"></div>
          </div>
        </div>

        {/* Текст загрузки */}
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Загрузка...
        </h2>
        
        <p className="text-gray-600 mb-6">
          Пожалуйста, подождите
        </p>

        {/* Анимированная полоса загрузки */}
        <div className="w-64 mx-auto">
          <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
            <div className="bg-blue-600 h-full rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Дополнительная анимация */}
        <div className="mt-8 flex justify-center space-x-1">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  )
}




