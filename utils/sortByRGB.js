// 根据相同rgb点的数量升序排列
function trans (data) {
    let cache = {} // cache存储的键是rgb的平方和，值是这个平方和在indices数组中的下标
    let indices = [] // 数组中的每一个值是一个数组，数组中的每一个元素是原数组中相同eid的下标
    data.forEach((item, i) => {
      let eid = Math.pow(item.r,2) + Math.pow(item.g,2) + Math.pow(item.b,2)
      let index = cache[eid]
      if (index !== undefined) {
        indices[index].push(i)
      } else {
        cache[eid] = indices.length
        indices.push([i])
      }
    })
    /**
     * 此时，cache：{cat: 0, dog: 1, pig: 2}
     * indices: [[0, 1, 3, 5], [2, 6], [4]]
     * indices中的第1项是eid为cat的数组下标
     * indices中的第2项是eid为dog的数组下标
     * indices中的第3项是eid为pig的数组下标
     */
    indices.sort((a,b) => {
        if (a.length > b.length) {
            return 1
        } else if (a.length === b.length && a[0]>b[0]) {
            return 1
        } else {
            return -1
        }
    })
    let result = []
    indices.forEach(item => {
      item.forEach(index => {
        result.push(data[index]) // 依次把index对应的元素data[index]添加进去即可
      })
    })
    
    return result
}

module.exports = trans