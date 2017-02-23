	var lang_data = {};
	var lang_list = i18n_lang_detect();
	for ( var i = lang_list.length - 1;  i >= 0; --i )
	{
		var map = [];
		i18n_append( map );
	}
	/**
	 * 加入语言包库
	 */
	function i18n_append( data )
	{
		if ( 'object' != typeof data )
		{
			return;
		}
		for ( var p in data )
		{
			lang_data[ p ] = data[ p ];
		}
	}

	/**
	 * 获取
	 * @returns {undefined}
	 */
	function i18n_get( key, arg )
	{
		//不存在
		if ( !sparrow.isset( lang_data[ key ] ) )
		{
			return key;
		}
		var content = lang_data[ key ];
		if ( !sparrow.is_array( arg ) || 0 === arg.length )
		{
			return content;
		}
		var len = arg.length;
		for ( var i = 0; i < len; ++i )
		{
			content = content.replace( '{' + i + '}', arg[ i ] );
		}
		return content;
	}
	var i18n = {
		/*
		 * 获取语言包
		 */
		get: function( key, arg )
		{
			return i18n_get( key, arg );
		},
		/**
		 * 加入一个语言包库
		 */
		append: function( data )
		{
			i18n_append( data );
		}
	};


/**
 * 语言包检测
 */
function i18n_lang_detect()
{
	//暂时写死
	var default_lang = 'zh_CN';
	function browser_lang_code( lang )
	{
		lang = lang.toLowerCase().replace( '-', '_' );
		if( lang.length > 3 )
		{
			lang = lang.substring( 0, 3 ) + lang.substring( 3 ).toUpperCase();
		}
		return lang;
	}
	//浏览器检测
	var browser_lan = browser_lang_code( navigator.language || navigator.userLanguage );
	var result_list = [ window.STATIC_URL + 'sparrow/js/i18n/lang' ];
	if ( window.I18N_MAIN )
	{
		var files = window.I18N_MAIN.split( ',' );
		for ( var i = 0;  i < files.length;  ++i )
		{
			var tmp = files[ i ].replace( /(^\s*)|(\s*$)/g, "" );
			if ( 0 == tmp.length )
			{
				continue;
			}
			tmp = window.STATIC_URL + tmp;
			result_list.push( tmp );
		}
	}
	//如果浏览器语言不是系统默认的语言
	if ( default_lang != browser_lan )
	{
		for ( var i = result_list.length - 1;  i >= 0;  --i )
		{
			result_list.push( result_list[ i ] + '_' + browser_lan );
		}
	}
	return result_list;
}
