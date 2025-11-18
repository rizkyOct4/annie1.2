import CategoryCard from "./components/Categories";
// import { dehydrate, QueryClient, HydrationBoundary } from "@tanstack/react-query";


export type CategoriesType = {
  icon: string;
  name: string;
  path: string;
  description: string;
};

export const categories: CategoriesType[] = [
  {
    icon: "📸",
    name: "Photography",
    path: "Photography",
    description: "Photography techniques, presets, and creative works",
  },
  {
    icon: "🎥",
    name: "Videography",
    path: "Videography",
    description: "Sinematografi, editing, and production video tips",
  },
  {
    icon: "🎨",
    name: "Digital Art",
    path: "Digital Art",
    description: "Illustration, fanart, and exploration digital visual",
  },
  {
    icon: "🏙️",
    name: "Architecture",
    path: "Architecture",
    description: "Building designs, cityscapes and architectural inspiration",
  },
  {
    icon: "👗",
    name: "Fashion",
    path: "Fashion",
    description: "OOTD, style tips, and creative editorials",
  },
  {
    icon: "🌿",
    name: "Nature",
    path: "Nature",
    description: "Natural landscapes, wildlife and outdoor exploration",
  },
  {
    icon: "🍳",
    name: "Food & Drink",
    path: "Food & Drink",
    description: "Food photography, recipes and creative plating",
  },
  {
    icon: "🚗",
    name: "Automotive",
    path: "Automotive",
    description: "Cars, motorcycles and automotive photography",
  },
  {
    icon: "🌌",
    name: "Astrophotography",
    path: "Astrophotography",
    description: "Night sky, stars and celestial phenomena",
  },
  {
    icon: "📱",
    name: "Mobile Shots",
    path: "Mobile Shots",
    description: "Works from smartphone cameras & mobile editing",
  },
  {
    icon: "🧳",
    name: "Travel",
    path: "Travel",
    description: "Travel, places of interest and local culture",
  },
  {
    icon: "🎭",
    name: "Creative Concepts",
    path: "Creative Concepts",
    description: "Visual experiments, manipulations and artistic concepts",
  },
  {
    icon: "👶",
    name: "Lifestyle & People",
    path: "Lifestyle & People",
    description: "Daily life photos and human portraits",
  },
  {
    icon: "🔧",
    name: "Behind The Scenes",
    path: "Behind The Scenes",
    description: "Creative process, gear setup, and studio tour",
  },
];
const page = async () => {
  const path = "category";

  // const queryClient = new QueryClient();

  // const URL = CATEGORY("category");
  // const res = await fetch(URL, {
  //   next: { revalidate: 60 * 2 },
  // });

  // const data = await res.json();
  // console.log(data)

  return <CategoryCard staticData={categories} path={path} />;
};

export default page;
