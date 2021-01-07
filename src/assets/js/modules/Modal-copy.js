// const Modal = class {
//   constructor(s) {
//     this.s = s;
//     this.modal = document.getElementById(this.s.trigger.getAttribute(this.s.modal_id_attr));
//     console.log(this.s.trigger);

//     // If corrosponding modal for trigger is found initialise functionality
//     if(this.modal) {
//       this.modal_close_button = this.modal.querySelectorAll(this.s.close_button)[0];
//       this.focusable_elems = [];
//       this.last_focussed_elem = false;
//       this.body = document.getElementsByTagName('body')[0];

//       this.open_modal = this.open_modal.bind(this);
//       this.close_modal = this.close_modal.bind(this);
//       this.find_focusable_elements = this.find_focusable_elements.bind(this);
//       this.trap_focus = this.trap_focus.bind(this);
//       this.handle_keypress = this.handle_keypress.bind(this);

//       this._init_events()
//     }
//   }

//   _init_events() {
//     // Attach on click events
//     this.s.trigger.onclick = this.open_modal;
//     this.modal_close_button.onclick = this.close_modal;
//   }

//   trap_focus(e) {
//     if (this.modal.contains(e.target)) {
//       // Don't interfere - new focussed element is still within modal
//       // Store last focussed element
//       this.last_focussed_elem = e.target;
//     } else {
//       if(this.last_focussed_elem === this.focusable_elems[0]) {
//         // If last focussed element was the first focusable element in modal and have left modal
//         // Focus on the last available element in modal
//         this.focusable_elems[this.focusable_elems.length - 1].focus();
//         // Store new last focussed element
//         this.last_focussed_elem = this.focusable_elems[this.focusable_elems.length - 1];
//       }
//       else if(this.last_focussed_elem === this.focusable_elems[this.focusable_elems.length - 1]) {
//         // If last focussed element was the last focusable element in modal and have left modal
//         // Focus on the first available element in modal
//         this.focusable_elems[0].focus();
//         // Store new last focussed element
//         this.last_focussed_elem = this.focusable_elems[0];
//       }
//     }

//   }

//   open_modal(e) {
//     // Add class to body to disable scroll while modal is open
//     this.body.classList.add(this.s.body_class);

//     // If the modals parent element doesn't contain the backdrop class
//     if(!this.modal.parentNode.classList.contains(this.s.backdrop_class)) {
//       // Create backdrop div node
//       this.backdrop_node = document.createElement('div');
//       // Give it the backdrop class
//       this.backdrop_node.className = this.s.backdrop_class;
//       // Insert backdrop node before the modal element
//       this.modal.parentNode.insertBefore(this.backdrop_node, this.modal);
//       // Move the modal node within the backdrop node
//       this.backdrop_node.appendChild(this.modal);
//     } else {
//       // If the parent node does contain the backdrop class then use that node
//       this.backdrop_node = this.modal.parentNode;
//     }

//     console.log(this.backdrop_node);
//     console.log(this.backdrop_node.classList);

//     // Add active class to backdrop node
//     this.backdrop_node.classList.add(this.s.backdrop_active_class);

//     // Remove hidden class from modal node
//     this.modal.classList.remove(this.s.modal_hidden_class);

//     // Remove any previously stored focusable elems
//     this.focusable_elems = [];
//     // Find all focusable elements within modal and store
//     this.find_focusable_elements(this.modal);

//     // Attach esc key detection
//     document.addEventListener('keyup', this.handle_keypress);

//     // If at least one focusable element found
//     if(this.focusable_elems.length > 0) {
//       // Attach listener to focus to trap focus within the modal
//       document.addEventListener('focus', this.trap_focus, true);
//       // Focus to first found focusable element
//       this.focusable_elems[0].focus();
//       // Store focussed element
//       this.last_focussed_elem = this.focusable_elems[0];
//     }
//   }

//   close_modal() {
//     // Remove class from body to enable scroll while modal is closed
//     this.body.classList.remove(this.s.body_class);

//     console.log(this.backdrop_node);
//     console.log(this.backdrop_node.classList);

//     // Remove active class from backdrop
//     this.backdrop_node.classList.remove(this.s.backdrop_active_class);

//     // Add hidden class to modal node
//     this.modal.classList.add(this.s.modal_hidden_class);

//     // Remove listener from focus to trap focus within the modal
//     document.removeEventListener('focus', this.trap_focus, true);

//     // Remove esc key detection
//     document.removeEventListener('keyup', this.handle_keypress);

//     // Focus on the trigger to return focus to original position in document
//     this.s.trigger.focus();
//   }

//   handle_keypress(e) {
//     var key = e.which || e.keyCode;

//     // If key pressed is esc key then close modal
//     if (key === 27) {
//       e.stopPropagation();
//       this.close_modal();
//     }
//   }

//   find_focusable_elements(element) {

//     // Loop through child nodes of passed element
//     for (var i = 0; i < element.childNodes.length; i++) {

//       // Store child node
//       const child = element.childNodes[i];

//       // If child node isn't text
//       if(child.nodeName !== '#text') {

//         // Attempt focus on element
//         let elem = this._attempt_focus(child);

//         // If focus was possible then add to collection of focusable elements
//         if(elem) {
//           this.focusable_elems.push(elem);
//         }

//         // If this node has child nodes, search for focusable elements within them
//         if(child.childNodes.length > 0) {
//           this.find_focusable_elements(child);
//         }
//       }
//     }
//   }

//   _attempt_focus(element) {
//     // Try to focus on element
//     try {
//       element.focus();
//     } catch (e) {
//     }

//     // If documents focussed element === passed element then focus was possible
//     // Return element if true, false if not
//     return (document.activeElement === element) ? element : false;
//   }
// }

// export default Modal;

// // Query all triggers for modals
// const modal_triggers = document.querySelectorAll('[data-modal-id]');

// console.log(modal_triggers);

// // Loop through modal triggers and initialise each
// for (let i = 0; i < modal_triggers.length; i++) {
//   new Modal({
//     // Pass trigger
//     trigger: modal_triggers[i],
//     // The attribute on the trigger which defines the id of the modal it relates to
//     modal_id_attr: 'data-modal-id',
//     // The class that hides the modal which should be removed / added
//     modal_hidden_class: 'hidden',
//     // The class of the backdrop for modals
//     backdrop_class: 'dialog-backdrop',
//     // The class that shows the modal backdrop
//     backdrop_active_class: 'active',
//     // The class / attribute of the modal close button
//     close_button: '.modal-close',
//     // The class that is added to the body to disable scroll
//     body_class: 'has-modal'
//   });
// }