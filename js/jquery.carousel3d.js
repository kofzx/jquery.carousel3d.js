(function ($) {

	/* opts */
	var defaults = {
		duration: 3000,
		autoPlay: false
		/*	如果有
			autoPlay: {
				delay: 3000
			}
		*/
	};

	$.fn.extend({
		"carousel3d": function (options) {
			var opts = $.extend({}, defaults, options);
			var container = this;
			/* constant */
			var W = document.documentElement.clientWidth || document.body.clientWidth,
		     	H = container.height();
		    var originW = -W / 2,
		     	originH = -H / 2;

		    var $listItem = container.find(".item");
		    var num = 0;			// 轮播index
		    var isClick = true;		// 防止连续点击状态

		    /* data */
		    var effect_right_cur_array = ['flip-down', 'flip-left', 'rect-left', 'rect-down'],
				effect_right_next_array = ['flip-down-next', 'flip-left-next', 'rect-left-next', 'rect-down-next'],
				effect_left_cur_array = ['flip-up', 'flip-right', 'rect-right', 'rect-up'],
				effect_left_next_array = ['flip-up-next', 'flip-right-next', 'rect-right-next', 'rect-up-next'],
				rotate_array = ['rotateX180', 'rotateY180', 'rotateY-180', 'rotateX-180'];

			var rect3d = ['rect-left', 'rect-left-next', 'rect-down', 'rect-down-next', 'rect-right', 'rect-right-next', 'rect-up', 'rect-up-next'];

			var len_cur_right = effect_right_cur_array.length,
				len_next_right = effect_right_next_array.length,
				len_cur_left = effect_left_cur_array.length,
				len_next_left = effect_left_next_array.length;

			var arr = new Array();
			// 所有cur
			var effects_cur_all = arr.concat(effect_right_cur_array, effect_left_cur_array);
			// 所有
			var effects_array = arr.concat(effect_right_cur_array, effect_right_next_array, effect_left_cur_array, effect_left_next_array, rotate_array);


			getCSS(".animate").style.animationDuration = opts.duration + "ms";

			// 圆点点击事件
		    var enableDotClick = function() {

		        var $dotList = $(".dot-grp span");

		        if ($dotList.length > 0) {
		            $dotList.on('click', function() {

		                if (isClick) {

		                    var oldIndex = getDotActive();
		                    var newIndex = $(this).index();
		                    num = newIndex;

		                    if (oldIndex === newIndex) return false;

		                    var ran = random(0, effects_cur_all.length - 1);
		                    var effStr = effects_cur_all[ran];

		                    // 先清空
		                    clear();

		                    setEffect(effStr, oldIndex);
		                    setEffect(checkout(effStr).rotate, oldIndex, false);
		                    setEffect('active', oldIndex);

		                    updateDot(newIndex);

		                    setEffect(checkout(effStr).next, newIndex);

		                    setEffect('active-next', newIndex);

		                    isClick = false;

		                    setTimeout(() => {
		                        isClick = true;
		                    }, opts.duration);

		                }

		            });
		        }

		    };

		    init();
    		enableDotClick();

    		// 上一张按钮
		    $("#leftBtn").click(function() {

		        if (isClick) {

		            var ran = random(0, len_cur_left - 1);
		            var effStr = effect_left_cur_array[ran];

		            // 先清空
		            clear();

		            setEffect(effStr, num);
		            setEffect(checkout(effStr).rotate, num, false);
		            setEffect('active', num);

		            --num;
		            if (num === -1) {
		                num = $listItem.size() - 1;
		            }
		            updateDot(num);

		            setEffect(checkout(effStr).next, num);

		            setEffect('active-next', num);

		            isClick = false;

		            setTimeout(() => {
		                isClick = true;
		            }, opts.duration);

		        }

		    });

		    // 下一张按钮
		    $("#rightBtn").click(function() {

		        if (isClick) {

		            var ran = random(0, len_cur_right - 1);
		            var effStr = effect_right_cur_array[ran];

		            // 先清空
		            clear();

		            setEffect(effStr, num);
		            setEffect(checkout(effStr).rotate, num, false);
		            setEffect('active', num);

		            ++num;
		            if (num === $listItem.size()) {
		                num = 0;
		            }
		            updateDot(num);

		            setEffect(checkout(effStr).next, num);

		            setEffect('active-next', num);

		            isClick = false;

		            setTimeout(() => {
		                isClick = true;
		            }, opts.duration);

		        }

		    });

    		// 初始化
		    function init() {
		        $listItem.each((i, e) => {
		            $(e).addClass('animate');
		        });
		        setEffect('active', 0);
		        createDot();
		        updateDot();
		        if (opts.autoPlay) {
		        	autoPlay(opts.autoPlay.delay);
		        }
		    }

		    function autoPlay(ms) {
		        setInterval(() => {
		            $("#rightBtn").trigger("click");
		        }, ms);
		    }

		    // core
		    function setEffect(effect, index, flag = true) {
		        var $item = $listItem.eq(index); // 当前的元素

		        if (findString(effect)) {
		            if (effect.indexOf('left') >= 0 || effect.indexOf('right') >= 0) {
		                $item.css("transform-origin", `50% 50% ${originW}px`);
		            } else if (effect.indexOf('up') >= 0 || effect.indexOf('down') >= 0) {
		                $item.css("transform-origin", `50% 50% ${originH}px`);
		            }
		        }

		        if (flag) {
		            $item
		                .addClass(effect)
		                .siblings().removeClass(effect);
		        } else {
		            $item
		                .removeClass(effect)
		                .siblings().addClass(effect);
		        }
		    }

		    function random(min, max) {
			    return Math.round(Math.random() * max + min);
			}

			function getCSS(selector){
			  var css = document.styleSheets;
			  var isIE = document.attachEvent ? true : false;

			  for(var i = 0; i < css.length; i++){
			    var rs = !isIE ? css[i].cssRules : css[i].rules;
			    for(var j = 0; j < rs.length; j++){
			      if(rs[j].selectorText == selector){
			        return rs[j];
			      }
			    }
			  }
			}

		    // 生成圆点
		    function createDot() {

		        for (var i = 0; i < $listItem.size(); i++) {
		            var dot = document.createElement('span');
		            $(dot).addClass("dot");
		            $(".dot-grp").append($(dot));
		        }

		    }

		    // 更新圆点
		    function updateDot(index = 0) {

		        if ($(".dot-grp span").length > 0) {
		            $(".dot-grp span").eq(index)
		                .addClass("dot-active")
		                .siblings()
		                .removeClass("dot-active");
		        }

		    }

		    // 获取dotActive
			function getDotActive() {
				var $dotList = $(".dot-grp span");
				for (var i = 0; i < $dotList.length; i++) {
					if ($dotList.eq(i).hasClass("dot-active")) {
						return i;
					}
				}
			}

		    // 检索特殊类名
		    function findString(clsName) {
		        return rect3d.join(" ").indexOf(clsName) >= 0 ? true : false;
		    }

		    // 清空动画类 + 重置css
		    function clear() {
		        var clsStr = effects_array.join(" ");
		        $listItem.each((i, e) => {
		            $(e).removeClass(clsStr);
		            $(e).css("transform-origin", "50% 50% 0");
		        });
		    }

		    // 确立映射关系
			function checkout(clsName) {
				var result = {};

				switch(clsName) {
					case 'flip-down':
						result.next = 'flip-down-next';
						result.rotate = 'rotateX180';
						break;
					case 'flip-left':
						result.next = 'flip-left-next';
						result.rotate = 'rotateY180';
						break;
					case 'flip-up':
						result.next = 'flip-up-next';
						result.rotate = 'rotateX-180';
						break;
					case 'flip-right':
						result.next = 'flip-right-next';
						result.rotate = 'rotateY-180';
						break;
					case 'rect-left':
						result.next = 'rect-left-next';
						result.rotate = ' ';
						break;
					case 'rect-right':
						result.next = 'rect-right-next';
						result.rotate = ' ';
						break;
					case 'rect-down':
						result.next = 'rect-down-next';
						result.rotate = ' ';
						break;
					case 'rect-up':
						result.next = 'rect-up-next';
						result.rotate = ' ';
						break;
				}

				return result;
			}

		}
	})

})(window.jQuery);