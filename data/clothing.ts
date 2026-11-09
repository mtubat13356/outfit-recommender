export type ClothingItem = {
  id: string;
  name: string;
  category: "top" | "bottom" | "shoes";
  color: string;
  occasions: string[];
  minTemp: number;
  maxTemp: number;
};

export const clothing: ClothingItem[] = [
  // ----- Tops -----
  {
    id: "grey-hoodie",
    name: "Grey Hoodie",
    category: "top",
    color: "grey",
    occasions: ["casual", "school"],
    minTemp: 5,
    maxTemp: 18,
  },
  {
    id: "white-tee",
    name: "White T-Shirt",
    category: "top",
    color: "white",
    occasions: ["casual", "school", "sport"],
    minTemp: 18,
    maxTemp: 35,
  },
  {
    id: "light-blue-shirt",
    name: "Light Blue Button-Down Shirt",
    category: "top",
    color: "blue",
    occasions: ["work", "formal"],
    minTemp: 12,
    maxTemp: 28,
  },
  {
    id: "black-sweater",
    name: "Black Knit Sweater",
    category: "top",
    color: "black",
    occasions: ["casual", "work", "formal"],
    minTemp: -5,
    maxTemp: 12,
  },
  {
    id: "red-polo",
    name: "Red Polo Shirt",
    category: "top",
    color: "red",
    occasions: ["casual", "work"],
    minTemp: 16,
    maxTemp: 30,
  },

  // ----- Bottoms -----
  {
    id: "blue-jeans",
    name: "Blue Jeans",
    category: "bottom",
    color: "blue",
    occasions: ["casual", "school"],
    minTemp: -5,
    maxTemp: 24,
  },
  {
    id: "black-trousers",
    name: "Black Dress Trousers",
    category: "bottom",
    color: "black",
    occasions: ["work", "formal"],
    minTemp: 0,
    maxTemp: 26,
  },
  {
    id: "khaki-chinos",
    name: "Khaki Chinos",
    category: "bottom",
    color: "beige",
    occasions: ["casual", "work", "school"],
    minTemp: 8,
    maxTemp: 28,
  },
  {
    id: "grey-shorts",
    name: "Grey Athletic Shorts",
    category: "bottom",
    color: "grey",
    occasions: ["sport", "casual"],
    minTemp: 20,
    maxTemp: 38,
  },
  {
    id: "denim-shorts",
    name: "Denim Shorts",
    category: "bottom",
    color: "blue",
    occasions: ["casual"],
    minTemp: 22,
    maxTemp: 38,
  },

  // ----- Shoes -----
  {
    id: "white-sneakers",
    name: "White Sneakers",
    category: "shoes",
    color: "white",
    occasions: ["casual", "school"],
    minTemp: 5,
    maxTemp: 35,
  },
  {
    id: "black-dress-shoes",
    name: "Black Leather Dress Shoes",
    category: "shoes",
    color: "black",
    occasions: ["work", "formal"],
    minTemp: -5,
    maxTemp: 30,
  },
  {
    id: "running-shoes",
    name: "Running Shoes",
    category: "shoes",
    color: "grey",
    occasions: ["sport", "casual"],
    minTemp: 0,
    maxTemp: 38,
  },
  {
    id: "brown-boots",
    name: "Brown Boots",
    category: "shoes",
    color: "brown",
    occasions: ["casual", "work"],
    minTemp: -10,
    maxTemp: 15,
  },
  {
    id: "sandals",
    name: "Sandals",
    category: "shoes",
    color: "brown",
    occasions: ["casual"],
    minTemp: 24,
    maxTemp: 40,
  },
];
