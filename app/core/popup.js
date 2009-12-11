/*
This file is part of the JSDot library 
 
http://code.google.com/p/jsdot/

Copyright (c) 2009 Lucia Blondel, Nicos Giuliani, Carlo Vanini

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/	

/** The popup API
 * This defines the functions that are used to provide boxes 
 * with which the user can interact
 */
	

var Popup = new Class();

Popup.prototype = {
	
	doc: null,
	backDiv:null,
	newDiv: null,
	jsdot: null,
	
	/**
	 * Popup constructor
	 * @param {Object} jsdot
	 * @param {Object} parent
	 * @param {Object} type
	 */
	init:function(jsdot, parent, type) {
		this.jsdot = jsdot;
		this.doc = parent.ownerDocument;
		this.backDiv = this.doc.createElement('div');
		this.backDiv.setAttribute('style', 'position:absolute; height:100%; width:100%; opacity: 0.6; background-color:yellow; display: None; z-index:1000');
		this.newDiv = this.doc.createElement('div');
		this.newDiv.setAttribute('style', 'position:absolute; left:10%; top:10%; height:80%; width:80%; background:white; border-color:black; opacity: 1.0; border-width:0.5em; padding:0.4em; display:None; z-index:1000');
		parent.appendChild(this.backDiv);
		parent.appendChild(this.newDiv);
	},
	
	/**
	 * Make visible the popup for inserting/changing and controlling
	 * the JSON string that represents the graph
	 */
	show_JSON:function() {
		this.backDiv.style.display = 'block';
        (this.newDiv).style.display = 'block';
        var self = this;
        
        var text_area = document.createElement("textarea");
		var text_area_attr = {
			id: "text",
			name: "text",
			style: "height:80%; width:100%;"
		};
		text_area.setAttrs(text_area_attr);

        var json = document.createTextNode(this.jsdot.toJSON());
        text_area.appendChild(json);
        this.newDiv.appendChild(text_area);
        
        var p = document.createElement("p");
        
        var save_button = document.createElement("input");
		var save_button_attr = {
			id: "save button",
			value: "load and save",
			type: "submit",
		}
        save_button.setAttrs(save_button_attr);
        save_button.addEventListener("click", function(evt){
            self.load_string(evt);
        }, false);
        
        var exit_button = document.createElement("input");
		var exit_button_attr = {
			id:  "exit button",
			value:  "Exit",
			type: "submit"
		}
   		exit_button.setAttrs(exit_button_attr);
        exit_button.addEventListener("click", function(evt){
            self.hide(evt);
        }, false);
        
        p.appendChild(save_button);
        p.appendChild(exit_button);
        
        this.newDiv.appendChild(p);
	},
	
	/**
	 * Make visible the popup for changing attributes of the node
	 * @param {Object} Node
	 */
	show_attributes:function(node) {
		
		if (typeof node == "string") node = this.jsdot.getNodeByName(node);
		var self = this;
		
		var label = document.createElement("input");
		var label_attr = {
			id:  "label",
			type: "text",
			value: node.getLabel()
		}
   		label.setAttrs(label_attr);
		this.newDiv.innerHTML += "Label ";
		this.newDiv.appendChild(label);
		this.newDiv.innerHTML += "<br />";
		this.newDiv.innerHTML += "Fill color ";
		
		// color 
		var fill_color = document.createElement("select");
		var fill_color_attr = {
			name: "color",
			id : "fill_color"
		};
		fill_color.setAttrs(fill_color_attr);
		
		var current_value = node.getFillColor();
		var current = document.createElement("option");
		var current_attr = {
			value: current_value,
			selected: true
		};
		current.setAttrs(current_attr);
		current.appendChild(document.createTextNode(current_value));
		fill_color.appendChild(current);
		
		var blue = document.createElement("option");
		blue.setAttribute("value", "blue");
		blue.appendChild(document.createTextNode('blue'));
		fill_color.appendChild(blue);
		
		var yellow = document.createElement("option");
		yellow.setAttribute("value", "yellow");
		yellow.appendChild(document.createTextNode('yellow'));
		fill_color.appendChild(yellow);
		
		var red = document.createElement("option");
		red.setAttribute("value", "red");
		red.appendChild(document.createTextNode('red'));
		fill_color.appendChild(red);
		
		var green = document.createElement("option");
		green.setAttribute("value", "green");
		green.appendChild(document.createTextNode('green'));
		fill_color.appendChild(green);
		
		this.newDiv.appendChild(fill_color);
		
		var p = document.createElement("p");
        
        var save_button = document.createElement("input");
		var save_button_attr = {
			id: "change",
			value: "change",
			type: "submit",
		}
        save_button.setAttrs(save_button_attr);
        save_button.addEventListener("click", function(evt){
            self.change_node(evt, node);
        }, false);
        
        var exit_button = document.createElement("input");
		var exit_button_attr = {
			id:  "exit button",
			value:  "Exit",
			type: "submit"
		}
   		exit_button.setAttrs(exit_button_attr);
        exit_button.addEventListener("click", function(evt){
            self.hide(evt);
        }, false);
        
        p.appendChild(save_button);
        p.appendChild(exit_button);
        
        this.newDiv.appendChild(p);
        this.newDiv.style.display = 'block';
		this.backDiv.style.display = 'block';

	},
	
	/**
	 * Hide the popup
	 * @param {Object} evt
	 */	
	hide:function(evt) { 
		(this.backDiv).style.display = 'None';
		(this.newDiv).style.display = 'None';
		var children = this.newDiv.childNodes;
		while(children.length >= 1) {
			this.newDiv.removeChild(this.newDiv.firstChild);
		}
	},
	
	/**
	 * Load the JSON string and hide the popup
	 * @param {Object} evt
	 */
	load_string:function(evt) {
		var content = $('text').value;
		if(content != "") {
			this.jsdot.loadJSON(content);
			// TODO control return value
			this.jsdot.draw();
		}
		var exit_button = $('exit button');
		exit_button.click();	
	},
	
	/**
	 * Change attributes of the Node
	 * @param {Object} evt
	 * @param {Object} Node
	 */
	change_node:function(evt, node) {
		var fill_color = $('fill_color').value;
		var label = $('label').value;
		
		if(label != "") {
			node.setLabel(label);
		}
		node.setFillColor(fill_color);
		
		this.jsdot.draw();
		
		var exit_button = $('exit button');
		exit_button.click();
	}
}