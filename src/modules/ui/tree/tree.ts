import { LightningElement, api } from 'lwc';

export default class Tree extends LightningElement {
  _folder = false;
  @api
  get folder() {
    return this._folder;
  }
  set folder(value) {
    this.slotElements.forEach(element => {
      (element as any).folder = value;
    })
    this._folder = value;
  }

  get hoverElement() {
    return this.template.childNodes[1] as HTMLDivElement;
  }

  get slotElements() {
    const slot = this.template.childNodes[2] as HTMLSlotElement;
    return slot ? slot.assignedElements() : [];
  }

  handleSlotChange() {
    this.slotElements.forEach(element => {
      element.classList.add('root');
      (element as any).folder = this._folder;
    });
  }

  connectedCallback() {
    this.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
    this.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
    this.addEventListener('privatehover', this.handlePrivateHover.bind(this));
  }

  handleMouseEnter() {
    this.hoverElement.style.display = 'initial';
  }

  handleMouseLeave() {
    this.hoverElement.style.display = 'none';
  }
  
  handlePrivateHover(event: CustomEvent) {
    event.stopPropagation();
    const { top } = this.template.host.getBoundingClientRect();
    this.hoverElement.style.display = event.detail.hidden ? 'none' : 'initial';
    this.hoverElement.style.height = `${event.detail.height}px`;
    this.hoverElement.style.top = `${event.detail.top - top}px`;
  }
}