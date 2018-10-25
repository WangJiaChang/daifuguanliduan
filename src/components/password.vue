<template>
    <!-- form表单提交 -->
    <form action=""  method="post" id="myForm" enctype="multipart/form-data">
        <div class="password">
            <el-form :label-position="labelPosition" label-width="80px" size="small" :model="password">
                <el-form-item label="原密码">
                    <el-input v-model="password.oldpwd" type="password"></el-input>
                </el-form-item>
                <el-form-item label="修改密码">
                    <el-input v-model="password.newpwd" type="password"></el-input>
                </el-form-item>
                <el-form-item label="确认密码">
                    <el-input v-model="subpwd" type="password"></el-input>
                </el-form-item>
            </el-form>
            <el-button type="primary" class="password-btn" @click="change()" size="small">修改</el-button>
        </div>
    </form>
</template>

<script>
import Vue from 'vue';
import { Radio, RadioGroup,RadioButton,Input,Menu } from 'element-ui';

export default {
  name: 'login',
  data () {
    return {
        password:{
            oldpwd:"",
            newpwd:""
        },
        subpwd:'',
        labelPosition: 'right',
    }
  },
  methods:{
        // 登陆提交
        change:function(){ 
            event.preventDefault();
            let url = "https://dfadminapi.dimuen.com/admin/uppwd";
            let that = this;
            let data = "oldpwd="+that.password.oldpwd+"&newpwd="+that.password.newpwd;
            that.$http.get(url+"?"+data, {
                headers:{'Content-Type':'multipart/form-data'}
            })
            .then(function(response){
                if(response.body.result != 1){
                    that.open(2,response.body.msg);
                    that.reshImg();
                }
                else{//成功的
                    that.open(1,response.body.msg);
                }
            },function(err){
                that.open();
            }) 
        },
        // 提示信息调用
        open(i,msg) {
            let that = this;
            if(i==1){
                that.$message({
                    type: 'success',
                    message:msg
                });
            }
            else
            that.$message.error(msg);
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.password{
    padding: 20px;
    width: 400px;
}
.password-btn{
    margin-left:80px;
}
</style>