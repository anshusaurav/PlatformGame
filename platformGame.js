


// Player.prototype.size = new Vector2D(0.8, 1.5);



// Lava.prototype.size = new Vector2D(1, 1);



// Coin.prototype.size = new Vector2D(0.6, 0.6);

const levelChars = {
    " ": "empty",
    "x": "wall",
    "!": "lava",
    "@": Player,
    o: Coin,
    "=": Lava,
    "|": Lava,
    v: Lava,
};

function elt(name, attrs, ...children) {
    let dom = document.createElement(name);
    for (let attr of Object.keys(attrs)) {
        dom.setAttribute(attr, attrs[attr]);
    }
    for (let child of children) {
        dom.appendChild(child);
    }
    return dom;
}

class DOMDisplay {
    constructor(parent, level) {
        this.dom = elt("div", { class: "game" }, drawGrid(level));
        this.actorLayer = null;
        parent.appendChild(this.dom);
    }

    clear() {
        this.dom.remove();
    }
}

const scale = 20;

function drawGrid(level) {
    return elt(
        "table",
        {
            class: "background",
            style: `width: ${level.width * scale}px`,
        },
        ...level.rows.map((row) =>
            elt(
                "tr",
                { style: `height: ${scale}px` },
                ...row.map((type) => elt("td", { class: type }))
            )
        )
    );
}

function drawActors(actors) {
    return elt(
        "div",
        {},
        ...actors.map((actor) => {
            let rect = elt("div", { class: `actor ${actor.type}` });
            rect.style.width = `${actor.size.x * scale}px`;
            rect.style.height = `${actor.size.y * scale}px`;
            rect.style.left = `${actor.pos.x * scale}px`;
            rect.style.top = `${actor.pos.y * scale}px`;
            return rect;
        })
    );
}

DOMDisplay.prototype.syncState = function (state) {
    if (this.actorLayer) this.actorLayer.remove();
    this.actorLayer = drawActors(state.actors);
    this.dom.appendChild(this.actorLayer);
    this.dom.className = `game ${state.status}`;
    this.scrollPlayerIntoView(state);
};
DOMDisplay.prototype.scrollPlayerIntoView = function (state) {
    let width = this.dom.clientWidth;
    let height = this.dom.clientHeight;
    let margin = width / 3;

    // The viewport
    let left = this.dom.scrollLeft,
        right = left + width;
    let top = this.dom.scrollTop,
        bottom = top + height;

    let player = state.player;
    let center = player.pos.plus(player.size.times(0.5)).times(scale);

    if (center.x < left + margin) {
        this.dom.scrollLeft = center.x - margin;
    } else if (center.x > right - margin) {
        this.dom.scrollLeft = center.x + margin - width;
    }
    if (center.y < top + margin) {
        this.dom.scrollTop = center.y - margin;
    } else if (center.y > bottom - margin) {
        this.dom.scrollTop = center.y + margin - height;
    }
};
// Level.prototype.touches = function (pos, size, type) {
//     var xStart = Math.floor(pos.x);
//     var xEnd = Math.ceil(pos.x + size.x);
//     var yStart = Math.floor(pos.y);
//     var yEnd = Math.ceil(pos.y + size.y);

//     for (var y = yStart; y < yEnd; y++) {
//         for (var x = xStart; x < xEnd; x++) {
//             let isOutside = x < 0 || x >= this.width || y < 0 || y >= this.height;
//             let here = isOutside ? "wall" : this.rows[y][x];
//             if (here == type) return true;
//         }
//     }
//     return false;
// };

// State.prototype.update = function (time, keys) {
//     let actors = this.actors.map((actor) => actor.update(time, this, keys));
//     let newState = new State(this.level, actors, this.status);

//     if (newState.status != "playing") return newState;

//     let player = newState.player;
//     if (this.level.touches(player.pos, player.size, "lava")) {
//         return new State(this.level, actors, "lost");
//     }

//     for (let actor of actors) {
//         if (actor != player && overlap(actor, player)) {
//             newState = actor.collide(newState);
//         }
//     }
//     return newState;
// };

function overlap(actor1, actor2) {
    return (
        actor1.pos.x + actor1.size.x > actor2.pos.x &&
        actor1.pos.x < actor2.pos.x + actor2.size.x &&
        actor1.pos.y + actor1.size.y > actor2.pos.y &&
        actor1.pos.y < actor2.pos.y + actor2.size.y
    );
}

// Lava.prototype.collide = function (state) {
//     return new State(state.level, state.actors, "lost");
// };

// Coin.prototype.collide = function (state) {
//     let filtered = state.actors.filter((a) => a != this);
//     let status = state.status;
//     if (!filtered.some((a) => a.type == "coin")) status = "won";
//     return new State(state.level, filtered, status);
// };

// Lava.prototype.update = function (time, state) {
//     let newPos = this.pos.plus(this.speed.times(time));
//     if (!state.level.touches(newPos, this.size, "wall")) {
//         return new Lava(newPos, this.speed, this.reset);
//     } else if (this.reset) {
//         return new Lava(this.reset, this.speed, this.reset);
//     } else {
//         return new Lava(this.pos, this.speed.times(-1));
//     }
// };

const wobbleSpeed = 8,
    wobbleDist = 0.07;

// Coin.prototype.update = function (time) {
//     let wobble = this.wobble + time * wobbleSpeed;
//     let wobblePos = Math.sin(wobble) * wobbleDist;
//     return new Coin(
//         this.basePos.plus(new Vector2D(0, wobblePos)),
//         this.basePos,
//         wobble
//     );
// };

const playerXSpeed = 7;
const gravity = 30;
const jumpSpeed = 17;

Player.prototype.update = function (time, state, keys) {
    let xSpeed = 0;
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

function trackKeys(keys) {
    let down = Object.create(null);
    function track(event) {
        if (keys.includes(event.key)) {
            down[event.key] = event.type == "keydown";
            event.preventDefault();
        }
    }
    window.addEventListener("keydown", track);
    window.addEventListener("keyup", track);
    return down;
}

const arrowKeys = trackKeys(["ArrowLeft", "ArrowRight", "ArrowUp"]);

function runAnimation(frameFunc) {
    let lastTime = null;
    function frame(time) {
        if (lastTime != null) {
            let timeStep = Math.min(time - lastTime, 100) / 1000;
            if (frameFunc(timeStep) === false) return;
        }
        lastTime = time;
        requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
}
function runLevel(level, Display) {
    let display = new Display(document.querySelector('.game-container'), level);
    let state = State.start(level);
    let ending = 1;
    return new Promise(resolve => {
        runAnimation(time => {
            state = state.update(time, arrowKeys);
            display.syncState(state);
            if (state.status == "playing") {
                return true;
            } else if (ending > 0) {
                ending -= time;
                return true;
            } else {
                display.clear();
                resolve(state.status);
                return false;
            }
        });
    });
}
async function runGame(plans, Display) {
    for (let level = 0; level < plans.length;) {
        let status = await runLevel(new Level(plans[level]),
            Display);
        if (status == "won") level++;
    }
    console.log("You've won!");
}

runGame(GAME_LEVELS, DOMDisplay);