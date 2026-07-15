import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  Flame, Droplet, Dumbbell, Moon, Footprints, ChevronRight, ChevronLeft, Check,
  Plus, Timer, Sun, MoonStar, Settings2, X, Clock, TrendingUp, ChefHat,
  ClipboardList, LayoutDashboard, UtensilsCrossed, BarChart3, Flower2,
  CalendarDays, LayoutGrid,
} from "lucide-react";

/* ============================================================
   DESIGN TOKENS
   Palette: ink navy ground, turmeric accent (energy/spice),
   teal secondary (nutrition/calm), warm coral for alerts.
   Display: Sora (geometric, confident) / Body: Inter / Data: IBM Plex Mono
   ============================================================ */
const TOKENS = {
  bg: "#12151C",
  bgElevated: "#1A1E28",
  bgCard: "#20242F",
  bgCardHover: "#262B38",
  border: "#2E3340",
  ink: "#F3F1EA",
  inkDim: "#9AA0AE",
  inkFaint: "#5C6270",
  turmeric: "#E8A33D",
  turmericDim: "#3A2E1A",
  teal: "#2EC4B6",
  tealDim: "#16302D",
  coral: "#E8664D",
  coralDim: "#3A2019",
  violet: "#8B7FD6",
};

const LIGHT_TOKENS = {
  bg: "#F6F5F1",
  bgElevated: "#FFFFFF",
  bgCard: "#FFFFFF",
  bgCardHover: "#F0EFEA",
  border: "#E4E2DA",
  ink: "#1B1D22",
  inkDim: "#6B7080",
  inkFaint: "#9CA1AE",
  turmeric: "#C97F1E",
  turmericDim: "#FBEBD4",
  teal: "#1D9C90",
  tealDim: "#DEF3F1",
  coral: "#D8543C",
  coralDim: "#FBE3DD",
  violet: "#6E60C4",
};

/* ============================================================
   STATIC DATA
   ============================================================ */
const EXERCISE_DB = {
  Push: [
    { name: "Flat Machine/Smith Chest Press", sets: 3, reps: "8-10", equip: "Smith machine" },
    { name: "Incline Dumbbell Press", sets: 3, reps: "10-12", equip: "Dumbbells" },
    { name: "Seated Shoulder Press Machine", sets: 3, reps: "10-12", equip: "Shoulder press machine" },
    { name: "Cable Lateral Raise", sets: 3, reps: "12-15", equip: "Cable tower" },
    { name: "Pec Deck Fly", sets: 3, reps: "12-15", equip: "Pec deck" },
    { name: "Triceps Rope Pushdown", sets: 3, reps: "12-15", equip: "Cable tower" },
  ],
  Pull: [
    { name: "Lat Pulldown", sets: 3, reps: "10-12", equip: "Lat pulldown machine" },
    { name: "Seated Cable Row", sets: 3, reps: "10-12", equip: "Cable row station" },
    { name: "Assisted Pull-up / Machine Row", sets: 3, reps: "8-10", equip: "Assisted pull-up machine" },
    { name: "Face Pull", sets: 3, reps: "12-15", equip: "Cable tower" },
    { name: "Machine Bicep Curl", sets: 3, reps: "10-12", equip: "Curl machine" },
    { name: "Hammer Curl", sets: 2, reps: "12-15", equip: "Dumbbells" },
  ],
  Legs: [
    { name: "Leg Press (controlled depth)", sets: 3, reps: "10-12", equip: "Leg press machine" },
    { name: "Leg Extension", sets: 3, reps: "12-15", equip: "Leg extension machine" },
    { name: "Leg Curl", sets: 3, reps: "12-15", equip: "Leg curl machine" },
    { name: "Hip Abduction/Adduction (light)", sets: 2, reps: "15", equip: "Hip machine" },
    { name: "Standing Calf Raise", sets: 3, reps: "15-20", equip: "Calf machine" },
    { name: "Bodyweight Bridge", sets: 2, reps: "12", equip: "Mat" },
  ],
  "Upper Body": [
    { name: "Chest Press Machine", sets: 3, reps: "10-12", equip: "Chest press machine" },
    { name: "Lat Pulldown", sets: 3, reps: "10-12", equip: "Lat pulldown machine" },
    { name: "Shoulder Press Machine", sets: 3, reps: "10-12", equip: "Shoulder press machine" },
    { name: "Seated Cable Row", sets: 3, reps: "10-12", equip: "Cable row station" },
  ],
  "Lower Body": [
    { name: "Leg Press", sets: 3, reps: "10-12", equip: "Leg press machine" },
    { name: "Leg Extension", sets: 3, reps: "12-15", equip: "Leg extension machine" },
    { name: "Leg Curl", sets: 3, reps: "12-15", equip: "Leg curl machine" },
    { name: "Standing Calf Raise", sets: 3, reps: "15-20", equip: "Calf machine" },
  ],
  "Full Body": [
    { name: "Leg Press", sets: 2, reps: "10-12", equip: "Leg press machine" },
    { name: "Chest Press Machine", sets: 2, reps: "10-12", equip: "Chest press machine" },
    { name: "Lat Pulldown", sets: 2, reps: "10-12", equip: "Lat pulldown machine" },
    { name: "Cable Crunch", sets: 2, reps: "12-15", equip: "Cable tower" },
  ],
  Cardio: [
    { name: "Incline Treadmill Walk", sets: 1, reps: "20-30 min", equip: "Treadmill" },
    { name: "Stationary Bike", sets: 1, reps: "15-20 min", equip: "Bike" },
  ],
  Core: [
    { name: "Cable Crunch", sets: 2, reps: "12-15", equip: "Cable tower" },
    { name: "Plank", sets: 2, reps: "30-45s", equip: "Mat" },
    { name: "Back Extension", sets: 2, reps: "12-15", equip: "Roman chair" },
  ],
  Mobility: [
    { name: "Cat-Camel", sets: 2, reps: "10-15", equip: "Mat" },
    { name: "Pelvic Tilt", sets: 2, reps: "10-15", equip: "Mat" },
    { name: "Hip Abduction/Adduction (light)", sets: 2, reps: "15", equip: "Hip machine" },
    { name: "Bodyweight Bridge", sets: 2, reps: "10, 5s hold", equip: "Mat" },
  ],
  Stretching: [
    { name: "Kneeling Hip Flexor Stretch", sets: 3, reps: "30s/side", equip: "Mat" },
    { name: "Standing Quad Stretch", sets: 3, reps: "30s/side", equip: "None" },
    { name: "Supine Piriformis Stretch", sets: 3, reps: "30s/side", equip: "Mat" },
    { name: "Figure-4 Stretch", sets: 3, reps: "30s/side", equip: "Mat" },
    { name: "Butterfly Adductor Stretch", sets: 3, reps: "30s", equip: "Mat" },
  ],
  "Active Recovery": [
    { name: "Incline Treadmill Walk", sets: 1, reps: "20-30 min", equip: "Treadmill" },
    { name: "Cat-Camel", sets: 2, reps: "10-15", equip: "Mat" },
    { name: "Pelvic Tilt", sets: 2, reps: "10-15", equip: "Mat" },
    { name: "Bodyweight Bridge", sets: 2, reps: "10, 5s hold", equip: "Mat" },
    { name: "Kneeling Hip Flexor Stretch", sets: 2, reps: "30s/side", equip: "Mat" },
    { name: "Figure-4 Stretch", sets: 2, reps: "30s/side", equip: "Mat" },
  ],
};

const CATEGORY_ICON = {
  Push: Dumbbell, Pull: Dumbbell, Legs: Dumbbell, "Upper Body": Dumbbell,
  "Lower Body": Dumbbell, "Full Body": Dumbbell, Cardio: Footprints,
  Core: Dumbbell, Mobility: Flower2, Stretching: Flower2, "Active Recovery": Flower2,
};

/* Weekly training schedule — maps each day to its recommended session type */
const WEEKLY_SCHEDULE = [
  { day: "Monday", session: "Push", description: "Chest, shoulders, and triceps" },
  { day: "Tuesday", session: "Pull", description: "Back and biceps" },
  { day: "Wednesday", session: "Legs", description: "Quadriceps, hamstrings, and calves" },
  { day: "Thursday", session: "Push", description: "Chest, shoulders, and triceps" },
  { day: "Friday", session: "Pull", description: "Back and biceps" },
  { day: "Saturday", session: "Legs", description: "Quadriceps, hamstrings, and calves" },
  { day: "Sunday", session: "Active Recovery", description: "Light cardio and mobility work" },
];

const TODAY_NAME = new Date().toLocaleDateString("en-US", { weekday: "long" });

