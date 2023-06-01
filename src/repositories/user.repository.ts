import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserInterface } from "src/interfaces/user.interface";
import * as mongoose from "mongoose";

@Injectable()
export class UserRepo {
    constructor(
        @InjectModel('user') private readonly userModel: Model<UserInterface>
    ) {}

    async findByEmail(email: string): Promise<UserInterface> {
        return this.userModel.findOne({ email });
    }

    async create(insertData: UserInterface): Promise<UserInterface> {
        return this.userModel.create(insertData);
    }

    async findById(id: string, include_password?: boolean): Promise<UserInterface> {
        return this.userModel.findById(id, { ...(!include_password)&&{ password: 0 } });
    }

    async updateById(id: string, updateData: any): Promise<UserInterface> {
        return this.userModel.findByIdAndUpdate(id, updateData, { returnOriginal: false });
    }
}