import { LightningElement, api } from 'lwc';
import { removeToast } from 'ui/toastService';

export default class ToastItem extends LightningElement {

  @api
  toast: any;

  get computedClass() {
    var cls = [`variant-${this.toast.variant}`];
    if (this.toast.seconds > 0) {
      cls.push(`seconds-${this.toast.seconds}`);
    }
    return cls.join(' ');
  }

  get dismissable() {
    return this.toast.dismissable;
  }

  handleClick(e: any) {
    const id = parseInt(e.target.dataset.id, 10);
    removeToast(id);
  }

}
