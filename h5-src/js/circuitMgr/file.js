
//7文件函数--------------------------------------------------------------------↓

//获取文件路径
Manager.GetFilePath = function() {
	return Manager.fileName;
};

//保存电路
Manager.SaveFile = function(newFileName) {
	ASSERT(newFileName && newFileName.length > 0);
	Manager.fileName = newFileName;	//替换原有文件路径
	
	
	var data = {};

	//1文件版本
	data.fileVersion = FILE_VERSION;

	//2结点
	data.cruns = new Array();
	for (var i = Manager.crun.length-1; i >= 0; --i)
		data.cruns.push(Manager.crun[i].GenerateStoreJsonObj());
	//3控件
	data.ctrls = new Array();
	for (var i = Manager.ctrl.length-1; i >= 0; --i)
		data.ctrls.push(Manager.ctrl[i].GenerateStoreJsonObj());
	//4导线
	data.leads = new Array();
	for (var i = Manager.lead.length-1; i >= 0; --i)
		data.leads.push(Manager.lead[i].GenerateStoreJsonObj());

	//5其他变量
	data.moveBodySense = Manager.moveBodySense;		//按方向键一次物体移动的距离
	data.maxLeaveOutDis = Manager.maxLeaveOutDis;	//导线合并最大距离
	data.textColor = Manager.textColor;				//字体颜色
	data.focusLeadStyle = Manager.focusLeadStyle;	//焦点导线样式
	data.focusCrunColor = Manager.focusCrunColor;	//焦点结点颜色
	data.focusCtrlColor = Manager.focusCtrlColor;	//焦点控件颜色
	data.focusBody = Manager.focusBody.GenerateStoreJsonObj();	//焦点物体
	
	// 发送请求
	var callbackFunc = function(response) {};
	$.post("/saveCircuit", {"data":data}, callbackFunc);
	return true;
};

