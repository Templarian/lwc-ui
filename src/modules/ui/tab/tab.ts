import { LightningElement, api } from 'lwc';

export default class Tab extends LightningElement {
  @api selectedIndex = 0;

  handleSlotChange() {
    const slot = this.template.childNodes[1].childNodes[0] as HTMLSlotElement;
    slot.assignedElements().forEach(element => {
      if (element.tagName === 'UI-NAV') {
        element.slot = 'tabs';
      }
    });
  }
}
