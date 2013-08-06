require("viclib")();
(function(){
  var $, Model, model_by_tag, as_fn, last_time, animate, slice$ = [].slice;
  $ = module.exports = require("./jquery.js");
  Model = callable_mixin(function(){
    var ref$, i$, len$, key, attr, default_, this$ = this;
    this.children == null && (this.children = []);
    this.model_by_tag == null && (this.model_by_tag = []);
    this.tags = is_str(this.tags)
      ? [this.tags]
      : (ref$ = this.tags) != null
        ? ref$
        : [];
    for (i$ = 0, len$ = (ref$ = this.tags).length; i$ < len$; ++i$) {
      key = ref$[i$];
      model_by_tag[key] == null && (model_by_tag[key] = []);
      model_by_tag[key].push(this);
    }
    this.element = $("<" + this.type + "></" + this.type + ">");
    this.css = this.attr = {};
    this.data = {};
    $.models.push(this);
    this.update_view = function(what, key, val){
      if (this[what][key] === val) {
        return;
      }
      if (key === 'html') {
        this.element.html(val);
      } else {
        this.element[what](key, val);
      }
      return this[what][key] = val;
    };
    this.add = function(it){
      if (is_str(it)) {
        return this$.element.append(it);
      } else {
        it.parent = it.P = this$;
        return this$.element.append(it.element);
      }
    };
    this.clear = function(){
      this$.children = [];
      return this$.element.html("");
    };
    each(this.add, this.children);
    defer(function(){
      if (this$.parent == null) {
        return $("body").append(this$.element);
      }
    });
    this['delete'] = function(){
      map(function(it){
        return it['delete'];
      }, this.children);
      return this.element.remove();
    };
    this.draw = function(){
      var d, i$, ref$, len$, key, child, ref1$, results$ = [];
      d = this.data;
      for (i$ = 0, len$ = (ref$ = ['src', 'id', 'href', 'target', 'value', 'alt', 'type', 'rows', 'cols']).length; i$ < len$; ++i$) {
        key = ref$[i$];
        if (d[key] != null) {
          this.update_view('attr', key, d[key]());
        }
      }
      if (d.x != null || d.y != null) {
        this.update_view('css', 'position', 'absolute');
      }
      if (d.x != null) {
        this.update_view('css', 'left', d.x());
      }
      if (d.y != null) {
        this.update_view('css', 'top', d.y());
      }
      if (d.w != null) {
        this.update_view('css', 'width', d.w() - d.bx() - d.bX() - d.px() - d.pX() - d.mx() - d.mX());
      }
      if (d.h != null) {
        this.update_view('css', 'height', d.h() - d.by() - d.bY() - d.py() - d.pY() - d.my() - d.mY());
      }
      if (d.br != null) {
        this.update_view('css', 'border-radius', d.br());
      }
      this.update_view('css', 'border-left', d.bx() + "px " + d.bxs() + " " + d.bxc());
      this.update_view('css', 'border-right', d.bX() + "px " + d.bXs() + " " + d.bXc());
      this.update_view('css', 'border-top', d.by() + "px " + d.bys() + " " + d.byc());
      this.update_view('css', 'border-bottom', d.bY() + "px " + d.bYs() + " " + d.bYc());
      this.update_view('css', 'margin-left', d.mx());
      this.update_view('css', 'margin-right', d.mX());
      this.update_view('css', 'margin-top', d.my());
      this.update_view('css', 'margin-bottom', d.mY());
      this.update_view('css', 'padding-left', d.px());
      this.update_view('css', 'padding-right', d.pX());
      this.update_view('css', 'padding-top', d.py());
      this.update_view('css', 'padding-bottom', d.pY());
      if (d.c != null) {
        this.update_view('css', 'color', d.c());
      }
      if (d.cursor != null) {
        this.update_view('css', 'cursor', d.cursor());
      }
      if (d.shadow != null) {
        this.update_view('css', 'box-shadow', d.shadow());
      }
      if (d.shadow != null) {
        this.update_view('css', '-moz-box-shadow', d.shadow());
      }
      if (d.shadow != null) {
        this.update_view('css', '-webkit-box-shadow', d.shadow());
      }
      if (d.bgc != null) {
        this.update_view('css', 'background-color', d.bgc());
      }
      if (d.bgi != null) {
        this.update_view('css', 'background-image', d.bgi());
      }
      if (d.font != null) {
        this.update_view('css', 'font-family', d.font());
      }
      if (d.size != null) {
        this.update_view('css', 'font-size', d.size());
      }
      if (d.align != null) {
        this.update_view('css', 'text-align', d.align());
      }
      if (d.weight != null) {
        this.update_view('css', 'font-weight', d.weight());
      }
      if (d.display != null) {
        this.update_view('css', 'display', d.display());
      }
      for (i$ = 0, len$ = (ref$ = ['-moz_user-select', '-khtml-user-select', '-webkit-user-select', '-o-user-select', 'user-select']).length; i$ < len$; ++i$) {
        key = ref$[i$];
        if (!d.selectable()) {
          this.update_view('css', key, "none");
        }
      }
      if (d.html != null) {
        return this.update_view('attr', 'html', d.html());
      } else {
        for (i$ = 0, len$ = (ref$ = this.children).length; i$ < len$; ++i$) {
          child = ref$[i$];
          results$.push((ref1$ = child.draw) != null ? ref1$.apply(child) : void 8);
        }
        return results$;
      }
    };
    this.new_attr = function(attr, default_){
      var this$ = this;
      if (default_ != null) {
        this.data[attr] = as_fn(default_, this);
      }
      return this[attr] = function(val){
        var ref$;
        if (val != null) {
          if (default_ === 'callback') {
            return (function(self){
              return this.element[attr](function(){
                return val.apply(self);
              });
            }.call(this$, this$));
          } else {
            this$.data[attr] = as_fn(val, this$);
            return this$;
          }
        } else {
          return ((ref$ = this$.data[attr]) != null
            ? ref$
            : this$.auto[attr])();
        }
      };
    };
    this.call = function(attrs){
      var key, val, results$ = [];
      for (key in attrs) {
        val = attrs[key];
        if (this[key] == null) {
          this.new_attr(key, val);
        }
        results$.push(this[key](val));
      }
      return results$;
    };
    this.auto = {
      x: function(){
        return this$.element.offset().left;
      },
      y: function(){
        return this$.element.offset().top;
      },
      w: function(){
        return this$.element.width();
      },
      h: function(){
        return this$.element.height();
      },
      val: function(){
        return this$.element.val();
      },
      html: function(){
        return this$.element.html();
      }
    };
    for (attr in ref$ = {
      x: void 8,
      y: void 8,
      w: void 8,
      h: void 8,
      bgc: void 8,
      bgi: void 8,
      font: void 8,
      size: void 8,
      weight: void 8,
      display: void 8,
      br: 0,
      bx: 0,
      bxs: 'solid',
      bxc: 'black',
      by: 0,
      bys: 'solid',
      byc: 'black',
      bX: 0,
      bXs: 'solid',
      bXc: 'black',
      bY: 0,
      bYs: 'solid',
      bYc: 'black',
      px: 0,
      pxs: 'solid',
      pxc: 'black',
      py: 0,
      pys: 'solid',
      pyc: 'black',
      pX: 0,
      pXs: 'solid',
      pXc: 'black',
      pY: 0,
      pYs: 'solid',
      pYc: 'black',
      mx: 0,
      mxs: 'solid',
      mxc: 'black',
      my: 0,
      mys: 'solid',
      myc: 'black',
      mX: 0,
      mXs: 'solid',
      mXc: 'black',
      mY: 0,
      mYs: 'solid',
      mYc: 'black',
      shadow: "",
      src: "",
      href: "",
      target: "",
      value: "",
      alt: "",
      type: "",
      rows: void 8,
      cols: void 8,
      val: void 8,
      html: void 8,
      selectable: true,
      cursor: "default",
      c: 'black',
      align: void 8,
      click: 'callback',
      keypress: 'callback',
      keyup: 'callback'
    }) {
      default_ = ref$[attr];
      this.new_attr(attr, default_);
    }
    this.derive = function(attr, fn, inv){
      return function(it){
        if (it != null) {
          return (function(val){
            var this$ = this;
            return attr(function(){
              return inv.call(this$, val());
            });
          }.call(this$, as_fn(it, this$)));
        } else {
          return fn.call(this$, attr());
        }
      };
    };
    this.balance_children_margins = function(){
      var i$, to$, i, results$ = [];
      for (i$ = 0, to$ = this$.children.length - 2; i$ <= to$; ++i$) {
        i = i$;
        results$.push(this$.children[i].mX(fn$));
      }
      return results$;
      function fn$(){
        return this.P.empty_space() / (this.P.children.length - 1);
      }
    };
    this.element.mouseenter(function(){
      return this$.is_mouse_over = true;
    });
    this.element.mouseleave(function(){
      return this$.is_mouse_over = false;
    });
    return {
      hide: function(){
        return this$.element.hide();
      },
      show: function(){
        return this$.element.show();
      },
      is_mouse_over: false,
      empty_space: function(){
        return this$.w() - sum(map(function(it){
          return it.w();
        })(this$.children));
      },
      X: this.derive(this.w, (function(it){
        return it + this.x();
      }), (function(it){
        return it - this.x();
      })),
      Y: this.derive(this.h, (function(it){
        return it + this.y();
      }), (function(it){
        return it - this.y();
      })),
      cx: this.derive(this.x, (function(it){
        return it + this.w() * 0.5;
      }), (function(it){
        return it - this.w() * 0.5;
      })),
      cy: this.derive(this.y, (function(it){
        return it + this.h() * 0.5;
      }), (function(it){
        return it - this.h() * 0.5;
      })),
      rx: this.derive(this.x, (function(it){
        return it / this.P.w();
      }), (function(it){
        return it * this.P.w();
      })),
      ry: this.derive(this.y, (function(it){
        return it / this.P.h();
      }), (function(it){
        return it * this.P.h();
      })),
      rw: this.derive(this.w, (function(it){
        return it / this.P.w();
      }), (function(it){
        return it * this.P.w();
      })),
      rh: this.derive(this.h, (function(it){
        return it / this.P.h();
      }), (function(it){
        return it * this.P.h();
      })),
      rX: this.derive(this.w, function(it){
        return (it + this.x()) / this.P.w();
      }, function(it){
        return it * this.P.w() - this.x();
      }),
      rY: this.derive(this.h, function(it){
        return (it + this.y()) / this.P.h();
      }, function(it){
        return it * this.P.h() - this.y();
      }),
      rcx: this.derive(this.x, function(it){
        return (it + this.w() * 0.5) / this.P.w();
      }, function(it){
        return it * this.P.w() - this.w() * 0.5;
      }),
      rcy: this.derive(this.y, function(it){
        return (it + this.h() * 0.5) / this.P.h();
      }, function(it){
        return it * this.P.h() - this.h() * 0.5;
      }),
      iw: this.derive(this.w, (function(it){
        return it - (this.bx() + this.bX() + this.mx() + this.mX() + this.px() + this.pX());
      }), (function(it){
        return it + (this.bx() + this.bX() + this.mx() + this.mX() + this.px() + this.pX());
      })),
      ih: this.derive(this.h, (function(it){
        return it - (this.by() + this.bY() + this.my() + this.mY() + this.py() + this.pY());
      }), (function(it){
        return it + (this.by() + this.bY() + this.my() + this.mY() + this.py() + this.pY());
      })),
      box: function(it){
        this.x(it[0]);
        this.y(it[1]);
        this.w(it[2]);
        return this.h(it[3]);
      },
      area: function(it){
        this.x(it[0]);
        this.y(it[1]);
        this.X(it[2]);
        return this.Y(it[3]);
      },
      b: function(it){
        return multi_call([this.bx, this.by, this.bX, this.bY], it);
      },
      bc: function(it){
        return multi_call([this.bxc, this.byc, this.bXc, this.bYc], it);
      },
      p: function(it){
        return multi_call([this.px, this.py, this.pX, this.pY], it);
      },
      pc: function(it){
        return multi_call([this.pxc, this.pyc, this.pXc, this.pYc], it);
      },
      ps: function(it){
        return multi_call([this.pxs, this.pys, this.pXs, this.pYs], it);
      },
      m: function(it){
        return multi_call([this.mx, this.my, this.mX, this.mY], it);
      },
      mc: function(it){
        return multi_call([this.mxc, this.myc, this.mXc, this.mYc], it);
      },
      ms: function(it){
        return multi_call([this.mxs, this.mys, this.mXs, this.mYs], it);
      }
    };
  });
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
  global.w = {
    w: function(){
      return $(window).width();
    },
    h: function(){
      return $(window).height();
    }
  };
  global.ww = function(){
    return $(window).width();
  };
  global.wh = function(){
    return $(window).height();
  };
  model_by_tag = {};
  $.models = [];
  global.G = function(tag, filt){
    var models, res$, i$, ref$, len$, model, fn, key;
    res$ = [];
    for (i$ = 0, len$ = (ref$ = model_by_tag[tag]).length; i$ < len$; ++i$) {
      model = ref$[i$];
      if ((filt != null
        ? filt
        : fn$).apply(model)) {
        res$.push(model);
      }
    }
    models = res$;
    fn = function(map){
      var i$, ref$, len$, model, results$ = [];
      for (i$ = 0, len$ = (ref$ = models).length; i$ < len$; ++i$) {
        model = ref$[i$];
        results$.push(model.call(map));
      }
      return results$;
    };
    for (key in models[0]) {
      (fn1$.call(this, key));
    }
    fn.element = models[0].element;
    fn.P = models[0].P;
    return fn;
    function fn$(){
      return true;
    }
    function fn1$(key){
      fn[key] = function(it){
        var i$, ref$, len$, model, ret;
        for (i$ = 0, len$ = (ref$ = models).length; i$ < len$; ++i$) {
          model = ref$[i$];
          ret = model[key](it);
        }
        return ret;
      };
    }
  };
  global.body = {
    element: $('body'),
    w: function(){
      return this.element.width();
    },
    h: function(){
      return this.element.height();
    }
  };
  map(function(type){
    return global[type] = function(){
      var args, tags, attrs, children, model;
      args = slice$.call(arguments);
      tags = is_str(args[0])
        ? args.shift().split(".")
        : [];
      attrs = typeof args[0] === 'object'
        ? args.shift()
        : {};
      children = args;
      model = Model({
        tags: tags,
        type: type,
        children: children
      });
      log(".....", tags, attrs, children);
      model.call(attrs);
      return model;
    };
  })(
  ['a', 'textarea', 'div', 'span', 'img', 'input', 'p', 'li', 'canvas']);
  window.processing = function(attrs){
    var cvs;
    cvs = canvas(attrs);
    attrs.setup == null && (attrs.setup = function(){});
    attrs.draw == null && (attrs.draw = function(){});
    new Processing(cvs.element.get(0), function(processing){
      processing.setup = function(){
        return attrs.setup.call(processing);
      };
      return processing.draw = function(){
        processing.size(cvs.w(), cvs.h());
        return attrs.draw.call(processing);
      };
    });
    return cvs;
  };
  as_fn = function(val, bind){
    return (is_fn(val)
      ? val
      : function(){
        return val;
      }).bind(bind);
  };
  window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || (global.native_anim = false, function(it){
    return setTimeout(it, 1000 / 100);
  });
  $.refresh = function(){
    var i$, ref$, len$, model, results$ = [];
    for (i$ = 0, len$ = (ref$ = $.models).length; i$ < len$; ++i$) {
      model = ref$[i$];
      results$.push(model.draw());
    }
    return results$;
  };
  last_time = Date.now() / 1000;
  animate = function(){
    $.refresh(Date.now() / 1000 - last_time);
    last_time = Date.now() / 1000;
    return window.requestAnimationFrame(animate);
  };
  animate();
  $("body").css({
    padding: 0,
    margin: 0
  });
}).call(this);
