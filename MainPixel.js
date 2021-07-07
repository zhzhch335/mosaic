const ColorRNA = require("color-rna")
class MainPixel {
    url = ""
    constructor(r,g,b,x,y) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.x = x;
        this.y = y;
    }

    getRNA() {
        var color = new ColorRNA()
        return color.rgb(this.r,this.g,this.b)
    }

    getPos() {
        return [this.x,this.y]
    }

    setUrl(url) {
        this.url = url
    }
}

module.exports = MainPixel