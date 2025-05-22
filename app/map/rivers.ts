import { RiverInfo } from "../gauges";

export const rivers: Record<string, RiverInfo> = {
    "Lochsa - Fish Creek to Split Creek": {
        number: "loci1",
        name: "Lochsa - Fish Creek to Split Creek",
        description: "Length: 12 miles.",
        min: 1200,
        max: 25000,
        awLink:
            "https://www.americanwhitewater.org/content/River/view/river-detail/570/main"
    },
    "S. Payette - Staircase": {
        name: "S. Payette - Staircase",
        number: "13247500",
        description: "<b>Gauge is for Upper Main Payette, not Staircase. Estimation can by done by subtracting the NF Payette at Banks from the Main Fork at Horseshoe Bend.</b> <br>Length: 5 miles.",
        min: 800,
        max: 12000,
        awLink:
            "https://www.americanwhitewater.org/content/River/view/river-detail/4360/main",
        display: true,
    },
    "Payette - Upper Main": {
        name: "Payette - Upper Main",
        number: "13247500",
        description: "Length: 7 miles.",
        min: 800,
        max: 12000,
        awLink:
            "https://www.americanwhitewater.org/content/River/view/river-detail/4360/main",
        display: true,
    }
}