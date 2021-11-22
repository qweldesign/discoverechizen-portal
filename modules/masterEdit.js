/**
 * Master Edit
 * Author: Taigo Ito (https://qwel.design/)
 * Location: Fukui, Japan
 */

export default class MasterEdit {
  constructor(options = {}) {
    this._options = options;
    
    // イベントハンドラを登録 (thisの置き換え)
    this._addEventHandlers();

    // アイテムを変更したとき、ハッシュを更新
    this._targetSelect = document.getElementById('targetSelect');
    this._targetSelect.addEventListener('change', () => {
      this._changeHash();
    });
    this._itemSelect = document.getElementById('itemSelect');
    this._itemSelect.addEventListener('change', () => {
      this._changeHash();
    });

    // ハッシュを変更したとき(ハッシュが整数型の場合)、フォームを更新
    window.addEventListener('hashchange', () => this.hashChangeHandler());
    
    this.init();
  }

  _addEventHandlers() {
    this._changeSaveContentHandler = () => {
      this._changeSaveContent();
    };

    this._changeStateHandler = (event) => {
      this._changeState(event);
    };

    this._submitHandler = (event) => {
      event.preventDefault();
      if (!this._isSubmitted) this._save();
    };
  }

  _changeHash() {
    // 選択値から新しいハッシュを作成
    const target = this._targetSelect.value - 0;
    const id = this._itemSelect.value - 0;
    const item = id + target * 1000;
    // ハッシュを更新
    location.hash = item;
    // 保存メッセージを表示
    this._changeSaveContent();
  }
  
  hashChangeHandler() {
    const hash = location.hash;
    const index = hash.slice(1) - 0;
    if (Number.isInteger(index)) {
      this._removeEventListeners();
      this._promise.then(() => {
        this.init();
      });
    }
  }

  async init() {
    // マスターデータをfetch
    const res1 = await fetch(`${this._options.root}php/api.php?method=fetch&target=activities`);
    const activities = await res1.json();
    const res2 = await fetch(`${this._options.root}php/api.php?method=fetch&target=facilities`);
    const facilities = await res2.json();

    // ハッシュからitem, target, id をセット
    const hash = location.hash || '#0';
    this._item = hash.slice(1) - 0;
    this._target = Math.floor(this._item / 1000);
    this._id = this._item - this._target * 1000;
    
    // マスターデータから照会するレコードを取得
    const data =  this._target ? facilities : activities;
    this._len = data.length; // 新規追加時に参照
    this._data = {};
    data.forEach((dt) => {
      if (this._id === dt.id - 0) this._data = dt;
    });

    // IDが不正な場合、新規IDを作成
    if (!this._id || this._id > this._len + 1) {
      this._id = this._len + 1;
      location.hash = this._id + this._target * 1000;
    }

    // 目的が更新か、挿入か
    this._method = Object.keys(this._data).length ? 'update' : 'insert';

    // イベントハンドラをリセット
    this._promise = new Promise((resolve, reject) => {
      this._removeEventListeners = () => resolve();
    });

    // フォームをセット
    const fields = [
      {
        'name': '体験略名',
        'fullname': '正式名称',
        'company': '運営事業者',
        'type': '種類',
        'sdgs_summary': 'SDGsの観点',
        'capacity': '定員',
        'duration': '所要時間'
      },
      {
        'name': '施設略名',
        'fullname': '正式名称',
        'capacity': '収容人数',
      }
    ];
    this._fields = fields[this._target];   
    this._form = document.getElementById('masterEdit');
    this._info = document.getElementById('info');
    this._template = document.getElementById('infoTemplate');
    this._message = document.getElementById('message');
    this._months = document.getElementById('receptionMonths');
    this._weeks = document.getElementById('receptionWeeks');
    this._setForm(data);

    // 送信
    this._submit = document.getElementById('submit');
    this._isSubmitted = false;
    this._saveMessage = document.getElementById('saveMessage');
    this._text = '保存ボタンを押してから閉じてください。';
    this._submit.addEventListener('click', this._submitHandler);
    this._promise.then(() => {
      this._submit.removeEventListener('click', this._submitHandler);
    });
  }

  _setForm(data = {}) {
    this._setItemSelect(data);
    this._setInfo();
    this._setMessage();
    this._setReceptionMonths();
    this._setReceptionWeeks();
  }

  _setItemSelect(data) {
    // target
    this._targetSelect.options.selectedIndex = this._target;

    // ID
    this._itemSelect.innerHTML = '';
    // 新規
    const option = document.createElement('option');
    option.setAttribute('value', 0);
    option.textContent = '新規';
    this._itemSelect.appendChild(option);
    // IDを追加
    data.forEach((dt) => {
      const option = document.createElement('option');
      option.setAttribute('value', dt.id);
      option.textContent = dt.id;
      this._itemSelect.appendChild(option);
      if (this._id === dt.id - 0) this._itemSelect.options[this._id].selected = true;
    });
  }

