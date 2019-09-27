import { LightningElement, api } from 'lwc';

const VARIANT_DEFAULT = 'default';
const DEFAULT_VARIANT = VARIANT_DEFAULT;

export default class Menu extends LightningElement {

  @api variant = DEFAULT_VARIANT;

  handleLeftSlotChange(e: Event) {
    const button = this.template.childNodes[1].childNodes[0];
    const leftSlot = button.childNodes[0] as HTMLSlotElement;
    const leftSlotElements = leftSlot.assignedElements();
    leftSlotElements.forEach(element => {
      element.dispatchEvent(new CustomEvent('slot', {
        detail: {
          component: 'menuItem',
          name: 'left',
          variant: this.variant
        }
      }));
    });
  }

}