export function updateClass(classList: DOMTokenList, classes: any) {
  for (let [key, value] of Object.entries(classes)) {
    if (value) {
      classList.add(key);
    } else {
      classList.remove(key);
    }
  }
}