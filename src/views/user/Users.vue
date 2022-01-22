<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 搜索与添加区域 -->
            <el-row :gutter="30">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
                        <el-button slot="append" icon="el-icon-search"  @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="2">
                    <el-button type="primary" @click="addDialogVisible=true">添加</el-button>
                </el-col>
            </el-row>
             <!-- 用户列表区域 -->
            <el-table :data="userlist" style="width:100%" border stripe>
                <el-table-column type="index"></el-table-column> 
                <el-table-column label="姓名" prop="username" ></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="电话" prop="phone" ></el-table-column>
                <el-table-column label="角色">
                    <template slot-scope="scope">
                        {{scope.row.isAdmin?"管理员":"用户"}}
                    </template>
                </el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.mg_state" @change="stateChange(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180px">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
                        <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页区域 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[5, 10, 15, 20]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>

        <!-- 添加用户对话框 -->
        <el-dialog
            title="添加用户"
            :visible.sync="addDialogVisible"
            width="50%"
            @close="addDialogClosed" >
            <!-- 对话框内容主体区 -->
            <el-form :model="ruleForm" :rules="ruleFormRules" ref="ruleFormRef" label-width="100px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="ruleForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="ruleForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="ruleForm.email"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="mobile">
                    <el-input v-model="ruleForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部区 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 修改用户对话框 -->
        <el-dialog
            title="修改用户"
            :visible.sync="editDialogVisible"
            width="50%"
            @close="editDialogClosed">
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
                <el-form-item label="用户名">
                    <el-input v-model="editForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="mobile">
                    <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUserInfo">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 分配角色对话框 -->
        <el-dialog
            title="分配角色"
            :visible.sync="setRoleDialogVisible"
            width="50%"
            @close="setRoleDialogClosed">
            <div>
                <p>当前的用户：{{userInfo.username}}</p>
                <p>当前的角色：{{userInfo.role_name}}</p>
                <p>分配新角色：
                    <el-select v-model="selectedRoleId" placeholder="请选择">
                        <el-option
                        v-for="item in rolesList"
                        :key="item.id"
                        :label="item.roleName"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </p>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRoleDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
export default {
    data(){
        //校验邮箱规则
        var checkEmail = (rule,value,callback) =>{
            //验证邮箱的正则表达式
            const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
            if (regEmail.test(value)) {
                return callback()
            }
            callback(new Error('请输入正确的邮箱'))
        }
        //校验电话规则
        var checkMobile = (rule,value,callback) =>{
            const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
            if (regMobile.test(value)) {
                return callback()
            }
            callback(new Error('请输入正确的手机号'))
        }

        return{
            //获取用户列表的参数对象
            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:5
            },
            userlist:[],
            total:0,
            //控制添加用户对话框的显示与隐藏
            addDialogVisible:false,
            //添加用户的表单数据
            ruleForm:{
                username:'',
                password:'',
                email:'',
                phone:''
            },
            // 添加表单的验证规则对象
            ruleFormRules:{
                username:[{ required: true, message: '请输入用户名', trigger: 'blur' }],
                password:[{ required: true, message: '请输入密码', trigger: 'blur' }],
                email:[{ required: true, message: '请输入邮箱', trigger: 'blur' },{validator:checkEmail}],
                phone:[{ required: true, message: '请输入电话号码', trigger: 'blur' },{validator:checkMobile}]
            },
            //控制编辑用户对话框的显示与隐藏
            editDialogVisible:false,
            //查询到的用户信息对象
            editForm:{},
            //修改表单的验证规则对象
            editFormRules:{
                email:[{required:true,message: '请输入邮箱', trigger: 'blur' },{validator:checkEmail,trigger:'blur'}],
                mobile:[{ required: true, message: '请输入电话号码', trigger: 'blur' },{validator:checkMobile,trigger:'blur'}]
            },
            //控制分配角色对话框的显示与隐藏
            setRoleDialogVisible : false,
            //点击的角色信息
            userInfo:[],
            //获取所有角色列表
            rolesList:[],
            //已选中的角色id值
            selectedRoleId:''
        }
    },
    //生命周期函数
    created(){
        this.getUserList()
    },
    methods:{
        async getUserList(){
            const { data:res }=await this.$http.get('user/list',{params:this.queryInfo})
            if (res.status !== 200) {
                return this.$message.error("获取失败");
            }
            this.userlist = res.result
            this.total = res.result.length
            // console.log(res);
        },
        //监听 pagesize改变的事件
        handleSizeChange(newSize){
            // console.log(newSize);
            this.queryInfo.pagesize = newSize
            this.getUserList()
        },
        //监听 页码值 改变的事件
        handleCurrentChange(newPage){
            // console.log(newPage);
            this.queryInfo.pagenum = newPage
            this.getUserList()
        },
        //监听switch开关状态的改变
        async stateChange(userinfo){
            const {data:res} = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
            if (res.meta.status !== 200 )  {
                userinfo.mg_state = !userinfo.mg_state
                return this.$message.error('更新用户状态失败')
            }
            this.$message.success('更新用户状态成功')
        },
        //监听添加用户对话框的关闭事件
        addDialogClosed(){
            this.$refs.ruleFormRef.resetFields()
        },
        //点击按钮，添加新用户
        addUser(){
            this.$refs.ruleFormRef.validate(async valid=>{
                if (!valid) return
                //通过则可以发起添加用户请求
                const {data:res} = await this.$http.post('users',this.ruleForm)
                if (res.meta.status !== 201 )  {
                    return this.$message.error('添加用户失败')
                }
                this.$message.success('添加用户成功')
                //隐藏添加用户的对话框
                this.addDialogVisible = false
                //重新获取用户列表数据
                this.getUserList()
            })
        },
        //展示编辑用户的对话框
        async showEditDialog(id){
            //解构赋值
            const {data:res} = await this.$http.get("users/" + id)
            if (res.meta.status !== 200) {
                return this.$message.error("查询用户列表失败");
            }
            this.editForm = res.data
            this.editDialogVisible=true
        },
        //监听修改用户对话框的关闭事件
        editDialogClosed(){
            this.$refs.editFormRef.resetFields()
        },
        //修改用户信息并提交
        editUserInfo(){
            this.$refs.editFormRef.validate(async valid=>{
                //不通过校验
                if(!valid) return
                //通过 发起修改用户信息的数据请求
                const {data:res} =await this.$http.put('users/', + this.editForm.id,{email:this.editForm.email,mobile:this.editForm.mobile})
                console.log("@@@",res);
                if (res.meta.status !== 200 )  {
                    return this.$message.error('修改用户信息失败')
                }
                //隐藏修改用户信息的对话框
                this.editDialogVisible = false
                //重新获取用户列表数据
                this.getUserList()
                this.$message.success('修改用户信息成功')
            })
        },
        //根据id删除对应的用户
        async removeUserById(id){
          const confirmResult =await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).catch(err=>err)
            
            //如果用户确认删除，返回字符串confirm
            //如果用户取消删除，返回字符串cancel
            if(confirmResult !== 'confirm') {
                return this.$message.info('已取消删除')
            }
            const {data:res} = await this.$http.delete('users/' + id)
            if (res.meta.status!=200) {
                return this.$message.error('删除用户失败')
            }
            this.$message.success('删除用户成功')
            this.getUserList()
        },
        // 展示分配角色的对话框
        async setRole(userInfo){
            this.userInfo = userInfo
            //在展示对话框之前，获取所有角色的列表
            const {data:res} = await this.$http.get('roles')
            if (res.meta.status != 200) {
                return this.$message.error('获取角色列表失败')
            }
            this.rolesList = res.data
            this.setRoleDialogVisible = true
        },
        //点击确定，分配角色
        async saveRoleInfo(){
            if (!this.selectedRoleId) {
                return this.$message.error("请选择要分配的角色")
            }
            const {data:res} = await this.$http.put(`users/${this.userInfo.id}/role`,{rid:this.selectedRoleId})
            if (res.meta.status != 200 ) {
                return this.$message.error('更新角色失败')
            }
            this.$message.success('更新角色成功')
            this.getUserList()
            this.setRoleDialogVisible = false
        },
        //监听分配角色对话框的关闭事件
        setRoleDialogClosed(){
            this.selectedRoleId = ''
            this.userInfo = {}
        }
    }
}
</script>

<style scoped>

</style>