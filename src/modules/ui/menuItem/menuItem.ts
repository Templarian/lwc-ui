import { LightningElement, api } from 'lwc';
import { dispatchSlot } from 'ui/util';


const COMPONENT = 'menuItem';
const VARIANT_DEFAULT = 'default';
const DEFAULT_VARIANT = VARIANT_DEFAULT;

export default class Menu extends LightningElement {

  @api variant = DEFAULT_VARIANT;

  handleLeftSlotChange() {
    const button = this.template.childNodes[1].childNodes[0];
    const leftSlot = button.childNodes[0] as HTMLSlotElement;
    const leftSlotElements = leftSlot.assignedElements();
    leftSlotElements.forEach(element => {
      dispatchSlot(element, {
        component: COMPONENT,
        name: 'left',
        variant: this.variant
      })
    })
  }

}