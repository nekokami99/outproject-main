import { HttpStatus, Injectable } from "@nestjs/common";
import { LoginDto, RegisterDto } from "src/dtos/api.dto";
import { UserInterface } from "src/interfaces/user.interface";
import { UserRepo } from "src/repositories/user.repository";
import * as bcrypt from "bcryptjs";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepo: UserRepo,
        private readonly jwtService: JwtService
    ) {}

    async register(payload: RegisterDto) {
        try {
            //Find user by email
            let user: UserInterface = await this.userRepo.findByEmail(payload.email);
            if (user)
                return {
                    status: HttpStatus.BAD_REQUEST,
                    message: 'Email has been used, please try another',
                    data: null
                }

            //Compare password and confirm password
            if (payload.password != payload.confirm_password)
                return {
                    status: HttpStatus.BAD_REQUEST,
                    message: 'Password and confirm password mismatch, please re-check',
                    data: null
                }

            //Create user
            let insertData_User: UserInterface;
            insertData_User = {
                ...insertData_User,
                email: payload.email,
                password: payload.password,
                ...(payload?.avatar)&&{ avatar: payload.avatar },
                ...(payload?.phone_number)&&{ phone_number: payload.phone_number },
                ...(payload?.name)&&{ name: payload.name },
                ...(payload?.age)&&{ age: payload.age },
                ...(payload?.address)&&{ address: payload.address }
            }
            user = await this.userRepo.create(insertData_User);
            if (user && user?.password) {
                user = JSON.parse(JSON.stringify(user));
                delete user.password;
            }

            return {
                status: HttpStatus.CREATED,
                message: 'Register success',
                data: user
            }
        }
        catch(e) {
            console.log('Register Err === ', e);

            return {
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Something went wrong, please try again',
                data: null,
                system_message: e.message
            }
        }
    }

    async login(payload: LoginDto) {
        try {
            //Find user by email
            let user: UserInterface = await this.userRepo.findByEmail(payload.email);
            if (!user) {
                return {
                    status: HttpStatus.BAD_REQUEST,
                    message: 'User not found',
                    data: null
                }
            }
            user = JSON.parse(JSON.stringify(user));

            //Verify password
            if (!bcrypt.compareSync(payload.password, user.password))
                return {
                    status: HttpStatus.BAD_REQUEST,
                    message: 'Password incorrect',
                    data: null
                }

            //Delete password from data
            if (user?.password) delete user.password;

            //Create token
            const token = await this.jwtService.signAsync({ _id: String(user._id) });
                
            return {
                status: HttpStatus.OK,
                message: 'Login success',
                data: {
                    user,
                    token
                }
            }
        }
        catch(e) {
            console.log('Login Err === ', e);

            return {
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Something went wrong, please try again',
                data: null,
                system_message: e.message
            }
        }
    }
}