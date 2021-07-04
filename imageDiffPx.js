// 计算图片和一个像素点的平均差值
const _ = require("lodash")
const sharp = require('sharp')
const getRGB = require('./utils/getRGB')
const ColorRNA = require("color-rna")


// 精度，将原图缩小到这个数值的方形进行颜色计算，数值越大越准确但计算速度越慢
const PRECISION = 50

class ImageDiffPx {
    constructor (url, colorRNA) {
        this.extension = url.replace(/^.*\./,"")
        this.url = url
        this.colorRNA = colorRNA
    }

    async getDiff() {
        const main = sharp(this.url)
        const buffer = await main.resize(PRECISION).toBuffer()
        let sumDiff = 0
        const rgbArray = await getRGB(buffer, this.extension)
        rgbArray.forEach(item => {
            sumDiff += this.colorRNA.diff_DE1976_Than(new ColorRNA().rgb(item[0],item[1],item[2]))
        })
        this.diff = sumDiff / rgbArray.length
        return this.diff
        // main.resize(PRECISION).toBuffer().then(buffer => {
        //     let sumDiff = 0
        //     getRGB(buffer,this.extension, rgbArray => {
        //         rgbArray.forEach(item => {
        //             sumDiff += colorRNA.diff_DE1976_Than(new ColorRNA().rgb(item[0],item[1],item[2]))
        //         })
        //         this.diff = sumDiff / rgbArray.length
        //         // console.log("相似度:",this.diff)
        //     })
        // })
    }
}

module.exports = ImageDiffPx