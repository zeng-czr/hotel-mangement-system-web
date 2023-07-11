import request from "@/api/request"
// 获取房间列表数据
export function getRoomListApi(params:object) {
    return request({
        url: 'room',
        method: 'get',
        params

    })
}
// 新增房间信息
export function addRoomApi(data:Object) {
    return request({
        url: 'room',
        method: 'post',
        data
    })
}
// 获取所有房间类型列表
export function getAllRoomTypeListApi() {
    return request({
        url: 'roomType/all',
        method: 'get'
    })
}

// 获取所有楼层列表
export function getAllFloorListApi() {
    return request({
        url: 'floor/all',
        method: 'get'
    })
}
// 根据ID获取房间详情信息
export function getRoomApi(id:number) {
    return request({
        url: `room/${id}`,
        method: 'get'
    })
}
// 更新房间信息
export function editRoomApi(data:object) {
    return request({
        url: 'room',
        method: 'put',
        data
    })
}
// 删除房间信息
export function delRoomApi(id:number) {
    return request({
        url: `room/${id}`,
        method: 'delete'
    })
}

/**
 * 统计房间数量
 */
export function countRoomApi(){
    return request({
        url: 'room/count',
        method: 'get'
    })
}
// 根据指定日期获取空闲房间
export function getRoomListByDateApi(val:string) {
    return request({
        url: `room/getRoomListByDate/${val}`,
        method: 'get'
    })
}
