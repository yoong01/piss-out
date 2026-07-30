export const fonts = {
  display: 'NicoMoji-Regular',
  body: 'Chivo-Regular',
  bodyBold: 'Chivo-Bold',
  bodyBlack: 'Chivo-Black',
};

export const fontAssets = {
  'NicoMoji-Regular': require('../../assets/fonts/NicoMoji-Regular.ttf'),
  'Chivo-Regular': require('../../assets/fonts/Chivo-Regular.ttf'),
  'Chivo-Bold': require('../../assets/fonts/Chivo-Bold.ttf'),
  'Chivo-Black': require('../../assets/fonts/Chivo-Black.ttf'),
};

/** Design spec uses -0.04em tracking throughout; convert to px per font size. */
export function tracking(fontSize: number): number {
  return fontSize * -0.04;
}
