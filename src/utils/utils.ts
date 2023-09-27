export const debounce = (func: Function, delay: number) => {
    let timer: number;
  
    return function(this: object) {
      const context = this;
      const args = arguments;
      clearTimeout(timer);
      timer = window.setTimeout(() => func.apply(context, args), delay);
    };
  };