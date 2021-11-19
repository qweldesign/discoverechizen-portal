/**
 * Init
 * Author: Taigo Ito (https://qwel.design/)
 * Location: Fukui, Japan
 */

import {root, cardsUrl, apiKey, token} from '../config.js';
import CustomCalendar from '../modules/customCalendar.js';

(async () => {
  const res = await fetch(`${cardsUrl}?key=${apiKey}&token=${token}`);
  const data = await res.json();
  new CustomCalendar({
    root: root,
    data: data,
    type: 'large'
  });
})();
