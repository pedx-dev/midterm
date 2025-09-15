export async function GET() {
  const apiKey = process.env.MY_KEY;
  const url = "https://ipt-apikey.vercel.app/api/ping";

  const apiRes = await fetch(url, {
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
    cook_time: recipe.cookTime,
    servings: recipe.servings,
    ingredients: recipe.ingredients.split(", "), // Convert string to array
    image_url: recipe.imageUrl,
  }));
  return Response.json(recipes, { status: apiRes.status });
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

  // Handle the actual API response structure and transform the recipe
  const recipes =
    response.ok && response.recipe
      ? [
          {
            id: response.recipe.id.toString(),
            title: response.recipe.title,
            description: response.recipe.description,
            instructions: response.recipe.instructions,
            prep_time: response.recipe.prepTime,
            cook_time: response.recipe.cookTime,
            servings: response.recipe.servings,
            ingredients: response.recipe.ingredients.split(", "),
            image_url: response.recipe.imageUrl,
          },
        ]
      : [];

  return Response.json(recipes, { status: apiRes.status });
}
