// These can be changed per case directly in the function call
export const lighthouseThreshold = {
  performance: 70,
  accessibility: 90,
  "best-practices": 85,
  pwa: 60,
  seo: 85
};

export const lighthouseConfig = {
  formFactor: "desktop",
  screenEmulation: {
    mobile: false,
    disabled: true
  }
};
