export const roundToTwoDecimals = (number: number | string) => {
  const num = typeof number === 'string' ? parseFloat(number) : number;
  return Math.round(num * 100) / 100;
};
