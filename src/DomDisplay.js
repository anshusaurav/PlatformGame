class DOMDisplay {
    constructor(parent, level) {
        this.dom = elt("div", { class: "game" }, this.drawGrid(level));
        this.actorLayer = null;
        parent.appendChild(this.dom);
    }

    clear() {
        this.dom.remove();
    }
    syncState(state) {
        if (this.actorLayer) this.actorLayer.remove();
        this.actorLayer = this.drawActors(state.actors);
        this.dom.appendChild(this.actorLayer);
        this.dom.className = `game ${state.status}`;
        this.scrollPlayerIntoView(state);
    }

    drawGrid(level) {
        return elt(
            "table",
            {
                class: "background",
                style: `width: ${level.width * scale}px`,
            },
            ...level.rows.map((row, rowIndex) =>
                elt(
                    "tr",
                    { style: `height: ${scale}px` },
                    ...row.map((type, colIndex) => {
                        if (type === 'lava') {
                            if (rowIndex - 1 >= 0)
                                if (level.rows[rowIndex - 1][colIndex] === 'empty')
                                    return elt("td", {
                                        class: `${type} topLava`
                                    })
                            if (rowIndex + 1 <= level.rows.length - 1) {
                                if (level.rows[rowIndex + 1][colIndex] === 'empty') {
                                    return elt("td", {
                                        class: `${type} botLava`
                                    })
                                }
                            }

                        }
                        return elt("td", { class: type })
                    })
                )
            ), elt('p', { class: "level-tally" }, 'Level: ' + (level.levelNum + 1)),
            elt('p', { class: "lives-tally" }, 'Lives: ' + (level.lives))
        );
    }

    drawActors(actors) {
        return elt(
            "div",
            {},
            ...actors.map((actor) => {
                let rect;
                if (actor.type === 'lava')
                    rect = elt("div", { class: `actor ${actor.type} moving` });
                else
                    rect = elt("div", { class: `actor ${actor.type}` });
                rect.style.width = `${actor.size.x * scale}px`;
                rect.style.height = `${actor.size.y * scale}px`;
                rect.style.left = `${actor.pos.x * scale}px`;
                rect.style.top = `${actor.pos.y * scale}px`;
                return rect;
            }), elt('p', { class: "score-tally" }, 'Coins: ' +
                actors.filter(actor => actor instanceof Coin).length)
        );
    }
    scrollPlayerIntoView(state) {
        let width = this.dom.clientWidth;
        let height = this.dom.clientHeight;
        let margin = width / movePlayerOnPos;

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