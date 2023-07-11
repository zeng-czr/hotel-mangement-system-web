import request from "../../request"

// 获取房间类型列表数据
export function getRoomTypeListApi(params:object) {
    return request({
        url: 'roomType',
        method: 'get',
        params

    })
}

// 新增房间类型
export function addRoomTypeApi(data:object) {
    return request({
        url: 'roomType',
        method: 'post',
        data
    })
}

// 根据ID获取房间类型详情信息
export function getRoomTypeApi(id:number) {
    return request({
        url: `roomType/${id}`,
        method: 'get'
    })
}

// 更新房间类型信息
export function editRoomTypeApi(data:object) {
    return request({
        url: 'roomType',
        method: 'put',
        data
    })
}
// 删除房间类型信息
export function delRoomTypeApi(id:number) {
    return request({
        url: `roomType/${id}`,
        method: 'delete'
    })
}
