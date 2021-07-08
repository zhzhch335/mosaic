const fs = require("fs");

let folders = fs.readdirSync("images/");
let fileList = []
folders.forEach(item=>{
    let images = fs.readdirSync(`images/${item}/`)
    images.forEach(image => {
        fileList.push(`${item}/${image}`)
    })
})
module.exports = fileList