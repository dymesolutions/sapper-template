import { SomeInterface, someMagicNumber } from "../SomeTsStuff/SomeTsStuff";

const someString: string = "someString";
const someNum: number = 12345;

// The follwing line should cause a TS error, due to incompatible types for the operation. Uncomment to test.
//const calculation: number = someNum * someString;

const someFunc = (inparam: SomeInterface) => {
  /* Uncomment to see spam in console
  console.log(
    `The param of type SomeInterface has a number ${
      inparam.someNumericAttribute
    } and a string '${inparam.someStringAttribute}'`
  );
  */
};

export default {
  oncreate() {
    // Don't do this in real life, mmmkay?
    this.interval = setInterval(() => {
      const numberToDisplay = this.get().magicnumber > 0 ? 0 : someMagicNumber;
      const ifObj: SomeInterface = {
        someNumericAttribute: numberToDisplay,
        someStringAttribute: `The number is ${numberToDisplay}`
      };
      someFunc(ifObj);
      this.set({
        magicnumber: ifObj.someNumericAttribute
      });
    }, 3000);
  },

  ondestroy() {
    clearInterval(this.interval);
  },

  data() {
    return {
      magicnumber: someMagicNumber
    };
  }
} as any; // as-any due to Svelte-specific stuffs such as oncreate, etc.
