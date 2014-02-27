'use strict';

angular.module('corsNgApp')
  .constant('Language', {
        common:{
            req:["The required input",'这是必填项'],
            back:['Back',"返回"],
            submit:['Submit',"提交记录"]
        },
        main:{
            theme:["Change Theme/Skin",'切换主题'],
            langTitle:["Switch Language",'切换语言'],
            ch:['Chinese',"中文"],
            en:['English',"英文"],
            cerulean:['Cerulean',"简洁"],
            classic:['Classic','经典'],
            slate:["Slate",'黑夜'],
            func:['Function','功能'],
            weather:['Weather','天气查询'],
            sportLive:['Sports Show','体育赛事表']
        },
        mapHistory:{
            title:['Path View',"轨迹显示"],
            mobileStation:['Select mobile station:',"请选择移动站:"],
            state:["Select the state:",'请选择解状态'],
            color:['Select the color to show:',"请选择要显示的颜色："],
            startTime:['Start Time:',"开始时间："],
            endTime:['End Time',"结束时间"],
            back:['Clear',"清空"],
            submit:['Show Path',"显示轨迹"]
        },
        online:{
            title:['Online Users Display',"在线用户显示"],
            userName:['User Name',"用户名"],
            serverType:["Server Type",'服务类型'],
            account:['Account',"资金"],
            expirationDate:['Expiration Date',"过期时间"]
        },
        userManager:{
            title:['UserManager',"用户管理"],
            add:['Add User',"增加用户"],
            userName:['User Name',"用户名"],
            serverType:["Server Type",'服务类型'],
            account:['Account',"资金"],
            expirationDate:['Expiration Date',"过期时间"],
            phone: ['Phone',"电话"],
            online: ['Online State',"在线状态"]
        },
        zone:{
            title:['Zone Manager',"作业区域管理"],
            add:['Add Zone',"增加作业区域"],
            zoneName:['Zone Name',"作业区域名"],
            back:['Back',"返回"],
            submit:['Submit',"提交记录"],
            points:["Points",'经纬度集合']
        },
        log:{
            title:['Diary Display',"日志显示"],
            userName:['User Name',"用户名"],
            logTime:["Log Time",'记录时间'],
            content:['content',"内容"]
        },
        fileDownload:{
            title:['File List Download',"文件列表下载"],
            fileName:["File Name","文件名"]

        }

    });
