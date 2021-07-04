const getPixels = require("get-pixels")
const _ = require("lodash")

function getRGB(buffer, type, callback) {
    getPixels(buffer, `image/${type || 'png'}`, function(err,pixels) {
        if (err) {
            console.log("Error",err)
        }
        let pixelsU8Arr = pixels.data
        let pixelsArray = []
        pixelsU8Arr.forEach(item=>{
            pixelsArray.push(item)
        })
        pixelsArray = _.chunk(pixelsArray,4)
        // 剔除alpha通道
        let result = pixelsArray.map( item => [item[0],item[1],item[2]])
        callback(result)
    })
}

module.exports = getRGB