/**
 * Event Calendar
 * Author: Taigo Ito (https://qwel.design/)
 * Location: Fukui, Japan
 */

import Calendar from "./calendar.js";

export default class EventCalendar extends Calendar {
  async _makeCalendar(year, month) {
    // データベース接続API
    const res = await fetch(`./api/fetch.php?year=${year}&month=${month + 1}`);
    this._status = await res.json();
    
    super._makeCalendar(year, month);
  }

  _setData(elem, year, month, day) {
    // 日にちをセット
    const date = this._parseDate(year, month, day);
    super._setData(elem, year, month, day);

    // アイテムIDをセット
    const select = document.getElementById('select');
    const item = select.value || 1;
    elem.dataset.item = item;

    // 状態をセット
    this._status.forEach((dt) => {
      if (date === dt.date && (item - 0) === (dt.item - 0)) elem.dataset.state = dt.state;
    });
  }

  _handleEvents() {
    // 月送りの操作受付
    super._handleEvents();

    // アイテム選択 (メインページのみ)
    this._select = document.getElementById('select');
    if (this._select) {
      // オプション挿入
      this._insertMenu();

      // アイテムを変更したとき、カレンダーを更新
      this._select.addEventListener('change', () => {
        this._item = select.value;
        this._makeCalendar(this._year, this._month);
      });
    }

    // モード選択
    this._mode = document.getElementById('mode');
    if (this._mode) {
      this._mode.addEventListener('change', () => {
        // カレンダーのクラスを反映
        this._elem.classList.toggle('--editMode');
      });
    }

    // セルのデータ操作受付
    this._body.addEventListener('click', (event) => this._cellClickHandler(event));
  }

  async _insertMenu() {
    const res = await fetch(`./api/fetch.php`);
    const items = await res.json();
    items.forEach ((item) => {
      const option = document.createElement('option');
      option.setAttribute('value', item.id);
      option.textContent = item.title;
      this._select.appendChild(option);
    });
  }

  _cellClickHandler(event) {
    // 編集モード時のみ受付
    if (!(this._mode.value - 0)) return;

    const target = event.target;

    if (target.dataset.date && target.dataset.item && target.dataset.state) {
      let state = target.dataset.state;
      state++;
      state = state % 5;
      target.dataset.state = state;
    } else if (target.dataset.date) {
      target.dataset.state = 1;
    }

    const date = target.dataset.date;
    const item = target.dataset.item;
    const state = target.dataset.state;

    if (date && state) {
      const postData = new FormData;
      postData.set('date', date);
      postData.set('item', item);
      postData.set('state', state);

      fetch(`./api/manipulate.php`, {
        method: 'POST',
        body: postData
      });
    }
  }
}
