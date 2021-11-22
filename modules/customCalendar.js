/**
 * Custom Calendar
 * Author: Taigo Ito (https://qwel.design/)
 * Location: Fukui, Japan
 */

import Calendar from "./calendar.js";

export default class CustomCalendar extends Calendar {
  async makeCalendar(year, month) {
    super.makeCalendar(year, month);
    this._setStatus(year, month);
  }

  _handleEvents() {
    super._handleEvents();

    // アイテムの選択受付
    this._select = document.getElementById('select');
    if (this._select) {
      // ハッシュと選択アイテムの初期化
      this.init();

      // アイテムを変更したとき、ハッシュを更新
      this._select.addEventListener('change', () => {
        location.hash = this._select.value;
      });

      // ハッシュを変更したとき(ハッシュが整数型の場合)、カレンダーを更新
      window.addEventListener('hashchange', () => this.hashChangeHandler());
    }

    // モードの選択受付
    const mode = document.getElementById('mode');
    mode.addEventListener('change', () => {
      this._elem.classList.toggle('--editMode');
    });

    // セルのデータ操作受付
    this._body.addEventListener('click', (event) => this._cellClickHandler(event));
  }

  hashChangeHandler() {
    const hash = location.hash;
    const index = hash.slice(1) - 0;
    if (this._select && Number.isInteger(index)) {
      this.init();
      this.makeCalendar(this.year, this.month);
    }
  }

  init() {
    // ハッシュの初期化
    const hash = location.hash;
    if (!hash)　location.hash = '1';

    // 選択アイテムを追加
    this._options.items.forEach((dt, i) => {
      const option = document.createElement('option');
      option.setAttribute('value', dt.id);
      option.textContent = dt.name;
      this._select.appendChild(option);
      // 選択の初期化
      if (hash.slice(1) === dt.id) this._select.options[i].selected = true;
    });
  }

  _setStatus(year, month) {
    this._setDefaultStatus(month);
    this._setEnteredStatus(year, month);
  }

  _setDefaultStatus(month) {
    const data = this._options.items;
    const elems = this._body.querySelectorAll('[data-date]');
    elems.forEach((td) => {
      // マスターデータから参照するレコードを取得
      const hash = location.hash;
      const itemId = (td.dataset.item || hash.slice(1)) - 0;
      let item = {};
      data.forEach((dt) => {
        if (itemId === dt.id - 0) item = dt;
      });
      const date = td.dataset.date;
      const day = date.slice(8) - 0;
      // 月のデフォルト値
      let state = item[`reception_month_${('00' + month).slice(-2)}`] - 0;
      // 月のデフォルト値から空きがない場合
      if (day <= 15 && state >= 6 || day > 15 && state % 3 === 2) {
        state = 8;
      } else {
        // 週のデフォルト値
        const week = td.dataset.week;
        state = item[`reception_week_${week}`] - 0;
      }
      td.dataset.state = state;
    });
  }

  async _setEnteredStatus(year, month) {
    const res = await fetch(`${this._options.root}php/api.php?method=fetch&target=status&year=${year}&month=${month + 1}`);
    const status = await res.json();

    status.forEach((dt) => {
      let selector = `[data-date="${dt.date}"]`;
      if (this._options.type === 'large') {
        selector = `${selector}[data-item="${dt.item}"]`;
        const td = this._body.querySelector(selector);
        td.dataset.state = dt.state;
      } else {
        const hash = location.hash;
        if (hash.slice(1) === dt.item) {
          const td = this._body.querySelector(selector);
          td.dataset.state = dt.state;
        }
      }
    });
  }

  _cellClickHandler(event) {
    // 編集モード時のみ受付
    if (!(this._elem.classList.contains('--editMode'))) return;

    // aタグの操作を受付停止
    const target = event.target;
    if (target.getAttribute('href')) {
      event.preventDefault();
      return;
    }

    const hash = location.hash;
    const date = target.dataset.date;
    const item = target.dataset.item || hash.slice(1);

    let state = target.dataset.state;
    state++;
    state = state % 9;
    target.dataset.state = state;

    if (date && state) {
      const postData = new FormData;
      postData.set('date', date);
      postData.set('item', item);
      postData.set('state', state);

      fetch(`${this._options.root}php/api.php?method=insert&target=status`, {
        method: 'POST',
        body: postData
      });
    }
  }
}
