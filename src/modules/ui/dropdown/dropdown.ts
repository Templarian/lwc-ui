import { LightningElement, api, track } from 'lwc';
import { handleSlot, handleSlotParentClass } from 'ui/util';
import Popper, { Data, Placement } from 'popper.js';

const DEFAULT_PLACEMENT = 'bottom-start';

export default class Dropdown extends LightningElement {
  $menu: HTMLElement | null = null;
  $menuFocus: boolean = false;
  $menuButton: Element | null = null;

  @api block: boolean = false;
  @api placement: Placement = DEFAULT_PLACEMENT;
  @api offsetTop: number | string = 0;
  @api offsetLeft: number | string = 0;

  @track isOpen: boolean = false;

  clickHandler: any;
  mouseDownHandler: any;
  contextMenuHandler: any;
  mouseEnterMenuHandler: any;
  mouseLeaveMenuHandler: any;

  constructor() {
    super();

    this.clickHandler = this.handleClick.bind(this);
    this.mouseDownHandler = this.handleMouseDown.bind(this);
    this.contextMenuHandler = this.handleContextMenu.bind(this);
    this.mouseEnterMenuHandler = this.handleMouseEnterMenu.bind(this);
    this.mouseLeaveMenuHandler = this.handleMouseLeaveMenu.bind(this);
  }

  renderedCallback() {
    if (this.block) {
      this.classList.add('block');
    }
  }

  connectedCallback() {
    this.addEventListener('slot', handleSlot);
    /*this.addEventListener('slot', handleSlot)
this.afterMenuPromise.then((menu: any) => {
  assignSlotClass(menu)
    menu.classList.add(className);
});*/
  }

  handleClick(e: MouseEvent) {
    e.stopPropagation();
    if (this.isOpen && this.$menuFocus) {
      this.isOpen = false;
    } else {
      this.isOpen = true;
    }
  }

  handleContextMenu() {
    this.isOpen = false;
  }

  handleMouseDown() {
    if (!this.$menuFocus) {
      this.isOpen = false;
      document.removeEventListener('mousedown', this.mouseDownHandler);
      document.removeEventListener('contextmenu', this.contextMenuHandler);
    }
  }

  afterMenuPromise: any;
  handleSlotChange() {
    const slot = this.template.childNodes[1] as HTMLSlotElement;
    const slotElements = slot.assignedElements();
    const menuButton = slotElements[0];
    menuButton.addEventListener('click', this.clickHandler);
    menuButton.addEventListener('mouseenter', this.mouseEnterMenuHandler);
    menuButton.addEventListener('mouseleave', this.mouseLeaveMenuHandler);
    menuButton.classList.add(`dropdown`);
    menuButton.classList.add(`dropdown-${this.placement}`);
    if (this.block) {
      menuButton.classList.add(`block`);
    }
    this.$menuButton = menuButton;
    this.addEventListener('slot', handleSlotParentClass(menuButton));
    this.afterMenuPromise = new Promise(resolve => {
      resolve(menuButton);
    });
  }

  handleMenuSlotChange() {
    const slot = this.template.childNodes[2] as HTMLSlotElement;
    if (slot) {
      const slotElements = slot.assignedElements() as HTMLElement[];
      if (slotElements.length === 0) {
        throw new Error('dropdown missing menu slot.');
      }
      if (slotElements.length > 1) {
        throw new Error(
          'dropdown must only contain one root element in the menu slot.'
        );
      }
      const menu = slotElements[0];
      document.addEventListener('mousedown', this.mouseDownHandler);
      document.addEventListener('contextmenu', this.contextMenuHandler);
      new Popper(this.$menuButton as Element, menu as Element, {
        placement: this.placement,
        modifiers: {
          computeStyle: {
            gpuAcceleration: false
          },
          offset: {
            offset: `${this.offsetLeft}px, ${this.offsetTop}px`
          }
        } as any,
        onCreate: this.onPopperCreate.bind(this),
        onUpdate: this.onPopperUpdate.bind(this)
      });
      menu.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
      menu.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
      menu.addEventListener('click', this.handleMouseClick.bind(this));
      this.$menu = menu;
    }
  }

  flipped = false;
  onPopperCreate(data: Data) {
    this.flipped = data.flipped;
  }

  onPopperUpdate(data: Data) {
    this.$menuButton!.classList.remove(`dropdown-${this.placement}`);
    this.$menuButton!.classList.add(`dropdown-${data.placement}`);
    this.placement = data.placement;
  }

  handleMouseEnter() {
    this.$menuFocus = true;
  }

  handleMouseLeave() {
    this.$menuFocus = false;
  }

  handleMouseClick() {
    this.isOpen = false;
    document.removeEventListener('mousedown', this.mouseDownHandler);
    document.removeEventListener('contextmenu', this.contextMenuHandler);
  }

  handleMouseEnterMenu() {
    this.$menuFocus = true;
  }

  handleMouseLeaveMenu() {
    this.$menuFocus = false;
  }
}
