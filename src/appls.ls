$ = module.exports = require "./jquery.js"
	
Model = callable_mixin ->
	@children ?= []
	@model_by_tag ?= []
	@tags = if is_str @tags then [@tags] else @tags ? []
	for key in @tags
		model_by_tag[key] ?= []
		model_by_tag[key].push @
	@element = $("<"+@type+"></"+@type+">")
	@css = @attr = {}
	@data = {}
	$.models.push @
	@update_view = (what,key,val) ->
		return if @[what][key] == val
		if key == \html => @element.html val
		else @element[what] key, val
		@[what][key] = val
	@add = ~>
		if is_str it
			@element.append it
		else
			it.parent = it.P = @
			@element.append it.element
	@clear = ~>
		@children = []
		@element.html ""

	@add `each` @children

	defer ~> 
		if not @parent? then 
			$("body").append @element
	@delete = ->
		map (.delete), @children
		@element.remove!
	@draw = ->
		d = @data
		for key in <[src id href target value alt type rows cols]>
			@update_view \attr key, d[key]! if d[key]?
		@update_view \css \position \absolute if d.x? or d.y?
		@update_view \css \left, 			d.x! if d.x?
		@update_view \css \top, 			d.y! if d.y?
		@update_view \css \width, 			d.w! - d.bx! - d.bX! - d.px! - d.pX! - d.mx! - d.mX! if d.w?
		@update_view \css \height, 			d.h! - d.by! - d.bY! - d.py! - d.pY! - d.my! - d.mY! if d.h?
		@update_view \css \border-radius,	d.br! if d.br?
		@update_view \css \border-left,		d.bx! + "px " + d.bxs! + " " + d.bxc!
		@update_view \css \border-right,	d.bX! + "px " + d.bXs! + " " + d.bXc!
		@update_view \css \border-top,		d.by! + "px " + d.bys! + " " + d.byc!
		@update_view \css \border-bottom,	d.bY! + "px " + d.bYs! + " " + d.bYc!
		@update_view \css \margin-left,		d.mx!
		@update_view \css \margin-right,	d.mX!
		@update_view \css \margin-top,		d.my!
		@update_view \css \margin-bottom,	d.mY!
		@update_view \css \padding-left,	d.px!
		@update_view \css \padding-right,	d.pX!
		@update_view \css \padding-top,		d.py!
		@update_view \css \padding-bottom,	d.pY!
		@update_view \css \color,			d.c! if d.c?
		@update_view \css \cursor,			d.cursor! if d.cursor?
		@update_view \css \box-shadow,		d.shadow! if d.shadow?
		@update_view \css \-moz-box-shadow,		d.shadow! if d.shadow?
		@update_view \css \-webkit-box-shadow,	d.shadow! if d.shadow?
		@update_view \css \background-color,d.bgc! if d.bgc?
		@update_view \css \background-image,d.bgi! if d.bgi?
		@update_view \css \font-family,		d.font! if d.font?
		@update_view \css \font-size,		d.size! if d.size?
		@update_view \css \text-align,		d.align! if d.align?
		@update_view \css \font-weight,		d.weight! if d.weight?
		@update_view \css \display,			d.display! if d.display?
		#@update_view \css \visibility,		if d.hide! then \hidden else \visible

		for key in <[-moz_user-select -khtml-user-select -webkit-user-select -o-user-select user-select]>
			@update_view \css key,			"none" if not d.selectable!
		#@update_view \attr \onclick,		-> -> log "aff"
		if d.html?
			@update_view \attr \html d.html!
		else
			for child in @children 
				child.draw?.apply child

	# TODO / refactoring: remove this and have only @set
	@new_attr = (attr,default_) ->
		if default_? 
			@data[attr] = as_fn default_, @
		@[attr] = (val) ~>
			if val?
				if default_ == \callback
					let self = @
						@element[attr] -> val.apply self
				else
					@data[attr] = as_fn val, @
					@
			else 
				(@data[attr] ? @auto[attr])!
	
	@call = (attrs) ->
		for key,val of attrs
			if not @[key]? then 
				@new_attr key, val
			@[key] val

	@auto =
		x: ~> @element.offset!.left
		y: ~> @element.offset!.top
		w: ~> @element.width!
		h: ~> @element.height!
		val: ~> @element.val!
		html: ~> @element.html!

	for attr,default_ of {
		x:void, y:void,
		w:void, h:void, 
		bgc:void, bgi:void, font:void, size:void, weight:void, display:void,
		br:0,
		bx:0, bxs:\solid, bxc:\black,
		by:0, bys:\solid, byc:\black,
		bX:0, bXs:\solid, bXc:\black,
		bY:0, bYs:\solid, bYc:\black,
		px:0, pxs:\solid, pxc:\black,
		py:0, pys:\solid, pyc:\black,
		pX:0, pXs:\solid, pXc:\black,
		pY:0, pYs:\solid, pYc:\black,
		mx:0, mxs:\solid, mxc:\black,
		my:0, mys:\solid, myc:\black,
		mX:0, mXs:\solid, mXc:\black,
		mY:0, mYs:\solid, mYc:\black,
		shadow:"",
		src:"", href:"", target:"", value:"", alt:"", type:"",
		#hide:false,
		rows:void, cols:void,
		val:void,
		html:void,
		selectable:true,
		cursor:"default",
		c:\black,
		align:void,
		click:\callback
		keypress:\callback
		keyup:\callback
	} => @new_attr attr, default_
	
	@derive = (attr,fn,inv) ~> ~>
		# defines an attr that depends on other
		# for example, X is (x + w)
		# it needs to be feed the reverse of the transformation
		# this allows much cleaner definitions of those attrs
		# wtf am I doing with my life
		if it? => (let val = as_fn(it,@) => attr ~> inv.call @, val!)
		else fn.call @, attr!
	@balance_children_margins = ~>
		for i from 0 to @children.length - 2
			@children[i].mX -> @P.empty_space! / (@P.children.length - 1)

	@element.mouseenter ~> @is_mouse_over = true
	@element.mouseleave ~> @is_mouse_over = false
	hide: ~> @element.hide!
	show: ~> @element.show!
	is_mouse_over: false
	empty_space: ~> @w! - sum (map (.w!)) @children
	X: 		@derive @w, (+ @x!), (- @x!)			# end x
	Y: 		@derive @h, (+ @y!), (- @y!)			# end y
	cx: 	@derive @x, (+ @w!*0.5), (- @w!*0.5)	# center x
	cy: 	@derive @y, (+ @h!*0.5), (- @h!*0.5)	# center y
	rx:		@derive @x, (/ @P.w!), (* @P.w!)		# x relative to parent w, from 0 to 1
	ry:		@derive @y, (/ @P.h!), (* @P.h!)		# y relative to parent h, from 0 to 1
	rw:		@derive @w, (/ @P.w!), (* @P.w!)		# w relative to parent w, from 0 to 1
	rh:		@derive @h, (/ @P.h!), (* @P.h!)		# h relative to parent h, from 0 to 1
	rX: 	@derive @w, (-> (it + @x!) / @P.w!), (-> (it * @P.w!) - @x!)			# end x relative to parent w, from 0 to 1
	rY: 	@derive @h, (-> (it + @y!) / @P.h!), (-> (it * @P.h!) - @y!)			# end y relative to parent h, from 0 to 1
	rcx: 	@derive @x, (-> (it + @w!*0.5) / @P.w!), (-> (it * @P.w!) - @w!*0.5)	# center x relative to parent w, from 0 to 1
	rcy: 	@derive @y, (-> (it + @h!*0.5) / @P.h!), (-> (it * @P.h!) - @h!*0.5)	# center x relative to parent h, from 0 to 1
	iw: 	@derive @w, (- (@bx! + @bX! + @mx! + @mX! + @px! + @pX!)), (+ (@bx! + @bX! + @mx! + @mX! + @px! + @pX!)) # inner width
	ih: 	@derive @h, (- (@by! + @bY! + @my! + @mY! + @py! + @pY!)), (+ (@by! + @bY! + @my! + @mY! + @py! + @pY!)) # inner height
	box: 	-> @x it[0]; @y it[1]; @w it[2]; @h it[3];
	area: 	-> @x it[0]; @y it[1]; @X it[2]; @Y it[3];
	b: 		-> multi_call [@bx, @by, @bX, @bY], 	it
	bc: 	-> multi_call [@bxc, @byc, @bXc, @bYc], it
	p: 		-> multi_call [@px, @py, @pX, @pY], 	it
	pc: 	-> multi_call [@pxc, @pyc, @pXc, @pYc], it
	ps: 	-> multi_call [@pxs, @pys, @pXs, @pYs], it
	m: 		-> multi_call [@mx, @my, @mX, @mY], 	it
	mc: 	-> multi_call [@mxc, @myc, @mXc, @mYc], it
	ms: 	-> multi_call [@mxs, @mys, @mXs, @mYs], it


