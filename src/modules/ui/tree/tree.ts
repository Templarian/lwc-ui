import { LightningElement, api } from 'lwc';
import { normalizeString } from 'ui/util';

export default class Tree extends LightningElement {
  _variant = "default";
  @api
  get variant() {
    return this._variant;
  }
  set variant(value) {
    this._variant = normalizeString(value, {
      fallbackValue: 'default',
      possibleValues: [
        'folder',
        'chevron'
      ]
    });
    this.updateVariant();
  }

  get hoverElement() {
    return this.template.childNodes[1].childNodes[0] as HTMLDivElement;
  }

  get slotElements() {
    const div = this.template.childNodes[2];
    const slot = div ? div.childNodes[0] as HTMLSlotElement : null;
    return div ? slot.assignedElements() : [];
  }

  handleSlotChange() {
    this.updateVariant();
  }

  updateVariant() {
    this.slotElements.forEach(element => {
      element.classList.add('root');
      (element as any).variant = this._variant;
    });
  }

  connectedCallback() {
    this.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
    this.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
    this.addEventListener('privatehover', this.handlePrivateHover.bind(this));
  }

  handleMouseEnter() {
    this.hoverElement.style.display = 'block';
  }

  handleMouseLeave() {
    this.hoverElement.style.display = 'none';
  }
  
  handlePrivateHover(event: CustomEvent) {
    event.stopPropagation();
    const { top } = this.template.host.getBoundingClientRect();
    this.hoverElement.style.display = event.detail.hidden ? 'none' : 'block';
    this.hoverElement.style.height = `${event.detail.height}px`;
    this.hoverElement.style.top = `${event.detail.top - top}px`;
  }
}