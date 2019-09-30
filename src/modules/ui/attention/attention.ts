import { LightningElement, api } from 'lwc';
import { updateClass } from 'ui/util';

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
    this._variant = variant;
    this.updateHostClass();
  }

  connectedCallback() {
    this.updateHostClass();
  }

  handleLeftSlotChange(e: Event) {
    const leftSlot = this.template.childNodes[1] as HTMLSlotElement;
    const leftSlotElements = leftSlot.assignedElements();
    leftSlotElements.forEach(element => {
      element.dispatchEvent(new CustomEvent('slot', {
        detail: {
          component: 'attention',
          name: 'left',
          variant: this.variant
        }
      }));
    });
  }

  handleRightSlotChange(e: Event) {
    const rightSlot = this.template.childNodes[3] as HTMLSlotElement;
    const rightSlotElements = rightSlot.assignedElements();
    rightSlotElements.forEach(element => {
      element.dispatchEvent(new CustomEvent('slot', {
        detail: {
          component: 'attention',
          name: 'right',
          variant: this.variant
        }
      }));
    });
  }

  updateHostClass() {
    const variants = VARIANTS.reduce<object>((acc: object, variant: string) => {
      const cls = `attention-variant-${variant}`;
      return { ...acc, [cls]: variant === this._variant };
    }, {});
    updateClass(this.template.host.classList, variants);
  }

}