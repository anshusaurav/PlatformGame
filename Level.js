class Level {
    constructor(plan) {
        let newPlan = [...plan];
        this.height = newPlan.length;
        this.width = newPlan[0].length;
        this.startActors = [];
        this.rows = newPlan.map((row, y) => {
            return row.split('').map((ch, x) => {
                let type = levelChars[ch];
                if (typeof type == "string") return type;
                this.startActors.push(type.create(new Vector2D(x, y), ch));
                return "empty";
            });
        });
    }
}