/**
 * Init
 * Author: Taigo Ito (https://qwel.design/)
 * Location: Fukui, Japan
 */

import {ssUrl} from '../config.js';
import Report from '../modules/report.js';
import Router from '../modules/router.js';

const elem = document.getElementById('report');
elem.classList.add('--loading');
elem.textContent = 'データベースを読み込み中です。しばらくお待ちください。';

(async () => {
  const res = await fetch(ssUrl);
  const data = await res.json();
  elem.innerHTML = '';
  elem.classList.remove('--loading');
  new Report(data)
})();

new Router();
