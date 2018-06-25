const hasValue = (value: any): boolean => value !== null && value !== undefined;

export class Optional<T> {
  public static of<T>(value: T | null | undefined): Optional<T> {
    return new Optional<T>(value);
  }

  private readonly value: any;

  constructor(value: T | null | undefined) {
    this.value = value;
  }

  public ifPresent(fn: (value: T) => any | void) {
    if (hasValue(this.value)) fn(this.value);
    return this;
  }

  public notPresent(fn: () => any | void) {
    if (!hasValue(this.value)) fn();
    return this;
  }

  public map<U>(fn: (value: T) => U): Optional<U> {
    return hasValue(this.value) ? Optional.of(fn(this.value)) : new Optional<U>(null);
  }

  public orElse(value: T | null): T {
    return hasValue(this.value) ? this.value : value;
  }

  public orElseGet(fn: () => T): T {
    return hasValue(this.value) ? this.value : fn();
  }

  public orElseThrow(fn: () => any): T {
    if (hasValue(this.value)) {
      return this.value;
    }
    throw fn();
  }
}