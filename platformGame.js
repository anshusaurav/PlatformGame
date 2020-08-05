
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
const scale = 20;

// function drawGrid(level) {
//     return elt(
//         "table",
//         {
//             class: "background",
//             style: `width: ${level.width * scale}px`,
//         },
//         ...level.rows.map((row) =>
//             elt(
//                 "tr",
//                 { style: `height: ${scale}px` },
//                 ...row.map((type) => elt("td", { class: type }))
//             )
//         )
//     );
// }

// function drawActors(actors) {
//     return elt(
//         "div",
//         {},
//         ...actors.map((actor) => {
//             let rect = elt("div", { class: `actor ${actor.type}` });
//             rect.style.width = `${actor.size.x * scale}px`;
//             rect.style.height = `${actor.size.y * scale}px`;
//             rect.style.left = `${actor.pos.x * scale}px`;
//             rect.style.top = `${actor.pos.y * scale}px`;
//             return rect;
//         })
//     );
// }

let playerSprites = document.createElement("img");
playerSprites.src = "images/player.png";
const playerXOverlap = 4;
let otherSprites = document.createElement("img");
otherSprites.src = "images/sprites.png";
function overlap(actor1, actor2) {
    return (
        actor1.pos.x + actor1.size.x > actor2.pos.x &&
        actor1.pos.x < actor2.pos.x + actor2.size.x &&
        actor1.pos.y + actor1.size.y > actor2.pos.y &&
        actor1.pos.y < actor2.pos.y + actor2.size.y
    );
}


const wobbleSpeed = 8,
    wobbleDist = 0.07;


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

runGame(GAME_LEVELS, CanvasDisplay);