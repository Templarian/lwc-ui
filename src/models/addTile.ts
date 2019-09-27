export default class AddTile {
  public id: number = 0;
  public coordinate: [number, number] = [0, 0];
  public gridCoordinate: [number, number] = [0, 0];

  public get gridX() {
    return this.gridCoordinate[0];
  }

  public get gridY() {
    return this.gridCoordinate[1];
  }
}