import { LightningElement } from 'lwc';
import { handleSlotClass } from 'ui/util';

export default class Badge extends LightningElement {
    connectedCallback() {
        this.addEventListener('slot', handleSlotClass);
    }
}
