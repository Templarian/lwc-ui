export function updateClass(classList: DOMTokenList, classes: any) {
  for (let [key, value] of Object.entries(classes)) {
    if (value) {
      classList.add(key);
    } else {
      classList.remove(key);
    }
  }
}

export function inArrayOrDefault<T>(value: T, array: T[], defaultValue: T) {
  return array.includes(value) ? value : defaultValue;
}

export function updateVariant(name: string, classList: DOMTokenList, variant: string, variants: string[]) {
  const vars = variants.reduce<object>((acc: object, v: string) => {
    const cls = `${name}-variant-${v}`;
    return { ...acc, [cls]: v === variant };
  }, {});
  updateClass(classList, vars);
}