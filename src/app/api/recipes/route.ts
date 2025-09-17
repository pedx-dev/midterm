export async function GET(request: Request) {
  const apiKey = process.env.MY_KEY;
  const url = new URL(request.url);

  // Extract query parameters
  const page = url.searchParams.get("page") || "1";
  const limit = url.searchParams.get("limit") || "10";
  const category = url.searchParams.get("category");
  const sortBy = url.searchParams.get("sortBy");
  const order = url.searchParams.get("order") || "asc";

  // Build the API URL with query parameters
  const apiUrl = new URL("https://ipt-apikey.vercel.app/api/ping");
  apiUrl.searchParams.set("page", page);
  apiUrl.searchParams.set("limit", limit);
  if (category) apiUrl.searchParams.set("category", category);
  if (sortBy) apiUrl.searchParams.set("sortBy", sortBy);
  if (order) apiUrl.searchParams.set("order", order);

  const apiRes = await fetch(apiUrl.toString(), {
    headers: {
      "x-api-key": apiKey || "",
    },
  });

  // If the response is not JSON, return an error
  const contentType = apiRes.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    const text = await apiRes.text();
    console.error("API error response:", text);
    return new Response(text, { status: apiRes.status });
  }

  const response = await apiRes.json();
  // Extract and transform the recipes array from the response
  const recipes = (response.data || []).map((recipe: any) => ({
    id: recipe.id.toString(),
    title: recipe.title,
    description: recipe.description,
    instructions: recipe.instructions,
    prep_time: recipe.prepTime,
    category: recipe.category,
    cook_time: recipe.cookTime,
    servings: recipe.servings,
    ingredients: recipe.ingredients.split(", "), // Convert string to array
    image_url: recipe.imageUrl,
  }));

  // Return recipes with pagination metadata if available
  return Response.json(
    {
      recipes,
      pagination: response.pagination || null,
      total: response.total || recipes.length,
    },
    { status: apiRes.status },
  );
}

export async function POST(request: Request) {
  const apiKey = process.env.MY_KEY;
  const { keyword } = await request.json();

  const url = "https://ipt-apikey.vercel.app/api/echo";

  const apiRes = await fetch(url, {
    method: "POST",
    headers: {
      "x-api-key": apiKey || "",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      postBody: keyword, // Updated to match the API's expected field
      action: "search_recipes",
    }),
  });

  // If the response is not JSON, return an error
  const contentType = apiRes.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    const text = await apiRes.text();
    console.error("API error response:", text);
    return new Response(text, { status: apiRes.status });
  }

  const response = await apiRes.json();

  // Handle both single recipe and multiple recipes response structure
  let recipes = [];

  if (response.ok && response.recipe) {
    // Single recipe response
    recipes = [
      {
        id: response.recipe.id.toString(),
        title: response.recipe.title,
        description: response.recipe.description,
        instructions: response.recipe.instructions,
        category: response.recipe.category,
        prep_time: response.recipe.prepTime,
        cook_time: response.recipe.cookTime,
        servings: response.recipe.servings,
        ingredients: response.recipe.ingredients.split(", "),
        image_url: response.recipe.imageUrl,
      },
    ];
  } else if (response.ok && response.recipes) {
    // Multiple recipes response
    recipes = response.recipes.map((recipe: any) => ({
      id: recipe.id.toString(),
      title: recipe.title,
      description: recipe.description,
      instructions: recipe.instructions,
      category: recipe.category,
      prep_time: recipe.prepTime,
      cook_time: recipe.cookTime,
      servings: recipe.servings,
      ingredients: recipe.ingredients.split(", "),
      image_url: recipe.imageUrl,
    }));
  }

  console.log("Recipes:", recipes); // Debugging line

  return Response.json(recipes, { status: apiRes.status });
}
