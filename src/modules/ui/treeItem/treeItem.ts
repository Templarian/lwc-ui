import { LightningElement, track, api } from 'lwc';
import { getUniqueId } from 'ui/util';
import {
  mdiPlusBox,
  mdiMinusBox,
  mdiFolder,
  mdiFolderOpen,
  mdiChevronRight,
  mdiChevronDown
} from '@mdi/js';

export default class TreeItem extends LightningElement {
  _variant = 'default';
  @api
  get variant() {
    return this._variant;
  }
  set variant(value) {
    this.slotItemsElements.forEach(element => {
      (element as any).variant = value;
    });
    this._variant = value;
    this.updateIcon();
  }

  _isOpened = true;
  @api
  get isOpened() {
    return this._isOpened;
  }
  set isOpened(value) {
    this._isOpened = value;
    this.updateIcon();
  }

  @api
  get items() {
    const elements = this.slotItemsElements as any[];
    return elements.length === 0 ? [] : elements[0].items;
  }

  @api value: string = getUniqueId();

  @track icon: string = mdiPlusBox;

  @track mdiPlusBox: string = mdiPlusBox;
  @track mdiMinusBox: string = mdiMinusBox;

  @track hasMenu = false;

  updateIcon() {
    switch (this._variant) {
      case 'default':
        this.icon = this._isOpened ? mdiMinusBox : mdiPlusBox;
        break;
      case 'folder':
        this.icon = this._isOpened ? mdiFolderOpen : mdiFolder;
        break;
      case 'chevron':
        this.icon = this._isOpened ? mdiChevronDown : mdiChevronRight;
        break;
    }
  }

  get divElement() {
    const index = this.template.childNodes[1].childNodes.length - 1;
    return this.template.childNodes[1].childNodes[index] as HTMLDivElement;
  }

  @api
  getItemBoundingClientRect() {
    return this.divElement.getBoundingClientRect();
  }

  get slotItemsElements() {
    const slot = this.template.querySelector(
      'slot[name=items]'
    ) as HTMLSlotElement;
    return slot ? slot.assignedElements() : [];
  }

  connectedCallback() {
    this.template.host.classList.add('node');
  }

  handleClick(e: MouseEvent) {
    this.isOpened = !this.isOpened;
    e.stopPropagation();
  }

  handleSelect() {
    this.dispatchEvent(
      new CustomEvent('privateselect', {
        detail: this.value,
        bubbles: true
      })
    );
  }

  handleSlotChange() {
    const length = (this.template.childNodes[1] as HTMLElement).children.length;
    const div = this.template.childNodes[1].childNodes[length - 1];
    const slot = div.childNodes[0] as HTMLSlotElement;
    const slotElements = slot.assignedElements();
    slotElements.forEach(element => {
      if (element.tagName === 'UI-TREE-ITEM-GROUP') {
        element.slot = 'items';
        this.hasMenu = true;
      }
    });
  }

  handleSlotItemsChange() {
    this.template.host.classList.remove('node');
  }

  handleMouseEnter(e) {
    const target = e.target as HTMLDivElement;
    const { height, top } = target.getBoundingClientRect();
    this.dispatchEvent(
      new CustomEvent('privatehover', {
        detail: {
          top,
          height,
          hidden: false
        },
        bubbles: true
      })
    );
  }

  handleItemsMouseEnter(e: MouseEvent) {
    const target = e.target as HTMLDivElement;
    const { height, top } = target.getBoundingClientRect();
    this.dispatchEvent(
      new CustomEvent('privatehover', {
        detail: {
          top,
          height,
          hidden: true
        },
        bubbles: true
      })
    );
  }
}
