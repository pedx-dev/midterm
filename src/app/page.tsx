"use client";

import { useState, useEffect } from "react";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import { Search, Clock, Users, Utensils, BookOpen, ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "~/components/ui/carousel";

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
}

export default function kainTayo() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  // Fetch initial recipes on component mount
  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/recipes?limit=20&page=1');
      const data = await response.json();
      setRecipes(data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
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
      const response = await fetch('/api/recipes/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keyword: searchQuery }),
      });
      const data = await response.json();
      setRecipes(data);
    } catch (error) {
      console.error('Error searching recipes:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <>
      <SignedIn>
        <div className="min-h-screen bg-gradient-to-b from-[#fffffe] to-[#ffdaba] py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-[#E74C3C] mb-4 md:mb-0">Discover Filipino Recipes</h1>
              <Link href="/">
                <Button variant="outline" className="border-[#E74C3C] text-[#E74C3C] hover:bg-[#FFF0EB]">
                  Back to Home
                </Button>
              </Link>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mb-8">
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="text"
                  placeholder="Search for recipes, ingredients, or categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-6 text-lg border-2 border-[#FFE0D6] focus:border-[#E74C3C]"
                />
                <Button 
                  type="submit" 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-[#E74C3C] to-[#F39C12] hover:from-[#C0392B] hover:to-[#D35400]"
                  disabled={isSearching}
                >
                  {isSearching ? "Searching..." : "Search"}
                </Button>
              </div>
            </form>

            {/* Recipe Cards Grid */}
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E74C3C]"></div>
              </div>
            ) : (
              <>
                {recipes.length === 0 ? (
                  <div className="text-center py-12">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">No recipes found</h2>
                    <p className="text-gray-600">Try a different search term or browse all recipes.</p>
                    <Button 
                      onClick={fetchRecipes}
                      className="mt-4 bg-gradient-to-r from-[#E74C3C] to-[#F39C12] hover:from-[#C0392B] hover:to-[#D35400]"
                    >
                      Browse All Recipes
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recipes.map((recipe) => (
                      <Card key={recipe.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        <div className="h-48 overflow-hidden">
                          <img 
                            src={recipe.image_url} 
                            alt={recipe.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <CardHeader>
                          <CardTitle className="text-xl text-[#E74C3C]">{recipe.title}</CardTitle>
                          <CardDescription>{recipe.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex justify-between mb-4">
                            <div className="flex items-center text-sm text-gray-600">
                              <Clock size={16} className="mr-1" />
                              <span>Prep: {recipe.prep_time}min</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Utensils size={16} className="mr-1" />
                              <span>Cook: {recipe.cook_time}min</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Users size={16} className="mr-1" />
                              <span>Serves: {recipe.servings}</span>
                            </div>
                          </div>
                          <div className="mb-4">
                            <h4 className="font-semibold text-gray-700 mb-2">Ingredients:</h4>
                            <ul className="text-sm text-gray-600 list-disc list-inside">
                              {recipe.ingredients.slice(0, 3).map((ingredient, index) => (
                                <li key={index}>{ingredient}</li>
                              ))}
                              {recipe.ingredients.length > 3 && (
                                <li className="text-[#E74C3C]">+{recipe.ingredients.length - 3} more</li>
                              )}
                            </ul>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button className="w-full bg-gradient-to-r from-[#E74C3C] to-[#F39C12] hover:from-[#C0392B] hover:to-[#D35400]">
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
                  <p className="text-gray-600 italic">"I never thought I could cook Filipino food until I found Kain Tayo. The videos and detailed instructions made it so simple!"</p>
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