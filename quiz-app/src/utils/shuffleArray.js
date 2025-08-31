// utils/shuffleArray.js
export function shuffleArray(array) {
  return array
    .map((item) => ({ value: item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map((obj) => obj.value);
}
