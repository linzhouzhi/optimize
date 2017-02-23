
	var $ = jQuery.noConflict();
	/**
	 * 默认的错误处理
	 */
	function default_error_handle( err_obj )
	{
		win.alert( err_obj.error_msg );
	}
	var touch_x = 0, touch_y = 0;
	var mobile_device = ( /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test( navigator.userAgent.toLowerCase() ) );
	var sparrow = {
		/** 是否停止响应 mouse_over 事件 */
		stop_mouse_over: false,
	    /**
		 * 检查一个对象是否有某个属性
		 */
		isset: function( m )
		{
			 return 'undefined' !== typeof m && null != m;
		},
		/**
		 * 获取时间（服务器时间）
		 */
		get_time: function()
		{
			return Math.floor( Date.now() / 1000 ) + window._time_diff;
		},
		/**
		 * 是否是开发模式
		 */
		is_dev: function()
		{
			return window.is_development;
		},
		//空函数, 很多地方需要写空函数,用sparrow.func代替
		func: function(){},
		/**
		 * 返回版本号
		 */
		version: function()
		{
			return window.VERSION;
		},
		is_array: function( obj )
		{
			return this.isset( obj ) && typeof obj === "object" && obj.constructor === Array;
		},
		in_array: function( item, arr )
		{
			if ( !this.is_array( arr ) )
			{
				return -1;
			}
			for( var i = arr.length - 1; i >= 0; --i )
			{
				if ( item === arr[ i ] )
				{
					return i;
				}
			}
			return -1;
		},
		/**
		 * 模仿PHP的empty函数
		 */
		empty: function( obj )
		{
			switch ( typeof obj )
			{
				case 'undefined':
					return true;
				break;
				case 'string':
					return 0 == obj.trim().length;
				break;
				case 'number':
					return 0 == obj;
				break;
				case 'object':
					if ( null == obj )
					{
						return true;
					}
					if ( obj.constructor == Array )
					{
						return 0 == obj.length;
					}
					else
					{
						for ( var t in obj )
						{
							return false;
						}
						return true;
					}
				break;
			}
			return false;
		},
		/**
		 * 调试
		 */
		debug: function( str, is_error )
		{
			if ( typeof window.console == 'undefined' || 'function' != typeof window.console.debug )
			{
				return;
			}
			if ( true === is_error )
			{
				console.error( str );
			}
			else
			{
				if ( 'object' == typeof str && !$.isArray( str ) && null != str )
				{
					console.dir( str );
				}
				else
				{
					console.debug( str );
				}
			}
		},
		/**
		* 执行字符串中的特殊内容
		*/
		magic_js: ( function(){
			var prefix_str = '[[^';
			var suffix_str = '^]]';
			function convert ( tpl )
			{
				var prefix_len = prefix_str.length;
				var suffix_len = suffix_str.length;
				var end_pos = - suffix_len;
				var beg_pos = tpl.indexOf(prefix_str);
				if ( -1 == beg_pos )
				{
					return tpl;
				}
				var normal_str = '';
				var result_str = [];
				while ( -1 != beg_pos )
				{
					normal_str = tpl.substring( end_pos + suffix_len, beg_pos );
					if ( '' != normal_str )
					{
						result_str.push(normal_str);
					}
					end_pos = tpl.indexOf( suffix_str, beg_pos );
					if ( end_pos < 0 )	break;
					result_str.push( do_parse( tpl.substring( beg_pos + prefix_len, end_pos ) ) );
					beg_pos = tpl.indexOf( prefix_str, end_pos );
				}
				result_str.push( tpl.substring( end_pos + suffix_len ) );
				return result_str.join( '' );
			}

			/**
			 * 执行提取出来的js
			 */
			function do_parse( langStr )
			{
				var str, ev_str;
				try
				{
					if ( -1 != langStr.indexOf( '\\' ) )
					{
						ev_str = strip_slash( langStr );
					}
					else
					{
						ev_str = langStr;
					}
					str = eval( ev_str );
				}
				catch( excp )
				{
					str = prefix_str + langStr + suffix_str;
				}
				return str;
			}
			return function( tpl )
			{
				return convert( tpl );
			}
		})(),
		/**
		 * 格式化为数字
		 */
		intval: function( num )
		{
			var re = parseInt( num || 0, 10 );
			if ( true == isNaN( re ) )
			{
				re = 0;
			}
			return re;
		},
		/**
		 * 截取字符器
		 */
		substr: function( str, num, join_str )
		{
			//默认的省略符号
			join_str = join_str || '...';
			if ( this.strlen( str ) <= num )
			{
				return str;
			}
			var l = str.length, tl = this.strlen( join_str );
			while ( this.strlen( str ) > num - tl )
			{
				str = str.substring(0, l -1);
				l = l -1;
			}
			return str + join_str;
		},
		/**
		 * 字符串长度，中文字符算2个长度
		 */
		strlen: function( str )
		{
			str += '';
			return str.replace( /[^\x00-\xFF]/g, '**' ).length;
		},
		/**
		 * 生成静态资源路径
		 */
		static_url: function( file_name )
		{
			//调试模式
			if ( this.is_dev() )
			{
				return window.STATIC_URL + file_name + '?r=' + Math.random();
			}
			for ( var i = file_name.length - 1;  i >= 0; --i )
			{
				if ( '.' == file_name.charAt( i ) )
				{
					break;
				}
			}
			var new_url = window.STATIC_URL;
			new_url += file_name.substring( 0, i );
			new_url += '_' + this.version();
			new_url += file_name.substring( i );
			return new_url;
		},
		bind: function( fn, obj )
		{
			return function()
			{
				return 	fn.apply( obj, arguments );
			};
		},
		/**
		 * 输出出错信息
		 */
		error: function( str )
		{
			this.debug( str, true );
		},
		/**
		 * 执行js回调或者js字符串
		 */
		run: function( callback )
		{
			var type = typeof( callback );
			switch( type )
			{
				case 'string':
					try
					{
						eval( callback )
					}
					catch ( err )
					{
						sparrow.error( err );
					}
				break;
				case 'function':
					callback();
				break;
				default:
					this.error( 'Unsupport callback' );
					this.debug( callback );
				break;
			}
		},
		/**
		 * 回调函数包装
		 */
		cb: function( callback )
		{
			if ( 'string' === typeof callback )
			{
				callback = function(){
					try
					{
						eval( callback )
					}
					catch ( err )
					{
						sparrow.error( err );
					}
				};
			}
			if ( 'function' !== typeof callback )
			{
				callback = null;
			}
			return callback;
		},
		/**
		 * 移除变量
		 */
		unset: function( obj )
		{
			if ( 'object' === typeof obj )
			{
				try
				{
					for ( var p in obj )
					{
						obj[ p ] = null;
						delete( obj[ p ] );
					}
				}
				catch( excp )
				{
					for ( var p in obj )
					{
						obj[ p ] = null;
					}
				}
			}
			obj = null;
		},
		/**
		 * 页面上是否有某个id
		 */
		has_id: function( html_id )
		{
			return null !== document.getElementById( html_id )
		},
		/**
		 * 获取id
		 */
		get_id: function( html_id )
		{
			return document.getElementById( html_id );
		},
		/**
		 * 简单的继承
		 */
		extend: function( source, extend )
		{
			for ( var p in extend )
			{
				if ( this.isset( source[ p ] ) )
				{
					continue;
				}
				source[ p ] = extend[ p ];
			}
		},
		/**
		 * 过滤字符串的双引号过单引号，单引号为
		 */
		filt_quote: function( str )
		{
			if( sparrow.empty( str ) )
			{
				return '';
			}
			str += '';
			str = str.replace( /'/g, "\\'" );
			str = str.replace( /"/g, "'" );
			return str;
		},
		/**
		 * 搜索事件发生源
		 */
		search_event: function()
		{
			if ( window.event )
			{
				return window.event;
			}
			var func = sparrow.search_event.caller;
			var first_arg;
			var n = 0;
			while ( func && n++ < 10 )
			{
				if ( !func.arguments )
				{
					break;
				}
				first_arg = func.arguments[0];
				if ( !first_arg )
				{
					func = func.caller;
					continue;
				}
				if ( first_arg.constructor === window.MouseEvent ||
					first_arg.constructor === window.Event ||
					first_arg.constructor === window.KeyboardEvent )
				{
					return first_arg;
				}
			}
			return null;
		},
		/**
		 * 获取事件发生的dom
		 */
		get_target: function()
		{
			var eve = this.search_event();
			if ( !eve )
			{
				return document.body;
			}
			return eve.target || eve.srcElement || document.body;
		},

		/**
		 * 格式化时间
		 */
		date: function( sec, format )
		{
			var week_day = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ];
			format = format || 'Y-m-d H:i:s';
			sec = parseInt( sec );
			var key = {};
			var date_obj = new Date( sec * 1000 );
			key[ 'Y' ] = date_obj.getFullYear();
			var tmp = date_obj.getMonth() + 1;
			if ( tmp < 10 )
			{
				tmp = '0' + tmp;
			}
			key[ 'm' ] = tmp;
			tmp = date_obj.getDate();
			if ( tmp < 10 )
			{
				tmp = '0' + tmp;
			}
			key[ 'd' ] = tmp;
			tmp = date_obj.getHours();
			if ( tmp < 10 )
			{
				tmp = '0' + tmp;
			}
			key[ 'H' ] = tmp;
			tmp = date_obj.getMinutes();
			if ( tmp < 10 )
			{
				tmp = '0' + tmp;
			}
			key[ 'i' ] = tmp;
			tmp = date_obj.getSeconds();
			if ( tmp < 10 )
			{
				tmp = '0' + tmp;
			}
			key[ 's' ] = tmp;
			//星期几?
			tmp = date_obj.getDay();
			key[ 'D' ] = i18n.get( week_day[ tmp ] );

			var tmp_format = format.split( '' );
			var tmp;
			for ( var i = tmp_format.length - 1; i >= 0; --i )
			{
				tmp = tmp_format[ i ];
				if ( 'undefined' != typeof key[ tmp ] )
				{
					tmp_format[ i ] = key[ tmp ];
				}
			}
			return tmp_format.join( '' );
		},
		is_mobile: function()
		{
			return mobile_device;
		},
		/**
		 * 是否ios
		 */
		is_ios: function()
		{
			return this.is_mobile() && !!navigator.userAgent.match( /\(i[^;]+;( U;)? CPU.+Mac OS X/);
		},
		/**
		 * 是否android
		 */
		is_android: function()
		{
			return navigator.userAgent.indexOf( 'Android' ) > -1;
		},
		fix_eve: function( eve_name )
		{
			if ( !this.is_mobile() )
			{
				return eve_name;
			}
			var fix_arr = {
				click: 'touchstart',
				mousedown: 'touchstart',
				mousemove: 'touchmove',
				mouseup: 'touchend'
			};
			return fix_arr[ eve_name ] || eve_name;
		},
		eve_click_down: function( eve, obj )
		{
			this.get_mouse( eve, obj );
			obj.target = eve.currentTarget;
		},
		eve_click_up: function( eve, obj )
		{
			if ( obj.target !== eve.currentTarget )
			{
				return false;
			}
			var pos = this.get_mouse( eve );
			var x = pos.x, y = pos.y;
			if ( Math.abs( obj.x - x ) > 30 || Math.abs( obj.y - y ) > 30 )
			{
				return false;
			}
			return true;
		},
		/**
		 * 获取数据位置
		 */
		get_mouse: function( eve, obj )
		{
			if ( !obj )
			{
				obj = {};
			}
			var e = eve.originalEvent || eve;
			if ( e.touches )
			{
				if ( e.touches.length > 0 )
				{
					touch_x = e.touches[ 0 ].pageX;
					touch_y = e.touches[ 0 ].pageY;
				}
				obj.x = touch_x;
				obj.y = touch_y;
			}
			else
			{
				obj.x = eve.pageX;
				obj.y = eve.pageY;
			}
			return obj;
		},
		get_mouse_x: function( eve )
		{
			var e = this.get_mouse( eve );
			return e.x;
		},
		get_mouse_y: function( eve )
		{
			var e = this.get_mouse( eve );
			return e.y;
		},
		fix_static: function( url )
		{
			url += '';
			if ( 0 === url.length )
			{
				return url;
			}
			if ( 0 !== url.indexOf( 'http' ) )
			{
				url = window.STATIC_URL + url;
			}
			return url;
		},
		contains: function( a, b )
		{
			if ( !a || !b )
			{
				return false;
			}
			if ( a.contains )
			{
				return a != b && a.contains( b );
			}
			else
			{
				return a.compareDocumentPosition( b ) & 16;
			}
		},
		/**
		 * 将传入的dom转换为jquery的dom对象
		 */
		jq_dom: function( dom )
		{
			if ( 'string' === typeof dom )
			{
				dom = $( '#' + dom );
			}
			else if ( !( dom instanceof $ ) )
			{
				dom = $( dom );
			}
			return dom;
		},
		/**
		 * 是否支持canvas
		 */
		support_canvas: function(){
			return 'function' === typeof $( "<canvas></canvas>" )[ 0 ].getContext;
		},
		body: $( document.body )
	};

	window.sparrow = sparrow;
