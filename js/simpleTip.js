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
			$(this).on(this.tipOptions.action.show, oToolTip.show);
			$(this).on(this.tipOptions.action.hide, oToolTip.hide);

		});
	}

	//为参数设置默认值
	$.fn.simpleTip.defaults = {
		content : "I'm a tooltip!"
		,action : {		
			show : 'mouseover'
			,hide : 'mouseout'
		}
		,offset: 0
		,position: 'left'
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
			var tipEle = obj.oTipEle;
			var position = obj.tipOptions.position;
			var offset = obj.tipOptions.offset;
			var _left,_top;

			switch(position){
				case 'right' :
					_left = obj.offsetLeft + obj.offsetWidth + offset;
					_top = obj.offsetTop + (obj.offsetHeight - tipEle.outerHeight())/2;
					break;
				case 'left' :
					_left = obj.offsetLeft - tipEle.outerWidth() - offset;
					_top = obj.offsetTop + (obj.offsetHeight - tipEle.outerHeight())/2;
					break;
				case 'top' :
					_left = obj.offsetLeft + (obj.offsetWidth - tipEle.outerWidth())/2;
					_top = obj.offsetTop - tipEle.outerHeight() - offset;
					break;
				case 'bottom' :
					_left = obj.offsetLeft + (obj.offsetWidth - tipEle.outerWidth())/2;
					_top = obj.offsetTop + obj.offsetHeight + offset;
					break;
			}

			$(tipEle).css({"top":_top + "px","left":_left + "px"});			// 定位tooltip
		}

		//显示tooltip,并为其定位
		,show: function(){
			oToolTip.setPosition(this);
			$(this.oTipEle).css('display', 'block');
		}

		//隐藏tooltip
		,hide: function(){
			$(this.oTipEle).css('display', 'none');
		}

		//取消tooltip功能
		,destroy: function(ele) {
			if(ele.tipOptions){
				$(ele).off(ele.tipOptions.action.show, oToolTip.show).off(ele.tipOptions.action.hide, oToolTip.hide);
				ele.oTipEle.remove();
				delete ele.oTipEle;
				delete ele.tipOptions;
			}
		}
	}

})(jQuery);

