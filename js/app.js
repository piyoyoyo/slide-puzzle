window.onload = function() {
  // =====================================
  // 関数定義
  // =====================================
  // 初期化用関数
  function init() {
      // 空文字と1~8の数字が格納された配列を生成
      var arr = ['']
      for(i = 0; i < 8; i++) {
          arr.push((i + 1).toString());
      }
      // 生成した配列をシャッフルする
      shuffle(arr);
      // 解決可能なパズルかどうか判定する
      if(!isSolved(arr.slice(0, arr.length))) { // 解決不可能なら
          // パズルを初期化
          init();
      }else { // 解決可能なら
          // パズルを描画する
          render(arr);
      }
  }

  // 配列シャッフル用関数
  function shuffle(arr) {
      var i = arr.length;
      while(i) {
          // 0 ~ 最大8までの乱数を生成
          var j = Math.floor(Math.random() * i--);
          // 配列の要素番号がiとjに該当する箇所の値を入れ替える
          swap(i, j, arr);
      }
  }

  // 配列の値入れ替え用関数
  function swap(i, j, arr) {
      var tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
  }

  // 解決可能なパズルかを判定する関数
  function isSolved(arr) {
      // #############################
      // 本文内Bの処理
      // #############################
      // 配列内の空白の要素番号を格納
      var blank_index = arr.indexOf('');
      // 縦の距離の計算
      dist_vertical = Math.floor(((arr.length - 1) - blank_index) / Math.sqrt(arr.length));
      // 横の距離の計算
      dist_horizontal = ((arr.length - 1) - blank_index) % Math.sqrt(arr.length);
      // 縦と横を足し合わせる
      var dist = dist_vertical + dist_horizontal;

      // #############################
      // 本文内Aの処理
      // #############################
      // 答えの配列を生成
      answer = [];
      for(i = 0; i < 8; i++) {
          answer.push((i + 1).toString());
      }
      answer.push('');

      // 入れ替えが起きた回数を記録する
      var count = 0;
      // パズルを答えの形に並び替える
      for (var i = 0; i < answer.length; i++) {
          for (var j = i + 1; j < answer.length; j++) {
              // 要素番号＋1の数が格納されている箇所と入れ替える
              if(i + 1 == arr[j]) { 
                  swap(i, j, arr);
                  // 入れ替えが起きたら1プラスする
                  count++;
              }
          }
          // 答えの配列と同じになったかどうかを判定
          if(arr.toString() === answer.toString()) {
              // 同じならばループから抜ける
              break;
          }
      }

      // 判定処理
      if(count % 2 === dist % 2) { // 解決可能なパズルなら
          return true;
      }else { // 解決不可能なパズルなら
          return false;
      }
  }

  // パズル描画用関数
  function render(arr) {
      var $jsShowPanel = document.getElementById('js-show-panel');
      // すでにパズルが描画されていたら、それらを一旦削除する
      while($jsShowPanel.firstChild) {
          $jsShowPanel.removeChild($jsShowPanel.firstChild);
      }

      // フラグメント生成
      fragment = document.createDocumentFragment();
      // 描画用のHTML生成
      arr.forEach(function(element) {   
          var tileWrapper = document.createElement('div');
          tileWrapper.className = 'tile-wrapper';

          var tile = document.createElement('div');
          tile.className = element != '' ? 'tile tile-' + element : 'tile tile-none';
          tile.textContent = element;

          tileWrapper.appendChild(tile);
          fragment.appendChild(tileWrapper);
      });
      // 描画
      $jsShowPanel.appendChild(fragment);
      // クリックイベントを追加
      addEventListenerClick(arr);
  }

  // パズルをクリックイベント追加用関数
  function addEventListenerClick(arr) {
      // クラス名にtileがつくDOM一つ一つにクリックイベントを追加
      $tile = document.querySelectorAll('.tile');
      $tile.forEach(function(elem) {
          elem.addEventListener('click', function() {
              // 引数に渡された配列（パズルの並びを表す）においてクリックされた数字が格納されている要素番号を変数に代入
              var i =  arr.indexOf(this.textContent);
              // クリックされたパズルの移動先を格納する変数
              var j;
              // クリックされたパズルが上2行かつクリックされたパズルの下のマスが空白だったら
              if(i <= 5 && arr[i + 3] == '') {
                  // 下方向へ移動
                  j = i + 3;
              }
              // クリックされたパズルが下2行かつクリックされたパズルの上のマスが空白だったら
              else if(i >= 3 && arr[i - 3] == '') {
                  // 上方向へ移動
                  j = i - 3;

              }
              // クリックされたパズルが左2列かつクリックされたパズルの右のマスが空白だったら
              else if(i % 3 != 2 && arr[i + 1] == '') {
                  // 右方向へ移動
                  j = i + 1;
              // クリックされたパズルが右2列かつクリックされたパズルの左のマスが空白だったら
              }else if(i % 3 != 0 && arr[i - 1] == '') {
                  // 左方向へ移動
                  j = i - 1;
              }
              // クリックされたパズルが移動させられなかったら
              else {
                  // なにもしない
                  return;
              }
              // パズルを移動
              swap(i, j, arr);
              // パズルを再描画
              render(arr);
          });
      });
  }

  // =====================================
  // メイン処理
  // =====================================
  // パズルの初期化
  init();
  // パズルのリセット
  document.getElementById('js-reset-puzzle').addEventListener('click', function() {
      init();
  });
}