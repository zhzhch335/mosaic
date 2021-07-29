## 千图成像生成

## 这是啥

这是一个千图成像工具，制作一个由若干小图根据颜色匹配进行拼接而成的大图图像

## 长啥样

输入一个大图![大图](https://github.com/zhzhch335/mosaic/blob/0b4e8a62e80196c5f84c023331daee5c5c41c457/readmeAssets/main.png?raw=true)

和若干小图![小图](https://github.com/zhzhch335/mosaic/blob/0b4e8a62e80196c5f84c023331daee5c5c41c457/readmeAssets/image.png?raw=true)

最后出现（当然如果最后要实际使用的话 一要选好图 二要做做调色）

![result](https://github.com/zhzhch335/mosaic/blob/139909f839bccc40f692d3c5104009d12cde43b0/readmeAssets/result.png?raw=true)

## 啥原理

将大图像素化为若干个像素点，然后计算各个像素点与传入小图的颜色平均差值，保证每个小图都能出现的前提下匹配最优的颜色差值

## 怎么用

首先你得有nodejs并且运行```npm install```安装所有依赖

将大图放到根目录下，命名为main.png(如果是jpg的话你也可以去源码里修改一下)

将小图放到```\images\```目录下（目录不存在根目录下创建一下）

运行index_getDiff.js，计算图片差值（通过修改```MAIN_WIDTH```的值可以提高精度但是计算时间会指数提升），这一步可能有点慢（之后寻思寻思咋优化），我大概83张图625个像素点用了5分钟左右，生成一个result.json文件，这个文件里保存了所有图片跟每个像素点的差值

运行index.js，进行图片拼接，图片结果会输出为根目录下的result.png，小图的顺序会输出为dataResult.json文件（用处不大其实）

## 其他

这个项目其实是我做一个互动网页的一部分：

![动图预览](https://github.com/zhzhch335/mosaic/blob/0b4e8a62e80196c5f84c023331daee5c5c41c457/readmeAssets/show.gif?raw=true)

因此输出的dataResult.json文件中实际除了顺序```index```路径```url```之外还包括了作者信息，因此我存放的image目录做了两级目录，目录格式为作者名称_作者id：

![目录结构](https://github.com/zhzhch335/mosaic/blob/0b4e8a62e80196c5f84c023331daee5c5c41c457/readmeAssets/dir.png?raw=true)

以保证输出的dataResult.json呈现这样的格式：

``````json
{
    "index": 8,
    "author": "在下智疯",
    "uid": "7934774",
    "url": "./images/在下智疯_7934774/c3964aa748c652e071b5775bd0b29a36effd4a1d.png"
}
``````

另外将其他人的生日祝福拼接在这个结果中以提供给我网页使用，利用了dataResult/combination.js这个文件，不过这个跟这个项目基本没啥关系了，我就不啰嗦了。

