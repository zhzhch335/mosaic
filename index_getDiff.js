const MAIN_WIDTH = 25

const sharp = require('sharp')

// 主图实例化
const main = sharp('main.png')
// 引入小图路径
const subImg = require("./getsubImg")

// 工具和类
const ImageDiffPx = require("./imageDiffPx")
const getRGB = require('./utils/getRGB')
const sortByRGB = require("./utils/sortByRGB")
const fs = require("fs")
const MainPixel = require("./MainPixel")


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
    // 使用二维数组存储 第一维度 图片名称 第二维度 图片对应各个像素点的偏差值
    let result = {}
    try {
        result = JSON.parse(fs.readFileSync("./result.json").toString())
    }
    catch {
        console.log("result.json 文件不存在，从头开始计算")
    }
    // 这里不能使用foreach 否则会改变async的作用域
    for(let i=0;i<subImg.length;i++) {
        console.log(`计算第${i}个图`)
        // 如果已经计算过则跳过
        if (subImg[i] in result) {
            console.log(subImg[i],"已经计算过了")
            continue
        } else {
            result[subImg[i]] = []
        }
        for(let j=0;j<mainPixelsInfo.length;j++) {
            result[subImg[i]].push(await new ImageDiffPx(`./images/${subImg[i]}`,mainPixelsInfo[j].getRNA()).getDiff())
        }
        // 将计算结果写入文件
        fs.writeFile('./result.json', JSON.stringify(result), function(err) {
            console.log("已写入文件")
            if (err) {
                return console.error(err);
            }
        })
    }
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