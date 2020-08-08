class Lava {
    constructor(pos, speed, reset) {
        this.pos = pos;
        this.speed = speed;
        this.reset = reset;
        this.size = new Vector2D(...lavaSize);
    }

    get type() {
        return "lava";
    }

    static create(pos, ch) {
        if (ch == "=") {
            return new Lava(pos, new Vector2D(...horizontLavaSpeed));
        } else if (ch == "|") {
            return new Lava(pos, new Vector2D(...verticalLavaSpeed));
        } else if (ch == "v") {
            return new Lava(pos, new Vector2D(...drippingLavaSpeed), pos);
        }
    }
    collide(state) {
        return new State(state.level, state.actors, "lost");
    }
    update(time, state) {
        let newPos = this.pos.plus(this.speed.times(time));
        if (!state.level.touches(newPos, this.size, "wall")) {
            return new Lava(newPos, this.speed, this.reset);
        } else if (this.reset) {
            return new Lava(this.reset, this.speed, this.reset);
        } else {
            return new Lava(this.pos, this.speed.times(-1));
        }
    }
}