const MAIN_WIDTH = 25

const sharp = require('sharp')
var gm = require("gm")

// 主图实例化
const main = sharp('main.png')
// 引入小图路径
const subImg = require("./getsubImg")

// 工具和类
const ImageDiffPx = require("./imageDiffPx")
const getRGB = require('./utils/getRGB')
const sortByRGB = require("./utils/sortByRGB")
const fs = require("fs")
const tranposDiff = require('./utils/tranposDiff')
const _ = require('lodash')
const MainPixel = require('./MainPixel')


// 获取小图数量，计算每个图出现的最大次数
const MAX_TIME = Math.ceil(Math.pow(MAIN_WIDTH,2) / subImg.length)
let mainPixelsInfo = []

main.resize(MAIN_WIDTH).toBuffer().then(async buffer => {
    const pixelsArray = await getRGB(buffer, 'png')
    // 设定像素位置
    mainPixelsInfo = pixelsArray.map((item,index)=>new MainPixel(item[0],item[1],item[2],Math.floor(index/MAIN_WIDTH),index%MAIN_WIDTH))
    // 根据RGB数量升序排列像素点
    mainPixelsInfo = sortByRGB(mainPixelsInfo)
    // 记录每个图片使用的次数，避免使用过于频繁
    let imageDict = {}
    subImg.forEach(item => {
        imageDict[item] = 0
    })
    // 读取已经计算好的颜色差值
    let diff = JSON.parse(fs.readFileSync("./result.json").toString())
    let {newDiff, files} = tranposDiff(diff)
    mainPixelsInfo.forEach((item,index) => {
        let findIndex = _.indexOf(newDiff[index],_.min(newDiff[index])) // 找到最大值的索引
        if (imageDict[files[findIndex]] >= MAX_TIME) {
            console.log("多的是",findIndex)
            // 如果当前这幅图已经超过使用次数,则将其所有的偏差值设为最大
            newDiff = newDiff.map((item)=> {
                item[findIndex] = Infinity
                return item
            })
            findIndex = _.indexOf(newDiff[index],_.min(newDiff[index]))
        }
        imageDict[files[findIndex]] += 1 //使用次数+1
        item.setUrl(`./images/${files[findIndex]}`)
    })
    let gmInstance = gm(mainPixelsInfo[0].url) // 实例化第一张图片开始拼接
    let currentY = 0 // 存储当前行号
    let bufferList = [] // 每行输出一个buffer用于最后拼接
    let completeFile = 0 //记录完成的图片数量
    mainPixelsInfo.forEach(item=>{
        sharp(item.url).resize(40,40,{
            fit: "fill"
        }).toFile(`./result/${item.x}-${item.y}.png`).then(err=>{
            completeFile++
        })
    })
    let interval = setInterval(()=>{
        if (completeFile === 625) {
            clearInterval(interval)
            let completeLine = 0
            for(let i=0;i<25;i++) {
                let gmInstance = gm(`./result/${i}-0.png`) // 初始化第一张
                for (let j=1;j<25;j++) {
                    gmInstance = gmInstance.append(`./result/${i}-${j}.png`,true)
                }
                gmInstance.write(`./result/line-${i}.png`,()=>{completeLine++})
            }
            let subInterval = setInterval(()=>{
                if (completeLine === 25) {
                    clearInterval(subInterval)
                    let subGmInstance = gm(`./result/line-${0}.png`) // 初始化第一张
                    for(let i=1;i<25;i++) {
                        subGmInstance.append(`./result/line-${i}.png`)
                    }
                    subGmInstance.write('result.png',()=>{})
                }
            })
        }
    })
    // mainPixelsInfo.sort((a,b)=> {
    //     if (a.y < b.y) {
    //         return -1
    //     } else if (a.y === b.y) {
    //         if (a.x < b.x) {
    //             return -1
    //         } else {
    //             return 1
    //         }
    //     } else {
    //         return 1
    //     }
    // })
    // for(let i = 0;i < mainPixelsInfo.length; i++) {
    //     if (currentY != mainPixelsInfo[i].y) {
    //         currentY = mainPixelsInfo[i].y
    //         let imgBuffer = await new Promise(resolve => {
    //             gmInstance.toBuffer((err,buffer) => {
    //                 resolve(buffer)
    //             })
    //         })
    //         bufferList.push(imgBuffer)
    //         gmInstance = null
    //         gmInstance = gm(mainPixelsInfo[i].url).resize(10,10) // 实例化下一行第一张图片开始拼接
    //     } else {
    //         gmInstance = gmInstance.append(gm(mainPixelsInfo[i].url).resize(10,10),true) // 向右拼接图片
    //     }
    // }
    // resultInstance.write("result.png",err=>console.log(err))
})