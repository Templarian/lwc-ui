import { LightningElement, api } from 'lwc';

export default class NavBrand extends LightningElement {

  @api href: string | null = null;

  handleLogoSlotChange(e: Event) {
    const slot = this.href
      ? this.template.childNodes[1].childNodes[0] as HTMLSlotElement
      : this.template.childNodes[1] as HTMLSlotElement;
    const slotElements = slot.assignedElements();
    slotElements.forEach(element => {
      element.dispatchEvent(new CustomEvent('slot', {
        detail: {
          component: 'navBrand',
          name: 'logo',
          variant: 'default'
        }
      }));
    });
  }
}