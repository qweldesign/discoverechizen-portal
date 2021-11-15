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
    this._prevText.textContent = this._months[(month + this._months.length - 1) % this._months.length];
    this._currentText.textContent = `${year}年 ${this._months[month]}`;
    this._nextText.textContent = this._months[(month + this._months.length + 1) % this._months.length];

    // Headに曜日を記載
    this._head.innerHTML = ''; // 現在の中身を削除
    const headRow = document.createElement('tr');
    for (let i = 0; i < 7; i++) {
      const headCell = document.createElement('th');
      headCell.textContent = this._weeks[i];
      headRow.appendChild(headCell);
    }
    this._head.appendChild(headRow);

    // Bodyに日にちを記載
    const startDate = new Date(year, month); // 月の初日
    const startDay = startDate.getDay(); // 初日の曜日
    const endDate = new Date(year, month + 1,  0); // 月の末日
    const endDayCount = endDate.getDate(); // 末日の日にち
    let dayCount = 1; // 日にちをカウント

    this._body.innerHTML = ''; // 現在の中身を削除
    // 1週間を作成するループ
    for (let j = 0; j < 6; j++) {
      const bodyRow = document.createElement('tr');

      // 1日を作成するループ
      for (let i = 0; i < 7; i++) {
        const bodyCell = document.createElement('td');

        // 日にちの記載
        if (i < startDay && j === 0 || dayCount > endDayCount) {
          // 一週目で、初日の曜日に達するまでは空白
          // もしくは末日の日にちに達してからは空白
          bodyCell.innerHTML = '&nbsp;';
        } else {
          // 日にち
          bodyCell.innerHTML = `<span>${dayCount}</span>`;
          // データをセット
          this._setData(bodyCell, year, month, dayCount);
          // 翌日へ
          dayCount++;
        }
        // 1日を挿入
        bodyRow.appendChild(bodyCell);
      }
      // 1週間を挿入
      this._body.appendChild(bodyRow);
    }
  }

  _setData(elem, year, month, day) {
    const date = this._parseDate(year, month, day);
    elem.dataset.date = date;
    //
    // dataの処理をオーバーライド
    //
  }

  _parseDate(year, month, day) {
    return  `${year}-${('00' + (month + 1)).slice(-2)}-${('00' + day).slice(-2)}`;
  }
}
