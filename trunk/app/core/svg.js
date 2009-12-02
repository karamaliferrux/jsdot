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


var svgns = "http://www.w3.org/2000/svg";
var xlinkns = "http://www.w3.org/1999/xlink";	
var xmlns = "http://www.w3.org/2000/svg";
var xlink = "http://www.w3.org/1999/xlink";

function $e(i){ return document.createElementNS(xmlns, i); }
function $(i) { return document.getElementById(i); };
function Class(){ return function(arguments){ this.init(arguments); } }
function setAttrs(obj, values){ for (i in values) { obj.setAttributeNS(null, i, values[i]); } }
function randColor(){ return "rgb(" + parseInt(Math.random() * 255) + "," + parseInt(Math.random() * 255) + "," + parseInt(Math.random() * 255) + ")"; }

var JSVG = new Class();

JSVG.prototype = {

	root: null,
	designArea:null,
	coords:null,
	selected: null,

	/** Constructor */
	init: function(id){

		this.container = $(id);
		this.svgdoc = this.container.ownerDocument;
		this.svgroot = this.svgdoc.createElementNS(svgns, "svg");
		
		this.svgroot.setAttribute("width", window.innerWidth - 5);
		this.svgroot.setAttribute("height", window.innerHeight - 5);
		this.svgroot.setAttribute("id", "svgroot");
		this.svgroot.setAttribute("xmlns", svgns);
		this.svgroot.setAttribute("xmlns:xlink", xlinkns);
		this.container.appendChild(this.svgroot);
		
		this.root = this.svgroot;
		JSVG.root = this.root;
		
		this.firstClick = false;
		this.coords = this.root.createSVGPoint();
     	this.grabPoint = this.root.createSVGPoint();

		this.buildMenu();
		this.buildDesignArea();
		
	},
	
	/** Builds the design area and adds event listeners. */
	buildDesignArea: function(){

		var self = this;

		this.designArea = new this.Element('rect', { "height": "100%", "width": "85%", "x": "15%", "y": 0, "fill": "#eee", "id": "designArea" });
		
		// Drag and drop listeners
		this.designArea.addEventListener('mousemove', function(evt){ self.drag(evt); },false);
		this.designArea.addEventListener('mouseup', function(evt){ self.drop(evt); },false);

		// Add elements listener
		this.designArea.addEventListener('click',function(evt){ self.drawElement(evt); },false);
					
	},
	
	/**
	 * Draw an element depending on the selected form
	 * @param {Object} evt
	 */
	drawElement: function(evt){
	
		var self = this, newElement;
		if(!this.selected || !this.selected.name) return;
		
		switch(this.selected.name) {
			
			// Creates a rectangle in the design area
			case 'rect':
			
				newElement = new this.Element('rect', {
					"height": "5em",
					"width": "5em",
					"x": evt.clientX,
					"y": evt.clientY,
					"fill": "#ff0000"
				});
				
			break;
			
			// Creates a circle in the design area
			case 'circle':
			
				newElement = new this.Element('circle', {
					"r": "2.5em",
					"cx": evt.clientX,
					"cy": evt.clientY,
					"fill": "#ddd",
					"stroke": "#000"
				
				})
				/**
				 * Needs to find a solution to have different event and function associated
				.addEventListener('click', function(evt){ 
				
					if (self.selected && self.selected.name == 'arrow') {
						self.drawElement(evt);
					}
				}, false);
				**/
			
			break;


			// Creates an arrow between two nodes
			case 'arrow':
				
				if (!this.firstClick) {
					this.x1 = evt.clientX;
					this.y1 = evt.clientY;
					this.firstClick = true;
					return;
				}
				
				new this.Element('line', {
					"x1": this.x1,
					"y1": this.y1,
					"x2": evt.clientX,
					"y2": evt.clientY,
					"style": "fill:none;stroke:black;stroke-width:1;"
				});
				
				this.firstClick = false;
								
			break;
		}
		
		if(newElement) newElement.addEventListener('mousedown', function(evt){ self.grab(evt); }, false);
	},

	/**
	 * Set the element to be dragged.
	 * @param {Object} evt
	 */
	grab: function(evt){

		var targetElement = evt.target;
		
		if (this.designArea != targetElement) {

			this.selected = targetElement;
			setAttrs(targetElement, {"fill-opacity": 0.5});
							
			// Calculates the element's coords
            var transMatrix = targetElement.getCTM();
			this.getCoords(evt);
            this.grabPoint.x = this.coords.x - Number(transMatrix.e);
            this.grabPoint.y = this.coords.y - Number(transMatrix.f);
			
			// Set out target
			this.dragElement = targetElement;
			this.dragElement.setAttributeNS(null, 'pointer-events', 'none');

		}
	},

	/**
	 * Drag the element throught the design area
	 * @param {Object} evt
	 */
	drag: function(evt){

         if (this.dragElement) {
		 	this.getCoords(evt);
            var newX = this.coords.x - this.grabPoint.x;
       		var newY = this.coords.y - this.grabPoint.y;
            this.dragElement.setAttributeNS(null, 'transform', 'translate(' + newX + ',' + newY + ')');
         }
	},

	/**
	 * Drop the element after mouseup event
	 * @param {Object} evt
	 */
	drop: function(evt){

		if (this.dragElement != null) {

			// Set the selected style
			setAttrs(this.selected, {"fill-opacity": 1});
			
			this.dragElement.setAttributeNS(null, 'pointer-events', 'all');
			this.dragElement = null; this.selected = null;
		} 
	},
	
	/**
	 * Get and set the true coordinates
	 * @param {Object} evt
	 */
	getCoords: function(evt){
		
		var scale = this.root.currentScale, translation = this.root.currentTranslate;
		
		this.coords.x = (evt.clientX - translation.x) / scale;
		this.coords.y = (evt.clientY - translation.y) / scale;
	},

	/** Builds the left menu, buttons and all listeners */
	buildMenu: function(){

		var self = this; this.toggle = false; this.cnt;
		
		this.cnt = new this.Element('g', { 'id': 'leftMenu', 'width':'20%', 'height':'100%' });			
		this.bg = new this.Element('rect',{ "height": "100%", "width": "100%", "x": 0, "y": 0, "fill": "#333"},this.cnt);

		// <-- Rectangle button
		new this.Element('rect',{
			
			"height": "5em",
			"width": "5em",
			"x": ".5em",
			"y": ".5em",
			'stroke': 'red',
			"fill": "#ddd",
			"style":"cursor:pointer"
			
		}, this.cnt).addEventListener('click',function(evt){
			
			if (self.selected) {
				setAttrs(self.selected.obj, {
					'stroke': 'red'
				});
			}
			// Select the object
			self.selected = {
				name: 'rect',
				obj: this
			};
			setAttrs(this, {"stroke": "yellow"});
			
		},false);		
		// -->

		// <-- Circle button
		new this.Element('circle', {
			"r": "2.5em",
			"cx": "9.5em",
			"cy": "3em",
			"fill": "#ddd",
			"fill-opacity": 0.85,
			"stroke": "red",
			"stroke-opacity": 0.85,
			"style":"cursor:pointer"
			
		}, this.cnt).addEventListener('click',function(evt){
			
			if (self.selected) {
				setAttrs(self.selected.obj, { 'stroke': 'red' });
			}
			// Select the object
			self.selected = {
				name: 'circle',
				obj: this
			};
			setAttrs(this, { "stroke": "yellow" });
			
		},false);	
		// -->


		// <-- Arrow button
		new this.Element('line', {
		
			"x1": ".5em",
			"y1": "8em",
			"x2": "5em",
			"y2": "12em",
			"style": "fill:none;stroke:red;fill:#ddd;stroke-width:.2em;cursor:pointer;"

		}, this.cnt).addEventListener('click',function(evt){
			
			if (self.selected) {
				setAttrs(self.selected.obj, { 'stroke': 'red' });
			}
			// Select the object
			self.selected = {
				name: 'arrow',
				obj: this
			};
			setAttrs(this, { "stroke": "yellow" });
			
		},false);	
		// -->

		// --> Toggle menu bar
		new this.Element('rect',{
			
			"height": "100%",
			"width": ".3%",
			"x": "14.7%",
			"y": 0,
			"fill": "#222",
			"id": "toggle",
			"style":"cursor:pointer"
			
		},this.cnt).addEventListener('click',function(){ 
			
			setAttrs(self.cnt,{'x':'-15%'});

		},false);
		// <--
	},

	/**
	 * Creates and append an element
	 * @param {String} element
	 * @param {Object} attrs
	 * @param {Object} target (Optional)
	 */
	Element: function(element, attrs){

	    var el = $e(element);
	    setAttrs(el, attrs);
	    arguments[2] ? arguments[2].appendChild(el) : JSVG.root.appendChild(el);
		
		return el;
	}
}
