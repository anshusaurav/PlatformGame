
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
const scale = 20;
const wobbleSpeed = 8;
const wobbleDist = 0.07;