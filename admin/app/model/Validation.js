class Validation {
  constructor() {
    this.validation = {
      name: {
        required: true,
        min: 3,
        max: 50,
      },
      price: {
        required: true,
        min: 1,
      },
      screen: {
        required: true,
        min: 1,
      },
      backCamera: {
        required: true,
        min: 1,
      },
      frontCamera: {
        required: true,
        min: 1,
      },
      img: {
        required: true,
      },
      desc: {
        required: true,
        min: 1,
      },
      type: {
        required: true,
        min: 1,
      },
    };
  }

  validate(product) {
    let errors = {};
    for (let key in this.validation) {
      if (this.validation[key].required && !product[key]) {
        errors[key] = `${key} is required`;
      } else if (
        this.validation[key].min &&
        product[key].length < this.validation[key].min
      ) {
        errors[
          key
        ] = `${key} must be at least ${this.validation[key].min} characters`;
      } else if (
        this.validation[key].max &&
        product[key].length > this.validation[key].max
      ) {
        errors[
          key
        ] = `${key} must be at most ${this.validation[key].max} characters`;
      } else if (
        this.validation[key].match &&
        product[key] !== product[this.validation[key].match]
      ) {
        errors[key] = `${key} does not match`;
      }
    }
    return errors;
  }

  validateEmail(email) {
    let re = /\S+@\S+\.\S+/;
    return re.test(email);
  }
}

export default Validation;
