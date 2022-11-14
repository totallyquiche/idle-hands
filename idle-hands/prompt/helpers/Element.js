class Element {

  static create(
    tagName,
    id = '',
    classNames = [],
    styles = {},
    html = '',
    children = []
  ) {
    const ELEMENT = document.createElement(tagName);

    ELEMENT.id = id;

    classNames.forEach(function(className) {
      ELEMENT.classList.add(className);
    });

    for (const style in styles) {
      ELEMENT.style.setProperty(style, styles[style], 'important');
    }

    ELEMENT.innerHTML = html;

    children.forEach(function(child) {
      ELEMENT.appendChild(child);
    });

    return ELEMENT;
  }

}

export default Element;