var $ = jQuery.noConflict();
	var tab = {};
	var active_css = 'active';
	function tab_init( tab_list, content_list )
	{
		tab_list.each( function( index, tab_dom ){
			var jq_tab_dom = $( tab_dom );
			jq_tab_dom.click( function(){
				//已经active了
				if ( $( tab_dom ).hasClass( active_css ) )
				{
					return;
				}
				tab_list.each( function( i, tmp_tab ){
					var jq_tmp_tab = $( tmp_tab );
					if ( jq_tmp_tab.hasClass( active_css ) )
					{
						jq_tmp_tab.removeClass( active_css );
					}
				} );
				var tmp_tab_role = jq_tab_dom.attr( 'role' );
				content_list.each( function( i, tmp_div ){
					var jq_tmp_div = $( tmp_div );
					var tmp_role = jq_tmp_div.attr( 'role' );
					if ( jq_tmp_div.hasClass( active_css ) )
					{
						jq_tmp_div.removeClass( active_css );
					}
					else if ( tmp_tab_role === tmp_role )
					{
						jq_tmp_div.addClass( active_css );
					}
				} );
				jq_tab_dom.addClass( active_css );
			} );
		} );
	}

	tab.init = function( tab_id, content_id, tab_node_name, content_node_name ){
		tab_node_name = tab_node_name || 'li';
		content_node_name = content_node_name || 'div';
		var tab_list = $( '#' + tab_id +' '+ tab_node_name );
		var content_list = $( '#' + content_id +' '+ content_node_name );
		tab_init( tab_list, content_list );
	};
	tab.init_dom = function( tab_node, content_node ){
		var tab_list = tab_node.children();
		var content_list = content_node.children();
		tab_init( tab_list, content_list );
	};

	/**
	 * 根据传入的字符串找到相同的内容
	 */
	function find_object( str )
	{
		if ( 'string' !== typeof str || 0 === str.length )
		{
			return;
		}
		//第一个字母是 . 表示 按class查找
		if ( '.' === str.charAt(0) )
		{
			return $( str );
		}
		//如果全是字母数字和_组成
		if ( /^[\w]+$/.test( str ) )
		{
			return $( '#' + str )
		}
		return $( str );
	}

	/**
	 * css切换
	 */
	function togoole_css_call( item ) {
		var css = item.data( 'toggle-css' ), toggle_text = item.data( 'toggle-text' );
		var toggle_flag = item.data( 'toggle-flag' ) || 0;
		toggle_flag = 1 - toggle_flag;
		item.data( 'toggle-flag', toggle_flag );
		if ( item.hasClass( css ) )
		{
			item.removeClass( css );
		}
		else
		{
			item.addClass( css );
		}

		//里边的文字也变化
		if ( 'undefined' !== typeof toggle_text )
		{
			var init_text = item.data( 'init-text' );
			if ( 'undefined' === typeof init_text )
			{
				init_text = item.html();
				init_text = init_text.replace( /\r|\n/g, '' );
				init_text = init_text.trim();
				item.data( 'init-text', init_text );
			}
			var new_text = init_text;
			if ( toggle_flag )
			{
				//如果内容有标签, 不替换标签, 只替换标签里边的内容
				new_text = init_text.replace( /(<.+>)?.+(<\/[a-z]+>)?/, '$1' + toggle_text + '$2' );
			}
			item.html( new_text );
		}
		var link_str = item.data( 'toggle-link' );
		if ( !link_str )
		{
			return;
		}
		var toggle_link_body = find_object( link_str );
		if ( !toggle_link_body || 0 === toggle_link_body.length )
		{
			return;
		}
		var link_css = item.data( 'toggle-link-css' );
		if ( link_css )
		{
			if ( toggle_link_body.hasClass( link_css ) )
			{
				toggle_link_body.removeClass( link_css );
			}
			else
			{
				toggle_link_body.addClass( link_css );
			}
		}
		var link_animate = item.data( 'toggle-link-animate' ), animate_value = item.data( 'toggle-animate-value' ) || 30;
		var animate_time = item.data( 'toggle-animate-time' ) || 300;
		if ( link_animate )
		{
			var init_value = toggle_link_body.data( 'animate-init-value' );
			if ( 'undefined' === typeof init_value )
			{
				switch ( link_animate )
				{
					case 'height':
						init_value = toggle_link_body.height();
					break;
					case 'width':
						init_value = toggle_link_body.width();
					break;
					//如果还有其它的, 继续添加
					default:
						sparrow.error( '不支持的toggle-animate:' + link_animate );
						return;
					break;
				}
				toggle_link_body.data( 'animate-init-value', init_value );
			}
			var new_value = toggle_flag ? animate_value + init_value : init_value;
			var arg = {};
			arg[ link_animate ] = new_value;
			toggle_link_body.stop().animate( arg, animate_time );
		}
	}

	/**
	 * 切换标签
	 */
	function tab_switch_call( tab_item ) {
		var parent_node = $( tab_item.parentNode );
		//指定css_name
		var css_name = parent_node.data( 'sparrow-tab-css' ) || 'active';
		var this_tab_name = tab_item.getAttribute( attribute_item );
		var item_num = 0;
		var item_list = parent_node.find( '[' + attribute_item + ']' );
		item_list.each( function( i, item ){
			var tab_name = item.getAttribute( attribute_item );
			if ( !sparrow.isset( item_list[ tab_name ] ) )
			{
				item_list[ tab_name ] = 1;
				item_num++;
			}
			if ( tab_item === item )
			{
				$( item ).addClass( css_name );
			}
			else
			{
				$( item ).removeClass( css_name );
			}
		} );
		//如果所有的tab都叫相同的名称
		if ( 1 === item_num )
		{
			return;
		}
		//关联的内容
		var body_list = $( '['+ attribute_body +']' );
		if ( 0 === body_list.length )
		{
			return;
		}
		body_list.each( function( i, item ){
			var name = item.getAttribute( attribute_body );
			if ( !sparrow.isset( item_list[ name ] ) ){
				return;
			}
			if ( name === this_tab_name )
			{
				$( item ).addClass( css_name );
			}
			else
			{
				$( item ).removeClass( css_name );
			}
		} );
	}

	var current_route = null;
	/**
	 * 事件传递
	 */
	function trigger_click_call( item )
	{
		if ( current_route === item[ 0 ] ){
			return;
		}
		current_route = item[ 0 ];
		var str = item.data( 'event-route' );
		var dom = find_object( str );
		if ( !dom || 0 === dom.length )
		{
			return;
		}
		dom.trigger( 'click' );
		current_route = null;
	}

	var attribute_item = 'data-sparrow-tab-item', attribute_body = 'data-sparrow-tab-body';

	/**
	 * radio切换
	 */
	function toggle_radio_call( target )
	{
		var name = target.data( 'sparrow-radio' );
		var input_id = 'sparrow_radio_'+ name +'_input';
		var value = target.data( 'value' ) || '';
		var input = $( '#' + input_id )
		if ( 0 === input.length )
		{
			return sparrow.error( '出错了, 没有找到 input:'+ input_id );
		}
		var css_name = 'active';
		$( '[data-sparrow-radio="'+ name +'"]' ).each( function( index, item ){
			$( item ).removeClass( css_name );
		} );
		target.addClass( css_name );
		input.val( value ).trigger( 'change' ).trigger( 'blur' );
	}

	/**
	 * checkbox切换
	 */
	function toggle_checkbox_call( target )
	{
		var name = target.data( 'sparrow-checkbox' );
		var input_id = 'sparrow_radio_'+ name +'_input';
		var input = $( '#' + input_id )
		if ( 0 === input.length )
		{
			return sparrow.error( '出错了, 没有找到 input:'+ input_id );
		}
		var css_name = 'active';
		var result = [];
		$( '[data-sparrow-checkbox="'+ name +'"]' ).each( function( index, item ){
			//如果它自己本身
			if ( target[ 0 ] === item )
			{
				if ( target.hasClass( css_name ) )
				{
					target.removeClass( css_name );
				}
				else
				{
					target.addClass( css_name );
				}
			}
			item = $( item );
			if ( item.hasClass( css_name ) )
			{
				result.push( item.data( 'value' ) );
			}
		} );
		input.val( result.join() ).trigger( 'change' ).trigger( 'blur' );
	}

	/**
	 * 找到tab
	 */
	function find_sparrow_tab_item( target, rank )
	{
		if ( rank >= 2 || !target )
		{
			return null;
		}
		if ( target && target.parentNode )
		{
			//tab和标签的切换
			if ( target.getAttribute( attribute_item ) )
			{
				tab_switch_call( target );
			}
			//radio标签
			if ( target.getAttribute( 'data-sparrow-radio' ) )
			{
				toggle_radio_call( $( target ) );
			}
			//checkbox标签
			if ( target.getAttribute( 'data-sparrow-checkbox' ) )
			{
				toggle_checkbox_call( $( target ) );
			}
			//css效果切换
			if ( target.getAttribute( 'data-toggle-css' ) )
			{
				togoole_css_call( $( target ) );
			}
			//事件路由
			if ( target.getAttribute( 'data-event-route' ) )
			{
				trigger_click_call( $( target ) );
			}
		}
		return find_sparrow_tab_item( target.parentNode, rank + 1 );
	}

	/**
	 * 全局点击事件
	 */
	$( document ).bind( 'click', function( eve ){
		find_sparrow_tab_item( eve.target, 0 );
	} );
