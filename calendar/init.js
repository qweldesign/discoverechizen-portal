/**
 * Init
 * Author: Taigo Ito (https://qwel.design/)
 * Location: Fukui, Japan
 */

import {root, cardsUrl, apiKey, token} from '../config.js';
import EventCalendar from '../modules/eventCalendar.js';

(async () => {
  const res = await fetch(`${cardsUrl}?key=${apiKey}&token=${token}`);
  const data = await res.json();
  new EventCalendar({
    root: root,
    data: data,
    type: 'large'
  });
})();
