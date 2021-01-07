import Accordion from './modules/Accordion'
import Modal from './modules/Modal'


const accordions = document.querySelectorAll('.accordion');

console.log(accordions);

for (let i = 0; i < accordions.length; i++) {
  new Accordion({
    // Accordion group node
    accordion: accordions[i],
    // Identifier of the individual accordion item node within the group node
    item_class: '.accordion__item',
    // Class of the content section within the individual accordion item
    content_class: '.accordion__content',
    // Class of the trigger within the individual accordion item
    trigger_class: '.accordion__trigger',
    // Class to be added to the content section when active
    content_active_class: 'accordion__content--active',
    // Class to be added to the individual accordion item when active
    open_class: 'open',
    // Whether to open the first accordion item on page load
    open_first: accordions[i].getAttribute('data-open-first'),
    // Whether to collapse other accordions when one opened
    collapse_others: true
  });
}