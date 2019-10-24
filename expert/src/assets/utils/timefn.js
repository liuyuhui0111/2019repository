/*eslint-disable*/
function add0(m){return m<10?'0'+m:m }
export function formatDate(timeStamp,type){
    //shijianchuo是整数，否则要parseInt转换
        timeStamp = parseInt(timeStamp) === NaN ? 0 : parseInt(timeStamp)
        var time = new Date(timeStamp);
        var y = time.getFullYear();
        var m = time.getMonth()+1;
        var d = time.getDate();
        var h = time.getHours();
        var mm = time.getMinutes();
        var s = time.getSeconds();

        if(type && type.split(' ').length === 1){
            //只有一个字符串  
            if(type.indexOf('yy') != -1){
                // 返回年月日  否则返回时分秒
            return y
                    +type.match(/yy(\S*)mm/)[1]
                    +add0(m)
                    +type.match(/mm(\S*)dd/)[1]
                    +add0(d)
                    +type.match(/dd(\S*)/)[1];
            }else{
                return add0(h)
                    +type.match(/hh(\S*)mm/)[1]
                    +add0(mm)
                    +type.match(/mm(\S*)ss/)[1]
                    +add0(s)
                    +type.match(/ss(\S*)/)[1]
            }
        }else if(type && type.split(' ').length>1){
            // 返回年月日时分秒
             return y
                    +type.match(/yy(\S*)mm/)[1]
                    +add0(m)
                    +type.match(/mm(\S*)dd/)[1]
                    +add0(d)
                    +type.match(/dd(\S*)/)[1];
                    +' '
                    +add0(h)
                    +type.match(/hh(\S*)mm/)[1]
                    +add0(mm)
                    +type.match(/mm(\S*)ss/)[1]
                    +add0(s)
                    +type.match(/ss(\S*)/)[1]
        }else{
            return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s);
        }

        // return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s);

}

export function timeStampToHour(timeStamp,type){
    // 时间戳转换 时分秒
    timeStamp = isNaN(timeStamp) ? 0 : parseInt(timeStamp);
    if(timeStamp<=0){
        return '';
    }
    var hour = add0(parseInt(timeStamp/(1000*60*60),10));
    var minute = add0(parseInt((timeStamp%(1000*60*60))/(1000*60),10));
    var sec = add0(parseInt((timeStamp%(1000*60*60)%(1000*60))/(1000),10));

    return hour+'小时'+minute+'分';
}

export function timeStampToDay(timeStamp,type){
    // 时间戳转换 时分秒
    
    timeStamp = isNaN(timeStamp) ? 0 : parseInt(timeStamp);
    if(timeStamp<=0){
        return '';
    }
    var day = parseInt(timeStamp/(1000*60*60*24),10);
    var hour = add0(parseInt((timeStamp%(1000*60*60*24))/(1000*60*60),10));
    var minute = add0(parseInt((timeStamp%(1000*60*60))/(1000*60),10));
    var sec = add0(parseInt((timeStamp%(1000*60*60)%(1000*60))/(1000),10));
    if(day>0){
        return day+'天'+hour+'小时'+minute+'分'
    }else{
        return hour+'小时'+minute+'分'
    }
}
function getWeek(date) {
    var week;
    if(date.getDay() == 0) week = "星期日"
    if(date.getDay() == 1) week = "星期一"
    if(date.getDay() == 2) week = "星期二"
    if(date.getDay() == 3) week = "星期三"
    if(date.getDay() == 4) week = "星期四"
    if(date.getDay() == 5) week = "星期五"
    if(date.getDay() == 6) week = "星期六"
    return week;
}

export function setWeekByTime(curTime,lastTime){
    // 将lastTime时间转换成 今天  昨天 星期几 具体时间
    if(curTime === undefined || lastTime === undefined){
        return '';
    }
    let oneDay = 1*24*60*60*1000;       //一天
    let oneWeek = 7*oneDay;             //一周
    var time = new Date(lastTime);
    var y = time.getFullYear();
    var m = time.getMonth()+1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();


    if(curTime-lastTime < oneDay){
        // 如果小于1天 代表是今天 返回具体时间
        return add0(h)+':'+add0(mm);
    }else if(curTime-lastTime<oneWeek){
        // 大于一天 小于一周 展示周几
        return getWeek(time) + add0(h)+':'+add0(mm);
    }else{
        // 大于一天  返回2014-03-03 02:11:22
        return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s);
    }
    
   
}