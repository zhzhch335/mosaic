// 对计算出的图片差值进行转置 输出文件名列表和单个像素的差值为一组的二位数组
function tranposDiff (diff) {
    let files = []
    let newDiff = [] // 根据像素点存放数据
    for (let img in diff) {
        files.push(img)
        diff[img].forEach((item, index) => {
            if (!newDiff[index]) newDiff[index] = []
            newDiff[index].push(item)
        })
    }
    return {
        files,
        newDiff
    }
}

module.exports = tranposDiff