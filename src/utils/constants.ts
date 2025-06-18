export const USE_CASES = [
  'Interior Design',
  'Architecture', 
  'Construction',
  'Event Design'
] as const;

export const BASE_HIGHLIGHTS: Record<string, string[]> = {
  'Interior Design': [
    'Open layout with multifunctional zones',
    'Use of neutral tones and natural textures',
    'Integrated lighting for cozy ambiance',
    'Smart storage solutions',
    'Personalized aesthetic accents'
  ],
  'Architecture': [
    'Energy-efficient building massing',
    'Form inspired by regional context',
    'Optimized window-to-wall ratio',
    'Material palette tailored for climate',
    'Structural clarity and balance'
  ],
  'Construction': [
    'Prefabricated components for speed',
    'Collaborative stakeholder views',
    'Lean material usage',
    'Accessible site logistics',
    'Compliance with local safety norms'
  ],
  'Event Design': [
    'Dynamic stage arrangement',
    'Immersive lighting effects',
    'Thematic seating layouts',
    'Zoning for crowd flow',
    'Decor aligned with brand identity'
  ]
};

export const DESIGN_STYLES = [
  'Modern Twist', 
  'Minimal Elegance', 
  'Sustainable Form', 
  'Conceptual Flow', 
  'Futuristic Touch'
] as const;

export {}