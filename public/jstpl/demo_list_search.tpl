<table class="table table-striped  m-b-none">
	<thead>
		<tr>
			<th class="with-checkbox">
				<input type="checkbox" />
			</th>
			<th>ID</th>
			<th class="col-sm-1">管理员</th>
			<th class="col-sm-1 mn70">密码</th>
			<th class="col-sm-2">权限</th>
			<th class="col-sm-2">login_time</th>
			<th class="col-sm-2">编辑</th>
		</tr>
	</thead>
	<tbody>
		{{foreach from=$admin_list item=rs}}
		<tr id="admin_row_{{$rs.id}}">
		{{include file="jstpl/demo_list_row.tpl"}}
		</tr>
		{{/foreach}}
	</tbody>
</table>
<pre>
make_page 参数说明:<br/>
1.page: 当前页 【必传】<br/>
2.page_count: 总页数 【必传】<br/>
3.id: 局部更新的ID 【必传】<br/>
4.page_arg: 控制翻页变更的名字（默认值：page）<br/>
5.url: 翻页url（默认值：当前的url）<br/>
6.tpl: 模板名（默认值：当前使用的模板）<br/>
7.no_tpl: 服务器控制不使用smarty输出的变量名 默认值 'no_tpl'<br/>
8.page_len: 总共显示多少个分页标签 默认值: 10<br/>
9.left_fix: 左边固定多少个分布标签  默认值: 2<br/>
10.right_fix: 右边固定多少个分布标签 默认值: 0<br/>
11.disable_pre: 不显示“上一页” 默认: false<br/>
12.disable_next: 不显示“下一页” 默认: false<br/>
13.disable_total: 不显示总共有多少页 默认: false<br/>
14.disable_jump: 不显示页面快跳转 默认: true<br/>
15.view_type: 3：文字 + 图标 1：只有文字 2：只有图标  默认值：3 <br/>
</pre>
<pre>{make_page page=$page page_count=$page_count id="admin_list_div" disable_jump=true page_len=1 view_type=2 disable_total=true}</pre>
{{make_page page=$page page_count=$page_count id="admin_list_div" disable_jump=true page_len=1 view_type=2 disable_total=true}}
{{make_page page=$page page_count=$page_count id="admin_list_div" left_fix=0 view_type=2 page_len=8}}
{{make_page page=$page page_count=$page_count id="admin_list_div" right_fix=2 disable_pre=true disable_next=true disable_total=true}}
{{make_page page=$page page_count=$page_count id="admin_list_div" left_fix=5 page_len=18}}
{{make_page page=$page page_count=$page_count id="admin_list_div" left_fix=-1 right_fix=2 disable_jump=false}}
{{make_page page=$page page_count=$page_count id="admin_list_div" left_fix=-1 right_fix=-1}}
{{make_page page=$page page_count=$page_count id="admin_list_div" right_fix=-1}}
{{make_page page=$page page_count=$page_count id="admin_list_div" right_fix=-1 page_len=20}}
{{make_page page=$page page_count=$page_count id="admin_list_div" right_fix=5 left_fix=5 page_len=25 disable_total=true}}
{{make_page page=$page page_count=$page_count id="admin_list_div" right_fix=-1 left_fix=-1 page_len=30 disable_total=true disable_pre=true disable_next=true url="ajax_demo"}}
