import Layer from "./layer";
import Collision from "./collision";
import World from "./world";

interface ISideCallback {
  (sideId: string | null, index: number): void;
}

export default class Tile {
  public id: [
    (string | null),
    (string | null),
    (string | null),
    (string | null),
    (string | null)
  ] = [null, null, null, null, null];
  public comment: string | null = null;
  public collision: Collision = Collision.None;
  public layers: Layer[] = [];
  public world: World = new World();

  public get hash() {
    return `${this.gridX}, ${this.gridY}: ${this.layersCount}: ${this.removable}`;
  }

  private $coordinate: [number, number] = [0, 0];
  public get coordinate() {
    return this.$coordinate;
  }

  public setCoordinate(x: number, y: number) {
    this.$coordinate = [x, y];
  }

  get x() {
    return this.coordinate![0];
  }

  get y() {
    return this.coordinate![1];
  }

  private $gridOffset: [number, number] = [0, 0];
  public get gridOffset() {
    return this.$gridOffset;
  }

  public get gridCoordinate() {
    return [
      this.$coordinate[0] + this.$gridOffset[0],
      this.$coordinate[1] + this.$gridOffset[1]
    ];
  }

  get gridX() {
    return this.$coordinate[0] + this.$gridOffset[0] + 1;
  }

  get gridY() {
    return this.$coordinate[1] + this.$gridOffset[1] + 1;
  }

  public setGridOffset(x: number, y: number) {
    this.$gridOffset = [x, y];
  }

  public sides(cb: ISideCallback) {
    const [, top, right, bottom, left] = this.id;
    [top, right, bottom, left].forEach(cb);
  }

  get tileId() {
    return this.id[0];
  }

  get topId() {
    return this.id[1];
  }

  get rightId() {
    return this.id[2];
  }

  get bottomId() {
    return this.id[3];
  }

  get leftId() {
    return this.id[4];
  }

  setWorld(world: World) {
    this.world = world;
  }

  get removable() {
    return this.world.canRemove(this);
  }

  get layersCount() {
    return this.layers.length;
  }

  from(tile: Tile) {
    this.id = tile.id;
    this.comment = tile.comment || null;
    this.layers = tile.layers.map(layer => new Layer().from(layer));
    return this;
  }

  json() {
    return {
      id: this.id,
      comment: this.comment || null,
      layers: this.layers.map(layer => layer.id)
    }
  }
}