import { LightningElement, api } from 'lwc';
import { normalizeString } from 'ui/util';

export default class Tree extends LightningElement {
  _variant = 'default';
  @api
  get variant() {
    return this._variant;
  }
  set variant(value) {
    this._variant = normalizeString(value, {
      fallbackValue: 'default',
      possibleValues: ['folder', 'chevron']
    });
    this.updateVariant();
  }

  get selectElement() {
    return this.template.childNodes[1].childNodes[0] as HTMLDivElement;
  }

  get hoverElement() {
    return this.template.childNodes[2].childNodes[0] as HTMLDivElement;
  }

  get slotElements() {
    const div = this.template.childNodes[3];
    const slot = div ? (div.childNodes[0] as HTMLSlotElement) : null;
    return div ? slot.assignedElements() : [];
  }

  get items() {
    return this.slotElements;
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
    this.addEventListener('privateselect', this.handlePrivateSelect.bind(this));
    this.addEventListener('privatehover', this.handlePrivateHover.bind(this));
  }

  handleMouseEnter() {
    this.hoverElement.style.display = 'block';
  }

  handleMouseLeave() {
    this.hoverElement.style.display = 'none';
  }

  getItems(node) {
    const items = [];
    node.items.forEach((i: any) => {
      items.push(i);
      items.push(...this.getItems(i));
    });
    return items;
  }

  handlePrivateSelect(e: CustomEvent) {
    e.stopPropagation();
    const items = this.getItems(this);
    const item = items.find(item => item.value === e.detail);
    const { height, top } = (item as any).getItemBoundingClientRect();
    const { top: parentTop } = this.template.host.getBoundingClientRect();
    this.selectElement.style.display = false ? 'none' : 'block';
    this.selectElement.style.height = `${height}px`;
    this.selectElement.style.top = `${top - parentTop}px`;
  }

  handlePrivateHover(e: CustomEvent) {
    e.stopPropagation();
    const { top } = this.template.host.getBoundingClientRect();
    this.hoverElement.style.display = e.detail.hidden ? 'none' : 'block';
    this.hoverElement.style.height = `${e.detail.height}px`;
    this.hoverElement.style.top = `${e.detail.top - top}px`;
  }
}
