class Element {

  element;

  create(
    tagName,
    id = '',
    classNames = [],
    styles = {},
    text = '',
    children = [],
    allowHtml = false
  ) {
    const ELEMENT = document.createElement(tagName);

    ELEMENT.id = id;

    classNames.forEach(function(className) {
      ELEMENT.classList.add(className);
    });

    for (const style in styles) {
      ELEMENT.style.setProperty(style, styles[style], 'important');
    }

    if (allowHtml) {
      ELEMENT.innerHTML = text;
    } else {
      ELEMENT.innerText = text;
    }

    children.forEach(function(child) {
      ELEMENT.appendChild(child);
    });

    return ELEMENT;
  }

}

export default Element;