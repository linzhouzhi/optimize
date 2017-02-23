<form class="form-horizontal" id="admin_add_form">
	<div class="form-group" id="admin_name_div">
		<label for="inputname" class="col-sm-4 control-label">用户名</label>
		<div class="col-sm-8">
			<input name="admin_name" type="text" {{if !empty($admin_name)}} value="{{$admin_name}}"{{/if}}class="form-control" placeholder="请输入用户名" id="admin_name_text">
		</div>
	</div>
</form>