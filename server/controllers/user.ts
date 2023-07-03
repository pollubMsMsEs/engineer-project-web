import User from "../models/user.js";
import { Request, Response, NextFunction } from "express";
import { inspect } from "util";
import bcrypt from "bcrypt";
import Debug from "debug";
import { ExtendedValidator } from "../scripts/customValidator.js";
const debug = Debug("project:dev");

const { body, validationResult } = ExtendedValidator({
    emailTaken: async (value: any) => {
        const emailTaken = !!(await User.findOne({
            email: value,
        }));
        if (emailTaken) {
            throw new Error("User with given email already exists!");
        }
    },
});

export const register = [
    body("name").trim().isLength({ min: 3, max: 50 }).escape(),
    body("email")
        .trim()
        .isEmail()
        .withMessage("Incorrect email format")
        .emailTaken(),
    body("password").trim().isStrongPassword().withMessage("Password too weak"),
    async function (req: Request, res: Response, next: NextFunction) {
        try {
            validationResult(req).throw();

            if (!process.env.SALT) throw new Error("Missing SALT in env");
            const salt = await bcrypt.genSalt(Number(process.env.SALT));
            const hashPassword = await bcrypt.hash(req.body.password, salt);
            const user: any = await new User({
                ...req.body,
                password: hashPassword,
            }).save();
            const token = user.generateAuthToken();

            res.status(201).send({
                acknowledged: true,
                token: token,
                username: user.name,
                message: "User created successfully",
            });
        } catch (error: any) {
            return next(error);
        }
    },
];

export const login = [
    body("email")
        .trim()
        .isEmail()
        .withMessage("Incorrect email format")
        .escape(),
    body("password").trim(),
    async function (req: Request, res: Response, next: NextFunction) {
        try {
            validationResult(req).throw();

            const user: any = await User.findOne({ email: req.body.email });
            if (!user)
                return res.status(401).send({
                    acknowledged: false,
                    errors: [
                        {
                            path: "email/password",
                            msg: "Invalid Email or Password",
                        },
                    ],
                });
            const validPassword = await bcrypt.compare(
                req.body.password,
                user.password
            );
            if (!validPassword)
                return res.status(401).send({
                    acknowledged: false,
                    errors: [
                        {
                            path: "email/password",
                            msg: "Invalid Email or Password",
                        },
                    ],
                });

            const token = user.generateAuthToken();
            res.status(200).send({
                token: token,
                username: user.name,
                message: "logged in successfully",
            });
        } catch (error) {
            return next(error);
        }
    },
];
