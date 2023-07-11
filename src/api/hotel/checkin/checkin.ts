import request from "../../request";

// 获取入住列表数据
export function getCheckInListApi(params:object) {
    return request({
        url: 'checkin',
        method: 'get',
        params

    })
}

// 退房
export function checkOutApi(id:number) {
    return request({
        url: `checkin/checkOut/${id}`,
        method: 'put'
    })
}
