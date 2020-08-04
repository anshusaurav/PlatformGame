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

    update(time, state, keys) {
        let xSpeed = 0;
        const playerXSpeed = 7;
        const gravity = 30;
        const jumpSpeed = 17;
        if (keys.ArrowLeft) xSpeed -= playerXSpeed;
        if (keys.ArrowRight) xSpeed += playerXSpeed;
        let pos = this.pos;
        let movedX = pos.plus(new Vector2D(xSpeed * time, 0));
        if (!state.level.touches(movedX, this.size, "wall")) {
            pos = movedX;
        }

        let ySpeed = this.speed.y + time * gravity;
        let movedY = pos.plus(new Vector2D(0, ySpeed * time));
        if (!state.level.touches(movedY, this.size, "wall")) {
            pos = movedY;
        } else if (keys.ArrowUp && ySpeed > 0) {
            ySpeed = -jumpSpeed;
        } else {
            ySpeed = 0;
        }
        return new Player(pos, new Vector2D(xSpeed, ySpeed));
    };
}