const RECIPES = [
  { id: 1, name: "Egg Bhurji", cat: "Breakfast", tags: ["High Protein", "Non-Vegetarian"], prep: 5, cook: 5, servings: 1, cal: 320, protein: 21, carbs: 6, fat: 22, fiber: 1,
    ingredients: ["3 eggs", "1/2 onion, chopped", "1 tomato, chopped", "1 green chili", "1/4 tsp turmeric", "Salt to taste", "1 tsp oil"],
    steps: ["Whisk eggs with salt.", "Sauté onion, tomato, chili in oil until soft.", "Add turmeric, pour in eggs.", "Scramble on low-medium heat until just set.", "Serve with roti."] },
  { id: 2, name: "Sprouts & Moong Salad", cat: "Snacks", tags: ["High Protein", "Vegetarian"], prep: 5, cook: 0, servings: 1, cal: 180, protein: 12, carbs: 24, fat: 3, fiber: 8,
    ingredients: ["1 cup sprouted moong", "1/2 onion, diced", "1 tomato, diced", "1/2 cucumber, diced", "1 lemon, juiced", "Chaat masala, salt"],
    steps: ["Mix all vegetables and sprouts in a bowl.", "Add lemon juice, chaat masala, salt.", "Toss well and serve fresh."] },
  { id: 3, name: "Curd Rice with Flax", cat: "Lunch", tags: ["Vegetarian"], prep: 5, cook: 0, servings: 1, cal: 340, protein: 10, carbs: 52, fat: 9, fiber: 3,
    ingredients: ["1 cup cooked rice", "1 cup curd", "1 tbsp ground flaxseed", "Mustard seeds, curry leaves for tempering", "Salt"],
    steps: ["Mix cooked rice with curd and salt.", "Temper mustard seeds and curry leaves in a little oil, add to rice.", "Stir in ground flaxseed and serve."] },
  { id: 4, name: "Batch Chicken Curry", cat: "Dinner", tags: ["High Protein", "Non-Vegetarian"], prep: 15, cook: 30, servings: 4, cal: 310, protein: 32, carbs: 8, fat: 16, fiber: 2,
    ingredients: ["800g chicken thigh/breast", "2 onions", "3 tomatoes", "Ginger-garlic paste", "Turmeric, chili powder, garam masala", "2 tbsp oil"],
    steps: ["Sauté onions until golden, add ginger-garlic paste.", "Add tomatoes and spices, cook until oil separates.", "Add chicken, cook covered 20-25 min.", "Portion into containers for the week."] },
  { id: 5, name: "Protein Smoothie", cat: "Pre-workout", tags: ["High Protein", "Vegetarian"], prep: 2, cook: 0, servings: 1, cal: 340, protein: 24, carbs: 40, fat: 9, fiber: 3,
    ingredients: ["1 cup milk", "1 banana", "1 tbsp peanut butter", "1 scoop whey (optional)"],
    steps: ["Add all ingredients to a blender.", "Blend until smooth.", "Drink immediately."] },
  { id: 6, name: "Moong Dal Chilla", cat: "Breakfast", tags: ["High Protein", "Vegetarian"], prep: 10, cook: 10, servings: 2, cal: 260, protein: 16, carbs: 34, fat: 6, fiber: 6,
    ingredients: ["1 cup soaked moong dal", "1 inch ginger", "1 green chili", "1/2 tsp cumin", "Salt", "Oil for cooking"],
    steps: ["Blend soaked dal with ginger, chili, cumin, salt into a batter.", "Heat a tawa, pour batter like a pancake.", "Cook both sides with a little oil until golden."] },
  { id: 7, name: "Paneer Bhurji", cat: "Dinner", tags: ["High Protein", "Vegetarian"], prep: 5, cook: 8, servings: 2, cal: 280, protein: 18, carbs: 8, fat: 20, fiber: 2,
    ingredients: ["200g paneer, crumbled", "1 onion", "1 tomato", "1/2 tsp turmeric", "Salt, chili powder", "1 tsp oil"],
    steps: ["Sauté onion and tomato until soft.", "Add spices, then crumbled paneer.", "Cook 3-4 min on medium heat and serve."] },
  { id: 8, name: "Ragi (Millet) Dosa", cat: "Breakfast", tags: ["Vegetarian"], prep: 10, cook: 10, servings: 2, cal: 220, protein: 6, carbs: 40, fat: 4, fiber: 5,
    ingredients: ["1 cup ragi flour", "1/2 cup rice flour", "1/2 cup curd", "Water as needed", "Salt"],
    steps: ["Mix ragi flour, rice flour, curd, salt with water into a thin batter.", "Rest 10 min.", "Pour on a hot tawa, spread thin, cook both sides."] },

  /* ---------- Breakfast (added) ---------- */
  { id: 9, name: "Protein Overnight Oats", cat: "Breakfast", tags: ["High Protein", "Vegetarian"], prep: 5, cook: 0, note: "+ overnight chill", servings: 1, cal: 380, protein: 30, carbs: 45, fat: 9,
    ingredients: ["1/2 cup rolled oats", "3/4 cup milk", "1 scoop vanilla protein powder", "1/4 cup blueberries", "1 tbsp chia seeds"],
    steps: ["Combine oats, milk, protein powder, and chia seeds in a jar.", "Stir well and top with blueberries.", "Refrigerate overnight.", "Eat cold in the morning."] },
  { id: 10, name: "Blueberry Protein Oatmeal", cat: "Breakfast", tags: ["High Protein", "Vegetarian"], prep: 2, cook: 5, servings: 1, cal: 350, protein: 28, carbs: 42, fat: 7,
    ingredients: ["1/2 cup oats", "1 cup milk", "1 scoop protein powder", "1/4 cup blueberries"],
    steps: ["Cook oats with milk on the stovetop or microwave until soft.", "Let cool slightly (so protein powder doesn't clump).", "Stir in protein powder.", "Top with blueberries and serve."] },
  { id: 11, name: "Greek Yogurt Protein Bowl", cat: "Breakfast", tags: ["High Protein", "Vegetarian"], prep: 5, cook: 0, servings: 1, cal: 320, protein: 25, carbs: 35, fat: 8,
    ingredients: ["1 cup plain Greek yogurt", "1/4 cup blueberries", "1/4 cup strawberries", "2 tbsp granola", "1 tsp honey"],
    steps: ["Add yogurt to a bowl.", "Top with berries and granola.", "Drizzle honey and serve."] },
  { id: 12, name: "Protein Smoothie (Blueberry-PB)", cat: "Breakfast", tags: ["High Protein", "Vegetarian", "Pre-workout"], prep: 3, cook: 0, servings: 1, cal: 340, protein: 30, carbs: 38, fat: 7,
    ingredients: ["1 cup milk", "1 scoop protein powder", "1/2 banana", "1/4 cup blueberries", "1 tbsp peanut butter", "2 tbsp oats"],
    steps: ["Add all ingredients to a blender.", "Blend for 30-60 seconds until smooth.", "Pour and drink immediately."] },
  { id: 13, name: "Egg & Avocado Toast", cat: "Breakfast", tags: ["Vegetarian"], prep: 5, cook: 7, servings: 1, cal: 380, protein: 18, carbs: 30, fat: 22,
    ingredients: ["2 slices whole grain bread", "2 eggs", "1/2 avocado", "Salt, pepper, chili flakes"],
    steps: ["Toast the bread.", "Cook eggs to your liking (fried or poached).", "Mash avocado with salt and pepper, spread on toast.", "Top with eggs and serve."] },
  { id: 14, name: "Veggie Omelet", cat: "Breakfast", tags: ["Vegetarian", "High Protein"], prep: 5, cook: 8, servings: 1, cal: 300, protein: 22, carbs: 8, fat: 20,
    ingredients: ["3 eggs", "1/2 cup spinach", "1/4 cup mushrooms", "2 tbsp onion", "2 tbsp shredded cheese"],
    steps: ["Sauté spinach, mushrooms, and onion until soft.", "Pour beaten eggs over the vegetables.", "Add cheese, fold the omelet, and cook through.", "Serve warm."] },
  { id: 15, name: "Protein Pancakes", cat: "Breakfast", tags: ["High Protein", "Vegetarian"], prep: 5, cook: 10, servings: 2, cal: 350, protein: 26, carbs: 38, fat: 9,
    ingredients: ["1/2 cup oats", "2 eggs", "1 banana", "1 scoop protein powder"],
    steps: ["Blend all ingredients until smooth.", "Pour small circles of batter onto a hot, lightly oiled pan.", "Cook until bubbles form, flip, and cook the other side.", "Serve stacked."] },
  { id: 16, name: "Cottage Cheese Bowl", cat: "Breakfast", tags: ["High Protein", "Vegetarian"], prep: 3, cook: 0, servings: 1, cal: 260, protein: 24, carbs: 18, fat: 9,
    ingredients: ["1 cup cottage cheese", "1/4 cup mixed berries", "1 tbsp almonds", "Pinch of cinnamon"],
    steps: ["Add cottage cheese to a bowl.", "Top with berries and almonds.", "Sprinkle cinnamon and serve."] },
  { id: 17, name: "Breakfast Burrito", cat: "Breakfast", tags: ["High Protein", "Non-Vegetarian"], prep: 8, cook: 10, servings: 1, cal: 420, protein: 28, carbs: 32, fat: 20,
    ingredients: ["2 eggs", "50g turkey sausage", "2 tbsp shredded cheese", "1 whole wheat tortilla"],
    steps: ["Cook turkey sausage until browned.", "Scramble eggs and add to the pan.", "Add cheese, stir until melted.", "Wrap the filling in the tortilla and serve."] },
  { id: 18, name: "Peanut Butter Banana Toast", cat: "Breakfast", tags: ["Vegetarian"], prep: 3, cook: 0, servings: 1, cal: 320, protein: 10, carbs: 40, fat: 14,
    ingredients: ["2 slices whole grain toast", "2 tbsp peanut butter", "1 banana, sliced"],
    steps: ["Toast the bread.", "Spread peanut butter on top.", "Layer sliced banana over it and serve."] },

  /* ---------- Lunch (added) ---------- */
  { id: 19, name: "Grilled Chicken & Rice Bowl", cat: "Lunch", tags: ["High Protein", "Non-Vegetarian"], prep: 10, cook: 20, servings: 1, cal: 520, protein: 42, carbs: 55, fat: 12,
    ingredients: ["150g chicken breast", "1 cup cooked brown rice", "1 cup broccoli"],
    steps: ["Season and grill the chicken breast until cooked through.", "Cook the rice.", "Steam the broccoli.", "Assemble all three in a bowl."] },
  { id: 20, name: "Chicken Burrito Bowl", cat: "Lunch", tags: ["High Protein", "Non-Vegetarian"], prep: 10, cook: 20, servings: 1, cal: 560, protein: 38, carbs: 60, fat: 15,
    ingredients: ["150g chicken", "1 cup rice", "1/2 cup black beans", "1/4 cup corn", "2 tbsp salsa"],
    steps: ["Cook chicken and rice separately.", "Warm the beans and corn.", "Combine everything in a bowl and top with salsa."] },
  { id: 21, name: "Turkey Wrap", cat: "Lunch", tags: ["Non-Vegetarian"], prep: 8, cook: 0, servings: 1, cal: 380, protein: 28, carbs: 35, fat: 12,
    ingredients: ["1 whole wheat tortilla", "100g sliced turkey", "Lettuce", "1 tomato, sliced"],
    steps: ["Lay turkey, lettuce, and tomato on the tortilla.", "Roll tightly.", "Slice in half and serve."] },
  { id: 22, name: "Chicken Salad", cat: "Lunch", tags: ["High Protein", "Non-Vegetarian"], prep: 10, cook: 10, servings: 1, cal: 340, protein: 35, carbs: 12, fat: 15,
    ingredients: ["150g chicken breast", "Lettuce", "Cucumber", "Cherry tomatoes", "Dressing of choice"],
    steps: ["Cook and slice the chicken breast.", "Chop lettuce, cucumber, and tomatoes.", "Toss everything with dressing and serve."] },
  { id: 23, name: "Salmon Rice Bowl", cat: "Lunch", tags: ["High Protein", "Non-Vegetarian"], prep: 8, cook: 15, servings: 1, cal: 540, protein: 34, carbs: 50, fat: 20,
    ingredients: ["150g salmon", "1 cup rice", "1/2 avocado", "1/2 cucumber"],
    steps: ["Pan-sear or bake the salmon.", "Cook the rice.", "Slice avocado and cucumber.", "Serve salmon over rice with vegetables on the side."] },
  { id: 24, name: "Chicken Stir Fry", cat: "Lunch", tags: ["High Protein", "Non-Vegetarian"], prep: 10, cook: 15, servings: 1, cal: 450, protein: 36, carbs: 40, fat: 14,
    ingredients: ["150g chicken, sliced", "2 cups mixed vegetables", "2 tbsp soy sauce", "1 cup rice"],
    steps: ["Stir-fry chicken until nearly cooked.", "Add vegetables and soy sauce, cook until tender-crisp.", "Serve over rice."] },
  { id: 25, name: "Ground Turkey Bowl", cat: "Lunch", tags: ["High Protein", "Non-Vegetarian"], prep: 8, cook: 15, servings: 1, cal: 480, protein: 32, carbs: 48, fat: 15,
    ingredients: ["150g lean ground turkey", "1 cup rice", "1 bell pepper, sliced"],
    steps: ["Cook ground turkey with seasoning until browned.", "Sauté bell peppers.", "Serve turkey and peppers over rice."] },
  { id: 26, name: "Paneer & Rice Bowl", cat: "Lunch", tags: ["Vegetarian", "High Protein"], prep: 8, cook: 15, servings: 1, cal: 460, protein: 20, carbs: 55, fat: 18,
    ingredients: ["150g paneer, cubed", "Mixed vegetables", "1 cup rice"],
    steps: ["Cook paneer with vegetables and light spices.", "Cook the rice.", "Serve paneer and vegetables over rice."] },
  { id: 27, name: "Tuna Salad Wrap", cat: "Lunch", tags: ["High Protein", "Non-Vegetarian"], prep: 8, cook: 0, servings: 1, cal: 360, protein: 30, carbs: 32, fat: 12,
    ingredients: ["1 can tuna", "2 tbsp Greek yogurt", "1 celery stalk, diced", "1 whole wheat tortilla"],
    steps: ["Mix tuna, Greek yogurt, and celery together.", "Spoon onto the tortilla.", "Wrap tightly and serve."] },
  { id: 28, name: "Chicken Pasta", cat: "Lunch", tags: ["High Protein", "Non-Vegetarian"], prep: 10, cook: 15, servings: 1, cal: 520, protein: 34, carbs: 60, fat: 12,
    ingredients: ["100g whole wheat pasta", "150g grilled chicken", "1 cup mixed vegetables"],
    steps: ["Cook pasta according to package directions.", "Grill or pan-cook the chicken and slice.", "Sauté vegetables.", "Toss everything together and serve."] },

  /* ---------- Dinner (added) ---------- */
  { id: 29, name: "Grilled Chicken + Sweet Potato", cat: "Dinner", tags: ["High Protein", "Non-Vegetarian"], prep: 10, cook: 25, servings: 1, cal: 480, protein: 40, carbs: 42, fat: 12,
    ingredients: ["150g chicken breast", "1 medium sweet potato", "1 cup broccoli"],
    steps: ["Grill the seasoned chicken breast.", "Bake the sweet potato until soft.", "Steam broccoli.", "Plate all three together."] },
  { id: 30, name: "Salmon + Vegetables", cat: "Dinner", tags: ["High Protein", "Non-Vegetarian"], prep: 8, cook: 20, servings: 1, cal: 460, protein: 32, carbs: 18, fat: 26,
    ingredients: ["150g salmon", "1 cup asparagus", "1 cup carrots"],
    steps: ["Season salmon and bake at 400°F for ~15 min.", "Roast asparagus and carrots alongside.", "Serve together."] },
  { id: 31, name: "Chicken & Mixed Vegetables", cat: "Dinner", tags: ["High Protein", "Non-Vegetarian"], prep: 10, cook: 15, servings: 1, cal: 400, protein: 36, carbs: 20, fat: 16,
    ingredients: ["150g chicken, sliced", "1 cup broccoli", "1 cup carrots", "Light seasoning"],
    steps: ["Stir-fry chicken until browned.", "Add broccoli and carrots, cook until tender.", "Season lightly and serve."] },
  { id: 32, name: "Lean Beef Bowl", cat: "Dinner", tags: ["High Protein", "Non-Vegetarian"], prep: 10, cook: 20, servings: 1, cal: 520, protein: 38, carbs: 45, fat: 18,
    ingredients: ["150g lean beef", "1 cup rice", "Mixed vegetables"],
    steps: ["Cook beef to desired doneness.", "Cook rice and vegetables.", "Serve beef over rice with vegetables."] },
  { id: 33, name: "Turkey Meatballs", cat: "Dinner", tags: ["High Protein", "Non-Vegetarian"], prep: 15, cook: 25, servings: 2, cal: 420, protein: 32, carbs: 20, fat: 20,
    ingredients: ["300g ground turkey", "1 cup marinara sauce"],
    steps: ["Form turkey into meatballs.", "Bake at 400°F for ~20 min or until cooked through.", "Simmer in marinara sauce for 5 min.", "Serve with vegetables on the side."] },
  { id: 34, name: "Shrimp Rice Bowl", cat: "Dinner", tags: ["High Protein", "Non-Vegetarian"], prep: 10, cook: 12, servings: 1, cal: 440, protein: 30, carbs: 48, fat: 12,
    ingredients: ["150g shrimp", "1 cup rice", "Mixed vegetables"],
    steps: ["Sauté shrimp with light seasoning until pink and cooked.", "Sauté vegetables.", "Serve shrimp and vegetables over rice."] },
  { id: 35, name: "Chicken Soup", cat: "Dinner", tags: ["High Protein", "Non-Vegetarian"], prep: 10, cook: 30, servings: 2, cal: 280, protein: 26, carbs: 18, fat: 9,
    ingredients: ["200g chicken", "1 carrot, sliced", "2 celery stalks, sliced", "Broth"],
    steps: ["Add chicken, carrots, and celery to broth.", "Simmer until chicken is fully cooked (~25-30 min).", "Shred chicken and serve hot."] },
  { id: 36, name: "Paneer Stir Fry (Peppers)", cat: "Dinner", tags: ["Vegetarian", "High Protein"], prep: 8, cook: 12, servings: 1, cal: 400, protein: 18, carbs: 22, fat: 24,
    ingredients: ["150g paneer, cubed", "1 bell pepper, sliced", "1/2 onion, sliced"],
    steps: ["Sauté onions and peppers until soft.", "Add paneer and light spices.", "Stir-fry 3-4 min and serve with rice."] },
  { id: 37, name: "Grilled Tilapia", cat: "Dinner", tags: ["High Protein", "Non-Vegetarian"], prep: 8, cook: 15, servings: 1, cal: 320, protein: 34, carbs: 10, fat: 14,
    ingredients: ["150g tilapia fillet", "1 cup green beans"],
    steps: ["Season tilapia and grill or pan-sear ~5-6 min per side.", "Steam green beans.", "Serve together."] },
  { id: 38, name: "Chicken Quinoa Bowl", cat: "Dinner", tags: ["High Protein", "Non-Vegetarian"], prep: 10, cook: 20, servings: 1, cal: 480, protein: 36, carbs: 45, fat: 14,
    ingredients: ["150g chicken", "1 cup quinoa", "1 cup broccoli"],
    steps: ["Cook quinoa according to package directions.", "Grill or pan-cook the chicken.", "Steam broccoli.", "Combine all three in a bowl."] },

  /* ---------- Snacks: High-Protein (added) ---------- */
  { id: 39, name: "Greek Yogurt (plain)", cat: "Snacks", tags: ["High Protein", "Vegetarian"], prep: 2, cook: 0, servings: 1, cal: 150, protein: 22, carbs: 9, fat: 4,
    ingredients: ["1 cup plain Greek yogurt"], steps: ["Scoop into a bowl and eat as-is, or add a topping of choice."] },
  { id: 40, name: "Cottage Cheese", cat: "Snacks", tags: ["High Protein", "Vegetarian"], prep: 2, cook: 0, servings: 1, cal: 220, protein: 25, carbs: 8, fat: 10,
    ingredients: ["1 cup cottage cheese"], steps: ["Serve chilled, plain or with fruit."] },
  { id: 41, name: "Protein Shake", cat: "Snacks", tags: ["High Protein", "Vegetarian", "Drinks"], prep: 2, cook: 0, servings: 1, cal: 130, protein: 25, carbs: 3, fat: 2,
    ingredients: ["1 scoop protein powder", "1 cup water or milk"], steps: ["Shake or blend protein powder with water/milk.", "Drink immediately."] },
  { id: 42, name: "Protein Bar (low sugar)", cat: "Snacks", tags: ["High Protein"], prep: 1, cook: 0, servings: 1, cal: 200, protein: 20, carbs: 20, fat: 7,
    ingredients: ["1 low-sugar protein bar"], steps: ["Unwrap and eat — check label for exact macros by brand."] },
  { id: 43, name: "Boiled Eggs", cat: "Snacks", tags: ["High Protein", "Vegetarian"], prep: 2, cook: 10, servings: 1, cal: 140, protein: 12, carbs: 1, fat: 10,
    ingredients: ["2 eggs"], steps: ["Boil eggs in water for 9-10 min for a firm yolk.", "Cool in cold water, peel, and eat."] },
  { id: 44, name: "Turkey Slices", cat: "Snacks", tags: ["High Protein", "Non-Vegetarian"], prep: 2, cook: 0, servings: 1, cal: 110, protein: 22, carbs: 1, fat: 2,
    ingredients: ["100g sliced turkey breast"], steps: ["Eat straight from the pack, or roll with a slice of cheese."] },
  { id: 45, name: "String Cheese", cat: "Snacks", tags: ["High Protein", "Vegetarian"], prep: 1, cook: 0, servings: 1, cal: 80, protein: 7, carbs: 1, fat: 6,
    ingredients: ["1 string cheese stick"], steps: ["Peel and eat."] },
  { id: 46, name: "Edamame", cat: "Snacks", tags: ["High Protein", "Vegetarian"], prep: 2, cook: 5, servings: 1, cal: 190, protein: 17, carbs: 15, fat: 8,
    ingredients: ["1 cup edamame (frozen)", "Pinch of salt"], steps: ["Steam or microwave edamame in the pod for 4-5 min.", "Salt lightly and squeeze pods to eat."] },
  { id: 47, name: "Roasted Chickpeas", cat: "Snacks", tags: ["Vegetarian"], prep: 5, cook: 20, servings: 2, cal: 140, protein: 6, carbs: 22, fat: 4,
    ingredients: ["1 can chickpeas, drained", "1 tsp oil", "Spices of choice"], steps: ["Toss chickpeas with oil and spices.", "Roast at 400°F for 20 min, shaking halfway, until crisp."] },
  { id: 48, name: "Tuna Pouch", cat: "Snacks", tags: ["High Protein", "Non-Vegetarian"], prep: 1, cook: 0, servings: 1, cal: 100, protein: 22, carbs: 0, fat: 1,
    ingredients: ["1 tuna pouch"], steps: ["Open and eat straight from the pouch, or on a rice cake."] },

  /* ---------- Snacks: Grab & Go combos (added) ---------- */
  { id: 49, name: "Apple + Peanut Butter", cat: "Snacks", tags: ["Vegetarian"], prep: 3, cook: 0, servings: 1, cal: 250, protein: 8, carbs: 30, fat: 12,
    ingredients: ["1 apple, sliced", "2 tbsp peanut butter"], steps: ["Slice the apple.", "Dip in peanut butter and eat."] },
  { id: 50, name: "Banana + Protein Shake", cat: "Snacks", tags: ["High Protein", "Vegetarian"], prep: 3, cook: 0, servings: 1, cal: 240, protein: 26, carbs: 30, fat: 3,
    ingredients: ["1 banana", "1 scoop protein powder + water"], steps: ["Shake the protein powder with water.", "Eat the banana alongside."] },
  { id: 51, name: "Greek Yogurt + Blueberries", cat: "Snacks", tags: ["High Protein", "Vegetarian"], prep: 3, cook: 0, servings: 1, cal: 220, protein: 23, carbs: 22, fat: 4,
    ingredients: ["1 cup Greek yogurt", "1/2 cup blueberries"], steps: ["Top yogurt with blueberries and eat."] },
  { id: 52, name: "Cottage Cheese + Pineapple", cat: "Snacks", tags: ["High Protein", "Vegetarian"], prep: 3, cook: 0, servings: 1, cal: 280, protein: 26, carbs: 22, fat: 10,
    ingredients: ["1 cup cottage cheese", "1/2 cup pineapple chunks"], steps: ["Mix together and serve chilled."] },
  { id: 53, name: "Hummus + Carrots", cat: "Snacks", tags: ["Vegetarian"], prep: 3, cook: 0, servings: 1, cal: 180, protein: 6, carbs: 18, fat: 9,
    ingredients: ["3 tbsp hummus", "1 cup baby carrots"], steps: ["Dip carrots in hummus and eat."] },
  { id: 54, name: "Hummus + Cucumber", cat: "Snacks", tags: ["Vegetarian"], prep: 3, cook: 0, servings: 1, cal: 150, protein: 5, carbs: 14, fat: 8,
    ingredients: ["3 tbsp hummus", "1 cup cucumber slices"], steps: ["Dip cucumber slices in hummus and eat."] },
  { id: 55, name: "Cheese Stick + Apple", cat: "Snacks", tags: ["Vegetarian"], prep: 2, cook: 0, servings: 1, cal: 175, protein: 8, carbs: 26, fat: 6,
    ingredients: ["1 string cheese", "1 apple"], steps: ["Eat both together as a balanced snack."] },
  { id: 56, name: "Mixed Berries", cat: "Snacks", tags: ["Vegetarian"], prep: 2, cook: 0, servings: 1, cal: 90, protein: 1, carbs: 22, fat: 0,
    ingredients: ["1.5 cups mixed berries"], steps: ["Rinse and eat as-is."] },
  { id: 57, name: "Trail Mix (portion-controlled)", cat: "Snacks", tags: ["Vegetarian"], prep: 1, cook: 0, servings: 1, cal: 170, protein: 5, carbs: 15, fat: 11,
    ingredients: ["1/4 cup mixed nuts, seeds, and a few raisins"], steps: ["Pre-portion into a small container to avoid overeating.", "Eat as a grab-and-go snack."] },

  /* ---------- Snacks: Fruits (added, quick reference) ---------- */
  { id: 58, name: "Apple", cat: "Snacks", tags: ["Vegetarian", "Fruit"], prep: 1, cook: 0, servings: 1, cal: 95, protein: 0, carbs: 25, fat: 0, ingredients: ["1 medium apple"], steps: ["Wash and eat whole or sliced."] },
  { id: 59, name: "Banana", cat: "Snacks", tags: ["Vegetarian", "Fruit"], prep: 1, cook: 0, servings: 1, cal: 105, protein: 1, carbs: 27, fat: 0, ingredients: ["1 medium banana"], steps: ["Peel and eat."] },
  { id: 60, name: "Blueberries", cat: "Snacks", tags: ["Vegetarian", "Fruit"], prep: 1, cook: 0, servings: 1, cal: 85, protein: 1, carbs: 21, fat: 0, ingredients: ["1 cup blueberries"], steps: ["Rinse and eat."] },
  { id: 61, name: "Strawberries", cat: "Snacks", tags: ["Vegetarian", "Fruit"], prep: 2, cook: 0, servings: 1, cal: 50, protein: 1, carbs: 12, fat: 0, ingredients: ["1 cup strawberries"], steps: ["Rinse, hull, and eat."] },
  { id: 62, name: "Grapes", cat: "Snacks", tags: ["Vegetarian", "Fruit"], prep: 1, cook: 0, servings: 1, cal: 100, protein: 1, carbs: 27, fat: 0, ingredients: ["1 cup grapes"], steps: ["Rinse and eat."] },
  { id: 63, name: "Pineapple", cat: "Snacks", tags: ["Vegetarian", "Fruit"], prep: 3, cook: 0, servings: 1, cal: 82, protein: 1, carbs: 22, fat: 0, ingredients: ["1 cup pineapple chunks"], steps: ["Cut and eat fresh, or buy pre-cut."] },
  { id: 64, name: "Mango", cat: "Snacks", tags: ["Vegetarian", "Fruit"], prep: 3, cook: 0, servings: 1, cal: 100, protein: 1, carbs: 25, fat: 0, ingredients: ["1 cup mango, cubed"], steps: ["Peel, cube, and eat."] },
  { id: 65, name: "Kiwi", cat: "Snacks", tags: ["Vegetarian", "Fruit"], prep: 1, cook: 0, servings: 1, cal: 42, protein: 1, carbs: 10, fat: 0, ingredients: ["1 medium kiwi"], steps: ["Peel or halve and scoop out with a spoon."] },
  { id: 66, name: "Orange", cat: "Snacks", tags: ["Vegetarian", "Fruit"], prep: 2, cook: 0, servings: 1, cal: 62, protein: 1, carbs: 15, fat: 0, ingredients: ["1 medium orange"], steps: ["Peel and eat in segments."] },
  { id: 67, name: "Watermelon", cat: "Snacks", tags: ["Vegetarian", "Fruit"], prep: 2, cook: 0, servings: 1, cal: 46, protein: 1, carbs: 12, fat: 0, ingredients: ["1 cup watermelon, cubed"], steps: ["Cut and eat fresh."] },
  { id: 68, name: "Pear", cat: "Snacks", tags: ["Vegetarian", "Fruit"], prep: 1, cook: 0, servings: 1, cal: 100, protein: 1, carbs: 27, fat: 0, ingredients: ["1 medium pear"], steps: ["Wash and eat whole or sliced."] },
  { id: 69, name: "Peach", cat: "Snacks", tags: ["Vegetarian", "Fruit"], prep: 1, cook: 0, servings: 1, cal: 60, protein: 1, carbs: 15, fat: 0, ingredients: ["1 medium peach"], steps: ["Wash and eat whole or sliced."] },

  /* ---------- Snacks: Vegetables (added, quick reference) ---------- */
  { id: 70, name: "Baby Carrots", cat: "Snacks", tags: ["Vegetarian", "Vegetable"], prep: 1, cook: 0, servings: 1, cal: 50, protein: 1, carbs: 12, fat: 0, ingredients: ["1 cup baby carrots"], steps: ["Eat as-is, or pair with hummus/dip."] },
  { id: 71, name: "Cucumber Slices", cat: "Snacks", tags: ["Vegetarian", "Vegetable"], prep: 3, cook: 0, servings: 1, cal: 16, protein: 1, carbs: 4, fat: 0, ingredients: ["1 cup cucumber, sliced"], steps: ["Slice and eat, plain or lightly salted."] },
  { id: 72, name: "Bell Peppers", cat: "Snacks", tags: ["Vegetarian", "Vegetable"], prep: 3, cook: 0, servings: 1, cal: 30, protein: 1, carbs: 7, fat: 0, ingredients: ["1 cup bell peppers, sliced"], steps: ["Slice into strips and eat raw."] },
  { id: 73, name: "Celery Sticks", cat: "Snacks", tags: ["Vegetarian", "Vegetable"], prep: 3, cook: 0, servings: 1, cal: 16, protein: 1, carbs: 3, fat: 0, ingredients: ["1 cup celery, cut into sticks"], steps: ["Cut into sticks, pair with peanut butter or hummus if desired."] },
  { id: 74, name: "Cherry Tomatoes", cat: "Snacks", tags: ["Vegetarian", "Vegetable"], prep: 1, cook: 0, servings: 1, cal: 27, protein: 1, carbs: 6, fat: 0, ingredients: ["1 cup cherry tomatoes"], steps: ["Rinse and eat whole."] },
  { id: 75, name: "Broccoli Florets", cat: "Snacks", tags: ["Vegetarian", "Vegetable"], prep: 3, cook: 0, servings: 1, cal: 31, protein: 3, carbs: 6, fat: 0, ingredients: ["1 cup raw broccoli florets"], steps: ["Cut into florets, eat raw or pair with a light dip."] },
  { id: 76, name: "Cauliflower", cat: "Snacks", tags: ["Vegetarian", "Vegetable"], prep: 3, cook: 0, servings: 1, cal: 25, protein: 2, carbs: 5, fat: 0, ingredients: ["1 cup raw cauliflower florets"], steps: ["Cut into florets and eat raw."] },
  { id: 77, name: "Snap Peas", cat: "Snacks", tags: ["Vegetarian", "Vegetable"], prep: 1, cook: 0, servings: 1, cal: 41, protein: 3, carbs: 7, fat: 0, ingredients: ["1 cup snap peas"], steps: ["Rinse and eat whole."] },

  /* ---------- Snacks: Crunchy (added) ---------- */
  { id: 78, name: "Mixed Nuts", cat: "Snacks", tags: ["Vegetarian"], prep: 1, cook: 0, servings: 1, cal: 180, protein: 6, carbs: 6, fat: 16, ingredients: ["Small handful (~30g) mixed nuts"], steps: ["Portion into a small bowl and eat."] },
  { id: 79, name: "Almonds", cat: "Snacks", tags: ["Vegetarian"], prep: 1, cook: 0, servings: 1, cal: 160, protein: 6, carbs: 6, fat: 14, ingredients: ["23 almonds (~1oz)"], steps: ["Portion and eat."] },
  { id: 80, name: "Walnuts", cat: "Snacks", tags: ["Vegetarian"], prep: 1, cook: 0, servings: 1, cal: 185, protein: 4, carbs: 4, fat: 18, ingredients: ["14 walnut halves"], steps: ["Portion and eat."] },
  { id: 81, name: "Pistachios", cat: "Snacks", tags: ["Vegetarian"], prep: 1, cook: 0, servings: 1, cal: 160, protein: 6, carbs: 8, fat: 13, ingredients: ["49 pistachios (~1oz)"], steps: ["Shell and eat."] },
  { id: 82, name: "Pumpkin Seeds", cat: "Snacks", tags: ["Vegetarian"], prep: 1, cook: 0, servings: 1, cal: 150, protein: 7, carbs: 5, fat: 13, ingredients: ["1 oz pumpkin seeds"], steps: ["Portion and eat."] },
  { id: 83, name: "Sunflower Seeds", cat: "Snacks", tags: ["Vegetarian"], prep: 1, cook: 0, servings: 1, cal: 165, protein: 6, carbs: 7, fat: 14, ingredients: ["1 oz sunflower seeds"], steps: ["Portion and eat."] },
  { id: 84, name: "Rice Cakes", cat: "Snacks", tags: ["Vegetarian"], prep: 1, cook: 0, servings: 1, cal: 70, protein: 1, carbs: 15, fat: 0.5, ingredients: ["2 rice cakes"], steps: ["Eat plain, or top with peanut butter or avocado."] },
  { id: 85, name: "Air-Popped Popcorn", cat: "Snacks", tags: ["Vegetarian"], prep: 3, cook: 3, servings: 1, cal: 90, protein: 3, carbs: 18, fat: 1, ingredients: ["3 cups popcorn kernels, air-popped"], steps: ["Air-pop the kernels (popcorn maker or microwave popper).", "Season lightly if desired and eat."] },

  /* ---------- Drinks (added) ---------- */
  { id: 86, name: "Lemon Water", cat: "Drinks", tags: ["Drinks", "Vegetarian"], prep: 2, cook: 0, servings: 1, cal: 5, protein: 0, carbs: 1, fat: 0, ingredients: ["1 glass water", "Juice of 1/2 lemon"], steps: ["Squeeze lemon juice into water and stir."] },
  { id: 87, name: "Sparkling Water (unsweetened)", cat: "Drinks", tags: ["Drinks", "Vegetarian"], prep: 1, cook: 0, servings: 1, cal: 0, protein: 0, carbs: 0, fat: 0, ingredients: ["1 can/bottle sparkling water"], steps: ["Pour over ice and serve."] },
  { id: 88, name: "Black Coffee", cat: "Drinks", tags: ["Drinks", "Vegetarian"], prep: 3, cook: 0, servings: 1, cal: 2, protein: 0, carbs: 0, fat: 0, ingredients: ["1 cup brewed coffee"], steps: ["Brew and drink black."] },
  { id: 89, name: "Green Tea", cat: "Drinks", tags: ["Drinks", "Vegetarian"], prep: 4, cook: 0, servings: 1, cal: 2, protein: 0, carbs: 0, fat: 0, ingredients: ["1 green tea bag", "1 cup hot water"], steps: ["Steep tea bag in hot water for 2-3 min.", "Remove bag and drink."] },
  { id: 90, name: "Herbal Tea", cat: "Drinks", tags: ["Drinks", "Vegetarian"], prep: 4, cook: 0, servings: 1, cal: 2, protein: 0, carbs: 0, fat: 0, ingredients: ["1 herbal tea bag", "1 cup hot water"], steps: ["Steep for 3-5 min and drink."] },
  { id: 91, name: "Low-Fat Milk", cat: "Drinks", tags: ["Drinks", "Vegetarian"], prep: 1, cook: 0, servings: 1, cal: 100, protein: 8, carbs: 12, fat: 2.5, ingredients: ["1 cup low-fat milk"], steps: ["Pour and drink chilled."] },
  { id: 92, name: "Unsweetened Almond Milk", cat: "Drinks", tags: ["Drinks", "Vegetarian"], prep: 1, cook: 0, servings: 1, cal: 30, protein: 1, carbs: 1, fat: 2.5, ingredients: ["1 cup unsweetened almond milk"], steps: ["Pour and drink chilled."] },
  { id: 93, name: "Coconut Water", cat: "Drinks", tags: ["Drinks", "Vegetarian", "Pre-workout"], prep: 1, cook: 0, servings: 1, cal: 45, protein: 2, carbs: 9, fat: 0, ingredients: ["1 cup coconut water"], steps: ["Best chilled after an intense workout for electrolyte replenishment."] },
];

