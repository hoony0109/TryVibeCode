
module.exports.DateToYYYYMMddHHmmss = function(date){
    let year = date.getFullYear();
    let month = date.getMonth()+1;   if(month<10) month = '0' + month;
    let day = date.getDate();        if(day<10) day = '0' + day;
    let hour = date.getHours();      if(hour<10) hour = '0' + hour;
    let min = date.getMinutes();     if(min<10) min = '0' + min;
    let sec = date.getSeconds();     if(sec<10) sec = '0' + sec;
    
    return year.toString()+month.toString()+day.toString()+hour.toString()+min.toString()+sec.toString();
}

module.exports.YYYYMMddHHmmssToDate = function(dateStr){
    var year = dateStr.substring(0, 4);
    var month = dateStr.substring(4, 6);
    var day = dateStr.substring(6, 8);
    var hour = dateStr.substring(8, 10);
    var minute = dateStr.substring(10, 12);
    var second = dateStr.substring(12, 14);
    
    return new Date(year, month-1, day, hour, minute, second);
}
