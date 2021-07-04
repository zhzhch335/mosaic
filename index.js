const MAIN_WIDTH = 25

const sharp = require('sharp')
const ColorRNA = require("color-rna")

// 主图实例化
const main = sharp('main.png')
// 引入小图路径
const subImg = require("./getsubImg")

// 工具和类
const ImageDiffPx = require("./imageDiffPx")
const getPixels = require('./utils/getRGB')
const sortByRGB = require("./utils/sortByRGB")
const fs = require("fs")


// 获取小图数量，计算每个图出现的最大次数
const max_time = Math.ceil(Math.pow(MAIN_WIDTH,2) / subImg.length)
let mainPixelsInfo = []

let result = {}
subImg.forEach(item=>{
    result[item] = new ImageDiffPx(`./images/${item}`,new ColorRNA().rgb(220,107,113))
})

// const diff = new ImageDiffPx("./images/eebf4f69579e7fc8733d8ca24114e2712950e25e.jpg",new ColorRNA().rgb(220,107,113))
const interval = setInterval(() => {
    for (let item in result) {
        if(result[item].diff == undefined) {
            return
        }
    }
    let txt = ""
    for (let item in result) {
        txt += `${item} ${result[item].diff}\n`
    }

    fs.writeFile('result.txt', txt, function(err) {
        if (err) {
            return console.error(err);
        }
    })

    clearInterval(interval)
})
// while(true) {
//     if (diff.diff) {
//         console.log(diff.diff)
//         break
//     }
// }


// main.resize(MAIN_WIDTH).toBuffer().then(buffer => {
//     // 将主图片转化为25*25的像素图
//     getPixels(buffer, 'png', function(pixelsArray) {
//         // 设定像素位置
//         mainPixelsInfo = pixelsArray.map((item,index)=>new MainPixel(item[0],item[1],item[2],Math.floor(index/MAIN_WIDTH),index%MAIN_WIDTH))
//         // 根据RGB数量升序排列像素点
//         mainPixelsInfo = sortByRGB(mainPixelsInfo)
//         debugger
//     })
// })




// main.resize(25).toFile('one.png',()=>{
    // getPixels("one.png", function(err, pixels) {
    //     if(err) {
    //         console.log("Bad image path")
    //         return
    //     }
    //     console.log(pixels)
    // })
// })

// var color1 = new ColorRNA();
// var color2 = new ColorRNA();

// color1.rgb(123, 124, 21);
// color2.rgb(44, 22, 33);

// console.log(color1.diff_DE1976_Than(color2));
// console.log(color2.diff_DE1976_Than(color1));

class MainPixel {
    constructor(r,g,b,x,y) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.x = x;
        this.y = y;
    }

    getRNA() {
        var color = new ColorRNA()
        return color.rgb(r,g,b)
    }

    getPos() {
        return [x,y]
    }
}