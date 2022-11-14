import Span from "../helpers/Span.js"

class Header extends Span {

  constructor(text) {
    super(
      text,
      [],
      {
        'display': 'block',
        'font-size': '1.15em',
        'font-weight': 'bold',
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