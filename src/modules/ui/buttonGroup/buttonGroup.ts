import { LightningElement, api } from 'lwc';

const VARIANT_DEFAULT = 'default';
const DEFAULT_VARIANT = VARIANT_DEFAULT;

export default class ButtonGroup extends LightningElement {
  @api variant: string = DEFAULT_VARIANT;
  @api block: boolean = false;

  get computedClass() {
    return `variant-${this.variant}`;
  }

  renderedCallback() {
    if (this.block) {
      this.template.host.classList.add('block');
    }
  }

  handleSlotChange(e: Event) {
    const slot = this.template.childNodes[1] as HTMLSlotElement;
    const slotElements = slot.assignedElements();
    slotElements.forEach(element => {
      element.dispatchEvent(new CustomEvent('slot', {
        detail: {
          component: 'buttonGroup',
          name: null,
          variant: this.variant
        }
      }));
      if (this.block) {
        (element as any).block = true;
      }
    });
  }

}
