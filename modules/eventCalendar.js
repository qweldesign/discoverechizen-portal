/**
 * Event Calendar
 * Author: Taigo Ito (https://qwel.design/)
 * Location: Fukui, Japan
 */

import Calendar from "./calendar.js";

export default class EventCalendar extends Calendar {
  async _makeCalendar(year, month) {
    // データベース接続API
    const res = await fetch(`${this._options.root}api/fetch.php?year=${year}&month=${month + 1}`);
    this._status = await res.json();
    
    if (this._options.type === 'large') {
      this._makeLargeCalendar(year, month);
    } else {
      super._makeCalendar(year, month);
    }
  }

  async _makeLargeCalendar(year, month) {
    // テキストラベルを変更
    this._prevText.textContent = this._months[(month + this._months.length - 1) % this._months.length];
    this._currentText.textContent = `${year}年 ${this._months[month]}`;
    this._nextText.textContent = this._months[(month + this._months.length + 1) % this._months.length];

    const startDate = new Date(year, month); // 月の初日
    const startDay = startDate.getDay(); // 初日の曜日
    const endDate = new Date(year, month + 1,  0); // 月の末日
    const endDayCount = endDate.getDate(); // 末日の日にち

    // Headに日にちを記載
    this._head.innerHTML = ''; // 現在の中身を削除
    const headRow = document.createElement('tr');
    let weekCount = startDay;
    for (let dayCount = 0; dayCount <= endDayCount; dayCount++) {
      const headCell = document.createElement('th');
      if (dayCount === 0) {
        headCell.textContent = '';
      } else {
        const week = this._weeks[weekCount % 7];
        let innerHTML = `${dayCount}<br>${week}`;
        headCell.innerHTML = innerHTML;
        headCell.dataset.date = this._parseDate(year, month, dayCount);
        this._setLink(headCell, innerHTML);
        if (weekCount % 7 === 0) {
          headCell.classList.add('--sun');
        } else if (weekCount % 7 === 6) {
          headCell.classList.add('--sat');
        }
        weekCount++;
      }
      headRow.appendChild(headCell);
    }
    this._head.appendChild(headRow);

    // Bodyに予定を記載
    this._body.innerHTML = ''; // 現在の中身を削除
    const res = await fetch(`${this._options.root}api/fetch.php`);
    const items = await res.json();
    items.forEach((dt) => {
      const bodyRow = document.createElement('tr');
      for (let dayCount = 0; dayCount <= endDayCount; dayCount++) {
        const bodyCell = document.createElement('td');
        if (dayCount === 0) {
          bodyCell.textContent = dt.title;
        } else {
          bodyCell.textContent = '';
          this._setData(bodyCell, year, month, dayCount, dt.id);
        }
        bodyRow.appendChild(bodyCell);
      }
      this._body.appendChild(bodyRow);
    });
  }

  _setData(elem, year, month, day, item = 0) {
    let setLink = false;
    if (!item) setLink = true;

    // 日にちをセット
    const date = this._parseDate(year, month, day);
    super._setData(elem, year, month, day);

    // アイテムIDをセット
    if (!item) {
      const select = document.getElementById('select');
      item = select.value || 1;
    }
    elem.dataset.item = item;

    // 状態をセット
    this._status.forEach((dt) => {
      if (date === dt.date && (item - 0) === (dt.item - 0)) elem.dataset.state = dt.state;
    });

    // 予定のリンクを挿入 (期限を設定済みのカードのみ)
    if (setLink) this._setLink(elem, day);
  }

  _setLink(elem, innerHTML) {
    this._options.data.forEach((dt) => {
      if (dt.due) {
        const date = dt.due.slice(0, 10);
        if (elem.dataset.date === date) {
          // 予定
          elem.innerHTML = `<a href="${dt.shortUrl}" target="_blank" title="${dt.name}">${innerHTML}</a>`;
        }
      }
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
    const res = await fetch(`${this._options.root}api/fetch.php`);
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

    // aタグの操作を受付停止
    const target = event.target;
    if (target.getAttribute('href')) {
      event.preventDefault();
      return;
    }

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

      fetch(`${this._options.root}api/manipulate.php`, {
        method: 'POST',
        body: postData
      });
    }
  }
}
