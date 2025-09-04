import React, { useState, useEffect } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import Logo from './Logo';

interface MenuItem {
  name: string;
  description: string;
  ingredients: string[];
  price: string;
  category: string;
  theme: string;
  type: 'drink' | 'food' | 'hookah';
}

const menuItems: MenuItem[] = [
  // DRINKS
  {
    name: "Brooklyn Bridge Bourbon",
    description: "A smooth bourbon cocktail inspired by the iconic bridge that connects Brooklyn to Manhattan",
    ingredients: ["Bourbon", "Maple Syrup", "Angostura Bitters", "Orange Peel"],
    price: "$16",
    category: "Signature Cocktails",
    theme: "Brooklyn Bridge",
    type: "drink"
  },
  {
    name: "Crown Heights Collins",
    description: "A refreshing gin fizz with hints of hibiscus and citrus, celebrating Crown Heights' vibrant spirit",
    ingredients: ["Gin", "Hibiscus Tea", "Lemon Juice", "Simple Syrup", "Club Soda"],
    price: "$15",
    category: "Classic Cocktails",
    theme: "Crown Heights",
    type: "drink"
  },
  {
    name: "Williamsburg Widow",
    description: "A sophisticated blackberry sage martini, honoring the strong women of Williamsburg",
    ingredients: ["Vodka", "Blackberry Puree", "Sage Syrup", "Fresh Lemon Juice"],
    price: "$17",
    category: "Martinis",
    theme: "Williamsburg",
    type: "drink"
  },
  {
    name: "Bed-Stuy Belle",
    description: "A delicate elderflower spritz with rose petals, representing the elegance of Bed-Stuy's belle culture",
    ingredients: ["Prosecco", "Elderflower Liqueur", "Rose Water", "Lemon Zest"],
    price: "$14",
    category: "Sparkling Wines",
    theme: "Bed-Stuy",
    type: "drink"
  },
  {
    name: "Brownstone Manhattan",
    description: "Classic Manhattan with a Brooklyn twist, featuring local rye whiskey and cherry bitters",
    ingredients: ["Rye Whiskey", "Sweet Vermouth", "Cherry Bitters", "Luxardo Cherry"],
    price: "$18",
    category: "Whiskey Cocktails",
    theme: "Brownstone",
    type: "drink"
  },
  // FOOD ITEMS
  {
    name: "Brooklyn Bridge Beef Tartare",
    description: "Hand-chopped prime beef with Brooklyn-made mustard, capers, and house-made potato chips",
    ingredients: ["Prime Beef", "Brooklyn Mustard", "Capers", "Shallots", "House Potato Chips"],
    price: "$24",
    category: "Small Plates",
    theme: "Brooklyn Bridge",
    type: "food"
  },
  {
    name: "Crown Heights Curry Bowl",
    description: "Spiced coconut curry with seasonal vegetables and jasmine rice, inspired by Crown Heights' diverse flavors",
    ingredients: ["Coconut Milk", "Seasonal Vegetables", "Jasmine Rice", "Spice Blend", "Fresh Herbs"],
    price: "$18",
    category: "Bowls",
    theme: "Crown Heights",
    type: "food"
  },
  {
    name: "Williamsburg Wood-Fired Pizza",
    description: "Thin crust pizza with house-made mozzarella, seasonal toppings, and Brooklyn honey drizzle",
    ingredients: ["House Dough", "Fresh Mozzarella", "Seasonal Toppings", "Brooklyn Honey", "Fresh Basil"],
    price: "$22",
    category: "Wood-Fired",
    theme: "Williamsburg",
    type: "food"
  },
  {
    name: "Bed-Stuy Belle's Brunch",
    description: "Poached eggs with smoked salmon, avocado toast, and fresh berries - a sophisticated morning treat",
    ingredients: ["Poached Eggs", "Smoked Salmon", "Avocado", "Artisan Bread", "Fresh Berries"],
    price: "$19",
    category: "Brunch",
    theme: "Bed-Stuy",
    type: "food"
  },
  {
    name: "Brownstone Burger",
    description: "Grass-fed beef burger with aged cheddar, caramelized onions, and house-made pickles on brioche",
    ingredients: ["Grass-Fed Beef", "Aged Cheddar", "Caramelized Onions", "House Pickles", "Brioche Bun"],
    price: "$16",
    category: "Burgers",
    theme: "Brownstone",
    type: "food"
  },
  {
    name: "Fort Greene Garden Salad",
    description: "Mixed greens with roasted vegetables, goat cheese, and house vinaigrette from our rooftop garden",
    ingredients: ["Mixed Greens", "Roasted Vegetables", "Goat Cheese", "House Vinaigrette", "Herbs"],
    price: "$14",
    category: "Salads",
    theme: "Fort Greene",
    type: "food"
  },
  {
    name: "DUMBO Seafood Platter",
    description: "Fresh oysters, shrimp cocktail, and smoked salmon with classic accompaniments",
    ingredients: ["Fresh Oysters", "Shrimp Cocktail", "Smoked Salmon", "Mignonette", "Cocktail Sauce"],
    price: "$32",
    category: "Seafood",
    theme: "DUMBO",
    type: "food"
  },
  {
    name: "Bushwick Berry Tart",
    description: "Seasonal berry tart with almond crust and vanilla bean cream, celebrating Bushwick's sweet side",
    ingredients: ["Seasonal Berries", "Almond Crust", "Vanilla Bean Cream", "Powdered Sugar", "Mint"],
    price: "$12",
    category: "Desserts",
    theme: "Bushwick",
    type: "food"
  },
  // HOOKAH
  {
    name: "Brooklyn Sunset",
    description: "A tropical blend of mango, peach, and passionfruit that captures the golden hour over the Brooklyn skyline",
    ingredients: ["Mango", "Peach", "Passionfruit", "Premium Tobacco"],
    price: "$25",
    category: "Premium Flavors",
    theme: "Brooklyn Sunset",
    type: "hookah"
  },
  {
    name: "Crown Heights Classic",
    description: "Traditional double apple with a hint of mint, honoring the classic flavors of Crown Heights",
    ingredients: ["Double Apple", "Fresh Mint", "Premium Tobacco"],
    price: "$22",
    category: "Classic Flavors",
    theme: "Crown Heights",
    type: "hookah"
  },
  {
    name: "Williamsburg Watermelon",
    description: "Refreshing watermelon mint blend perfect for those warm Brooklyn nights",
    ingredients: ["Watermelon", "Fresh Mint", "Premium Tobacco"],
    price: "$23",
    category: "Fresh Flavors",
    theme: "Williamsburg",
    type: "hookah"
  },
  {
    name: "Bed-Stuy Berry Mix",
    description: "A sophisticated blend of mixed berries with a touch of vanilla, representing Bed-Stuy's elegance",
    ingredients: ["Mixed Berries", "Vanilla", "Premium Tobacco"],
    price: "$24",
    category: "Premium Flavors",
    theme: "Bed-Stuy",
    type: "hookah"
  },
  {
    name: "Brownstone Coffee",
    description: "Rich coffee and chocolate blend that pairs perfectly with our signature cocktails",
    ingredients: ["Coffee", "Chocolate", "Premium Tobacco"],
    price: "$26",
    category: "Dessert Flavors",
    theme: "Brownstone",
    type: "hookah"
  },
  {
    name: "Fort Greene Fruity",
    description: "A vibrant mix of citrus fruits inspired by Fort Greene's energetic atmosphere",
    ingredients: ["Orange", "Lemon", "Grapefruit", "Premium Tobacco"],
    price: "$23",
    category: "Citrus Flavors",
    theme: "Fort Greene",
    type: "hookah"
  },
  {
    name: "DUMBO Double Mint",
    description: "Cool double mint with a hint of spearmint, perfect for the waterfront breeze",
    ingredients: ["Double Mint", "Spearmint", "Premium Tobacco"],
    price: "$22",
    category: "Mint Flavors",
    theme: "DUMBO",
    type: "hookah"
  },
  {
    name: "Bushwick Bubblegum",
    description: "Sweet bubblegum flavor that brings back childhood memories in the heart of Bushwick",
    ingredients: ["Bubblegum", "Premium Tobacco"],
    price: "$21",
    category: "Sweet Flavors",
    theme: "Bushwick",
    type: "hookah"
  }
];

