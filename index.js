const MAIN_WIDTH = 25

const sharp = require('sharp')
const ColorRNA = require("color-rna")

// 主图实例化
const main = sharp('main.png')
// 引入小图路径
const subImg = require("./getsubImg")

// 工具和类
const ImageDiffPx = require("./imageDiffPx")
const getRGB = require('./utils/getRGB')
const sortByRGB = require("./utils/sortByRGB")
const fs = require("fs")


// 获取小图数量，计算每个图出现的最大次数
const max_time = Math.ceil(Math.pow(MAIN_WIDTH,2) / subImg.length)
let mainPixelsInfo = []


// const interval = setInterval(() => {
//     for (let item in result) {
//         if(result[item].diff == undefined) {
//             return
//         }
//     }
//     let txt = ""
//     for (let item in result) {
//         txt += `${item} ${result[item].diff}\n`
//     }

//     fs.writeFile('result.txt', txt, function(err) {
//         if (err) {
//             return console.error(err);
//         }
//     })

//     clearInterval(interval)
// })


// 将主图片转化为25*25的像素图
main.resize(MAIN_WIDTH).toBuffer().then(async buffer => {
    const pixelsArray = await getRGB(buffer, 'png')
    // 设定像素位置
    mainPixelsInfo = pixelsArray.map((item,index)=>new MainPixel(item[0],item[1],item[2],Math.floor(index/MAIN_WIDTH),index%MAIN_WIDTH))
    // 根据RGB数量升序排列像素点
    mainPixelsInfo = sortByRGB(mainPixelsInfo)
    // 使用二维数组存储 第一维度 行x，列y 第二维度 像素点对应图片的颜色平均差值
    let result = []
    // 这里不能使用foreach 否则会改变async的作用域
    console.time("计算时间")
    for(let j=0;j<mainPixelsInfo.length;j++) {
        console.log(`计算第${j}个像素点`)
        result[mainPixelsInfo[j].getPos()] = []
        for(let i=0;i<subImg.length;i++) {
            result[mainPixelsInfo[j].getPos()].push(await new ImageDiffPx(`./images/${subImg[i]}`,mainPixelsInfo[j].getRNA()).getDiff())
            console.log(`计算完成${j}个像素点与第${i}个图的差值`)
        }
    }
    console.log(result)
    console.timeEnd("计算时间")
})




// main.resize(25).toFile('one.png',()=>{
    // getRGB("one.png", function(err, pixels) {
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
        return color.rgb(this.r,this.g,this.b)
    }

    getPos() {
        return [this.x,this.y]
    }
}