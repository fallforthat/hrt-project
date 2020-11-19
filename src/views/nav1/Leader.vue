<template>
	<section>
		<!--Toolbar-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="Search"></el-input>
				</el-form-item>
				<!-- <el-form-item>
					<el-button type="primary" v-on:click="getUsers">Search</el-button>
				</el-form-item> -->
				<el-form-item>
					<el-button type="primary" @click="handleAddLeader">Add New Leader</el-button>
				</el-form-item>
				
			</el-form>
		</el-col>

		<!-- List call api -->
		<el-table :data="apiLeaders.filter(data => !filters.name || data.name.toLowerCase().includes(filters.name.toLowerCase()))" highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column type="index" width="100">
			</el-table-column>
			<el-table-column prop="id" label="Id" width="450">
			</el-table-column>
			<el-table-column prop="name" label="Name" width="270" sortable>
			</el-table-column>
			<el-table-column prop="user.email" label="Email" width="350" sortable>
			</el-table-column>
			<!-- <el-table-column prop="user.phoneNumber" label="Phone Number" width="200" sortable>
			</el-table-column>
			<el-table-column prop="experience" label="Experience" min-width="180" sortable>
			</el-table-column>
			<el-table-column prop="description" label="Description" min-width="180" sortable>
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
			<el-table-column type="expand">
				<template slot-scope="props">
					<p> <span style="font-weight: bold"> ID: </span>{{ props.row.id }}</p>

				</template>
			</el-table-column>
		</el-table>

		<!--Bottom Toolbar-->
		<el-col :span="24" class="toolbar">
			<!-- <span>Total Teams:</span>
			<el-input :placeholder="totalTeams" disabled style="width:50px" size="small"></el-input> -->
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--Edit Detail-->
		<el-dialog title="Edit Detail" v-model="editLeaderVisible" :close-on-click-modal="false">
			<el-form :model="editLeader" label-width="80px" :rules="editFormRules" ref="editLeader">
				<el-form-item label="ID" prop="id">
					<el-input v-model="editLeader.id" auto-complete="off" disabled></el-input>
				</el-form-item>
				<el-form-item label="Name" prop="name">
					<el-input v-model="editLeader.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="Description" prop="description">
					<el-input v-model="editLeader.description" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="Experience" prop="experience">
					<el-input v-model="editLeader.experience" auto-complete="off"></el-input>
				</el-form-item>
				
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editLeaderVisible = false">Cancel</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">Save</el-button>
				
			</div>
		</el-dialog>

		

		<!-- Add New Leader To Api -->
		<el-dialog title="Add New Leader" v-model="addLeaderVisible" :close-on-click-modal="false">
			<el-form :model="addLeader" label-width="80px" :rules="addFormRules" ref="addLeader">
				<el-form-item label="Name" prop="name">
					<el-input v-model="addLeader.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="Description" prop="description">
					<el-input v-model="addLeader.description" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="Experience" prop="experience">
					<el-input v-model="addLeader.experience" auto-complete="off"></el-input>
				</el-form-item>
				
			
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addLeaderVisible = false">Cancel</el-button>
				<el-button type="primary" @click.native="addLeaderToApi" :loading="addLoading">Add</el-button>
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

				editLeaderVisible: false,//Whether the editing interface is displayed
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: 'Please enter your name!', trigger: 'blur' }
					],
					description: [
						{ required: true, message: 'Please enter description!', trigger: 'blur' }
					],
					experience: [
						{ required: true, message: 'Please enter experience!', trigger: 'blur' }
					],
				},
				//Edit interface data
				editLeader: {
					id: 0,
					name: '',
					description: '',
					experience: ''
				},

				addFormVisible: false,//Whether the new interface is displayed
				addLeaderVisible: false, 
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: 'Please enter your name!', trigger: 'blur' }
					],
					description: [
						{ required: true, message: 'Please enter description!', trigger: 'blur' }
					],
					experience: [
						{ required: true, message: 'Please enter experience!', trigger: 'blur' }
					],
				},
				//New interface data
				addLeader: {
					name: '',
					description: '',
					experience: ''
				},

				

				//data get from api
				apiLeaders: [],
				//total leaders
				totalLeader: `0`,

			}
		},
		methods: {
			//get users from api
			getLeaderApi: function() {
				
				let para = {
					pageNo: this.page
				}; 

				HTTP.get(`Leader/GetAllWithPaging?pageNumber=` + para.pageNo + `&itemPerPage=10`).then(response => {
					this.apiLeaders = response.data;
					console.log(this.apiLeaders);
				})
				.catch(e => {
					this.$message({
							message: 'Error while getting leaders list!',
							type: 'error'
						});
					console.log(e);
				})
			},

			//Handle add new account to api
			handleAddLeader: function () {
				this.addLeaderVisible = true;
				this.addLeader = {
					name: '',
					description: '',
					experience: ''
				};
			},
			
			

			
			//Add
			addLeaderToApi: function () {
				this.$refs.addLeader.validate((valid) => {
					if (valid) {
						this.$confirm('Confirm to add?', 'Alert', {}).then(() => {
							this.addLoading = true;
							
							HTTP.post(`Leader`, { 
								name: this.addLeader.name,
								description: this.addLeader.description,
								experience: this.addLeader.experience,
								
							 }).then(response => {
								
								
									
								this.$message({
									message: `Add Leader successfully~`,
									type: `success`
								});
								console.log(response.status);
								this.addLoading = false;
								this.$refs[`addLeader`].resetFields();
								this.addLeaderVisible = false;
								this.getLeaderApi();
							}).catch(e => {
								this.$message({
										message: `Cannot add new leader~`,
										type: `error`
									});
								this.addLoading = false;
								this.addLeaderVisible = false;
								console.log(e);
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
				// this.getUsers();
				this.getLeaderApi();
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
				this.editLeaderVisible = true;
				this.editLeader = Object.assign({}, row);
			},
			
			//edit
			editSubmit: function () {
				this.$refs.editLeader.validate((valid) => {
					if (valid) {
						this.$confirm('Confirm to submit?', 'Alert', {}).then(() => {
							
							
							this.editLoading = true;
							
							HTTP.put(`Leader`, {
								id: this.editLeader.id,
								name: this.editLeader.name,
								description: this.editLeader.description,
								experience: this.editLeader.experience
							}).then(response => {
								this.$message({
									message: 'Edited Successfully!',
									type: 'success'
								});
								this.editLoading = false;
								this.$refs['editLeader'].resetFields();
								this.editLeaderVisible = false;
								this.getLeaderApi();
							})
							.catch(e => {
								this.$message({
									message: 'Cannot edit this leader!',
									type: 'error'
								});
								this.editLoading = false;
								this.editLeaderVisible = false;
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
			
			
		},
		mounted() {
			this.getLeaderApi();
			this.getUsers();
		}
	}

</script>

<style scoped>

</style>