import request from "../../request"

// 根据房间ID获取房间详情信息
export function getRoomDetailApi(id:number) {
    return request({
        url: `hotel/detail/${id}`
    })
}

// 根据房间ID获取已经预订的日期数据
export function getDatesByRoomIdApi(id:number) {
    return request({
        url: `hotel/getDatesByRoomId/${id}`,
        method: 'get'
    })
}
