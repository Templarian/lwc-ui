import { LightningElement, api } from 'lwc';
import { dispatchSlot } from 'ui/util';

export default class NavBrand extends LightningElement {
  @api href: string | null = null;

  handleLogoSlotChange() {
    const slot = this.href
      ? (this.template.childNodes[1].childNodes[0] as HTMLSlotElement)
      : (this.template.childNodes[1] as HTMLSlotElement);
    const slotElements = slot.assignedElements();
    slotElements.forEach(element => {
      dispatchSlot(element, {
        component: 'navBrand',
        name: 'logo',
        variant: 'default'
      });
    });
  }
}
