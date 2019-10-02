import { LightningElement, api } from 'lwc';
import { updateVariant, inArrayOrDefault, dispatchSlot } from 'ui/util';

const COMPONENT: string = 'attention';
const VARIANTS: string[] = [
    'default',
    'primary',
    'success',
    'danger',
    'warning',
    'info'
];
const DEFAULT_VARIANT = VARIANTS[0];

export default class Attention extends LightningElement {
    _variant: string = DEFAULT_VARIANT;
    @api
    get variant() {
        return this._variant;
    }
    set variant(variant) {
        this._variant = inArrayOrDefault(variant, VARIANTS, DEFAULT_VARIANT);
        updateVariant(this.template.host.classList, this._variant, VARIANTS);
    }

    connectedCallback() {
        if (this._variant === DEFAULT_VARIANT) {
            updateVariant(
                this.template.host.classList,
                this._variant,
                VARIANTS
            );
        }
    }

    handleLeftSlotChange() {
        const leftSlot = this.template.childNodes[1] as HTMLSlotElement;
        const leftSlotElements = leftSlot.assignedElements();
        leftSlotElements.forEach(element => {
            dispatchSlot(element, {
                component: COMPONENT,
                name: 'left',
                variant: this.variant
            });
        });
    }

    handleRightSlotChange() {
        const rightSlot = this.template.childNodes[3] as HTMLSlotElement;
        const rightSlotElements = rightSlot.assignedElements();
        rightSlotElements.forEach(element => {
            dispatchSlot(element, {
                component: COMPONENT,
                name: 'right',
                variant: this.variant
            });
        });
    }
}
