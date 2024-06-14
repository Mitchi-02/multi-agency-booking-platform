export abstract class BaseEvent<T, D> {
  public type: T
  public data: D

  constructor(type: T, data: D) {
    this.type = type
    this.data = data
  }
}
