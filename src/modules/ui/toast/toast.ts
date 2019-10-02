import { LightningElement, wire } from 'lwc';
import { getToasts } from 'ui/toastService';

export default class Toast extends LightningElement {

  @wire(getToasts)
  toastWire: any;

  get toasts() {
    return this.toastWire.data;
  }

}
