import { LightningElement, api } from 'lwc';

export default class InputText extends LightningElement {
  @api name: string = '';
  @api value: string = '';
  @api focus: boolean = false;

  handleChange(e: InputEvent) {
    this.value = (e.target as HTMLTextAreaElement).value;
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
