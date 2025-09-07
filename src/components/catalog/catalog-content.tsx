'use client'

import { ProductCategory } from '@/types'
import { useState } from 'react'
import { FilterButton } from './filter-button'
import { ProductFilters } from './product-filters'
import { ProductGrid } from './product-grid'
import { SearchBar } from './search-bar'
import { ViewModeToggle } from './view-mode-toggle'

export function CatalogContent() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all')
  const [showFavorites, setShowFavorites] = useState(false)
  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 })
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high' | 'rating'>('newest')
  const [favoritesCount, setFavoritesCount] = useState(0)

  return (
    <div className="min-h-screen bg-white">
      {/* Заголовок */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
        <h1 className="text-xl font-bold text-gray-900">Каталог</h1>
      </div>

      {/* Поиск и фильтры */}
      <div className="px-4 py-6 space-y-4">
        <div className="flex items-center space-x-3">
          <SearchBar 
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Поиск товаров..."
          />
          <FilterButton 
            active={showFilters}
            onClick={() => setShowFilters(!showFilters)}
          />
        </div>

        {/* Кнопка избранного */}
        <ViewModeToggle 
          mode="grid"
          onModeChange={() => {}}
          showFavorites={showFavorites}
          onToggleFavorites={() => setShowFavorites(!showFavorites)}
          favoritesCount={favoritesCount}
        />
      </div>

      {/* Панель фильтров */}
      {showFilters && (
        <div className="px-4 pb-4 border-b border-gray-200">
          <ProductFilters
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            showFavorites={showFavorites}
            onToggleFavorites={() => setShowFavorites(!showFavorites)}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </div>
      )}

      {/* Сетка товаров */}
      <div className="px-4 pb-4">
        <ProductGrid 
          viewMode="grid"
          searchQuery={searchQuery}
          category={selectedCategory}
          showFavorites={showFavorites}
          priceRange={priceRange}
          sortBy={sortBy}
          onFavoritesCountChange={setFavoritesCount}
        />
      </div>
    </div>
  )
}
