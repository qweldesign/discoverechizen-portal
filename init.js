/**
 * Init
 * Author: Taigo Ito (https://qwel.design/)
 * Location: Fukui, Japan
 */

import {root, cardsUrl, apiKey, token} from './config.js';
import RenderItems from './modules/renderItems.js';
import Modal from './modules/modal.js';
import CustomCalendar from './modules/customCalendar.js';
import Router from './modules/router.js';
import EvilIcons from './modules/evilIcons.js';

(async () => {
  const res = await fetch(`${root}php/api.php?method=fetch&target=activities`);
  const activities = await res.json();
  new RenderItems(activities);
  
  new Modal();
  
  const res1 = await fetch(`${root}php/api.php?method=fetch&target=master`);
  const items = await res1.json();
  const res2 = await fetch(`${cardsUrl}?key=${apiKey}&token=${token}`);
  const data = await res2.json();
  new CustomCalendar({
    root: root,
    items: items,
    data: data
  });
})();

new Router();

new EvilIcons();