//读取电路回调函数
function readFileCallbackFunc(data) {
	var pos1 = {x:0, y:0};

	if (!data || data.length <= 0) {
		alert("文件不能不存在或不能读取 !");
		return false;
	}

	//1文件版本
	if (data.fileVersion != FILE_VERSION) {	//文件版本不同,不予读取
		alert("文件版本不符 ! 读取文件错误");
		return false;
	}

	//Manager.fileName = newFileName;	//替换原有路径

	// 可能因为文件问题而发生错误
	//try {
		//2读取物体数量
		var crunCount = data.cruns.length;
		var ctrlCount = data.ctrls.length;
		var leadCount = data.leads.length;

		//检查读取的物体数量是否在允许的范围之内
		if (crunCount>MAX_CRUN_COUNT || leadCount>MAX_LEAD_COUNT || ctrlCount>MAX_CTRL_COUNT)
			throw new Error(10, "电路元件太多");
		
		//3新建原件
		CRUN.ResetGlobalInitOrder();
		Manager.crun = new Array(crunCount);
		for (var i = crunCount-1; i >= 0; --i)
			Manager.crun[i] = CRUN.CreateNew(i, 0,0);
		
		CTRL.ResetGlobalInitOrder();
		Manager.ctrl = new Array(ctrlCount);
		for (var i = ctrlCount-1; i >= 0; --i)
			Manager.ctrl[i] = CTRL.CreateNew(i, 0,0, 0);
		
		LEAD.ResetGlobalInitOrder(leadCount);
		Manager.lead = new Array(leadCount);
		for (var i = leadCount-1; i >= 0; --i)
			Manager.lead[i] = LEAD.CreateNew(i, 0, null,null, false);
		
		//4读取结点
		for (var i = crunCount-1; i >= 0; --i)
			Manager.crun[i].ReadFromStoreJsonObj(data.cruns[i], Manager.lead);

		//5读取控件
		for (var i = ctrlCount-1; i >= 0; --i)
			Manager.ctrl[i].ReadFromStoreJsonObj(data.ctrls[i], Manager.lead);

		//6读取导线
		for (var i = leadCount-1; i >= 0; --i)
			Manager.lead[i].ReadFromStoreJsonObj(data.leads[i], Manager.lead, Manager.crun, Manager.ctrl);

		//7读取其他变量
		Manager.moveBodySense = data.moveBodySense;		//按方向键一次物体移动的距离
		Manager.maxLeaveOutDis = data.maxLeaveOutDis;	//导线合并最大距离
		Manager.textColor = data.textColor;				//字体颜色
		Manager.focusLeadStyle = data.focusLeadStyle;	//焦点导线样式
		Manager.focusCrunColor = data.focusCrunColor;	//焦点结点颜色
		Manager.focusCtrlColor = data.focusCtrlColor;	//焦点控件颜色
		//读取焦点物体
		var focusBody = Pointer.CreateNew();
		if (data.focusBody) 
			focusBody.ReadFromStoreJsonObj(data.focusBody, Manager.lead, Manager.crun, Manager.ctrl);
		//Manager.FocusBodySet(focusBody);				//设置焦点物体
		Manager.viewOrig = data.viewOrig;				//视角初始坐标

		//ctx.strokeStyle = PaintCommonFunc.HexToRGBStr(Manager.textColor);	//初始化字体颜色
	/*} catch(e) {
		alert("文件可能损坏了 ! 读取文件错误");
		return false;
	}*/

	Manager.PaintAll();
	return true;			//正常退出
}
function readFileComplete(xhr, textStatus) {
}
//读取电路
Manager.ReadFile = function(newFileName) {
	ASSERT(newFileName && newFileName.length > 0);
	var data = {
"fileVersion":13,

"cruns":[
{"index":0,"x":174,"y":168,"isPaintName":false,"name":"Crun0","lead":[7,3,-1,0]}
,{"index":1,"x":373,"y":168,"isPaintName":false,"name":"Crun1","lead":[6,19,2,4]}
,{"index":2,"x":372,"y":79,"isPaintName":false,"name":"Crun3","lead":[-1,9,8,12]}
,{"index":3,"x":420,"y":169,"isPaintName":false,"name":"Crun5","lead":[10,-1,4,13]}
,{"index":4,"x":420,"y":79,"isPaintName":false,"name":"Crun6","lead":[-1,11,12,5]}
,{"index":5,"x":466,"y":169,"isPaintName":false,"name":"Crun6","lead":[15,16,13,27]}
,{"index":6,"x":373,"y":274,"isPaintName":false,"name":"Crun7","lead":[19,-1,17,18]}
,{"index":7,"x":217,"y":343,"isPaintName":false,"name":"Crun8","lead":[-1,26,23,22]}
,{"index":8,"x":339,"y":342,"isPaintName":false,"name":"Crun9","lead":[-1,24,22,-1]}
,{"index":9,"x":266,"y":405,"isPaintName":false,"name":"Crun10","lead":[26,-1,23,25]}
,{"index":10,"x":588,"y":263,"isPaintName":false,"name":"Crun1","lead":[30,-1,29,28]}
],

"leads":[
{"index":0,"coord":[{"x":223,"y":168},{"x":177,"y":168}],
"color":0,"conBody":[{"atState":1,"style":1,"index":5},{"atState":4,"style":-1,"index":0}]}
,{"index":1,"coord":[{"x":288,"y":168},{"x":251,"y":168}],
"color":0,"conBody":[{"atState":1,"style":0,"index":6},{"atState":2,"style":1,"index":5}]}
,{"index":2,"coord":[{"x":316,"y":168},{"x":369,"y":168}],
"color":0,"conBody":[{"atState":2,"style":0,"index":6},{"atState":3,"style":-1,"index":1}]}
,{"index":3,"coord":[{"x":222,"y":273},{"x":174,"y":273},{"x":174,"y":171}],
"color":0,"conBody":[{"atState":1,"style":0,"index":2},{"atState":2,"style":-1,"index":0}]}
,{"index":4,"coord":[{"x":416,"y":169},{"x":416,"y":168},{"x":376,"y":168}],
"color":0,"conBody":[{"atState":3,"style":-1,"index":3},{"atState":4,"style":-1,"index":1}]}
,{"index":5,"coord":[{"x":467,"y":108},{"x":467,"y":79},{"x":423,"y":79}],
"color":0,"conBody":[{"atState":1,"style":3,"index":7},{"atState":4,"style":-1,"index":4}]}
,{"index":6,"coord":[{"x":372,"y":134},{"x":372,"y":164},{"x":373,"y":164}],
"color":0,"conBody":[{"atState":1,"style":0,"index":1},{"atState":1,"style":-1,"index":1}]}
,{"index":7,"coord":[{"x":244,"y":79},{"x":174,"y":79},{"x":174,"y":164}],
"color":0,"conBody":[{"atState":1,"style":0,"index":0},{"atState":1,"style":-1,"index":0}]}
,{"index":8,"coord":[{"x":272,"y":79},{"x":368,"y":79}],
"color":0,"conBody":[{"atState":2,"style":0,"index":0},{"atState":3,"style":-1,"index":2}]}
,{"index":9,"coord":[{"x":372,"y":106},{"x":372,"y":82}],
"color":0,"conBody":[{"atState":2,"style":0,"index":1},{"atState":2,"style":-1,"index":2}]}
,{"index":10,"coord":[{"x":420,"y":136},{"x":420,"y":165}],
"color":0,"conBody":[{"atState":2,"style":2,"index":4},{"atState":1,"style":-1,"index":3}]}
,{"index":11,"coord":[{"x":420,"y":108},{"x":420,"y":82}],
"color":0,"conBody":[{"atState":1,"style":2,"index":4},{"atState":2,"style":-1,"index":4}]}
,{"index":12,"coord":[{"x":416,"y":79},{"x":375,"y":79}],
"color":0,"conBody":[{"atState":3,"style":-1,"index":4},{"atState":4,"style":-1,"index":2}]}
,{"index":13,"coord":[{"x":423,"y":169},{"x":462,"y":169}],
"color":0,"conBody":[{"atState":4,"style":-1,"index":3},{"atState":3,"style":-1,"index":5}]}
,{"index":14,"coord":[{"x":307,"y":273},{"x":250,"y":273}],
"color":0,"conBody":[{"atState":1,"style":4,"index":3},{"atState":2,"style":0,"index":2}]}
,{"index":15,"coord":[{"x":467,"y":136},{"x":467,"y":169}],
"color":0,"conBody":[{"atState":2,"style":3,"index":7},{"atState":1,"style":-1,"index":5}]}
,{"index":16,"coord":[{"x":467,"y":169},{"x":467,"y":273},{"x":442,"y":273}],
"color":0,"conBody":[{"atState":2,"style":-1,"index":5},{"atState":2,"style":0,"index":8}]}
,{"index":17,"coord":[{"x":335,"y":273},{"x":373,"y":273}],
"color":0,"conBody":[{"atState":2,"style":4,"index":3},{"atState":3,"style":-1,"index":6}]}
,{"index":18,"coord":[{"x":373,"y":273},{"x":414,"y":273}],
"color":0,"conBody":[{"atState":4,"style":-1,"index":6},{"atState":1,"style":0,"index":8}]}
,{"index":19,"coord":[{"x":373,"y":171},{"x":373,"y":270}],
"color":0,"conBody":[{"atState":2,"style":-1,"index":1},{"atState":1,"style":-1,"index":6}]}
,{"index":20,"coord":[{"x":539,"y":263},{"x":519,"y":263},{"x":519,"y":338},{"x":546,"y":338}],
"color":0,"conBody":[{"atState":1,"style":0,"index":9},{"atState":1,"style":1,"index":10}]}
,{"index":21,"coord":[{"x":503,"y":383},{"x":503,"y":427},{"x":441,"y":427}],
"color":0,"conBody":[{"atState":1,"style":1,"index":14},{"atState":2,"style":0,"index":13}]}
,{"index":22,"coord":[{"x":220,"y":343},{"x":220,"y":342},{"x":335,"y":342}],
"color":0,"conBody":[{"atState":4,"style":-1,"index":7},{"atState":3,"style":-1,"index":8}]}
,{"index":23,"coord":[{"x":213,"y":343},{"x":193,"y":343},{"x":193,"y":405},{"x":262,"y":405}],
"color":0,"conBody":[{"atState":3,"style":-1,"index":7},{"atState":3,"style":-1,"index":9}]}
,{"index":24,"coord":[{"x":338,"y":368},{"x":338,"y":345},{"x":339,"y":345}],
"color":0,"conBody":[{"atState":1,"style":0,"index":11},{"atState":2,"style":-1,"index":8}]}
,{"index":25,"coord":[{"x":338,"y":396},{"x":338,"y":405},{"x":269,"y":405}],
"color":0,"conBody":[{"atState":2,"style":0,"index":11},{"atState":4,"style":-1,"index":9}]}
,{"index":26,"coord":[{"x":217,"y":346},{"x":217,"y":374},{"x":266,"y":374},{"x":266,"y":401}],
"color":0,"conBody":[{"atState":2,"style":-1,"index":7},{"atState":1,"style":-1,"index":9}]}
,{"index":27,"coord":[{"x":534,"y":169},{"x":469,"y":169}],
"color":0,"conBody":[{"atState":1,"style":1,"index":12},{"atState":4,"style":-1,"index":5}]}
,{"index":28,"coord":[{"x":574,"y":338},{"x":605,"y":338},{"x":605,"y":263},{"x":591,"y":263}],
"color":0,"conBody":[{"atState":2,"style":1,"index":10},{"atState":4,"style":-1,"index":10}]}
,{"index":29,"coord":[{"x":584,"y":263},{"x":567,"y":263}],
"color":0,"conBody":[{"atState":3,"style":-1,"index":10},{"atState":2,"style":0,"index":9}]}
,{"index":30,"coord":[{"x":562,"y":169},{"x":588,"y":169},{"x":588,"y":259}],
"color":0,"conBody":[{"atState":2,"style":1,"index":12},{"atState":1,"style":-1,"index":10}]}
],

"ctrls":[
{"index":0,"x":244,"y":65,"dir":0,"isPaintName":false,"name":"Ctrl1","lead":[7,8],"pressure":10.000000,"resist":6.000000,"style":0}
,{"index":1,"x":358,"y":106,"dir":3,"isPaintName":false,"name":"Ctrl5","lead":[6,9],"pressure":5.000000,"resist":3.000000,"style":0}
,{"index":2,"x":222,"y":259,"dir":0,"isPaintName":false,"name":"Ctrl2","lead":[3,14],"pressure":3.000000,"resist":1.000000,"style":0}
,{"index":3,"x":307,"y":259,"dir":0,"isPaintName":false,"name":"Ctrl3","lead":[14,17],"closed":true,"style":4}
,{"index":4,"x":406,"y":108,"dir":1,"isPaintName":false,"name":"Ctrl4","lead":[11,10],"rating":1.000000,"resist":1.000000,"style":2}
,{"index":5,"x":223,"y":154,"dir":0,"isPaintName":false,"name":"Ctrl7","lead":[0,1],"resist":3.000000,"style":1}
,{"index":6,"x":288,"y":154,"dir":0,"isPaintName":false,"name":"Ctrl8","lead":[1,2],"pressure":6.000000,"resist":4.000000,"style":0}
,{"index":7,"x":453,"y":108,"dir":1,"isPaintName":false,"name":"Ctrl6","lead":[5,15],"capa":0.000000,"style":3}
,{"index":8,"x":414,"y":259,"dir":0,"isPaintName":false,"name":"Ctrl9","lead":[18,16],"pressure":3.000000,"resist":1.000000,"style":0}
,{"index":9,"x":539,"y":249,"dir":0,"isPaintName":false,"name":"Ctrl10","lead":[20,29],"pressure":4.900000,"resist":2.450000,"style":0}
,{"index":10,"x":546,"y":324,"dir":0,"isPaintName":false,"name":"Ctrl11","lead":[20,28],"resist":2.450000,"style":1}
,{"index":11,"x":324,"y":368,"dir":1,"isPaintName":false,"name":"Ctrl12","lead":[24,25],"pressure":1.000000,"resist":1.000000,"style":0}
,{"index":12,"x":534,"y":155,"dir":0,"isPaintName":false,"name":"Ctrl1","lead":[27,30],"resist":0.000000,"style":1}
,{"index":13,"x":413,"y":413,"dir":0,"isPaintName":false,"name":"Ctrl2","lead":[-1,21],"pressure":0.000000,"resist":0.000000,"style":0}
,{"index":14,"x":503,"y":369,"dir":0,"isPaintName":false,"name":"Ctrl3","lead":[21,-1],"resist":0.000000,"style":1}
]

};readFileCallbackFunc(data);
	//$.ajax({ url: "/testData.json", async:false, success: readFileCallbackFunc, complete:readFileComplete});
	return true;
};

//建立新文件(空的)
Manager.CreateFile = function() {
	Manager.fileName = '';													//路径清空
	Manager.ClearCircuitState();											//清除电路状态信息
	Manager.crun.length = Manager.ctrl.length = Manager.lead.length = 0;	//物体数量设为0
};
