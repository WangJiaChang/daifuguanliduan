<template>
  <div style="padding:10px">
    <!-- 头部筛选条件 -->
    <div>
      <!-- 第一行的筛选 -->
      <div>
        <div class="cont-header">
          <el-input
            placeholder="请输入查询电话"
            v-model="condition.phone"
            clearable>
          </el-input>
          <el-button round type="primary" @click="getData()">搜索</el-button>
        </div>

        <div class="cont-header">
          <el-input
            placeholder="请输入商户名称"
            v-model="condition.name"
            clearable>
          </el-input>
          <el-button round type="primary" @click="getData()">搜索</el-button>
        </div>


        <div class="cont-header addSh">
          <el-button round type="primary" @click="addSh()">添加商户</el-button>
        </div>

      </div>
    </div>

    <!-- 主体部分，表格 -->
    <div class="cont-cont">
      <el-table
        :data="tableData"
        height="calc(100vh - 195px)"
        style="width: 100%;" 
        :header-cell-style="{'text-align':'center'}">
        <el-table-column label="用户电话">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.phone }}</span>
          </template>
        </el-table-column>
        <el-table-column label="商户名称">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.status=="0"?"禁用":"启用" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="剩余金额">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.amount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="已成功金额">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.successAmount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="已成功笔数">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.successCount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="审核中金额">
          <template slot-scope="scope" style="text-align=:center">
            <span style="margin-left: 10px">{{ scope.row.auditAmount  }}</span>
          </template>
        </el-table-column>
        <el-table-column label="审核中笔数"  >
          <template slot-scope="scope" style="text-align=:center">
            <span style="margin-left: 10px">{{ scope.row.auditCount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="250">
          <template slot-scope="scope">
            <el-button
              width="200"
              @click="entering(scope.row)">录入代付额度</el-button>
            <el-button
              type="danger"
              @click="forbidden(scope.row)">{{ scope.row.status == "1"?"禁用":"启用"}}</el-button>
          </template>
        </el-table-column>
      </el-table>
       <!-- 分页 -->
        <el-pagination
          layout="prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-size="10"
          :page-count="totalPage"
          style="position:fixed;bottom:10px;">
        </el-pagination>
    </div>

    <!-- 添加商户弹窗 -->
    <div>
      <el-dialog :title="title" :visible.sync="dialogTableVisible" >
        <el-form :label-position="labelPosition" label-width="80px"  :model="regist">
          <el-form-item label="电话">
              <el-input v-model="regist.phone"></el-input>
          </el-form-item>
          <el-form-item label="默认密码">
              <el-input v-model="regist.pwd" type="password"></el-input>
          </el-form-item>
          <el-form-item label="商户名称">
              <el-input v-model="regist.name" type="text"></el-input>
          </el-form-item>
        </el-form>

        <div class="btn-sub">
          <el-button type="primary" size="mini" @click="upAddSh">确定</el-button>
          <el-button size="mini" @click="openAlert(1,'取消成功')">取消</el-button>
        </div>
      </el-dialog>
    </div>

    <!-- 录入代付额度弹窗 -->
    <div>
      <el-dialog :title="title2" :visible.sync="dialogTableVisible2" >
        <el-form :label-position="labelPosition" label-width="80px" :model="inputAmount">
            <el-form-item label="金额">
                <el-input v-model="inputAmount.amount"></el-input>
            </el-form-item>

            <el-form-item label="特殊资源">
              <el-radio-group v-model="inputAmount.type" :change="radioChg(inputAmount.type)">
                <el-radio label="1">增加金额</el-radio>
                <el-radio label="2">减少金额</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="默认密码">
                <el-input v-model="inputAmount.pwd" type="password"></el-input>
            </el-form-item>
        </el-form>

        <div class="btn-sub">
          <el-button type="primary" size="mini" @click="enteringData">确定</el-button>
          <el-button size="mini" @click="openAlert(1,'取消成功')">取消</el-button>
        </div>
      </el-dialog>
    </div>
    
  </div>
  
</template>

<script>
import Vue from 'vue';
import bus from './bus.js';
import {formatDate} from './formatDate.js';

export default {
  name: 'shanghuliebiao',
  data () {
    return {
      totalPage:1, // 分页
      tableData: [], // table数据
      dialogTableVisible: false,
      dialogTableVisible2:false,
      title:"添加商户",
      title2:"录入代付额度",
      condition:{// 过滤参数
        page:1,
        limit:10,
        phone:'',
        name:'',
      },
      regist:{ // 添加商户的弹窗参数
        phone:"",
        pwd:"",
        name:""
      },
      inputAmount:{ // 录入代付额度弹窗参数
        userid:"",
        amount:"",
        type:"",
        pwd:"",
      },
      labelPosition: 'right', // 弹窗的lable
    }
  },
  created:function(){
    // 默认获取数据
    this.getData();
  },
  methods:{
    // 请求数据
    getData(){
      let that = this;
      let url = "https://dfadminapi.dimuen.com/user/list";
      let formData = new FormData();
      formData.append("page",that.condition.page)
      formData.append("limit","10")
      if(that.condition.phone){
        formData.append("phone",that.condition.phone)
      }if(that.condition.name){
        formData.append("phone",that.condition.name)
      }
      that.$http.post(url,formData,{
        headers:{'Content-Type':'multipart/form-data'}
      })
      .then(function(response){
        if(response.body.result == "1"){
          //成功的
          // that.openAlert(1,response.body.msg);
          that.tableData = response.body.obj;
          that.totalPage = response.body.totalPage;
        }
        else{
          that.openAlert(2,response.body.msg)
        }
      },function(err){})
    },
    // 分页
    handleSizeChange(e){
      console.log(e,299)
    },
    // 分页
    handleCurrentChange(e){
      this.condition.page = e;
      this.getData()
    },
    // 添加商户的弹窗启动
    addSh(){
      this.dialogTableVisible = true;
    },
    // 添加商户弹窗数据提交
    upAddSh(){
      let that = this;
      let url = "https://dfadminapi.dimuen.com/user/add";
      if(that.regist.phone && that.regist.pwd && that.regist.name){
        let formData = new FormData();
        formData.append("phone",that.regist.phone)
        formData.append("name",that.regist.name)
        formData.append("pwd",that.regist.pwd)
        that.$http.post(url,formData,{
          headers:{'Content-Type':'multipart/form-data'}
        })
        .then(function(response){
          if(response.body.result != 1)
            that.openAlert(2,response.body.msg)
          else{//成功的
            that.openAlert(1,response.body.msg);
            that.getData();
          }
        },function(err){})
      }else{
        that.openAlert(2,"请将商户信息填写完整！")
      }
    },
    // 录入代付额度的弹窗启动
    entering(e){
      this.dialogTableVisible2 = true;
      this.inputAmount.userid = e.userid;
    },
    // 改变单选框的事件
    radioChg(e){
      this.inputAmount.type = e;
    },
    // 录入代付额度弹窗数据提交
    enteringData(){
      let that = this;
      let url = "https://dfadminapi.dimuen.com/user/inputAmount";
      if(that.inputAmount.amount && that.inputAmount.pwd && that.inputAmount.type && that.inputAmount.userid){
        let formData = new FormData();
        formData.append("amount",that.inputAmount.amount)
        formData.append("type",that.inputAmount.type)
        formData.append("pwd",that.inputAmount.pwd)
        formData.append("userid",that.inputAmount.userid)
        that.$http.post(url,formData,{
          headers:{'Content-Type':'multipart/form-data'}
        })
        .then(function(response){
          if(response.body.result != 1)
            that.openAlert(2,response.body.msg)
          else{//成功的
            that.openAlert(1,response.body.msg);
            that.getData();
          }
        },function(err){})
      }else{
        that.openAlert(2,"请将录入信息填写完整！")
      }
    },
    // 禁用按钮
    forbidden(e){
      let that = this;
      that.$confirm('此操作将改变用户状态, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let url = "https://dfadminapi.dimuen.com/user/enable";
        let formData = new FormData();
        formData.append("userid",e.userid)
        that.$http.post(url,formData,{
          headers:{'Content-Type':'multipart/form-data'}
        })
        .then(function(response){
          if(response.body.result != 1)
            that.openAlert(2,response.body.msg)
          else{//成功的
            that.$message({
              type: 'success',
              message: '删除成功!'
            });
            that.openAlert(1,response.body.msg);
            that.getData();
          }
        },function(err){})
      }).catch(() => {
        that.$message({
          type: 'info',
          message: '已取消'
        });          
      });
    },
    // 提示信息调用
    openAlert(i,msg) {
      let that = this;
      // 成功了才能关闭弹窗(无弹窗不影响)
      if(i == "2" && msg){
        that.$message.error(msg);
      }else{
        that.$message({
          type: 'success',
          message:msg
        });
        that.regist.phone = '';
        that.regist.pwd = '';
        that.regist.name = '';
        that.inputAmount.userid = '';
        that.inputAmount.amount = '';
        that.inputAmount.type = '';
        that.inputAmount.pwd = '';
        that.dialogTableVisible = false;
        that.dialogTableVisible2 = false;
      }
    }
  },
  filters:{
    formatDate (time) {
      let date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  }
}
</script>

<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.cont-header{
  display: inline-block;
  margin-right:15px;
  width: 233px;
}
.cont-header>.el-input{
  width: 150px;
}
.cont-cont{
  margin-top: 20px;
}
.btn-sub{
  padding-top: 20px;
  padding-left: 80px;
}
.addSh{
  float: right;
  width: 100px;
}
</style>