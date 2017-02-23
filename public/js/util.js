/**
 * 加载一个文件, 并把返回值作为window的属性
 * @param {string'} path 文件路径,相对于 window.static_url
 * @param {string} name 属性名
 */
function load( path, name )
{
	if ( -1 != path.indexOf( '/' ) )
	{
		path = window.STATIC_URL + path + '.js';
	}
	seajs.use( path, function( re ){
		console.debug( re );
		if ( null === re )
		{
			return;
		}
		window[ name ] = re;
	} );
}

/**
 * 将数组里的指定值移除掉
 * @param {array} arr 数组
 * @param {mixed} val 移除的项, 如果是函数, 返回 true 表示要移除
 */
function sparrow_array_unset( arr, val )
{
	var new_arr = [];
	if ( 'function' === typeof val )
	{
		for (  var i = 0; i < arr.length; i++ )
		{
			if ( val( arr[ i ] ) )
			{
				continue;
			}
			new_arr.push( arr[ i ] );
		}
	}
	else
	{
		for (  var i = 0; i < arr.length; i++ )
		{
			if ( arr[ i ] == val )
			{
				continue;
			}
			new_arr.push( arr[ i ] );
		}
	}
	return new_arr;
}

/**
 * 数组排序
 */
function sparrow_array_sort( arr, do_type )
{
	if ( !arr.length )
	{
		return;
	}
	var compare_func;
	//如果传入函数, 将由函数来决定是不是要交换
	if ( 'function' === typeof do_type )
	{
		compare_func = do_type;
		do_type = 3;
	}
	var arr_len = arr.length - 1;
	var temp = null;
	for( var i = 0; i < arr_len; i++ )
	{
		var flag = false;
		for( var j = 0; j < arr_len - i; j++ )
		{
			var need_change = false;
			//从大到小
			if ( 1 === do_type )
			{
				need_change = ( arr[ j ] > arr[ j + 1 ] );
			}
			//从小到大
			else if ( 2 === do_type )
			{
				need_change = ( arr[ j ] < arr[ j + 1 ] );
			}
			else if ( 3 === do_type )
			{
				need_change = compare_func( arr[ j ], arr[ j + 1 ] );
			}
			if( need_change )
			{
				temp = arr[ j ];
				arr[ j ] = arr[ j + 1 ];
				arr[ j + 1 ] = temp;
				flag = true;
			}
		}
		if( !flag )
		{
			break;
		}
	}
}

/**
 * 对象合并，返回新对象
 */
function sparrow_object_merge( object_to, object_from )
{
	var result = {};
	if ( 'object' !== typeof object_from || 'object' !== typeof object_to )
	{
		return;
	}
	for ( var p in object_to )
	{
		result[ p ] = object_to[ p ];
	}
	for ( p in object_from )
	{
		result[ p ] = object_from[ p ];
	}
	return result;
}

/**
 * 对象合并，直接替换原来的对象
 */
function sparrow_object_append( object_to, object_from )
{
	if ( 'object' !== typeof object_from )
	{
		return;
	}
	for ( var p in object_from )
	{
		object_to[ p ] = object_from[ p ];
	}
}

/**
 * 复制一个对象
 */
function sparrow_copy_object( obj ) {
	var result = {};
	if ( 'object' !== typeof obj )
	{
		return result;
	}
	for ( var p in obj )
	{
		result[ p ] = obj[ p ];
	}
	return result;
}

/**
 * 复制数组
 */
function sparrow_copy_array( arr ) {
	var result = [];
	if ( 'object' !== typeof arr || !arr.length )
	{
		return result;
	}
	for ( var i = 0; i < arr.length; i++ )
	{
		result.push( arr[ i ] );
	}
	return result;
}

/**
 * 统计对象的length
 */
function sparrow_object_length( obj )
{
	var i = 0;
	for ( var p in obj ) {
		++i;
	}
	return i;
}

/**
 * 和php的htmlspecialchars_decode的功能一样
 */
