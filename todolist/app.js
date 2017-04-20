//localStorage
var store = {
	save(key,value){
		localStorage.setItem(key,JSON.stringify(value));
	},
	fetch(key){
		return JSON.parse(localStorage.getItem(key)) || [];
	}
};

/*var list = [
	{
		title:"吃饭睡觉打豆豆",
		isChecked:false
	},
	{
		title:"吃饭打豆豆",
		isChecked:true
	},
];*/
var list = store.fetch("c-class");

var filter = {
	all:function(list){
		return list;
	},
	finished:function(list){
		return list.filter(function(item){				
			return item.isChecked;
		})
	},
	unfinished:function(list){
		return list.filter(function(item){
			return !item.isChecked;
		})
	}
}

var vm = new Vue({
	el:".main",
	data:{
		list:list,
		todo:"",
		edtorTodos:"",    //记录正在编辑的数据
		beforeTitle:"",
		visibility:"all"
	},
	watch:{
		/*list:function(){   
			store.save("c-class",this.list);
		}*/
		list:{
			handler:function(){
				store.save("c-class",this.list);
			},
			deep:true
		}
	},
	computed:{
		noCheckLength:function(){
			return this.list.filter(function(item){
				return !item.isChecked
			}).length
		},
		filteredList:function(){
			return filter[this.visibility] ? filter[this.visibility](list) : list
		}
	},
	methods:{
		addTodo(ev){     //添加任务
			//向list中添加一项任务
			this.list.push({
				title:this.todo,
				isChecked:false
			});
			this.todo = ""
		},
		deleteTodo(todo){     //删除任务
			var index = this.list.indexOf(todo);
			this.list.splice(index,1);
		},
		edtorTodo(todo){      //编辑任务
			this.beforeTitle = todo.title;
			this.edtorTodos = todo;
		},
		edtorTodoed(todo){     //编辑任务成功
			this.edtorTodos = "";
		},
		cancelTodo(todo){      //取消编辑任务
			todo.title = this.beforeTitle;
			this.edtorTodos = "";
		}
	},
	directives:{
		focus:{
			update(el,binding){
				if(binding.value){
					el.focus();
				}
			}
		}
	}
});

function watchHashChange(){
	var hash = window.location.hash.slice(1);
	vm.visibility = hash;
}

window.addEventListener("hashchang",watchHashChange);