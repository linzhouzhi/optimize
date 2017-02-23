var $ = jQuery.noConflict();

/**----------------------------------ajax loading------------------------**/
var show_total = 0, is_append = false;
var shade_div = null, main_div = null, sparrow_layer = layer;
var ajax_loading= {
	show: function()
	{
		show_total++;
		if ( is_append )
		{
			shade_div.removeClass( 'hide' );
			main_div.removeClass( 'hide' );
		}
		else
		{
			var id = sparrow_layer.load( 2, {zIndex: 100000} );
			is_append = true;
			shade_div = $( '#layui-layer-shade' + id );
			main_div = $( '#layui-layer' + id );
		}
	},
	hide: function()
	{
		if ( 0 == show_total )
		{
			return;
		}
		if ( --show_total <= 0 && null !== shade_div )
		{
			shade_div.addClass( 'hide' );
			main_div.addClass( 'hide' );
			show_total = 0;
		}
	}
};
/*------------------------------------ajax_loading--------------------------end*/

	var is_ajaxing = false;
	var ajax_request_pool = [];
	var is_support_level2 = null;
	function ajax_push_pool( ajax_object )
	{
		if ( is_ajaxing )
		{
			ajax_request_pool.push( ajax_object );
		}
		else
		{
			is_ajaxing = true;
			ajax_object.send();
		}
	}

	/**
	 * 检查
	 */
	function ajax_pool_check()
	{
		if ( 0 === ajax_request_pool.length )
		{
			is_ajaxing = false;
			return;
		}
		var tmp_obj = ajax_request_pool.shift();
		tmp_obj.send();
	}

	/**
	 * 错误处理
	 */
	function sparrow_error_handle( data, is_manual, ajax_obj )
	{
		var arg = data.error_arg || data;
		switch( data.sparrowphp_error_code )
		{
			//简单的弹出错误消息,有可能有语言包支持
			case 9:
				var content = data.error_msg;
				var is_i18n = arg[ 0 ];
				//如果使用i18n
				if ( is_i18n )
				{
					content = i18n.get( content, arg[ 1 ] );
				}
				//如果有指定第三个参数, 表示错误消息是附加在指定的id上的
				if ( 3 == arg.length && document.getElementById( arg[ 2 ] ) )
				{
					$( '#' + arg[ 2 ] ).html( '<dt class="sparrow_error">'+ content +'</dt>' );
				}
				else
				{
					sparrow_win.error( content );
				}
			break;
			//confirm
			case 10:
				var content = data.error_msg;
				if ( arg.i )
				{
					content = i18n.get( content, arg.a );
				}
				ajax_obj.set_type( 'POST' );
				ajax_obj.url = arg.u;
				ajax_obj.ajax_data = arg.p;
				sparrow_win.confirm( content, function(){
					ajax_push_pool( ajax_obj );
				} );
			break;
			case 11:
				window.location.href = arg.url;
			break;
			default:
				if ( !is_manual )
				{
					sparrow_win.error( data.error_msg );
				}
			break
		}
	}
	/**
	 * 改良的ajax对象
	 */
	function sparrow_ajax( url, callback, data, is_loading, callback_arg )
	{
		this.ajax_data = data;
		this.url = url;
		this.callback_arg = callback_arg;
		if ( 'function' === typeof callback )
		{
			this.callback = callback;
		}
		else
		{
			this.callback = null;
		}
		if ( false === is_loading )
		{
			this.is_loading = false;
		}
	}
	sparrow_ajax.prototype = {
		is_loading: true,
		data_type: 'text',
		type: 'GET',
		level2: false,
		set_data_type: function( data_type )
		{
			this.data_type = data_type;
		},
		set_type: function( type )
		{
			this.type = type;
		},
		manual: function( option )
		{
			this.level2 = true;
			var xhr = new XMLHttpRequest();
			if ( 'function' === typeof option.progress_callback )
			{
				xhr.upload.addEventListener( 'progress', option.progress_callback, false );
			}
			xhr.addEventListener( 'load', sparrow.bind( this.manual_ok, this ), false );
			if ( 'function' !== typeof option.error_callback )
			{
				this.error_callback = option.error_callback;
			}
			xhr.addEventListener( 'error', sparrow.bind( function(){
				this.complete_handle();
				this.manual_error( '系统错误' );
			}, this ), false);
			this.xhr = xhr;
		},
		manual_ok: function( res )
		{
			this.complete_handle();
			if ( 200 !== res.target.status )
			{
				return this.manual_error( '出错：code:' + res.target.status + ' msg:' + res.target.statusText );
			}
			var result = res.target.responseText;
			if ( 'json' === this.data_type )
			{
				try
				{
					result = json.decode( result );
				}
				catch( e )
				{
					return this.manual_error( '服务器返回数据格式错误', true );
				}
			}
			this.success_handle( result );
		},
		manual_error: function( err_str )
		{
			sparrow.error( err_str );
			if ( this.error_callback )
			{
				this.error_callback( err_str );
			}
		},
		send: function()
		{
			if ( this.level2 )
			{
				this.xhr.open( 'POST', this.url );
				this.xhr.send( this.ajax_data );
			}
			else
			{
				var options = {
					url : this.url,
					dataType : this.data_type,
					type : this.type,
					error : sparrow.bind( this.error_handle, this ),
					success: sparrow.bind( this.success_handle, this ),
					complete: sparrow.bind( this.complete_handle, this )
				};
				if ( this.ajax_data && 'POST' === this.type )
				{
					options.data = this.ajax_data;
				}
				if ( this.is_loading )
				{
					ajax_loading.show();
				}
				$.ajax( options );
			}
		},
		complete_handle: function()
		{
			if ( this.is_loading )
			{
				ajax_loading.hide();
			}
			ajax_pool_check();
		},
		error_handle: function( ajax_obj )
		{
			if ( sparrow.is_dev() )
			{
				var title = '服务器返回错误';
				//需要ajax数据, 返回的不是ajax数据
				if ( 'json' === this.data_type && 4 === ajax_obj.readyState && ajax_obj.status < 300 )
				{
					title += '，返回结果非JSON';
				}
				title += ' status:' + ajax_obj.status +' ' + ajax_obj.statusText;
				sparrow_win.open( ajax_obj.responseText, {title:title, width:900} );
			}
			else
			{
				sparrow_win.alert( '亲，我们抱歉的通知您，您刚才的操作由于“系统错误”没有执行成功，我们已经记录错误日志，并将以最快的速度处理该错误。给您带来的不便敬请谅解。' );
			}
		},
		success_handle: function( data )
		{
			var has_error = false;
			if ( 'json' === this.data_type )
			{
				//有调试数据
				if ( data._DEBUG_DATA_ )
				{
					var tool = console;
					tool.detail( data._DEBUG_DATA_, data );
				}
				//有错误
				if ( data.sparrowphp_error_code > 0 )
				{
					has_error = true;
					var is_manual = sparrow.isset( data.error_view_type ) && 'manual' === data.error_view_type;
					if ( is_manual )
					{
						has_error = false;
					}
					sparrow_error_handle( data, is_manual, this );
				}
				//如果有消息提示
				if ( data._sparrow_AUTO_MSG_ )
				{
					msg_obj.init( data._sparrow_AUTO_MSG_ );
					delete( data._sparrow_AUTO_MSG_ );
				}
			}
			if ( !has_error && this.callback )
			{
				try
				{
					this.callback( data, this.callback_arg );
				}
				catch ( err )
				{
					sparrow.debug( 'Ajax 请求回调函数执行出错' );
					sparrow.error( err );
					sparrow.error( err.message );
					sparrow.debug( this );
				}
			}
		}
	};

	var ajax = {
		get: function( url, callback, is_loading, callback_arg )
		{
			var tmp_req = new sparrow_ajax( url, callback, null, is_loading, callback_arg );
			tmp_req.set_data_type( 'json' );
			ajax_push_pool( tmp_req );
		},
		post: function( url, data, callback, is_loading, callback_arg )
		{
			var tmp_req = new sparrow_ajax( url, callback, data, is_loading, callback_arg );
			tmp_req.set_data_type( 'json' );
			tmp_req.set_type( 'POST' );
			ajax_push_pool( tmp_req );
		},
		get_text: function( url, callback, is_loading, callback_arg )
		{
			var tmp_req = new sparrow_ajax( url, callback, null, is_loading, callback_arg );
			ajax_push_pool( tmp_req );
		},
		post_text: function( url, data, callback, is_loading, callback_arg )
		{
			var tmp_req = new sparrow_ajax( url, callback, data, is_loading, callback_arg );
			tmp_req.set_type( 'POST' );
			ajax_push_pool( tmp_req );
		},
		manual_post: function( url, data, callback, is_loading, option )
		{
			option = option || {};
			var callback_arg = option.callback_arg || null;
			var tmp_req = new sparrow_ajax( url, callback, data, is_loading, callback_arg );
			tmp_req.set_data_type( 'json' );
			tmp_req.manual( option );
			ajax_push_pool( tmp_req );
		},
		support_level2: function()
		{
			if ( null === is_support_level2 )
			{
				is_support_level2 = false;
				if ( window.XMLHttpRequest )
				{
					var xhr = new XMLHttpRequest;
					if ( 'undefined' !== typeof xhr.withCredentials )
					{
						is_support_level2 = true;
					}
					xhr = null;
				}
			}
			return is_support_level2;
		}
	};