  _setInfo() {
    this._info.innerHTML = '';
    Object.keys(this._fields).forEach((key) => {
      // テンプレートをクローン
      const clone = document.importNode(this._template.content, true);

      // label要素
      const label = clone.querySelector('label');
      label.setAttribute('for', key);
      label.textContent = this._fields[key];

      // input要素 [type="text"]
      const input = clone.querySelector('input');
      input.id = key;
      input.setAttribute('name', key);
      // データがあればセット
      if (this._method === 'update') {
        input.value = this._data[key];
      }

      // クローンを挿入
      this._info.appendChild(clone);

      // イベントハンドラ
      input.addEventListener('change', this._changeSaveContentHandler);
      this._promise.then(() => {
        input.removeEventListener('change', this._changeSaveContentHandler);
      });
    });
  }

  _setMessage() {
    this._message.value = this._data.message;

    // イベントハンドラ
    this._message.addEventListener('click', this._changeSaveContentHandler);
    this._promise.then(() => {
      this._message.removeEventListener('click', this._changeSaveContentHandler);
    });
  }

  _setReceptionMonths() {
    const elems = this._months.querySelectorAll('td');
    elems.forEach((td, i) => {
      // データ属性をセット
      if (this._method === 'update') {
        td.dataset.state = this._data[`reception_month_${('00' + i).slice(-2)}`];
      } else {
        td.dataset.state = 1;
      }

      // イベントハンドラ
      td.addEventListener('click', this._changeStateHandler);
      this._promise.then(() => {
        td.removeEventListener('click', this._changeStateHandler);
      });
    });
  }

  _setReceptionWeeks() {
    const elems = this._weeks.querySelectorAll('td');
    elems.forEach((td, i) => {
      // データ属性をセット
      if (this._method === 'update') {
        td.dataset.state = this._data[`reception_week_${('0' + i).slice(-1)}`];
      } else {
        td.dataset.state = 1;
      }
      
      // イベントハンドラ
      td.addEventListener('click', this._changeStateHandler);
      this._promise.then(() => {
        td.removeEventListener('click', this._changeStateHandler);
      });
    });
  }

  _changeSaveContent() {
    if (this._isSubmitted) {
      this._isSubmitted = false;
      this._saveMessage.textContent = this._text;
    }
  }

  _changeState(event) {
    const target = event.currentTarget;
    let state = target.dataset.state;
    state++;
    state = state % 5;
    target.dataset.state = state;
    this._changeSaveContent();
  }

  _save() {
    // POSTデータを作成
    const data = new FormData();
    data.append('item', this._item);

    // 各Infoデータ
    Object.keys(this._fields).forEach((key) => {
      const elem = document.getElementById(key);
      const val = elem.value;
      data.append(key, val);
    });

    // メッセージ
    const message = this._message.value;
    data.append('message', message);
    
    // 月の予約状況デフォルト値
    let elems = this._months.querySelectorAll('td');
    elems.forEach((td, i) => {
      const key = `reception_month_${('00' + i).slice(-2)}`;
      const val = td.dataset.state;
      data.append(key, val);
    });
    
    // 週の予約状況デフォルト値
    elems = this._weeks.querySelectorAll('td');
    elems.forEach((td, i) => {
      const key = `reception_week_${('0' + i).slice(-1)}`;
      const val = td.dataset.state;
      data.append(key, val);
    });

    fetch(`../php/api.php?method=${this._method}&target=master`, {
      method: 'POST',
      body: data
    })
      .then((res) => res.text())
      .then((text) => {
        if (text === 'success') {
          this._isSubmitted = true;
          if (this._method === 'insert') {
            // 選択アイテムを更新
            const option = document.createElement('option');
            option.setAttribute('value', this._id);
            option.textContent = this._id;
            this._itemSelect.appendChild(option);
            this._itemSelect.options[this._id].selected = true;
          }
          this._transitionEnd(this._saveMessage, () => {
            this._saveMessage.classList.add('--fade');
          }).then(() => {
            this._saveMessage.innerHTML = `保存されました。（<a href="../#${this._item}">トップへ戻る</a>）`;
            this._saveMessage.classList.remove('--fade');
          });
        }
      });
  }

  _transitionEnd(elem, func) {
    let callback;
    const promise = new Promise((resolve, reject) => {
      callback = () => resolve(elem);
      elem.addEventListener('transitionend', callback);
    });
    func();
    promise.then((elem) => {
      elem.removeEventListener('transitionend', callback);
    });
    return promise;
  }
}
