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
    this.classList.remove(`shadow-1`);
    this.classList.remove(`shadow-2`);
    this.classList.remove(`shadow-3`);
    this.classList.add(`shadow-${this._shadow}`);
  }

  handleSlotChange() {
    const slot = this.template.childNodes[1] as HTMLSlotElement;
    const slotElements = slot.assignedElements();
    const elementTagNames: string[] = [];
    slotElements.forEach(element => {
      elementTagNames.push(element.tagName.toLocaleLowerCase());
    });
    if (!elementTagNames.includes('ui-card-header')) {
      this.classList.add('no-header');
    }
    if (!elementTagNames.includes('ui-card-footer')) {
      this.classList.add('no-footer');
    }
  }
}
