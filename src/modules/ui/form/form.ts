import { LightningElement } from 'lwc';

export default class Form extends LightningElement {
  constructor() {
    super();
    this.addEventListener('form_register', this.handleRegister.bind(this));
    this.addEventListener('form_change', this.handleChange.bind(this));
    this.addEventListener('form_submit', this.handleSubmit.bind(this));
  }

  inputs: any = [];

  processChange({ name, value, valid }: any) {
    const input = this.inputs.find((i: any) => i.name === name);
    if (input) {
      input.value = value;
      input.valid = valid;
    } else {
      this.inputs.push({ name, value, valid });
    }
  }

  connectedCallback() {
    this.handleInit();
  }

  handleRegister(e: any) {
    this.processChange(e.detail);
  }

  handleInit() {
    this.dispatchEvent(
      new CustomEvent('init', {
        detail: {
          inputs: this.inputs,
          valid: this.inputs.find((input: FormInput) => !input.valid) !== null
        }
      })
    );
  }

  handleChange(e: any) {
    this.processChange(e.detail);
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: {
          inputs: this.inputs,
          valid: this.inputs.find((input: any) => !input.valid) !== null
        }
      })
    );
  }

  handleSubmit() {
    this.dispatchEvent(
      new CustomEvent('submit', {
        detail: {
          inputs: this.inputs,
          valid: this.inputs.find((input: any) => !input.valid) !== null
        }
      })
    );
  }
}

interface FormInput {
  name: string;
  value: string | number | null;
  valid: boolean;
}

interface FormDetail {
  inputs: FormInput[];
}

export interface FormEvent {
  detail: FormDetail;
}
