/**
 * Modal
 * Author: Taigo Ito (https://qwel.design/)
 * Location: Fukui, Japan
 */

export default class Modal {
  constructor(options = {}) {
    this._elem = options.elem || document.getElementById('modal');
    this._inner = options.inner || document.getElementById('modalInner');
    this._video = options.video || document.getElementById('video');
    this._overlay = options.overlay || document.getElementById('modalOverlay');
    this._close = options.close || document.getElementById('modalClose');
    this._toggler = options.toggler || document.querySelectorAll('[data-toggle="modal"');
    this._isShown = false;

    if (!this._elem.classList.contains('--collapse')) {
      this._elem.classList.add('--collapse');
    }
    if (!this._inner.classList.contains('--hide')) {
      this._inner.classList.add('--hide');
    }
    if (!this._overlay.classList.contains('--collapse')) {
      this._overlay.classList.add('--collapse');
    }
    if (!this._close.classList.contains('--collapse')) {
      this._close.classList.add('--collapse');
    }

    this._handleEvents();
  }

  _handleEvents() {
    this._toggler.forEach((elem) => {
      elem.addEventListener('click', (event) => {
        event.preventDefault();
        if (this._isShown) {
          this._hide();
        } else {
          this._show();
        }
      });
    });
  }

  _show() {
    this._transitionEnd(this._elem, () => {
      this._elem.classList.remove('--collapse');
      this._overlay.classList.remove('--collapse');
    }).then(() => {
      this._inner.classList.remove('--hide');
      this._close.classList.remove('--collapse');
      this._video.play();
    });
    this._isShown = true;
  }

  _hide() {
    this._transitionEnd(this._inner, () => {
      this._video.pause();
      this._inner.classList.add('--hide');
      this._close.classList.add('--collapse');
    }).then(() => {
      this._elem.classList.add('--collapse');
      this._overlay.classList.add('--collapse');
    });
    this._isShown = false;
  }

  _transitionEnd(elem, func) {
    let callback;
    const promise = new Promise((resolve, reject) => {
      callback = () => resolve(elem);
      elem.addEventListener('transitionend', callback);
    });
    func();
    promise.then((elem) => {
      elem.removeEventListener('transitionend', callback);
    });
    return promise;
  }
}
