/**
 * @author sux
 * @time 2011-1-14
 * @desc 门店信息显示
 */
deptInfoGridPanel = Ext.extend(Ext.grid.EditorGridPanel,{
	id: 'deptInfoPanel',
	//renderTo: Ext.getBody(), //渲染到body
	constructor: function(){
		Ext.QuickTips.init();
		this['store'] = new Ext.data.JsonStore({
			url: 'dept_list.action',
			root: 'root',
 			totalProperty: 'totalProperty',
			//record
			fields: ['deptId','deptName',
			'deptNum','deptMgr','deptRemark']
		});
		var rowNumber = new Ext.grid.RowNumberer(); //序列号	
		var checkbox = new Ext.grid.CheckboxSelectionModel(); //{默认是多选singleSelect: false}
		deptInfoGridPanel.superclass.constructor.call(this,{
			width: Ext.getCmp('mainTab').getActiveTab().getInnerWidth(),
			height: Ext.getCmp('mainTab').getActiveTab().getInnerHeight(),
			/**表格高度自适应 document.body.clientHeight浏览器页面高度 start**/
			monitorResize: true, 
			doLayout: function() { 
				this.setWidth(document.body.clientWidth-205);
				this.setHeight(document.body.clientHeight-140);
				Ext.grid.GridPanel.prototype.doLayout.call(this); 
			} ,
			/**end**/
			viewConfig: {
				forceFit: true,
				columnsText : "显示/隐藏列",
                sortAscText : "正序排列",
                sortDescText : "倒序排列"
			},
			sm: checkbox,
			columns: [
				rowNumber, checkbox,
				{
					header: '门店编号',
					dataIndex: 'deptId',
					align: 'center'
				},{
					header: '门店名称',
					dataIndex: 'deptName',
					align: 'center'				
				},{
					header: '门店人数',
					dataIndex: 'deptNum',
					align: 'center'
				},{
					header: '门店经理',
					dataIndex: 'deptMgr',
					align: 'center'
				},{
					header: '备注',
					dataIndex: 'deptRemark',
					name: 'deptRemark',
					renderer: Ext.hrmsys.grid.tooltip.subLength,
					align: 'center'
				}],
			tbar: new Ext.Toolbar({
				style: 'padding: 5px;',
				id: 'departToolbar',
				items: ['条目:',{
					xtype: 'combo',
					width: 80,
					triggerAction: 'all',
					editable: false,
					mode: 'local',
					store: new Ext.data.SimpleStore({
						fields: ['name','value'],
						data: [[" ","全部"],["deptId","门店编号"],["deptName","门店名称"],["deptMgr","门店经理"]]
					}),
					id: 'condition_dept',
					displayField: 'value',
					valueField: 'name',
					emptyText: '请选择'
				},'内容:',{
					id: 'condition_dept_value',
					xtype: 'textfield',
					listeners : {
		                specialkey : function(field, e) {//添加回车事件
		                    if (e.getKey() == Ext.EventObject.ENTER) {
		                       queryDeptFn();
		                    }
		                }
					}
				},{
					text: '查询',
					tooltip: '查询门店',
					iconCls: 'search',
					hidden: 'true',
					id: 'dept_query',
					handler: queryDeptFn
				},{
					text: '删除',
					tooltip: '删除门店',
					id: 'dept_delete',
					iconCls: 'delete',
					hidden: 'true',
					handler: delDeptFn
				},{
					text: '添加',
					tooltip: '添加门店',
					id: 'dept_add',
					hidden: 'true',
					iconCls: 'add',
					handler: addDeptFn
				},{
					text: '修改',
					id: 'dept_update',
					iconCls: 'update',
					hidden: 'true',
					tooltip: '修改门店',
					handler: updateDeptFn
				}]
			}),
			bbar: new PagingToolbar(this['store'], 20)
		});
		this.getStore().load({
			params:{
				start: 0,
				limit: 20
			}
		});
		//new Ext.Viewport().render();
	}
});

addDeptFn = function(){
	deptAddWin = new DeptAddWin();
	deptAddWin.show();
};

delDeptFn = function(){
	gridDel('deptInfoPanel','deptId', 'dept_delete.action');
};

updateDeptFn = function(){
	deptAddWin = new DeptAddWin();
	deptAddWin.title = '门店信息修改';
	var selectionModel = Ext.getCmp('deptInfoPanel').getSelectionModel();
	var record = selectionModel.getSelections();
	if(record.length != 1){
		Ext.Msg.alert('提示','请选择一个');
		return;
	}
	var deptId = record[0].get('deptId');
	Ext.getCmp('deptAddFormId').getForm().load({
		url: 'dept_intoUpdate.action',
		params: {
			deptId: deptId
		}
	})
	deptAddWin.show();
};

queryDeptFn = function(){
	var condition = Ext.getCmp('condition_dept').getValue();
	var conditionValue = Ext.getCmp("condition_dept_value").getValue();
	Ext.getCmp("deptInfoPanel").getStore().reload({
		params: {
			condition: condition,
			conditionValue : conditionValue,
			start: 0,
			limit: 20
		}
	})
};