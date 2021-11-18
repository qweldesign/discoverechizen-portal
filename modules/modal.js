/**
 * Modal
 * Author: Taigo Ito (https://qwel.design/)
 * Location: Fukui, Japan
 */

export default class Modal {
  constructor(options = {}) {
    this._elem = options.elem || document.getElementById('modal');
    this._inner = options.inner || document.getElementById('modalInner');
    this._content = options.content || document.getElementById('modalContent');
    this._overlay = options.overlay || document.getElementById('modalOverlay');
    this._close = options.close || document.getElementById('modalClose');
    this._prev = options.prev || document.getElementById('modalPrev');
    this._next = options.next || document.getElementById('modalNext');
    this._toggler = options.toggler || document.querySelectorAll('[data-toggle="modal"');
    this._slider = options.slider || document.querySelectorAll('[data-slide]');
    this._isShown = false;
    this._isPlayVideo = false;

    if (!this._elem.classList.contains('--collapse')) {
      this._elem.classList.add('--collapse');
    }
    if (!this._inner.classList.contains('--hide')) {
      this._inner.classList.add('--hide');
    }
    if (!this._overlay.classList.contains('--hide')) {
      this._overlay.classList.add('--hide');
    }
    if (!this._overlay.classList.contains('--collapse')) {
      this._overlay.classList.add('--collapse');
    }
    if (!this._close.classList.contains('--collapse')) {
      this._close.classList.add('--collapse');
    }
    if (!this._prev.classList.contains('--collapse')) {
      this._prev.classList.add('--collapse');
    }
    if (!this._next.classList.contains('--collapse')) {
      this._next.classList.add('--collapse');
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
          const target = event.currentTarget;
          const index = target.dataset.target;
          this._show(index);
        }
      });
    });

    this._slider.forEach((elem) => {
      elem.addEventListener('click', (event) => {
        event.preventDefault();
        const target = event.currentTarget;
        const size = target.dataset.slide;
        this._slide(size);
      });
    });
  }

  _show(index) {
    this._index = index - 0;
    const section = this._content.querySelector(`[data-index="${this._index}"`);
    const clone = section.cloneNode(true);
    this._inner.appendChild(clone);
    this._transitionEnd(this._elem, () => {
      this._elem.classList.remove('--collapse');
      this._overlay.classList.remove('--collapse');
    }).then(() => {
      this._inner.classList.remove('--hide');
      this._overlay.classList.remove('--hide');
      this._close.classList.remove('--collapse');
      this._prev.classList.remove('--collapse');
      this._next.classList.remove('--collapse');
      this._video = clone.querySelector('video');
      this._play();
    });
    this._isShown = true;
  }

  _hide() {
    this._transitionEnd(this._inner, () => {
      this._inner.classList.add('--hide');
      this._overlay.classList.add('--hide');
      this._close.classList.add('--collapse');
      this._prev.classList.add('--collapse');
      this._next.classList.add('--collapse');
    }).then(() => {
      this._elem.classList.add('--collapse');
      this._overlay.classList.add('--collapse');
      this._inner.innerHTML = '';
    });
    this._parse();
    this._isShown = false;
  }

  _slide(size) {
    this._index = this._index + (size - 0);
    const section = this._content.querySelector(`[data-index="${this._index}"`);
    const clone = section.cloneNode(true);
    this._parse();
    this._transitionEnd(this._inner, () => {
      this._inner.classList.add('--hide');
    }).then(() => {
      this._inner.innerHTML = '';
      this._inner.appendChild(clone);
      this._inner.classList.remove('--hide');
      this._video = clone.querySelector('video');
      this._play();
    });
  }

  _play() {
    if (this._video) {
      this._video.play();
      this._isPlayVideo = true;
    }
  }

  _parse() {
    if (this._isPlay) {
      this._video.parse();
      this._isPlayVideo = false;
    }
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
