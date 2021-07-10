// 拼接祝福字符串和结果字符串

const fs = require("fs")
const path = require("path")


// 获取图片内容
let imgData = JSON.parse(fs.readFileSync(path.join(__dirname, '/imgData.json')).toString())

// 获取祝福信息
let blessData = JSON.parse(fs.readFileSync(path.join(__dirname, '/blessData.json')).toString())

let result = []

blessData.forEach((item, index) => {
    // 查找图片作者和祝福作者同名的数据
    let indexOfUser = imgData.findIndex(img=>img.author === item.dduser)
    if (indexOfUser !== -1) {
        // 如果找到了就拼接图像和祝福的信息
        result.push(Object.assign(item,imgData[indexOfUser]))
        // 并在图片集合中删除数据
        imgData.splice(indexOfUser,1)
        // 不能立即删除已经输入的祝福，否则会影响遍历，因此设定一个标记
        item.used = true
    }
});

// 继续处理剩余的祝福
blessData.filter(item=>!item.used).forEach(item => {
    result.push(Object.assign(item,imgData.splice(0,1)[0]))
    // 设定标记以便统计
    item.used = true
})

if (imgData.length) {
    console.log(`剩余图片${imgData.length}个`)
    imgData.forEach(item=>{
        result.push(item)
    })
}

if (blessData.filter(item=>!item.used).length) {
    console.log(`剩余祝福${blessData.filter(item=>!item.used).length}个`)
}

fs.writeFile(path.join(__dirname, '/result.json'), JSON.stringify(result), err => {
    if(err) console.log(err)
})