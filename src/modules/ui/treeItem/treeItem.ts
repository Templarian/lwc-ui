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
import { updateClass } from '../util';

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

  _selected = false;
  @api
  get selected() {
    return this._selected;
  }
  set selected(value) {
    this._selected = value;
    if (this.iconElement !== null) {
      updateClass(this.iconElement.classList, {
        'treeItem-variant-select': value
      });
    }
  }

  _hover = false;
  @api
  get hover() {
    return this._hover;
  }
  set hover(value) {
    this._hover = value;
    this.slotElements.forEach(item => {
      updateClass(item.classList, {
        hover: value
      });
    });
  }

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

  get iconElement() {
    return this.hasMenu
      ? (this.template.childNodes[1].childNodes[0]
          .childNodes[0] as HTMLDivElement)
      : null;
  }

  get divElement() {
    const index = this.hasMenu ? 1 : 0;
    return this.template.childNodes[1].childNodes[index] as HTMLDivElement;
  }

  get slotElements() {
    if (!this.divElement) {
      return [];
    }
    return (this.divElement
      .childNodes[0] as HTMLSlotElement).assignedElements();
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
    this.classList.add('node');
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
    this.classList.remove('node');
  }

  handleMouseEnter(e) {
    const target = e.target as HTMLDivElement;
    const { height, top } = target.getBoundingClientRect();
    this.dispatchEvent(
      new CustomEvent('privatehover', {
        detail: {
          top,
          height,
          hidden: false,
          value: this.value
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
          hidden: true,
          value: this.value
        },
        bubbles: true
      })
    );
  }
}
