import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import {
  Flame, Droplet, Dumbbell, Moon, Footprints, ChevronRight, ChevronLeft, Check,
  Plus, Timer, Sun, MoonStar, Settings2, X, Clock, TrendingUp, ChefHat,
  ClipboardList, LayoutDashboard, UtensilsCrossed, BarChart3, Flower2,
  CalendarDays, LayoutGrid, User, LogOut, Trash2, ArrowRight,
  Volume2, VolumeX, RotateCw, Info, Award, History, Zap, ShieldAlert,
  ArrowLeftRight, ChevronDown, Sparkles,
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

/* ============================================================
   MUSCLE INFO — tap-to-learn dictionary
   ============================================================ */
const MUSCLE_INFO = {
  chest: { label: "Chest", anatomicalName: "Pectoralis Major", function: "Pushes the arm across and in front of the body; drives pressing movements." },
  frontDelts: { label: "Front Shoulders", anatomicalName: "Anterior Deltoid", function: "Raises the arm forward and assists all pressing motions." },
  sideDelts: { label: "Side Shoulders", anatomicalName: "Lateral Deltoid", function: "Lifts the arm out to the side; gives shoulders their rounded width." },
  rearDelts: { label: "Rear Shoulders", anatomicalName: "Posterior Deltoid", function: "Pulls the arm backward; supports posture and pulling movements." },
  biceps: { label: "Biceps", anatomicalName: "Biceps Brachii", function: "Bends the elbow and rotates the forearm; assists in most pulling exercises." },
  triceps: { label: "Triceps", anatomicalName: "Triceps Brachii", function: "Straightens the elbow; the primary mover in all pressing/pushing exercises." },
  forearms: { label: "Forearms", anatomicalName: "Forearm Flexors/Extensors", function: "Controls grip strength and wrist stability during lifts." },
  lats: { label: "Lats", anatomicalName: "Latissimus Dorsi", function: "Pulls the arm down and back; the main mover in pulldowns and rows." },
  traps: { label: "Traps", anatomicalName: "Trapezius", function: "Stabilizes and elevates the shoulder blades during pulling and carrying." },
  lowerBack: { label: "Lower Back", anatomicalName: "Erector Spinae", function: "Keeps the spine extended and stable during almost every standing lift." },
  abs: { label: "Abs", anatomicalName: "Rectus Abdominis", function: "Flexes the spine and braces the core to protect the lower back under load." },
  obliques: { label: "Obliques", anatomicalName: "Internal/External Obliques", function: "Rotates and side-bends the trunk; stabilizes against twisting forces." },
  glutes: { label: "Glutes", anatomicalName: "Gluteus Maximus", function: "Extends the hip; the primary driver of squats, presses, and bridges." },
  quads: { label: "Quads", anatomicalName: "Quadriceps Femoris", function: "Straightens the knee; powers pressing and extension movements at the leg." },
  hamstrings: { label: "Hamstrings", anatomicalName: "Biceps Femoris Group", function: "Bends the knee and extends the hip; balances the quads to protect the knee." },
  calves: { label: "Calves", anatomicalName: "Gastrocnemius/Soleus", function: "Points the foot downward; propels every step and stabilizes standing balance." },
  adductors: { label: "Inner Thighs", anatomicalName: "Hip Adductors", function: "Draws the leg inward and stabilizes the pelvis — directly relevant to genitofemoral nerve mobility." },
  hipFlexors: { label: "Hip Flexors", anatomicalName: "Iliopsoas", function: "Lifts the thigh toward the torso; commonly tight from long periods of sitting." },
  piriformis: { label: "Piriformis", anatomicalName: "Piriformis", function: "Rotates the hip outward; can compress nearby nerves when tight." },
};

/* ============================================================
   BODY MAP REGIONS — stylized front/back diagram (original SVG shapes, not a photo)
   ============================================================ */
const FRONT_REGIONS = [
  { key: "frontDelts", shape: "ellipse", cx: 49, cy: 66, rx: 11, ry: 10 },
  { key: "frontDelts", shape: "ellipse", cx: 151, cy: 66, rx: 11, ry: 10 },
  { key: "chest", shape: "rect", x: 70, y: 60, width: 60, height: 32, rx: 8 },
  { key: "biceps", shape: "rect", x: 39, y: 76, width: 18, height: 36, rx: 7 },
  { key: "biceps", shape: "rect", x: 143, y: 76, width: 18, height: 36, rx: 7 },
  { key: "forearms", shape: "rect", x: 37, y: 118, width: 16, height: 48, rx: 7 },
  { key: "forearms", shape: "rect", x: 147, y: 118, width: 16, height: 48, rx: 7 },
  { key: "abs", shape: "rect", x: 78, y: 94, width: 44, height: 44, rx: 8 },
  { key: "obliques", shape: "rect", x: 68, y: 94, width: 9, height: 44, rx: 4 },
  { key: "obliques", shape: "rect", x: 123, y: 94, width: 9, height: 44, rx: 4 },
  { key: "quads", shape: "rect", x: 74, y: 150, width: 24, height: 66, rx: 9 },
  { key: "quads", shape: "rect", x: 102, y: 150, width: 24, height: 66, rx: 9 },
  { key: "adductors", shape: "rect", x: 96, y: 155, width: 8, height: 55, rx: 4 },
  { key: "calves", shape: "rect", x: 76, y: 224, width: 20, height: 58, rx: 8 },
  { key: "calves", shape: "rect", x: 104, y: 224, width: 20, height: 58, rx: 8 },
];

const BACK_REGIONS = [
  { key: "traps", shape: "rect", x: 80, y: 56, width: 40, height: 26, rx: 8 },
  { key: "rearDelts", shape: "ellipse", cx: 49, cy: 66, rx: 11, ry: 10 },
  { key: "rearDelts", shape: "ellipse", cx: 151, cy: 66, rx: 11, ry: 10 },
  { key: "triceps", shape: "rect", x: 39, y: 76, width: 18, height: 36, rx: 7 },
  { key: "triceps", shape: "rect", x: 143, y: 76, width: 18, height: 36, rx: 7 },
  { key: "forearms", shape: "rect", x: 37, y: 118, width: 16, height: 48, rx: 7 },
  { key: "forearms", shape: "rect", x: 147, y: 118, width: 16, height: 48, rx: 7 },
  { key: "lats", shape: "rect", x: 68, y: 85, width: 26, height: 46, rx: 9 },
  { key: "lats", shape: "rect", x: 106, y: 85, width: 26, height: 46, rx: 9 },
  { key: "lowerBack", shape: "rect", x: 82, y: 128, width: 36, height: 22, rx: 7 },
  { key: "glutes", shape: "rect", x: 74, y: 150, width: 24, height: 28, rx: 9 },
  { key: "glutes", shape: "rect", x: 102, y: 150, width: 24, height: 28, rx: 9 },
  { key: "hamstrings", shape: "rect", x: 74, y: 180, width: 24, height: 40, rx: 9 },
  { key: "hamstrings", shape: "rect", x: 102, y: 180, width: 24, height: 40, rx: 9 },
  { key: "calves", shape: "rect", x: 76, y: 224, width: 20, height: 58, rx: 8 },
  { key: "calves", shape: "rect", x: 104, y: 224, width: 20, height: 58, rx: 8 },
];

const BASE_BODY = [
  { shape: "circle", cx: 100, cy: 30, r: 18 },
  { shape: "rect", x: 92, y: 46, width: 16, height: 12, rx: 4 },
  { shape: "rect", x: 68, y: 56, width: 64, height: 84, rx: 18 },
  { shape: "rect", x: 39, y: 58, width: 20, height: 108, rx: 10 },
  { shape: "rect", x: 141, y: 58, width: 20, height: 108, rx: 10 },
  { shape: "rect", x: 70, y: 138, width: 60, height: 14, rx: 6 },
  { shape: "rect", x: 74, y: 150, width: 24, height: 132, rx: 12 },
  { shape: "rect", x: 102, y: 150, width: 24, height: 132, rx: 12 },
];

/* ============================================================
   EXERCISE LIBRARY — full coaching detail for core lifts + all mobility/stretch work.
   Anything not listed here gets a sensible auto-generated profile (see getExerciseDetail).
   ============================================================ */
const EXERCISE_LIBRARY = {
  "Flat Machine/Smith Chest Press": {
    primary: ["chest"], secondary: ["frontDelts", "triceps"], pattern: "press",
    difficulty: "Beginner", estCalories: 90, estMinutes: 8, tempo: "2s up, 1s pause, 3s down",
    benefits: "Builds pressing strength and chest size with a fixed, stable bar path — the safest way to learn pressing mechanics.",
    whyIncluded: "The foundational chest-building movement of your push day; the machine path removes balance demands so you can focus purely on the muscle.",
    tips: ["Keep shoulder blades pinned back and down against the pad.", "Lower the bar to mid-chest level, not your neck.", "Drive through your palms, not your fingers."],
    mistakes: ["Flaring elbows out to 90°, which stresses the shoulder.", "Bouncing the bar off the chest instead of controlling it.", "Arching the lower back off the seat."],
    safety: ["Stop if you feel any pinching in the front of the shoulder.", "Start with a light warm-up set before your working weight."],
    alternatives: ["Pec Deck Fly", "Push-ups"], easier: "Reduce range of motion slightly and use lighter weight until shoulders feel warm.",
    advanced: "Add a 2-second pause at the bottom of each rep.", warmup: "10 arm circles + 1 light warm-up set.", stretchAfter: "Doorway chest stretch, 30s per side.",
  },
  "Incline Dumbbell Press": {
    primary: ["chest"], secondary: ["frontDelts", "triceps"], pattern: "press",
    difficulty: "Intermediate", estCalories: 95, estMinutes: 8, tempo: "2s up, 3s down",
    benefits: "Targets the upper chest more than a flat press and builds shoulder-stabilizing strength through the free-weight range of motion.",
    whyIncluded: "Adds upper-chest development and stabilizer work that a machine press alone won't provide.",
    tips: ["Set the bench to a 30–45° incline — steeper turns it into a shoulder press.", "Keep wrists stacked directly over elbows.", "Press up and slightly inward, not straight up."],
    mistakes: ["Letting the dumbbells drift too wide at the bottom.", "Using a bench angle over 45°, which shifts work to the shoulders."],
    safety: ["Use a spotter or lighter weight when attempting a new max — dumbbells can't be racked mid-rep like a bar."],
    alternatives: ["Flat Machine/Smith Chest Press", "Pec Deck Fly"], easier: "Perform seated on a flat bench with lighter dumbbells first.",
    advanced: "Add a 1-second squeeze at the top of each rep.", warmup: "Band pull-aparts x15, light dumbbell press x10.", stretchAfter: "Doorway chest stretch, 30s per side.",
  },
  "Seated Shoulder Press Machine": {
    primary: ["frontDelts", "sideDelts"], secondary: ["triceps"], pattern: "press",
    difficulty: "Beginner", estCalories: 85, estMinutes: 7, tempo: "2s up, 3s down",
    benefits: "Builds shoulder size and pressing strength overhead with back support to protect the lower spine.",
    whyIncluded: "Direct shoulder work to balance the chest-dominant pressing on push day.",
    tips: ["Keep your back flat against the pad throughout.", "Press directly overhead, not forward.", "Avoid locking the elbows aggressively at the top."],
    mistakes: ["Arching the lower back to move more weight.", "Only pressing halfway up."],
    safety: ["Stop if you feel shoulder impingement pain (a pinch at the top of the movement)."],
    alternatives: ["Cable Lateral Raise"], easier: "Reduce range of motion — press only to eye level while shoulders build strength.",
    advanced: "Add a 2-second hold at the top.", warmup: "Arm circles + band pull-aparts.", stretchAfter: "Cross-body shoulder stretch, 30s per side.",
  },
  "Cable Lateral Raise": {
    primary: ["sideDelts"], secondary: ["traps"], pattern: "raise",
    difficulty: "Beginner", estCalories: 55, estMinutes: 6, tempo: "1s up, 2s down",
    benefits: "Builds shoulder width by isolating the side deltoid — a muscle that's hard to fully engage with pressing alone.",
    whyIncluded: "Direct isolation work for shoulder width and symmetry.",
    tips: ["Lead with your elbow, not your hand.", "Raise only to shoulder height.", "Keep a slight bend in the elbow throughout."],
    mistakes: ["Using momentum/swinging the torso to move the weight.", "Shrugging the shoulder up toward the ear."],
    safety: ["Use light weight — this is an isolation movement, not a strength lift; ego lifting here causes shoulder strain."],
    alternatives: ["Seated Shoulder Press Machine"], easier: "Use very light cable weight and focus purely on the raise path.",
    advanced: "Slow the lowering phase to a full 3 seconds.", warmup: "Arm circles.", stretchAfter: "Cross-body shoulder stretch, 30s per side.",
  },
  "Pec Deck Fly": {
    primary: ["chest"], secondary: ["frontDelts"], pattern: "press",
    difficulty: "Beginner", estCalories: 60, estMinutes: 6, tempo: "2s in, 3s out",
    benefits: "Isolates the chest without triceps assistance, giving it a full stimulus with very low joint stress.",
    whyIncluded: "A safe finisher for the chest after pressing work, at low injury risk.",
    tips: ["Keep a slight bend in the elbows throughout.", "Squeeze the chest at the center, don't just let the pads clap together."],
    mistakes: ["Using too much weight and turning it into a bouncing motion.", "Locking the elbows straight."],
    safety: ["Avoid opening the arms past a comfortable stretch — overstretching the front shoulder can strain it."],
    alternatives: ["Flat Machine/Smith Chest Press"], easier: "Reduce range of motion on the outward stretch.",
    advanced: "Add a 2-second squeeze at the center.", warmup: "None needed after chest pressing work.", stretchAfter: "Doorway chest stretch, 30s per side.",
  },
  "Triceps Rope Pushdown": {
    primary: ["triceps"], secondary: [], pattern: "press",
    difficulty: "Beginner", estCalories: 50, estMinutes: 6, tempo: "1s down, 2s up",
    benefits: "Isolates the triceps through a full range of motion, directly building pressing lockout strength.",
    whyIncluded: "Finishes off the triceps after compound pressing to maximize growth stimulus.",
    tips: ["Keep elbows pinned to your sides — they shouldn't move.", "Split the rope apart at the bottom of the movement.", "Control the return, don't let the weight stack slam."],
    mistakes: ["Letting elbows drift forward, which turns it into a shoulder movement.", "Using body weight/leaning to move the weight."],
    safety: ["Keep wrists neutral — avoid bending them under load."],
    alternatives: ["Flat Machine/Smith Chest Press"], easier: "Use a straight bar attachment instead of rope for more stability.",
    advanced: "Add a 1-second pause at full extension.", warmup: "None needed after pressing work.", stretchAfter: "Overhead triceps stretch, 30s per side.",
  },
  "Lat Pulldown": {
    primary: ["lats"], secondary: ["biceps", "rearDelts"], pattern: "pull",
    difficulty: "Beginner", estCalories: 90, estMinutes: 8, tempo: "1s down, 3s up",
    benefits: "Builds back width and teaches the pulling pattern that carries over to pull-ups.",
    whyIncluded: "The foundational back-width movement of your pull day.",
    tips: ["Lead with your elbows, pulling them down and back.", "Pull the bar to your upper chest, not behind your neck.", "Keep a slight backward lean, not a big swing."],
    mistakes: ["Using momentum by leaning back excessively.", "Pulling behind the neck, which strains the shoulder."],
    safety: ["If you feel neck or shoulder strain, reduce the weight and slow down."],
    alternatives: ["Assisted Pull-up / Machine Row"], easier: "Use a lighter weight and focus purely on feeling the lats engage.",
    advanced: "Add a 1-second squeeze at the bottom.", warmup: "Band pull-aparts x15.", stretchAfter: "Overhead lat stretch, 30s per side.",
  },
  "Seated Cable Row": {
    primary: ["lats"], secondary: ["biceps", "traps", "rearDelts"], pattern: "pull",
    difficulty: "Beginner", estCalories: 90, estMinutes: 8, tempo: "1s in, 3s out",
    benefits: "Builds back thickness and postural strength by targeting the mid-back through a horizontal pulling pattern.",
    whyIncluded: "Balances the vertical pulling of the lat pulldown with horizontal pulling for complete back development.",
    tips: ["Keep your torso upright — don't rock back and forth.", "Pull to your lower ribs, squeezing shoulder blades together.", "Let the weight stack fully extend your arms on the return."],
    mistakes: ["Rounding the lower back at the start position.", "Using body momentum instead of back muscles to move the weight."],
    safety: ["Keep a neutral spine throughout — this is one of the more common places people round their back under load."],
    alternatives: ["Lat Pulldown"], easier: "Reduce weight and focus on a strict, controlled torso position.",
    advanced: "Add a 1-second squeeze at full contraction.", warmup: "Band pull-aparts x15.", stretchAfter: "Overhead lat stretch, 30s per side.",
  },
  "Machine Bicep Curl": {
    primary: ["biceps"], secondary: ["forearms"], pattern: "curl",
    difficulty: "Beginner", estCalories: 45, estMinutes: 6, tempo: "1s up, 2s down",
    benefits: "Isolates the biceps in a fixed, supported path — ideal for building arm size without any swinging or cheating.",
    whyIncluded: "Direct arm isolation to complement the back-dominant pulling work.",
    tips: ["Keep your upper arm pinned against the pad the whole set.", "Squeeze at the top rather than just reaching it.", "Lower under control — don't let the weight drop."],
    mistakes: ["Using shoulder movement to help lift the weight.", "Only doing half-reps."],
    safety: ["Avoid fully hyperextending the elbow at the bottom of each rep."],
    alternatives: ["Hammer Curl"], easier: "Reduce weight and use a full, slow range of motion.",
    advanced: "Add a 2-second hold at the top of every third rep.", warmup: "None needed after pulling work.", stretchAfter: "Overhead triceps/biceps stretch, 30s per side.",
  },
  "Leg Press (controlled depth)": {
    primary: ["quads", "glutes"], secondary: ["hamstrings"], pattern: "squat",
    difficulty: "Beginner", estCalories: 110, estMinutes: 9, tempo: "2s down, 1s pause, 2s up",
    benefits: "Builds full lower-body strength with back support, letting you load the legs heavily with less balance demand than a squat.",
    whyIncluded: "The primary leg-strength builder for your leg day, chosen for its controlled, supported range of motion.",
    tips: ["Keep your lower back flat against the pad — don't let it round at the bottom.", "Stop before your knees travel past roughly 90°.", "Push through your whole foot, not just your toes."],
    mistakes: ["Letting the knees cave inward.", "Going deeper than is comfortable for your hips, which can round the lower back."],
    safety: ["Given your nerve history, keep this controlled and moderate-depth — don't chase maximum range of motion in the first weeks."],
    alternatives: ["Leg Extension + Leg Curl combined"], easier: "Reduce depth further and use lighter weight for the first 2 weeks.",
    advanced: "Add a 2-second pause at the bottom of each rep.", warmup: "Bodyweight squats x10, leg swings.", stretchAfter: "Standing quad stretch + kneeling hip flexor stretch.",
  },
  "Leg Extension": {
    primary: ["quads"], secondary: [], pattern: "extension",
    difficulty: "Beginner", estCalories: 60, estMinutes: 6, tempo: "1s up, 2s down",
    benefits: "Isolates the quads directly, which helps build knee stability and balances out posterior-chain-dominant lifts.",
    whyIncluded: "Direct quad isolation to finish off the compound leg press work.",
    tips: ["Don't let the weight stack slam down between reps.", "Point toes straight ahead, not turned out.", "Squeeze at the top for a full second."],
    mistakes: ["Using a jerking motion to start the lift.", "Going too heavy and shortening the range of motion."],
    safety: ["Avoid this move entirely if you have any current knee pain — check with a professional first."],
    alternatives: ["Leg Press (controlled depth)"], easier: "Use lighter weight and full, slow reps.",
    advanced: "Add a 1-second pause at the top.", warmup: "None needed after leg press.", stretchAfter: "Standing quad stretch, 30s per side.",
  },
  "Leg Curl": {
    primary: ["hamstrings"], secondary: ["glutes"], pattern: "curl",
    difficulty: "Beginner", estCalories: 60, estMinutes: 6, tempo: "1s in, 2s out",
    benefits: "Isolates the hamstrings, which are often undertrained relative to the quads and important for knee-joint balance.",
    whyIncluded: "Balances the quad-dominant leg press and extension work.",
    tips: ["Keep your hips pressed into the pad — don't let them lift.", "Curl through a full range of motion.", "Control the return rather than letting the weight drop."],
    mistakes: ["Lifting the hips off the pad to move more weight.", "Using short, partial reps."],
    safety: ["Ease into this — hamstrings are commonly strained by going too heavy too soon."],
    alternatives: ["Bodyweight Bridge"], easier: "Use light weight and prioritize a full stretch and squeeze.",
    advanced: "Add a 1-second squeeze at peak contraction.", warmup: "None needed after other leg work.", stretchAfter: "Standing hamstring stretch, 30s per side.",
  },
  "Standing Calf Raise": {
    primary: ["calves"], secondary: [], pattern: "calf",
    difficulty: "Beginner", estCalories: 45, estMinutes: 5, tempo: "1s up, 2s down",
    benefits: "Builds calf size and ankle stability, both of which support every other standing lift you do.",
    whyIncluded: "Direct calf work — an easy muscle group to neglect if it's not programmed on purpose.",
    tips: ["Rise as high onto your toes as possible.", "Lower until you feel a full stretch in the calf.", "Keep knees soft, not locked."],
    mistakes: ["Bouncing at the bottom instead of pausing.", "Using a very short, partial range of motion."],
    safety: ["Hold onto a rail for balance if using free-standing bodyweight raises."],
    alternatives: ["Bodyweight calf raises anywhere"], easier: "Do bodyweight raises before adding machine weight.",
    advanced: "Add a 2-second pause at the top of each rep.", warmup: "Ankle circles.", stretchAfter: "Standing calf stretch against a wall, 30s per side.",
  },
  "Bodyweight Bridge": {
    primary: ["glutes"], secondary: ["hamstrings", "lowerBack"], pattern: "core",
    difficulty: "Beginner", estCalories: 30, estMinutes: 5, tempo: "2s up, 5s hold, 2s down",
    benefits: "Strengthens the glutes and lower back while keeping the spine in a safe, supported position — a good nerve-friendly hip-loading exercise.",
    whyIncluded: "Directly supports your genitofemoral nerve mobility routine and builds hip strength without loading the spine.",
    tips: ["Push through your heels, not your toes.", "Squeeze your glutes at the top rather than arching your lower back.", "Keep your ribs down, avoid over-extending."],
    mistakes: ["Arching the lower back excessively to lift higher.", "Pushing through the toes instead of the heels."],
    safety: ["This is one of your nerve-safe exercises — if it ever causes groin/thigh discomfort, stop and mention it at your next check-in."],
    alternatives: ["Leg Curl"], easier: "Reduce the hold time to 2-3 seconds.",
    advanced: "Progress to a single-leg bridge once pain-free.", warmup: "Pelvic tilts x10.", stretchAfter: "Figure-4 stretch, 30s per side.",
  },
  "Plank": {
    primary: ["abs"], secondary: ["obliques", "lowerBack"], pattern: "core",
    difficulty: "Beginner", estCalories: 25, estMinutes: 4, tempo: "Hold, steady breathing",
    benefits: "Builds core bracing strength that protects your spine during every other lift in the program.",
    whyIncluded: "Low-impact core stability work with no spinal flexion, which is safer for most people than weighted crunches.",
    tips: ["Keep a straight line from head to heels.", "Squeeze your glutes and brace your abs like you're about to be poked.", "Breathe steadily — don't hold your breath."],
    mistakes: ["Letting the hips sag toward the floor.", "Piking the hips up too high."],
    safety: ["Stop if you feel lower back discomfort — drop to your knees to reduce load."],
    alternatives: ["Cable Crunch"], easier: "Hold from your knees instead of your toes.",
    advanced: "Progress to a longer hold or add a shoulder-tap challenge.", warmup: "Cat-Camel x10.", stretchAfter: "Child's pose, 30s.",
  },

  /* ---- Mobility / stretching (nerve-focused) ---- */
  "Kneeling Hip Flexor Stretch": {
    primary: ["hipFlexors"], secondary: ["adductors"], pattern: "stretch",
    difficulty: "Beginner", estCalories: 8, estMinutes: 3, tempo: "Hold 30s, breathe steadily",
    benefits: "Releases tightness in the hip flexors, which can reduce compression near the genitofemoral nerve pathway.",
    whyIncluded: "Directly targets a common source of anterior hip tightness relevant to your nerve history.",
    tips: ["Keep your back hip tucked under — don't let your lower back arch.", "Push your hips forward gently, not aggressively.", "Breathe slowly through the stretch."],
    mistakes: ["Overarching the lower back to feel a bigger stretch.", "Bouncing instead of holding steady."],
    safety: ["Stop immediately if you feel any tingling, numbness, or sharp groin pain — this is one of your flagged nerve-sensitive stretches."],
    alternatives: ["Standing Quad Stretch"], easier: "Reduce the forward lean until it's a mild stretch only.",
    advanced: "N/A — this is a therapeutic stretch, not a progressive-loading exercise.", warmup: "Not needed — safe to do cold.", stretchAfter: "N/A",
  },
  "Standing Quad Stretch": {
    primary: ["quads"], secondary: ["hipFlexors"], pattern: "stretch",
    difficulty: "Beginner", estCalories: 8, estMinutes: 3, tempo: "Hold 30s, breathe steadily",
    benefits: "Releases quad and hip flexor tightness that can contribute to anterior hip and groin tension.",
    whyIncluded: "Complements the hip flexor stretch for full anterior hip/thigh mobility.",
    tips: ["Keep your knees close together.", "Tuck your pelvis slightly under for a deeper, safer stretch.", "Hold onto something for balance if needed."],
    mistakes: ["Yanking the foot too hard toward the glute.", "Letting the standing knee lock out."],
    safety: ["Ease off if you feel any groin discomfort rather than just a normal thigh stretch."],
    alternatives: ["Kneeling Hip Flexor Stretch"], easier: "Use a wall or chair for balance support.",
    advanced: "N/A — therapeutic stretch.", warmup: "Not needed.", stretchAfter: "N/A",
  },
  "Supine Piriformis Stretch": {
    primary: ["piriformis"], secondary: ["glutes"], pattern: "stretch",
    difficulty: "Beginner", estCalories: 8, estMinutes: 3, tempo: "Hold 30s, breathe steadily",
    benefits: "Releases the piriformis muscle, which sits near the sciatic and pelvic nerve pathways and can contribute to nerve irritation when tight.",
    whyIncluded: "Directly relevant to your nerve mobility routine.",
    tips: ["Keep your head and shoulders relaxed on the floor.", "Pull the knee gently toward the opposite shoulder.", "Stop at a comfortable stretch, not a painful one."],
    mistakes: ["Pulling too hard, too fast.", "Lifting the hips off the floor to force a deeper stretch."],
    safety: ["Stop immediately with any tingling or shooting sensation down the leg — that's a sign to ease off, not push through."],
    alternatives: ["Figure-4 Stretch"], easier: "Reduce the pull and hold a lighter stretch.",
    advanced: "N/A — therapeutic stretch.", warmup: "Not needed.", stretchAfter: "N/A",
  },
  "Figure-4 Stretch": {
    primary: ["piriformis"], secondary: ["glutes"], pattern: "stretch",
    difficulty: "Beginner", estCalories: 8, estMinutes: 3, tempo: "Hold 30s, breathe steadily",
    benefits: "A deeper variation of the piriformis stretch that also opens the outer hip.",
    whyIncluded: "Part of your core nerve mobility routine.",
    tips: ["Keep the crossed ankle relaxed, not flexed hard.", "Pull the uncrossed thigh toward your chest gently.", "Keep your lower back flat on the floor."],
    mistakes: ["Forcing the stretch through resistance.", "Rounding the lower back to pull deeper."],
    safety: ["Stop with any radiating pain, numbness, or tingling into the leg."],
    alternatives: ["Supine Piriformis Stretch"], easier: "Reduce the pull and just rest in the crossed-leg position.",
    advanced: "N/A — therapeutic stretch.", warmup: "Not needed.", stretchAfter: "N/A",
  },
  "Butterfly Adductor Stretch": {
    primary: ["adductors"], secondary: [], pattern: "stretch",
    difficulty: "Beginner", estCalories: 8, estMinutes: 3, tempo: "Hold 30s, breathe steadily",
    benefits: "Releases the inner thigh muscles, directly reducing tension in the region the genitofemoral nerve passes through.",
    whyIncluded: "One of your most directly nerve-relevant stretches.",
    tips: ["Sit tall, don't round your lower back.", "Let gravity gently press the knees down rather than pushing with your hands.", "Breathe slowly throughout."],
    mistakes: ["Pressing down on the knees forcefully.", "Rounding forward from the lower back instead of the hips."],
    safety: ["Stop immediately if you feel groin tingling, numbness, or sharp pain."],
    alternatives: ["Figure-4 Stretch"], easier: "Sit with knees higher/less open for a gentler stretch.",
    advanced: "N/A — therapeutic stretch.", warmup: "Not needed.", stretchAfter: "N/A",
  },
  "Cat-Camel": {
    primary: ["lowerBack"], secondary: ["abs"], pattern: "core",
    difficulty: "Beginner", estCalories: 10, estMinutes: 2, tempo: "Slow, controlled, matched to breath",
    benefits: "Gently mobilizes the entire spine and warms up the core before training or stretching.",
    whyIncluded: "A safe, gentle warm-up movement that's part of your daily mobility routine.",
    tips: ["Move slowly, one vertebra at a time.", "Exhale as you round your back, inhale as you arch it.", "Keep the movement pain-free and gentle."],
    mistakes: ["Rushing through reps.", "Forcing a bigger range of motion than feels comfortable."],
    safety: ["This is safe to do daily, including on days you feel mild nerve symptoms."],
    alternatives: ["Pelvic Tilt"], easier: "Reduce the range of motion.",
    advanced: "N/A — this is a mobility drill, not a progressive exercise.", warmup: "Not needed — this IS a warm-up.", stretchAfter: "N/A",
  },
  "Pelvic Tilt": {
    primary: ["abs"], secondary: ["lowerBack"], pattern: "core",
    difficulty: "Beginner", estCalories: 10, estMinutes: 2, tempo: "Slow, controlled",
    benefits: "Builds awareness and control of pelvic position, which helps protect the lower back and hips during training.",
    whyIncluded: "A foundational control exercise in your nerve mobility routine.",
    tips: ["Flatten your lower back gently into the floor by tilting your pelvis.", "Keep the movement small and controlled.", "Breathe normally throughout."],
    mistakes: ["Using the legs/glutes to force the movement instead of the deep core.", "Holding your breath."],
    safety: ["Safe daily, including during mild symptom flare-ups."],
    alternatives: ["Cat-Camel"], easier: "Reduce the tilt range.",
    advanced: "N/A — mobility drill.", warmup: "Not needed.", stretchAfter: "N/A",
  },
  "Hip Abduction/Adduction (light)": {
    primary: ["glutes", "adductors"], secondary: [], pattern: "raise",
    difficulty: "Beginner", estCalories: 35, estMinutes: 5, tempo: "2s out, 2s in",
    benefits: "Strengthens the muscles on both sides of the hip in a controlled, machine-supported range of motion.",
    whyIncluded: "Doubles as strengthening work and nerve-friendly hip mobility — but only add this back in once you've had a pain-free stretch, per your leg-day guidance.",
    tips: ["Keep your torso still — let your hips do the work.", "Move through a comfortable range, not maximum stretch.", "Control both the outward and inward phases."],
    mistakes: ["Using too much weight, which reduces control.", "Rocking the torso to help move the weight."],
    safety: ["Skip this exercise entirely during weeks 1–2 or on any day with groin discomfort — see your leg-day guidance."],
    alternatives: ["Butterfly Adductor Stretch"], easier: "Use minimal weight and a smaller range of motion.",
    advanced: "Increase range of motion gradually once fully pain-free.", warmup: "Bodyweight leg swings.", stretchAfter: "Butterfly Adductor Stretch.",
  },
};

/* Fallback profile generator for any exercise not explicitly authored above */
function getExerciseDetail(name, category) {
  if (EXERCISE_LIBRARY[name]) return EXERCISE_LIBRARY[name];
  const n = name.toLowerCase();
  let pattern = "press";
  if (n.includes("curl")) pattern = "curl";
  else if (n.includes("row") || n.includes("pulldown") || n.includes("pull-up") || n.includes("pull up")) pattern = "pull";
  else if (n.includes("raise") || n.includes("abduction")) pattern = "raise";
  else if (n.includes("press") || n.includes("fly") || n.includes("pushdown")) pattern = "press";
  else if (n.includes("squat") || n.includes("leg press") || n.includes("lunge")) pattern = "squat";
  else if (n.includes("extension") && n.includes("back")) pattern = "core";
  else if (n.includes("extension")) pattern = "extension";
  else if (n.includes("calf")) pattern = "calf";
  else if (n.includes("stretch") || n.includes("figure")) pattern = "stretch";
  else if (n.includes("plank") || n.includes("crunch") || n.includes("bridge") || n.includes("tilt") || n.includes("cat-camel")) pattern = "core";
  else if (n.includes("treadmill") || n.includes("bike") || n.includes("walk")) pattern = "cardio";

  const byCategory = {
    Push: { primary: ["chest"], secondary: ["frontDelts", "triceps"], difficulty: "Beginner" },
    Pull: { primary: ["lats"], secondary: ["biceps", "traps"], difficulty: "Beginner" },
    Legs: { primary: ["quads"], secondary: ["glutes", "hamstrings"], difficulty: "Beginner" },
    "Upper Body": { primary: ["chest"], secondary: ["lats", "frontDelts"], difficulty: "Beginner" },
    "Lower Body": { primary: ["quads"], secondary: ["hamstrings", "calves"], difficulty: "Beginner" },
    "Full Body": { primary: ["quads"], secondary: ["chest", "lats"], difficulty: "Beginner" },
    Cardio: { primary: ["calves"], secondary: ["quads", "hamstrings"], difficulty: "Beginner" },
    Core: { primary: ["abs"], secondary: ["obliques", "lowerBack"], difficulty: "Beginner" },
    Mobility: { primary: ["hipFlexors"], secondary: ["lowerBack", "adductors"], difficulty: "Beginner" },
    Stretching: { primary: ["hipFlexors"], secondary: ["adductors", "piriformis"], difficulty: "Beginner" },
    "Active Recovery": { primary: ["calves"], secondary: ["hipFlexors", "lowerBack"], difficulty: "Beginner" },
  };
  const base = byCategory[category] || { primary: ["chest"], secondary: [], difficulty: "Beginner" };

  return {
    primary: base.primary, secondary: base.secondary, pattern, difficulty: base.difficulty,
    estCalories: pattern === "stretch" || pattern === "core" ? 15 : 60, estMinutes: pattern === "stretch" ? 3 : 7,
    tempo: pattern === "stretch" ? "Hold 30s, breathe steadily" : "2s up, 3s down",
    benefits: "Builds strength and control through this movement pattern as part of a balanced, full-body program.",
    whyIncluded: `Included in your ${category} session to build well-rounded strength and muscular balance.`,
    tips: ["Move with control through the full range of motion.", "Keep your core braced throughout.", "Breathe out on the effort phase of the movement."],
    mistakes: ["Rushing the movement instead of controlling it.", "Using momentum instead of muscle to move the weight."],
    safety: ["Stop if you feel any sharp or radiating pain — mild muscle fatigue is normal, joint or nerve pain is not."],
    alternatives: ["Ask your trainer for a suitable substitution"], easier: "Reduce the weight or range of motion.",
    advanced: "Increase weight gradually once form is consistent.", warmup: "General warm-up: light cardio + dynamic stretches.", stretchAfter: "Static stretch of the trained muscle, 30s.",
  };
}

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

/* Real calendar date in YYYY-MM-DD form — used for calendar/streak tracking (not just weekday labels) */
const isoDate = (offset = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
};

const shortDateLabel = (iso) => {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

/* Persists state to the browser's localStorage (this is a real deployed web app, not a Claude.ai
   artifact preview, so localStorage works normally here — unlike in-chat artifacts). */
function usePersistentState(key, defaultValue) {
  const resolveDefault = () => (typeof defaultValue === "function" ? defaultValue() : defaultValue);
  const [state, setState] = useState(() => {
    try {
      const saved = typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
      return saved !== null ? JSON.parse(saved) : resolveDefault();
    } catch (e) {
      return resolveDefault();
    }
  });
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch (e) { /* storage unavailable — fail silently, app still works in-session */ }
  }, [key, state]);
  return [state, setState];
}

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

