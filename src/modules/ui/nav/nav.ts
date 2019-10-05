import { LightningElement } from 'lwc';
import { updateClass } from 'ui/util';

const uiTabTabName = 'UI-TAB';

export default class Nav extends LightningElement {
  _type = 'nav';

  connectedCallback() {
    const host = this.template.host as Element;
    const parentElement = host.parentNode as HTMLElement;
    const tagName = parentElement.tagName;
    updateClass(host.classList, {
      nav: tagName !== uiTabTabName,
      tab: tagName === uiTabTabName
    });
    this._type = tagName === uiTabTabName ? 'tab' : 'nav';
  }

  handleSlotChange() {
    const slot = this.template.childNodes[1] as HTMLSlotElement;
    slot.assignedElements().forEach(element => {
      updateClass(element.classList, {
        'nav-item': this._type === 'nav',
        'tab-item': this._type === 'tab'
      });
    });
  }
}
