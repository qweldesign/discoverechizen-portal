/**
 * Init
 * Author: Taigo Ito (https://qwel.design/)
 * Location: Fukui, Japan
 */

import {root} from '../config.js';
import MasterEdit from "../modules/masterEdit.js";
import Router from '../modules/router.js';

new MasterEdit({
  root: root
});

new Router();
