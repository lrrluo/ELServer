'use strict';

angular.module('easyApp')
  .constant('Language', {
        common:{
            req:["The required input",'这是必填项'],
            back:['Back',"返回"],
            sear : ['Search','查询'],
			reflesh : ['Reflesh','刷新'],
            submit:['submit',"提交记录"]
        },
        train:{
            title : ["Train query",'火车时刻表'],
	        buyTick : ["Go to buy",'购买车票'],
	        des_error : ["Please fill the start city or target city",'请填上出发城市或目标城市'],
	        time_error : ["Pleae fill the date",'请选择相应的出发日期'],
	        sCity : ["Start City",'请输入出发点城市'],
	        eCity : ["Target City",'请输入结束城市'],
            no : ["Train number",'列车号'],
            route : ["Route",'线路'],
            time : ["Start and arrivel time",'出发与到达时间'],
            duration : ["Duration",'经历时长'],
            buss : ["Business site",'商务座'],
            spec : ["Special site",'特等座'],
            firstClass : ["First Class site",'一等座'],
            secondClass : ["Second Class site",'二等座'],
            highClass : ["High Class Soft sleeper",'高级软卧'],
            softBed : ["Soft sleeper",'软卧'],
            hardBed : ["Hard sleeper",'硬卧'],
            softSit : ["Soft Site",'软座'],
            hardSit : ["Hard Site",'硬座'],
            noSit : ["No Site",'无座'],
            other : ["Other",'其它'],
            remark : ["Remark",'备注']
        },
        zhibo:{
            title : ["sports live show",'体育直播表'],
            time : ["time",'直播时间'],
            ls : ["Early Morning",'凌晨'],
            day : ["DayTime",'白天'],
            night : ["NightTime",'晚上'],
	        address : ["Live Address",'直播地址'],
            content : ["match",'赛事']
        },
        bus:{
            title : ["GuangZhou bus",'广州实时公交'],
            totalStop : ["The total stops:",'全程公车站数为:'],
            busNumber : ["Amount of bus",'公交数量'],
            errorBus : ['The Bus number is wrong,Please fill another Bus number.', '对不起，你输入的名字错误或是暂时没有数据，请重新输入.'],
            placeholderBus : ["Please enter the bus number","请输入公交车代号"]
        },
        weather:{
            highTem: ['Highest Temperature','最高温度'],
            lowTem: ['Lowest Temperature','最低温度'],
            title:["Whether forcast",'天气查询'] ,
            placeholderCity: ["Please enter the city","请输入城市名称"],
            cityName : ['City Name:', '城市名称'],
            errorCity : ['The City name is wrong,Please fill another city name.', '输入的城市或省名字错误，请重新输入.']
        },
		service:{
			bus:["GuangZhou RealTime bus",'广州实时公交'],
			func:['Function','功能'],
			weather:['Weather','天气查询'],
			sportLive:['Sports Show','体育赛事表'],
			train:['Train query','火车时刻查询表']
		},
        main:{
	        index:['Index','功能列表']
	        ,aboutMe:['About Me','关于我们']
	        ,advice:['Give Advice','给建议']
	        ,login:['Login','登录']
            ,theme:["Change Theme/Skin",'切换主题'],
            bus:["GuangZhou RealTime bus",'广州实时公交'],
            langTitle:["Switch Language",'切换语言'],
            ch:['Chinese',"中文"],
            en:['English',"英文"],
            cerulean:['Cerulean',"简洁"],
            classic:['Classic','经典'],
            slate:["Slate",'黑夜'],
            func:['Function','功能'],
            weather:['Weather','天气查询'],
            sportLive:['Sports Show','体育赛事表'],
            train:['Train query','火车时刻查询表']
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
