import { LightningElement, api, track } from 'lwc';
import { mdiClose } from '@mdi/js';
import { dispatchSlot } from 'ui/util';

const COMPONENT = 'navItem';
const VARIANTS: string[] = [
  'default',
  'inline'
];
const DEFAULT_VARIANT = VARIANTS[0];

export default class NavItem extends LightningElement {
  @api href: string | null = null;
  @api target: string | null = null;
  @api close: boolean = false;
  @api variant: string = DEFAULT_VARIANT;

  @track mdiClose: string = mdiClose;

  handleLeftSlotChange() {
    const leftSlot = this.template.childNodes[1].childNodes[0] as HTMLSlotElement;
    const leftSlotElements = leftSlot.assignedElements();
    leftSlotElements.forEach(element => {
      dispatchSlot(element, {
        component: COMPONENT,
        name: 'left',
        variant: this.variant
      });
    });
  }

  handleClose() {
    this.dispatchEvent(new CustomEvent('close'));
  }
}
