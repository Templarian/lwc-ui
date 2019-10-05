import { LightningElement, api } from 'lwc';
import { updateClass, dispatchParent } from 'ui/util';

const uiTabTabName = 'UI-TAB';

export default class Nav extends LightningElement {
  _type = 'nav';

  _selectedIndex: number = 0;
  @api
  get selectedIndex() {
    return this._selectedIndex;
  }
  set selectedIndex(selectedIndex) {
    this._selectedIndex = selectedIndex;
  }

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
    const elements = slot.assignedElements() as HTMLElement[];
    elements.forEach((element, i) => {
      updateClass(element.classList, {
        'nav-item': this._type === 'nav',
        'tab-item': this._type === 'tab',
        'selected': this._selectedIndex === i,
        'selected-before': (this._selectedIndex - 1) === i,
        'selected-after': (this._selectedIndex + 1) === i
      });
      element.onclick = () => {
        this._selectedIndex = i;
        dispatchParent(this.template.host, {
          index: i
        });
        elements.forEach((fElement, fI) => {
          updateClass(fElement.classList, {
            'selected': this._selectedIndex === fI,
            'selected-before': (this._selectedIndex - 1) === fI,
            'selected-after': (this._selectedIndex + 1) === fI
          });
        });
      };
    });
  }
}
