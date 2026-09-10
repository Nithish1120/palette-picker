import type { MenuItem } from "./cart";

export const menuItems: MenuItem[] = [
  { id:"1", category:"Signature Coffee", name:"Therapy Latte", description:"Velvety espresso, vanilla bean and cinnamon foam.", price:265, dietary:"veg", image:"https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&w=900&q=80", moods:["boost","comfort","happiness"], signature:true },
  { id:"2", category:"Signature Coffee", name:"Mood Booster Coffee", description:"Double espresso, dark cocoa and orange zest.", price:295, dietary:"veg", image:"https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80", moods:["boost","energy"], signature:true },
  { id:"3", category:"Cold Coffee", name:"Salted Caramel Cloud", description:"Cold brew, sea salt caramel and whipped cream.", price:285, dietary:"veg", image:"https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=80", moods:["comfort","happiness"] },
  { id:"4", category:"Fresh Juices", name:"Berry Bliss", description:"Strawberry, blueberry, pomegranate and mint.", price:245, dietary:"veg", image:"https://images.unsplash.com/photo-1622597467836-f3285f2131b8?auto=format&fit=crop&w=900&q=80", moods:["fresh","happiness"], signature:true },
  { id:"5", category:"Breakfast", name:"Garden Avocado Toast", description:"Sourdough, avocado, feta and garden herbs.", price:345, dietary:"veg", image:"https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?auto=format&fit=crop&w=900&q=80", moods:["fresh","energy"] },
  { id:"6", category:"Burgers & Sandwiches", name:"Therapy Burger", description:"Smoky grilled patty, aged cheddar and therapy sauce.", price:495, dietary:"non-veg", image:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80", moods:["comfort","energy"], signature:true },
  { id:"7", category:"Pasta", name:"Comfort Pasta", description:"Rigatoni, roasted tomato and parmesan sauce.", price:425, dietary:"veg", image:"https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=80", moods:["comfort","slow"], signature:true },
  { id:"8", category:"Pizza", name:"Wild Mushroom Pizza", description:"Wood-fired crust, truffle cream and fresh thyme.", price:525, dietary:"veg", image:"https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=80", moods:["comfort","slow"] },
  { id:"9", category:"Desserts", name:"Chocolate Therapy Cake", description:"Dark chocolate ganache, espresso crumb and sea salt.", price:325, dietary:"veg", image:"https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=80", moods:["comfort","happiness"], signature:true },
  { id:"10", category:"Signature Specials", name:"Signature Loaded Fries", description:"Crisp fries, jalapeño fondue and smoky sauce.", price:345, dietary:"veg", image:"https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=80", moods:["energy","happiness"], signature:true },
];

export const moodOptions = [
  { id: "boost", icon: "☕", label: "Need a Boost" },
  { id: "comfort", icon: "🍫", label: "Need Comfort" },
  { id: "fresh", icon: "🥗", label: "Need Fresh" },
  { id: "energy", icon: "🔥", label: "Need Energy" },
  { id: "happiness", icon: "🍰", label: "Need Happiness" },
  { id: "slow", icon: "🌙", label: "Need a Slow Evening" },
];

export const menuCategories = [
  "All",
  "Signature Coffee",
  "Cold Coffee",
  "Fresh Juices",
  "Breakfast",
  "Burgers & Sandwiches",
  "Pasta",
  "Pizza",
  "Desserts",
  "Signature Specials",
];
