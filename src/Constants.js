
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

const scale = 28;

const coinSize = [0.75, 0.75];
const coinPos = [0.2, 0.1];
const wobbleSpeed = 8;
const wobbleDist = 0.07;

const lavaSize = [1, 1];
const horizontLavaSpeed = [2, 0];
const verticalLavaSpeed = [0, 2];
const drippingLavaSpeed = [0, 3];

const movePlayerOnPos = 3;
const playerSize = [0.5, 1.5];