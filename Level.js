class Level {
    constructor(plan) {
        let newPlan = [...plan];
        this.height = newPlan.length;
        this.width = newPlan[0].length;
        this.startActors = [];
        this.numCoin = 0;
        this.rows = newPlan.map((row, y) => {
            return row.split('').map((ch, x) => {
                let type = levelChars[ch];
                if (type instanceof Coin)
                    this.numCoin++;
                if (typeof type == "string") return type;
                this.startActors.push(type.create(new Vector2D(x, y), ch));
                return "empty";
            });
        });
    }
    touches(pos, size, type) {
        var xStart = Math.floor(pos.x);
        var xEnd = Math.ceil(pos.x + size.x);
        var yStart = Math.floor(pos.y);
        var yEnd = Math.ceil(pos.y + size.y);

        for (var y = yStart; y < yEnd; y++) {
            for (var x = xStart; x < xEnd; x++) {
                let isOutside = x < 0 || x >= this.width || y < 0 || y >= this.height;
                let here = isOutside ? "wall" : this.rows[y][x];
                if (here == type) return true;
            }
        }
        return false;
    }
}