// 拼接祝福字符串和结果字符串

const fs = require("fs")
const path = require("path")
const _ = require("lodash")


// 获取图片内容
let imgData = JSON.parse(fs.readFileSync(path.join(__dirname, '/imgData.json')).toString())

// 获取祝福信息
let blessData = JSON.parse(fs.readFileSync(path.join(__dirname, '/blessData.json')).toString())

let result = []

blessData.forEach((item, index) => {
    // 查找图片作者和祝福作者同名的数据
    let indexOfUser = imgData.findIndex(img=>img.author === item.dduser)
    if (indexOfUser !== -1) {
        // 保存对应的url数据
        let url = imgData[indexOfUser].url
        // 循环替换所有url符合的imgData
        while(indexOfUser !== -1) {
            // 如果找到了就拼接图像和祝福的信息
            result.push(Object.assign(JSON.parse(JSON.stringify(item)),JSON.parse(JSON.stringify(imgData[indexOfUser]))))
            // 并在图片集合中删除数据
            imgData.splice(indexOfUser,1)
            // 不能立即删除已经输入的祝福，否则会影响遍历，因此设定一个标记
            item.used = true
            // 查找下一个url
            indexOfUser = imgData.findIndex(img=>img.url === url)
        }
    }
});

// 继续处理剩余的祝福
blessData.filter(item=>!item.used).forEach(item => {
    result.push(Object.assign(item,imgData.splice(0,1)[0]))
    // 设定标记以便统计
    item.used = true
})

if (imgData.length) {
    console.log(`剩余图片${_.uniqBy(imgData,'url').length}个`)
    imgData.forEach(item=>{
        result.push(item)
    })
}

if (blessData.filter(item=>!item.used).length) {
    console.log(`剩余祝福${blessData.filter(item=>!item.used).length}个`)
}

fs.writeFile(path.join(__dirname, '/database.json'), JSON.stringify(result), err => {
    if(err) console.log(err)
})