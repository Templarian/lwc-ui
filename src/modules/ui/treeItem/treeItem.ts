import { LightningElement, track, api } from 'lwc';
import {
  mdiPlusBox,
  mdiMinusBox,
  mdiFolder,
  mdiFolderOpen
} from '@mdi/js';

export default class TreeItem extends LightningElement {
  _folder = false;
  @api
  get folder() {
    return this.folder;
  }
  set folder(value: boolean) {
    this.slotItemsElements.forEach(element => {
      (element as any).folder = value;
    })
    this._folder = value;
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

  @track icon: string = mdiPlusBox;

  @track mdiPlusBox: string = mdiPlusBox;
  @track mdiMinusBox: string = mdiMinusBox;

  @track hasMenu = false;

  updateIcon() {
    this.icon = this._folder
      ? this._isOpened
        ? mdiFolderOpen
        : mdiFolder
      : this._isOpened
        ? mdiMinusBox
        : mdiPlusBox;
  }

  get slotItemsElements() {
    const slot = this.template.querySelector('slot[name=items]') as HTMLSlotElement;
    return slot ? slot.assignedElements() : [];
  }

  connectedCallback() {
    this.template.host.classList.add('node');
  }

  handleClick() {
    this.isOpened = !this.isOpened;
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
}