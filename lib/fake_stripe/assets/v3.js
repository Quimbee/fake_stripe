class FakeStripeElement extends EventTarget {
  constructor(type) {
    super();
    this.type = type;
  }

  on(eventName) {
  }

  mount(el) {
    if (typeof el === "string") {
      el = document.querySelector(el);
    }

    switch(this.type) {
      case "card":
        el.innerHTML = `
          <input name="cardnumber" type="text" placeholder="Card number" size="16">
          <input name="exp-date" type="text" placeholder="MM/YY" size="6">
          <input name="cvc" type="text" placeholder="CVC" size="3">
        `;
        break;

      case "cardNumber":
        el.innerHTML = '<input name=\"cardnumber\" type=\"text\" />';
        break;

      case "cardExpiry":
        el.innerHTML = '<input name=\"exp-date\" type=\"text\"\" />';
        break;

      case "cardCvc":
        el.innerHTML = '<input name=\"cvc\" type=\"text\" />';
    }
  }
}

window.Stripe = () => {
  const fetchLastFour = () => {
    return document.getElementsByName("cardnumber")[0].value.substr(-4, 4);
  };

  return {
    paymentRequest: (options) => {
      return {
        on: (eventName) => { },
        canMakePayment: () => {
          return new Promise((resolve) => resolve(true));
        }
      };
    },

    elements: () => {
      return {
        create: (type, options) => new FakeStripeElement(type)
      };
    },

    createToken: (cardElement) => {
      return new Promise(resolve => {
        resolve({ token: { id: "tok_123", card: { last4: fetchLastFour() } } });
      });
    }
  };
};
