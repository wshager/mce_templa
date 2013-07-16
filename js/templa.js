tinyMCEPopup.requireLangPack();

var TemplateDialog = {
	preInit : function() {
	},

	init : function() {
		var ed = tinyMCEPopup.editor;

 		// get current selection if any		
 		var sel = ed.selection.getContent();
 		var cfields =[];
 		var cmods = [];
 		if(sel) {
	 		var div = dojo.create("div",{
	 			innerHTML:sel
	 		});
	 		cfields = dojo.query(".templaField",div);
	 		cmods = dojo.query("*[data-templa-type]",div);
	 		console.log(cfields)
 		}
 		var fields = dojo.byId("field_opts");
 		var mods = dojo.byId("modifier_opts");
 		var fb;
 		this.type = null;
 		var self = this;
 		if(!sel || !cfields.length) {
 			this.type = "fld";
 			fields.style.display = "block";
 			mods.style.display = "none";
 	 		// if we have no selection or a selection without any fields, display fields (if selection replace it)
 			var model = ed.getParam('templa_model','');
 			var schema = ed.getParam('templa_schema',null);
 			var editable = ed.getParam('templa_editable',false);
 			var service = ed.getParam('templa_service','/persvr/');
 			if(!model || !schema) {
 				alert("No model or schema found");
 				return;
 			}
 			dojo.byId("templa_model").innerHTML = model;
 			var controls = [];
			for(var k in schema.properties) {
				controls.push({
					type:"checkbox",
					name:k
				});
			}
			fb = new dforma.Builder({
				submit:function(){
					if(!this.validate()) return;
					var data = this.get("value");
					var flds = [];
					var str = "";
					for(var k in data){
						if(data[k][0]) {
							var fld = "{{"+k+"}}";
							if(editable) {
								fld = "{{#"+k+"}}{{#_fn_editable}}{{value}}{{/_fn_editable}}{{/"+k+"}}";
							} else if(schema.properties[k] && schema.properties[k].format=="xuri") {
								fld = "{{{"+k+"}}}";
							}
							str += '<span class="mceNonEditable templaField">'+fld+'</span>';
						}
					}
					self.insert(str);
				},
				cancel:function(){
					tinyMCEPopup.close();
				},
				data:{controls:controls}
			}).placeAt(fields);
 			fb.startup();
 		} else {
 	 		// if we have a selection with a field/fields, display modifier (enclose selection), or delete/unselect fields (update selection)
 			this.type = "mod";
 			fields.style.display = "none";
 			mods.style.display = "block";
 			if(cmods.length===0) {
 				fb = new dforma.Builder({
 					submit:function(){
 						if(!this.validate()) return;
 						var data = this.get("value");
 						var mod = data.modifier;
 						delete data.modifier;
 						for(var k in data) {
							if(!data[k]) delete data[k];
 						}
 						var json = dojo.toJson(data);
 						json = json.replace(/\"/g,"'").substr(1,json.length-2);
 						var str = '<span title="'+mod+'" data-templa-type="'+mod+'" data-templa-props="'+json+'">'+sel+'</span>';
 						self.insert(str);
 					},
 					cancel:function(){
 						tinyMCEPopup.close();
 					},
 					data:{
 						controls:[{
 							type:"select",
 							controller:true,
 							name:"modifier",
 							options:[{
 								id:"dlagua.c.date.locale::format",
 								controls:[{
 									type:"select",
 									name:"selector",
 									options:[{
 										id:"datetime",
 										value:null
 									},{id:"date"},{id:"time"}]
 								},{
 									type:"input",
 									name:"formatLength"
 								},{
 									type:"input",
 									name:"datePattern"
 								},{
 									type:"input",
 									name:"timePattern"
 								}]
 							}]
 						}]
 					}
 				}).placeAt(mods);
 				fb.startup();
 			}
 	 		// if we have 1 modifier, select current/optional properties, or remove modifier (update selection)
 	 		// if we have more modifiers, return (do nothing)
 		}



 		// onInsert output <span class="mceNonEditable templaField">fieldname</span>
 		// <span class="templaModifier" data-templa-type="dojo/string/locale::format" data-templa-props="format:bla">{currentSelection}</span>
		
		
		this.resize();
	},

	resize : function() {
		var w, h;

		if (!self.innerWidth) {
			w = document.body.clientWidth - 50;
			h = document.body.clientHeight - 160;
		} else {
			w = self.innerWidth - 50;
			h = self.innerHeight - 170;
		}
	},

	selectType : function(selectedOption) {
		// selectedOption.value
	},

 	insert : function(content) {
 		// passes the data from the popup to the plugin
		tinyMCEPopup.execCommand('mceInsertTempla', false, {
			content : content, // set to the html to insert
			selection : tinyMCEPopup.editor.selection.getContent()
		});

		tinyMCEPopup.close();
	}
};

TemplateDialog.preInit();
tinyMCEPopup.onInit.add(TemplateDialog.init, TemplateDialog);
