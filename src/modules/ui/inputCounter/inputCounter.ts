import { LightningElement, api, track } from 'lwc';
import { mdiPlus, mdiMinus } from '@mdi/js';

export default class InputCounter extends LightningElement {
  @api name: string = '';
  @api value: number = 0;
  @api step: number = 1;
  @api focus: boolean = false;

  @track mdiPlus: string = mdiPlus;
  @track mdiMinus: string = mdiMinus;

  handlePlusClick() {
    this.value += this.step;
    this.handleChange();
  }

  handleMinusClick() {
    this.value -= this.step;
    this.handleChange();
  }

  handleChange() {
    this.dispatchEvent(
      new CustomEvent('form_change', {
        bubbles: true,
        detail: {
          name: this.name,
          value: this.value,
          valid: true
        }
      })
    );
  }

  renderedCallback() {
    this.dispatchEvent(
      new CustomEvent('form_register', {
        bubbles: true,
        detail: {
          name: this.name,
          value: this.value,
          valid: true
        }
      })
    );
    if (this.focus) {
      const textarea = this.template.childNodes[1] as HTMLTextAreaElement;
      textarea.focus();
    }
  }
}
