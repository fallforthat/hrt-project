<template>
	<section>
		<!--Toolbar-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="Search"></el-input>
				</el-form-item>
				<!-- <el-form-item>
					<el-button type="primary" v-on:click="searchTeamApi">Search</el-button>
				</el-form-item> -->
			
				<el-form-item>
					<el-button type="primary" @click="handleAddCompany">Add Company</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!-- List call api -->
		<el-table :data="apiCompanies" highlight-current-row v-loading="listLoading" style="width: 100%;" :row-class-name="tableRowClassName" dis>
			<el-table-column type="index" width="100">
			</el-table-column>
			<el-table-column prop="id" label="Id" width="450">
			</el-table-column>
			<el-table-column prop="name" label="Name" width="320" sortable>
			</el-table-column>
			<el-table-column prop="address" label="Address" width="300" sortable>
			</el-table-column>
			<el-table-column prop="isDeleted" label="Status" width="250" sortable  >
				<template slot-scope="scope">
					<el-tag :type="scope.row.isDeleted === false ? 'success' : 'danger'" >
						<span v-if="scope.row.isDeleted">Unavailable</span>
						<span v-else>Available</span>
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
				<!-- <template slot-scope="props">
					<p> <span style="font-weight: bold"> ID: </span>{{ props.row.id }}</p>

				</template> -->
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
		<el-dialog title="Edit Detail" v-model="editCompanyVisible" :close-on-click-modal="false">
			<el-form :model="editCompany" label-width="80px" :rules="editFormRules" ref="editCompany">
				<el-form-item label="ID" prop="id">
					<el-input v-model="editCompany.id" auto-complete="off" disabled></el-input>
				</el-form-item>
				
				<el-form-item label="Company Name" prop="name">
					<el-input v-model="editCompany.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="Address" prop="address">
					<el-input v-model="editCompany.address" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="Description" prop="description">
					<el-input v-model="editCompany.description" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editCompanyVisible = false">Cancel</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">Save</el-button>
				
			</div>
		</el-dialog>

		

		<!-- Add New Company To Api -->
		<el-dialog title="Add New Company" v-model="addCompanyVisible" :close-on-click-modal="false">
			<el-form :model="addCompany" label-width="80px" :rules="addFormRules"  ref="addCompany">
				<el-form-item label="Company Name" prop="name" label-width="100px">
					<el-input v-model="addCompany.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="Address" prop="address" label-width="100px">
					<el-input v-model="addCompany.address" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="Descripton" prop="description" label-width="100px">
					<el-input v-model="addCompany.description" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addCompanyVisible = false">Cancel</el-button>
				<el-button type="primary" @click.native="addCompanyToApi" :loading="addLoading">Add</el-button>
			</div>
		</el-dialog>
	</section>
</template>
<style>
  .el-table .isDeleted-row {
    background: #e4e9f2;
  }

  
</style>
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

				editCompanyVisible: false,//Whether the editing interface is displayed
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: 'Please enter your name!', trigger: 'blur' }
					],
					address: [
						{ required: true, message: 'Please enter address!', trigger: 'blur' }
					],
					description: [
						{ required: true, message: 'Please enter description!', trigger: 'blur' }
					]
				},
				//Edit interface data
				editCompany: {
					id: 0,
					name: '',
					address: '',
					description: ''
				},

				addFormVisible: false,//Whether the new interface is displayed
				addCompanyVisible: false, 
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: 'Please enter team name!', trigger: 'blur' }
					],
					address: [
						{ required: true, message: 'Please enter address!', trigger: 'blur' }
					],
					description: [
						{ required: true, message: 'Please enter description!', trigger: 'blur' }
					]
				},

				//New Add Team Form
				addCompany: {
					name: '',
					address: '',
					description: ''
				},

				//data get from api
				apiCompanies: [],
				errors: [],
				searchTeam: [],
				totalTeams: `0`,

			}
		},
		methods: {
			//get users from api
			getCompanyApi: function() {
			
				let para = {
					pageNo: this.page
				};

				HTTP.get(`Company/GetAllPaging?pageIndex=` + para.pageNo + `&pageSize=10`).then(response => {
					this.apiCompanies = response.data;
					console.log(this.apiCompanies);
				})
				.catch(e => {
					console.log(e);
				})
			},

			//Handle add new account to api
			handleAddCompany: function () {
				this.addCompanyVisible = true;
				this.addCompany = {
					name: '',
					address: '',
					description: ''
				};
			},

			//set status of row table
			tableRowClassName(row) {
				if(row.isDeleted === true) {
					return 'isDeleted-row';
				}
				return '';
			},
			
			//Add
			addCompanyToApi: function () {
				this.$refs.addCompany.validate((valid) => {
					if (valid) {
						this.$confirm('Confirm to add?', 'Alert', {}).then(() => {
							this.addLoading = true;
							HTTP.post(`Company`, {
								name: this.addCompany.name,
								address: this.addCompany.address,
								description: this.addCompany.description
							 }).then(response => {
								
								
								this.$message({
									message: `Add Company successfully~`,
									type: `success`
								});
								this.addLoading = false;
								this.$refs[`addCompany`].resetFields();
								this.addCompanyVisible = false;
								this.getCompanyApi();
							}).catch(e => {
								
								
								this.$message({
										message: `Cannot add company! `,
										type: `error`
									});
								this.addLoading = false;
								this.addCompanyVisible = false;
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
				this.getCompanyApi();
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
					// this.listLoading = true;
					let para = { id: row.id };
					// console.log(row.id);
					
					HTTP.delete(`Company/` + para.id).then(response => {
						this.$message({
									message: `Deleted company successfully~`,
									type: `success`
								});
						this.listLoading = false;
						this.getCompanyApi();
						
					})
					.catch(e => {
						this.$message({
							message: 'Cannot delete team!',
							type: 'error'
						});

						console.log(e);
					});
				}).catch(() => {

				});
			},
			//Show editing interface
			handleEdit: function (index, row) {
				this.editCompanyVisible = true;
				this.editCompany = Object.assign({}, row);
			},
			
			//edit
			editSubmit: function () {
				this.$refs.editCompany.validate((valid) => {
					if (valid) {
						this.$confirm('Confirm to submit?', 'Alert', {}).then(() => {
							this.editLoading = true;
						
							HTTP.put(`Company`, {
								id: this.editCompany.id,
								name: this.editCompany.name,
								address: this.editCompany.address,
								description: this.editCompany.description
								
							}).then((response) => {
								
								
								this.$message({
									message: 'Edited Successfully!',
									type: 'success'
								});
								this.editLoading = false;
								this.$refs['editCompany'].resetFields();
								this.editCompanyVisible = false;
								this.getCompanyApi();
							})
							.catch( e => {
								this.$message({
									message: 'Edited failed!',
									type: 'error'
								});
								console.log(e);
								this.editLoading = false;
								this.editCompanyVisible = false;
							})
							
							
						});
					}
				});
			},
			
			
			
		},
		mounted() {
			this.getCompanyApi();
			// this.countTeam();
			this.getUsers();
		}
	}

</script>

<style scoped>

</style>