/*global.text_width = (text,font = '12px arial') ->
	o = $('<div>' + this + '</div>')
		.css do
			position:\absolute
			float:\left
			white-space:nowrap 
			visibility:\hidden
			font:font
		.appendTo $('body')
	w = o.width!
	o.remove!
	w
*/

global.w = 
	w: -> $(window).width!
	h: -> $(window).height!

global.ww = -> $(window).width!
global.wh = -> $(window).height!

model_by_tag = {}
$.models = []
global.G = (tag,filt) ->
	models = [model for model in model_by_tag[tag] when (filt ? (->true)).apply model]
	fn = (map) ->
		for model in models 
			model.call map
	for key of models[0] => let key=key
		fn[key] = -> 
			for model in models
				ret = model[key] it
			ret
	fn.element = models[0].element
	fn.P = models[0].P
	fn
		
global.body = 
	element: ($ \body)
	w: -> @element.width!
	h: -> @element.height!

<[a textarea div span img input p li canvas]> |> map (type) ->
	global[type] = (...args) ->
		tags = if is_str args[0] then args.shift!.split "." else []
		attrs = if typeof args[0] == \object then args.shift! else {}
		children = args
		model = Model tags:tags, type:type, children:children
		log ".....",tags,attrs,children
		model.call attrs
		model

window.processing = (attrs) ->
	cvs = canvas attrs
	attrs.setup ?= (->)
	attrs.draw ?= (->) 
	new Processing cvs.element.get(0), (processing) -> 
		processing.setup = -> 
			attrs.setup.call processing
		processing.draw = ->
			processing.size cvs.w!, cvs.h!
			attrs.draw.call processing
	cvs

as_fn = (val,bind) -> (if is_fn val then val else (->val)).bind(bind)

window.requestAnimationFrame = 
	window.requestAnimationFrame || 
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	window.oRequestAnimationFrame ||
	window.msRequestAnimationFrame ||
	(global.native_anim = false; (-> setTimeout it, 1000/100))
$.refresh = ->
	for model in $.models
		model.draw!
last_time = Date.now!/1000
animate = ->
	$.refresh (Date.now!/1000 - last_time)
	last_time := Date.now!/1000
	window.requestAnimationFrame animate
animate!
$("body").css padding:0, margin:0

	




