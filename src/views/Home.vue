<template>
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header>
      <div>
        <img src="../assets/logo.png" alt="" />
        <span>后台管理系统</span>
      </div>
      <el-button type="info" @click="exit">退出</el-button>
    </el-header>
    <!-- 主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px' ">
          <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区 -->
        <el-menu
          :unique-opened="true"  
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff">
          <!-- 一级菜单 -->
             <!-- index只接收字符串 ＋空字符串  数值+空字符串=字符串 -->
          <el-submenu :index="item.id + '' " v-for="item in menulist" :key="item.id"> 
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/' + subItem.path " v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/' + subItem.path)">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容 -->
      <el-main>
          <!-- 路由占位符 -->
          <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
      return {
          //左侧菜单数据
          menulist:[
            {
              "id" : 1,
              "authName" : "用户管理",
              "path" : null,
              "children":[
                { 
                  "id" : 101,
                  "authName" : "用户列表",
                  "path" : "users",
                  "children":[]
                }
              ]
            },
            {
              "id" : 2,
              "authName" : "商品管理",
              "path" : null,
              "children":[
                { 
                  "id" : 201,
                  "authName" : "商品列表",
                  "path" : "params",
                  "children":[]
                }
              ]
            },
            {
              "id" : 3,
              "authName" : "订单管理",
              "path" : null,
              "children":[
                { 
                  "id" : 301,
                  "authName" : "订单列表",
                  "path" : null,
                  "children":[]
                }
              ]
            },
            {
              "id" : 4,
              "authName" : "设置",
              "path" : null,
              "children":[
                { 
                  "id" : 401,
                  "authName" : "个人设置",
                  "path" : null,
                  "children":[]
                }
              ]
            },
          ],
          iconsObj:{
              '1':'el-icon-s-custom',
              '2':'el-icon-s-goods',
              '3':'el-icon-s-order',
              '4':'el-icon-s-tools',
          },
          //是否折叠
          isCollapse:false,
          //被激活的链接地址
          activePath:''
      }
  },
  created() {
    // this.getMenuList();
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    exit() {
      //清空token返回登陆页面
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    // async getMenuList() {
    //   const { data: res } = await this.$http.get("menus");
    //   if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
    //   this.menulist = res.data
    //   console.log(res);
    // },
    //点击按钮，切换菜单的折叠与展开
    toggleCollapse(){
        this.isCollapse = ! this.isCollapse
    },
    //保存链接的激活状态
    saveNavState(activePath){
      window.sessionStorage.setItem('activePath',activePath)
      this.activePath = activePath
    }
  },
};
</script>

<style lang="scss" scoped>
.home-container {
  height: 100%;
  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 0;
    color: #fff;
    font-size: 20px;
    > div {
      display: flex;
      align-items: center;
      span {
        margin-left: 15px;
      }
      img {
        width: 40px;
        height: 40px;
      }
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu{
      border-right: 0;
  }
}
.el-main {
  background-color: #eaedf1;
}
.el-icon{
    margin-right: 8px;
}
.toggle-button{
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;//字符间的距离
    cursor: pointer;
}
</style>
