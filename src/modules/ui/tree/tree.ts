import { LightningElement, api } from 'lwc';

export default class Tree extends LightningElement {
  _folder = false;
  @api
  get folder() {
    return this._folder;
  }
  set folder(value) {
    this.slotElements.forEach(element => {
      (element as any).folder = value;
    })
    this._folder = value;
  }

  get slotElements() {
    const slot = this.template.childNodes[1] as HTMLSlotElement;
    return slot ? slot.assignedElements() : [];
  }

  handleSlotChange() {
    this.slotElements.forEach(element => {
      element.classList.add('root');
      (element as any).folder = this._folder;
    });
  }
}