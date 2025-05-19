export interface RiverInfo {
  number: string;
  name: string;
  description: string;
  min: number;
  max: number;
  awLink: string;
  isUsgs?: boolean;
  display?: boolean;
}

export const defaultGauges: RiverInfo[] = [
  {
    number: "NFEC1",
    name: "N. Feather - Rock Creek",
    description: "",
    min: 400,
    max: 2000,
    awLink:
      "https://www.americanwhitewater.org/content/River/view/river-detail/196/main",

    display: true,
  },
  {
    number: "TRRN2",
    name: "Truckee - Reno",
    description: "",
    min: 300,
    max: 6000,
    awLink:
      "https://www.americanwhitewater.org/content/River/view/river-detail/322/main",

    display: true,
  },
  {
    number: "FARC1",
    name: "Truckee - Farad",
    description: "",
    min: 300,
    max: 6000,
    awLink:
      "https://www.americanwhitewater.org/content/River/view/river-detail/322/main",

    display: true,
  },
  {
    number: "NFDC1",
    name: "N. American - Chamberlain",
    description: "",
    min: 300,
    max: 10000,
    awLink:
      "https://www.americanwhitewater.org/content/River/view/river-detail/139/main",

    display: true,
  },
  {
    number: "cbac1",
    name: "S. American - Chili Bar",
    description: "",
    min: 800,
    max: 20000,
    awLink:
      "https://www.americanwhitewater.org/content/River/view/river-detail/148/main",
  },
  {
    number: "JNSC1",
    name: "S. Yuba - E to P",
    description: "",
    min: 400,
    max: 3000,
    awLink:
      "https://www.americanwhitewater.org/content/River/view/river-detail/3232/main",
  },
  {
    number: "GYRC1",
    name: "N. Yuba - Goodyears Bar",
    description: "",
    min: 800,
    max: 5000,
    awLink:
      "https://www.americanwhitewater.org/content/River/view/river-detail/340/main",
  },
  {
    number: "SEIC1",
    name: "Klamath - Happy Camp",
    description: "",
    min: 700,
    max: 8000,
    awLink:
      "https://www.americanwhitewater.org/content/River/view/river-detail/234/main",

    display: true,
  },
  {
    number: "FTSC1",
    name: "Eel - Fort Seward",
    description: "",
    min: 500,
    max: 10000,
    awLink:
      "https://www.americanwhitewater.org/content/River/view/river-detail/183/main",

    display: true,
  },
  {
    number: "11355010",
    name: "Pit 1",
    description: "",
    min: 600,
    max: 3000,
    awLink:
      "https://www.americanwhitewater.org/content/River/view/river-detail/6799/main",

    isUsgs: true,
    display: true,
  },
  {
    number: "SBRC1",
    name: "Cal Salmon",
    description: "",
    min: 1200,
    max: 4500,
    awLink:
      "https://www.americanwhitewater.org/content/River/view/river-detail/11391/main",

    display: true,
  },
  {
    number: "11527000",
    name: "Trinity",
    description: "",
    min: 500,
    max: 40000,
    awLink:
      "https://www.americanwhitewater.org/content/River/view/river-detail/316/main",

    isUsgs: true,
    display: true,
  },
  {
    number: "loci1",
    name: "Lochsa",
    description: "",
    min: 1200,
    max: 25000,
    awLink:
      "https://www.americanwhitewater.org/content/River/view/river-detail/570/main",

    display: true,
  },
  {
    number: "13247500",
    name: "Payette - Upper Main",
    description: "",
    min: 800,
    max: 12000,
    awLink:
      "https://www.americanwhitewater.org/content/River/view/river-detail/4360/main",
    display: true,
  },
];
