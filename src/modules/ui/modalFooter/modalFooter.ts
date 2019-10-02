import { LightningElement, api } from 'lwc';
import { dispatchSlot } from 'ui/util';

export default class ModalFooter extends LightningElement {
  @api variant: string = 'default';

  handleSlotChange() {
    const slot = this.template.childNodes[1] as HTMLSlotElement;
    const slotElements = slot.assignedElements();
    slotElements.forEach(element => {
      dispatchSlot(element, {
        component: 'modalFooter',
        name: null,
        variant: this.variant
      });
    });
  }
}
