import { LightningElement, api } from 'lwc';

export default class TreeItemGroup extends LightningElement {
  _folder = false;
  @api
  get folder() {
    return this.folder;
  }
  set folder(value: boolean) {
    const elements = this.slotElements;
    elements.forEach((element, i) => {
      (element as any).folder = value;
      if (i === elements.length - 1) {
        element.classList.add('last');
      }
    });
    this._folder = value;
  }

  get slotElements() {
    const slot = this.template.childNodes[1] as HTMLSlotElement;
    return slot ? slot.assignedElements() : [];
  }
}