import { MetricConfig } from "./types";

export const METRICS_CONFIG: MetricConfig[] = [
  {
    key: "first_contentful_paint",
    name: "First Contentful Paint (FCP)",
    goodThreshold: 1800,
    needsImprovementThreshold: 3000,
    unit: "ms",
    description: "Time for first text/image to render",
    shorthand: "FCP",
  },
  {
    key: "largest_contentful_paint",
    name: "Largest Contentful Paint (LCP)",
    goodThreshold: 2500,
    needsImprovementThreshold: 4000,
    unit: "ms",
    description: "Time for largest content element to render",
    shorthand: "LCP",
  },
  {
    key: "cumulative_layout_shift",
    name: "Cumulative Layout Shift (CLS)",
    goodThreshold: 0.1,
    needsImprovementThreshold: 0.25,
    unit: "",
    description: "Visual stability during page load",
    shorthand: "CLS",
  },
  {
    key: "interaction_to_next_paint",
    name: "Interaction to Next Paint (INP)",
    goodThreshold: 200,
    needsImprovementThreshold: 500,
    unit: "ms",
    description: "Responsiveness to user interactions",
    shorthand: "INP",
  },
  {
    key: "experimental_time_to_first_byte",
    name: "Time to First Byte (TTFB)",
    goodThreshold: 800,
    needsImprovementThreshold: 1800,
    unit: "ms",
    description: "Time until first byte from server",
    shorthand: "TTFB",
  },
];
