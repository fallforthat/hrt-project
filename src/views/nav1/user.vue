<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="Name"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUser">Search</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="testCallApi">Search Team</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!-- 列表 -->
		<template>
			<!-- <el-table :data="users" highlight-current-row v-loading="loading" style="width: 100%;" @row-click="rowClicked">
				<el-table-column type="index" width="60">
				</el-table-column>
				<el-table-column prop="name" label="Name" width="120" sortable>
				</el-table-column>
				<el-table-column prop="sex" label="Gender" width="130" :formatter="formatSex" sortable>
				</el-table-column>
				<el-table-column prop="age" label="Age" width="100" sortable>
				</el-table-column>
				<el-table-column prop="birth" label="Date of Birth" width="220" sortable>
				</el-table-column>
				<el-table-column prop="addr" label="Address" min-width="180" sortable>
				</el-table-column>
			</el-table> -->


			<el-table :data="test" highlight-current-row v-loading="loading" style="width: 100%;">
				<el-table-column type="index" width="30">
				</el-table-column>
				<el-table-column prop="name" label="Name" width="100" sortable>
				</el-table-column>
				<el-table-column prop="id" label="Id" width="350" sortable>
				</el-table-column>
				<el-table-column prop="salarySuggest" label="Salary Suggest" width="180" sortable>
				</el-table-column>
				<el-table-column prop="dateCreated" label="Date Created" width="220" sortable>
				</el-table-column>
				<el-table-column prop="description" label="Description" min-width="180" sortable>
				</el-table-column>
				<el-table-column prop="isDeleted" label="Deleted" min-width="100" sortable>
				</el-table-column>
			</el-table>
		</template>

	</section>
</template>
<script>
	import { getUserList, HTTP } from '../../api/api';
	//import NProgress from 'nprogress'
	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				loading: false,
				users: [
				],
				test:[

				]
			}
		},
		methods: {
			//性别显示转换
			formatSex: function (row, column) {
				return row.sex == 1 ? 'Male' : row.sex == 0 ? 'Female' : 'Unknow';
			},
			//获取用户列表
			getUser: function () {
				let para = {
					name: this.filters.name
				};
				this.loading = true;
				//NProgress.start();
				getUserList(para).then((res) => {
					this.users = res.data.users;
					//console.log(this.users);
					this.loading = false;
					//NProgress.done();
				});
			},

			// testCallApi: function() {
			// 	let para = {
			// 		name: this.filters.name
			// 	};
			// 	HTTP.get(`Team?searchValue=` + para.name).then(response => {
			// 		this.test = response.data;
			// 		console.log(this.test);
			// 	})
			// 	.catch(e => {
			// 		console.log(e);
			// 	})
			// },
			testCallApi: function() {
				HTTP.get(`Team/allnonpaging`).then(response => {
					this.test = response.data;
					console.log(this.test);
				})
				.catch(e => {
					console.log(e);
				})
			},

			rowClicked: function() {
				// HTTP.get(`Team?searchValue=tu`).then(response => {
				// 	this.test = response.data;
				// 	console.log(this.test);
				// 	alert(response.status);
				// })
				// .catch(e => {
				// 	console.log(e);
				// })
				let countTeam;
				HTTP.get(`Team/count`).then(res => {
					this.countTeam = res.data;
					console.log(this.countTeam);
					alert(this.countTeam);
				})
				.catch(e => {
					console.log(e);
				})
				
			}
			
		},
		mounted() {
			this.getUser();
			this.testCallApi();
		}
	};

</script>

<style scoped>

</style>