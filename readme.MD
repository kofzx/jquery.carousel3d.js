# 3d轮播   同时拥有（水平翻转、垂直翻转、方块水平翻转、方块垂直翻转）的轮播插件
	效果为随机选择

# html 	-->   需指明#content的height
	<div class="carousel3d-container carousel3d-container-3d">
		<div id="content" class="carousel3d-wrapper" style="height: 460px">
			<div class="item" style="background-image: url(...);"></div>
		</div>	
		
		<!-- 按钮控制 -->
		<div class="btn-grp">
			<div id="leftBtn" class="left-btn">左</div>
			<div id="rightBtn" class="right-btn">右</div>
		</div>
		<!-- 圆点控制 -->
		<div class="dot-grp"></div>
	</div>	

# css	引入jquery.carousel.css

# js	默认
	$(function () {

			$("#content").carousel3d();

	});

# 配置项		比较少   o(╥﹏╥)o
	$("#content").carousel3d({
		duration: 3000,		// 轮播持续时间
		autoPlay: false		// 自动播放
		/*	如果有
			autoPlay: {
				delay: 3000		// 自动播放的延迟
			}
		*/
	};);