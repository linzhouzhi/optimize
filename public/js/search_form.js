var $ = jQuery.noConflict();
var search_form = {};
	search_form.init = function( parent, option ){
		parent = sparrow.jq_dom( parent );
		if ( 'object' !== typeof option )
		{
			option = {};
		}
		if ( 'function' !== typeof option.callback )
		{
			if ( !option.url || !option.container )
			{
				return sparrow.error( 'search form init 的参数没有callback, 也没有url和container' );
			}
			option.callback = function( post_arg ){
				var tpl = option.tpl || smarty.current_tpl();
				if ( !tpl )
				{
					return sparrow.error( 'search_form 无法自动检测tpl,请传入tpl参数' );
				}
				smarty.post( option.url, post_arg, tpl, option.container );
			};
		}
		var post_arg = { no_tpl: 1 }, related_input = {};
		//关联输入框检测
		var all_items_list = $( '[data-form-item]' );
		all_items_list.each( function( i, item ){
			var val_str = item.getAttribute( 'data-value' );
			if ( 'string' !== typeof val_str )
			{
				return;
			}
			var id_str = parse_form_input( val_str, false );
			if ( false !== id_str )
			{
				related_input[ item.getAttribute( 'data-form-item' ) ] = id_str;
			}
		});
		//值初始化
		if ( 'object' === typeof option.init_value )
		{
			all_items_list.each( function( i, item ){
				var self = $( item );
				var tmp_name = self.data( 'form-item' );
				if ( !sparrow.isset( option.init_value[ tmp_name ] ) )
				{
					return;
				}
				var val = option.init_value[ tmp_name ];
				if ( 'SELECT' === item.nodeName )
				{
					self.val( val );
					post_arg[ tmp_name ] = val;
				}
				else
				{
					var value = self.data( 'value' );
					//这里不能用绝对相等
					if ( value == val )
					{
						self.trigger( 'click' );
					}
				}
			} );
			for ( var p in option.init_value )
			{
				post_arg[ p ] = option.init_value[ p ];
			}
		}
		var option_view = false, option_view_str = {};
		all_items_list = null;
		if ( option.view )
		{
			var option_veiw_dom = sparrow.jq_dom( option.view );
			if ( option_veiw_dom.length > 0 )
			{
				option_view = true;
				option_veiw_dom.on( 'click', '.sparrow_search_form_option_clear', function( eve ){
					var target = $( eve.currentTarget );
					var name = target.data( 'item-clear' );
					$( "[data-form-item='"+ name +"']" ).each( function( i, item ){
						item = $( item );
						if ( undefined === item.data( 'value' ) )
						{
							item.trigger( 'click' );
						}
					} );
				} );
			}
		}
		/**
		 * 解析
		 */
		function encode_form( eve )
		{
			var target = $( eve.currentTarget );
			var arg_name = target.data( 'form-item' );
			if ( !arg_name )
			{
				return;
			}
			var arg_value;
			if ( 'SELECT' === target[ 0 ].nodeName )
			{
				arg_value = target.val();
			}
			else
			{
				arg_value = target.data( 'value' );
				if ( 'string' === typeof arg_value )
				{
					arg_value = parse_arg_value( arg_value );
				}
			}
			if ( post_arg[ arg_name ] == arg_value )
			{
				return;
			}
			post_arg[ arg_name ] = arg_value;
			if ( sparrow.is_dev() ) {
				console.debug( post_arg );
			}
			option.callback( post_arg );
			//每次请求完后, 把page参数清除
			if ( sparrow.isset( post_arg[ 'page' ] ) )
			{
				delete( post_arg[ 'page' ] );
			}
			//显示已选条件
			if ( option_view )
			{
				option_view_str[ arg_name ] = parse_option_title( target, arg_value );
				make_option_view( option_veiw_dom, post_arg, option_view_str );
			}
			//更改相应的input的值
			if ( sparrow.isset( related_input[ arg_name ] ) )
			{
				related_input_set_value( related_input[ arg_name ], arg_value, arg_value );
			}
		}
		//事件绑定
		parent.on( 'click', '[data-form-item]', encode_form );
		parent.on( 'change', 'select[data-form-item]', encode_form );
		parent.on( 'change', 'input[data-form-item]', encode_form );
	};
	/**
	 * 显示已经选中
	 */
	function make_option_view( dom, post_arg, view_str_arr )
	{
		var html_arr = [];
		for ( var p in post_arg )
		{
			if ( undefined === post_arg[ p ] )
			{
				continue;
			}
			var tmp_list = $( "[data-form-name='"+ p +"']" );
			if ( 0 === tmp_list.length )
			{
				continue;
			}
			var title = $( tmp_list[ 0 ] ).data( 'form-title' );
			if ( !title )
			{
				continue;
			}
			html_arr.push( '<span class="choose_type_close"' );
			html_arr.push( '>'+ title +'：' + view_str_arr[ p ] );
			html_arr.push( '<a href="javascript:;" data-item-clear="'+ p +'" ' );
			html_arr.push( 'class="sparrow_search_form_option_clear">关闭</a></span>' );
		}
		dom.html( html_arr.join( '' ) );
	}

	/**
	 * 解析值
	 */
	function parse_arg_value( arg_value ){
		var tmp_val = parse_form_input( arg_value, true );
		if ( false !== tmp_val )
		{
			arg_value = tmp_val;
		}
		return arg_value;
	}

	/**
	 * 输出input相关的值
	 */
	function parse_form_input( value_str, return_value )
	{
		if ( -1 === value_str.indexOf( 'input:' ) )
		{
			return false;
		}
		value_str = value_str.substring( 6 );
		var split_char = split_str_check( value_str );
		var tmp_arr = value_str.split( split_char ), inp_id, re_arr = [];
		for ( var i = 0; i < tmp_arr.length; i++ )
		{
			inp_id = tmp_arr[ i ].trim();
			var inp_obj = sparrow.get_id( inp_id );
			if ( !inp_obj )
			{
				continue;
			}
			if ( return_value )
			{
				re_arr.push( inp_obj.value.trim() );
			}
			else
			{
				re_arr.push( inp_id );
			}
		}
		return re_arr.join( split_char );
	}

	/**
	 * 关联表单设值
	 */
	function related_input_set_value( input_str, input_value )
	{
		var split_char = split_str_check( input_str );
		var input_arr = input_str.split( split_char );
		if ( 'string' === typeof input_value )
		{
			input_value = input_value.split( split_char );
		}
		else if ( 'undefined' === typeof input_value )
		{
			input_value = '';
		}
		//只有一项
		if ( 1 === input_arr.length )
		{
			$( '#' + input_arr[ 0 ] ).val( input_value ).trigger( 'change' );
			return;
		}
		for ( var i = 0; i < input_arr.length; i++ )
		{
			var tmp_val = '';
			if ( sparrow.is_array( input_value ) && input_value.length > i )
			{
				tmp_val = input_value[ i ];
			}
			$( '#' + input_arr[ i ] ).val( tmp_val ).trigger( 'change' );
		}
	}

	/**
	 * 检测分隔符
	 */
	function split_str_check( str )
	{
		if ( -1 !== str.indexOf( '-' ) )
		{
			return '-';
		}
		if ( -1 !== str.indexOf( ',' ) )
		{
			return ',';
		}
		if ( -1 !== str.indexOf( '|' ) )
		{
			return '|';
		}
		return ' ';
	}

	/**
	 * 去除html
	 */
	function strip_tags( input, allowed )
	{
		allowed = ( ( ( allowed || '' ) + '' )
				.toLowerCase()
				.match( /<[a-z][a-z0-9]*>/g ) || [ ] )
				.join( '' );
		var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
		return input.replace( commentsAndPhpTags, '' ).replace( tags, function( $0, $1 ){
			return allowed.indexOf( '<' + $1.toLowerCase() + '>' ) > -1 ? $0 : '';
		} );
	}

	/**
	 * 检测title
	 */
	function parse_option_title( target, value )
	{
		var node_name = target[ 0 ].nodeName;
		if ( 'SELECT' === node_name )
		{
			var opt = target.find( 'option[value="'+ value +'"]' );
			if ( opt.length > 0 )
			{
				return opt.html();
			}
			return value;
		}
		else
		{
			var v = target.data( 'value' );
			if ( 'string' === typeof v && -1 !== v.indexOf( 'input:' ) )
			{
				v = v.substring( 6 );
				var split_char = split_str_check( v );
				var tmp_arr = v.split( split_char ), tmp_value_arr = [], input_obj;
				for ( var i = 0; i < tmp_arr.length; i++ )
				{
					input_obj = sparrow.get_id( tmp_arr[ i ] );
					if ( 'SELECT' === input_obj.nodeName )
					{
						tmp_value_arr.push( parse_option_title( $( input_obj ), input_obj.value ) );
					}
					else
					{
						tmp_value_arr.push( value );
						break;
					}
				}
				return tmp_value_arr.join( split_char );
			}
		}
		return strip_tags( target.html() );
	}

	/**
	 * 一个通用的排序修正
	 */
	smarty.register_modifier( 'order_form', function( order_type, value_1, value_2, css_name ){
		order_type |= 0;
		value_1 |= 0;
		value_2 |= 0;
		css_name = css_name || 'icon_sort';
		var result = [];
		var css_fix = '1', value = value_1;
		if ( value_1 === order_type )
		{
			css_fix = 2;
			value = value_2;
		}
		else if ( value_2 === order_type )
		{
			css_fix = 3;
		}
		result.push( 'class="icon_sort_'+ css_fix +'"' );
		result.push( 'data-form-item="order_type"' );
		result.push( 'data-value="'+ value +'"' );
		return result.join( ' ' );
	} );
	/**
	 * checkbox 保持一致
	 */
	sparrow.body.on( 'click', ':checkbox', function( eve ){
		var target = eve.currentTarget;
		var box_group = target.getAttribute( 'data-box-child' );
		if ( box_group )
		{
			var master_box = $( 'input[data-box-group="'+ box_group +'"]' );
			if ( 0 === master_box.length )
			{
				return;
			}
			var all_check = true;
			$( 'input[data-box-child="'+ box_group +'"]' ).each( function( i, item ){
				if ( !item.checked )
				{
					all_check = false;
				}
			} );
			master_box[ 0 ].checked = all_check;
		}
		else
		{
			box_group = target.getAttribute( 'data-box-group' );
			if ( box_group )
			{
				$( 'input[data-box-child="'+ box_group +'"]' ).each( function( i, item ){
					item.checked = target.checked;
					$( item ).trigger( 'change' );
				} );
			}
		}
	} );