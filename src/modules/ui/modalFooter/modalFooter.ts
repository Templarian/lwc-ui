import { LightningElement, api } from 'lwc';

export default class ModalFooter extends LightningElement {
  @api variant: string = 'default';
  
  handleSlotChange(e: Event) {
    const slot = this.template.childNodes[1] as HTMLSlotElement;
    const slotElements = slot.assignedElements();
    slotElements.forEach(element => {
      element.dispatchEvent(new CustomEvent('slot', {
        detail: {
          component: 'modalFooter',
          name: null,
          variant: this.variant
        }
      }));
    });
  }
}
