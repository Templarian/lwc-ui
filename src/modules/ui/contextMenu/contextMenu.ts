import { LightningElement, api, track } from 'lwc';
import Popper, { ReferenceObject } from 'popper.js';
import { getPosition } from './getPosition';

export default class ContextMenu extends LightningElement {
  $menu: HTMLElement | null = null;
  $menuFocus: boolean = false;
  $position: ReferenceObject | null = null;

  @api offsetTop: number | string = 0;
  @api offsetLeft: number | string = 0;

  @track isOpen: boolean = false;

  contextMenuHandler: any;
  mouseDownHandler: any;

  constructor() {
    super();

    this.contextMenuHandler = this.handleContextMenu.bind(this);
    this.mouseDownHandler = this.handleMouseDown.bind(this);
  }

  handleContextMenu(e: MouseEvent) {
    this.isOpen = true;
    this.$position = getPosition(e);
    e.preventDefault();
  }

  handleMouseDown(e: MouseEvent) {
    if (!this.$menuFocus) {
      this.isOpen = false;
      document.removeEventListener('mousedown', this.mouseDownHandler);
    }
  }

  handleSlotChange(e: Event) {
    const slot = this.template.childNodes[1] as HTMLSlotElement;
    const slotElements = slot.assignedElements();
    slotElements.forEach(element => {
      element.addEventListener('contextmenu', this.contextMenuHandler);
    });
  }

  handleMenuSlotChange(e: Event) {
    const slot = this.template.childNodes[2] as HTMLSlotElement;
    if (slot) {
      console.log('menu slot changed');
      const slotElements = slot.assignedElements() as HTMLElement[];
      if (slotElements.length === 0) {
        throw new Error('contextMenu missing menu slot.');
      }
      if (slotElements.length > 1) {
        throw new Error('contextMenu must only contain one root element in the menu slot.');
      }
      const menu = slotElements[0];
      document.addEventListener('mousedown', this.mouseDownHandler);
      new Popper(this.$position!, menu as Element, {
        placement: 'bottom-start',
        modifiers: {
          computeStyle: {
            gpuAcceleration: false
          },
          offset: `${this.offsetLeft}px, ${this.offsetTop}px`
        } as any
      });
      menu.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
      menu.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
      menu.addEventListener('click', this.handleMouseClick.bind(this));
      this.$menu = menu;
    }
  }

  handleMouseEnter() {
    this.$menuFocus = true;
  }

  handleMouseLeave() {
    this.$menuFocus = false;
  }

  handleMouseClick(e: MouseEvent) {
    this.isOpen = false;
    e.stopPropagation();
    document.removeEventListener('mousedown', this.mouseDownHandler);
  }

}