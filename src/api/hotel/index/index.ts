import request from "../../request"

// 获取首页数据
export function getIndexApi() {
    return request({
        url: 'hotel/getIndex',
        method: 'get'
    })
}

// 会员注册
export function registerApi(data:object){
    return request({
        url: 'hotel/register',
        method: 'post',
        data
    })
}

// 会员登录
export function loginApi(data:object) {
    return request({
        url: 'hotel/login',
        method: 'post',
        data
    })
}

// 获取所有楼层和房间类型列表
export function getAllRoomTypeAndFloorApi() {
    return request({
        url: 'hotel/getAllRoomTypeAndFloor',
        method: 'get'
    })
}

// 根据房间类型ID和楼层ID获取房间列表
export function getRoomListApi(params:object) {
    return request({
        url: '/hotel/getRoomList',
        method: 'get',
        params
    })
}

// 会员预订房间
export function addReserveApi(data:object) {
    return request({
        url: 'hotel/addReserve',
        method: 'post',
        data
    })
}
