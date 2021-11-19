/**
 * Calendar
 * Author: Taigo Ito (https://qwel.design/)
 * Location: Fukui, Japan
 */

export default class Calendar {
  constructor(options = {}) {
    this._options = options;

    // 日本語表記の定義
    // 0: 1月, 1: 2月...なので注意
    this._months = [
      '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'
    ];
    this._weeks = [
      '日', '月', '火', '水', '木', '金', '土'
    ];

    // 要素の定義
    this._elem = document.getElementById('calendar');
    this._prev = document.getElementById('calendarPrev');
    this._next = document.getElementById('calendarNext');
    this._prevText = document.getElementById('calendarPrevText');
    this._currentText = document.getElementById('calendarCurrentText');
    this._nextText = document.getElementById('calendarNextText');
    this._head = document.getElementById('calendarHead');
    this._body = document.getElementById('calendarBody');

    // 現在年月を取得
    const today = new Date();
    this._year = today.getFullYear();
    this._month = today.getMonth();

    // カレンダーを作成
    this._makeCalendar(this._year, this._month);

    // 月送りの操作受付
    this._handleEvents();
  }

  _handleEvents() {
    // 前月
    this._prev.addEventListener('click', (event) => {
      event.preventDefault();
      this._month--;
      if (this._month < 0) {
        this._year--;
        this._month = this._months.length - 1; 
      }
      this._makeCalendar(this._year, this._month);
    });

    // 次月
    this._next.addEventListener('click', (event) => {
      event.preventDefault();
      this._month++;
      if (this._month > this._months.length - 1) {
        this._year++;
        this._month = 0; 
      }
      this._makeCalendar(this._year, this._month);
    });
  }

  _makeCalendar(year, month) {
    // テキストラベルを変更
    this._changeLabels(year, month);

    if (this._options.type === 'large') {
      // Headに曜日を記載
      this._makeLargeHead(year, month);
      // Bodyに日にちを記載
      this._makeLargeBody(year, month);
    } else {
      // Headに曜日を記載
      this._makeDefaultHead();
      // Bodyに日にちを記載
      this._makeDefaultBody(year, month);
    }
  }

  _changeLabels(year, month) {
    this._prevText.textContent = this._months[(month + this._months.length - 1) % this._months.length];
    this._currentText.textContent = `${year}年 ${this._months[month]}`;
    this._nextText.textContent = this._months[(month + this._months.length + 1) % this._months.length];
  }

  _makeDefaultHead() {
    // 現在の中身を削除
    this._head.innerHTML = '';
    // 一週間の行を作成
    const tr = document.createElement('tr');
    for (let i = 0; i < 7; i++) {
      // 一日の列に曜日を記載
      const th = document.createElement('th');
      th.textContent = this._weeks[i];
      tr.appendChild(th);
    }
    this._head.appendChild(tr);
  }

  _makeDefaultBody(year, month) {
    const startDate = new Date(year, month); // 月の初日
    const startDay = startDate.getDay(); // 初日の曜日
    const endDate = new Date(year, month + 1,  0); // 月の末日
    const endDayCount = endDate.getDate(); // 末日の日にち
    let dayCount = 1; // 日にちをカウント

    // 現在の中身を削除
    this._body.innerHTML = '';
    
    for (let j = 0; j < 6; j++) {
      // 一週間の行を作成
      const tr = document.createElement('tr');

      for (let i = 0; i < 7; i++) {
        //一日の列を作成
        const td = document.createElement('td');
        if (i < startDay && j === 0 || dayCount > endDayCount) {
          // 一週目で、初日の曜日に達するまでは空白
          // もしくは末日の日にちに達してからは空白
          td.innerHTML = '&nbsp;';
        } else {
          // 日にちを記載
          td.innerHTML = `<span>${dayCount}</span>`;
          // 日にち・曜日データをセット
          const date = this._parseDate(year, month, dayCount);
          td.dataset.date = date;
          const week = i;
          td.dataset.week = week;
          // 参照データからリンクをセット
          this._setLink(td, date);
          // 翌日へ
          dayCount++;
        }
        tr.appendChild(td);
      }
      this._body.appendChild(tr);
    }
  }

  _makeLargeHead(year, month) {
    const startDate = new Date(year, month); // 月の初日
    const startDay = startDate.getDay(); // 初日の曜日
    const endDate = new Date(year, month + 1,  0); // 月の末日
    const endDayCount = endDate.getDate(); // 末日の日にち

    // 現在の中身を削除
    this._head.innerHTML = '';

    // 一ヵ月の行を作成
    const tr = document.createElement('tr');
    let weekCount = startDay;
    for (let dayCount = 0; dayCount <= endDayCount; dayCount++) {
      // 一日の列を作成
      const th = document.createElement('th');
      if (dayCount === 0) {
        // 最初の列は見出し
        th.textContent = '';
      } else {
        // 日にちを記載
        const week = this._weeks[weekCount % 7];
        th.innerHTML = `<span>${dayCount}<br>${week}</span>`;
        // 曜日クラスをセット
        if (weekCount % 7 === 0) {
          th.classList.add('--sun');
        } else if (weekCount % 7 === 6) {
          th.classList.add('--sat');
        }
        // 参照データからリンクをセット
        const date = this._parseDate(year, month, dayCount);
        this._setLink(th, date);
        weekCount++;
      }
      tr.appendChild(th);
    }
    this._head.appendChild(tr);
  }

  _makeLargeBody(year, month) {
    const data = window.masterData;
    const startDate = new Date(year, month); // 月の初日
    const startDay = startDate.getDay(); // 初日の曜日
    const endDate = new Date(year, month + 1,  0); // 月の末日
    const endDayCount = endDate.getDate(); // 末日の日にち

    // 現在の中身を削除
    this._body.innerHTML = '';

    data.forEach((dt) => {
      // 一ヵ月の行を作成
      const tr = document.createElement('tr');
      let weekCount = startDay;
      for (let dayCount = 0; dayCount <= endDayCount; dayCount++) {
        // 一日の列を作成し、日にち・曜日・アイテムIDのデータをセット
        const td = document.createElement('td');
        if (!dayCount) {
          td.textContent = dt.name;
        } else {
          const date = this._parseDate(year, month, dayCount);
          td.dataset.date = date;
          const week = weekCount % 7;
          td.dataset.week = week;
          td.dataset.item = dt.id;
          weekCount++;
        }
        tr.appendChild(td);
      }
      this._body.appendChild(tr);
    });
  }

  _setLink(elem, date) {
    const data = this._options.data;
    data.forEach((dt) => {
      // 日にちに対応した予定のタイトル・URLをセット
      if (dt.due && date === dt.due.slice(0, 10)) {
        const span = elem.querySelector('span');
        elem.innerHTML = `<a href="${dt.shortUrl}" target="_blank" title="${dt.name}">${span.innerHTML}</a>`;
      }
    });
  }

  _parseDate(year, month, day) {
    return  `${year}-${('00' + (month + 1)).slice(-2)}-${('00' + day).slice(-2)}`;
  }
}
