// Colors sampled directly from the uploaded Pedal app icon
// so every screen matches the real brand mark exactly.
export const colors = {
  brandGreen: '#7ED957',      // icon background
  brandGreenDark: '#008646',  // icon border / accents
  brandGreenDeep: '#0B4D2C',  // headings on light bg, pressed states
  ink: '#14251B',             // primary text
  inkMuted: '#5B6B62',        // secondary text
  surface: '#FFFFFF',
  surfaceMuted: '#F3F7F4',
  border: '#E1E9E3',
  warning: '#B45309',
  danger: '#C0392B',
  white: '#FFFFFF',
};

export const radii = { sm: 8, md: 14, lg: 22, pill: 999 };

export const spacing = (n) => n * 4;

export const shadow = {
  shadowColor: '#0B4D2C',
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.08,
  shadowRadius: 8,
  elevation: 3,
};
