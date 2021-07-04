// 计算每个图片和像素点的差值

const _ = require("lodash")


// 精度，将原图缩小到这个数值的方形进行颜色计算，数值越大越准确但计算速度越慢
const PRECISION = 50

const ColorRNA = require("color-rna")

async function diff (filename, colorRna = new ColorRNA()) {
    const extension = filename.replace(/^.*\./,"")
    const img = sharp(`./images/${filename}`)
    let buffer = await img.resize(MAIN_WIDTH).toBuffer()
    let pixels = await getPixels(buffer, `image/${extension}`)

    console.log(pixels)

    // colorRna.diff_DE1976_Than()
}

function calDiff(filename, mainPixels) {
    let diffResult = []
    mainPixels.forEach(pixel => {
        const color = new ColorRNA().rgb(pixel.r,pixel.g,pixel.b)
        diffResult.push(diff)
        
    })
    return diffResult
}

module.exports = calDiff