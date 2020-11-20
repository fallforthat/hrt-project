<template>
	<section>
		<!--Toolbar-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="Search"></el-input>
				</el-form-item>
				<!-- <el-form-item>
					<el-button type="primary" v-on:click="getUsers" icon="search">Search</el-button>
				</el-form-item> -->
				
				<el-form-item>
					<el-button type="primary" @click="handleAddAccount" icon="add">Add New Account</el-button>
				</el-form-item>
			</el-form>
		</el-col>

	
		<!-- List call api -->
		<el-table :data="apiAccounts.filter(data => !filters.name || data.email.toLowerCase().includes(filters.name.toLowerCase()))" highlight-current-row v-loading="listLoading"  style="width: 100%;">
			<!-- <el-table-column type="selection" width="55">
			</el-table-column> -->
			
			<el-table-column prop="id" label="Id" width="350">
			</el-table-column>
			<el-table-column prop="fullName" label="Full Name" width="220" sortable :formatter="formatFullName">
			</el-table-column>
			<el-table-column prop="email" label="Email" width="300" sortable>
			</el-table-column>
			<!-- <el-table-column prop="address" label="Address" width="260" sortable :formatter="formatAddress">
			</el-table-column> -->
			<el-table-column prop="phoneNumber" label="Phone Number" min-width="180" sortable>
			</el-table-column>
			<el-table-column  label="Status" min-width="180" sortable>
				<!-- <el-switch label="" v-model="accountActive" disabled></el-switch> -->
				<template>
					<el-tag :type="accountActive === true ? 'success' : 'danger'">
						<span v-if="accountActive">Active</span>
					</el-tag>
				</template>
			</el-table-column>
			
			<!-- <el-table-column label="Option" width="150">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)" icon="edit">Edit</el-button>
					
				</template>
			</el-table-column> -->
			<el-table-column type="expand">
				
			</el-table-column>
		</el-table>

		<!--Bottom Toolbar-->
		<el-col :span="24" class="toolbar">
			<!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">Batch Remove</el-button> -->
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--Edit Detail-->
		<el-dialog title="Detail" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editAccount" label-width="80px" :rules="editFormRules" ref="editAccount">
				<el-form-item label="Id" prop="id">
					<el-input v-model="editAccount.id" auto-complete="off" disabled></el-input>
				</el-form-item>
				<el-form-item label="Email" prop="email" >
					<el-input v-model="editAccount.email" auto-complete="off" width="100"></el-input>
					
				</el-form-item>
				<el-form-item label="Password" prop="password">
					<el-input v-model="editAccount.password" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="Company Name" prop="companyName">
					<el-input v-model="editAccount.companyName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="First Name" prop="firstName">
					<el-input v-model="editAccount.firstName" auto-complete="off" ></el-input>
				</el-form-item>
				<el-form-item label="Last Name" prop="lastName">
					<el-input v-model="editAccount.lastName" auto-complete="off" ></el-input>
				</el-form-item>
				
				<el-form-item label="Address" prop="address">
					<el-input type="textarea" v-model="editAccount.address"></el-input>
				</el-form-item>
				<el-form-item label="Phone Number" prop="phone">
					<el-input v-model="editAccount.phone" auto-complete="off" ></el-input>
				</el-form-item>
			
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">Cancel</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">Save</el-button>
				
			</div>
		</el-dialog>

		

		<!-- Add New Account To Api -->
		<el-dialog title="Add New Account" v-model="addAccountVisible" :close-on-click-modal="false">
			<el-form :model="addAccount" label-width="80px" :rules="addFormRules" ref="addAccount">
				<el-form-item label="Email" prop="email">
					<el-input v-model="addAccount.email" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="Password" prop="password">
					<el-input v-model="addAccount.password" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="Company Name" prop="companyName">
					<el-input v-model="addAccount.companyName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="First Name" prop="firstName">
					<el-input v-model="addAccount.firstName" auto-complete="off" ></el-input>
				</el-form-item>
				<el-form-item label="Last Name" prop="lastName">
					<el-input v-model="addAccount.lastName" auto-complete="off" ></el-input>
				</el-form-item>
				
				<el-form-item label="Address" prop="address">
					<el-input type="textarea" v-model="addAccount.address"></el-input>
				</el-form-item>
				<el-form-item label="Phone Number" prop="phone">
					<el-input v-model="addAccount.phone" auto-complete="off" ></el-input>
				</el-form-item>
			
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addAccountVisible = false">Cancel</el-button>
				<el-button type="primary" @click.native="addAccountToApi" :loading="addLoading">Add</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser, JSONHTTP, HTTP } from '../../api/api';

	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				users: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//List selected column

				editFormVisible: false,//Whether the editing interface is displayed
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: 'Please enter your name!', trigger: 'blur' }
					]
				},
				

				addFormVisible: false,//Whether the new interface is displayed
				addAccountVisible: false, 
				addLoading: false,
				addFormRules: {
					email: [
						{ required: true, message: 'Please enter your email!', trigger: 'blur' }
					],
					password: [
						{ required: true, message: 'Please enter your password!', trigger: 'blur' }
					],
					companyName: [
						{ required: true, message: 'Please enter your company name!', trigger: 'blur' }
					],
					firstName: [
						{ required: true, message: 'Please enter your first name!', trigger: 'blur' }
					],
					lastName: [
						{ required: true, message: 'Please enter your last name!', trigger: 'blur' }
					],
					address: [
						{ required: true, message: 'Please enter your address!', trigger: 'blur' }
					],
					password: [
						{ required: true, message: 'Please enter your password!', trigger: 'blur' }
					],
					phone: [
						{ required: true, message: 'Please enter your phone number!', trigger: 'blur' }
					]
				},
				

				//New Add Account Form
				addAccount: {
					email: '',
					password: '',
					companyName: '',
					firstName: '',
					lastName: '',
					address: '',
					phone: '',
					isBuyer: true
				},
				//Edit Account Form
				editAccount: {
					id: 0,
					fullName: '',
					phoneNumber: '',
					companyName: '',
					firstName: '',
					lastName: '',
					address: '',
					phone: '',
					isBuyer: true
				},

				//data get from api
				apiAccounts: [],
				accountActive: true

			}
		},
		methods: {
			//get users from api
			getAccountApi: function() {
				
				let para = {
					pageNo: this.page
				};

				HTTP.get(`Account/GetAllPaging?pageIndex=` + --para.pageNo + `&pageSize=10`).then(response => {
					this.apiAccounts = response.data;
					console.log(this.apiAccounts);
				})
				.catch(e => {
					console.log(e.response.data);
				})
			},

			//Handle add new account to api
			handleAddAccount: function () {
				this.addAccountVisible = true;
				this.addAccount = {
					email: '',
					password: '',
					companyName: '',
					firstName: '',
					lastName: '',
					address: '',
					phone: '',
					isBuyer: true
				};
			},

			//format display full name
			formatFullName: function (row, column) {
				return row.fullName === null ? 'Unknown' :  row.fullName;
			},
			
			
		
			//Add
			addAccountToApi: function () {
				this.$refs.addAccount.validate((valid) => {
					if (valid) {
						this.$confirm('Confirm to add?', 'Alert', {}).then(() => {
							this.addLoading = true;
							
							HTTP.post(`Account`, { 
								email: this.addAccount.email,
								password: this.addAccount.password,
								companyName: this.addAccount.companyName,
								firstName: this.addAccount.firstName,
								lastName: this.addAccount.lastName,
								address: this.addAccount.address,
								phone: this.addAccount.phone,
								isBuyer: true
							 }).then(response => {
								
								
								
								this.$message({
									message: `Add Account successfully~`,
									type: `success`
								});
								console.log(response.status);
								this.addLoading = false;
								this.$refs['addAccount'].resetFields();
								this.addAccountVisible = false;
								this.getAccountApi();
							}).catch(e => {
								this.$message({
										message: `Cannot add new account~`,
										type: `error`
									});
								console.log(e);
								this.addLoading = false;
								this.addFormVisible = false;
								// console.log(e.response.data);
								// console.log(e.response.data.title);
							});
							
						});
					}
				});
			},


			//Gender display conversion
			// formatSex: function (row, column) {
			// 	return row.sex == 1 ? 'Male' : row.sex == 0 ? 'Female' : 'Unknow';
			// },
			handleCurrentChange(val) {
				this.page = val;
				this.getAccountApi();
			},
			//Get user list
			getUsers() {
				let para = {
					page: this.page,
					name: this.filters.name
				};
				this.listLoading = true;
				//NProgress.start();
				getUserListPage(para).then((res) => {
					this.total = res.data.total;
					this.users = res.data.users;
					this.listLoading = false;
					//NProgress.done();
				});
			},
		
			//Show editing interface
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editAccount = Object.assign({}, row);
			},
			//Show new interface
			handleAdd: function () {
				this.addFormVisible = true;
				this.addAccount = {
					email: '',
					password: '',
					companyName: '',
					firstName: '',
					lastName: '',
					address: '',
					phone: '',
					isBuyer: true
				};
			},
			//edit
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('Confirm to submit?', 'Alert', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.editForm);
							para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							editUser(para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: 'Edited Successfully!',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getUsers();
							});
						});
					}
				});
			},
			//Add
			// addSubmit: function () {
			// 	this.$refs.addForm.validate((valid) => {
			// 		if (valid) {
			// 			this.$confirm('Confirm to submit?', 'Alert', {}).then(() => {
			// 				this.addLoading = true;
			// 				//NProgress.start();
			// 				let para = Object.assign({}, this.addForm);
			// 				para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
			// 				addUser(para).then((res) => {
			// 					this.addLoading = false;
			// 					//NProgress.done();
			// 					this.$message({
			// 						message: 'Submitted successfully',
			// 						type: 'success'
			// 					});
			// 					this.$refs['addForm'].resetFields();
			// 					this.addFormVisible = false;
			// 					this.getUsers();
			// 				});
			// 			});
			// 		}
			// 	});
			// },
			// selsChange: function (sels) {
			// 	this.sels = sels;
			// },
			//batch deletion
			
		},
		mounted() {
			this.getAccountApi();
			this.getUsers();
		}
	}

</script>

<style scoped>

</style>