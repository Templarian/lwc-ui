import { LightningElement, api } from 'lwc';

declare const ResizeObserver;

export default class Tab extends LightningElement {
  _nav: any = null;
  _items: any[] = [];
  _selectedIndex: number = 0;
  @api
  get selectedIndex() {
    return this._selectedIndex;
  }
  set selectedIndex(selectedIndex) {
    this._selectedIndex = selectedIndex;
  }

  connectedCallback() {
    this.template.addEventListener('parent', ({ detail }: CustomEvent) => {
      this.selectedIndex = detail.index;
      this._items.forEach((element, i) => {
        if (detail.index === i) {
          element.show();
        } else {
          element.hide();
        }
      });
      this._nav.selectedIndex = detail.index;
    });
    const resizeObserver = new ResizeObserver(this.handleResize);
    resizeObserver.observe(this.template.host);
  }

  handleResize(entry) {
    console.log(entry);
  }

  handleSlotChange() {
    let index = 0;
    const slot = this.template.childNodes[2] as HTMLSlotElement;
    const elements = slot.assignedElements() as HTMLElement[];
    elements.forEach(element => {
      if (element.tagName === 'UI-NAV') {
        element.slot = 'tabs';
        this._nav = element;
      } else if (element.tagName === 'UI-TAB-ITEM') {
        this._items[index] = element;
        if (this._selectedIndex !== index) {
          (element as any).hide();
        }
        index++;
      }
    });
  }
}
