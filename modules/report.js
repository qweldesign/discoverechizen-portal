/**
 * Report
 * Author: Taigo Ito (https://qwel.design/)
 * Location: Fukui, Japan
 */

export default class Report {
  constructor(data) {
    this._elem = document.getElementById('report');
    this._template = document.getElementById('reportTemplate');
    this._renderTemplate(data);
  }

  _renderTemplate(data) {
    data.forEach((dt) => {
      // 表示条件
      const len = dt.info.length;
      const isDisplay = (dt.info[len - 1].name) === '表示有無';
      if (isDisplay) {
        // テンプレートからNodeを作成
        const item = document.importNode(this._template.content, true);
        this._createInfoSection(item, dt.info);
        this._createActivitySection(item, dt.activity);
        this._createNoteSection(item, dt.note);
        // Node挿入
        this._elem.appendChild(item);
      }
    });
  }

  _createInfoSection(item, arr) {
    const section = item.querySelector('.report__info');

    // 情報タイトルと情報を順次挿入
    const len = arr.length - 1; // 表示有無は除く
    for (let i = 1; i < len; i++) {
      const tr = document.createElement('tr');
      const th = document.createElement('th');
      th.textContent = arr[i].name;
      tr.appendChild(th);
      const td = document.createElement('td');
      td.textContent = arr[i].content;
      tr.appendChild(td);
      section.appendChild(tr);
    }
  }

  _createActivitySection(item, arr) {
    const section = item.querySelector('.report__activity');

    // 体験名と情報を順次挿入
    const len = arr.length;
    for (let i = 0; i < len; i++) {
      const tr = document.createElement('tr');
      const th = document.createElement('th');
      th.textContent = arr[i].name;
      tr.appendChild(th);
      const td = document.createElement('td');
      td.textContent = arr[i].content;
      tr.appendChild(td);
      section.appendChild(tr);
    }
  }

  _createNoteSection(item, arr) {
    const section = item.querySelector('.report__note');

    // メモを順次挿入
    const len = arr.length;
    for (let i = 0; i < len; i++) {
      const li = document.createElement('li');
      li.textContent = arr[i];
      section.appendChild(li);
    }
  }
}
