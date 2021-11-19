/**
 * Init
 * Author: Taigo Ito (https://qwel.design/)
 * Location: Fukui, Japan
 */

import {root, cardsUrl, apiKey, token} from '../config.js';
import CustomCalendar from '../modules/customCalendar.js';
import Router from '../modules/router.js';

(async () => {
  const res1 = await fetch(`${root}php/api.php?method=fetch&target=master`);
  const items = await res1.json();
  const res2 = await fetch(`${cardsUrl}?key=${apiKey}&token=${token}`);
  const data = await res2.json();
  new CustomCalendar({
    root: root,
    items: items,
    data: data,
    type: 'large'
  });
})();

new Router();
