import { LightningElement, api } from 'lwc';
import { updateClass } from '../util';

export default class TreeItemGroup extends LightningElement {
  _variant = 'default';
  @api
  get variant() {
    return this._variant;
  }
  set variant(value) {
    const elements = this.slotElements;
    elements.forEach((element, i) => {
      (element as any).variant = value;
      updateClass(element.classList, {
        first: i === 0,
        last: i === elements.length - 1
      });
    });
    this._variant = value;
  }

  get slotElements() {
    const slot = this.template.childNodes[1] as HTMLSlotElement;
    return slot ? slot.assignedElements() : [];
  }

  @api
  get items() {
    return this.slotElements;
  }
}
