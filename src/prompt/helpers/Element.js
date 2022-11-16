class Element {

  element;

  create(
    tagName,
    classNames = [],
    styles = {},
    text = '',
    children = [],
    allowHtml = false
  ) {
    const ELEMENT = document.createElement(tagName);

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