/* Swipe-left-to-reveal-delete wrapper. Works with touch and mouse (pointer events). */
function SwipeableRow({ t, onDelete, children }) {
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startXRef = useRef(0);
  const baseXRef = useRef(0);
  const DELETE_WIDTH = 78;

  const onPointerDown = (e) => {
    setDragging(true);
    startXRef.current = e.clientX;
    baseXRef.current = dragX;
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!dragging) return;
    const delta = e.clientX - startXRef.current;
    setDragX(Math.min(0, Math.max(baseXRef.current + delta, -DELETE_WIDTH)));
  };
  const endDrag = () => {
    setDragging(false);
    setDragX(prev => (prev < -DELETE_WIDTH / 2 ? -DELETE_WIDTH : 0));
  };

  return (
    <div style={{ position: "relative", overflow: "hidden", borderRadius: 18 }}>
      <div style={{
        position: "absolute", top: 0, right: 0, bottom: 0, width: DELETE_WIDTH,
        background: t.coral, display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <button onClick={onDelete} style={{
          background: "none", border: "none", color: "#2A0E08", display: "flex",
          flexDirection: "column", alignItems: "center", gap: 2, width: "100%", height: "100%", justifyContent: "center",
        }}>
          <Trash2 size={16} />
          <span style={{ fontSize: 10, fontWeight: 700 }}>Delete</span>
        </button>
      </div>
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        style={{
          transform: `translateX(${dragX}px)`,
          transition: dragging ? "none" : "transform 0.2s ease",
          touchAction: "pan-y",
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* ============================================================
   BODY MAP — interactive front/back muscle diagram (original SVG, tappable regions)
   ============================================================ */
function BodyMap({ t, primary = [], secondary = [], size = 150 }) {
  const [view, setView] = useState("front");
  const [selected, setSelected] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const regions = view === "front" ? FRONT_REGIONS : BACK_REGIONS;
  const info = selected ? MUSCLE_INFO[selected] : null;

  const regionColor = (key) => {
    if (primary.includes(key)) return t.coral;
    if (secondary.includes(key)) return t.turmeric;
    return t.inkFaint;
  };
  const regionOpacity = (key) => (primary.includes(key) || secondary.includes(key) ? 0.92 : 0.25);

  const flip = () => {
    setSpinning(true);
    setTimeout(() => { setView(v => (v === "front" ? "back" : "front")); setSelected(null); }, 160);
    setTimeout(() => setSpinning(false), 340);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div style={{ display: "flex", gap: 12, fontSize: 10.5, color: t.inkDim }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: 999, background: t.coral, display: "inline-block" }} /> Primary
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: 999, background: t.turmeric, display: "inline-block" }} /> Secondary
          </span>
        </div>
        <button onClick={flip} style={{
          display: "flex", alignItems: "center", gap: 5, background: t.bgElevated, border: `1px solid ${t.border}`,
          borderRadius: 10, padding: "5px 10px", fontSize: 11, fontWeight: 600, color: t.ink,
        }}>
          <RotateCw size={12} /> {view === "front" ? "Front" : "Back"} view
        </button>
      </div>

      <div style={{
        display: "flex", justifyContent: "center", perspective: 600,
        transform: spinning ? "rotateY(90deg)" : "rotateY(0deg)", transition: "transform 0.32s ease",
      }}>
        <svg viewBox="0 0 200 300" width={size} height={size * 1.5}>
          {BASE_BODY.map((s, i) => s.shape === "circle"
            ? <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill={t.inkFaint} opacity={0.18} />
            : <rect key={i} x={s.x} y={s.y} width={s.width} height={s.height} rx={s.rx} fill={t.inkFaint} opacity={0.18} />
          )}
          {regions.map((r, i) => {
            const color = regionColor(r.key);
            const op = regionOpacity(r.key);
            return r.shape === "ellipse"
              ? <ellipse key={i} cx={r.cx} cy={r.cy} rx={r.rx} ry={r.ry} fill={color} opacity={op} stroke={t.bg} strokeWidth={1.5}
                  style={{ cursor: "pointer" }} onClick={() => setSelected(r.key)} />
              : <rect key={i} x={r.x} y={r.y} width={r.width} height={r.height} rx={r.rx} fill={color} opacity={op} stroke={t.bg} strokeWidth={1.5}
                  style={{ cursor: "pointer" }} onClick={() => setSelected(r.key)} />;
          })}
        </svg>
      </div>

      {info && (
        <Card t={t} style={{ marginTop: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{info.label}</div>
              <div style={{ fontSize: 11, color: t.inkFaint, fontStyle: "italic", marginTop: 1 }}>{info.anatomicalName}</div>
            </div>
            <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: t.inkFaint, padding: 2 }}>
              <X size={14} />
            </button>
          </div>
          <div style={{ fontSize: 12, color: t.inkDim, marginTop: 6, lineHeight: 1.5 }}>{info.function}</div>
        </Card>
      )}
      {!info && <div style={{ fontSize: 10.5, color: t.inkFaint, textAlign: "center", marginTop: 4 }}>Tap a highlighted muscle to learn more</div>}
    </div>
  );
}

/* ============================================================
   ANIMATED DEMO — lightweight looping CSS/SVG movement illustration
   ============================================================ */
function AnimatedDemo({ t, pattern = "press", size = 130 }) {
  const skin = t.ink;
  const shirt = t.turmeric;
  const shorts = t.teal;
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", background: t.bgElevated, borderRadius: 16, padding: "16px 0" }}>
      <svg viewBox="0 0 120 160" width={size} height={size * 1.3} className={`demo-figure demo-${pattern}`}>
        {/* head + neck */}
        <circle className="demo-head" cx="60" cy="18" r="11" fill={skin} opacity="0.9" />
        <rect x="56" y="27" width="8" height="8" rx="3" fill={skin} opacity="0.8" />
        {/* tapered torso (shoulders wider than waist, like a real upper body) */}
        <path className="demo-torso" d="M44,36 Q60,28 76,36 L72,80 Q60,86 48,80 Z" fill={shirt} opacity="0.92" />
        {/* hips */}
        <path d="M48,80 Q60,86 72,80 L74,96 Q60,102 46,96 Z" fill={shorts} opacity="0.9" />
        {/* shoulder joints */}
        <circle cx="45" cy="38" r="4.5" fill={skin} opacity="0.85" />
        <circle cx="75" cy="38" r="4.5" fill={skin} opacity="0.85" />
        {/* arms — upper arm + forearm for a more articulated, human silhouette */}
        <g className="demo-arm-left" style={{ transformOrigin: "45px 38px" }}>
          <rect x="38" y="38" width="11" height="30" rx="5.5" fill={skin} opacity="0.9" />
          <circle cx="43.5" cy="66" r="4" fill={skin} opacity="0.8" />
          <rect x="38" y="64" width="11" height="26" rx="5.5" fill={skin} opacity="0.75" />
        </g>
        <g className="demo-arm-right" style={{ transformOrigin: "75px 38px" }}>
          <rect x="71" y="38" width="11" height="30" rx="5.5" fill={skin} opacity="0.9" />
          <circle cx="76.5" cy="66" r="4" fill={skin} opacity="0.8" />
          <rect x="71" y="64" width="11" height="26" rx="5.5" fill={skin} opacity="0.75" />
        </g>
        {/* hip joints */}
        <circle cx="52" cy="98" r="4.5" fill={shorts} opacity="0.85" />
        <circle cx="68" cy="98" r="4.5" fill={shorts} opacity="0.85" />
        {/* legs — thigh + shin */}
        <g className="demo-leg-left" style={{ transformOrigin: "52px 98px" }}>
          <rect x="45" y="96" width="13" height="34" rx="6" fill={skin} opacity="0.88" />
          <circle cx="51.5" cy="128" r="4.5" fill={skin} opacity="0.75" />
          <rect x="45" y="126" width="13" height="30" rx="6" fill={skin} opacity="0.7" />
        </g>
        <g className="demo-leg-right" style={{ transformOrigin: "68px 98px" }}>
          <rect x="62" y="96" width="13" height="34" rx="6" fill={skin} opacity="0.88" />
          <circle cx="68.5" cy="128" r="4.5" fill={skin} opacity="0.75" />
          <rect x="62" y="126" width="13" height="30" rx="6" fill={skin} opacity="0.7" />
        </g>
      </svg>
    </div>
  );
}

function MiniStat({ t, icon: Icon, label, value, accent }) {
  return (
    <div style={{ background: t.bgElevated, border: `1px solid ${t.border}`, borderRadius: 12, padding: "8px 6px", textAlign: "center" }}>
      <Icon size={13} color={accent || t.inkDim} style={{ margin: "0 auto", display: "block" }} />
      <div className="mono" style={{ fontSize: 11, fontWeight: 700, marginTop: 4, color: accent || t.ink }}>{value}</div>
      <div style={{ fontSize: 9, color: t.inkFaint, marginTop: 1 }}>{label}</div>
    </div>
  );
}

/* ============================================================
   EDUCATION ACCORDION — expandable coaching content
   ============================================================ */
function EducationAccordion({ t, detail }) {
  const [open, setOpen] = useState(null);
  const sections = [
    { key: "benefits", label: "Benefits", content: detail.benefits },
    { key: "why", label: "Why it's in your program", content: detail.whyIncluded },
    { key: "tips", label: "Execution tips", content: detail.tips },
    { key: "mistakes", label: "Common mistakes", content: detail.mistakes },
    { key: "safety", label: "Safety precautions", content: detail.safety },
    { key: "alternatives", label: "Alternative exercises", content: detail.alternatives },
    { key: "variations", label: "Easier & advanced variations", content: [`Easier: ${detail.easier}`, `Advanced: ${detail.advanced}`] },
    { key: "warmup", label: "Warm-up recommendation", content: detail.warmup },
    { key: "stretch", label: "Stretch afterward", content: detail.stretchAfter },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {sections.map(s => {
        const hasContent = Array.isArray(s.content) ? s.content.filter(Boolean).length > 0 : !!(s.content && s.content !== "N/A");
        if (!hasContent) return null;
        const isOpen = open === s.key;
        return (
          <div key={s.key} style={{ border: `1px solid ${t.border}`, borderRadius: 12, overflow: "hidden" }}>
            <button onClick={() => setOpen(isOpen ? null : s.key)} style={{
              width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "10px 12px", background: "none", border: "none", color: t.ink, fontSize: 12.5, fontWeight: 600,
            }}>
              {s.label}
              <ChevronDown size={14} color={t.inkFaint} style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }} />
            </button>
            {isOpen && (
              <div style={{ padding: "0 12px 12px", fontSize: 12, color: t.inkDim, lineHeight: 1.6 }}>
                {Array.isArray(s.content)
                  ? <ul style={{ margin: 0, paddingLeft: 16 }}>{s.content.map((c, i) => <li key={i}>{c}</li>)}</ul>
                  : <div>{s.content}</div>}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* Combines the demo animation, quick stats, body map, and education accordion — reused in the
   pre-workout Session Overview and inline during active logging. */
function ExerciseDetailBlock({ t, name, category, history }) {
  const detail = getExerciseDetail(name, category);
  const hist = history?.[name];
  return (
    <div style={{ marginTop: 10 }}>
      <AnimatedDemo t={t} pattern={detail.pattern} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 10 }}>
        <MiniStat t={t} icon={Zap} label="Level" value={detail.difficulty} />
        <MiniStat t={t} icon={Flame} label="Burn" value={`~${detail.estCalories} kcal`} />
        <MiniStat t={t} icon={Clock} label="Time" value={`~${detail.estMinutes} min`} />
      </div>
      {hist && (hist.lastWeight || hist.prWeight) && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }}>
          <MiniStat t={t} icon={History} label="Last time" value={hist.lastWeight ? `${hist.lastWeight}kg × ${hist.lastReps}` : "—"} />
          <MiniStat t={t} icon={Award} label="Personal record" value={hist.prWeight ? `${hist.prWeight}kg × ${hist.prReps}` : "—"} accent={t.turmeric} />
        </div>
      )}
      <div style={{ fontSize: 11, color: t.inkDim, marginTop: 10 }}>Tempo: <span style={{ color: t.ink, fontWeight: 600 }}>{detail.tempo}</span></div>
      <div style={{ marginTop: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: t.inkDim, marginBottom: 6, letterSpacing: 0.3 }}>MUSCLES TARGETED</div>
        <BodyMap t={t} primary={detail.primary} secondary={detail.secondary} size={130} />
      </div>
      <div style={{ marginTop: 12 }}>
        <EducationAccordion t={t} detail={detail} />
      </div>
    </div>
  );
}

/* ============================================================
   WORKOUT CALENDAR — color-coded month view + streak/skip summary
   ============================================================ */
function WorkoutCalendar({ t, workoutLogHistory }) {
  const [monthOffset, setMonthOffset] = useState(0);
  const today = new Date();
  const viewDate = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  const year = viewDate.getFullYear(), month = viewDate.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayIso = isoDate(0);

  const loggedDates = new Set(workoutLogHistory.map(w => w.date));
  const sortedDates = [...loggedDates].sort();
  const startDate = sortedDates[0];

  let daysSkipped = 0;
  if (startDate) {
    const start = new Date(startDate + "T00:00:00");
    const cursor = new Date(start);
    while (cursor <= today) {
      const iso = cursor.toISOString().slice(0, 10);
      if (!loggedDates.has(iso)) daysSkipped++;
      cursor.setDate(cursor.getDate() + 1);
    }
  }
  const totalTrained = loggedDates.size;
  const totalSpan = startDate ? totalTrained + daysSkipped : 0;
  const consistencyPct = totalSpan ? Math.round((totalTrained / totalSpan) * 100) : 0;

  const cells = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const cellStatus = (d) => {
    const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    if (iso === todayIso) return "today";
    if (loggedDates.has(iso)) return "worked";
    if (iso < todayIso && (!startDate || iso >= startDate)) return "missed";
    return "neutral";
  };

  return (
    <Card t={t}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 12, fontWeight: 700 }}>Workout Calendar</div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button onClick={() => setMonthOffset(m => m - 1)} style={{ background: "none", border: `1px solid ${t.border}`, borderRadius: 7, padding: 3, color: t.inkDim }}>
            <ChevronLeft size={13} />
          </button>
          <span style={{ fontSize: 11, fontWeight: 600, color: t.inkDim, minWidth: 72, textAlign: "center" }}>
            {viewDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </span>
          <button onClick={() => setMonthOffset(m => m + 1)} style={{ background: "none", border: `1px solid ${t.border}`, borderRadius: 7, padding: 3, color: t.inkDim }}>
            <ChevronRight size={13} />
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginTop: 12 }}>
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i} style={{ textAlign: "center", fontSize: 9, color: t.inkFaint, fontWeight: 600 }}>{d}</div>
        ))}
        {cells.map((d, i) => {
          if (d === null) return <div key={i} />;
          const status = cellStatus(d);
          const colors = {
            worked: { bg: t.teal, fg: "#06201C" },
            missed: { bg: t.coral, fg: "#2A0E08" },
            today: { bg: "transparent", fg: t.turmeric },
            neutral: { bg: "transparent", fg: t.inkFaint },
          }[status];
          return (
            <div key={i} style={{
              aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center",
              borderRadius: 8, fontSize: 10.5, fontWeight: 700, background: colors.bg, color: colors.fg,
              border: status === "today" ? `1.5px solid ${t.turmeric}` : "none",
            }}>
              {d}
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 12, fontSize: 10, color: t.inkDim }}>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 8, height: 8, borderRadius: 3, background: t.teal, display: "inline-block" }} /> Trained
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 8, height: 8, borderRadius: 3, background: t.coral, display: "inline-block" }} /> Missed
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 8, height: 8, borderRadius: 3, border: `1.5px solid ${t.turmeric}`, display: "inline-block" }} /> Today
        </span>
      </div>

      {startDate ? (
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${t.border}`, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          <div>
            <div className="mono" style={{ fontSize: 13, fontWeight: 700 }}>{shortDateLabel(startDate)}</div>
            <div style={{ fontSize: 9, color: t.inkFaint }}>Started</div>
          </div>
          <div>
            <div className="mono" style={{ fontSize: 13, fontWeight: 700, color: t.teal }}>{totalTrained}</div>
            <div style={{ fontSize: 9, color: t.inkFaint }}>Days trained</div>
          </div>
          <div>
            <div className="mono" style={{ fontSize: 13, fontWeight: 700, color: t.coral }}>{daysSkipped}</div>
            <div style={{ fontSize: 9, color: t.inkFaint }}>Days skipped</div>
          </div>
        </div>
      ) : (
        <div style={{ marginTop: 10, fontSize: 11, color: t.inkFaint }}>Log your first workout to start tracking your streak.</div>
      )}
    </Card>
  );
}

/* ============================================================
   MAIN APP
   ============================================================ */

export default function FitCoachApp() {
  const [isDark, setIsDark] = useState(true);
  const t = isDark ? TOKENS : LIGHT_TOKENS;
  const [tab, setTab] = useState("dashboard");
  const [profile, setProfile] = usePersistentState("fc_profile", null);

  const [targets, setTargets] = usePersistentState("fc_targets", { calories: 2550, protein: 115, carbs: 350, fat: 70, water: 8 });
  const [waterBottles, setWaterBottles] = useState(3);
  const [meals, setMeals] = usePersistentState("fc_meals_" + isoDate(0), [
    { name: "Egg Bhurji + Roti", cal: 550, protein: 35, carbs: 45, fat: 22, time: "8:15 AM" },
    { name: "Rice, Sambar & Grilled Chicken", cal: 700, protein: 40, carbs: 80, fat: 18, time: "1:00 PM" },
  ]);
  const [workoutLogHistory, setWorkoutLogHistory] = usePersistentState("fc_workout_log", () =>
    ["Push", "Pull", "Legs", "Push", "Pull"].map((cat, i) => ({
      date: isoDate(-(5 - i)), category: cat, volume: 3200 + Math.round(Math.random() * 900), duration: 62 + Math.round(Math.random() * 10),
    }))
  );
  const [streak, setStreak] = usePersistentState("fc_streak", 6);
  const [weightHistory] = useState(genHistory(56, 0.6));
  const quote = useMemo(() => QUOTES[new Date().getDate() % QUOTES.length], []);

  const consumed = meals.reduce((a, m) => ({ cal: a.cal + m.cal, protein: a.protein + m.protein, carbs: a.carbs + m.carbs, fat: a.fat + m.fat }), { cal: 0, protein: 0, carbs: 0, fat: 0 });
  const remaining = Math.max(targets.calories - consumed.cal, 0);

  const todaysWorkoutDone = workoutLogHistory.some(w => w.date === isoDate(0));
  const [workoutProgressPct, setWorkoutProgressPct] = useState(() => (todaysWorkoutDone ? 100 : 0));
  const [exerciseHistory, setExerciseHistory] = usePersistentState("fc_exercise_history", {});

  const NAV = [
    { id: "dashboard", label: "Home", icon: LayoutDashboard },
    { id: "workout", label: "Workout", icon: Dumbbell },
    { id: "nutrition", label: "Nutrition", icon: UtensilsCrossed },
    { id: "analytics", label: "Progress", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings2 },
  ];

  const globalStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');
    * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
    html, body { height: 100%; }
    .mono { font-family: 'IBM Plex Mono', monospace; }
    .display { font-family: 'Sora', sans-serif; }
    ::-webkit-scrollbar { width: 0px; height: 0px; }
    .scrollx { overflow-x: auto; scrollbar-width: none; }
    button { font-family: inherit; cursor: pointer; }
    input, select {
      font-family: inherit;
      font-size: 16px; /* prevents iOS Safari auto-zoom on focus */
    }

    @keyframes armPress { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-13px) rotate(-8deg); } }
    @keyframes armPull { 0%, 100% { transform: translateX(0) rotate(0deg); } 50% { transform: translateX(9px) rotate(8deg); } }
    @keyframes armCurl { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(-48deg); } }
    @keyframes armRaise { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(-68deg); } }
    @keyframes legSquat { 0%, 100% { transform: scaleY(1) translateY(0); } 50% { transform: scaleY(0.84) translateY(7px); } }
    @keyframes torsoBrace { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.045); } }
    @keyframes gentlePulse { 0%, 100% { opacity: 0.85; transform: scale(1); } 50% { opacity: 1; transform: scale(1.035); } }
    @keyframes calfBob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
    @keyframes legMarch { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-7px); } }

    .demo-press .demo-arm-left, .demo-press .demo-arm-right { animation: armPress 2.2s cubic-bezier(0.45,0,0.55,1) infinite; }
    .demo-pull .demo-arm-left, .demo-pull .demo-arm-right { animation: armPull 2.2s cubic-bezier(0.45,0,0.55,1) infinite; }
    .demo-curl .demo-arm-left, .demo-curl .demo-arm-right { animation: armCurl 2s cubic-bezier(0.45,0,0.55,1) infinite; }
    .demo-raise .demo-arm-left, .demo-raise .demo-arm-right { animation: armRaise 2.2s cubic-bezier(0.45,0,0.55,1) infinite; }
    .demo-squat .demo-torso, .demo-squat .demo-leg-left, .demo-squat .demo-leg-right { animation: legSquat 2.4s cubic-bezier(0.45,0,0.55,1) infinite; }
    .demo-extension .demo-leg-left, .demo-extension .demo-leg-right { animation: armRaise 2s cubic-bezier(0.45,0,0.55,1) infinite; }
    .demo-core .demo-torso { animation: torsoBrace 2.6s cubic-bezier(0.45,0,0.55,1) infinite; }
    .demo-figure.demo-stretch { animation: gentlePulse 3s ease-in-out infinite; }
    .demo-figure.demo-calf { animation: calfBob 1.6s cubic-bezier(0.45,0,0.55,1) infinite; }
    .demo-cardio .demo-leg-left { animation: legMarch 1s cubic-bezier(0.45,0,0.55,1) infinite; }
    .demo-cardio .demo-leg-right { animation: legMarch 1s cubic-bezier(0.45,0,0.55,1) infinite reverse; }
  `;

  if (!profile) {
    return (
      <>
        <style>{globalStyles}</style>
        <LoginScreen t={t} onComplete={(p) => {
          setProfile(p);
          setTargets(computeTargets(p));
        }} />
      </>
    );
  }

  return (
    <div style={{
      fontFamily: "Inter, -apple-system, sans-serif", background: t.bg, color: t.ink,
      width: "100%", height: "100dvh", display: "flex", flexDirection: "column", overflow: "hidden",
    }}>
      <style>{globalStyles}</style>

      <div style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
        {tab === "dashboard" && (
          <Dashboard t={t} isDark={isDark} setIsDark={setIsDark} waterBottles={waterBottles} setWaterBottles={setWaterBottles}
            targets={targets} consumed={consumed} remaining={remaining} streak={streak} quote={quote}
            todaysWorkoutDone={todaysWorkoutDone} workoutProgressPct={workoutProgressPct} setTab={setTab} profile={profile} />
        )}
        {tab === "workout" && (
          <WorkoutTab t={t} onLogWorkout={(entry) => { setWorkoutLogHistory(h => [...h, entry]); setStreak(s => s + 1); }}
            onProgress={setWorkoutProgressPct} exerciseHistory={exerciseHistory} setExerciseHistory={setExerciseHistory} />
        )}
        {tab === "nutrition" && (
          <NutritionTab t={t} meals={meals} setMeals={setMeals} targets={targets} consumed={consumed} remaining={remaining} />
        )}
        {tab === "analytics" && (
          <AnalyticsTab t={t} weightHistory={weightHistory} workoutLogHistory={workoutLogHistory} meals={meals} targets={targets} />
        )}
        {tab === "settings" && (
          <SettingsTab t={t} isDark={isDark} setIsDark={setIsDark} targets={targets} setTargets={setTargets}
            profile={profile} onEditProfile={() => setProfile(null)} />
        )}
      </div>

      {/* Bottom Nav */}
      <div style={{
        background: t.bgElevated, borderTop: `1px solid ${t.border}`, display: "flex",
        padding: "10px 6px calc(10px + env(safe-area-inset-bottom, 0px))", flexShrink: 0,
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
   LOGIN / PROFILE SETUP
   ============================================================ */
function computeTargets(p) {
  const weight = Number(p.weight) || 56;
  const height = Number(p.height) || 165;
  const age = Number(p.age) || 28;
  const bmr = p.sex === "female"
    ? 10 * weight + 6.25 * height - 5 * age - 161
    : 10 * weight + 6.25 * height - 5 * age + 5;
  const activityMultiplier = { sedentary: 1.3, moderate: 1.5, active: 1.7 }[p.activity] || 1.5;
  const tdee = bmr * activityMultiplier;
  const goalAdj = { gain: 300, maintain: 0, lose: -350 }[p.goal] ?? 0;
  const calories = Math.round((tdee + goalAdj) / 10) * 10;
  const protein = Math.round(weight * 2.0);
  const fat = Math.round((calories * 0.25) / 9);
  const carbs = Math.round((calories - protein * 4 - fat * 9) / 4);
  return { calories, protein, carbs, fat, water: 8 };
}

function LoginScreen({ t, onComplete }) {
  const [form, setForm] = useState({
    name: "", age: "", height: "", weight: "", sex: "male", activity: "moderate", goal: "gain",
  });
  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const canSubmit = form.name && form.age && form.height && form.weight;

  const fieldStyle = {
    width: "100%", background: t.bgElevated, border: `1px solid ${t.border}`, borderRadius: 10,
    padding: "11px 12px", color: t.ink, fontSize: 16, marginTop: 6,
  };
  const labelStyle = { fontSize: 12, fontWeight: 600, color: t.inkDim };

  return (
    <div style={{
      width: "100%", minHeight: "100dvh", background: t.bg, color: t.ink,
      fontFamily: "Inter, -apple-system, sans-serif", display: "flex", flexDirection: "column",
      padding: "max(28px, env(safe-area-inset-top)) 20px 32px",
    }}>
      <div style={{
        width: 52, height: 52, borderRadius: 14, background: t.turmericDim,
        display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16,
      }}>
        <Dumbbell size={24} color={t.turmeric} />
      </div>
      <div className="display" style={{ fontSize: 24, fontWeight: 800 }}>Set up your profile</div>
      <div style={{ fontSize: 13, color: t.inkDim, marginTop: 4, lineHeight: 1.5 }}>
        A few details so calorie and protein targets are calculated specifically for you.
      </div>

      <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 16 }}>
        <label>
          <div style={labelStyle}>Name</div>
          <input style={fieldStyle} value={form.name} onChange={e => update("name", e.target.value)} placeholder="Your name" />
        </label>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <label>
            <div style={labelStyle}>Age</div>
            <input style={fieldStyle} type="number" value={form.age} onChange={e => update("age", e.target.value)} placeholder="Years" />
          </label>
          <label>
            <div style={labelStyle}>Sex</div>
            <select style={fieldStyle} value={form.sex} onChange={e => update("sex", e.target.value)}>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </label>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <label>
            <div style={labelStyle}>Height (cm)</div>
            <input style={fieldStyle} type="number" value={form.height} onChange={e => update("height", e.target.value)} placeholder="e.g. 165" />
          </label>
          <label>
            <div style={labelStyle}>Weight (kg)</div>
            <input style={fieldStyle} type="number" value={form.weight} onChange={e => update("weight", e.target.value)} placeholder="e.g. 56" />
          </label>
        </div>

        <label>
          <div style={labelStyle}>Daily activity (outside the gym)</div>
          <select style={fieldStyle} value={form.activity} onChange={e => update("activity", e.target.value)}>
            <option value="sedentary">Mostly sitting (desk job)</option>
            <option value="moderate">Some walking/standing</option>
            <option value="active">On my feet most of the day</option>
          </select>
        </label>

        <label>
          <div style={labelStyle}>Primary goal</div>
          <select style={fieldStyle} value={form.goal} onChange={e => update("goal", e.target.value)}>
            <option value="gain">Build lean muscle (slight surplus)</option>
            <option value="maintain">Maintain current weight</option>
            <option value="lose">Lose fat (slight deficit)</option>
          </select>
        </label>
      </div>

      <button
        disabled={!canSubmit}
        onClick={() => onComplete(form)}
        style={{
          marginTop: 28, width: "100%", background: canSubmit ? t.turmeric : t.border, border: "none",
          borderRadius: 14, padding: "14px 0", fontSize: 15, fontWeight: 700,
          color: canSubmit ? "#241705" : t.inkFaint, display: "flex", alignItems: "center",
          justifyContent: "center", gap: 8, opacity: canSubmit ? 1 : 0.7,
        }}
      >
        Get started <ArrowRight size={16} />
      </button>

      <div style={{ fontSize: 11, color: t.inkFaint, marginTop: 14, textAlign: "center", lineHeight: 1.5 }}>
        This sets up your personal targets for this session — there's no password or account server yet,
        so this info isn't stored anywhere beyond your current visit.
      </div>
    </div>
  );
}

/* ============================================================
   DASHBOARD
   ============================================================ */
function Dashboard({ t, isDark, setIsDark, waterBottles, setWaterBottles, targets, consumed, remaining, streak, quote, todaysWorkoutDone, workoutProgressPct, setTab, profile }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName = profile?.name?.split(" ")[0];
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const calPct = Math.min(consumed.cal / targets.calories, 1);
  const proteinPct = Math.min(consumed.protein / targets.protein, 1);
  const waterPct = Math.min(waterBottles / targets.water, 1);
  const workoutPct = Math.min(workoutProgressPct / 100, 1);

  return (
    <div style={{ padding: "22px 18px 8px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div className="display" style={{ fontSize: 22, fontWeight: 800 }}>{greeting}{firstName ? `, ${firstName}` : ""}</div>
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

      {/* Ring cluster — 2x2 grid */}
      <Card t={t} style={{ marginTop: 16, padding: "20px 8px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", rowGap: 20, columnGap: 6 }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Ring pct={calPct} color={t.turmeric} track={t.turmericDim} size={92}>
              <div style={{ textAlign: "center" }}>
                <div className="mono" style={{ fontSize: 15, fontWeight: 700 }}>{remaining}</div>
                <div style={{ fontSize: 9, color: t.inkFaint }}>kcal left</div>
              </div>
            </Ring>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Ring pct={proteinPct} color={t.teal} track={t.tealDim} size={92}>
              <div style={{ textAlign: "center" }}>
                <div className="mono" style={{ fontSize: 15, fontWeight: 700 }}>{consumed.protein}g</div>
                <div style={{ fontSize: 9, color: t.inkFaint }}>protein</div>
              </div>
            </Ring>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Ring pct={waterPct} color={t.violet} track={isDark ? "#2A2540" : "#E7E3F7"} size={92}>
              <div style={{ textAlign: "center" }}>
                <div className="mono" style={{ fontSize: 15, fontWeight: 700 }}>{waterBottles}/{targets.water}</div>
                <div style={{ fontSize: 9, color: t.inkFaint }}>bottles</div>
              </div>
            </Ring>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Ring pct={workoutPct} color={t.coral} track={t.coralDim} size={92}>
              <div style={{ textAlign: "center" }}>
                <div className="mono" style={{ fontSize: 15, fontWeight: 700 }}>{Math.round(workoutProgressPct)}%</div>
                <div style={{ fontSize: 9, color: t.inkFaint }}>workout</div>
              </div>
            </Ring>
          </div>
        </div>
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
            <span style={{ fontSize: 13, fontWeight: 600 }}>Water intake (bottles)</span>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => setWaterBottles(c => Math.max(c - 1, 0))} style={{ width: 26, height: 26, borderRadius: 8, border: `1px solid ${t.border}`, background: t.bgElevated, color: t.ink }}>–</button>
            <button onClick={() => setWaterBottles(c => c + 1)} style={{ width: 26, height: 26, borderRadius: 8, border: `1px solid ${t.border}`, background: t.bgElevated, color: t.ink }}>+</button>
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
function WorkoutTab({ t, onLogWorkout, onProgress, exerciseHistory, setExerciseHistory }) {
  const [browseMode, setBrowseMode] = useState(null); // null | "schedule" | "category"
  const [pendingCategory, setPendingCategory] = useState(null); // category chosen, showing Session Overview
  const [expandedPreview, setExpandedPreview] = useState(null); // index expanded in Session Overview
  const [category, setCategory] = useState(null);
  const [session, setSession] = useState(null); // {exercises: [{name, sets:[{weight,reps,done}]}], elapsed}
  const [expandedExercise, setExpandedExercise] = useState(null); // index expanded during active session
  const [elapsed, setElapsed] = useState(0);
  const [resting, setResting] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [showLiveChart, setShowLiveChart] = useState(false);
  const intervalRef = useRef(null);
  const restRef = useRef(null);
  const prevRestingRef = useRef(0);

  const COACH_CUES = ["Keep your back straight.", "Engage your core.", "Slow down the lowering phase.", "Full range of motion.", "Control the weight, don't rush."];

  const speak = (text) => {
    if (!voiceEnabled || typeof window === "undefined" || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 1; u.pitch = 1;
      window.speechSynthesis.speak(u);
    } catch (e) { /* speech synthesis unavailable — fail silently */ }
  };

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

  useEffect(() => {
    if (resting === 0 && prevRestingRef.current > 0) {
      speak("Rest complete. Start your next set.");
    }
    prevRestingRef.current = resting;
  }, [resting]);

  useEffect(() => {
    if (session && onProgress) {
      const totalSets = session.exercises.reduce((a, e) => a + e.sets.length, 0);
      const doneSets = session.exercises.reduce((a, e) => a + e.sets.filter(s => s.done).length, 0);
      onProgress(totalSets ? Math.round((doneSets / totalSets) * 100) : 0);
    }
  }, [session]);

  const recordSetHistory = (name, weight, reps) => {
    const w = Number(weight) || 0, r = Number(reps) || 0;
    if (!w && !r) return;
    setExerciseHistory(h => {
      const prev = h[name] || {};
      const isNewPR = !prev.prWeight || w > prev.prWeight || (w === prev.prWeight && r > (prev.prReps || 0));
      return {
        ...h,
        [name]: {
          lastWeight: w, lastReps: r,
          prWeight: isNewPR ? w : prev.prWeight,
          prReps: isNewPR ? r : prev.prReps,
        },
      };
    });
  };

  const startSession = (cat) => {
    const exercises = EXERCISE_DB[cat].map(ex => ({
      name: ex.name, equip: ex.equip, target: ex.reps,
      sets: Array.from({ length: ex.sets }, () => ({ weight: "", reps: "", done: false })),
    }));
    setCategory(cat);
    setSession({ exercises });
    setElapsed(0);
    setExpandedExercise(null);
  };

  const toggleSet = (exIdx, setIdx) => {
    setSession(s => {
      const next = structuredClone(s);
      const set = next.exercises[exIdx].sets[setIdx];
      set.done = !set.done;
      if (set.done) {
        setResting(60);
        recordSetHistory(next.exercises[exIdx].name, set.weight, set.reps);
        const detail = getExerciseDetail(next.exercises[exIdx].name, category);
        const pool = [...COACH_CUES, ...(detail.tips || [])];
        speak(pool[Math.floor(Math.random() * pool.length)]);
      }
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
    onLogWorkout({ date: isoDate(0), category, volume: volume || 0, duration: Math.round(elapsed / 60) });
    if (onProgress) onProgress(100);
    setSession(null);
    setCategory(null);
    setElapsed(0);
  };

  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  /* ---------- Active session: guided logging with real-time coaching ---------- */
  if (session) {
    const totalSets = session.exercises.reduce((a, e) => a + e.sets.length, 0);
    const doneSets = session.exercises.reduce((a, e) => a + e.sets.filter(s => s.done).length, 0);
    const liveChartData = (() => {
      let cum = 0;
      const data = [{ set: "Start", volume: 0 }];
      session.exercises.forEach(ex => {
        ex.sets.forEach(s => {
          if (s.done) {
            cum += (Number(s.weight) || 0) * (Number(s.reps) || 0);
            data.push({ set: `${data.length}`, volume: cum });
          }
        });
      });
      return data;
    })();
    return (
      <div style={{ padding: "20px 18px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button onClick={() => { setSession(null); setCategory(null); }} style={{ background: "none", border: "none", color: t.inkDim, display: "flex", alignItems: "center", gap: 4 }}>
            <ChevronLeft size={18} /> Exit
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={() => setShowLiveChart(v => !v)} title="Live progress" style={{
              background: showLiveChart ? t.tealDim : "none", border: `1px solid ${showLiveChart ? t.teal : t.border}`,
              borderRadius: 8, padding: 5, display: "flex", alignItems: "center",
            }}>
              <TrendingUp size={14} color={showLiveChart ? t.teal : t.inkFaint} />
            </button>
            <button onClick={() => setVoiceEnabled(v => !v)} title="Voice coaching cues" style={{
              background: voiceEnabled ? t.turmericDim : "none", border: `1px solid ${voiceEnabled ? t.turmeric : t.border}`,
              borderRadius: 8, padding: 5, display: "flex", alignItems: "center",
            }}>
              {voiceEnabled ? <Volume2 size={14} color={t.turmeric} /> : <VolumeX size={14} color={t.inkFaint} />}
            </button>
            <div className="mono" style={{ fontSize: 15, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
              <Timer size={15} color={t.turmeric} /> {fmt(elapsed)}
            </div>
          </div>
        </div>
        <div className="display" style={{ fontSize: 20, fontWeight: 800, marginTop: 10 }}>{category} Session</div>
        <div style={{ fontSize: 12, color: t.inkFaint, marginTop: 2 }}>{doneSets}/{totalSets} sets complete{voiceEnabled ? " · voice coaching on" : ""}</div>

        {showLiveChart && (
          <Card t={t} style={{ marginTop: 12 }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: t.inkDim }}>Live volume this session (updates as you log sets)</div>
            <div style={{ height: 110, marginTop: 6 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={liveChartData}>
                  <CartesianGrid stroke={t.border} strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="set" tick={{ fontSize: 9, fill: t.inkFaint }} axisLine={{ stroke: t.border }} tickLine={false} />
                  <YAxis hide />
                  <Tooltip contentStyle={{ background: t.bgElevated, border: `1px solid ${t.border}`, borderRadius: 8, fontSize: 11 }} />
                  <Line type="monotone" dataKey="volume" stroke={t.teal} strokeWidth={2.5} dot={{ r: 3, fill: t.teal }} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}

        {resting > 0 && (
          <div style={{ marginTop: 12, background: t.coralDim, border: `1px solid ${t.coral}40`, borderRadius: 14, padding: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: t.coral }}>Rest — {resting}s</div>
            <button onClick={() => setResting(0)} style={{ background: "none", border: `1px solid ${t.coral}`, color: t.coral, borderRadius: 8, padding: "4px 10px", fontSize: 11, fontWeight: 600 }}>Skip</button>
          </div>
        )}

        <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 12 }}>
          {session.exercises.map((ex, exIdx) => {
            const detail = getExerciseDetail(ex.name, category);
            const isInfoOpen = expandedExercise === exIdx;
            return (
              <Card key={ex.name} t={t}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{ex.name}</div>
                    <div style={{ fontSize: 11, color: t.inkFaint, marginTop: 2 }}>{ex.equip} · target {ex.target}</div>
                  </div>
                  <button onClick={() => setExpandedExercise(isInfoOpen ? null : exIdx)} style={{
                    flexShrink: 0, display: "flex", alignItems: "center", gap: 4, background: isInfoOpen ? t.turmericDim : "none",
                    border: `1px solid ${isInfoOpen ? t.turmeric : t.border}`, borderRadius: 8, padding: "4px 9px",
                    color: isInfoOpen ? t.turmeric : t.inkDim, fontSize: 10.5, fontWeight: 600,
                  }}>
                    <Info size={11} /> Info
                  </button>
                </div>

                {isInfoOpen && <ExerciseDetailBlock t={t} name={ex.name} category={category} history={exerciseHistory} />}

                <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                  {ex.sets.map((set, setIdx) => (
                    <div key={setIdx} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ width: 16, fontSize: 11, color: t.inkFaint }}>{setIdx + 1}</span>
                      <input placeholder="kg" value={set.weight} onChange={e => updateSet(exIdx, setIdx, "weight", e.target.value)}
                        style={{ width: 58, background: t.bgElevated, border: `1px solid ${t.border}`, borderRadius: 8, padding: "6px 6px", color: t.ink, fontSize: 16, textAlign: "center" }} />
                      <input placeholder="reps" value={set.reps} onChange={e => updateSet(exIdx, setIdx, "reps", e.target.value)}
                        style={{ width: 58, background: t.bgElevated, border: `1px solid ${t.border}`, borderRadius: 8, padding: "6px 6px", color: t.ink, fontSize: 16, textAlign: "center" }} />
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
            );
          })}
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

  /* ---------- Session Overview: exercise preview before starting ---------- */
  if (pendingCategory) {
    const list = EXERCISE_DB[pendingCategory];
    return (
      <div style={{ padding: "20px 18px" }}>
        <button onClick={() => { setPendingCategory(null); setExpandedPreview(null); }} style={{ background: "none", border: "none", color: t.inkDim, display: "flex", alignItems: "center", gap: 4, marginBottom: 10 }}>
          <ChevronLeft size={18} /> Back
        </button>
        <div className="display" style={{ fontSize: 20, fontWeight: 800 }}>{pendingCategory} Session</div>
        <div style={{ fontSize: 13, color: t.inkDim, marginTop: 2 }}>
          Review each exercise before you begin — tap any card for muscles worked, technique, and coaching notes.
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
          {list.map((ex, i) => {
            const detail = getExerciseDetail(ex.name, pendingCategory);
            const isOpen = expandedPreview === i;
            return (
              <Card key={ex.name} t={t}>
                <div onClick={() => setExpandedPreview(isOpen ? null : i)} style={{ cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{ex.name}</div>
                    <div style={{ fontSize: 11, color: t.inkFaint, marginTop: 2 }}>{ex.equip} · {ex.sets} sets × {ex.reps}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                    <Pill color={t.turmeric} bg={t.turmericDim}>{detail.difficulty}</Pill>
                    <ChevronDown size={16} color={t.inkFaint} style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                  </div>
                </div>
                {isOpen && <ExerciseDetailBlock t={t} name={ex.name} category={pendingCategory} history={exerciseHistory} />}
              </Card>
            );
          })}
        </div>

        <button onClick={() => { startSession(pendingCategory); setPendingCategory(null); setExpandedPreview(null); }} style={{
          width: "100%", marginTop: 18, background: t.turmeric, border: "none", borderRadius: 14,
          padding: "14px 0", fontSize: 14, fontWeight: 700, color: "#241705",
        }}>
          Begin Workout
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
        <div style={{ fontSize: 13, color: t.inkDim, marginTop: 2 }}>Each day of the week has a recommended session — tap today's entry to preview it.</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
          {WEEKLY_SCHEDULE.map(({ day, session: sessionType, description }) => {
            const Icon = CATEGORY_ICON[sessionType];
            const isToday = day === TODAY_NAME;
            return (
              <Card key={day} t={t} onClick={() => setPendingCategory(sessionType)} style={{
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
              <Card key={cat} t={t} onClick={() => setPendingCategory(cat)} style={{ cursor: "pointer" }}>
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
                See the recommended session for each day of the week, from Monday through Sunday, and preview today's session before you begin.
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
              <div style={{ fontSize: 11, fontWeight: 600, color: t.inkDim, marginBottom: 4 }}>Meal name</div>
              <input placeholder="e.g. Grilled chicken bowl" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                style={{ width: "100%", background: t.bgElevated, border: `1px solid ${t.border}`, borderRadius: 8, padding: "10px 10px", color: t.ink, fontSize: 16, marginBottom: 12 }} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[
                  { key: "cal", label: "Calories (kcal)" },
                  { key: "protein", label: "Protein (g)" },
                  { key: "carbs", label: "Carbs (g)" },
                  { key: "fat", label: "Fat (g)" },
                ].map(f => (
                  <div key={f.key}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: t.inkDim, marginBottom: 4 }}>{f.label}</div>
                    <input
                      inputMode="numeric" placeholder="0" value={form[f.key]}
                      onChange={e => setForm(fm => ({ ...fm, [f.key]: e.target.value }))}
                      style={{
                        width: "100%", background: t.bgElevated, border: `1px solid ${t.border}`,
                        borderRadius: 8, padding: "10px 10px", color: t.ink, fontSize: 16, textAlign: "left",
                      }}
                    />
                  </div>
                ))}
              </div>
              <button onClick={addMeal} style={{ width: "100%", marginTop: 14, background: t.teal, border: "none", borderRadius: 10, padding: "10px 0", fontSize: 13, fontWeight: 700, color: "#06201C" }}>Save meal</button>
            </Card>
          )}

          <div style={{ fontSize: 11, color: t.inkFaint, marginTop: 10 }}>Swipe a meal left to delete it.</div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
            {meals.map((m, i) => (
              <SwipeableRow key={`${m.name}-${m.time}-${i}`} t={t} onDelete={() => setMeals(ms => ms.filter((_, idx) => idx !== i))}>
                <Card t={t} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 12, background: t.bgCard }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{m.name}</div>
                    <div style={{ fontSize: 11, color: t.inkFaint }}>{m.time} · P{m.protein} C{m.carbs} F{m.fat}</div>
                  </div>
                  <div className="mono" style={{ fontSize: 13, fontWeight: 700, color: t.turmeric, flexShrink: 0, marginLeft: 10 }}>{m.cal} kcal</div>
                </Card>
              </SwipeableRow>
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

  const loggedDates = useMemo(() => new Set(workoutLogHistory.map(w => w.date)), [workoutLogHistory]);
  const consistencyData = useMemo(() => Array.from({ length: 14 }, (_, i) => {
    const offset = -(13 - i);
    const iso = isoDate(offset);
    return { label: shortDateLabel(iso), worked: loggedDates.has(iso) ? 1 : 0 };
  }), [loggedDates]);

  return (
    <div style={{ padding: "20px 18px" }}>
      <div className="display" style={{ fontSize: 20, fontWeight: 800 }}>Progress</div>
      <div style={{ fontSize: 13, color: t.inkDim, marginTop: 2 }}>Trends over the last 2 weeks</div>

      <div style={{ marginTop: 16 }}>
        <WorkoutCalendar t={t} workoutLogHistory={workoutLogHistory} />
      </div>

      <Card t={t} style={{ marginTop: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 700 }}>Training consistency (last 14 days)</div>
        <div style={{ height: 110, marginTop: 6 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={consistencyData}>
              <CartesianGrid stroke={t.border} strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 8, fill: t.inkFaint }} axisLine={{ stroke: t.border }} tickLine={false} interval={1} />
              <YAxis hide domain={[0, 1]} />
              <Tooltip contentStyle={{ background: t.bgElevated, border: `1px solid ${t.border}`, borderRadius: 8, fontSize: 11 }}
                formatter={(v) => [v ? "Trained" : "Missed", ""]} />
              <Bar dataKey="worked" radius={[4, 4, 4, 4]}>
                {consistencyData.map((d, i) => <Cell key={i} fill={d.worked ? t.teal : t.coral} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card t={t} style={{ marginTop: 12 }}>
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
            <BarChart data={workoutLogHistory.map(w => ({ ...w, label: shortDateLabel(w.date) }))}>
              <CartesianGrid stroke={t.border} strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 8, fill: t.inkFaint }} axisLine={{ stroke: t.border }} tickLine={false} />
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
function SettingsTab({ t, isDark, setIsDark, targets, setTargets, profile, onEditProfile }) {
  const [local, setLocal] = useState(targets);
  return (
    <div style={{ padding: "20px 18px" }}>
      <div className="display" style={{ fontSize: 20, fontWeight: 800 }}>Settings</div>

      <Card t={t} style={{ marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: 999, background: t.turmericDim, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <User size={17} color={t.turmeric} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700 }}>{profile?.name || "Your profile"}</div>
            <div style={{ fontSize: 11, color: t.inkFaint }}>{profile?.age}y · {profile?.height}cm · {profile?.weight}kg</div>
          </div>
        </div>
        <button onClick={onEditProfile} style={{
          background: t.bgElevated, border: `1px solid ${t.border}`, borderRadius: 10, padding: "6px 12px",
          fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", gap: 5, color: t.ink,
        }}>
          <LogOut size={12} /> Edit
        </button>
      </Card>

      <Card t={t} style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
          { key: "water", label: "Water (bottles)" },
        ].map(f => (
          <div key={f.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: t.inkDim }}>{f.label}</span>
            <input type="number" value={local[f.key]} onChange={e => setLocal(l => ({ ...l, [f.key]: Number(e.target.value) }))}
              style={{ width: 84, background: t.bgElevated, border: `1px solid ${t.border}`, borderRadius: 8, padding: "8px 8px", color: t.ink, fontSize: 16, textAlign: "right" }} />
          </div>
        ))}
        <button onClick={() => setTargets(local)} style={{
          width: "100%", marginTop: 6, background: t.turmeric, border: "none", borderRadius: 10,
          padding: "9px 0", fontSize: 12, fontWeight: 700, color: "#241705",
        }}>Save targets</button>
      </Card>

      <div style={{ marginTop: 16, fontSize: 11, color: t.inkFaint, lineHeight: 1.6, textAlign: "center" }}>
        Prototype build · data resets on refresh (no account server yet).<br />
        Native version with Apple Health sync requires Xcode on a Mac.
      </div>
    </div>
  );
}
