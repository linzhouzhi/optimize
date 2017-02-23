
	/**
	 * 是否有消息正在显示
	 */
	var msg_is_show = false;
	var msg_pool = [];
	var msg_push = function( amsg )
	{
		if ( msg_is_show )
		{
			msg_pool.push( amsg );
		}
		else
		{
			msg_show( amsg );
		}
	}

	/**
	 * 检查是否有有框需要弹出
	 */
	function check_msg_pool()
	{
		if ( 0 == msg_pool.length )
		{
			msg_is_show = false;
			return;
		}
		msg_show( msg_pool.shift() );
	}

	/**
	 * 显示
	 */
	function msg_show( amsg )
	{
		var is_i18n = amsg.i, content = amsg.m, type = amsg.t, arg = amsg.a;
		//如果使用前端解析
		if ( 0 !== is_i18n )
		{
			content = i18n.get( content, arg );
		}
		if ( sparrow.is_mobile() )
		{
			alert( content );
			return;
		}
		msg_is_show = true;
		switch( type )
		{
			case 1:
				sparrow_win.alert( content, check_msg_pool );
			break;
			case 2:
				sparrow_win.modal( content, check_msg_pool );
			break;
			case 3:
				sparrow_win.msg( content, {offset:'rb', title:'系统消息', area:['240px','120px'], shift:2, closeBtn:1}, check_msg_pool );
			break;
			case 4:
				sparrow_win.msg( content, {}, check_msg_pool );
			break;
		}
	}
	var msg_obj = {
		'init': function( msg_arr )
		{
			if ( !sparrow.is_array( msg_arr ) )
			{
				return;
			}
			for( var i = 0; i < msg_arr.length; ++i )
			{
				msg_push( msg_arr[ i ] );
			}
		},
		push: msg_push
	};
