import { HttpStatus, Injectable } from "@nestjs/common";
import { ChangePasswordUserDto, UpdateUserDto } from "src/dtos/api.dto";
import { UserInterface } from "src/interfaces/user.interface";
import { UserRepo } from "src/repositories/user.repository";
import * as bcrypt from "bcryptjs";

@Injectable()
export class UserService {
    constructor(
        private readonly userRepo: UserRepo
    ) { }

    async findById(id: string) {
        try {
            const user: UserInterface = await this.userRepo.findById(id);

            return {
                status: user ? HttpStatus.OK : HttpStatus.BAD_REQUEST,
                message: user ? 'Get user success' : 'Get user error',
                data: user
            }
        }
        catch (e) {
            console.log('FindUserById Err === ', e);

            return {
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Something went wrong, please try again',
                data: null,
                system_message: e.message
            }
        }
    }

    async updateById(id: string, payload: UpdateUserDto) {
        try {
            let user: UserInterface = await this.userRepo.updateById(id, payload);
            if (user && user?.password) {
                user = JSON.parse(JSON.stringify(user));
                delete user.password;
            }

            return {
                status: user ? HttpStatus.OK : HttpStatus.BAD_REQUEST,
                message: user ? 'Get user success' : 'Get user error',
                data: user
            }
        }
        catch (e) {
            console.log('UpdateUserById Err === ', e);

            return {
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Something went wrong, please try again',
                data: null,
                system_message: e.message
            }
        }
    }

    async updatePasswordById(id: string, payload: ChangePasswordUserDto) {
        try {
            //Verify old_password and new_password
            if (payload.old_password == payload.new_password) {
                return {
                    status: HttpStatus.BAD_REQUEST,
                    message: 'New password cannot like old password',
                    data: null
                }
            }

            //Verify new_password and confirm_new_password
            if (payload.new_password != payload.confirm_new_password) {
                return {
                    status: HttpStatus.BAD_REQUEST,
                    message: 'New password and Confirm new password mismatch',
                    data: null
                }
            }

            //Find user by id
            let user: UserInterface = await this.userRepo.findById(id, true);
            if (!user) {
                return {
                    status: HttpStatus.BAD_REQUEST,
                    message: 'User not found',
                    data: null
                }
            }

            //Verify old password
            if (!bcrypt.compareSync(payload.old_password, user.password)) {
                return {
                    status: HttpStatus.BAD_REQUEST,
                    message: 'Old Password is incorrect, please re-check',
                    data: null
                }
            }

            //Update user password
            let updateData_User = {
                password: payload.new_password
            }
            user = await this.userRepo.updateById(id, updateData_User);

            return {
                status: user ? HttpStatus.OK : HttpStatus.BAD_REQUEST,
                message: user ? 'Update user password success' : 'Update user password fail',
                data: null
            }
        }
        catch(e) {
            console.log('UpdatePasswordById Err === ', e);

            return {
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Something went wrong, please try again',
                data: null,
                system_message: e.message
            }
        }
    }
}