window.addEventListener('load', () => {
  /**
   * ローディングアニメーション用
   */
  const spinner = document.getElementById('loading');
  spinner.classList.add('loaded');

  /**
   * 初期化用関数
   */
  const init = () => {
    // NOTE: 空文字と1~8の数字が格納された配列を生成する
    // FIXME: これ再利用したい
    let arr = [''];
    for (i = 0; i < 9; i++) {
      arr.push((i + 1).toString());
    }

    // 生成した配列をシャッフルする
    shuffle(arr);
    // 解決可能なパズルかどうか判定する
    if (!canSolved(arr.slice(0, arr.length))) { // 解決不可能なら
      // パズルを初期化
      init();
    } else { // 解決可能なら
      // パズルを描画する
      render(arr);
    }
  }

  /**
   * 配列シャッフル用関数
   * @param {Array} arr 
   */
  const shuffle = (arr) => {
    let i = arr.length;
    while(i) {
      // NOTE: 0 ~ 最大8までの乱数を生成
      var j = Math.floor(Math.random() * i--);
      // 配列の要素番号がiとjに該当する箇所の値を入れ替える
      swap(i, j, arr);
    }
  }

  /**
   * 配列の値入れ替え用関数
   * @param {Number} i 
   * @param {Number} j 
   * @param {Array} arr 
   */
  const swap = (i, j, arr) => {
    let tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }

  /**
   * 解決可能なパズルかを判定する関数
   * @param {Array} arr 
   * @returns boolean 解決可能なパズルならtrue
   */
  const canSolved = (arr) => {
    if ((arr[0] == '' && arr[1] == 1) || arr[0] == 1) {
      // NOTE: 最終的に左上にはまるピースが、左上の1マスまたはそのすぐ下のマスにあって上が空きマスでないと解けない
    } else {
      return false;
    }
    // NOTE: 配列内の空白の要素番号を格納
    const blank_index = arr.indexOf('');
    // NOTE: 縦の距離の計算
    const vertical_dist = Math.floor(((arr.length - 1) - blank_index) / Math.sqrt(arr.length));
    // NOTE: 横の距離の計算
    const horizontal_dist = ((arr.length - 1) - blank_index) % Math.sqrt(arr.length);
    // NOTE: 縦と横を足し合わせる
    const dist = vertical_dist + horizontal_dist;

    // NOTE: 答えの配列を生成する
    let answer = [''];
    for (i = 0; i < 9; i++) {
      answer.push((i + 1).toString());
    }

    // NOTE: 入れ替えが起きた回数を記録する
    let count = 0;
    // NOTE: パズルを答えの形に並び替える
    for (let i = 0; i < answer.length; i++) {
      for (let j = i + 1; j < answer.length; j++) {
        // NOTE: 要素番号＋1の数が格納されている箇所と入れ替える
        if (i + 1 == arr[j]) { 
          swap(i, j, arr);
          // NOTE: 入れ替えが起きたら1プラスする
          count++;
        }
      }
      // NOTE: 答えの配列と同じになったかどうかを判定
      if (arr.toString() === answer.toString()) {
        // NOTE: 同じならばループから抜ける
        break;
      }
    }

    // NOTE 判定処理
    if (count % 2 === dist % 2) { // 解決可能なパズルなら
      return true;
    } else { // 解決不可能なパズルなら
      return false;
    }
  }

  /**
   * クリアしたかどうか判定する関数
   * 
   */
  const isSolved = (arr) => {
    let answer = [''];
    for (i = 0; i < 9; i++) {
      answer.push((i + 1).toString());
    }

    if (JSON.stringify(answer) === JSON.stringify(arr)) {
      const clearElem = document.getElementById('clear');
      setTimeout(() => {
        clearElem.classList.add("is-clear");
      }, 700);
    }
  }

  /**
   * パズル描画用関数
   * @param {Array} arr 
   */
  const render = (arr) => {
    const jsShowPanelElem = document.getElementById('js-show-panel');
    // NOTE: すでにパズルが描画されていたら、それらを一旦削除する
    while (jsShowPanelElem.firstChild) {
      jsShowPanelElem.removeChild(jsShowPanelElem.firstChild);
    }

    // NOTE: フラグメント生成
    const fragment = document.createDocumentFragment();
    // NOTE: 描画用のHTML生成
    arr.forEach((element) => {
      let tileWrapper = document.createElement('div');
      tileWrapper.className = 'tile-wrapper';

      let tile = document.createElement('div');
      tile.className = element != '' ? 'tile tile-' + element : 'tile-none';
      tile.textContent = element;

      tileWrapper.appendChild(tile);
      fragment.appendChild(tileWrapper);
    });
    // NOTE: 描画
    jsShowPanelElem.appendChild(fragment);
    // NOTE: クリックイベントを追加
    addEventListenerClick(arr);
  }

  /**
   * パズルにクリックイベント追加する用関数
   * @param {Array} arr 
   */
  const addEventListenerClick = (arr) => {
    // NOTE: クラス名にtileがつくDOM一つ一つにクリックイベントを追加
    const tileElem = document.querySelectorAll('.tile');
    // NOTE: タッチデバイスかどうか判定する
    const touchable = window.ontouchstart;
    const touchPoints = navigator.maxTouchPoints;
    // NOTE: タッチデバイス用
    // タップ時の誤動作を防ぐためのスワイプ時の処理を実行しない最小距離
    const threshold = 30;
    // スワイプ開始時の座標
    let startX = 0;
    let startY = 0;
    // スワイプ終了時の座標
    let endX = 0;
    let endY = 0;
    // 交換対象のパネル番号
    let panexIndex;

    tileElem.forEach((elem) => {

      if(touchable !== undefined && touchPoints > 0) {
        elem.addEventListener('touchstart', function(e) {
          e.preventDefault();
          // スワイプ開始時の座標をクリア
          startX = 0;
          startY = 0;
          // スワイプ終了時の座標をクリア
          endX = 0;
          endY = 0;

          panelIndex = arr.indexOf(this.textContent);

          startX = e.touches[0].pageX;
          startY = e.touches[0].pageY;
        });
    
        elem.addEventListener('touchmove', function(e) {
          endX = e.changedTouches[0].pageX;
          endY = e.changedTouches[0].pageY;
        });
    
        elem.addEventListener('touchend', function(e) {
          // スワイプ終了時にx軸とy軸の移動量を取得
          const distanceX = endX - startX;
          const distanceY = endY - startY;
    
          let direction = '';
          // 左右のスワイプ距離の方が上下より長い && 小さなスワイプは検知しないようにする
          if (Math.abs(distanceX) > Math.abs(distanceY) && Math.abs(distanceX) > threshold) {
            // 水平方向のスワイプ
            if (distanceX > 0) {
              translateX = 40;
              direction = 'right';
            } else {
              translateX = -40;
              direction = 'left';
            }
            translateY = 0;
          // 上下のスワイプ距離の方が左右より長い && 小さなスワイプは検知しないようにする
          } else if (Math.abs(distanceY) > Math.abs(distanceX) && Math.abs(distanceY) > threshold) {
            // 垂直方向のスワイプ
            if (distanceY > 0) {
              translateY = 40;
              direction = 'down';
            } else {
              translateY = -40;
              direction = 'up';
            }
            translateX = 0;
          }

          const availableDirection = checkAvailableDirection(panelIndex, arr);
          const targetIndex = availableDirection['j'];

          if (availableDirection[direction]) {
            swapTile(panelIndex, targetIndex, arr);
          }
        });
      } else {
        elem.addEventListener('click', function() {
          let i = arr.indexOf(this.textContent);
          moveTile(i, arr);
        });
      }
    });
  }

  /**
   * タイルを動かす関数（非タッチデバイス用）
   * @param {Number} i
   * @param {Array} arr
   */
  const moveTile = (i, arr) => {
    let j;

    if (i == 0 && arr[i + 1] == '') {
      j = i + 1;
    } else if (i == 1 && arr[i - 1] == '') {
      j = i - 1;
    } else if (i <= 6 && arr[i + 3] == '') {
      j = i + 3;
    } else if (i >= 4 && arr[i - 3] == '') {
      j = i - 3;
    } else if ((i % 3 == 1 || i % 3 == 2) && arr[i + 1] == '') {
      j = i + 1;
    } else if ((i % 3 == 2 || i % 3 == 0) && arr[i - 1] == '') {
      j = i - 1;
    } else {
      return;
    }

    swap(i, j, arr);
    render(arr);
    isSolved(arr);
  };

  /**
   * タイルを動かす関数（タッチデバイス用）
   * @param {Number} i
   * @param {Number} j
   * @param {Array} arr
   */
  const swapTile = (i, j, arr) => {
    swap(i, j, arr);
    render(arr);
    isSolved(arr);
  };

  /**
   * タイルを動かせる方向をチェックする関数（タッチデバイス用）
   * @param {Number} i
   */
  const checkAvailableDirection = (i, arr) => {
    if (i == 0 && arr[i + 1] == '') {
      return {
        'up': false,
        'right': false,
        'down': true,
        'left': false,
        'j': i + 1,
      };
    } else if (i == 1 && arr[i - 1] == '') {
      return {
        'up': true,
        'right': false,
        'down': false,
        'left': false,
        'j': i - 1,
      };
    } else if (i <= 6 && arr[i + 3] == '') {
      return {
        'up': false,
        'right': false,
        'down': true,
        'left': false,
        'j': i + 3,
      };
    } else if (i >= 4 && arr[i - 3] == '') {
      return {
        'up': true,
        'right': false,
        'down': false,
        'left': false,
        'j': i - 3,
      }
    } else if ((i % 3 == 1 || i % 3 == 2) && arr[i + 1] == '') {
      return {
        'up': false,
        'right': true,
        'down': false,
        'left': false,
        'j': i + 1,
      }
    } else if ((i % 3 == 2 || i % 3 == 0) && arr[i - 1] == '') {
      return {
        'up': false,
        'right': false,
        'down': false,
        'left': true,
        'j': i - 1,
      }
    } else {
      return {
        'up': false,
        'right': false,
        'down': false,
        'left': false,
      };
    }
  }

  /**
   * メイン処理
   */
  init();
});