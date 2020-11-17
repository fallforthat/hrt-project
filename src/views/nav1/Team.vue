<template>
	<section>
		<!--Toolbar-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="Name"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="searchTeamApi" icon="search">Search</el-button>
				</el-form-item>
			
				<el-form-item>
					<el-button type="primary" @click="handleAddTeam" >Add New Team</el-button>
				</el-form-item>
				
			</el-form>
		</el-col>

		<!-- List call api -->
		<el-table :data="apiUsers" highlight-current-row v-loading="listLoading" style="width: 100%;">
			
			<el-table-column prop="id" label="Id" width="350">
			</el-table-column>
			<el-table-column prop="name" label="Name" width="220" sortable>
			</el-table-column>
			<el-table-column prop="salarySuggest" label="Salary Suggest" width="250" sortable>
			</el-table-column>
			<el-table-column prop="totalMember" label="Total Members" width="200" sortable>
			</el-table-column>
			<el-table-column prop="totalRating" label="Total Rating" min-width="200" sortable>
			</el-table-column>
			<!-- <el-table-column prop="active" label="Active" min-width="200" sortable>
				<el-switch v-model="active" disabled></el-switch>
			</el-table-column> -->
			<el-table-column label="Option" width="180">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)" icon="edit">Edit</el-button>
					<el-button type="danger"  size="small" @click="deleteTeamApi(scope.$index, scope.row)" icon="delete">Delete</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--Bottom Toolbar-->
		<el-col :span="24" class="toolbar">
			<span>Total Teams:</span>
			<el-input :placeholder="totalTeams" disabled style="width:50px" size="small"></el-input>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--Edit Detail-->
		<el-dialog title="Edit Detail" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="ID" prop="id">
					<el-input v-model="editForm.id" auto-complete="off" disabled></el-input>
				</el-form-item>
				
				<el-form-item label="Team Name" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="Salary Suggest" prop="salarySuggest">
					<el-input v-model="editForm.salarySuggest" auto-complete="off"></el-input>
				</el-form-item>
				
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">Cancel</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">Save</el-button>
				
			</div>
		</el-dialog>

		

		<!-- Add New Team To Api -->
		<el-dialog title="Add New Team" v-model="addTeamVisible" :close-on-click-modal="false">
			<el-form :model="addTeam" label-width="80px" :rules="addFormRules"  ref="addTeam">
				<el-form-item label="Leader Id" prop="leaderId" label-width="100px">
					<el-input v-model="addTeam.leaderId" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="Team Name" prop="name" label-width="100px">
					<el-input v-model="addTeam.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="Salary Suggest" prop="salarySuggest" label-width="100px">
					<el-input v-model="addTeam.salarySuggest" auto-complete="off"></el-input>
				</el-form-item>
				
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addTeamVisible = false">Cancel</el-button>
				<el-button type="primary" @click.native="addTeamToApi" :loading="addLoading">Add</el-button>
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
					],
					salarySuggest: [
						{ required: true, message: 'Please enter salary!', trigger: 'blur' }
					]
					
				},
				//Edit interface data
				editForm: {
					id: 0,
					name: '',
					salarySuggest: ''
				},

				addFormVisible: false,//Whether the new interface is displayed
				addTeamVisible: false, 
				addLoading: false,
				addFormRules: {
					leaderId: [
						{ required: true, message: 'Please enter leader id!', trigger: 'blur' }
					],
					name: [
						{ required: true, message: 'Please enter team name!', trigger: 'blur' }
					],
					salarySuggest: [
						{ required: true, message: 'Please enter salary!', trigger: 'blur'}
					]
				},

				//New Add Team Form
				addTeam: {
					leaderId: '',
					name: '',
					salarySuggest: ''
				},

				//data get from api
				apiUsers: [],
				errors: [],
				searchTeam: [],
				totalTeams: `0`,
				active: true

			}
		},
		methods: {
			//get users from api
			getUserApi: function() {
			
				let para = {
					pageNo: this.page
				};

				HTTP.get(`Team/GetAllPaging?pageIndex=` + para.pageNo + `&pageSize=10`).then(response => {
					this.apiUsers = response.data;
					console.log(this.apiUsers);
				})
				.catch(e => {
					console.log(e);
				})
			},

			//Handle add new account to api
			handleAddTeam: function () {
				this.addTeamVisible = true;
				this.addTeam = {
					name: '',
					salarySuggest: ''
				};
			},

	
			
			//Add
			addTeamToApi: function () {
				this.$refs.addTeam.validate((valid) => {
					if (valid) {
						this.$confirm('Confirm to add?', 'Alert', {}).then(() => {
							this.addLoading = true;
							HTTP.post(`Team`, {
								leaderId: this.addTeam.leaderId, 
								name: this.addTeam.name,
								salarySuggest: this.addTeam.salarySuggest
							 }).then(response => {
								console.log(response.status);
								console.log( typeof response.status);
							
								
								this.$message({
									message: `Add Team successfully~`,
									type: `success`
								});
								this.addLoading = false;
								this.$refs[`addTeam`].resetFields();
								this.addTeamVisible = false;
								this.getUserApi();
								this.countTeam();
							}).catch(e => {
								
								console.log(e.response);
								console.log(e.response.data.title);
								this.$message({
										message: `Cannot add new team~ ` + e.response.data.title,
										type: `error`
									});
								this.addLoading = false;
								this.addTeamVisible = false;
								// console.log(e.response.data);
								// console.log(e);
							});
							
						});
					}
				});
			},

			//Search Team
			searchTeamApi: function() {
				let para = {
					name: this.filters.name
				};
				HTTP.get(`Team?searchValue=` + para.name).then(response => {
					this.apiUsers = response.data;
				})
				.catch(e => {
					console.log(e);
				})
			},

			//Get total teams num
			countTeam: function() {
				HTTP.get(`Team/count`).then(response => {
					
					this.totalTeams = response.data.toString();
				})
				.catch(e => {
					console.log(e);
				})
			},

			//Gender display conversion
			// formatSex: function (row, column) {
			// 	return row.sex == 1 ? 'Male' : row.sex == 0 ? 'Female' : 'Unknow';
			// },
			handleCurrentChange(val) {
				this.page = val;
				// this.getUsers();
				this.getUserApi();
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
			//delete Team
			deleteTeamApi: function (index, row) {
				this.$confirm('Are you sure to delete this record?', 'Alert', {
					type: 'warning'
				}).then(() => {
					// this.listLoading = true;
					let para = { id: row.id };
					console.log(row.id);
					// console
					// HTTP.delete(`Team/` + `console.log(response.data);`).then(response => {
					// 	this.listLoading = false;
						
					// 	this.$message({
					// 		message: 'Deleted Successfully!',
					// 		type: 'success'
					// 	});
					// 	console.log(response.data);
					// 	this.getUserApi();
					// })
					// .catch(e => {
					// 	console.log(this.para);
					// 	console.log(e.response.data.errors.id);
						
					// 	this.$message({
					// 		message: 'Cannot delete this team!',
					// 		type: 'error'
					// 	});
					// });
					

					// let para = { id: row.id };
					// removeUser(para).then((res) => {
					// 	this.listLoading = false;
					// 	//NProgress.done();
					// 	this.$message({
					// 		message: 'Deleted Successfully!',
					// 		type: 'success'
					// 	});
					// 	this.getUsers();
					// });
				}).catch(() => {

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
						
							HTTP.put(`Team`, {
								id: this.editForm.id,
								name: this.editForm.name,
								salarySuggest: this.editForm.salarySuggest
							}).then((response) => {
								this.editLoading = false;
								
								this.$message({
									message: 'Edited Successfully!',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getUserApi();
							})
							.catch( e => {
								console.log(e);
							})
							
							
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
			
			
		},
		mounted() {
			this.getUserApi();
			this.countTeam();
			this.getUsers();
		}
	}

</script>

<style scoped>

</style>