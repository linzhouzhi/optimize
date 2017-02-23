<form class="form-horizontal" id="admin_add_form">
    <div class="mb10">
        <span class="re_left"><span class="icon_index icon_index_24"></span>选择类型:</span>
									<span class="lh30" id="content_change_box">
										<label data-newe-tab-item="out"><input type="radio" name="content_type"  data-require="1" value="1">out</label>
										<label data-newe-tab-item="up" ><input type="radio" name="content_type"  data-require="1" value="2">up</label>
									</span>
        <span class="newe_input_tip_2" id="content_tip"></span>
    </div>

    <div class="mb10 hide active" data-newe-tab-body="out">
        <div class="mb10">
            <span class="re_left"><span class="icon_index icon_index_24"></span>外部链接1:</span>
										<span>
											<input type="text" name="out_link"  value="" data-require-if="content_type:1" data-type="url" data-format-msg="链接请以http://开头"  placeholder="http://">
										</span>
            <div class="newe_input_tip_info warning" id="out_link_tip" style="margin-left:410px">请确认您的稿件链接无误。</div>
        </div>
    </div>

    <div class="mb10 hide active" data-newe-tab-body="up">
        <div class="mb10">
            <span class="re_left"><span class="icon_index icon_index_24"></span>外部链接2:</span>
										<span>
											<input type="text" name="out_link2"  value="" data-require-if="content_type:2" data-type="url" data-format-msg="链接请以http://开头"  placeholder="http://">
										</span>
            <div class="newe_input_tip_info warning" id="out_link2_tip" style="margin-left:410px">请确认您的稿件链接无误。</div>
        </div>
    </div>

	<div class="form-group" id="admin_name_div">
		<label for="inputname" class="col-sm-4 control-label">用户名</label>
		<div class="col-sm-8">
			<input name="admin_name" type="text" {{if !empty($admin_name)}} value="{{$admin_name}}"{{/if}}class="form-control" placeholder="请输入用户名" data-require="1" data-len="2-50" id="admin_name_text">
            <div class="newe_input_tip_info warning" id="admin_name_tip" style="margin-left:410px">请为您取一个好记的名字，不小于2个字不超过50个汉字。</div>
		</div>
	</div>
	<div class="form-group">
		<label for="inputpwd" class="col-sm-4 control-label">密码</label>
		<div class="col-sm-8">
			<input name="admin_pwd" type="password" class="form-control" placeholder="请输入密码" id="admin_pwd_text">
		</div>
	</div>
	<div class="form-group">
		<label for="inputpwd" class="col-sm-4 control-label">密码确认</label>
		<div class="col-sm-8">
			<input name="admin_repwd" type="password" class="form-control" placeholder="请再次输入密码" id="admin_repwd_text">
		</div>
	</div>
	<div class="form-group">

		<div class="col-sm-offset-4 col-sm-8">
			{{if !empty( $admin_name )}}
				<input type="hidden" value="{{$id}}" id="admin_id_input">
				<button type="button" class="btn btn-primary" id="demo_admin_add_btn" onclick="demo_post_edit()"> 修改 </button>
			{{else}}
				<button type="button" class="btn btn-primary" id="demo_admin_add_btn" onclick="demo_post_add()"> 添 加 </button>
			{{/if}}
			&nbsp;<button type="button" class="btn" i="close"> 关闭 </button>
		</div>
	</div>
</form>