const CHEMICALS = {
    // --- BASIC SOLVENTS ---
    "water": { name: "Apă (H2O)", formula: "H2O", color: "#a2d9ff", state: "liquid", tags: ["solvent", "neutral"], ph: 7 },
    "oil": { name: "Ulei", formula: "Org", color: "#ffeaa7", state: "liquid", tags: ["flammable", "hydrophobic"], flash_point: 300 },
    "ethanol": { name: "Etanol", formula: "C2H5OH", color: "#ecf0f1", state: "liquid", tags: ["flammable", "solvent", "volatile"], flash_point: 80 },

    // --- ACIDS ---
    "hcl": { name: "Acid Clorhidric", formula: "HCl", color: "#ffffcc", state: "liquid", tags: ["acid", "corrosive"], ph: 1 },
    "h2so4": { name: "Acid Sulfuric", formula: "H2SO4", color: "#e3e3e3", state: "liquid", tags: ["acid", "strong_oxidizer"], ph: 0.5 },
    "vinegar": { name: "Oțet (Acid Acetic)", formula: "CH3COOH", color: "#e1b12c", state: "liquid", tags: ["acid", "weak"], ph: 3 },

    // --- BASES ---
    "naoh": { name: "Hidroxid de Sodiu", formula: "NaOH", color: "#ffffff", state: "solid", tags: ["base", "caustic"], ph: 14 },
    "baking_soda": { name: "Bicarbonat (Praf de copt)", formula: "NaHCO3", color: "#ffffff", state: "powder", tags: ["base", "weak"], ph: 9 },
    "ammonia": { name: "Amoniac", formula: "NH3", color: "#dfe6e9", state: "gas", tags: ["base", "pungent"], ph: 11 },

    // --- METALS ---
    "sodium": { name: "Sodiu Metalic", formula: "Na", color: "#b2bec3", state: "solid", tags: ["metal", "reactive_water"] },
    "magnesium": { name: "Magneziu", formula: "Mg", color: "#636e72", state: "solid", tags: ["metal", "flammable"] },
    "iron": { name: "Fier (Pilitură)", formula: "Fe", color: "#2d3436", state: "powder", tags: ["metal"] },
    "sulfur": { name: "Sulf", formula: "S", color: "#f1c40f", state: "powder", tags: ["flammable"] },

    // --- ORGANICS / POLYMER PRECURSORS ---
    "eten": { name: "Etenă", formula: "C2H4", color: "#dfe6e9", state: "gas", tags: ["monomer", "flammable"] },
    "cloropren": { name: "Cloropren", formula: "C4H5Cl", color: "#fab1a0", state: "liquid", tags: ["monomer", "toxic"] },
    "izobutena": { name: "Izobutenă", formula: "C4H8", color: "#dfe6e9", state: "gas", tags: ["monomer"] },
    "methane": { name: "Metan", formula: "CH4", color: "#ffffff00", state: "gas", tags: ["flammable", "gas"] },

    // --- INDICATORS & DYES ---
    "litmus": { name: "Litmus (Indicator)", formula: "Ind", color: "#6c5ce7", state: "liquid", tags: ["indicator"] },
    "food_dye_red": { name: "Colorant Roșu", formula: "DyeR", color: "#ff0000", state: "liquid", tags: ["dye"] },
    "food_dye_green": { name: "Colorant Verde", formula: "DyeG", color: "#00ff00", state: "liquid", tags: ["dye"] },

    // --- COMPLEX ---
    "bleach": { name: "Înălbitor (NaClO)", formula: "NaClO", color: "#fdcb6e", state: "liquid", tags: ["base", "oxidizer"], ph: 12 },
    "sugar": { name: "Zahăr", formula: "C12H22O11", color: "#ffffff", state: "solid", tags: ["carbohydrate", "flammable"] },

    // --- HIDDEN RESULTS ---
    "salt_water": { name: "Apă Sărată", formula: "NaCl(aq)", color: "#a2d9ff", state: "liquid" },
    "ash": { name: "Cenușă", formula: "C", color: "#2d3436", state: "solid" },
    "polietena": { name: "Polietena (PE)", formula: "(C2H4)n", color: "#ecf0f1", state: "solid", tags: ["plastic"] },
    "neopren": { name: "Neopren", formula: "(C4H5Cl)n", color: "#2d3436", state: "solid", tags: ["rubber"] },
    "polizobutena": { name: "Polizobutena", formula: "(C4H8)n", color: "#ffeaa7", state: "liquid", tags: ["sticky"] },
    "lava": { name: "Substanță Necunoscută (Topit)", formula: "???", color: "#e17055", state: "liquid", tags: ["hot"] },
    "carbon": { name: "Carbon (Ars)", formula: "C", color: "#000000", state: "solid" },
    "chlorine": { name: "Gaz Clor (Toxic!)", formula: "Cl2", color: "#55efc4", state: "gas", tags: ["toxic", "gas"] },
    "hydrogen": { name: "Hidrogen", formula: "H2", color: "#ffffff00", state: "gas", tags: ["explosive", "gas"] }
};

const RECIPES = [
    // --- CLASSIC RECIPES (Hardcoded overrides) ---
    { inputs: ["eten"], conditions: { heat: true }, output: "polietena", message: "Polimerizare reușită: Ai obținut Polietena!", visual_type: 'smoke' },
    { inputs: ["cloropren"], conditions: { heat: false }, output: "neopren", message: "Polimerizare reușită: Neopren creat!", visual_type: 'bubbles' },
    { inputs: ["izobutena"], conditions: { heat: false }, output: "polizobutena", message: "A rezultat Polizobutena vâscoasă.", visual_type: 'bubbles' },
];

const EXPERIMENTS = [
    { id: "pe", name: "Sinteză Polietena", inputs: ["eten"], conditions: { heat: true }, output: "polietena", message: "Polietena sintetizată!", visual_type: 'smoke' },
    { id: "neopren", name: "Sinteză Neopren", inputs: ["cloropren"], conditions: { heat: false }, output: "neopren", message: "Neopren obținut!", visual_type: 'bubbles' },
    { id: "methane_fire", name: "Arderea Metanului", inputs: ["methane"], conditions: { heat: true }, output: "ash", message: "Combustie completă!", visual_type: 'fire' },
    { id: "hydrogen_boom", name: "Explozie Hidrogen", inputs: ["hydrogen"], conditions: { heat: true }, output: "water", message: "BOOM! Hidrogenul a explodat.", visual_type: 'explosion' }
];
