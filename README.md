# simpleTip
A simple jQuery toolTip plugin

    // JavaScript Document 
    $(function(){
  
        $('#div1 li').simpleTip({
          	content : "I'm a tooltip too!",
          	action : {		
          		show : 'mouseover',
          		hide : 'mouseout'
          	}
          	,position : 'right'
          	,offset : 5
          }).css("fontFamily","微软雅黑").eq(1).simpleTip('show');	
        
        
          $('#div1 li').on('click', function() {
          	$(this).simpleTip('position', (['top', 'right', 'bottom', 'left'])[Math.floor(Math.random()*4)])
          })
        
        
          $('#showAll').bind('click', function(){
          	$('#div1 li').simpleTip('show');
          });
        
          $('#hideAll').bind('click', function(){
          	$('#div1 li').simpleTip('hide');
          });
        
        
          $('#setPosition').bind('click', function(){
          	$('#div1 li').eq(1).simpleTip('position', 'left');
          });
        
          $('#setContent').bind('click', function(){
          	$('#div1 li').eq(1).simpleTip('content', 'new Content!!');
          });
        
          $('#destoryTip').bind('click', function(){
          	$('#div1 li').eq(0).simpleTip('destroy');
          });
        
          $('#createTip').bind('click', function(){
          	$('#div1 li').eq(0).simpleTip({content:'what\'s you name'});
          });
    });
