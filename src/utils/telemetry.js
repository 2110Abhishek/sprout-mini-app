export const trackEvent = (eventName, data = {}) => {
  // In a real application, this would send data to Amplitude, Mixpanel, or PostHog
  // Since we have no data, this silent logger helps us see exactly where kids drop off
  console.log(`[Telemetry] 📊 ${eventName}`, data);
};
