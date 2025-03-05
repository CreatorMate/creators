// import type {
//   FieldType,
//   Field,
//   TextField,
//   DateField,
//   MultiChoiceField,
//   TextAreaField,
// } from "~/src/modules/Onboarding/types/onboardingTypes";
//
// /**
//  * Validation result type. Requires a boolean `valid` attribute, representing whether the field is valid, as well as
//  * an optional `error` attribute, representing the error message as a string.
//  */
// type ValidationResult = {
//   valid: boolean;
//   error?: string;
// };
//
// const validators: {
//   [key: string]: (field: Field, answer: FieldType) => ValidationResult;
// } = {
//   /**
//    * Validate text fields
//    */
//   text: (field, answer) => {
//     // Type assertion
//     const textField = field as TextField;
//     const textAnswer = answer as string;
//     if (textAnswer === undefined || textAnswer === "") {
//       return {
//         valid: false,
//         error: "This field cannot be empty",
//       };
//     }
//     if (
//       textField.maxLength !== undefined &&
//       textAnswer.length > textField.maxLength
//     ) {
//       return {
//         valid: false,
//         error: `Answer must not exceed ${textField.maxLength} characters`,
//       };
//     }
//     return { valid: true };
//   },
//   date: (field, answer) => {},
//   "multi-choice": (field, answer) => {},
//   textarea: (field, answer) => {},
// };
