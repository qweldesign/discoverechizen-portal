/**
 * Render Items
 * Author: Taigo Ito (https://qwel.design/)
 * Location: Fukui, Japan
 */

export default class RenderItems {
  constructor(items = []) {
    this._table = document.getElementById('activitiesTable');
    this._tableRowTemplate = document.getElementById('activitiesTableRowTemplate');
    this._section = document.getElementById('modalContent');
    this._sectionTemplate = document.getElementById('sectionTemplate');

    // 静的に作られたセクションをカウント
    const sections = document.querySelectorAll('[data-index]');
    const startIndex = sections.length + 1;

    this._renderItems(items, startIndex);
  }

  _renderItems(items, startIndex) {
    const fields = {
      'fullname': '体験名',
      'company': '運営事業者',
      'sdgs_summary': 'SDGsの観点',
      'capacity': '定員',
      'duration': '所要時間'
    };

    items.forEach((item) => {
      // Table row
      const tableRowClone = document.importNode(this._tableRowTemplate.content, true);
      Object.keys(fields).forEach((key) => {
        const td = tableRowClone.querySelector(`.activitiesList__${key}`);
        td.textContent = item[key];
      });
      this._table.appendChild(tableRowClone);
      
      // .section
      const sectionClone = document.importNode(this._sectionTemplate.content, true);
      const section = sectionClone.querySelector('.section');
      section.dataset.index = startIndex++;

      // .section__heading
      const heading = sectionClone.querySelector('.section__heading');
      heading.textContent = item.fullname;

      // .section__image
      const image = sectionClone.querySelector('.section__image');
      image.setAttribute('src', './assets/members.jpg');

      // .section__content
      const content = sectionClone.querySelector('.section__content');
      content.textContent = item.message;

      this._section.appendChild(sectionClone);

    });
  }
}
