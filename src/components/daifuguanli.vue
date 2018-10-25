<template>
  <div style="padding:10px">
    <!-- 头部筛选条件 -->
    <div>
      <!-- 第一行的筛选 -->
      <div>
        <div class="cont-header">
          <el-input
            placeholder="请输入商户名称"
            v-model="condition.name"
            clearable>
          </el-input>
          <el-button round  type="primary" @click="getData()">搜索</el-button>
        </div>

        <div class="cont-header">
          <el-input
            placeholder="请输入银行账户"
            v-model="condition.account"
            clearable>
          </el-input>
          <el-button round type="primary" @click="getData()">搜索</el-button>
        </div>

        <div class="cont-header">
          <el-input
            placeholder="请输入开户名"
            v-model="condition.username"
            clearable>
          </el-input>
          <el-button round type="primary" @click="getData()">搜索</el-button>
        </div>

        <div class="cont-header cont-uninput">
          <div class="block">
            <el-cascader
              :options="options"
              v-model="condition.status"
              @change="handleChange">
            </el-cascader>
          </div>
        </div>

        <div class="cont-header cont-uninput">
          <div class="block">
            <el-date-picker
              v-model="condition.start"
              type="date"
              placeholder="开始日期"
              @change="searchStaDate">
            </el-date-picker>
          </div>
        </div>

        <div class="cont-header cont-uninput">
          <div class="block">
            <el-date-picker
              v-model="condition.end"
              type="date"
              placeholder="结束日期"
              @change="searchEndDate">
            </el-date-picker>
          </div>
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
        <el-table-column label="订单号" width="170">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.orderno }}</span>
          </template>
        </el-table-column>
        <el-table-column label="商户名称" width="120">
          <template slot-scope="scope" style="text-align=:center">
            <span style="margin-left: 10px">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="银行账户" width="180">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.account }}</span>
          </template>
        </el-table-column>
        <el-table-column label="银行名称" width="120">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.bankname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="开户名" width="90">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.username }}</span>
          </template>
        </el-table-column>
        <el-table-column label="金额" width="120">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.amount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="90">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.status == 1 ?"成功":"审核中" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="提交时间" width="150">
          <template slot-scope="scope" style="text-align=:center">
            <span style="margin-left: 10px">{{ scope.row.createtime| formatDate  }}</span>
          </template>
        </el-table-column>
        <el-table-column label="打款时间" width="150">
          <template slot-scope="scope" style="text-align=:center">
            <span style="margin-left: 10px">{{ scope.row.paytime| formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" width="200">
          <template slot-scope="scope" style="text-align=:center">
            <span style="margin-left: 10px">{{ scope.row.remark  }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="120">
          <template slot-scope="scope">
            <el-button
              width="200"
              v-show="scope.row.status != 1"
              @click="makeMoney(scope.row)">确认打款</el-button>
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

    <!-- 录入代付额度弹窗 -->
    <div>
      <el-dialog :title="title" :visible.sync="dialogTableVisible" >
        <el-form :label-position="labelPosition" label-width="80px"  :model="pay">
            <el-form-item label="订单号" style="display:none">
                <el-input v-model="pay.orderno"></el-input>
            </el-form-item>
            <el-form-item label="密码">
                <el-input v-model="pay.pwd" type="password"></el-input>
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
  name: 'daifuguanli',
  data () {
    return {
      totalPage:1, // 分页
      tableData: [], // table数据
      dialogTableVisible: false,
      title:"确认打款",
      condition:{// 过滤参数
        page:1,
        limit:10,
        account:'',
        name:'',
        username:'',
        status:'',
        start:'',
        end:'',
      },
      pay:{ // 打款弹窗参数
        orderno:"",
        pwd:"",
      },
      options:[{//下拉框参数
        value:'',
        label:"请选择"
      },{
        value:0,
        label:"审核中"
      },{
        value:1,
        label:"成功"
      }],
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
      let url = "https://dfadminapi.dimuen.com/order/list";
      let formData = new FormData();
      formData.append("page",that.condition.page)
      formData.append("limit","10")
      if(that.condition.account){
        formData.append("account",that.condition.account)
      }if(that.condition.name){
        formData.append("phone",that.condition.name)
      }if(that.condition.status == "0"||
      that.condition.status == "1"){
        formData.append("status",that.condition.status)
      }if(that.condition.start){
        formData.append("start",that.condition.start)
      }if(that.condition.end){
        formData.append("end",that.condition.end)
      }if(that.condition.username){
        formData.append("username",that.condition.username)
      }
      that.$http.post(url,formData,{
        headers:{'Content-Type':'multipart/form-data'}
      })
      .then(function(response){
        if(response.body.result == "1"){
          //成功的
          that.openAlert(1,response.body.msg);
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
    // 确认打款的弹窗启动
    makeMoney(e){
      this.dialogTableVisible = true;
      this.pay.orderno = e.orderno;
    },
    // 确认打款数据提交
    enteringData(){
      let that = this;
      let url = "https://dfadminapi.dimuen.com/order/pay";
      if(that.pay.orderno && that.pay.pwd ){
        let data = "orderno="+that.pay.orderno+
          "&pwd="+that.pay.pwd;
        that.$http.get(url+"?"+data,{
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
            that.dialogTableVisible = false;
            that.pay.orderno = '';
            that.pay.pwd = '';
            that.dialogTableVisible = false;
        }
    },
    // 下拉框筛选
    handleChange(e){
      let that = this;
      that.condition.status = e;
      that.getData();
    },
    // 搜索日期
    searchStaDate(e){
      this.condition.start = new Date(e).getTime();
      this.getData();
    },
    // 搜索日期
    searchEndDate(e){
      this.condition.end = new Date(e).getTime();
      this.getData();
    },
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
.cont-uninput,
.cont-uninput>.block>.el-date-editor{
  width: 140px;
}
</style>