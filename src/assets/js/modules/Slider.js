const Slider = class {
  constructor(s) {
    this.s = s;
    this.panels_wrapper = this.s.slider.querySelectorAll(this.s.panels_wrapper)[0];
    this.panels = Array.prototype.slice.call(this.s.slider.querySelectorAll(this.s.panels));
    this.active_slide = this.s.active_slide;
    this.prev_button = this.s.slider.querySelectorAll(this.s.prev_button)[0];
    this.next_button = this.s.slider.querySelectorAll(this.s.next_button)[0];
    this.navigation = this.s.slider.querySelectorAll(this.s.navigation)[0];
    this.transition_name = this.get_transition_event_name();
    this.reduced_motion = false;
    this.link_click = false;

    if(this.s.autoplay) {
      this.play_button = this.s.slider.querySelectorAll(this.s.play_button)[0];
      this.pause_button = this.s.slider.querySelectorAll(this.s.pause_button)[0];
      this.playing = true;
      this.autoplay_timer = false;
    }

    this.prev_slide = this.prev_slide.bind(this);
    this.next_slide = this.next_slide.bind(this);
    this.disable_buttons = this.disable_buttons.bind(this);
    this.check_buttons = this.check_buttons.bind(this);
    this.move_to_slide = this.move_to_slide.bind(this);
    this.set_timer = this.set_timer.bind(this);
    this.clear_timer = this.clear_timer.bind(this);
    this.pause_slider = this.pause_slider.bind(this);
    this.play_slider = this.play_slider.bind(this);
    this.hover_slider = this.hover_slider.bind(this);
    this.deactivate_slides = this.deactivate_slides.bind(this);
    this.build_nav = this.build_nav.bind(this);

    this._init_events();
  }

  _init_events() {

    this.prev_button.onclick = this.prev_slide;
    this.next_button.onclick = this.next_slide;

    const rm_query = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.reduced_motion = rm_query.matches;

    if(!this.reduced_motion) {
      this.panels_wrapper.addEventListener(this.transition_name, this.check_buttons);
      this.panels_wrapper.addEventListener(this.transition_name, this.transition_ended);
    }

    if(this.s.autoplay) {
      this.pause_button.setAttribute('aria-hidden', false);
      // this.s.slider.addEventListener('mouseenter', this.hover_slider);
      // this.s.slider.addEventListener('mouseleave', this.hover_slider);
      this.pause_button.addEventListener('click', this.pause_slider);
      this.play_button.addEventListener('click', this.play_slider);
      this.panels_wrapper.setAttribute('aria-live', 'off');
    }

    for (let s = 0; s < this.panels.length; s++) {
      // this.panels[s].style.left = (100 * s)+'%';
      this.panels[s].setAttribute('aria-hidden', true);
      this.panels[s].setAttribute('tabindex', '-1');
      this.panels[s].setAttribute('aria-label', 'Slide ' + (s + 1) + ' of ' + this.panels.length);
    }

    this.build_nav();

    // this.setTranslate('0%', '0%', this.panels_wrapper);
    this.check_buttons(true);
    this.move_to_slide(0, false);
  }

  transition_ended(e) {
    console.log(e)
  }

  build_nav() {
    for (let p = 0; p < this.panels.length; p++) {
      let button = document.createElement('button');
      button.textContent = p + 1;
      button.setAttribute('aria-label', 'Slide ' + (p + 1) + ' of ' + this.panels.length);

      this.navigation.appendChild(button);
      button.addEventListener('click', () => {
        this.link_click = true;
        this.pause_slider();
        this.move_to_slide(p, true);
      });
    }
  }

  get_transition_event_name() {
    const transitions = {
        "transition"      : "transitionend",
        "OTransition"     : "oTransitionEnd",
        "MozTransition"   : "transitionend",
        "WebkitTransition": "webkitTransitionEnd"
     }
    let bodyStyle = document.body.style;
    for(let transition in transitions) {
        if(bodyStyle[transition] != undefined) {
            return transitions[transition];
        }
    }
  }

  deactivate_slides() {
    for (let s = 0; s < this.panels.length; s++) {
      this.panels[s].setAttribute('aria-hidden', true);
      // this.panels[s].setAttribute('hidden', true);
    }
  }

  hover_slider() {
    if(this.playing) {
      this.pause_slider();
    } else {
      this.play_slider();
    }
  }

  pause_slider() {
    this.playing = false;
    this.pause_button.setAttribute('aria-hidden', true);
    this.play_button.setAttribute('aria-hidden', false);
    this.panels_wrapper.setAttribute('aria-live', 'polite');
    this.clear_timer();
  }

  play_slider(hovered) {
    this.playing = true;
    this.pause_button.setAttribute('aria-hidden', false);
    this.play_button.setAttribute('aria-hidden', true);
    this.panels_wrapper.setAttribute('aria-live', 'off');
    this.set_timer();
  }

  check_buttons(e) {
    if(e === true || e.propertyName === 'transform') {
      if(this.active_slide === this.panels.length - 1) {
        this.next_button.disabled = true;
      } else {
        this.next_button.disabled = false;
      }
      if(this.active_slide === 0) {
        this.prev_button.disabled = true;
      } else {
        this.prev_button.disabled = false;
      }

      if(this.s.autoplay && this.playing) {
        this.set_timer();
      }
    }

    if(this.link_click === true && e.propertyName === 'transform') {
      this.link_click = false;
      setTimeout(() => {
        this.panels[this.active_slide].focus();
      }, 100);
    }
  }

  clear_timer() {
    if(this.s.autoplay) {
      clearTimeout(this.autoplay_timer);
    }
  }

  set_timer() {
    this.playing = true;
    if(this.s.autoplay) {
      this.pause_button.setAttribute('aria-hidden', false);
      this.autoplay_timer = setTimeout(() => {
        this.playing = true;
        this.next_slide(true);
      }, this.s.autoplay_timing);
    }
  }

  disable_buttons() {
    this.prev_button.disabled = true;
    this.next_button.disabled = true;
  }

  prev_slide(e) {
    if(this.active_slide > 0) {
      this.move_to_slide(this.active_slide - 1, false);
    }
    else if(this.active_slide === 0 && e === true) {
      this.move_to_slide(this.panels.length - 1, false);
    }
  }

  next_slide(e) {
    if(this.active_slide < this.panels.length - 1) {
      this.move_to_slide(this.active_slide + 1, false);
    }
    else if(this.active_slide === this.panels.length - 1 && e === true) {
      this.move_to_slide(0, false);
    }
  }

  setTranslate(xPos, yPos, el) {
    el.style.transform = "translate3d(" + xPos + ", " + yPos + ", 0)";
  }

  move_to_slide(index, focus) {
    console.log('move to '+index);
    this.clear_timer();
    // this.disable_buttons();

    this.deactivate_slides();
    // this.panels[index].setAttribute('hidden', false);
    this.panels[index].setAttribute('aria-hidden', false);

    if(focus && this.reduced_motion) {
      setTimeout(() => {
        this.panels[index].focus();
      }, 100);
    }

    const perc = 100 * index;
    this.setTranslate('-' + perc + '%', '0', this.panels_wrapper);
    this.active_slide = index;

    if(this.s.auto_height) {
      var content_height = this.panels[index].clientHeight;
      this.panels_wrapper.style.maxHeight = content_height + 'px';
    }

    if(this.reduced_motion) {
      this.check_buttons(true);
    }
  }
};

export default Slider;

const sliders = document.querySelectorAll('.slider');

console.log(sliders);

for (let i = 0; i < sliders.length; i++) {
  new Slider({
    // Slider node
    slider: sliders[i],
    panels_wrapper: '.slider__panels',
    panels: '.slider__panel',
    navigation: '.slider__nav',
    active_slide: 0,
    prev_button: '.slider__action--prev',
    next_button: '.slider__action--next',
    auto_height: true,
    autoplay: true,
    autoplay_timing: 5000,
    play_button: '.slider__action--play',
    pause_button: '.slider__action--pause'
  });
}