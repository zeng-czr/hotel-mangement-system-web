import request from "@/api/request";
// 获取楼层列表数据
export function getFloorListApi(params:object) {
    return request({
        url: 'floor',
        method: 'get',
        params

    })
}
// 新增楼层信息
export function addFloorApi(data:Object) {
    return request({
        url: 'floor',
        method: 'post',
        data
    })
}
// 根据ID获取楼层详情信息
export function getFloorApi(id:number) {
    return request({
        url: `floor/${id}`,
        method: 'get'
    })
}
// 更新楼层信息
export function editFloorApi(data:object) {
    return request({
        url: 'floor',
        method: 'put',
        data
    })
}
// 删除楼层信息
export function delFloorApi(id:number) {
    return request({
        url: `floor/${id}`,
        method: 'delete'
    })
}
