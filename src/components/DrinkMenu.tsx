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
  type: 'drink' | 'food';
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
  {
    name: "Fort Greene Fizz",
    description: "A botanical gin cocktail with cucumber and mint, inspired by Fort Greene's lush parks",
    ingredients: ["Gin", "Cucumber Juice", "Fresh Mint", "Lime Juice", "Soda Water"],
    price: "$15",
    category: "Garden Cocktails",
    theme: "Fort Greene",
    type: "drink"
  },
  {
    name: "DUMBO Daisy",
    description: "A tropical daiquiri variation with passionfruit and coconut, honoring DUMBO's waterfront vibe",
    ingredients: ["Rum", "Passionfruit Puree", "Coconut Cream", "Lime Juice", "Simple Syrup"],
    price: "$16",
    category: "Tropical Cocktails",
    theme: "DUMBO",
    type: "drink"
  },
  {
    name: "Bushwick Berry Smash",
    description: "A seasonal berry cocktail with basil and ginger, celebrating Bushwick's creative energy",
    ingredients: ["Vodka", "Mixed Berries", "Basil Leaves", "Ginger Syrup", "Lemon Juice"],
    price: "$15",
    category: "Seasonal Cocktails",
    theme: "Bushwick",
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
  }
];

const categories = ["All", ...Array.from(new Set(menuItems.map(item => item.category)))];

const Menu: React.FC = () => {
  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>();
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeType, setActiveType] = useState<'all' | 'drink' | 'food'>('all');
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
              Brooklyn-inspired cuisine and cocktails crafted with local ingredients and creative flair
            </p>


          </div>

          {/* Type Filter - Food vs Drinks */}
          <div className="flex justify-center gap-6 mb-12">
            {[
              { key: 'all', label: 'All Items' },
              { key: 'drink', label: 'Drinks' },
              { key: 'food', label: 'Food' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveType(key as 'all' | 'drink' | 'food')}
                className={`px-6 py-3 rounded-full font-medium tracking-wide uppercase transition-all duration-500 border ${
                  activeType === key
                    ? 'text-white bg-brand-gold border-brand-gold'
                    : 'text-white hover:text-brand-gold border-gray-700 hover:border-brand-gold'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Category Filter - Flat Minimal */}
          <div className="flex justify-center flex-wrap gap-8 mb-20">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`group relative text-sm font-medium tracking-wide uppercase transition-all duration-500 ${
                  activeCategory === category
                    ? 'text-brand-gold'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                {category}
                {/* Underline effect */}
                <div className={`absolute -bottom-2 left-0 w-full h-px transition-all duration-500 ${
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

                  <div className="relative flex items-center gap-x-8 py-6 border-b border-gray-800/50 group-hover:border-brand-gold/30 transition-colors duration-500">
                    {/* Item number */}
                    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center text-brand-gold/60 group-hover:text-brand-gold transition-colors duration-500 text-sm font-mono">
                      {(index + 1).toString().padStart(2, '0')}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-3xl font-display font-semibold text-white mb-2 group-hover:text-brand-gold transition-colors duration-500">
                            {item.name}
                          </h3>
                          <p className="text-sm text-brand-gold/80 font-medium tracking-wide uppercase mb-3">
                            {item.theme}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-3xl font-bold text-brand-gold group-hover:text-white transition-colors duration-500">
                            {item.price}
                          </span>
                          <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">
                            {item.category}
                          </p>
                        </div>
                      </div>

                      <p className="text-gray-400 leading-relaxed mb-4 group-hover:text-gray-300 transition-colors duration-500 max-w-2xl">
                        {item.description}
                      </p>

                      {/* Ingredients - Flat style */}
                      <div className="flex items-center gap-x-4">
                        <span className="text-xs text-gray-500 uppercase tracking-wider">
                          {item.type === 'drink' ? 'Ingredients:' : 'Key Components:'}
                        </span>
                        <div className="flex items-center gap-x-3">
                          {item.ingredients.slice(0, 4).map((ingredient, i) => (
                            <span key={i} className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-500">
                              {ingredient}
                              {i < item.ingredients.slice(0, 4).length - 1 && (
                                <span className="mx-2 text-gray-600">•</span>
                              )}
                            </span>
                          ))}
                          {item.ingredients.length > 4 && (
                            <span className="text-xs text-gray-500">
                              +{item.ingredients.length - 4} more
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-gray-900/95 backdrop-blur-md border border-gray-700/50 rounded-lg max-w-lg w-full p-8 relative">
            {/* Close button */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center mb-6">
              <h3 className="text-3xl font-display font-bold text-brand-gold mb-2">
                {selectedItem.name}
              </h3>
              <p className="text-brand-gold/80 font-medium">
                {selectedItem.theme}
              </p>
            </div>

            <p className="text-gray-300 mb-6 leading-relaxed">
              {selectedItem.description}
            </p>

            <div className="mb-6">
              <h4 className="text-lg font-semibold text-white mb-3">
                {selectedItem.type === 'drink' ? 'Ingredients' : 'Key Components'}
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedItem.ingredients.map((ingredient, i) => (
                  <span key={i} className="bg-gray-800/60 text-gray-300 px-3 py-1 rounded-full text-sm">
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-700/50">
              <span className="text-3xl font-bold text-brand-gold">
                {selectedItem.price}
              </span>
              <span className="text-sm text-gray-400 uppercase tracking-wider">
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
