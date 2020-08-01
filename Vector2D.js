class Vector2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    plus(other) {
        return new Vector2D(this.x + other.x, this.y + other.y);
    }
    times(factor) {
        return new Vector2D(this.x * factor, this.y * factor);
    }
}