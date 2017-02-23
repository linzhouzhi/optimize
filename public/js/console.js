var tool = {
	/**
	 * 调试函数
	 */
	detail: function( debug_data, re_data )
	{
		var title = 'm=' + debug_data.m + '&c=' + debug_data.c + '&a=' + debug_data.a + ' Runtime:' + ( debug_data.total_runtime * 1000 ).toFixed( 3 ) + 'ms';
		if ( !window.console || !window.console.groupCollapsed )
		{
			return;
		}
		if ( debug_data.debug_error && debug_data.debug_error.length > 0 && !document.getElementById( 'tool_run_code_result' ) )
		{
			console.error( debug_data.debug_error );
			var win = require( 'window' );
			var alert_msg = '<pre style="background-color: #f2dede;color:red; padding:10px; overflow:scroll">'+ debug_data.debug_error +'</pre>';
			win.open( alert_msg, {title:'服务器运行错误', width:800} );
		}
		console.groupCollapsed( "本次请求详情 %c" + title, "color:blue" );
		if ( debug_data.debug_str && debug_data.debug_str.length > 0 )
		{
			console.info( debug_data.debug_str );
		}
		if ( debug_data.echo_str && debug_data.echo_str.length > 0 )
		{
			console.debug( debug_data.echo_str );
		}
		//delete( re_data._DEBUG_DATA_ );
		print_r( re_data );
		console.groupEnd();
	},

/**
 * 类似php的print_r函数
 */
print_r: function( obj )
{
	var YILE_DEBUG_STR = [];
	function first_print( data, pre_fix  )
	{
		if ( 'object' != typeof data )
		{
			YILE_DEBUG_STR.push( data );
		}
		else
		{
			YILE_DEBUG_STR.push( "Array (\n" );
			var end_str = pre_fix + ')';
			pre_fix += "    ";
			if ( null != data && data.constructor == 'Array' )
			{
				for ( var i = 0; i < data.length; ++i )
				{
					YILE_DEBUG_STR.push( pre_fix + '['+ i +'] => ' );
					first_print( data[ i ], pre_fix );
					YILE_DEBUG_STR.push( "\n" );
				}
			}
			else
			{
				for ( var p in data )
				{
					if ( p === '_DEBUG_DATA_' )
					{
						continue;
					}
					YILE_DEBUG_STR.push( pre_fix + '['+ p +'] => ' );
					first_print( data[ p ], pre_fix );
					YILE_DEBUG_STR.push( "\n" );
				}
			}
			YILE_DEBUG_STR.push( end_str );
		}
	}
	first_print( obj, '' );
	console.info( YILE_DEBUG_STR.join( "" ) );
	YILE_DEBUG_STR = [];
	}
};