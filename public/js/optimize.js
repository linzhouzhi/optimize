/**
 * Created by lzz on 17/4/3.
 */


/**
 * 遍历不定长度的二维数组
 * @param start
 * @param array
 * @param results
 * @param indexs
 * 比如 [ [ 1, 2.5, 4 ], [ 1, 4, 7, 10 ] ]
 * [ [ 1, 1 ],
 [ 1, 4 ],
 [ 1, 7 ],
 .....
 [ 4, 10 ] ]
 */
function change_json_param( array ) {
    var results = []; //排列后的结果
    var indexs = [];

    function specialSort(start, array, results, indexs) {
        start++;
        var len = array.length;
        if (start > len - 1) {
            return;
        }
        if (!indexs[start]) {
            indexs[start] = 0;
        }
        if (!(array[start] instanceof Array)) {
            array[start] = [array[start]];
        }
        for (indexs[start] = 0; indexs[start] < array[start].length; indexs[start]++) {
            specialSort(start, array, results, indexs);
            if (start == len - 1) {
                var temp = [];
                for (var i = len - 1; i >= 0; i--) {
                    if (!(array[start - i] instanceof Array)) {
                        array[start - i] = [array[start - i]];
                    }
                    temp.push(array[start - i][indexs[start - i]]);
                }
                results.push(temp);
            }
        }
    }
    specialSort(-1, array, results, indexs);
    return results;
}

/**
 * 求 string 类型的参数 组合情况
 * @param array
 * @returns {Array}
 * 比如 [ '-direct', '-hello' ]
 [ '',
 '-hello',
 '-direct',
 '-direct-hello']
 */
function change_param_string( array ) {
    var len = array.length;
    console.log(array);
    var res = [];
    var tag = [];
    function build(array, tag, n){
        var str = "";
        if( n==len ) {
            for(var i=0; i<len; i++){
                if(tag[i]==1){
                    str += array[i] + " ";
                }
            }
            res.push(str);
            return;
        }
        tag[n] = 0;  //每一个元素在子集中都有两种状态：‘1’表示出现，'0'表示不出现
        build(array,tag,n+1);
        tag[n] = 1;
        build(array,tag,n+1);
    }
    build(array,tag,0);
    console.log(res);
    return res;
}

/**
 * 将传入进来的参数变成数组
 * 比如 1-4-2 转 [ 1, 2.5, 4 ]
 */
function paramToArr( param ) {
    console.log(param);
    if( param instanceof Array ){
        return param;
    }
    var arr_param = param.split(",");
    if( arr_param.length != 1 ){
        return arr_param;
    }
    var arr_param = param.split("-");
    var start = parseInt(arr_param[0]);
    var end = parseInt(arr_param[1]);
    var split = parseInt(arr_param[2]);
    var dist = end - start;
    var range = dist / split;
    var tmp_arr = [];
    for( var j = 0; j < 3; j++ ){
        if( j == 0 ){
            tmp_arr[j] = start;
        }else{
            var temp = start + j*range;
            if( temp < end ){
                tmp_arr[j] = start + j*range;
            }
        }
    }
    tmp_arr.push(end);
    return tmp_arr;
}

/**
 * 获取参数类型的数据
 * @param param_json
 * @returns {Array}
 */
function get_json_param(param_json, param_json_keys) {
    var param_list = [];
    for(var key in param_json) {
        param_json_keys.push(key);
        var tmp = paramToArr( param_json[key] );
        param_list.push(tmp);
    }
    return param_list;
}

/**
 * 获取所有的参数组合
 * @param param_list
 * @param param_string
 */
function get_all_param(param_json_keys, param_list, param_string) {
    var result = [];
    // 多个数组的所有排列情况
    var param_json_res = change_json_param(param_list);
    console.log(param_json_res);
    var param_string_res = change_param_string(param_string);
    console.log(param_string_res);
    //打印所有的情况
    for( var i = 0; i< param_json_res.length; i++ ){
        var param_json_item = param_json_res[i];
        var str = " ";
        for( var j = 0; j < param_json_item.length; j++ ){
            str +=  param_json_keys[j] + " " + param_json_item[j] + " ";
        }
        for( var k = 0; k < param_string_res.length; k++ ){
            var temp_str = "";
            temp_str = str + param_string_res[k];
            result.push(temp_str);
        }
    }
    return result;
}

/**
 * 解析参数
 * @param param_json
 * @param param_string
 */
function gen_param_list(param_json, param_string) {
    // 获取json 参数类型的数据
    var param_json_keys = []; // 参数的 key
    var param_list = get_json_param(param_json, param_json_keys);
    console.log(param_list);
    // 获取所有的参数组合
    var all_param = get_all_param(param_json_keys, param_list, param_string);
    return all_param;
}


/**
 * 生成 uuid
 * @returns {string}
 */
function get_uuid() {
    function S4() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

/**
 * 设置 uuid
 */
function set_cookie_uuid()
{
    var uuid = get_cookie( "uuid" );
    if( uuid == null || uuid == "" ){
        var Days = 360;
        var exp = new Date();
        exp.setTime(exp.getTime() + Days*24*60*60*1000);
        document.cookie = "uuid="+ escape ( get_uuid() ) + ";expires=" + exp.toGMTString() + ";path=/";
    }
}

/**
 * 获取 cookie
 * @param name
 * @returns {null}
 */
function get_cookie(name)
{
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}


// 往客户端种植 cookie
set_cookie_uuid();