function htmlspecialchars_decode( string, quote_style )
{
	var optTemp = 0, i = 0, noquotes = false;
	if ( 'undefined' == typeof quote_style )
	{
		quote_style = 2;
	}
	string = string.toString().replace( /&lt;/g, '<' ).replace( /&gt;/g, '>' );
	var OPTS = {
	  'ENT_NOQUOTES': 0,
	  'ENT_HTML_QUOTE_SINGLE': 1,
	  'ENT_HTML_QUOTE_DOUBLE': 2,
	  'ENT_COMPAT': 2,
	  'ENT_QUOTES': 3,
	  'ENT_IGNORE': 4
	};
	if ( 0 === quote_style )
	{
		noquotes = true;
	}
	if ( 'number' !== typeof quote_style )
	{
		quote_style = [].concat(quote_style);
		for ( i = 0; i < quote_style.length; i++ )
		{
			if ( 0 === OPTS[ quote_style[ i ] ] )
			{
				noquotes = true;
			}
			else if ( OPTS[quote_style[ i ] ] )
			{
				optTemp = optTemp | OPTS[ quote_style[ i ] ];
			}
		}
		quote_style = optTemp;
	}
	if ( quote_style & OPTS.ENT_HTML_QUOTE_SINGLE )
	{
		string = string.replace( /&#0*39;/g, "'" );
	}
	if ( !noquotes )
	{
		string = string.replace( /&quot;/g, '"' );
	}
	string = string.replace( /&amp;/g, '&' ).replace( /<script/gi, '<scirpt' ).replace( /onerror=/gi, 'onerorr=' );
	return string;
}

/**
 * 设置透明背景
 */
function sparrow_trans_bg( div, bg_color, opacity )
{
	if ( 'string' !== typeof bg_color || 7 !== bg_color.length )
	{
		return;
	}
	bg_color = bg_color.substr( 1 );
	var r = parseInt( bg_color.substring( 0, 2 ), 16 );
	var g = parseInt( bg_color.substring( 2, 4 ), 16 );
	var b = parseInt( bg_color.substring( 4, 6 ), 16 );
	var css_text = 'rgba('+ r +','+ g +','+ b +','+ opacity +')';
	div.css( 'background-color', css_text );
}
if ( !String.prototype.trim )
{
	String.prototype.trim = function()
	{
		return this.replace( /(^\s*)|(\s*$)/g, '' );
	};
}

/**
 * 将字符串变成数组
 */
function sparrow_str_to_array( str, main_flag, sub_flag )
{
	main_flag = main_flag || ',';
	sub_flag = sub_flag || ':';
	var result = {};
	if ( 'string' !== typeof str )
	{
		return result;
	}
	var main_arr = str.split( main_flag );
	for ( var i = 0; i < main_arr.length; i++ ){
		var tmp = main_arr[ i ].split( sub_flag );
		if ( 2 === tmp.length )
		{
			result[ tmp[ 0 ].trim() ] = tmp[ 1 ].trim();
		}
	}
	return result;
}

/**
 * 将数组变成字符串
 */
function sparrow_array_to_str( arr, main_flag, sub_flag )
{
	main_flag = main_flag || ',';
	sub_flag = sub_flag || ':';
	var result = [];
	if ( 'object' !== typeof arr )
	{
		return '';
	}
	for ( var p in arr )
	{
		result.push( p + sub_flag + String( arr[ p ] ) );
	}
	return result.join( main_flag );
}


if ( !Date.now )
{
	Date.now = function()
	{
		return (new Date()).valueOf();
	}
}

/**
 * 设置服务器时间
 */
function set_server_arg( time, version, is_dev, static_suffix ) {
	window.SERVER_TIME = time;
	window._time_diff = time - Math.floor( Date.now() / 1000 );
	if ( is_dev )
	{
		window.VERSION = get_time();
	}
	else
	{
		window.VERSION = version;
	}
	window.is_development = is_dev;
	window.STATIC_SUFFIX = static_suffix;
}

/**
 * md5函数
 */
function sparrow_md5( string )
{
	function RotateLeft(lValue, iShiftBits) {
		return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
	}

	function AddUnsigned(lX, lY) {
		var lX4, lY4, lX8, lY8, lResult;
		lX8 = (lX & 0x80000000);
		lY8 = (lY & 0x80000000);
		lX4 = (lX & 0x40000000);
		lY4 = (lY & 0x40000000);
		lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
		if (lX4 & lY4) {
			return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
		}
		if (lX4 | lY4) {
			if (lResult & 0x40000000) {
				return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
			} else {
				return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
			}
		} else {
			return (lResult ^ lX8 ^ lY8);
		}
	}

	function F(x, y, z) {
		return (x & y) | ((~x) & z);
	}
	function G(x, y, z) {
		return (x & z) | (y & (~z));
	}
	function H(x, y, z) {
		return (x ^ y ^ z);
	}
	function I(x, y, z) {
		return (y ^ (x | (~z)));
	}

	function FF(a, b, c, d, x, s, ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	}
	;

	function GG(a, b, c, d, x, s, ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	}
	;

	function HH(a, b, c, d, x, s, ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	}
	;

	function II(a, b, c, d, x, s, ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	}
	;

	function ConvertToWordArray(string) {
		var lWordCount;
		var lMessageLength = string.length;
		var lNumberOfWords_temp1 = lMessageLength + 8;
		var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
		var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
		var lWordArray = Array(lNumberOfWords - 1);
		var lBytePosition = 0;
		var lByteCount = 0;
		while (lByteCount < lMessageLength) {
			lWordCount = (lByteCount - (lByteCount % 4)) / 4;
			lBytePosition = (lByteCount % 4) * 8;
			lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
			lByteCount++;
		}
		lWordCount = (lByteCount - (lByteCount % 4)) / 4;
		lBytePosition = (lByteCount % 4) * 8;
		lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
		lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
		lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
		return lWordArray;
	}
	;

	function WordToHex(lValue) {
		var WordToHexValue = "", WordToHexValue_temp = "", lByte, lCount;
		for (lCount = 0; lCount <= 3; lCount++) {
			lByte = (lValue >>> (lCount * 8)) & 255;
			WordToHexValue_temp = "0" + lByte.toString(16);
			WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
		}
		return WordToHexValue;
	}
	;

	function Utf8Encode(string) {
		string = string.replace(/\r\n/g, "\n");
		var utftext = "";

		for (var n = 0; n < string.length; n++) {

			var c = string.charCodeAt(n);

			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if ((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}

		}

		return utftext;
	}
	;

	var x = Array();
	var k, AA, BB, CC, DD, a, b, c, d;
	var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
	var S21 = 5, S22 = 9, S23 = 14, S24 = 20;
	var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
	var S41 = 6, S42 = 10, S43 = 15, S44 = 21;

	string = Utf8Encode(string);

	x = ConvertToWordArray(string);

	a = 0x67452301;
	b = 0xEFCDAB89;
	c = 0x98BADCFE;
	d = 0x10325476;

	for (k = 0; k < x.length; k += 16) {
		AA = a;
		BB = b;
		CC = c;
		DD = d;
		a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
		d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
		c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
		b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
		a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
		d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
		c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
		b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
		a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
		d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
		c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
		b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
		a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
		d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
		c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
		b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
		a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
		d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
		c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
		b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
		a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
		d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
		c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
		b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
		a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
		d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
		c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
		b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
		a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
		d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
		c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
		b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
		a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
		d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
		c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
		b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
		a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
		d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
		c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
		b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
		a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
		d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
		c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
		b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
		a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
		d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
		c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
		b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
		a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
		d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
		c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
		b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
		a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
		d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
		c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
		b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
		a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
		d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
		c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
		b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
		a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
		d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
		c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
		b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
		a = AddUnsigned(a, AA);
		b = AddUnsigned(b, BB);
		c = AddUnsigned(c, CC);
		d = AddUnsigned(d, DD);
	}

	var temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);

	return temp.toLowerCase();
}

/**
 * 密码加密
 */
function sparrow_encode_pwd( password )
{
	var tmp = sparrow_md5( password );
	return sparrow_md5( tmp.substr( 16 ) );
}

/**
 * 获取服务器时间
 */
function get_time()
{
	return Math.floor( Date.now() / 1000 ) + window._time_diff;
}

/**
 * 获取服务器out_data数据
 */
function get_var( key, default_value ) {
	if ( !window.OUT_DATA )
	{
		return default_value;
	}
	return window.OUT_DATA[ key ] || default_value;
}

/**
 * 设置一个out_data数据
 */
function set_var( key, value ) {
	if ( !window.OUT_DATA )
	{
		window.OUT_DATA = {};
		return;
	}
	window.OUT_DATA[ key ] = value;
}

/**
 * 产生一个随机数
 */
function sparrow_mt_rand( min, max )
{
	min = parseInt( min, 10 );
	max = parseInt( max, 10 );
	return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
}

/**
 * IE下没有console对象,保证代码不出错
 */
if ( !window.console )
{
	window.console = {
		debug: function(){},
		log: function(){},
		info: function(){},
		groupCollapsed: function(){},
		error: function(){},
		groupEnd: function(){}
	};
}
if ( 'function' !== typeof console.debug )
{
	console.debug = console.info ? console.info : function(){};
}