const HeadColors = [
  '#f7f7f5',
  '#dddddd',
  '#fdffd0',
  '#eccaa5',
]

const PatchColors = [
  '#ffab25',
  '#af7f51',
  '#4b4138',
  '#d2a36d',
  '#84756e',
  '#a65611',
  '#86756e',
]

export const OutlineColor = '#86756e';
export const OutlineProgressColor = '#530f00';

export const getRandomHeadColor = () => {
  const colorIndex = Math.floor((Math.random() * HeadColors.length) + 1);
  return HeadColors[colorIndex];
}

export const getRandomPatchColor = (): string => {
  const colorIndex = Math.floor((Math.random() * PatchColors.length) + 1);
  return PatchColors[colorIndex];
}

