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
}

// Error: https://github.com/Microsoft/TypeScript/issues/28357
export const handleSlotClass = function(event: CustomEvent<Slot>) {
    const { target, detail: slot } = event;
    const iconElement = target as Element;
    const slotName = slot.name ? `-${slot.name}` : '';
    updateClass(iconElement.classList, {
        [`${slot.component}-variant-${slot.variant}`]: true,
        [`${slot.component}-slot${slotName}`]: true
    });
} as EventListener;
