import request from "../../request"

// 统计数据
export function getIndexTotalApi() {
    return request({
        url: 'home',
        method: 'get'
    })
}
