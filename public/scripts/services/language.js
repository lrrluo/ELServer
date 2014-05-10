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
			zhibo:['Sports Show','体育赛事表'],
			train:['Train query','火车时刻查询表']
		},
        main:{
	        service:['Index','功能列表']
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
        }

    });
