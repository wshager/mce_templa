/**
 * editor_plugin_src.js
 *
 * Copyright 2009, Moxiecode Systems AB
 * Released under LGPL License.
 *
 * License: http://tinymce.moxiecode.com/license
 * Contributing: http://tinymce.moxiecode.com/contributing
 */

(function() {
	var each = tinymce.each;

	tinymce.create('tinymce.plugins.Templa', {
		init : function(ed, url) {
			var t = this;

			t.editor = ed;

			// Register commands
			ed.addCommand('mceTempla', function(ui) {
				ed.windowManager.open({
					file : url + '/templa.htm',
					width : ed.getParam('templa_popup_width', 750),
					height : ed.getParam('templa_popup_height', 600),
					inline : 1
				}, {
					plugin_url : url
				});
			});

			ed.addCommand('mceInsertTempla', t._insertTempla, t);

			// Register buttons
			ed.addButton('templa', {title : 'templa.desc', cmd : 'mceTempla'});

			//ed.onPreProcess.add(function(ed, o) {
			//});
		},

		getInfo : function() {
			return {
				longname : 'Templa plugin',
				author : 'W.S. Hager',
				authorurl : 'http://lagua.nl',
				infourl : 'http://templa.lagua.nl',
				version : tinymce.majorVersion + "." + tinymce.minorVersion
			};
		},

		_insertTempla : function(ui, v) {
			var t = this, ed = t.editor, h, el, dom = ed.dom, sel = ed.selection.getContent();

			//h = v.content;

			//each(t.editor.getParam('templa_replace_values'), function(v, k) {
			//	if (typeof(v) != 'function')
			//		h = h.replace(new RegExp('\\{\\$' + k + '\\}', 'g'), v);
			//});
			
			// choose function


			ed.execCommand('mceInsertContent', false, v.content);
			ed.addVisual();
		}

	});

	// Register plugin
	tinymce.PluginManager.add('templa', tinymce.plugins.Templa);
})();