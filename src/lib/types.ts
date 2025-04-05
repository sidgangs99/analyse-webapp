export type MetricConfig = {
  key: string;
  name: string;
  goodThreshold: number;
  needsImprovementThreshold: number;
  unit: string;
  description: string;
  shorthand: string;
};

export type UrlData = {
  url: string;
  data: any;
  error: string | null;
};

export type FilterOptions = {
  fastFCP: boolean;
  fastLCP: boolean;
  goodCLS: boolean;
  fastINP: boolean;
  fastTTFB: boolean;
};
