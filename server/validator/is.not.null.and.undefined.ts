import { buildMessage, ValidateBy, ValidationOptions } from 'class-validator';

export function isNotNullAndUndefined(value: unknown): boolean {
  return value !== null && value !== undefined;
}

export function IsNotNullAndUndefined(validationOptions?: ValidationOptions): PropertyDecorator {
  return ValidateBy(
    {
      name: 'isNotNullAndUndefined',
      validator: {
        validate: (value): boolean => isNotNullAndUndefined(value),
        defaultMessage: buildMessage(
          (eachPrefix) => eachPrefix + '$property should not be null or undefined',
          validationOptions,
        ),
      },
    },
    validationOptions,
  );
}
