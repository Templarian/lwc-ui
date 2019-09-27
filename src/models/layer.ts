export default class Layer {
  public id: string = '';
  public file: string = '';
  
  public get src() {
    return `resources/tiles/${this.file}.svg`
  }

  from(layer: Layer | string): Layer {
    if (typeof layer === 'string') {
      this.id = layer;
      this.file = layer;
      return this;
    }
    this.id = layer.id;
    this.file = layer.file;
    return this;
  }
}