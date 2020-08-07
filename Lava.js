class Lava {
    constructor(pos, speed, reset) {
        this.pos = pos;
        this.speed = speed;
        this.reset = reset;
        this.lavaType = '';
        this.size = new Vector2D(1, 1);
    }

    get type() {
        return "lava";
    }

    static create(pos, ch) {
        if (ch == "=") {
            return new Lava(pos, new Vector2D(2, 0), undefined, "Still");
        } else if (ch == "|") {
            return new Lava(pos, new Vector2D(0, 2), undefined, "Moving");
        } else if (ch == "v") {
            return new Lava(pos, new Vector2D(0, 3), pos, "Moving");
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