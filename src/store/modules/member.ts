import { defineStore } from 'pinia'
export const useMemberStore = defineStore({
    id: 'memberStore',
    state: ()=> {
        return {
            // 会员登录token
            memberToken: '',
            // 登录会员信息
            memberInfo: {
                memberIcon: '',//会员头像
                nickname: ''//会员昵称
            }
        }
    },
    getters: {},
    actions: {
        // 设置会员登录token
        setMemberToken(token:string){
            this.memberToken = token
        },
        // 设置登录会员的信息
        setMemberInfo(memberInfo: any){
            this.memberInfo = memberInfo
        },
        // 更新部分会员信息
        setMemberPartInfo(memberInfo:any){
            this.memberInfo.memberIcon = memberInfo.userIcon
            this.memberInfo.nickname = memberInfo.nickname
        },
    },
    persist: true
})
