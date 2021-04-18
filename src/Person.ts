export class Person {
  private _name: string;
  private _marker: google.maps.Marker | null;
  constructor(name: string, marker: google.maps.Marker) {
    this._name = name;
    this._marker = marker;
  }

  getName() {
    return this._name;
  }

  getMarker() {
    return this._marker;
  }
}
