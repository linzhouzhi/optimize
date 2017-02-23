<td><input type="checkbox"></td>
<td>{{$rs.id|admin_id}}</td>
<td>{{$rs.admin_name}}</td>
<td>{{$rs.admin_pwd}}</td>
<td>{{$rs.login_time|date:"Y-m-d D"}}</td>
<td>
	<a data-tpl-data="{{$rs|msgpack}}" data-pop-id="demo_add" data-tpl="jstpl/demo_add" data-title="修改" data-width="600">修改</a>
</td>
<td>
    <a data-tpl-data="{{$rs|msgpack}}" data-pop-id="demo_add" data-tpl="jstpl/demo_detail" data-title="详情" data-width="600">详情</a>
</td>