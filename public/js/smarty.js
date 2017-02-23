
	var $ = jQuery.noConflict();

	var make_page_index = 'key';
	var make_page_arg = { };
	window.empty = sparrow.empty;
	window.isset = sparrow.isset;
	var current_tpl_name = null;

	//模板编译之后的
	window.JS_TPL = { };
	//保留变量
	window.smarty_keep_var = {
		href : 'href="javascript:void(0)"'
	};
	if ( sparrow.isset( window.STATIC_URL ) )
	{
		smarty_keep_var[ 'STATIC_URL' ] = smarty_keep_var[ 'STATIC' ] = smarty_keep_var[ 'static' ] = window.STATIC_URL;
	}
	if ( sparrow.isset( window.OUT_DATA ) )
	{
		smarty_keep_var[ 'out_data' ] = window.OUT_DATA;
	}
	//特殊变量
	var special_var = {
		'$smarty' : 'smarty_keep_var'
	};
	//前缀, 后缀
	var prefix = '{{', suffix = '}}';
	//编辑结果变量
	var result_var = '_STR_';
	//保留关键字
	var private_var = null;
	//解析后的函数参数名称
	var param_name = 'DATA';
	//for循环的开始变量
	var for_char_code = 65;
	//模板内容
	var tpl_code = '';
	//临时变量
	var tmp_end_pos;
	//被包含的tpl
	var include_tpl_arr = [];
	//全局的编译模板的方式
	var global_parse_eval;
	var smarty = {
		/**
		 * 生成获取模板文件的URL
		 * @param {string} tpl_name 模板名称
		 **/
		make_tpl_url : function( tpl_name )
		{
			//var url = window.SCRIPT_FILE.replace( 'index.php', 'static/jstpl/' );
			var url = window.SCRIPT_FILE;
			url += tpl_name + '.tpl';
			console.log(url);
			if ( sparrow.is_dev() )
			{
				url += '?r=' + Math.random();
			}
			return url;
		},
		/**
		 * 当前正在使用的tpl
		 */
		current_tpl : function()
		{
			return current_tpl_name;
		},
		/**
		 * 是否有某个模板
		 **/
		has_tpl : function( tpl_name )
		{
			return 'function' === typeof window.JS_TPL[ 'func_' + smarty_tpl_name( tpl_name ) ];
		},
		/**
		 * 手动编译模板
		 * @returns {undefined}
		 */
		parse_tpl : function( tpl, tpl_name )
		{
			tpl_name = tpl_name.replace( '.tpl', '' );
			tpl_name = smarty_tpl_name( tpl_name );
			return smarty_parse_tpl( tpl, tpl_name, false );
		},
		/**
		 * 加载一个html
		 * @returns {undefined}
		 */
		get_tpl : function( tpl_name, callback )
		{
			smarty_load_tpl( tpl_name, callback );
		},
		/**
		 * 解析一个模板, 返回html
		 */
		fetch : function( tpl_name, data )
		{
			return smarty_to_html( tpl_name, data );
		},
		/**
		 * 解析模板, 然后执行回调
		 */
		parse: function( tpl, data, callback ){
			smarty_load_tpl( tpl, function() {
				var content = smarty_to_html( tpl, data );
				callback( content );
			} );
		},
		/**
		 * 注册自定义smarty函数
		 */
		register_function : function( plugin_name, func_name )
		{
			if ( sparrow.isset( smartyPlugin.pluginFunc[ plugin_name ] ) )
			{
				return;
			}
			if ( 'function' !== typeof func_name && global_parse_eval )
			{
				throw 'smarty 插件 ' + plugin_name + ' is not a function';
			}
			smartyPlugin.pluginFunc[ plugin_name ] = func_name;
		},
		/**
		 * 注册自定义修正器
		 */
		register_modifier : function( modifier_name, func_name )
		{
			if ( sparrow.isset( smartyGrep[ modifier_name ] ) )
			{
				return;
			}
			if ( 'function' !== typeof func_name )
			{
				sparrow.debug( 'register_modifier_error: ' + func_name + ' is not a function' );
				return;
			}
			smartyGrep[ modifier_name ] = func_name;
		},

		/**
		 * 加载一个模板, 并执行回调
		 */
		html : function( tpl, data, container, callback )
		{
			smarty_load_tpl( tpl, function() {
				var content = smarty_to_html( tpl, data );
				if ( container )
				{
					var div = sparrow.jq_dom( container );
					div.find( '*' ).remove();
					div.html( content );
				}
				if ( 'function' === typeof callback )
				{
					callback( content );
				}
			} );
		},
		/**
		 * 从服务器加载数据(json)组装成模板
		 */
		get : function( url, tpl, container, callback, is_loading )
		{
			var arg = { tpl : tpl, container : container, callback : callback };
			ajax.get( url, smarty_ajax_re, is_loading, arg );
		},
		/**
		 * 提交数据, 再将服务器返回的数据(json)组装成模板
		 */
		post : function( url, data, tpl, container, callback, is_loading )
		{
			var arg = { tpl : tpl, container : container, callback : callback };
			ajax.post( url, data, smarty_ajax_re, is_loading, arg );
		},
		/**
		 * 打开一个窗口
		 */
		open : function( tpl, data, window_option, callback )
		{
			smarty_load_tpl( tpl, function() {
				window_option = window_option || { };
				var content = smarty_to_html( tpl, data );
				sparrow_win.open( content, window_option );
				if ( 'function' === typeof callback )
				{
					callback( data );
				}
			} );
		},
		/**
		 * 服务器获取数据, 再组装成html, 打开一个窗口
		 */
		fopen : function( url, tpl, is_loading, window_option, callback )
		{
			window_option = window_option || { };
			var arg = { tpl : tpl, option : window_option, callback : callback };
			ajax.get( url, smarty_open_re, is_loading, arg );
		},
		/**
		 * 提交数据, 返回结果组装成html, 打开一个窗口
		 */
		popen : function( url, data, tpl, is_loading, window_option, callback )
		{
			window_option = window_option || { };
			var arg = { tpl : tpl, option : window_option, callback : callback };
			ajax.post( url, data, smarty_open_re, is_loading, arg );
		},
		/**
		 * 设置系统保留关键字
		 */
		define : function( key, value )
		{
			smarty_keep_var[ key ] = value;
		},
		/**
		 * 获取系统保留关键字
		 */
		get_define : function( key )
		{
			return sparrow.isset( smarty_keep_var[ key ] ) ? smarty_keep_var[ key ] : null;
		}
	};
	/**
	 * 解析模板
	 **/
	function smarty_parse_tpl( tpl, tpl_name, is_eval )
	{
		if ( false !== is_eval )
		{
			is_eval = true;
		}
		global_parse_eval = is_eval;
		tpl_name = 'func_' + tpl_name;
		tpl_code = smarty_clean_tpl( tpl );
		smartySyntax.syntaxStack = [ ];					//初始化
		//for 循环中的变量ascII码值
		for_char_code = 65;
		//重置smarty的保留变量
		//smarty_reset_keep();
		private_var = { };				//初始化该保留关键字
		var tpl_result = smarty_do_parse( tpl_name );
		if ( is_eval )
		{
			eval( tpl_result );
		}
		return tpl_result;
	}
	/**
	 * ajax返回结果
	 */
	function smarty_ajax_re( data, arg )
	{
		smarty.html( arg.tpl, data, arg.container, arg.callback );
	}

	/**
	 * fopen, popen结果
	 */
	function smarty_open_re( data, arg )
	{
		smarty.open( arg.tpl, data, arg.option, arg.callback );
	}

	/**
	 * 将模板转成html
	 **/
	function smarty_to_html( tpl_name, data )
	{
		current_tpl_name = tpl_name;
		tpl_name = smarty_tpl_name( tpl_name );
		//模板不存在, 先去加载模板
		if ( !smarty.has_tpl( tpl_name ) )
		{
			sparrow.error( '模板:' + tpl_name + ' 不存在' );
			return 'tpl not exist';
		}
		try
		{
			var tmp_html = JS_TPL[ 'func_' + tpl_name ]( data );
		}
		catch ( excp )
		{
			var msg = 'jssmarty ' + tpl_name + ' 模板运行出错：' + excp;
			//IE下
			if ( excp.description )
			{
				msg += excp.description;
			}
			sparrow.error( msg );
			return msg;
		}
		/*if ( -1 !== tmp_html.indexOf( '[[^' ) )			//解析JS语言包
		{
			tmp_html = sparrow.magic_js( tmp_html );
		}*/
		return tmp_html;
	}

	/**
	 * 加载一个模板, 然后执行回调
	 */
	function smarty_load_tpl( tpl_name, callback )
	{
		function _on_tpl_load()
		{
			if ( 0 === include_tpl_arr.length )
			{
				callback();
			}
			else
			{
				smarty_load_tpl( include_tpl_arr.shift(), callback );
			}
		}
		var real_name = smarty_tpl_name( tpl_name );
		if ( smarty.has_tpl( real_name ) )
		{
			_on_tpl_load();
		}
		else
		{
			if ( sparrow.is_dev() || window.FORCE_LOAD_TPL )
			{
				ajax.get_text( smarty.make_tpl_url( tpl_name ), function( tpl_str ) {
					smarty_parse_tpl( tpl_str, real_name );
					_on_tpl_load();
				} );
			}
			//正式的环境, 直接使用编译好的tpl
			else
			{
				var tpl_dir = tpl_name.split( '/' );
				tpl_dir.pop();
				tpl_dir.push( 'tpl' );
				tpl_name = tpl_dir.join( '/' );
				var js_file = window.STATIC_URL + 'jstpl/' + tpl_name + '.js';
				seajs.use( js_file, _on_tpl_load );
			}
		}
	}

	/**
	 * 模板名称
	 */
	function smarty_tpl_name( tpl_name )
	{
		return tpl_name.replace( /\//g, '_' );
	}

	/**
	 * 清理模板的注释等内容
	 */
	function smarty_clean_tpl( tpl )
	{
		//去掉行首尾的\t
		tpl = tpl.replace( /\r?\n[\t]+/g, '' );
		//去掉行首尾的空格
		tpl = tpl.replace( /\r?\n[\s]*/g, '' );
		//有注释内容
		if ( -1 != tpl.indexOf( '<!--' ) )
		{
			tpl = smarty_remove_comment( tpl );
		}
		return tpl;
	}
	/**
	 * 清理注释
	 */
	function smarty_remove_comment( tpl )
	{
		var beg_pos = tpl.indexOf( '<!--' );
		if ( -1 == beg_pos )
		{
			return tpl;
		}
		//-3是因为-->的长度为3
		var re_tpl = '', end_pos = -3;
		while ( -1 != beg_pos )
		{
			re_tpl += tpl.substring( end_pos + 3, beg_pos );
			end_pos = tpl.indexOf( '-->', beg_pos );
			if ( -1 == end_pos )
			{
				//注释没有闭合
				return re_tpl;
			}
			beg_pos = tpl.indexOf( '<!--', end_pos + 3 );
		}
		return re_tpl + tpl.substring( end_pos + 3 );
	}

	/**
	 * 清理字符串
	 */
	function smarty_clean_str( str )
	{
		return str.replace( /[\\']/g, '\\$&' );
	}
	/**
	 * 异常处理
	 */
	function smarty_exception( err )
	{
		var bPos = tpl_code.indexOf( '\\n' );
		var line = 1;
		while ( -1 != bPos )
		{
			line++;
			bPos = tpl_code.indexOf( '\\n', bPos + 1 );
			if ( -1 != tmp_end_pos )
			{
				if ( bPos > tmp_end_pos )
				{
					break;
				}
			}
		}
		throw err + '错误位置: 第' + line + '行';
	}


	/**
	 * 模板解析
	 */
	function smarty_do_parse( func_name )
	{
		var re_func = [ 'JS_TPL.' + func_name + '=function(' + param_name + '){var ' + result_var + ' = [];' ];
		var prefix_len = prefix.length;
		var suffix_len = suffix.length;
		var normal_str = '', smarty_str = '';
		tmp_end_pos = -suffix_len;
		var beg_pos = tpl_code.indexOf( prefix );
		while ( -1 != beg_pos )
		{
			normal_str = tpl_code.substring( tmp_end_pos + suffix_len, beg_pos );
			if ( '' != normal_str )
			{
				re_func.push( result_var + ".push('" + smarty_clean_str( normal_str ) + "');" );
			}
			tmp_end_pos = tpl_code.indexOf( suffix, beg_pos );
			if ( tmp_end_pos < 0 )
			{
				smarty_exception( 'smarty语法不配对：' + tpl_code.substring( beg_pos ) );
			}
			re_func.push( smartySyntax.doParse( tpl_code.substring( beg_pos + prefix_len, tmp_end_pos ) ) );
			beg_pos = tpl_code.indexOf( prefix, tmp_end_pos );
		}
		if ( 0 != smartySyntax.syntaxStack.length )
		{
			smarty_exception( '语法不配对' );
		}
		re_func.push( result_var + ".push('" + smarty_clean_str( tpl_code.substring( tmp_end_pos + suffix_len ) ) +
				"');return " + result_var + ".join('');}" );
		return re_func.join( '' );
	}

	/**
	 * 格式化括号
	 */
	function smarty_format_brackets( str )
	{
		//在括号两边加上空格；
		str = str.replace( /(\(|\))/g, ' $1 ' );
		//把连续的空格替换为只有一个空格
		str = str.replace( /\s+/g, ' ' );
		return str.trim();
	}

	/**
	 * 处理一条语句中所有的变量
	 */
	function smarty_parse_line_vars( str )
	{
		//str = str.replace( /(\[^!]=+)/g, ' $1 ' );
		var str_arr = str.split( ' ' );
		for ( var i = str_arr.length - 1;i >= 0;i-- )
		{
			if ( '$' != str_arr[ i ].substring( 0, 1 ) )
			{
				continue;
			}
			str_arr[ i ] = smartySyntax.parseVar( str_arr[ i ] );
		}
		return str_arr.join( ' ' );
	}

	/**
	 * 插入局部变量 pushPrivateVar
	 */
	function smarty_push_prviate( var_str )
	{
		//将循环体内的变量插入保护变量
		var var_name;
		if ( -1 != var_str.indexOf( '.' ) )
		{
			var_name = var_str.substring( 0, var_str.indexOf( '.' ) );
		}
		else
		{
			var_name = var_str;
		}
		return param_name + '["' + var_name + '"]=' + var_name + ';';
	}

	var smartyReg = {
		db_qstr : '"[^"\\\\]*(?:\\\\.[^"\\\\]*)*"',
		si_qstr : '\'[^\'\\\\]*(?:\\\\.[^\'\\\\]*)*\''
	};
	smartyReg.qstr = '(?:' + smartyReg[ 'db_qstr' ] + '|' + smartyReg[ 'si_qstr' ] + ')';
	//自定义smarty解析函数
	var smartyPlugin = {
		pluginFunc : { },
		check_plugin : function( str )
		{
			var result = { };
			str = str.replace( /\s*=\s*/g, '=' );
			//@todo 此处还有bug 如果传过来的字符串中间有空格, 会解析出错, 应该做严格 字符串解析
			var tmp = sparrow_array_unset( str.split( ' ' ), '' );
			var tmp_name = tmp.shift();
			result.func = tmp_name;
			result.arg = tmp;
			result.re = sparrow.isset( this.pluginFunc[ tmp_name ] );
			return result;
		}
	};
	window.smartyPlugin = smartyPlugin;
	//smarty语法分析器
	var smartySyntax = {
		syntaxStack : [ ],
		doParse : function( str )
		{
			this.str = str;
			str = str.trim();
			str = str.replace( /\t/g, ' ' ); //替换表达式中的 \t 为空格
			//debug('parse:'+str);
			if ( /^\$/.test( str ) )
			{
				tmp_str = str;
				if ( -1 != str.indexOf( '|' ) )
				{
					tmp_str = str.replace( /["'][^"']+["']/g, 1 );
				}
				if ( /^\$[^+\-*/]+$/.test( tmp_str ) )
				{
					//变量分析
					return result_var + '.push(' + this.parseVar( str ) + ');';
				}
			}
			else if ( /^(if|section|foreach|assign|cycle|include|elseif)\s+(.*)$/.test( str ) )
			{
				var func_name = this['parse' + RegExp.$1];
				//将连续的空格替换为只有一个空格//语句分析
				return func_name( RegExp.$2.replace( /\s+/g, ' ' ) );
			}
			else if ( 'foreachelse' == str || 'sectionelse' == str )
			{
				this.syntaxStack.push( 'elseflag' ); //有这个标志，就可以确定foreach和section里有foreachelse和sectionelse
				return '}}else{';
			}
			else if ( 'else' == str )
			{
				return '}else{';
			}
			else if ( /\/([a-zA-Z]+)/.test( str ) )
			{
				return this.closeBlock( RegExp.$1 ); //结束语句块
			}
			else if ( 'literal' == str )
			{
				return result_var + ".push('" + this.parseLiteral() + "');";
			}
			else if ( '*' == str.substring( 0, 1 ) )
			{
				return this.parseComment( str ); //smarty 注释
			}
			if ( /[+\-*/]+/.test( str ) )
			{
				//如果有+-*/,先把所有不是+-*/='" 号的去掉
				var tmp_str = str.replace( /[^+\-*/='"]/g, '' );
				//sparrow.debug( str );
				if ( /^[+\-*/]+$/.test( tmp_str ) )
				{
					return this.parseFormula( str );
				}
				//return result_var + '.push(' + this.parseFormula(str) +');';
			}
			var plugin_re = smartyPlugin.check_plugin( str );
			if ( !plugin_re[ 're' ] && global_parse_eval )
			{
				smarty_exception( '无法解析的语法' + str );
			}
			else
			{
				var tmp_str = [ ];
				var tmp, tmp_value, var_name;
				var_name = '_plugin_arg_' + plugin_re[ 'func' ] + '_';
				tmp_str.push( 'var ' + var_name + ' = {};' );
				var args = plugin_re[ 'arg' ], tmp_name;
				for ( var i = 0;i < args.length;++i )
				{
					tmp = args[ i ].split( '=' );
					tmp_name = tmp.shift();
					tmp_value = tmp.join( '=' );
					if ( '$' == tmp_value.substring( 0, 1 ) )
					{
						tmp_value = smartySyntax.parseVar( tmp_value );
					}
					tmp_str.push( var_name + '["' + tmp_name + '"]=' + tmp_value + ';' );
				}
				tmp_str.push( result_var + '.push(smartyPlugin.pluginFunc["' + plugin_re[ 'func' ] + '"](' + var_name + '));' );
				return tmp_str.join( '' );
			}
		},
		parseif : function( str )
		{
			smartySyntax.syntaxStack.push( 'if' );
			return smartyIf.init( str );
		},
		parseforeach : function( str )
		{
			return smartyForeach.init( str );
		},
		parseFormula : function( str )
		{
			return smartyFormula.init( str );
		},
		parsesection : function( str )
		{
			return smartySection.init( str );
		},
		parseassign : function( str )
		{
			var tmp_value;
			if ( !/^name\s*=\s*"([^\"]+)"\svalue\s*=\s*([^\s]+)\s*$/.test( str ) )
			{
				smarty_exception( '错误的assign表达式:' + str );
			}
			tmp_value = RegExp.$2;
			if ( '$' == tmp_value.substring( 0, 1 ) )
			{
				tmp_value = smartySyntax.parseVar( tmp_value );
			}
			return param_name + '["' + RegExp.$1 + '"]=' + tmp_value + ';';
		},
		parsecycle : function( )
		{
			//todo
			return '';
		},
		parseinclude : function( str )
		{
			if ( !/^file\s*=\s*"([^\.]+)\.tpl"$/.test( str ) )
			{
				smarty_exception( '错误的include表达式:' + str );
			}
			var tmp = RegExp.$1;
			if ( global_parse_eval )
			{
				include_tpl_arr.push( tmp );
			}
			var func_name = 'JS_TPL.func_' + smarty_tpl_name( tmp );
			var re_str = 'if("function" !== typeof ' + func_name + ') throw "没有包括模板:' + tmp + '";';
			return re_str + result_var + '.push(JS_TPL.func_' + smarty_tpl_name( tmp ) + '(' + param_name + '));';
		},
		parseelseif : function( str )
		{
			return '}else ' + smartyIf.init( str );
		},
		parseComment : function( str )
		{
			if ( '*' == str.substring( str.length - 1 ) )
			{
				return ''; //正规的smarty注释
			}
			var hasFound = false;
			var begPos = tpl_code.indexOf( '*', tmp_end_pos ); //找*的位置
			var tmpStr = '';
			while ( -1 != begPos && false == hasFound )
			{
				tmpStr = tpl_code.substring( begPos + 1 ).replace( /^\s*/g, '' ); //找到*号以后的内容
				if ( 0 == tmpStr.indexOf( suffix ) )
				{
					hasFound = true;
				}
				else
				{
					begPos = tpl_code.indexOf( '*', begPos + 1 ); //1为*号的长度
				}
				break;
			}
			if ( true == hasFound )
			{
				tmp_end_pos = tpl_code.indexOf( suffix, begPos );
			}
			else
			{
				throw '未找到与{*配对的注释';
			}
			return '';
		},
		//匹配Literal块
		parseLiteral : function( )
		{
			var endLitPos = tpl_code.indexOf( '/literal', tmp_end_pos );
			var hasFound = false;
			var tmpBef, tmpAft;
			while ( -1 != endLitPos && false == hasFound )
			{
				tmpBef = tpl_code.substring( tmp_end_pos + suffix.length, endLitPos ).trim();
				tmpAft = tpl_code.substring( endLitPos + 8 ).trim(); //8为 'literal'的长度
				if ( prefix == tmpBef.substring( tmpBef.length - prefix.length ) && suffix == tmpAft.substring( 0, suffix.length ) )
				{
					//找到的literal前为befBrks后为endBrks
					hasFound = true;
				}
				else
				{
					endLitPos = tpl_code.indexOf( '/literal', endLitPos + 8 );
				}
			}
			if ( false == hasFound )
			{
				throw '未找到与literal配对的标签';
			}
			else
			{
				var reStr = smarty_clean_str( tmpBef.substring( 0, tmpBef.length - prefix.length ) );
				tmp_end_pos = tpl_code.indexOf( suffix, endLitPos ); //跳过整个literal包含内容
				return reStr;
			}
		},
		parseVar : function( str )
		{
			//匹配单一变量
			//debug('smartyVar：'+ str);
			var re_str = '';
			var tmp_qua = [ ];
			while ( new RegExp( '(' + smartyReg.qstr + ')' ).test( str ) )
			{
				str = str.replace( RegExp.$1, 'SMARTY_QUATO_' + tmp_qua.length );
				tmp_qua.push( RegExp.$1 );
			}
			if ( -1 == str.indexOf( '|' ) )
			{
				re_str = smartyVar.init( str );
			}
			else
			{
				var greps = str.split( '|' );
				var tmpGrep, tmpArr, parm;
				re_str = smartyVar.init( greps[ 0 ] );
				var m;

				for ( var i = 1, l = greps.length;i < l;++i )
				{
					parm = [ ];
					if ( '' == greps[ i ] )
					{
						throw '错误的管道表达式：' + str;
					}
					if ( -1 != greps[ i ].indexOf( ':' ) )
					{
						//有：号，第一个：号以后作为参数parm传递
						tmpArr = greps[i].split( ':' );
						tmpGrep = tmpArr[ 0 ];

						for ( m = 1;m < tmpArr.length;++m )
						{
							if ( '$' == tmpArr[ m ].substring( 0, 1 ) )
							{
								parm.push( smartySyntax.parseVar( tmpArr[ m ] ) );
							}
							else
							{
								parm.push( tmpArr[ m ] );
							}
						}
						re_str = 'smartyGrep["' + tmpGrep + '"](' + re_str + ',' + parm.join( ',' ) + ')';
					}
					else
					{
						//无：号
						tmpGrep = greps[ i ];
						re_str = 'smartyGrep["' + tmpGrep + '"](' + re_str + ')';
					}
					if ( 'function' !== typeof( smartyGrep[ tmpGrep ] ) && global_parse_eval )
					{
						throw 'Smarty不支持的管道函数“' + tmpGrep + '” 在 “' + str + '里';
					}
				}
			}
			if ( 0 != tmp_qua.length )
			{
				for ( i = 0;i < tmp_qua.length;++i )
				{
					re_str = re_str.replace( 'SMARTY_QUATO_' + i, tmp_qua[ i ] );
				}
			}
			return re_str;
		},
		closeBlock : function( block )
		{
			//结束标志
			var tmp = this.syntaxStack.pop( );
			var isBrks = false;
			var reStr = '}';
			if ( 'elseflag' == tmp )
			{
				tmp = this.syntaxStack.pop();
				isBrks = true;
			}
			if ( block != tmp )
			{
				this.exception( block + '不匹配' );
			}

			if ( 'foreach' == block || 'section' == block )
			{
				if ( false == isBrks )
				{
					reStr += '}';
				}
			}
			return reStr;
		},
		exception : function( err )
		{
			smarty_exception( '语句：' + this.str + ' 解析出错\n\n可能的原因是：' + err );
		}
	};

	var smartyForeach = {
		init : function( str )
		{
			this.forStr = str;
			//this.hasName = false; //是否有name=xx这样的属性
			this.forStr = this.forStr.replace( /(from|name|key|item)\s?=\s?/g, '$1=' ); //将XX = XX换成 XX=XX
			if ( /(^|\s)(?!name=|from=|key=|item=)/.test( this.forStr ) )
			{
				smartySyntax.exception( '错误的foreach表达式' )
			}
			/*if ( /(\s|^)?name=([^\s]+)(\s|$)/.test( this.forStr ) )
			 {
			 this.hasName = RegExp.$2; //记录这个name值
			 this.forStr = this.forStr.replace( /(\s|^)?name=[^\s]+(\s|$)/, ' ' ).trim( );//取消掉name
			 if ( false == sparrow.isset( smarty_keep_var[ 'foreach' ] ) )
			 {
			 smarty_keep_var[ 'foreach' ] = {};
			 }
			 }*/
			smartySyntax.syntaxStack.push( 'foreach' );
			return this.doParse();
		},
		doParse : function()
		{
			var forArr = this.forStr.split( ' ' ); //按空格切割
			var arg = { };
			var tmp;
			for ( var i = forArr.length - 1;i >= 0;--i )
			{
				tmp = forArr[ i ].split( '=' );
				arg[ tmp[ 0 ].toLowerCase() ] = tmp[ 1 ];
			}
			tmp = this.parseFromVar( arg[ 'from' ] );
			var forVar;
			if ( false == sparrow.isset( arg[ 'key' ] ) )
			{
				forVar = '_' + String.fromCharCode( for_char_code++ );
			}
			else
			{
				forVar = arg[ 'key' ];
			}
			var itemVar = arg[ 'item' ];
			var reStr;
			var fromVar = tmp[ 0 ];
			reStr = tmp[ 1 ] + ';';
			reStr += 'if(false==sparrow.empty(' + fromVar + ')){var ' + itemVar + ';for(var ' + forVar + ' in ' + fromVar + '){' + itemVar + '=' + fromVar + '[' + forVar + '];';
			reStr += smarty_push_prviate( itemVar );
			reStr += smarty_push_prviate( forVar );
			return reStr;
		},
		//
		parseFromVar : function( str )
		{
			var reStr = '';
			var fromVar = str.replace( '$', '' );
			var varValue = smartySyntax.parseVar( '$' + fromVar );
			if ( /\./.test( fromVar ) )
			{
				fromVar = fromVar.replace( /\./g, '__' );
			}
			if ( /^([^\[]+)\[/.test( fromVar ) )
			{
				reStr = 'var ' + RegExp.$1 + '={};';
				reStr += fromVar + ' = ' + varValue;
			}
			else
			{
				reStr = 'var ' + fromVar + ' = ' + varValue;
			}
			return [ fromVar, reStr ];
		}
	};

	var smartyIf = {
		init : function( ifStr )
		{
			this.ifStr = ifStr;
			this.formatIf( );
			if ( -1 != this.ifStr.indexOf( '(' ) )
			{
				this.checkIsPair(); //检查括号
			}
			if ( /\sis\s/i.test( this.ifStr ) )
			{
				this.getIsStr(); //解析 is 表达式
			}
			this.ifStr = smarty_parse_line_vars( this.ifStr );
			return 'if(' + this.ifStr + '){';
		},
		formatIf : function()
		{
			this.ifStr = this.ifStr.replace( /\seq\s/gi, ' == ' );
			this.ifStr = this.ifStr.replace( /\snq\s/gi, ' != ' );
			this.ifStr = this.ifStr.replace( /\sor\s/gi, ' || ' );
			this.ifStr = this.ifStr.replace( /\sand\s/gi, ' && ' );
			this.ifStr = this.ifStr.replace( /\sgt\s/gi, ' > ' );
			this.ifStr = this.ifStr.replace( /\slt\s/gi, ' < ' );
		},
		checkIsPair : function()
		{
			if ( /\(\s+\)/.test( this.ifStr ) )
			{
				smartySyntax.exception( '括号内不能无内容' );
			}
			this.ifStr = smarty_format_brackets( this.ifStr ); //处理括号,在括号前后加空格
			var arrIf = this.ifStr.split( ' ' );
			var isPair = 0;
			for ( var i = 0, l = arrIf.length;i < l;i++ )
			{
				if ( isPair < 0 )
				{
					break;
				}
				if ( ')' == arrIf[ i ] )
				{
					isPair--;
				}
				else if ( '(' == arrIf[ i ] )
				{
					isPair++;
				}
			}
			if ( 0 != isPair )
			{
				smartySyntax.exception( '括号不匹配' );
			}
		},
		getIsStr : function( )
		{
			//解析smarty的 if is语句
			/*下边的过程太混乱了
			 *基础思想是把字符串1。把大写的IS替换成is；2。把大写的NOT替换成not；
			 *把字符串按空格切割成数组，循环数组，如果发现is，就把从is前边的字符串（参数）到is结束的字符串提取分析，并push到返回数组。所有不满足的字符串也push到返回数组，最后输出
			 *如果is前边为)那就把从(到)内的全部内容当成参数
			 */
			this.ifStr = this.ifStr.replace( /\sIS\s/g, 'is' );
			this.ifStr = this.ifStr.replace( /\sNOT\s/g, 'not' );
			var ifArr = this.ifStr.split( /\s/ );
			var resultArr = [ ];
			var isFlag = false;
			var begInd = 0;
			var tmpStr = tmpItem = '';
			for ( var i = 0, l = ifArr.length;i < l;i++ )
			{
				// 从1开始的话 if就不用分析了
				if ( 'is' == ifArr[ i ] )
				{
					if ( false != isFlag )
					{
						smartySyntax.exception( 'is 用法出错' );
					}
					begInd = i - 1; //从前一个位置开始
					if ( ')' == ifArr[ begInd ] )
					{
						//如果前面是)号，就要将整个()内的串作为参数
						tmpItem = resultArr.pop( );
						tmpStr = '';
						while ( '(' != tmpItem )
						{
							//debug('resultArr' + resultArr);
							tmpStr = tmpItem + tmpStr;
							//debug('tmpStr:'+tmpStr);
							tmpItem = resultArr.pop();
						}
						ifArr[begInd] = '(' + tmpStr;
					}
					else
					{
						resultArr.pop(); //如果不是)，那就将前面的字符串去除掉
					}
					isFlag = true;
					i++;
					while ( i < l && true == isFlag )
					{ //找从is到 is可能的结束符之间的内容
						if ( /^[)=!|&><]/.test( ifArr[ i ] ) )
						{
							isFlag = false; //找到结束位了
							resultArr.push( this.parseIs( ifArr.slice( begInd, i ) ) );
							i--;
						}
						else
						{
							i++;
						}
					}
					if ( true == isFlag )
					{
						//如果找到最后，表示从is到最后的内容都为is表达式
						resultArr.push( this.parseIs( ifArr.slice( begInd, i ) ) );
					}
				}
				else
				{
					//普通字符串压入结果数组
					resultArr.push( ifArr[i] );
				}
			}
			this.ifStr = resultArr.join( ' ' );
			this.ifStr = smarty_format_brackets( this.ifStr ); //处理括号,在括号前后加空格
		},
		parseIs : function( isArr )
		{
			//debug('var: ' + isArr[0]);
			if ( isArr.length < 3 || isArr.length > 6 )
			{
				smartySyntax.exception( '无法识别的表达式：' + isArr.join( ' ' ) );
			}
			var isType = isArr[ 2 ];
			if ( 'not' == isType )
			{
				isType = isArr[ 3 ];
			}
			if ( !/^(odd|div|even)$/.test( isType ) )
			{
				smartySyntax.exception( '无法识别的表达式：' + isType );
			}
			//alert(typeof this[ 'parse' + RegExp.$1 ] );
			return this[ 'parse' + RegExp.$1 ]( isArr );
		},
		parsediv : function( isArr )
		{
			var parm = isArr.shift( );
			isArr.shift( );
			var flag;
			if ( 'not' == isArr.shift( ) )
			{
				isArr.shift( );//把odd除掉
				flag = '!'
			}
			else
			{
				flag = '=';
			}
			if ( 2 != isArr.length || 'by' != isArr[ 0 ] )
			{
				smartySyntax.exception( '无法解析的 is 表达式' );
			}
			return '0 ' + flag + '= ' + parm + ' % ' + isArr[ 1 ];
		},
		parseOddEven : function( isArr, flag )
		{
			var parm = isArr.shift( );
			isArr.shift(); //除掉is
			if ( 'not' == isArr.shift() )
			{
				isArr.shift( );//把odd除掉
				flag = ( '=' == flag ) ? '!' : '=';
			}
			if ( 0 == isArr.length )
			{
				return '0 ' + flag + '= ' + parm + ' % 2';
			}
			else if ( 2 == isArr.length && 'by' == isArr[ 0 ] )
			{
				return '0 ' + flag + '= ' + parm + ' / ' + isArr[1] + ' % 2';
			}
			else
			{
				smartySyntax.exception( '无法解析的 is 表达式' );
			}
		},
		parseodd : function( isArr )
		{
			return this.parseOddEven( isArr, '!' );
		},
		parseeven : function( isArr )
		{
			return this.parseOddEven( isArr, '=' );
		}
	};

	var smartySection = {
		init : function( str )
		{
			//alert(str);
			this.str = str;
			this.str = this.str.replace( /(name|loop|start|step|max|show)\s?=\s?/g, '$1=' ); //将XX = XX换成 XX=XX
			if ( /(^|\s)(?!name=|loop=|start=|step=|max=|show=)/.test( this.str ) )
			{
				smartySyntax.exception( '错误的section表达式' )
			}
			smartySyntax.syntaxStack.push( 'section' );
			return this.doParse( );
		},
		doParse : function()
		{
			if ( !/loop\s*=\s*([^\s]+)/.test( this.str ) )
			{
				smartySyntax.exception( 'section表达式缺少loop' );
			}
			else
			{
				var loopVar = RegExp.$1;
			}
			if ( !/name\s*=\s*([^\s]+)/.test( this.str ) )
			{
				smartySyntax.exception( 'section表达式缺少name' );
			}
			else
			{
				var nameVar = RegExp.$1;
			}
			var maxVar = ( /max\s*=\s*(\d+)/.test( this.str ) ) ? RegExp.$1 : -1;
			var stepVar = ( /step\s*=\s*(\d+)/.test( this.str ) ) ? RegExp.$1 : 1;
			var startVar = ( /start\s*=\s*(\d+)/.test( this.str ) ) ? RegExp.$1 : 0;
			var lenVar = String.fromCharCode( for_char_code++ );
			if ( /^\$/.test( loopVar ) )
			{
				loopVar = smartySyntax.parseVar( loopVar ); //如果loop是变量,解析该变量
			}
			var reStr = [ 'var _section_loop_tmp_ = ' + loopVar + ';var ' + lenVar + ';if($.isArray(_section_loop_tmp_))' + lenVar + '=_section_loop_tmp_.length;else ' + lenVar + '=sparrow.intval(_section_loop_tmp_,true);' ];
			if ( -1 != maxVar )
			{
				reStr.push( 'if(' + lenVar + ' > ' + maxVar + ')' + lenVar + '=' + maxVar + ';' );
			}
			reStr.push( 'if(' + lenVar + '){for(var ' + nameVar + '=' + startVar + '; ' + nameVar + '<' + lenVar + '; ' + nameVar + '+=' + stepVar + '){' );
			reStr.push( param_name + '["' + nameVar + '"]=' + nameVar + ';' );
			//alert( reStr.join( '' ) );
			return reStr.join( '' );
		}
	};

	var smartyFormula = {
		init : function( str )
		{
			this.str = this.formatFormula( str );
			var s_len = this.str.length,
					pp_s = this.str.substring( s_len - 2, s_len ),
					pp_e = this.str.substring( 0, 2 ),
					tmp_re,
					has_self_add = 0;
			if ( '++' == pp_s || '--' == pp_s )
			{
				this.str = this.str.substring( 0, s_len - 2 );
				has_self_add = 1;
			}
			if ( '++' == pp_e || '--' == pp_e )
			{
				this.str = this.str.substring( 2, s_len );
				has_self_add = 2;
			}
			tmp_re = smarty_parse_line_vars( this.str );
			if ( has_self_add > 0 )
			{
				var parse_re;
				if ( 1 == has_self_add )
				{
					parse_re = tmp_re + pp_s;
				}
				else
				{
					parse_re = pp_e + tmp_re;
				}
				return parse_re + ';';
			}
			else
			{
				return result_var + '.push((' + tmp_re + '));';
			}

		},
		formatFormula : function( str )
		{
			return str.replace( /(\s*[+\-*/]+\s* )/, ' $1 ' );
		}
	};

	var smartyVar = { //smarty变量表达式分析器
		init : function( varStr )
		{
			this.varStr = varStr;
			var tmpStr = varStr;
			if ( -1 != varStr.indexOf( '.' ) )
			{
				tmpStr = varStr.substring( 0, varStr.indexOf( '.' ) );
			}
			//特殊变更
			if ( sparrow.isset( special_var[ tmpStr ] ) )
			{
				return varStr.replace( tmpStr, special_var[ tmpStr ] );
			}
			//私有变量
			if ( true == private_var[ tmpStr ] )
			{
				return varStr.replace( '$', '' );
			}
			if ( true == this.checkValid() )
			{
				smartySyntax.exception( '表达式不正确' );
			}
			this.reStr = '';
			this.dotFlag = false;
			this.isPair = 0;//中括号是否配对
			this.doParse();
			if ( 0 != this.isPair )
			{
				smartySyntax.exception( '中括号不配对' );
			}
			return this.reStr;
		},
		checkValid : function()
		{
			//检查变量表达式是否正确
			return true == /\$[^a-zA-Z_]/.test( this.varStr ) || //$后面只能给[a-zA-Z_]
					//true == /\.((\.|$)|((0|([1-9]\d*))[^.\[\]]))/.test(this.varStr) || //1：不能两个..或者以.结束 2：.后面接数字，数字后面必须再接'.','[',']'之一
					true == /\[(\[|\]|\.|((0|([1-9]\d*))[^\]]))/.test( this.varStr ); //以[开始，后面不能接 [, ], .，如果是数字，后面只能是]
		},
		doParse : function()
		{
			var dotBef = this.dotAft = ''; //用于记录当遇到.时[]内是否需要加"号
			var strArr = this.varStr.split( '' );
			var endVar = false, c, tmp_re;
			for ( var i = 0, l = strArr.length;i < l;i++ )
			{
				if ( this.isPair < 0 )
				{
					smartySyntax.exception( '中括号不配对' );
				}
				c = strArr[ i ];
				switch ( c )
				{
					case '$':
						tmp_re = '';
						i++;
						while ( false == endVar && i < l )
						{
							//查找变量结束位置
							if ( '.' == strArr[ i ] || '[' == strArr[ i ] || ']' == strArr[ i ] )
							{
								endVar = true;
								i--; //很重要
								break;
							}
							else
							{
								tmp_re += strArr[ i ];
							}
							i++;
						}
						if ( true == private_var[ '$' + tmp_re ] )
						{
							this.reStr += tmp_re;
						}
						else
						{
							this.reStr += param_name + '["' + tmp_re + '"]';
						}
						endVar = false; //还原标志位
						break;
					case '.':
						dotBef = this.dotAft; //互换这个标志
						this.dotAft = ( '$' == strArr[ i + 1 ] ) ? '' : '"'; //检查后面出现的字符是否是变量，如果是，则[]，else [""]
						if ( false == this.dotFlag )
						{
							this.dotFlag = true;
							this.reStr += '[' + this.dotAft;
						}
						else
						{
							this.reStr += dotBef + '][' + this.dotAft;
						}
						break;
					case '[':
						this.isPair++;
						this.cleanDotFlag();
						this.reStr += '[';
						break;
					case ']':
						this.isPair--;
						this.cleanDotFlag();
						this.reStr += ']';
						break;
					default:
						this.reStr += c;
				}
			}
			this.cleanDotFlag();
		},
		cleanDotFlag : function()
		{
			if ( false == this.dotFlag )
			{
				return;
			}
			this.dotFlag = false;
			this.reStr += this.dotAft + ']';
			this.dotAft = '';
		}
	};

	var smartyGrep = { //Smarty管道
		upper : function( str )
		{
			return str.toUpperCase();
		},
		lower : function( str )
		{
			return str.toLowerCase();
		},
		strip : function( str )
		{
			return str.trim();
		},
		strip_tags : function( str )
		{
			return str.replace( /<\/?[^>]+>/gi, '' );
		},
		truncate : function( str, len, end_str )
		{
			if ( sparrow.isset( len ) )
			{
				len = sparrow.intval( len );
			}
			else
			{
				len = 80;
			}
			end_str = end_str || '...';
			return sparrow.substr( str, len, end_str );
		},
		intval : function( num )
		{
			return sparrow.intval( num );
		}
	};
	window.smartyGrep = smartyGrep;
	/**
	 * debug error
	 */
	function dev_debug_error( str )
	{
		sparrow.error( str );
		if ( sparrow.is_dev() )
		{
			sparrow_win.alert( str );
		}
	}
	var pop_active_id = null;
	$( document ).bind( 'click', function( eve ) {
		var target = eve.target;
		var capture = target.getAttribute( 'data-capture' );
		if ( capture )
		{
			var dom = sparrow.get_id( capture );
			if ( dom )
			{
				sparrow_win.capture( dom );
			}
			return;
		}
		var pop_id = target.getAttribute( 'data-pop-id' );
		if ( !pop_id )
		{
			return;
		}
		var self = $( target );
		var opt = {
			modal : true
		};
		var title = self.data( 'title' );
		if ( title )
		{
			opt.title = title;
		}
		var width = self.data( 'width' );
		if ( width )
		{
			opt.width = width;
		}
		var height = self.data( 'height' );
		if ( height )
		{
			opt.height = height;
		}
		var padding = self.data( 'padding' ) || 0;
		opt.padding = sparrow.intval( padding );
		var tpl = self.data( 'tpl' );
		if ( tpl )
		{
			opt.sparrow_tpl = tpl;
		}
		else
		{
			var dom = $( '#' + pop_id );
			if ( dom.length > 0 )
			{
				var tmp_css = 'sparrow_pop_window_tmp_css';
				if ( dom.hasClass( 'hide' ) )
				{
					var tmp_dom = $( '<div class="hide"></div>' ).appendTo( sparrow.body );
					dom.removeClass( 'hide' ).addClass( tmp_css ).appendTo( tmp_dom );
					var html_str = tmp_dom.html();
					tmp_dom.remove();
					opt.onclose = function() {
						dom.appendTo( sparrow.body ).addClass( 'hide' ).removeClass( tmp_css );
					}
					sparrow_win.open( html_str, opt );
				}
				else if ( dom.hasClass( tmp_css ) )
				{
					return;
				}
				else
				{
					dev_debug_error( '出错了，pop-data-id:' + pop_id + ' 没有包含 hide class' );
				}
			}
			else
			{
				dev_debug_error( '出错了， data-pop-id:' + pop_id + ' 没有tpl参数, 也没有找到指定的ID' );
			}
			return;
		}
		opt.id = pop_id;
		var tpl_url = self.data( 'url' );
		//需要请求服务器
		if ( tpl_url )
		{
			var post_data = self.data( 'post' );
			if ( post_data )
			{
				post_data = parse_json( post_data );
				ajax.post( tpl_url, post_data, pop_open_win, true, opt );
			}
			else
			{
				ajax.get( tpl_url, pop_open_win, true, opt );
			}
		}
		//不用请求服务器
		else
		{
			var tpl_data = parse_tpl_data( self.data( 'tpl-data' ) );
			pop_open_win( tpl_data, opt );
		}
	} );

	/**
	 * 解析模板数据
	 */
	function parse_tpl_data( tpl_data_str )
	{
		if ( !tpl_data_str || 'string' !== typeof tpl_data_str )
		{
			return {};
		}
		if ( 0 === tpl_data_str.indexOf( 'PACK::' ) )
		{
			if ( !sparrow_pack )
			{
				sparrow.error( '请加载 sparrow_pack 和 json' );
			}
			tpl_data_str = tpl_data_str.substring( 6 );
			return sparrow_pack.decode( tpl_data_str );
		}
		else
		{
			return parse_json( tpl_data_str );
		}
	}

	/**
	 * 数据parse
	 */
	function parse_json( json )
	{
		if ( 'string' !== typeof json )
		{
			json = '';
		}
		json = json.replace( /'/g, '"' );
		var re;
		try
		{
			re = sparrow_json.decode( json );
		}
		catch ( e )
		{
			re = { };
		}
		return re;
	}

	/**
	 * 弹
	 */
	function pop_open_win( data, opt )
	{
		smarty.open( opt.sparrow_tpl, data, opt, function() {
			pop_win_clear( opt.id );
		} );
	}

	/**
	 * 窗口管理
	 */
	function pop_win_clear( pop_id )
	{
		if ( pop_active_id && pop_active_id != pop_id )
		{
			sparrow_win.close( pop_active_id );
		}
		pop_active_id = pop_id;
	}

	//默认的插件
	function default_url( url, page_arg )
	{
		var reg = new RegExp( '&?' + page_arg + '=[0-9]+&?' );
		var re = url.replace( reg, function( tmp_str ) {
			var beg = '&' === tmp_str.substr( 0, 1 );
			var end = '&' === tmp_str.substr( -1, 1 );
			//前后都有&
			if ( beg && end )
			{
				return '&';
			}
			return '';
		} );
		//如果没有=号
		if ( -1 == re.indexOf( '=' ) )
		{
			if ( '/' !== re.substr( -1, 1 ) )
			{
				re += '/';
			}
		}
		else
		{
			re += '&';
		}
		return re;
	}
	/**
	 * 一页
	 */
	function a_page( page, goto_page, css_name, link_text )
	{
		if ( page === goto_page )
		{
			css_name = 'active';
		}
		if ( 'undefined' === typeof link_text )
		{
			link_text = goto_page;
		}
		var str = '<a';
		if ( 'string' === typeof css_name && css_name.length > 0 )
		{
			str += ' class="' + css_name + '"';
		}
		str += ' href="javascript:void(0)"';
		if ( 'event' === make_page_arg[ make_page_index ] )
		{
			str += ' data-form-item="page" data-value="' + goto_page + '"';
		}
		else
		{
			str += ' onclick="smarty_plugin_page( ' + goto_page + ', \'' + make_page_index + '\' )"';
		}
		str += '>' + link_text + '</a>';
		return str;
	}

	window.smarty_plugin_page = function( page, key )
	{
		if ( 'function' !== typeof make_page_arg[ key ] )
		{
			sparrow.error( '翻页出错了!' );
		}
		make_page_arg[ key ].apply( window, [ page ] );
	}

	window.smarty_jump_page = function( key )
	{
		var dom_id = 'page_jump_' + key;
		var page = document.getElementById( dom_id ).value;
		if ( page < 1 )
		{
			page = 1;
		}
		smarty_plugin_page( page, key );
	}
	/**
	 * 翻页
	 */
	function smarty_function_make_page( params )
	{
		if ( !sparrow.isset( params[ 'page_count' ] ) )
		{
			throw 'Make_page 缺少 page_count 参数';
		}
		//当前页
		var page = sparrow.isset( params[ 'page' ] ) ? sparrow.intval( params[ 'page' ] ) : 1;
		//总页数
		var page_count = sparrow.intval( params[ 'page_count' ] );
		//控制翻页变更的名字
		var page_arg = sparrow.isset( params[ 'page_arg' ] ) ? params[ 'page_arg' ] : 'page';
		//url
		var url = 'string' === typeof params[ 'url' ] ? params[ 'url' ] : document.location.href;
		//模板名
		var tpl = 'string' === typeof params[ 'tpl' ] ? params[ 'tpl' ] : smarty.current_tpl();
		//服务器控制不使用smarty输出的变量名
		var no_tpl_arg = 'string' === typeof params[ 'no_tpl' ] ? params[ 'no_tpl' ] : 'no_tpl';
		//总共显示多少页
		var page_length = sparrow.isset( params[ 'page_len' ] ) ? sparrow.intval( params[ 'page_len' ] ) : 10;
		//左边固定多少页
		var left_fix_page = sparrow.isset( params[ 'left_fix' ] ) ? sparrow.intval( params[ 'left_fix' ] ) : 2;
		//右边固定多少页
		var right_fix_page = sparrow.isset( params[ 'right_fix' ] ) ? sparrow.intval( params[ 'right_fix' ] ) : -1;
		//显示上一页
		var show_pre = true === params[ 'disable_pre' ] ? false : true;
		//显示下一页
		var show_next = true === params[ 'disable_next' ] ? false : true;
		//显示总共页数
		var show_page_count = true === params[ 'disable_total' ] ? false : true;
		//跳转
		var show_page_jump = false === params[ 'disable_jump' ] ? true : false;
		//显示方式
		var view_type = sparrow.intval( params[ 'view_type' ] );
		if ( view_type < 1 || view_type > 3 )
		{
			view_type = 3;
		}
		make_page_index = tpl.replace( /\//g, '_' );
		//如果url是一个可执行函数
		if ( 'function' === typeof window[ url ] )
		{
			make_page_arg[ make_page_index ] = window[ url ];
		}
		else if ( 'event' === url )
		{
			make_page_arg[ make_page_index ] = url;
		}
		else
		{
			url = default_url( url, page_arg );
			if ( 'string' !== typeof params[ 'id' ] )
			{
				return '<div class="sparrow_page_list red">make_page url不是回调函数 id 参数是必须的<div class="clear"></div></div>';
			}
			var div_id = params[ 'id' ];
			//加载内容存放的ID
			make_page_arg[ make_page_index ] = function( page ) {
				/*lzz modify*/
				//var new_url = url + page_arg + '=' + page;
				console.log(page);
				var new_url = url;
				var data = { };
				data[ page_arg ] = page; //lzz add
				data[ no_tpl_arg ] = 1;
				smarty.post( new_url, data, tpl, div_id );
			}
		}

		//分页的主要逻辑
		var result_arr = [ ];
		if ( page_count <= page_length )
		{
			for ( var i = 1;i <= page_count;++i )
			{
				result_arr.push( a_page( page, i ) );
			}
		}
		else
		{
			if ( left_fix_page + right_fix_page >= page_length )
			{
				left_fix_page = right_fix_page = sparrow.intval( page_length / 2 );
			}
			//从第一页开始
			result_arr.push( '' );
			var beg_page = 1;
			var end_page = page_count;
			var left_position = page_length;
			var tmp_result_arr = [ ];
			if ( left_fix_page > 0 )
			{
				for ( i = 1;i <= left_fix_page;i++ )
				{
					result_arr.push( i );
					beg_page++;
					left_position--;
				}
			}
			if ( right_fix_page > 0 )
			{
				for ( i = right_fix_page;i > 0;--i )
				{
					result_arr[ page_length - i + 1 ] = page_count - i + 1;
					end_page--;
					left_position--;
				}
			}
			var while_beg = page;
			if ( page < beg_page )
			{
				while_beg = beg_page;
			}
			else if ( page > end_page )
			{
				while_beg = end_page;
			}
			tmp_result_arr.push( while_beg );
			--left_position;
			var rank = 1;
			while ( left_position > 0 )
			{
				if ( while_beg + rank <= end_page )
				{
					tmp_result_arr.push( while_beg + rank );
					if ( 0 === --left_position )
					{
						break;
					}
				}
				if ( while_beg - rank >= beg_page )
				{
					tmp_result_arr.unshift( while_beg - rank );
					--left_position;
				}
				rank++;
			}
			for ( i = 0;i < tmp_result_arr.length;i++ )
			{
				result_arr[ i + beg_page ] = tmp_result_arr[ i ];
			}
			//左边固定长度
			if ( left_fix_page > 0 )
			{
				if ( left_fix_page > 1 && result_arr[ left_fix_page ] + 1 !== result_arr[ left_fix_page + 1 ] )
				{
					result_arr[ left_fix_page ] = -1;
				}
			}
			//右边固定
			if ( right_fix_page > 0 )
			{
				if ( right_fix_page > 1 && result_arr[ page_length - right_fix_page + 1 ] - 1 !== result_arr[ page_length - right_fix_page ] )
				{
					result_arr[ page_length - right_fix_page + 1 ] = -1;
				}
			}
			for ( i = 1;i <= page_length;i++ )
			{
				if ( -1 === result_arr[ i ] )
				{
					result_arr[ i ] = '<a class="more">...</a>';
				}
				else
				{
					result_arr[ i ] = a_page( page, result_arr[ i ] );
				}
			}
		}
		//显示前一页
		if ( show_pre )
		{
			var text = '';
			//需要显示文字
			if ( view_type & 1 )
			{
				text = i18n.get( 'previous' );
			}
			if ( page > 1 )
			{
				result_arr.unshift( a_page( page, page - 1, 'pre', text ) );
			}
			else
			{
				result_arr.unshift( '<a class="pre disabled">' + text + '</a>' );
			}

		}
		//显示下一页
		if ( show_next )
		{
			//需要显示文字
			if ( view_type & 1 )
			{
				text = i18n.get( 'next' );
			}
			if ( page !== page_count )
			{
				result_arr.push( a_page( page, page + 1, 'next', text ) );
			}
			else
			{
				result_arr.push( '<a class="next disabled">' + text + '</a>' );
			}
		}
		//显示图标
		if ( view_type & 2 )
		{
			var css_name = 'arrowOnly';
			//还要显示文字
			if ( view_type & 1 )
			{
				css_name = 'arrow';
			}
			result_arr.unshift( '<span class="page ' + css_name + '">' );
			result_arr.push( '</span>' );
		}

		//显示总共有多少页
		if ( show_page_count )
		{
			var tmp_count_str = '<span class="total"><span>共</span><span class="b">' + page_count + '</span><span>页</span></span>';
			result_arr.push( tmp_count_str );
		}
		//显示跳转
		if ( show_page_jump )
		{
			var dom_id = 'page_jump_' + make_page_index;
			var jump_tmp_str = '<span class="to"><span>去第</span><input id="' + dom_id + '" class="num" type="number" value="' + page + '" min="1" max="' + page_count + '"><span>页</span>';
			if ( 'event' === url ) {
				jump_tmp_str += '<input class="btn" type="button" value="确定" data-form-item="page" data-value="input:'+ dom_id +'">';
			}
			else {
				jump_tmp_str += '<input class="btn" type="button" value="确定" onclick="smarty_jump_page(\'' + make_page_index + '\')">';
			}
			result_arr.push( jump_tmp_str );
		}
		result_arr.unshift( '<div class="sparrow_page_list">' );
		result_arr.push( '</div>' );
		return result_arr.join( '' );
	}
	smarty.register_function( 'make_page', smarty_function_make_page );
	smarty.register_function( 'fix_static', function( arg ) {
		return sparrow.fix_static( arg.file );
	} );

	/**
	 * 截取字符串修正器
	 */
	smarty.register_modifier( 'truncate', function( str, len, joinstr ){
		len = len || 20;
		joinstr = joinstr || '...';
		return sparrow.substr( str, len, joinstr );
	} );

	/**
	 * 增长
	 */
	smarty.register_modifier( 'plus', function( id, step ){
		step |= 0;
		if ( step < 1 )
		{
			step = 1;
		}
		return parseInt( id, 10 ) + step;
	} );

	/**
	 * 是否存在
	 */
	smarty.register_modifier( 'isset', function( id, data ){
		data = data || window.OUT_DATA;
		return sparrow.isset( data[ id ] );
	} );

	/**
	 * 是否在数据中
	 */
	smarty.register_modifier( 'in_array', function( id, array ){
		return -1 !== sparrow.in_array( id, array );
	} );

	smarty.register_modifier( 'fix_static', sparrow.fix_static );
	smarty.register_modifier( 'json_encode', function( obj, is_replace )
	{
		var str = json.encode( obj );
		if ( false === is_replace )
		{
			return str;
		}
		return sparrow.filt_quote( str );
	} );
	/**
	 * 将数据导出到前端
	 */
	smarty.register_modifier( 'msgpack', function( obj, need_field )
	{
		if ( !sparrow_pack )
		{
			sparrow.error( '没有加载 sparrow/pack, json 模块, 请在主js文件中引入' );
		}
		var data = { };
		if ( 'string' === typeof need_field )
		{
			var tmp_need = need_field.split( ',' );
			for ( var i = 0; i < tmp_need.length; i++ )
			{
				var tmp_key = tmp_need[ i ].trim();
				if ( 0 == tmp_key.length || !sparrow.isset( obj[ tmp_key ] ) )
				{
					continue;
				}
				data[ tmp_key ] = obj[ tmp_key ];
			}
		}
		else
		{
			data = obj;
		}
		var str = sparrow_pack.encode( data );
		return 'PACK::' + str;
	} );

	/**
	 * 强转数字
	 */
	smarty.register_modifier( 'intval', function( val ) {
		return sparrow.intval( val );
	} );

	/**
	 * 其它参数和验证参数属性
	 */
	function param_ext_string( params, normal_arr, validate_arr )
	{
		var ext_str = '', val_str = '';
		for ( var p in params )
		{
			if ( sparrow.isset( normal_arr[ p ] ) )
			{
				continue;
			}
			var tmp_str = ' ' + p + '="' + params[ p ] + '"';
			if ( sparrow.isset( validate_arr ) )
			{
				val_str += tmp_str;
			}
			else
			{
				ext_str += tmp_str;
			}
		}
		return { ext_str : ext_str, val_str : val_str };
	}

	/**
	 * 生成radio
	 */
	smarty.register_function( 'make_radio', function( params ) {
		var normal_arr = { radio : 1, checked : 1 };
		var ext = param_ext_string( params, normal_arr, { } );
		var name = params[ 'name' ];
		var checked = sparrow.isset( params[ 'checked' ] ) ? params[ 'checked' ] : null;
		var result = [ ];
		for ( var value in params.radio )
		{
			result.push( '<label><input type="radio" value="' + value + '" name="' + name + '"' );
			if ( checked == value )
			{
				result.push( ' checked="checked"' );
			}
			result.push( ext.ext_str + '>', params.radio[ value ] + "</label>\n" );
		}
		return result.join( '' );
	} );

	/**
	 * 生成checkbox
	 */
	smarty.register_function( 'make_checkbox', function( params ) {
		var normal_arr = { checkbox : 1, checked : 1 };
		var validate_arr = { 'data-require' : 1, 'data-require-msg' : 1, 'data-max-check' : 1, 'data-max-check-msg' : 1 };
		var ext = param_ext_string( params, normal_arr, validate_arr );
		var checked = sparrow.isset( params[ 'checked' ] ) ? params[ 'checked' ] : null;
		var name = params[ 'name' ];
		var result = [ ], is_first = true;
		for ( var value in params.checkbox )
		{
			result.push( '<label><input  type="checkbox"  value="' + value + '"name="' + name + '"' );
			if ( checked == value )
			{
				result.push( ' checked="checked"' );
			}
			if ( is_first )
			{
				result.push( ext.val_str );
				is_first = false;
			}
			result.push( ext.ext_str + '>' + params.checkbox[ value ] + '</label>\r' );
		}
		return result.join( '' );
	} );

	/**
	 * 生成select
	 */
	smarty.register_function( 'make_select', function( params ) {
		var normal_arr = { ext_option : 1, option : 1, selected : 1 };
		var ext = param_ext_string( params, normal_arr, { } );
		var def_value = sparrow.isset( params[ 'selected' ] ) ? params[ 'selected' ] : null;
		var result = [ '<select', ext.ext_str, '>' ];
		for ( var value in params.option )
		{
			result.push( '<option value="' + value + '"' );
			if ( value == def_value )
			{
				result.push( ' selected="selected"' );
			}
			result.push( '>', params.option[ value ], "</option>\n" );
		}
		result.push( "</select>\n" );
		return result.join( '' );
	} );
	/**
	 * 格式化时间
	 */
	smarty.register_modifier( 'date', sparrow.date );

	//return smarty;