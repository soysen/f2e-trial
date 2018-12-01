require('pixi.js');
window.createjs = this.createjs = require('createjs-module');


class PIXIGAME {
    constructor(id) {
        this.app = new PIXI.Application(window.innerWidth, window.innerHeight, {
            backgroundColor: 0xffffff
        });
        document.querySelector('main').appendChild(this.app.view);
        this.rectangles = [];
        this.currentMatrix = {
            col: 0,
            row: 0
        };
        // this.stage = new PIXI.Container();

        this.renderBox();

        // 如果有圖片要讀取，使用 PIXI.loader
        // PIXI.loader
        //     .add("../img/gift-1.png")
        //     .load(loader => this.init(loader));

        // this.renderer.render(this.stage);
        // window.requestAnimationFrame(this.stage);
    }

    renderBox() {

        var xAxisNum = window.innerWidth / 100;
        var yAxisNum = window.innerHeight / 100;

        for (var i = 0; i < yAxisNum; i++) {
            if (!this.rectangles[i]) this.rectangles[i] = [];
            for (var j = 0; j < xAxisNum; j++) {
                var box = new PIXI.Graphics();
                box.lineStyle(1, 0xFFFFFF, 1);
                box.beginFill(0x66CCFF);
                box.drawRect(0, 0, 100, 100);
                box.endFill();
                box.row = i;
                box.col = j;
                box.x = 100 * j;
                box.y = 100 * i;

                box.interactive = true;

                box.on('pointermove', e => this.onMouseMove(e));

                this.rectangles[i][j] = box;

                this.app.stage.addChild(box);
            }

        }
        // 
        // this.renderer.render(this.stage);
    }

    onMouseMove(event) {
        var col = Math.floor(event.data.global.x / 100);
        var row = Math.floor(event.data.global.y / 100);

        this.currentMatrix.col = col;
        this.currentMatrix.row = row;
        this.rectangles.forEach((items, r_idx) => {

            items.forEach((item, c_idx) => {
                if (r_idx == row && c_idx == col) {
                    item.alpha = .3;
                } else if ((c_idx == col && (r_idx == row - 1 || r_idx == row + 1)) || (r_idx == row && (c_idx == col - 1 || c_idx == col + 1))) {
                    item.alpha = .65;
                } else if ((c_idx == col - 1 || c_idx == col + 1) && (r_idx == row - 1 || r_idx == row + 1)) {
                    item.alpha = .85;
                } else {
                    item.alpha = 1;
                }
            });

        });

    }
    // 圖片讀取完放入 PIXI.Sprite
    // init(loader) {

    //     this.sprite = new PIXI.Sprite(loader.resources["../img/gift-1.png"].texture); // get Texture Cache

    //     this.sprite.x = 100;
    //     this.sprite.y = 100;

    //     this.stage.addChild(this.sprite);
    //     this.renderer.render(this.stage);
    // }
}


window.card = new PIXIGAME('pixi');