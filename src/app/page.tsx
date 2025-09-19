"use client";

import { useState, useEffect } from "react";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import { Search, Clock, Users, Utensils, BookOpen, ArrowRight, Star, X, Heart, Filter, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "~/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Badge } from "~/components/ui/badge";
import { Skeleton } from "~/components/ui/skeleton";

// Define the Recipe type
interface Recipe {
  id: string;
  title: string;
  description: string;
  instructions: string;
  prep_time: number;
  cook_time: number;
  servings: number;
  ingredients: string[];
  image_url: string;
  category?: string;
  rating?: number;
  is_favorite?: boolean;
}

export default function kainTayo() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);

  // Pagination, category, and sorting state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [sortBy, setSortBy] = useState<string | undefined>(undefined);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  // Fetch recipes with query params
  useEffect(() => {
    fetchRecipes();
  }, [page, limit, category, sortBy, order]);

  const fetchRecipes = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(category ? { category } : {}),
        ...(sortBy ? { sortBy } : {}),
        order,
      });
      const response = await fetch(`/api/recipes?${params.toString()}`);
      const data = await response.json();
      if (data.recipes) {
        setRecipes(data.recipes);
      } else {
        setRecipes(data);
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setRecipes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchRecipes();
      return;
    }

    try {
      setIsSearching(true);
      const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keyword: searchQuery }),
      });
      const data = await response.json();

      // Fix: handle both array and object response
      if (Array.isArray(data)) {
        setRecipes(data);
      } else if (data.recipes) {
        setRecipes(data.recipes);
      } else {
        setRecipes([]);
      }
    } catch (error) {
      console.error('Error searching recipes:', error);
      setRecipes([]); // Clear recipes on error
    } finally {
      setIsSearching(false);
    }
  };

  const handleViewRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  const toggleFavorite = (recipeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newFavorites = new Set(favorites);
    if (newFavorites.has(recipeId)) {
      newFavorites.delete(recipeId);
    } else {
      newFavorites.add(recipeId);
    }
    setFavorites(newFavorites);
  };

  const clearFilters = () => {
    setCategory(undefined);
    setSortBy(undefined);
    setOrder('asc');
    setSearchQuery("");
    fetchRecipes();
  };

  const hasActiveFilters = category || sortBy || order !== 'asc' || searchQuery;

  return (
    <>
      <SignedIn>
        <div className="min-h-screen bg-gradient-to-b from-[#fffffe] to-[#ffdaba]">
          {/* Header */}
          <header className="bg-white shadow-sm sticky top-0 z-10">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-[#E74C3C] to-[#F39C12] rounded-full flex items-center justify-center">
                  <Utensils className="text-white" size={20} />
                </div>
                <h1 className="text-2xl font-bold text-[#E74C3C]">Kain Tayo</h1>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="ghost" className="text-gray-600 hover:text-[#E74C3C]">
                  My Profile
                </Button>
              </div>
            </div>
          </header>

          {/* Hero Section */}
          <section className="bg-gradient-to-r from-[#E74C3C] to-[#F39C12] text-white py-12">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-4xl font-bold mb-4">Discover Authentic Filipino Recipes</h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto">
                From traditional favorites to modern twists, explore our collection of delicious Filipino dishes
              </p>
              
              <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" size={20} />
                  <Input
                    type="text"
                    placeholder="Search for recipes, ingredients, or categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-24 py-6 text-lg border-0 focus-visible:ring-2 focus-visible:ring-[#F39C12] text-white placeholder:text-white/70"
                  />
                  <Button 
                    type="submit" 
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#2C3E50] hover:bg-[#1A252F] text-white"
                    disabled={isSearching}
                  >
                    {isSearching ? "Searching..." : "Search"}
                  </Button>
                </div>
              </form>
            </div>
          </section>

          <div className="container mx-auto px-4 py-8">
            {/* Filter Toggle */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Recipes</h3>
              <Button 
                variant="outline" 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter size={16} />
                Filters
                {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </Button>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-semibold text-lg">Filter Recipes</h4>
                  {hasActiveFilters && (
                    <Button variant="ghost" onClick={clearFilters} className="text-sm text-[#E74C3C]">
                      Clear all filters
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Category</label>
                    <Select value={category || "all"} onValueChange={(value) => setCategory(value === "all" ? undefined : value)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="All categories" />
                      </SelectTrigger>
                      <SelectContent>


                        <SelectItem value="all">All categories</SelectItem>
                        <SelectItem value="Main Dish">Main Dish</SelectItem>
                        <SelectItem value="Breakfast">Breakfast</SelectItem>
                        <SelectItem value="Dessert">Dessert</SelectItem>
                    

                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Sort by</label>
                    <Select value={sortBy || "default"} onValueChange={(value) => setSortBy(value === "default" ? undefined : value)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Default" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default</SelectItem>
                        <SelectItem value="title">Title</SelectItem>
                        <SelectItem value="prep_time">Prep Time</SelectItem>
                        <SelectItem value="cook_time">Cook Time</SelectItem>
                        <SelectItem value="created_at">Date Added</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Order</label>
                    <Select value={order} onValueChange={(value) => setOrder(value as 'asc' | 'desc')}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Ascending" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asc">Ascending</SelectItem>
                        <SelectItem value="desc">Descending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Active filter indicators */}
                {hasActiveFilters && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {category && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        Category: {category}
                        <X size={12} onClick={() => setCategory(undefined)} className="cursor-pointer" />
                      </Badge>
                    )}
                    {sortBy && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        Sort by: {sortBy}
                        <X size={12} onClick={() => setSortBy(undefined)} className="cursor-pointer" />
                      </Badge>
                    )}
                    {order !== 'asc' && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        Order: {order}
                        <X size={12} onClick={() => setOrder('asc')} className="cursor-pointer" />
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Pagination Controls */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm text-gray-600">
                Showing {recipes.length} results
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>
                  Previous
                </Button>
                <span className="px-2 text-sm">Page {page}</span>
                <Button variant="outline" size="sm" onClick={() => setPage(page + 1)}>
                  Next
                </Button>
              </div>
            </div>

            {/* Recipe Cards Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full" />
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between mb-4">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                    <CardFooter>
                      <Skeleton className="h-10 w-full" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <>
                {recipes.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-lg shadow">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">No recipes found</h2>
                    <p className="text-gray-600 mb-6">Try a different search term or browse all recipes.</p>
                    <Button 
                      onClick={fetchRecipes}
                      className="bg-gradient-to-r from-[#E74C3C] to-[#F39C12] hover:from-[#C0392B] hover:to-[#D35400]"
                    >
                      Browse All Recipes
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recipes.map((recipe) => (
                      <Card 
                        key={recipe.id} 
                        className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
                        onClick={() => handleViewRecipe(recipe)}
                      >
                        <div className="h-48 overflow-hidden relative">
                          <img 
                            src={recipe.image_url} 
                            alt={recipe.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-3 left-3">
                            <Badge className="bg-white text-[#E74C3C] hover:bg-white">
                              {recipe.category || "Dish"}
                            </Badge>
                          </div>
                          <Button 
                            size="icon" 
                            className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/80 hover:bg-white"
                            onClick={(e) => toggleFavorite(recipe.id, e)}
                          >
                            <Heart 
                              size={18} 
                              className={favorites.has(recipe.id) ? "fill-[#E74C3C] text-[#E74C3C]" : "text-gray-600"} 
                            />
                          </Button>
                        </div>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-xl text-[#2C3E50] line-clamp-1">{recipe.title}</CardTitle>
                          <CardDescription className="line-clamp-2">{recipe.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="flex justify-between mb-3 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Clock size={14} className="mr-1" />
                              <span>{recipe.prep_time + recipe.cook_time} min</span>
                            </div>
                            <div className="flex items-center">
                              <Users size={14} className="mr-1" />
                              <span>{recipe.servings} servings</span>
                            </div>
                            <div className="flex items-center">
                              {recipe.rating && (
                                <>
                                  <Star size={14} className="mr-1 fill-[#F39C12] text-[#F39C12]" />
                                  <span>{recipe.rating.toFixed(1)}</span>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="mb-2">
                            <h4 className="font-semibold text-sm text-gray-700 mb-1">Ingredients:</h4>
                            <ul className="text-sm text-gray-600 line-clamp-2">
                              {recipe.ingredients.slice(0, 2).map((ingredient, index) => (
                                <li key={index} className="inline">
                                  {ingredient}
                                  {index < recipe.ingredients.slice(0, 2).length - 1 ? ', ' : ''}
                                </li>
                              ))}
                              {recipe.ingredients.length > 2 && (
                                <span className="text-[#E74C3C]"> +{recipe.ingredients.length - 2} more</span>
                              )}
                            </ul>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button 
                            className="w-full bg-gradient-to-r from-[#E74C3C] to-[#F39C12] hover:from-[#C0392B] hover:to-[#D35400]"
                          >
                            View Recipe
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Recipe Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 [&>button:last-child]:hidden " >
            {selectedRecipe && (
              <>
                <div className="relative">
                  <img 
                    src={selectedRecipe.image_url} 
                    alt={selectedRecipe.title}
                    className="w-full h-64 object-cover"
                  />
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="absolute right-4 top-4 rounded-full bg-white/80 p-2 hover:bg-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                  <Button 
                    size="icon" 
                    className="absolute right-14 top-4 rounded-full bg-white/80 hover:bg-white"
                    onClick={(e) => toggleFavorite(selectedRecipe.id, e)}
                  >
                    <Heart 
                      size={18} 
                      className={favorites.has(selectedRecipe.id) ? "fill-[#E74C3C] text-[#E74C3C]" : "text-gray-600"} 
                    />
                  </Button>
                  <div className="absolute bottom-4 left-4">
                    <Badge className="bg-white text-[#E74C3C] hover:bg-white text-sm">
                      {selectedRecipe.category || "Dish"}
                    </Badge>
                  </div>
                </div>
                
                <div className="p-6">
                  <DialogHeader className="mb-4">
                    <DialogTitle className="text-2xl text-[#2C3E50]">{selectedRecipe.title}</DialogTitle>
                    <DialogDescription>{selectedRecipe.description}</DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-[#FFF5EB] rounded-lg">
                    <div className="flex flex-col items-center text-center">
                      <Clock size={20} className="text-[#E74C3C] mb-1" />
                      <span className="text-sm font-medium">Prep Time</span>
                      <span className="text-lg font-semibold">{selectedRecipe.prep_time} min</span>
                    </div>
                    <div className="flex flex-col items-center text-center">
                      <Utensils size={20} className="text-[#E74C3C] mb-1" />
                      <span className="text-sm font-medium">Cook Time</span>
                      <span className="text-lg font-semibold">{selectedRecipe.cook_time} min</span>
                    </div>
                    <div className="flex flex-col items-center text-center">
                      <Users size={20} className="text-[#E74C3C] mb-1" />
                      <span className="text-sm font-medium">Servings</span>
                      <span className="text-lg font-semibold">{selectedRecipe.servings}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-lg text-gray-800 mb-3">Ingredients:</h4>
                      <ul className="space-y-2">
                        {selectedRecipe.ingredients.map((ingredient, index) => (
                          <li key={index} className="flex items-start">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#E74C3C] mt-2 mr-3 flex-shrink-0"></div>
                            <span className="text-gray-700">{ingredient}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-lg text-gray-800 mb-3">Instructions:</h4>
                      <div className="prose prose-sm text-gray-700 whitespace-pre-line">
                        {selectedRecipe.instructions}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </SignedIn>

      <SignedOut>
        <div className="min-h-screen bg-gradient-to-b from-[#ffffff] to-[#ffac9c]">
          {/* Hero Section */}
          <section className="relative py-16 md:py-24 overflow-hidden">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-10 md:mb-0">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6 leading-tight">
                  Discover <span className="text-[#E74C3C]">authentic Filipino dishes</span> today!
                  </h1>
                <p className="text-xl text-gray-600 mb-8">
                  Filipino recipes that make cooking way more easier!
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <SignUpButton mode="modal">
                    <Button size="lg" className="bg-gradient-to-r from-[#E74C3C] to-[#F39C12] hover:from-[#C0392B] hover:to-[#D35400] text-white text-lg px-8 py-6">
                      Get Started
                      <ArrowRight className="ml-2" size={20} />
                    </Button>
                  </SignUpButton>
                  <SignInButton>
                    <Button size="lg" variant="outline" className="border-2 border-[#E74C3C] text-[#E74C3C] hover:bg-[#FFF0EB] text-lg px-8 py-6">
                      Browse Recipes
                    </Button>
                  </SignInButton>
                </div>
              </div>
              
              <div className="md:w-1/2 relative">
                <div className="relative z-10">
                  <img 
                    src="https://www.seriouseats.com/thmb/BBksd7FXnrkxFa8Dipf_LmgP9HA=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Filipino-Features-Hero-Final-2-b785e627967843b0aa631c6a977adabe.jpg" 
                    alt="Delicious Filipino food" 
                    className="rounded-2xl shadow-2xl w-full h-auto"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#F39C12] rounded-full opacity-20 z-0"></div>
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#E74C3C] rounded-full opacity-20 z-0"></div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Why Choose Kain Tayo!</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-[#FFF5EB] p-6 rounded-2xl border border-[#FFE0D6] text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#E74C3C] to-[#F39C12] rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="text-white" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Authentic Recipes</h3>
                  <p className="text-gray-600">Traditional Filipino recipes passed down through generations</p>
                </div>
                
                <div className="bg-[#FFF5EB] p-6 rounded-2xl border border-[#FFE0D6] text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#E74C3C] to-[#F39C12] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="text-white" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Time-Saving</h3>
                  <p className="text-gray-600">Step-by-step instructions to make cooking easier and faster</p>
                </div>
                
                <div className="bg-[#FFF5EB] p-6 rounded-2xl border border-[#FFE0D6] text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#E74C3C] to-[#F39C12] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="text-white" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Community</h3>
                  <p className="text-gray-600">Join a community of Filipino food lovers and share experiences</p>
                </div>
              </div>
            </div>
          </section>

          {/* Recipe Section */}
          <section className="py-16 bg-gradient-to-br from-[#ffffff] to-[#ffac9c]">
            <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Popular Recipe Categories</h2>
            <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch">
              {/* Main Dishes Card */}
              <div className="flex-1 min-w-[250px] bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-md p-6 flex flex-col">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Main Dishes</h3>
              <p className="text-gray-600 text-center mb-4">Hearty meals for everyday dining</p>
              <Carousel className="w-full">
                <CarouselContent>
                <CarouselItem>
                  <img 
                  src="https://www.unileverfoodsolutions.com.ph/chef-inspiration/food-delivery/10-crowd-favorite-filipino-dishes/jcr:content/parsys/set1/row2/span12/columncontrol_copy/columnctrl_parsys_2/textimage_copy/image.transform/jpeg-optimized/image.1637867904566.jpg" 
                  alt="Main Dish 1" 
                  className="w-full h-48 object-cover rounded-lg"
                  />
                </CarouselItem>
                <CarouselItem>
                  <img 
                  src="https://i.pinimg.com/1200x/a1/00/42/a10042e785d0180f2f7f69cefd6f51e3.jpg" 
                  alt="Main Dish 2" 
                  className="w-full h-48 object-cover rounded-lg"
                  />
                </CarouselItem>
                <CarouselItem>
                  <img 
                  src="https://i.pinimg.com/736x/74/59/3b/74593bd7b7641c6d3b57553f1bf77aa6.jpg" 
                  alt="Main Dish 3" 
                  className="w-full h-48 object-cover rounded-lg"
                  />
                </CarouselItem>
                </CarouselContent>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </Carousel>
              </div>
              {/* Desserts Card */}
              <div className="flex-1 min-w-[250px] bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-md p-6 flex flex-col">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Desserts</h3>
              <p className="text-gray-600 text-center mb-4">Sweet treats and traditional delicacies</p>
              <Carousel className="w-full">
                <CarouselContent>
                <CarouselItem>
                  <img 
                  src="https://chatelaine.com/wp-content/uploads/2021/07/Filipino-desserts_1280x960.jpg" 
                  alt="Dessert 1" 
                  className="w-full h-48 object-cover rounded-lg"
                  />
                </CarouselItem>
                <CarouselItem>
                  <img 
                  src="https://i.pinimg.com/1200x/23/67/57/2367571c1df0020dc5a873ba06bb62b5.jpg" 
                  alt="Dessert 2" 
                  className="w-full h-48 object-cover rounded-lg"
                  />
                </CarouselItem>
                <CarouselItem>
                  <img 
                  src="https://i.pinimg.com/736x/b4/b2/54/b4b2547eb38734059fb20cfd9e4281cc.jpg" 
                  alt="Dessert 3" 
                  className="w-full h-48 object-cover rounded-lg"
                  />
                </CarouselItem>
                </CarouselContent>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </Carousel>
              </div>
              {/* Soups & Stews Card */}
              <div className="flex-1 min-w-[250px] bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-md p-6 flex flex-col">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Soups & Stews</h3>
              <p className="text-gray-600 text-center mb-4">Comforting bowls for any occasion</p>
              <Carousel className="w-full">
                <CarouselContent>
                <CarouselItem>
                  <img 
                  src="https://cdn.tasteatlas.com/images/dishes/906dd0157c7f4dbe8f95e0ca5722b05f.jpg?w=905&h=510" 
                  alt="Soup 1" 
                  className="w-full h-48 object-cover rounded-lg"
                  />
                </CarouselItem>
                <CarouselItem>
                  <img 
                  src="https://i.pinimg.com/736x/61/a8/bf/61a8bf77be599def1c6204384f10d4a2.jpg" 
                  alt="Soup 2" 
                  className="w-full h-48 object-cover rounded-lg"
                  />
                </CarouselItem>
                <CarouselItem>
                  <img 
                  src="https://i.pinimg.com/1200x/e1/53/b6/e153b6d88e3f2b889a781d330b5d62d9.jpg" 
                  alt="Soup 3" 
                  className="w-full h-48 object-cover rounded-lg"
                  />
                </CarouselItem>
                </CarouselContent>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </Carousel>
              </div>
              {/* Street Food Card */}
              <div className="flex-1 min-w-[250px] bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-md p-6 flex flex-col">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Street Food</h3>
              <p className="text-gray-600 text-center mb-4">Popular quick bites and snacks</p>
              <Carousel className="w-full">
                <CarouselContent>
                <CarouselItem>
                  <img 
                  src="https://www.willflyforfood.net/wp-content/uploads/2017/09/filipino-street-food-banana-q1.jpg" 
                  alt="Street Food 1" 
                  className="w-full h-48 object-cover rounded-lg"
                  />
                </CarouselItem>
                <CarouselItem>
                  <img 
                  src="https://i.pinimg.com/1200x/04/2d/9e/042d9e9ea55de175b308aeb9e03de2e8.jpg" 
                  alt="Street Food 2" 
                  className="w-full h-48 object-cover rounded-lg"
                  />
                </CarouselItem>
                <CarouselItem>
                  <img 
                  src="https://i.pinimg.com/736x/4d/5e/28/4d5e28e8213d3443f31c21201b66f01a.jpg" 
                  alt="Street Food 3" 
                  className="w-full h-48 object-cover rounded-lg"
                  />
                </CarouselItem>
                </CarouselContent>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </Carousel>
              </div>
            </div>
            <div className="text-center mt-10">
              <SignInButton>
              <Button className="bg-gradient-to-r from-[#E74C3C] to-[#F39C12] hover:from-[#C0392B] hover:to-[#D35400] text-white px-6 py-3">
                Explore All Categories
              </Button>
              </SignInButton>
            </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">What Our Users Say</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-[#FFF5EB] p-6 rounded-2xl border border-[#FFE0D6]">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#E74C3C] to-[#F39C12] rounded-full flex items-center justify-center text-white font-bold mr-4">
                      MJ
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Flood Control</h4>
                      <p className="text-sm text-gray-600">Home Cook</p>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">"Kain Tayo helped me reconnect with my Filipino heritage through cooking. The recipes are authentic and easy to follow!"</p>
                  <div className="flex mt-4 text-[#F39C12]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                </div>
                
                <div className="bg-[#FFF5EB] p-6 rounded-2xl border border-[#FFE0D6]">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#E74C3C] to-[#F39C12] rounded-full flex items-center justify-center text-white font-bold mr-4">
                      JR
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Negsss</h4>
                      <p className="text-sm text-gray-600">Food Blogger</p>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">"As someone who's always looking for authentic Filipino recipes, Kain Tayo is my go-to resource. The step-by-step guides are incredibly helpful!"</p>
                  <div className="flex mt-4 text-[#F39C12]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                </div>
                
                <div className="bg-[#FFF5EB] p-6 rounded-2xl border border-[#FFE0D6]">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#E74C3C] to-[#F39C12] rounded-full flex items-center justify-center text-white font-bold mr-4">
                      AS
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Pedro Pinduko</h4>
                      <p className="text-sm text-gray-600">Beginner Cook</p>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">"I never thought I could cook Filipino food until I found Kain Tayo. The detailed instructions made it so simple!"</p>
                  <div className="flex mt-4 text-[#F39C12]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </SignedOut>
    </>
  );
}