class Element {

  static create(
    tagName,
    id = '',
    classNames = [],
    styles = {},
    text = '',
    children = []
  ) {
    const ELEMENT = document.createElement(tagName);

    ELEMENT.id = id;

    classNames.forEach(function(className) {
      ELEMENT.classList.add(className);
    });

    for (const style in styles) {
      ELEMENT.style[style] = styles[style];
    }

    ELEMENT.innerText = text;

    children.forEach(function(child) {
      ELEMENT.appendChild(child);
    });

    return ELEMENT;
  }

}

export default Element;