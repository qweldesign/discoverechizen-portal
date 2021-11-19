/**
 * Router
 * Author: Taigo Ito (https://qwel.design/)
 * Location: Fukui, Japan
 */

export default class Router {
  constructor() {
    const elems = document.querySelectorAll('.subMenu a');
    console.log(elems);
    elems.forEach((elem) => {
      elem.addEventListener(('click'), (event) => {
        event.preventDefault();
        const target = event.currentTarget;
        const hash = location.hash;
        const href = `${target.getAttribute('href')}${hash}`;
        location.href = href;
      });
    });
  }
}
