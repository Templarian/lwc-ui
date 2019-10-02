import { LightningElement, api } from 'lwc';
import { dispatchSlot } from 'ui/util';

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

  handleSlotChange() {
    const slot = this.template.childNodes[1] as HTMLSlotElement;
    const slotElements = slot.assignedElements();
    slotElements.forEach((element, i) => {
      dispatchSlot(element, {
        component: 'buttonGroup',
        name: null,
        variant: this.variant,
        first: i === 0,
        last: i === slotElements.length - 1
      });
      if (this.block) {
        (element as any).block = true;
      }
    });
  }

}
