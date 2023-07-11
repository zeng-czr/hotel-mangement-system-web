import request from "../../request"

// 获取登录会员信息
export function getLoginMemberInfoApi(){
    return request({
        url: 'hotel/getLoginMemberInfo',
        method: 'get'
    })
}

// 更新会员信息
export function updateMemberApi(data:object){
    return request({
        url: 'hotel/updateMember',
        method: 'put',
        data
    })
}

// 获取我的预定列表
export function getMyReserveListApi(params:object) {
    return request({
        url: 'hotel/getMyReserveList',
        method: 'get',
        params
    })
}

// 订单付款
export function paymentApi(id:number){
    return request({
        url: `hotel/payment/${id}`,
        method: 'put'
    })
}

// 更新密码
export function updateMemberPwdApi(data:object) {
    return request({
        url: 'hotel/updateMemberPwd',
        method: 'put',
        data
    })
}
// 获取会员列表数据
export function getMemberListApi(params:object) {
    return request({
        url: 'member',
        method: 'get',
        params

    })
}
// 根据ID获取会员详情信息
export function getMemberApi(id:number) {
    return request({
        url: `member/${id}`,
        method: 'get'
    })
}
// 会员充值
export function rechargeApi(data:Object) {
    return request({
        url: 'member/recharge',
        method: 'put',
        data
    })
}
// 删除会员信息
export function deleteMemberApi(id:number) {
    return request({
        url: `member/${id}`,
        method: 'delete'
    })
}

// 获取我的充值记录
export function getMyRechargeRecordListApi(params:object) {
    return request({
        url: 'hotel/getMyRechargeRecordList',
        method: 'get',
        params
    })
}
