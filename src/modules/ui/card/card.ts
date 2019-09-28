import { LightningElement, api } from 'lwc';

export default class Card extends LightningElement {

  _shadow: number = 0;

  @api
  get shadow() {
    return this._shadow;
  }
  set shadow(value) {
    this._shadow = value;
    this.updateHostClass();
  }

  updateHostClass() {
    this.template.host.classList.remove(`shadow-1`);
    this.template.host.classList.remove(`shadow-2`);
    this.template.host.classList.remove(`shadow-3`);
    this.template.host.classList.add(`shadow-${this._shadow}`);
  }

  handleSlotChange(e: Event) {
    const slot = this.template.childNodes[1] as HTMLSlotElement;
    const slotElements = slot.assignedElements();
    const elementTagNames: string[] = [];
    slotElements.forEach(element => {
      elementTagNames.push(element.tagName.toLocaleLowerCase());
    });
    if (!elementTagNames.includes('ui-card-header')) {
      this.template.host.classList.add('no-header');
    }
    if (!elementTagNames.includes('ui-card-footer')) {
      this.template.host.classList.add('no-footer');
    }
  }

}