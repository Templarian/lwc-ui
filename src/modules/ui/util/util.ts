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

export function updateVariant(
  classList: DOMTokenList,
  variant: string,
  variants: string[]
) {
  const vars = variants.reduce<object>((acc: object, v: string) => {
    const cls = `variant-${v}`;
    return { ...acc, [cls]: v === variant };
  }, {});
  updateClass(classList, vars);
}

interface Slot {
  component: string;
  name: string | null;
  variant: string | null;
  first?: boolean | null;
  last?: boolean | null;
}

// Error: https://github.com/Microsoft/TypeScript/issues/28357
export const handleSlot = function(event: CustomEvent<Slot>) {
  const { target, detail: slot } = event;
  const iconElement = target as Element;
  const slotName = slot.name ? `-${slot.name}` : '';
  updateClass(iconElement.classList, {
    [`${slot.component}-variant-${slot.variant}`]: true,
    [`${slot.component}-slot${slotName}`]: true
  });
} as EventListener;

export const handleSlotParentClass = function(element: Element) {
  return function(event: CustomEvent<Slot>) {
    const { detail: slot } = event;
    const slotName = slot.name ? `-${slot.name}` : '';
    updateClass(element.classList, {
      [`${slot.component}-variant-${slot.variant}`]: true,
      [`${slot.component}-slot${slotName}`]: true,
      first: slot.first,
      last: slot.last
    });
  } as EventListener;
};

export function dispatchSlot(element: Element, detail: Slot) {
  element.dispatchEvent(new CustomEvent('slot', { detail }));
}

export function dispatchParent<T>(element: Element | HTMLElement, detail: T) {
  element.dispatchEvent(
    new CustomEvent('parent', {
      detail,
      composed: true,
      bubbles: true
    })
  );
}

export function normalizeString(
  value,
  { fallbackValue = '', possibleValues = [] }
) {
  const normalizeValue =
    typeof value === 'number' || value ? value.toString() : fallbackValue;
  const values = [fallbackValue, ...possibleValues];
  if (values.includes(normalizeValue)) {
    return normalizeValue;
  }
  return fallbackValue;
}

let id = 1;

export function getUniqueId() {
  return `${id++}`;
}
