import request from "../../request"

// 获取预订列表数据
export function getReserveListApi(params:object) {
    return request({
        url: 'reserve',
        method: 'get',
        params

    })
}
// 根据ID获取预订详情信息
export function getReserveApi(id:number) {
    return request({
        url: `reserve/${id}`,
        method: 'get'
    })
}
// 退订
export function unsubscribeApi(id:number) {
    return request({
        url: `reserve/unsubscribe/${id}`,
        method: 'put'
    })
}
// 确认收款
export function paymentApi(id:number) {
    return request({
        url: `reserve/payment/${id}`,
        method: 'put'
    })
}
// 保存入住信息
export function checkinApi(data:object) {
    return request({
        url: 'reserve/checkIn',
        method: 'post',
        data
    })
}

// 后台添加预订记录
export function addReserveApi(data:object) {
    return request({
        url: 'reserve/addReserve',
        method: 'post',
        data
    })
}

// 后台保存入住信息
export function addCheckinApi(data:object) {
    return request({
        url: 'checkin/addCheckin',
        method: 'post',
        data
    })
}
