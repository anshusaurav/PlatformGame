class Player {
    constructor(pos, speed) {
        this.pos = pos;
        this.speed = speed;
        this.size = new Vector2D(0.5, 1.5);
    }

    get type() {
        return "player";
    }

    static create(pos) {
        return new Player(pos.plus(new Vector2D(0, -0.5)), new Vector2D(0, 0));
    }
}