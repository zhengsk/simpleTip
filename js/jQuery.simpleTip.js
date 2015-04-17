// JavaScript Document
/*!
 * @plugin name : simpleTip
 * @author zsk
 * @version 1.1 
 * @require jQuery
 * 时间：20150417
 */

(function ($){

	$.fn.simpleTip = function (options, value){

		if($.type(options) == "string"){
			switch (options){
				case "show" : 
					return this.each(function(){
						this.tipEle && oToolTip.show.call(this);
					});
					break;
				case "hide" :
					return this.each(function(){
						this.tipEle && oToolTip.hide.call(this);
					});
					break;
				case "destroy" :
					return this.each(function(){
						this.tipEle && oToolTip.destroy(this);
					});
					break;
				case "content" :
					return this.each(function(){
						this.tipEle && this.tipEle.tipContent.html(value || '');
						oToolTip.setPosition(this); // 如果已经显示则刷新位置
					});
					break;
				case "position" :
					return this.each(function(){
						if(this.tipEle){
							value && (this.tipOptions = $.extend({}, this.tipOptions)) && (this.tipOptions.position = value);
							oToolTip.setPosition(this);
						}
					});
					break;
				case "follow" :
					return this.each(function(){
						if(this.tipEle){
							value && (this.tipOptions = $.extend({}, this.tipOptions)) && (this.tipOptions.follow = value);
						}
					});
					break;
			}
			return;
		}

		var _opts = $.extend( true, {}, $.fn.simpleTip.defaults, options);
		return this.each(function(){
			var target = this;
			if(this.tipOptions){ //如果已经存在则注销，在重新创建
				$(this).simpleTip('destroy');
			}

			this.tipOptions = _opts;
			this.tipEle = oToolTip.createTip(this); //为参数对象创建tooltip
			this.isShowed = false;

			// 绑定显示tooltip和隐藏tooltip的方法
			$(this).on(this.tipOptions.show.action, oToolTip.show);
			$(this).on(this.tipOptions.hide.action, oToolTip.hide);

			if(this.tipOptions.keep){	// 鼠标移上去保持显示
				this.tipEle.on('mouseenter',function(){
					if(target.timeoutToogle){
						clearTimeout(target.timeoutToogle);
					};
					oToolTip.show.call(target);
				});
				this.tipEle.on('mouseleave',function(){
					if(target.timeoutToogle){
						clearTimeout(target.timeoutToogle);
					};
					oToolTip.hide.call(target);
				});
			}

		});
	}

	//为参数设置默认值
	$.fn.simpleTip.defaults = {
		content : "I'm a tooltip!"
		,show : {
			action : 'mouseenter'
			,delay : 0
			,animate : false
		}
		,hide : {
			action : 'mouseleave'
			,delay : 0
			,animate : false
		}
		,position: 'right'		// tip 位置
		,spacing : 2			// tip 间距
		,offset: {x:0, y:0}		// 定位偏移
		,follow : false			// 跟随鼠标
		,keep : true 			// 鼠标移上去保持显示
		,events	 : {
			beforeShow : false
			,beforeHide : false
			,afterShow : false
			,afterHide : false
		}
	};
	
	var oToolTip = {

		//创建DIV
		createTip: function(obj){
			var oText = $.parseHTML(obj.tipOptions.content);	// 创建一个内容为content的文本节点
			var tipEle = $('<div></div>').addClass("simpleTip-wrapper");	// 为tooltip设置class,并将tooltip标签追加到文档中
			var tipArrow = $('<span class="simpleTip-arrow"></span>');	// 为tooltip 方向箭头
			var tipContent = tipEle.tipContent = $('<div class="simpleTip-content"></div>').append($(oText));	// 内容容器
			tipEle.append(tipArrow).append(tipContent).appendTo('body');
			return tipEle;
		}

		//定位
		,setPosition: function(obj){
			if(obj.tipOptions.follow){return;} // 跟随鼠标
			
			var tipEle = obj.tipEle;
			var position = obj.tipOptions.position;
			var offset = obj.tipOptions.offset;
			var spacing = obj.tipOptions.spacing;
			var _left,_top;


			switch(position){
				case 'right' :
					_left = $(obj).offset().left + $(obj).outerWidth() + offset.x + spacing;
					_top = $(obj).offset().top + ($(obj).outerHeight() - tipEle.outerHeight())/2 + offset.y;
					break;
				case 'left' :
					_left = $(obj).offset().left - tipEle.outerWidth() + offset.x - spacing;;
					_top = $(obj).offset().top + ($(obj).outerHeight() - tipEle.outerHeight())/2 + offset.y;
					break;
				case 'top' :
					_left = $(obj).offset().left + ($(obj).outerWidth() - tipEle.outerWidth())/2 + offset.x;
					_top = $(obj).offset().top - tipEle.outerHeight() + offset.y - spacing;
					break;
				case 'bottom' :
					_left = $(obj).offset().left + ($(obj).outerWidth() - tipEle.outerWidth())/2 + offset.x;
					_top = $(obj).offset().top + $(obj).outerHeight() + offset.y + spacing;
					break;
			}

			$(tipEle).removeClass().addClass(position + ' simpleTip-wrapper').css({"top":_top + "px","left":_left + "px"});			// 定位tooltip
		}

		//设置显示/隐藏tooltip, 内部方法, funName: ['show'|'hide']
		,_display: function(tip, funName) {
			var showOptions = tip.tipOptions.show;
			var beforeFun = tip.tipOptions.events['before' + funName.charAt(0).toUpperCase()+ funName.substr(1)];
			var afterFun = tip.tipOptions.events['after' + funName.charAt(0).toUpperCase()+ funName.substr(1)];

			// 显示状态是否发生变化
			var isChangeVisable = (funName === "show" && tip.isShowed === false) || (funName === "hide" && tip.isShowed === true);

			if(beforeFun && isChangeVisable){ // beforeShow function
				beforeFun.call(tip);
			}

			// 显示状态是否发生变化后执行回调
			var _afterChange = function(){
				if(isChangeVisable){
					afterFun && afterFun.call(tip);
					tip.isShowed = funName === "show" ? true : false;; //设置是否显示属性
				}
			}

			if(showOptions.animate === 'fade'){
				var fun = funName === "show" ? "fadeIn" : "fadeOut";
				$(tip.tipEle).stop()[fun](200, _afterChange);
			}else{
				$(tip.tipEle)[funName](0, _afterChange);
			}
		}

		//显示tooltip,并为其定位
		,show: function(){
			var tip = this;
			oToolTip.setPosition(tip);

			var delay = tip.tipOptions.show.delay;

			if(delay){
				tip.timeoutToogle && clearTimeout(tip.timeoutToogle);
				tip.timeoutToogle = setTimeout(function(){
					oToolTip._display(tip, 'show');
				}, delay);
			}else{
				oToolTip._display(tip, 'show');
			}

			if(tip.tipOptions.follow){ // 跟随鼠标
				var tipEle = tip.tipEle;
				tipEle.removeClass().addClass('simpleTip-wrapper');
				$(tip).on('mousemove', function(event) {
					tipEle.css({
						left : event.pageX - 3,
						top : event.pageY + 9
					});
				})
			}
		}

		//隐藏tooltip
		,hide: function(){
			var tip = this;
			var delay = tip.tipOptions.hide.delay;

			if(delay){
				tip.timeoutToogle && clearTimeout(tip.timeoutToogle);
				tip.timeoutToogle = setTimeout(function(){
					oToolTip._display(tip, 'hide');
				}, delay);
			}else{
				oToolTip._display(tip, 'hide');
			}

			if(tip.tipOptions.follow){ // 清除跟随鼠标
				var tipEle = tip.tipEle;
				$(tip).off('mousemove');
			}
		}

		//取消tooltip功能
		,destroy: function(ele){
			if(ele.tipOptions){
				$(ele).off(ele.tipOptions.show.action, oToolTip.show).off(ele.tipOptions.hide.action, oToolTip.hide);
				ele.tipEle.remove();
				ele.tipEle = ele.tipOptions = null;
			}
		}
	}

})(jQuery);

