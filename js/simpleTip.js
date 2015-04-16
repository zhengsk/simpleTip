// JavaScript Document
/*!
 * @plugin name : simpleTip
 * @author XXX
 * @version 1.1 
 * @require jQuery
 * 时间：20150407
 */

(function ($){

	$.fn.simpleTip = function (options, value){

		if($.type(options) == "string"){
			switch (options){
				case "show" : 
					return this.each(function(){
						this.oTipEle && oToolTip.show.call(this);
					});
					break;
				case "hide" :
					return this.each(function(){
						this.oTipEle && oToolTip.hide.call(this);
					});
					break;
				case "destroy" :
					return this.each(function(){
						this.oTipEle && oToolTip.destroy(this);
					});
					break;
				case "content" :
					return this.each(function(){
						this.oTipEle && this.oTipEle.html(value || '');
						oToolTip.setPosition(this); // 如果已经显示则刷新位置
					});
					break;
				case "position" :
					return this.each(function(){
						if(this.oTipEle){
							value && (this.tipOptions = $.extend({}, this.tipOptions)) && (this.tipOptions.position = value);
							oToolTip.setPosition(this);
						}
					});
					break;
				case "follow" :
					return this.each(function(){
						if(this.oTipEle){
							value && (this.tipOptions = $.extend({}, this.tipOptions)) && (this.tipOptions.follow = value);
						}
					});
					break;
			}
			return;
		}

		var _opts = $.extend( true, {}, $.fn.simpleTip.defaults, options);
		return this.each(function(){

			if(this.tipOptions){ //如果已经存在则注销，在重新创建
				$(this).simpleTip('destroy');
			}

			this.tipOptions = _opts;
			oToolTip.createTip(this); //为参数对象创建tooltip

			// 绑定显示tooltip和隐藏tooltip的方法
			$(this).on(this.tipOptions.show.action, oToolTip.show);
			$(this).on(this.tipOptions.hide.action, oToolTip.hide);

		});
	}

	//为参数设置默认值
	$.fn.simpleTip.defaults = {
		content : "I'm a tooltip!"
		,show : {
			action : 'mouseenter'
			,delay : 0
			,animate : 'fade'
		}
		,hide : {
			action : 'mouseleave'
			,delay : 0
			,animate : 'fade'
		}
		,position: 'right'		// tip 位置
		,offset: {x:0, y:0}		// 定位偏移
		,follow : false			// 跟随鼠标 
	};
	
	var oToolTip = {

		//创建DIV
		createTip: function(obj){
			var oText = $.parseHTML(obj.tipOptions.content);	// 创建一个内容为content的文本节点
			obj.oTipEle = $('<div></div>');
			$(obj.oTipEle).addClass("addtooltip").append($(oText)).appendTo('body');	// 为tooltip设置class,并将tooltip标签追加到文档中
		}

		//定位
		,setPosition: function(obj){
			
			if(obj.tipOptions.follow){return;} // 跟随鼠标
			
			var tipEle = obj.oTipEle;
			var position = obj.tipOptions.position;
			var offset = obj.tipOptions.offset;
			var _left,_top;


			switch(position){
				case 'right' :
					_left = $(obj).offset().left + $(obj).outerWidth() + offset.x;
					_top = $(obj).offset().top + ($(obj).outerHeight() - tipEle.outerHeight())/2 + offset.y;
					break;
				case 'left' :
					_left = $(obj).offset().left - tipEle.outerWidth() + offset.x;
					_top = $(obj).offset().top + ($(obj).outerHeight() - tipEle.outerHeight())/2 + offset.y;
					break;
				case 'top' :
					_left = $(obj).offset().left + ($(obj).outerWidth() - tipEle.outerWidth())/2 + offset.x;
					_top = $(obj).offset().top - tipEle.outerHeight() + offset.y;
					break;
				case 'bottom' :
					_left = $(obj).offset().left + ($(obj).outerWidth() - tipEle.outerWidth())/2 + offset.x;
					_top = $(obj).offset().top + $(obj).outerHeight() + offset.y;
					break;
			}

			$(tipEle).css({"top":_top + "px","left":_left + "px"});			// 定位tooltip
		}

		//显示tooltip,并为其定位
		,show: function(){
			var tip = this;
			oToolTip.setPosition(tip);

			var follow = tip.tipOptions.follow;
			var showOptions = tip.tipOptions.show;

			if(showOptions.delayShow){
				setTimeout(function(){
					if(showOptions.animate == 'fade'){
						$(tip.oTipEle).fadeIn();
					}else{
						$(tip.oTipEle).show();
					}
				}, showOptions.delayShow);
			}else{
				if(showOptions.animate == 'fade'){
					$(tip.oTipEle).fadeIn();
				}else{
					$(tip.oTipEle).show();
				}
			}

			if(follow){ // 跟随鼠标
				var oTipEle = tip.oTipEle;
				$(document).on('mousemove', function(event) {
					oTipEle.css({
						left : event.pageX + 12,
						top : event.pageY + 24
					});
				})
			}
		}

		//隐藏tooltip
		,hide: function(){
			var tip = this;
			
			var delayHide = tip.tipOptions.hide.delay;
			if(delayHide){
				setTimeout(function(){$(tip.oTipEle).hide()}, delayHide);
			}else{
				$(tip.oTipEle).hide()
			}

			if(tip.tipOptions.follow){ // 清除跟随鼠标
				var oTipEle = tip.oTipEle;
				$(document).off('mousemove');
			}
		}

		//取消tooltip功能
		,destroy: function(ele){
			if(ele.tipOptions){
				$(ele).off(ele.tipOptions.show.action, oToolTip.show).off(ele.tipOptions.hide.action, oToolTip.hide);
				ele.oTipEle.remove();
				ele.oTipEle = ele.tipOptions = null;
			}
		}
	}

})(jQuery);