const QUOTES = [
  "Consistency beats intensity. Show up today.",
  "Progressive overload is patient — so are you.",
  "The best rep is the one done with good form.",
  "Small daily wins compound into big transformations.",
  "Recovery is training too. Respect the rest days.",
];

const dayKey = (offset = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toLocaleDateString("en-US", { weekday: "short" });
};

const genHistory = (base, variance, days = 14) =>
  Array.from({ length: days }, (_, i) => ({
    day: dayKey(-(days - 1 - i)),
    value: Math.round(base + (Math.random() - 0.5) * variance),
  }));

/* ============================================================
   SMALL UI PRIMITIVES
   ============================================================ */
function Ring({ pct, size = 84, stroke = 9, color, track, children }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - Math.min(Math.max(pct, 0), 1) * c;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke={track} strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke} fill="none"
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {children}
      </div>
    </div>
  );
}

function Card({ children, style, t, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 18,
        padding: 16, ...style,
      }}
    >
      {children}
    </div>
  );
}

function Pill({ children, color, bg }) {
  return (
    <span style={{ fontSize: 11, fontWeight: 600, color, background: bg, padding: "3px 9px", borderRadius: 999, letterSpacing: 0.2 }}>
      {children}
    </span>
  );
}

function ProgressBar({ pct, color, track }) {
  return (
    <div style={{ height: 8, borderRadius: 999, background: track, overflow: "hidden" }}>
      <div style={{ width: `${Math.min(Math.max(pct, 0), 100)}%`, height: "100%", background: color, transition: "width 0.4s ease" }} />
    </div>
  );
}

