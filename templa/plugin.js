/**
 * templa
 */

/*global tinymce:true */

tinymce.PluginManager.add('templa', function(ed) {

	
	ed.addCommand('mceTempla', function(ui) {
		
		var w = ed.windowManager.open({
			title: editor.getLang("templa_dlg.title"),
			width : ed.getParam('templa_popup_width', 750),
			height : ed.getParam('templa_popup_height', 600),
		});
		
		console.log(w)
		
		insertTempla(ui)
	});
	
	var insertTempla = function(ui) {
		var h, el, dom = ed.dom, sel = ed.selection.getContent();

 		var cfields =[];
 		var cmods = [];
 		
 		require(["dojo/dom-construct","dojo/query","dforma/Builder"],function(domConstruct,query,Builder){
 			
	 		if(sel) {
		 		var div = domConstruct.create("div",{
		 			innerHTML:sel
		 		});
		 		cfields = query(".templaField",div);
		 		cmods = query("*[data-templa-type]",div);
	 		}
	 		
	 		var mods = dojo.byId("modifier_opts");
	 		var fb;
	 		if(!sel || !cfields.length) {
	 			var fields = domConstruct.create("div",{
	 				innerHTML:'<div class="title">{#templa_dlg.fields} <span id="templa_model">?</span></div>'
	 			});
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
				fb = new Builder({
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
						ed.insertContent(str);
					},
					cancel:function(){
						tinyMCEPopup.close();
					},
					data:{controls:controls}
				}).placeAt(fields);
	 			fb.startup();
	 		} else {
	 	 		// if we have a selection with a field/fields, display modifier (enclose selection), or delete/unselect fields (update selection)
	 			var mods = domConstruct.create("div",{
	 				innerhtml:'<div class="title">{#templa_dlg.modifier}</div>'
	 			});
	 			
	 			if(cmods.length===0) {
	 				fb = new Builder({
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
	 						ed.insertContent(str);
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
 		});
	};
	// Register buttons
	ed.addButton('templa', {title : 'templa.desc', cmd : 'mceTempla'});
});