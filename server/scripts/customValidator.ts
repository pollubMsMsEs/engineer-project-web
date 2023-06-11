import { ExpressValidator } from "express-validator";
import { Types } from "mongoose";

export function ExtendedValidator(
    extraValidations: {
        [key: string]: (value: any) => Promise<void>;
    } = {}
) {
    const validations = {
        ...extraValidations,
        isMongoId: async (value: any) => {
            if (!Types.ObjectId.isValid(value)) {
                throw new Error("This value isn't ObjectID");
            }
        },
    };
    return new ExpressValidator<{
        isMongoId: (value: any) => Promise<void>;
        [key: string]: (value: any) => Promise<void>;
    }>(validations);
}
