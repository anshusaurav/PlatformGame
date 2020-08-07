class DOMDisplay {
    constructor(parent, level) {
        this.dom = elt("div", { class: "game" }, this.drawGrid(level));
        this.actorLayer = null;
        parent.appendChild(this.dom);
    }
    drawGrid(level) {
        const scale = 20;
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
    drawActors(actors) {
        // console.log(actors.filter(actor => actor instanceof Coin).length);
        return elt(
            "div",
            { class: 'game-actors' },
            ...actors.map((actor) => {
                let rect = elt("div", { class: `actor ${actor.type}` });
                rect.style.width = `${actor.size.x * scale}px`;
                rect.style.height = `${actor.size.y * scale}px`;
                rect.style.left = `${actor.pos.x * scale}px`;
                rect.style.top = `${actor.pos.y * scale}px`;
                return rect;
            }), elt('p', { class: "score-tally" }, 'Coins Left: ' +
                actors.filter(actor => actor instanceof Coin).length),
        );
    }
    clear() {
        this.dom.remove();
    }
    syncState(state) {
        console.log(state);
        if (this.actorLayer) this.actorLayer.remove();
        this.actorLayer = this.drawActors(state.actors);
        this.dom.appendChild(this.actorLayer);
        this.dom.className = `game ${state.status}`;
        this.scrollPlayerIntoView(state);
    }
    scrollPlayerIntoView(state) {
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
    }
}