import { buildMessage, isString, ValidateBy, ValidationOptions } from 'class-validator';

export function IsNotBlankString(validationOptions?: ValidationOptions): PropertyDecorator {
  return ValidateBy(
    {
      name: 'isNotBlankString',
      validator: {
        validate: (value): boolean => isString(value) && value !== '',
        defaultMessage: buildMessage(
          (eachPrefix) => eachPrefix + '$property should not be a blank string',
          validationOptions,
        ),
      },
    },
    validationOptions,
  );
}
