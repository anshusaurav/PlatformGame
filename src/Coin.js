class Coin {
    constructor(pos, basePos, wobble) {
        this.pos = pos;
        this.basePos = basePos;
        this.wobble = wobble;
        this.size = new Vector2D(...coinSize);
    }

    get type() {
        return "coin";
    }

    static create(pos) {
        let basePos = pos.plus(new Vector2D(...coinSize));
        return new Coin(basePos, basePos, Math.random() * Math.PI * 2);
    }
    collide(state) {
        let filtered = state.actors.filter((a) => a != this);
        let status = state.status;
        if (!filtered.some((a) => a.type == "coin")) status = "won";
        return new State(state.level, filtered, status);
    }
    update(time) {
        let wobble = this.wobble + time * wobbleSpeed;
        let wobblePos = Math.sin(wobble) * wobbleDist;
        return new Coin(
            this.basePos.plus(new Vector2D(0, wobblePos)),
            this.basePos,
            wobble
        );
    }
}