/* ============================================================
   MAIN APP
   ============================================================ */
export default function FitCoachApp() {
  const [isDark, setIsDark] = useState(true);
  const t = isDark ? TOKENS : LIGHT_TOKENS;
  const [tab, setTab] = useState("dashboard");

  const [targets, setTargets] = useState({ calories: 2550, protein: 115, carbs: 350, fat: 70, water: 8 });
  const [waterCups, setWaterCups] = useState(3);
  const [meals, setMeals] = useState([
    { name: "Egg Bhurji + Roti", cal: 550, protein: 35, carbs: 45, fat: 22, time: "8:15 AM" },
    { name: "Rice, Sambar & Grilled Chicken", cal: 700, protein: 40, carbs: 80, fat: 18, time: "1:00 PM" },
  ]);
  const [workoutLogHistory, setWorkoutLogHistory] = useState(() =>
    ["Push", "Pull", "Legs", "Push", "Pull"].map((cat, i) => ({
      day: dayKey(-(5 - i)), category: cat, volume: 3200 + Math.round(Math.random() * 900), duration: 62 + Math.round(Math.random() * 10),
    }))
  );
  const [streak, setStreak] = useState(6);
  const [weightHistory] = useState(genHistory(56, 0.6));
  const quote = useMemo(() => QUOTES[new Date().getDate() % QUOTES.length], []);

  const consumed = meals.reduce((a, m) => ({ cal: a.cal + m.cal, protein: a.protein + m.protein, carbs: a.carbs + m.carbs, fat: a.fat + m.fat }), { cal: 0, protein: 0, carbs: 0, fat: 0 });
  const remaining = Math.max(targets.calories - consumed.cal, 0);

  const todaysWorkoutDone = workoutLogHistory.some(w => w.day === dayKey(0));

  const NAV = [
    { id: "dashboard", label: "Home", icon: LayoutDashboard },
    { id: "workout", label: "Workout", icon: Dumbbell },
    { id: "nutrition", label: "Nutrition", icon: UtensilsCrossed },
    { id: "analytics", label: "Progress", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings2 },
  ];

  return (
    <div style={{
      fontFamily: "Inter, -apple-system, sans-serif", background: t.bg, color: t.ink,
      minHeight: 640, maxWidth: 430, margin: "0 auto", borderRadius: 28, overflow: "hidden",
      border: `1px solid ${t.border}`, position: "relative", boxShadow: "0 30px 60px -20px rgba(0,0,0,0.35)",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');
        * { box-sizing: border-box; }
        .mono { font-family: 'IBM Plex Mono', monospace; }
        .display { font-family: 'Sora', sans-serif; }
        ::-webkit-scrollbar { width: 0px; height: 0px; }
        .scrollx { overflow-x: auto; scrollbar-width: none; }
        button { font-family: inherit; cursor: pointer; }
        input, select { font-family: inherit; }
      `}</style>

      <div style={{ height: 640, overflowY: "auto", paddingBottom: 84 }}>
        {tab === "dashboard" && (
          <Dashboard t={t} isDark={isDark} setIsDark={setIsDark} waterCups={waterCups} setWaterCups={setWaterCups}
            targets={targets} consumed={consumed} remaining={remaining} streak={streak} quote={quote}
            todaysWorkoutDone={todaysWorkoutDone} setTab={setTab} />
        )}
        {tab === "workout" && (
          <WorkoutTab t={t} onLogWorkout={(entry) => { setWorkoutLogHistory(h => [...h, entry]); setStreak(s => s + 1); }} />
        )}
        {tab === "nutrition" && (
          <NutritionTab t={t} meals={meals} setMeals={setMeals} targets={targets} consumed={consumed} remaining={remaining} />
        )}
        {tab === "analytics" && (
          <AnalyticsTab t={t} weightHistory={weightHistory} workoutLogHistory={workoutLogHistory} meals={meals} targets={targets} />
        )}
        {tab === "settings" && (
          <SettingsTab t={t} isDark={isDark} setIsDark={setIsDark} targets={targets} setTargets={setTargets} />
        )}
      </div>

      {/* Bottom Nav */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, background: t.bgElevated,
        borderTop: `1px solid ${t.border}`, display: "flex", padding: "10px 6px 14px",
      }}>
        {NAV.map(n => {
          const Icon = n.icon;
          const active = tab === n.id;
          return (
            <button key={n.id} onClick={() => setTab(n.id)} style={{
              flex: 1, background: "none", border: "none", display: "flex", flexDirection: "column",
              alignItems: "center", gap: 4, padding: "6px 2px", borderRadius: 12,
              color: active ? t.turmeric : t.inkFaint,
            }}>
              <Icon size={20} strokeWidth={active ? 2.4 : 1.8} />
              <span style={{ fontSize: 10, fontWeight: active ? 700 : 500 }}>{n.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================
   DASHBOARD
   ============================================================ */
function Dashboard({ t, isDark, setIsDark, waterCups, setWaterCups, targets, consumed, remaining, streak, quote, todaysWorkoutDone, setTab }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const calPct = Math.min(consumed.cal / targets.calories, 1);
  const proteinPct = Math.min(consumed.protein / targets.protein, 1);
  const waterPct = Math.min(waterCups / targets.water, 1);

  return (
    <div style={{ padding: "22px 18px 8px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div className="display" style={{ fontSize: 22, fontWeight: 800 }}>{greeting}</div>
          <div style={{ fontSize: 13, color: t.inkDim, marginTop: 2 }}>{today}</div>
        </div>
        <button onClick={() => setIsDark(d => !d)} style={{
          background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 12, padding: 9,
        }}>
          {isDark ? <Sun size={16} color={t.turmeric} /> : <MoonStar size={16} color={t.violet} />}
        </button>
      </div>

      {/* Streak */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 14 }}>
        <Flame size={15} color={t.turmeric} fill={t.turmeric} />
        <span style={{ fontSize: 13, fontWeight: 600 }}>{streak}-day streak</span>
        <span style={{ fontSize: 12, color: t.inkFaint }}>· keep it going</span>
      </div>

      {/* Ring cluster */}
      <Card t={t} style={{ marginTop: 16, display: "flex", justifyContent: "space-around", alignItems: "center", padding: "22px 10px" }}>
        <Ring pct={calPct} color={t.turmeric} track={t.turmericDim} size={92}>
          <div style={{ textAlign: "center" }}>
            <div className="mono" style={{ fontSize: 15, fontWeight: 700 }}>{remaining}</div>
            <div style={{ fontSize: 9, color: t.inkFaint }}>kcal left</div>
          </div>
        </Ring>
        <Ring pct={proteinPct} color={t.teal} track={t.tealDim} size={92}>
          <div style={{ textAlign: "center" }}>
            <div className="mono" style={{ fontSize: 15, fontWeight: 700 }}>{consumed.protein}g</div>
            <div style={{ fontSize: 9, color: t.inkFaint }}>protein</div>
          </div>
        </Ring>
        <Ring pct={waterPct} color={t.violet} track={isDark ? "#2A2540" : "#E7E3F7"} size={92}>
          <div style={{ textAlign: "center" }}>
            <div className="mono" style={{ fontSize: 15, fontWeight: 700 }}>{waterCups}/{targets.water}</div>
            <div style={{ fontSize: 9, color: t.inkFaint }}>cups</div>
          </div>
        </Ring>
      </Card>

      {/* Quick stat row */}
      <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
        <Card t={t} style={{ flex: 1 }}>
          <Footprints size={16} color={t.teal} />
          <div className="mono" style={{ fontSize: 17, fontWeight: 700, marginTop: 6 }}>7,240</div>
          <div style={{ fontSize: 11, color: t.inkFaint }}>steps today</div>
        </Card>
        <Card t={t} style={{ flex: 1 }}>
          <Moon size={16} color={t.violet} />
          <div className="mono" style={{ fontSize: 17, fontWeight: 700, marginTop: 6 }}>7.2h</div>
          <div style={{ fontSize: 11, color: t.inkFaint }}>sleep last night</div>
        </Card>
      </div>

      {/* Water quick add */}
      <Card t={t} style={{ marginTop: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Droplet size={16} color={t.violet} />
            <span style={{ fontSize: 13, fontWeight: 600 }}>Water intake</span>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => setWaterCups(c => Math.max(c - 1, 0))} style={{ width: 26, height: 26, borderRadius: 8, border: `1px solid ${t.border}`, background: t.bgElevated, color: t.ink }}>–</button>
            <button onClick={() => setWaterCups(c => c + 1)} style={{ width: 26, height: 26, borderRadius: 8, border: `1px solid ${t.border}`, background: t.bgElevated, color: t.ink }}>+</button>
          </div>
        </div>
      </Card>

      {/* Today's workout */}
      <Card t={t} onClick={() => setTab("workout")} style={{ marginTop: 12, cursor: "pointer" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Dumbbell size={16} color={t.turmeric} />
            <span style={{ fontSize: 13, fontWeight: 600 }}>Today's session</span>
          </div>
          <ChevronRight size={16} color={t.inkFaint} />
        </div>
        {todaysWorkoutDone ? (
          <Pill color={t.teal} bg={t.tealDim}>Completed</Pill>
        ) : (
          <div style={{ fontSize: 12, color: t.inkDim, marginTop: 6 }}>Not logged yet — tap to start.</div>
        )}
      </Card>

      {/* AI coach note */}
      <Card t={t} style={{ marginTop: 12, background: isDark ? t.turmericDim : t.turmericDim }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: t.turmeric, letterSpacing: 0.4 }}>COACH NOTE</div>
        <div style={{ fontSize: 13, marginTop: 4, lineHeight: 1.5 }}>
          {targets.protein - consumed.protein > 15
            ? `You're ${targets.protein - consumed.protein}g short on protein — a Sprouts & Moong Salad or a Protein Smoothie would close most of that gap.`
            : "Protein is on track for today. Nice work — stay consistent with the evening stretch routine."}
        </div>
      </Card>

      <div style={{ textAlign: "center", fontSize: 12, color: t.inkFaint, fontStyle: "italic", margin: "18px 0 8px" }}>
        "{quote}"
      </div>
    </div>
  );
}

/* ============================================================
   WORKOUT TAB
   ============================================================ */
function WorkoutTab({ t, onLogWorkout }) {
  const [browseMode, setBrowseMode] = useState(null); // null | "schedule" | "category"
  const [category, setCategory] = useState(null);
  const [session, setSession] = useState(null); // {exercises: [{name, sets:[{weight,reps,done}]}], elapsed}
  const [elapsed, setElapsed] = useState(0);
  const [resting, setResting] = useState(0);
  const intervalRef = useRef(null);
  const restRef = useRef(null);

  useEffect(() => {
    if (session) {
      intervalRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
      return () => clearInterval(intervalRef.current);
    }
  }, [session]);

  useEffect(() => {
    if (resting > 0) {
      restRef.current = setInterval(() => setResting(r => (r <= 1 ? 0 : r - 1)), 1000);
      return () => clearInterval(restRef.current);
    }
  }, [resting]);

  const startSession = (cat) => {
    const exercises = EXERCISE_DB[cat].map(ex => ({
      name: ex.name, equip: ex.equip, target: ex.reps,
      sets: Array.from({ length: ex.sets }, () => ({ weight: "", reps: "", done: false })),
    }));
    setCategory(cat);
    setSession({ exercises });
    setElapsed(0);
  };

  const toggleSet = (exIdx, setIdx) => {
    setSession(s => {
      const next = structuredClone(s);
      const set = next.exercises[exIdx].sets[setIdx];
      set.done = !set.done;
      if (set.done) setResting(60);
      return next;
    });
  };

  const updateSet = (exIdx, setIdx, field, value) => {
    setSession(s => {
      const next = structuredClone(s);
      next.exercises[exIdx].sets[setIdx][field] = value;
      return next;
    });
  };

  const finishSession = () => {
    const volume = session.exercises.reduce((tot, ex) =>
      tot + ex.sets.reduce((s, st) => s + (Number(st.weight) || 0) * (Number(st.reps) || 0), 0), 0);
    onLogWorkout({ day: dayKey(0), category, volume: volume || 0, duration: Math.round(elapsed / 60) });
    setSession(null);
    setCategory(null);
    setElapsed(0);
  };

  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  if (session) {
    const totalSets = session.exercises.reduce((a, e) => a + e.sets.length, 0);
    const doneSets = session.exercises.reduce((a, e) => a + e.sets.filter(s => s.done).length, 0);
    return (
      <div style={{ padding: "20px 18px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button onClick={() => { setSession(null); setCategory(null); }} style={{ background: "none", border: "none", color: t.inkDim, display: "flex", alignItems: "center", gap: 4 }}>
            <ChevronLeft size={18} /> Exit
          </button>
          <div className="mono" style={{ fontSize: 15, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
            <Timer size={15} color={t.turmeric} /> {fmt(elapsed)}
          </div>
        </div>
        <div className="display" style={{ fontSize: 20, fontWeight: 800, marginTop: 10 }}>{category} Session</div>
        <div style={{ fontSize: 12, color: t.inkFaint, marginTop: 2 }}>{doneSets}/{totalSets} sets complete</div>

        {resting > 0 && (
          <div style={{ marginTop: 12, background: t.coralDim, border: `1px solid ${t.coral}40`, borderRadius: 14, padding: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: t.coral }}>Rest — {resting}s</div>
            <button onClick={() => setResting(0)} style={{ background: "none", border: `1px solid ${t.coral}`, color: t.coral, borderRadius: 8, padding: "4px 10px", fontSize: 11, fontWeight: 600 }}>Skip</button>
          </div>
        )}

        <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 12 }}>
          {session.exercises.map((ex, exIdx) => (
            <Card key={ex.name} t={t}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{ex.name}</div>
              <div style={{ fontSize: 11, color: t.inkFaint, marginTop: 2 }}>{ex.equip} · target {ex.target}</div>
              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                {ex.sets.map((set, setIdx) => (
                  <div key={setIdx} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 16, fontSize: 11, color: t.inkFaint }}>{setIdx + 1}</span>
                    <input placeholder="kg" value={set.weight} onChange={e => updateSet(exIdx, setIdx, "weight", e.target.value)}
                      style={{ width: 54, background: t.bgElevated, border: `1px solid ${t.border}`, borderRadius: 8, padding: "6px 8px", color: t.ink, fontSize: 12 }} />
                    <input placeholder="reps" value={set.reps} onChange={e => updateSet(exIdx, setIdx, "reps", e.target.value)}
                      style={{ width: 54, background: t.bgElevated, border: `1px solid ${t.border}`, borderRadius: 8, padding: "6px 8px", color: t.ink, fontSize: 12 }} />
                    <button onClick={() => toggleSet(exIdx, setIdx)} style={{
                      marginLeft: "auto", width: 28, height: 28, borderRadius: 8,
                      border: `1px solid ${set.done ? t.teal : t.border}`, background: set.done ? t.teal : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Check size={14} color={set.done ? "#08150F" : t.inkFaint} />
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        <button onClick={finishSession} style={{
          width: "100%", marginTop: 16, background: t.turmeric, border: "none", borderRadius: 14,
          padding: "13px 0", fontSize: 14, fontWeight: 700, color: "#241705",
        }}>
          Finish Workout
        </button>
      </div>
    );
  }

  if (browseMode === "schedule") {
    return (
      <div style={{ padding: "20px 18px" }}>
        <button onClick={() => setBrowseMode(null)} style={{ background: "none", border: "none", color: t.inkDim, display: "flex", alignItems: "center", gap: 4, marginBottom: 10 }}>
          <ChevronLeft size={18} /> Back
        </button>
        <div className="display" style={{ fontSize: 20, fontWeight: 800 }}>Weekly Schedule</div>
        <div style={{ fontSize: 13, color: t.inkDim, marginTop: 2 }}>Each day of the week has a recommended session — tap today's entry to begin.</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
          {WEEKLY_SCHEDULE.map(({ day, session: sessionType, description }) => {
            const Icon = CATEGORY_ICON[sessionType];
            const isToday = day === TODAY_NAME;
            return (
              <Card key={day} t={t} onClick={() => startSession(sessionType)} style={{
                cursor: "pointer", display: "flex", alignItems: "center", gap: 12,
                border: `1px solid ${isToday ? t.turmeric : t.border}`,
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12, background: t.turmericDim,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <Icon size={18} color={t.turmeric} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 700 }}>{day}</span>
                    {isToday && <Pill color={t.teal} bg={t.tealDim}>Today</Pill>}
                  </div>
                  <div style={{ fontSize: 12, color: t.inkDim, marginTop: 1 }}>{sessionType} — {description}</div>
                </div>
                <ChevronRight size={16} color={t.inkFaint} />
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  if (browseMode === "category") {
    return (
      <div style={{ padding: "20px 18px" }}>
        <button onClick={() => setBrowseMode(null)} style={{ background: "none", border: "none", color: t.inkDim, display: "flex", alignItems: "center", gap: 4, marginBottom: 10 }}>
          <ChevronLeft size={18} /> Back
        </button>
        <div className="display" style={{ fontSize: 20, fontWeight: 800 }}>Training Categories</div>
        <div style={{ fontSize: 13, color: t.inkDim, marginTop: 2 }}>Choose the muscle group or training style you'd like to work on right now.</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 16 }}>
          {Object.keys(EXERCISE_DB).map(cat => {
            const Icon = CATEGORY_ICON[cat];
            return (
              <Card key={cat} t={t} onClick={() => startSession(cat)} style={{ cursor: "pointer" }}>
                <Icon size={18} color={t.turmeric} />
                <div style={{ fontSize: 13, fontWeight: 700, marginTop: 10 }}>{cat}</div>
                <div style={{ fontSize: 11, color: t.inkFaint, marginTop: 2 }}>{EXERCISE_DB[cat].length} exercises</div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px 18px" }}>
      <div className="display" style={{ fontSize: 20, fontWeight: 800 }}>Workout</div>
      <div style={{ fontSize: 13, color: t.inkDim, marginTop: 2 }}>Choose how you'd like to find today's session.</div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 18 }}>
        <Card t={t} onClick={() => setBrowseMode("schedule")} style={{ cursor: "pointer" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: t.turmericDim, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <CalendarDays size={20} color={t.turmeric} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700 }}>Follow the Weekly Schedule</div>
              <div style={{ fontSize: 12, color: t.inkDim, marginTop: 3, lineHeight: 1.5 }}>
                See the recommended session for each day of the week, from Monday through Sunday, and start today's session in one tap.
              </div>
            </div>
            <ChevronRight size={16} color={t.inkFaint} style={{ marginTop: 4, flexShrink: 0 }} />
          </div>
        </Card>

        <Card t={t} onClick={() => setBrowseMode("category")} style={{ cursor: "pointer" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: t.tealDim, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <LayoutGrid size={20} color={t.teal} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700 }}>Browse by Category</div>
              <div style={{ fontSize: 12, color: t.inkDim, marginTop: 3, lineHeight: 1.5 }}>
                Pick a specific muscle group or training style — such as chest and shoulders, back, legs, or mobility — and start a session on your own terms.
              </div>
            </div>
            <ChevronRight size={16} color={t.inkFaint} style={{ marginTop: 4, flexShrink: 0 }} />
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ============================================================
   NUTRITION TAB
   ============================================================ */
function NutritionTab({ t, meals, setMeals, targets, consumed, remaining }) {
  const [sub, setSub] = useState("track");
  const [filter, setFilter] = useState("All");
  const [expanded, setExpanded] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", cal: "", protein: "", carbs: "", fat: "" });

  const tags = ["All", "Breakfast", "Lunch", "Dinner", "Snacks", "Drinks", "Pre-workout", "High Protein", "Vegetarian", "Non-Vegetarian"];
  const filtered = filter === "All" ? RECIPES : RECIPES.filter(r => r.cat === filter || r.tags.includes(filter));

  const addMeal = () => {
    if (!form.name || !form.cal) return;
    setMeals(m => [...m, {
      name: form.name, cal: Number(form.cal) || 0, protein: Number(form.protein) || 0,
      carbs: Number(form.carbs) || 0, fat: Number(form.fat) || 0,
      time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
    }]);
    setForm({ name: "", cal: "", protein: "", carbs: "", fat: "" });
    setShowAdd(false);
  };

  const quickAdd = (recipe) => {
    setMeals(m => [...m, {
      name: recipe.name, cal: recipe.cal, protein: recipe.protein, carbs: recipe.carbs, fat: recipe.fat,
      time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
    }]);
  };

  return (
    <div style={{ padding: "20px 18px" }}>
      <div className="display" style={{ fontSize: 20, fontWeight: 800 }}>Nutrition</div>
      <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
        {[{ id: "track", label: "Track Food", icon: ClipboardList }, { id: "prepare", label: "Prepare Food", icon: ChefHat }].map(s => {
          const Icon = s.icon;
          const active = sub === s.id;
          return (
            <button key={s.id} onClick={() => setSub(s.id)} style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              padding: "9px 0", borderRadius: 12, border: `1px solid ${active ? t.turmeric : t.border}`,
              background: active ? t.turmericDim : "transparent", color: active ? t.turmeric : t.inkDim, fontSize: 12, fontWeight: 700,
            }}>
              <Icon size={14} /> {s.label}
            </button>
          );
        })}
      </div>

      {sub === "track" && (
        <div style={{ marginTop: 16 }}>
          <Card t={t}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 11, color: t.inkFaint }}>Consumed / Target</div>
                <div className="mono" style={{ fontSize: 18, fontWeight: 700 }}>{consumed.cal} / {targets.calories}</div>
              </div>
              <Pill color={t.turmeric} bg={t.turmericDim}>{remaining} kcal left</Pill>
            </div>
            <div style={{ marginTop: 10 }}><ProgressBar pct={(consumed.cal / targets.calories) * 100} color={t.turmeric} track={t.turmericDim} /></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 14 }}>
              {[
                { label: "Protein", val: consumed.protein, target: targets.protein, color: t.teal },
                { label: "Carbs", val: consumed.carbs, target: targets.carbs, color: t.violet },
                { label: "Fat", val: consumed.fat, target: targets.fat, color: t.coral },
              ].map(m => (
                <div key={m.label}>
                  <div style={{ fontSize: 10, color: t.inkFaint }}>{m.label}</div>
                  <div className="mono" style={{ fontSize: 13, fontWeight: 700 }}>{m.val}g <span style={{ color: t.inkFaint, fontWeight: 500 }}>/{m.target}g</span></div>
                  <div style={{ marginTop: 4 }}><ProgressBar pct={(m.val / m.target) * 100} color={m.color} track={t.border} /></div>
                </div>
              ))}
            </div>
          </Card>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 18 }}>
            <div style={{ fontSize: 13, fontWeight: 700 }}>Today's meals</div>
            <button onClick={() => setShowAdd(v => !v)} style={{
              display: "flex", alignItems: "center", gap: 4, background: t.turmeric, border: "none",
              borderRadius: 10, padding: "6px 10px", fontSize: 11, fontWeight: 700, color: "#241705",
            }}><Plus size={13} /> Add meal</button>
          </div>

          {showAdd && (
            <Card t={t} style={{ marginTop: 10 }}>
              <input placeholder="Meal name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                style={{ width: "100%", background: t.bgElevated, border: `1px solid ${t.border}`, borderRadius: 8, padding: "8px 10px", color: t.ink, fontSize: 13, marginBottom: 8 }} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 6 }}>
                {["cal", "protein", "carbs", "fat"].map(f => (
                  <input key={f} placeholder={f} value={form[f]} onChange={e => setForm(fm => ({ ...fm, [f]: e.target.value }))}
                    style={{ background: t.bgElevated, border: `1px solid ${t.border}`, borderRadius: 8, padding: "8px 6px", color: t.ink, fontSize: 12 }} />
                ))}
              </div>
              <button onClick={addMeal} style={{ width: "100%", marginTop: 10, background: t.teal, border: "none", borderRadius: 10, padding: "9px 0", fontSize: 12, fontWeight: 700, color: "#06201C" }}>Save meal</button>
            </Card>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
            {meals.map((m, i) => (
              <Card key={i} t={t} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 12 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{m.name}</div>
                  <div style={{ fontSize: 11, color: t.inkFaint }}>{m.time} · P{m.protein} C{m.carbs} F{m.fat}</div>
                </div>
                <div className="mono" style={{ fontSize: 13, fontWeight: 700, color: t.turmeric }}>{m.cal} kcal</div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {sub === "prepare" && (
        <div style={{ marginTop: 16 }}>
          <div className="scrollx" style={{ display: "flex", gap: 6, paddingBottom: 4 }}>
            {tags.map(tag => (
              <button key={tag} onClick={() => setFilter(tag)} style={{
                whiteSpace: "nowrap", padding: "6px 12px", borderRadius: 999, fontSize: 11, fontWeight: 600,
                border: `1px solid ${filter === tag ? t.turmeric : t.border}`,
                background: filter === tag ? t.turmericDim : "transparent", color: filter === tag ? t.turmeric : t.inkDim,
              }}>{tag}</button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
            {filtered.map(r => (
              <Card key={r.id} t={t}>
                <div onClick={() => setExpanded(expanded === r.id ? null : r.id)} style={{ cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{r.name}</div>
                    <div className="mono" style={{ fontSize: 10.5, color: t.inkFaint, marginTop: 3 }}>
                      {r.cal} kcal · P{r.protein} C{r.carbs ?? 0} F{r.fat ?? 0}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                    <span style={{
                      display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600,
                      color: t.turmeric, background: t.turmericDim, borderRadius: 999, padding: "4px 9px", whiteSpace: "nowrap",
                    }}>
                      <Clock size={11} /> {r.prep + r.cook} min
                    </span>
                    <ChevronRight size={16} color={t.inkFaint} style={{ transform: expanded === r.id ? "rotate(90deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }} />
                  </div>
                </div>
                {r.note && (
                  <div style={{ fontSize: 10.5, color: t.inkFaint, fontStyle: "italic", marginTop: 4 }}>{r.note}</div>
                )}
                {expanded === r.id && (
                  <div style={{ marginTop: 12, borderTop: `1px solid ${t.border}`, paddingTop: 12 }}>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                      {r.tags.map(tg => <Pill key={tg} color={t.teal} bg={t.tealDim}>{tg}</Pill>)}
                    </div>
                    <div style={{ fontSize: 11, color: t.inkFaint, marginBottom: 4 }}>Prep {r.prep}m · Cook {r.cook}m · Serves {r.servings}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, marginTop: 8 }}>Ingredients</div>
                    <ul style={{ margin: "4px 0", paddingLeft: 18, fontSize: 12, color: t.inkDim, lineHeight: 1.6 }}>
                      {r.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
                    </ul>
                    <div style={{ fontSize: 12, fontWeight: 700, marginTop: 8 }}>Steps</div>
                    <ol style={{ margin: "4px 0", paddingLeft: 18, fontSize: 12, color: t.inkDim, lineHeight: 1.6 }}>
                      {r.steps.map((s, i) => <li key={i}>{s}</li>)}
                    </ol>
                    <button onClick={() => quickAdd(r)} style={{
                      marginTop: 10, width: "100%", background: t.turmeric, border: "none", borderRadius: 10,
                      padding: "9px 0", fontSize: 12, fontWeight: 700, color: "#241705",
                    }}>Log this meal today</button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   ANALYTICS TAB
   ============================================================ */
function AnalyticsTab({ t, weightHistory, workoutLogHistory, meals, targets }) {
  const consumedCal = meals.reduce((a, m) => a + m.cal, 0);
  const calHistory = useMemo(() => {
    const base = genHistory(targets.calories - 150, 300, 6);
    return [...base, { day: dayKey(0), value: consumedCal }];
  }, [consumedCal]);

  return (
    <div style={{ padding: "20px 18px" }}>
      <div className="display" style={{ fontSize: 20, fontWeight: 800 }}>Progress</div>
      <div style={{ fontSize: 13, color: t.inkDim, marginTop: 2 }}>Trends over the last 2 weeks</div>

      <Card t={t} style={{ marginTop: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <TrendingUp size={14} color={t.turmeric} />
          <div style={{ fontSize: 12, fontWeight: 700 }}>Body weight (kg)</div>
        </div>
        <div style={{ height: 130, marginTop: 6 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weightHistory}>
              <CartesianGrid stroke={t.border} strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 9, fill: t.inkFaint }} axisLine={{ stroke: t.border }} tickLine={false} />
              <YAxis hide domain={["dataMin - 1", "dataMax + 1"]} />
              <Tooltip contentStyle={{ background: t.bgElevated, border: `1px solid ${t.border}`, borderRadius: 8, fontSize: 11 }} />
              <Line type="monotone" dataKey="value" stroke={t.turmeric} strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card t={t} style={{ marginTop: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 700 }}>Daily calories vs target</div>
        <div style={{ height: 130, marginTop: 6 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={calHistory}>
              <CartesianGrid stroke={t.border} strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 9, fill: t.inkFaint }} axisLine={{ stroke: t.border }} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ background: t.bgElevated, border: `1px solid ${t.border}`, borderRadius: 8, fontSize: 11 }} />
              <Bar dataKey="value" fill={t.teal} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card t={t} style={{ marginTop: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 700 }}>Workout volume by session</div>
        <div style={{ height: 130, marginTop: 6 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={workoutLogHistory}>
              <CartesianGrid stroke={t.border} strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="category" tick={{ fontSize: 9, fill: t.inkFaint }} axisLine={{ stroke: t.border }} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ background: t.bgElevated, border: `1px solid ${t.border}`, borderRadius: 8, fontSize: 11 }} />
              <Bar dataKey="volume" fill={t.violet} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

/* ============================================================
   SETTINGS TAB
   ============================================================ */
function SettingsTab({ t, isDark, setIsDark, targets, setTargets }) {
  const [local, setLocal] = useState(targets);
  return (
    <div style={{ padding: "20px 18px" }}>
      <div className="display" style={{ fontSize: 20, fontWeight: 800 }}>Settings</div>

      <Card t={t} style={{ marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 13, fontWeight: 600 }}>Appearance</span>
        <button onClick={() => setIsDark(d => !d)} style={{
          background: t.bgElevated, border: `1px solid ${t.border}`, borderRadius: 10, padding: "6px 12px",
          fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 6,
        }}>
          {isDark ? <><Sun size={13} /> Light mode</> : <><MoonStar size={13} /> Dark mode</>}
        </button>
      </Card>

      <Card t={t} style={{ marginTop: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Daily targets</div>
        {[
          { key: "calories", label: "Calories (kcal)" },
          { key: "protein", label: "Protein (g)" },
          { key: "carbs", label: "Carbs (g)" },
          { key: "fat", label: "Fat (g)" },
          { key: "water", label: "Water (cups)" },
        ].map(f => (
          <div key={f.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: t.inkDim }}>{f.label}</span>
            <input type="number" value={local[f.key]} onChange={e => setLocal(l => ({ ...l, [f.key]: Number(e.target.value) }))}
              style={{ width: 72, background: t.bgElevated, border: `1px solid ${t.border}`, borderRadius: 8, padding: "6px 8px", color: t.ink, fontSize: 12, textAlign: "right" }} />
          </div>
        ))}
        <button onClick={() => setTargets(local)} style={{
          width: "100%", marginTop: 6, background: t.turmeric, border: "none", borderRadius: 10,
          padding: "9px 0", fontSize: 12, fontWeight: 700, color: "#241705",
        }}>Save targets</button>
      </Card>

      <div style={{ marginTop: 16, fontSize: 11, color: t.inkFaint, lineHeight: 1.6, textAlign: "center" }}>
        Prototype build · data resets on refresh (no device storage yet).<br />
        Native version with Apple Health sync requires Xcode on a Mac.
      </div>
    </div>
  );
}