const categories = ["All", ...Array.from(new Set(menuItems.map(item => item.category)))];

const Menu: React.FC = () => {
  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>();
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeType, setActiveType] = useState<'all' | 'drink' | 'food' | 'hookah'>('all');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const filteredItems = menuItems.filter(item => {
    const categoryMatch = activeCategory === "All" || item.category === activeCategory;
    const typeMatch = activeType === 'all' || item.type === activeType;
    return categoryMatch && typeMatch;
  });

  return (
    <>
      <section id="drinks" className="py-24 md:py-40 bg-black/50 overflow-hidden relative">
        <div ref={ref} className={`container mx-auto px-6 fade-in-section ${isVisible ? 'is-visible' : ''}`}>

          {/* Header with Logo */}
          <div className="text-center mb-16">
            <div className="mb-8">
              <Logo className="mx-auto mb-6" size="medium" />
            </div>
            <h2 className="text-5xl md:text-6xl font-display font-bold text-brand-gold tracking-wide mb-4">
              Signature Menu
            </h2>
            <p className="text-lg text-gray-300 mt-3 max-w-2xl mx-auto leading-relaxed">
              Brooklyn-inspired cuisine, signature cocktails, and premium hookah flavors crafted with local ingredients and creative flair
            </p>


          </div>

          {/* Type Filter - Food vs Drinks vs Hookah */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 mb-8 sm:mb-12 px-4">
            {[
              { key: 'all', label: 'All Items' },
              { key: 'drink', label: 'Drinks' },
              { key: 'food', label: 'Food' },
              { key: 'hookah', label: 'Hookah' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveType(key as 'all' | 'drink' | 'food' | 'hookah')}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium tracking-wide uppercase transition-all duration-500 border text-sm sm:text-base touch-manipulation active:scale-95 ${
                  activeType === key
                    ? 'text-white bg-brand-gold border-brand-gold'
                    : 'text-white hover:text-brand-gold border-gray-700 hover:border-brand-gold hover:bg-gray-800/50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Category Filter - Mobile Optimized */}
          <div className="flex justify-center flex-wrap gap-4 sm:gap-6 md:gap-8 mb-12 sm:mb-16 md:mb-20 px-4">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`group relative text-xs sm:text-sm font-medium tracking-wide uppercase transition-all duration-500 touch-manipulation active:scale-95 py-2 px-3 rounded-lg ${
                  activeCategory === category
                    ? 'text-brand-gold bg-brand-gold/10'
                    : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
                }`}
              >
                {category}
                {/* Underline effect - hidden on mobile, shown on larger screens */}
                <div className={`absolute -bottom-2 left-0 w-full h-px transition-all duration-500 hidden sm:block ${
                  activeCategory === category
                    ? 'bg-brand-gold'
                    : 'bg-gray-700 group-hover:bg-gray-600'
                }`}></div>
              </button>
            ))}
          </div>

          {/* Menu Items List - Flat Minimal */}
          <div className="max-w-6xl mx-auto">
            <div className="space-y-12">
              {filteredItems.map((item, index) => (
                <div
                  key={item.name}
                  className="group relative transition-all duration-700 ease-out cursor-pointer"
                  style={{
                    transitionDelay: `${index * 150}ms`,
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(40px)'
                  }}
                  onClick={() => setSelectedItem(item)}
                >
                  {/* Subtle background line */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-800/30 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out origin-left"></div>

                  <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-x-8 py-4 sm:py-6 border-b border-gray-800/50 group-hover:border-brand-gold/30 transition-colors duration-500 px-4 sm:px-0">
                    {/* Item number */}
                    <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-brand-gold/60 group-hover:text-brand-gold transition-colors duration-500 text-xs sm:text-sm font-mono bg-gray-900/30 rounded-full">
                      {(index + 1).toString().padStart(2, '0')}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 w-full">
                      <div className="flex flex-col sm:flex-row items-start justify-between mb-4 gap-2 sm:gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl sm:text-2xl md:text-3xl font-display font-semibold text-white mb-1 sm:mb-2 group-hover:text-brand-gold transition-colors duration-500 leading-tight">
                            {item.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-brand-gold/80 font-medium tracking-wide uppercase">
                            {item.theme}
                          </p>
                        </div>
                        <div className="text-left sm:text-right mt-2 sm:mt-0">
                          <span className="text-2xl sm:text-3xl font-bold text-brand-gold group-hover:text-white transition-colors duration-500 block">
                            {item.price}
                          </span>
                          <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">
                            {item.category}
                          </p>
                        </div>
                      </div>

                      <p className="text-sm sm:text-base text-gray-400 leading-relaxed mb-4 group-hover:text-gray-300 transition-colors duration-500">
                        {item.description}
                      </p>

                      {/* Ingredients - Mobile Optimized */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-x-4">
                        <span className="text-xs text-gray-500 uppercase tracking-wider flex-shrink-0">
                          {item.type === 'drink' ? 'Ingredients:' : 'Key Components:'}
                        </span>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          {item.ingredients.slice(0, 3).map((ingredient, i) => (
                            <span key={i} className="text-xs sm:text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-500">
                              {ingredient}
                              {i < item.ingredients.slice(0, 3).length - 1 && (
                                <span className="mx-2 text-gray-600 hidden sm:inline">•</span>
                              )}
                            </span>
                          ))}
                          {item.ingredients.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{item.ingredients.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Subtle arrow indicator */}
                    <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <svg className="w-5 h-5 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <div className="inline-flex items-center gap-4 bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-full px-8 py-4 hover:border-brand-gold/50 transition-all duration-300 group">
              <span className="text-gray-300 group-hover:text-white transition-colors duration-300">
                Ready to experience our signature menu?
              </span>
              <a
                href="#booking"
                className="bg-brand-gold text-white font-bold py-2 px-6 rounded-full hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105"
              >
                Book Your Visit
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Item Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div className="bg-gray-900/95 backdrop-blur-md border border-gray-700/50 rounded-lg max-w-lg w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
            {/* Close button */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center mb-4 sm:mb-6">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-brand-gold mb-2 leading-tight">
                {selectedItem.name}
              </h3>
              <p className="text-sm sm:text-base text-brand-gold/80 font-medium">
                {selectedItem.theme}
              </p>
            </div>

            <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6 leading-relaxed">
              {selectedItem.description}
            </p>

            <div className="mb-4 sm:mb-6">
              <h4 className="text-base sm:text-lg font-semibold text-white mb-3">
                {selectedItem.type === 'drink' ? 'Ingredients' : 'Key Components'}
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedItem.ingredients.map((ingredient, i) => (
                  <span key={i} className="bg-gray-800/60 text-gray-300 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t border-gray-700/50 gap-2 sm:gap-0">
              <span className="text-2xl sm:text-3xl font-bold text-brand-gold">
                {selectedItem.price}
              </span>
              <span className="text-xs sm:text-sm text-gray-400 uppercase tracking-wider">
                {selectedItem.category}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Menu;
