import { LightningElement, api } from 'lwc';
import { updateVariant, inArrayOrDefault } from 'ui/util';
import { mdiMenuDown } from '@mdi/js';

interface Slot {
  component: string,
  name: string | null,
  variant: string | null
}

const VARIANTS = [
  'default',
  'primary',
  'warning',
  'danger',
  'info',
  'dark'
];
const DEFAULT_VARIANT = VARIANTS[0];

export default class Button extends LightningElement {
  @api submit: boolean = false;
  @api href: string | null = null;
  @api target: string | null = null;

  _variant: string = DEFAULT_VARIANT;
  @api
  get variant() {
    return this._variant;
  }
  set variant(variant: string) {
    this._variant = inArrayOrDefault(variant, VARIANTS, DEFAULT_VARIANT);
    updateVariant(this.template.host.classList, this._variant, VARIANTS);
  }

  _block: boolean = false;
  @api
  get block() {
    return this._block;
  }
  set block(block: boolean) {
    this._block = block;
    this.updateHostClass();
  }

  _active: boolean = false;
  @api
  get active() {
    return this._active;
  }
  set active(active: boolean) {
    this._active = active;
    this.updateHostClass();
  }
  
  mdiMenuDown: string = mdiMenuDown;

  get computedCaretLeft() {
    return `caret-left button-variant-${this.variant}`;
  }

  get computedCaretRight() {
    return `caret-right button-variant-${this.variant}`;
  }

  connectedCallback() {
    if (this._variant === DEFAULT_VARIANT) {
      updateVariant(this.template.host.classList, this._variant, VARIANTS);
    }
    this.addEventListener('slot', this.slot as EventListener);
    if (this.submit) {
      this.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('form_submit', {
          bubbles: true
        }));
      });
    }
  }

  updateHostClass() {
    if (this.block) {
      this.template.host.classList.add('block');
    } else {
      this.template.host.classList.remove('block');
    }
    if (this.active) {
      this.template.host.classList.add('active');
    } else {
      this.template.host.classList.remove('active');
    }
  }

  slot({ target, detail: slot }: CustomEvent<Slot>) {
    const iconElement = target as Element;
    const slotName = slot.name ? `-${slot.name}` : '';
    const classes = [
      `${slot.component}-variant-${slot.variant}`,
      `${slot.component}-slot${slotName}`
    ];
    iconElement.className = classes.join(' ');
  }

  handleLeftSlotChange(e: Event) {
    const button = this.template.childNodes[1].childNodes[0];
    const leftSlot = button.childNodes[1] as HTMLSlotElement;
    const leftSlotElements = leftSlot.assignedElements();
    leftSlotElements.forEach(element => {
      element.dispatchEvent(new CustomEvent('slot', {
        detail: {
          component: 'button',
          name: 'left',
          variant: this.variant
        }
      }));
    });
  }

  handleSlotChange(e: Event) {
    const button = this.template.childNodes[1].childNodes[0];
    const slot = button.childNodes[2].childNodes[0] as HTMLSlotElement;
    const slotElements = slot.assignedElements();
    slotElements.forEach(element => {
      element.dispatchEvent(new CustomEvent('slot', {
        detail: {
          component: 'button',
          name: null,
          variant: this.variant
        }
      }));
    });
  }

  handleRightSlotChange(e: Event) {
    const button = this.template.childNodes[1].childNodes[0];
    const rightSlot = button.childNodes[3] as HTMLSlotElement;
    const rightSlotElements = rightSlot.assignedElements();
    rightSlotElements.forEach(element => {
      element.dispatchEvent(new CustomEvent('slot', {
        detail: {
          component: 'button',
          name: 'right',
          variant: this.variant
        }
      }));
    });
  }

}
