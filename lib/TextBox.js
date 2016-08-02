'use strict';

var assign = require('lodash/object/assign'),
    domEvent = require('min-dom/lib/event'),
    domRemove = require('min-dom/lib/remove');

function stopPropagation(event) {
  event.stopPropagation();
}


/**
 * Initializes a container div 'contentContainer' which contains an editable content div 'content'.
 *
 * @param {object} options
 * @param {DOMElement} options.container The DOM element to append the contentContainer to
 * @param {String} options.keyHandler
 */
function TextBox(options) {

  this.container = options.container;

  this.contentContainer = document.createElement('div');
  this.content = document.createElement('div');

  this.content.contentEditable = 'true';

  this.contentContainer.appendChild(this.content);

  this.keyHandler = options.keyHandler || function() {};
}

module.exports = TextBox;


TextBox.prototype.create = function(bounds, style, value) {

  var content = this.content,
      contentContainer = this.contentContainer,
      container = this.container;

  assign(contentContainer.style, {
    width: bounds.width + 'px',
    height: bounds.height + 'px',
    left: bounds.x + 'px',
    top: bounds.y + 'px',
    backgroundColor: '#ffffff',
    position: 'absolute',
    overflowY: 'auto',
    display: 'table'
  });

  assign(content.style, {
    wordWrap: 'normal',
    textAlign: 'center',
    outline: '0px solid transparent',
    border: '1px solid #ccc',
    display: 'table-cell', // needed for vertical alignment
    verticalAlign: 'middle'
  }, style || {});

  content.innerText = value;
  content.title = 'Press SHIFT+Enter for line feed';

  domEvent.bind(contentContainer, 'keydown', this.keyHandler);
  domEvent.bind(contentContainer, 'mousedown', stopPropagation);

  container.appendChild(contentContainer);

  var self = this;

  setTimeout(function() {
    if (contentContainer.parent) {
      content.select();
    }
    self.setCursor();
  }, 100);
};


TextBox.prototype.destroy = function() {
  var content = this.content,
      contentContainer = this.contentContainer;

  content.innerText = '';

  domEvent.unbind(contentContainer, 'keydown', this.keyHandler);
  domEvent.unbind(contentContainer, 'mousedown', stopPropagation);

  domRemove(contentContainer);
};


TextBox.prototype.getValue = function() {
  return this.content.innerText;
};


/**
 * Set the cursor to the end of the text
 */
TextBox.prototype.setCursor = function() {

  var range = document.createRange();

  range.selectNodeContents(this.content);
  range.collapse(false);

  var selection = window.getSelection();

  selection.removeAllRanges();
  selection.addRange(range);
};
