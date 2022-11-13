import Span from "../helpers/Span.js"

class Header {

  static create(headerText) {
    return Span.create(
      headerText,
      [],
      {
        'display': 'block',
        'font-size': '1.15em',
        'font-weight': 'bold',
        'font-family': 'sans-serif',
        'color': '#fff',
        'text-align': 'center',
        'background-color': '#1484c8',
        'border-radius': '4px',
        'padding': '4px',
      }
    );
  }

}

export default Header;