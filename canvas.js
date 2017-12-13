(function(){
	window.onload = function(){
		//タッチパネル判定
		var mytap = window.ontouchstart===null?"touchstart":"click";
		//---------------------------
		//canvas 初期設定
		//---------------------------
		var canvas = document.querySelector('canvas');
		var context = canvas.getContext('2d');
		//penの座標を取得
		var pen = {
			startX: 0,
			startY: 0,
			x: 0,
			y: 0,
			oldMidPointX: 0,
			oldMidPointY: 0,
			color: "#333",
			width : "2.5",
			cap : "round",
			isDrawing: false
		};
		var borderWidth = 1;
		//---------------------------
		// イベント設定
		//---------------------------
		switch (mytap){
			//■マウス操作
			case "click" :
				//マウスクリック時
				canvas.addEventListener("mousedown", function(){
					snfncIsDrawLockOff();
				});
				//マウスムーブイベント発生時
				canvas.addEventListener("mousemove", function(e){
					var evnt = e;
					snfncDraw(evnt);
				});
				//マウスアップ発生時
				canvas.addEventListener("mouseup", function(){
					snfncIsDrawLockOn();
				});
				break;
			//■タップ操作
			case "touchstart" :
				//タップ時
				canvas.addEventListener("touchstart", function(e){
					//e.preventDefault();
					var evnt = e.touches[0];
					var rect = evnt.target.getBoundingClientRect();
					pen.x = evnt.clientX - rect.left;
					pen.y = evnt.clientY - rect.top;

					snfncIsDrawLockOff();
				});
				//タップムーブ（スワイプ）イベント発生時
				canvas.addEventListener("touchmove", function(e){
					e.preventDefault();
					var evnt = e.touches[0];
					snfncDraw(evnt);
				});
				//タッチエンド（画面から指が離れたとき）発生時
				canvas.addEventListener("touchend", function(){
					snfncIsDrawLockOn();
				});
				break;
		}
		//---------------------------
		// 線描写
		//---------------------------
		function snfncDraw(evnt){
			//2.マウスが動いたら座標値を取得
			var rect = evnt.target.getBoundingClientRect();
			pen.x = evnt.clientX - rect.left - borderWidth;
			pen.y = evnt.clientY - rect.top - borderWidth;
			//pen.x = evnt.clientX - rect.left;
			//pen.y = evnt.clientY - rect.top;
			//pageX[Y], offsetLeft[Top]を使う場合
			//pen.x = e.pageX - canvas.offsetLeft - borderWidth;
			//pen.y = e.pageY - canvas.offsetTop - borderWidth;

			//3.座標情報をinfoに出力
			document.getElementById("info").innerHTML =
				" clientX = " + Math.floor(evnt.clientX) + "px" +
				" clientY = " + Math.floor(evnt.clientY) + "px" + '<br>' +
				" rect.left = " + Math.floor(rect.left) + "px" +
				" rect.top = " + Math.floor(rect.top) + "px" + '<br>' +
				" pageX = " + Math.floor(evnt.pageX) + "px" +
				" pageY = " + Math.floor(evnt.pageY) + "px" + '<br>' +
				' offsetLeft = ' + Math.floor(canvas.offsetLeft) + "px" +
				' offsetTop = ' + Math.floor(canvas.offsetTop) + "px" + '<br>' +
				" canvas x座標 = " + Math.floor(pen.x) + "px" +
				" canvas y座標 = " + Math.floor(pen.y) + "px" + '<br>';

			//4.isDraw
			if (pen.isDrawing){
				//開始点
				var oldX = pen.startX;
				var oldY = pen.startY;
				//現在座標
				var penX = pen.x;
				var penY = pen.y;
				//中点
				var midX = (oldX + penX) / 2;
				var midY = (oldY + penY) / 2;

				context.beginPath();

				//二次ベジェ曲線で線をつなぐことにより、なめらかな曲線を実現
				//context.moveTo(pen.startX, pen.startY);
				//context.lineTo(pen.x, pen.y);
				context.moveTo(pen.oldMidPointX, pen.oldMidPointY);
				context.quadraticCurveTo(oldX, oldY, midX, midY);

				context.strokeStyle = pen.color;
				context.lineWidth  = pen.width;
				context.lineCap  = pen.cap;
				context.lineJoin = "round";
				context.stroke();

				//現在座標を開始座標にセット
				pen.startX = pen.x;
				pen.startY = pen.y;

				//現在座標を開始座標にセット
				pen.oldMidPointX = midX;
				pen.oldMidPointY = midY;
			}
		}
		//---------------------------
		// 線描写(制御)
		//---------------------------
		//マウスを押したら、描画OK(myDrawをtrue)
		function snfncIsDrawLockOff(){
			pen.isDrawing = true;
			pen.startX = pen.x;
	  		pen.startY = pen.y;
			pen.oldMidPointX = (pen.x + pen.startX)/2;
			pen.oldMidPointY = (pen.y + pen.startY)/2;
		}
		//6.マウスを上げたら、描画禁止(myDrawをfalse)
		function snfncIsDrawLockOn(){
			pen.isDrawing = false;
		}
		canvas.addEventListener('mouseleave', function(e){
			pen.isDrawing = false;
		});
		//---------------------------
		// canvas 領域のクリア
		//---------------------------
		var hoge4 = document.getElementById("sn_clear");
		hoge4.addEventListener("click",  function(e){
			context.clearRect(0, 0, canvas.width, canvas.height);
		});
		//---------------------------
		// base64出力
		//---------------------------
		var hoge3 = document.getElementById("sn_tobase64");
		hoge3.addEventListener("click", function(e){
			var base64 = document.getElementById("mycanvas").toDataURL('image/png');
			//var base64= document.getElementById("mycanvas").toDataURL();
			document.getElementById("base64text").value = base64;
		});
		//---------------------------
		// base64復元
		//---------------------------
		var hoge5 = document.getElementById("sn_rebase64");
		hoge5.addEventListener("click", function(e){
			var image = new Image();
			image.onload = function() {
			  context.drawImage(image, 0, 0);
			}
			image.src = document.getElementById("rebase64text").value;
		});
		//---------------------------
		// 色選択
		//---------------------------
		//var hoge6 = document.getElementById("penColor");
		//hoge6.addEventListener("change", function(){
		//	pen.color = document.getElementById("penColor").value;
		//});
		//---------------------------
		// 色選択
		//---------------------------
		var hoge8 = document.getElementById("penColor");
		hoge8.addEventListener("click", function(e){
			//getcolor(this.id)
			//alert(e.target.id);
			var pencolor = e.target.id;
			pen.color = pencolor;
			document.getElementById("nowcolor").style.background = pencolor;
		});
		//---------------------------
		// 線の太さ選択
		//---------------------------
		var hoge7 = document.getElementById("penWidth");
		hoge7.addEventListener("change", function(){
			pen.width = document.getElementById("penWidth").value;
		});

	}
})();
