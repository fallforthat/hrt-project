<template>
	<section>
		<!--Toolbar-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="Name"></el-input>
				</el-form-item>
				<!-- <el-form-item>
					<el-button type="primary" v-on:click="getUsers">Search</el-button>
				</el-form-item> -->
				<el-form-item>
					<el-button type="primary" @click="handleAdd">Add Project</el-button>
				</el-form-item>
				<!-- <el-form-item>
					<el-button type="primary" @click="handleAddAccount">Add New Account</el-button>
				</el-form-item> -->
			</el-form>
		</el-col>

		
		<!-- List call api -->
		<el-table :data="apiProjects" highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column type="index" width="100">

			</el-table-column>
			<el-table-column prop="projectStatusId" label="Id" width="400">
			</el-table-column>
			<el-table-column prop="name" label="Project Name" width="320" sortable>
			</el-table-column>
			<el-table-column prop="startDate" label="Start Date" width="200" sortable :formatter="formatStartDate">
			</el-table-column>
			<el-table-column prop="endDate" label="End Date" width="200" sortable :formatter="formatEndDate">
			</el-table-column>
			<!-- <el-table-column prop="contractId" label="Contract ID" min-width="300" sortable>
			</el-table-column> -->
			<el-table-column prop="isDeleted" label="Status" width="250" sortable  >
				<template slot-scope="scope">
					<el-tag :type="scope.row.isDeleted === false ? 'success' : 'danger'" >
						
						<span v-if="scope.row.isDeleted">Inactive</span>
						<span v-else>Active</span>
					</el-tag>
				</template>
				
			</el-table-column>
			<el-table-column label="Option" width="150">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">Delete</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--Bottom Toolbar-->
		<el-col :span="24" class="toolbar">
			
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--Edit Detail-->
		<el-dialog title="Edit Detail" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="Name" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="Gender">
					<el-radio-group v-model="editForm.sex">
						<el-radio class="radio" :label="1">Male</el-radio>
						<el-radio class="radio" :label="0">Female</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="Age">
					<el-input-number v-model="editForm.age" :min="0" :max="200"></el-input-number>
				</el-form-item>
				<el-form-item label="Date of Birth">
					<el-date-picker type="date" placeholder="Select date" v-model="editForm.birth"></el-date-picker>
				</el-form-item>
				<el-form-item label="Address">
					<el-input type="textarea" v-model="editForm.addr"></el-input>
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
				<el-form-item label="Email" prop="mail">
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
				<!-- <el-form-item label="Gender">
					<el-radio-group v-model="addAccount.sex">
						<el-radio class="radio" :label="1">Male</el-radio>
						<el-radio class="radio" :label="0">Female</el-radio>
					</el-radio-group>
				</el-form-item> -->
				<!-- <el-form-item label="Age">
					<el-input-number v-model="addAccount.age" :min="0" :max="200"></el-input-number>
				</el-form-item> -->
				<!-- <el-form-item label="Date of Birth">
					<el-date-picker type="date" placeholder="Select Date" v-model="addAccount.birth"></el-date-picker>
				</el-form-item> -->
				<el-form-item label="Address">
					<el-input type="textarea" v-model="addAccount.address"></el-input>
				</el-form-item>
				<el-form-item label="Phone Number" prop="phone">
					<el-input v-model="addAccount.phone" auto-complete="off" ></el-input>
				</el-form-item>
				<!-- <el-form-item label="Is Buyer:" prop="isBuyer">
					<el-input v-model="addAccount.isBuyer" auto-complete="off" disabled></el-input>
				</el-form-item> -->
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
				//Edit interface data
				editForm: {
					id: 0,
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
				},

				addFormVisible: false,//Whether the new interface is displayed
				addAccountVisible: false, 
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: 'Please enter your name!', trigger: 'blur' }
					]
				},
				//New interface data
				addForm: {
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
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

				//data get from api
				apiProjects: []

			}
		},
		methods: {
			//get users from api
			getProjectApi: function() {
				
				let para = {
					pageNo: this.page
				};

				HTTP.get(`Project/GetAllPaging?pageIndex=` + para.pageNo + `&pageSize=10`).then(response => {
					this.apiProjects = response.data;
					console.log(this.apiProjects);
				})
				.catch(e => {
					console.log(e);
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

			//format start date
			formatStartDate: function(row, column) {
				let str = row.startDate.split('T');
				return str[0];
				
			},
			
			//format start date
			formatEndDate: function(row, column) {
				let str = row.endDate.split('T');
				return str[0];
				
			},

			//Add
			addAccountToApi: function () {
				//this.$refs.addAccount.validate((valid) => {
					//if (valid) {
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
								console.log(response.status);
								if(this.response.status === 201) {
									this.addLoading = false;
									this.$message({
										message: `Add Account successfully~`,
										type: `success`
									});
								}
							}).catch(e => {
								this.$message({
										message: `Cannot add new account~`,
										type: `error`
									});
								console.log(e.response.data);
								console.log(e.response.data.title);
							});
							this.addLoading = false;
							this.$refs[`addAccount`].resetFields();
							this.addAccountVisible = false;
						});
					//}
				//});
			},


			//Gender display conversion
			// formatSex: function (row, column) {
			// 	return row.sex == 1 ? 'Male' : row.sex == 0 ? 'Female' : 'Unknow';
			// },
			handleCurrentChange(val) {
				this.page = val;
				this.getUsers();
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
			//delete
			handleDel: function (index, row) {
				this.$confirm('Are you sure to delete this record?', 'Alert', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { id: row.id };
					removeUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: 'Deleted Successfully!',
							type: 'success'
						});
						this.getUsers();
					});
				}).catch(() => {

				});
			},
			//Show editing interface
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//Show new interface
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
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
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('Confirm to submit?', 'Alert', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.addForm);
							para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							addUser(para).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: 'Submitted successfully',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getUsers();
							});
						});
					}
				});
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			//batch deletion
			batchRemove: function () {
				var ids = this.sels.map(item => item.id).toString();
				this.$confirm('Are you sure to delete the selected record?', 'Alert', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { ids: ids };
					batchRemoveUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: 'Deleted Successfully!',
							type: 'success'
						});
						this.getUsers();
					});
				}).catch(() => {

				});
			}
		},
		mounted() {
			this.getProjectApi();
			this.getUsers();
		}
	}

</script>

<style scoped>

</style>