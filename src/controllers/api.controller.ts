import { Body, Controller, Get, Param, Post, Put, Query, Req, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";
import { ChangePasswordUserDto, DeleteConsumptionHistoryDto, InsertManyConsumptionHistoryDto, LoginDto, RegisterDto, UpdateConsumptionHistoryDto, UpdateUserDto } from "src/dtos/api.dto";
import { Auth } from "src/guards/auth.decorator";
import { AuthRequestInterface } from "src/interfaces/auth-request.interface";
import { AuthService } from "src/services/auth.service";
import { ConsumptionHistoryService } from "src/services/consumption-history.service";
import { UserService } from "src/services/user.service";

@Controller()
export class ApiController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
        private readonly consumptionHistoryService: ConsumptionHistoryService
    ) {}

    @Post('register')
    @Auth(false)
    async register(
        @Body() payload: RegisterDto,
        @Res() response: Response
    ) {
        const result = await this.authService.register(payload);
        return response.status(result.status).json(result);
    }

    @Post('login')
    @Auth(false)
    async login(
        @Body() payload: LoginDto,
        @Res() response: Response
    ) {
        const result = await this.authService.login(payload);
        return response.status(result.status).json(result);
    }

    @Get('user')
    @Auth(true)
    async findUserByToken(
        @Req() request: AuthRequestInterface,
        @Res() response: Response
    ) {
        const result = await this.userService.findById(request.tokenInfo._id);
        return response.status(result.status).json(result);
    }

    @Put('user')
    @Auth(true)
    async updateUserByToken(
        @Req() request: AuthRequestInterface,
        @Body() payload: UpdateUserDto,
        @Res() response: Response
    ) {
        const result = await this.userService.updateById(request.tokenInfo._id, payload);
        return response.status(result.status).json(result);
    }

    @Put('user/change-password')
    @Auth(true)
    async updateUserPasswordByToken(
        @Req() request: AuthRequestInterface,
        @Body() payload: ChangePasswordUserDto,
        @Res() response: Response
    ) {
        const result = await this.userService.updatePasswordById(request.tokenInfo._id, payload);
        return response.status(result.status).json(result);
    }

    @Get('consumption-history')
    @Auth(true)
    async getConsumptionHistoryByToken(
        @Req() request: AuthRequestInterface,
        @Query('date_type') date_type: string,
        @Res() response: Response
    ) {
        const result = await this.consumptionHistoryService.getByUserId(request.tokenInfo._id, date_type);
        return response.status(result.status).json(result);
    }

    @Post('consumption-history/insert-many')
    @Auth(true)
    async insertManyConsumptionHistoryByToken(
        @Req() request: AuthRequestInterface,
        @Body() payload: InsertManyConsumptionHistoryDto[],
        @Res() response: Response
    ) {
        const result = await this.consumptionHistoryService.insertManyByUserId(request.tokenInfo._id, payload);
        return response.status(result.status).json(result);
    }

    @Put('consumption-history/delete-by-ids')
    @Auth(true)
    async deleteConsumptionHistoryByIds(
        @Body() payload: DeleteConsumptionHistoryDto,
        @Res() response: Response
    ) {
        const result = await this.consumptionHistoryService.deleteByIds(payload);
        return response.status(result.status).json(result);
    }

    @Put('consumption-history/:id')
    @Auth(true)
    async updateConsumptionHistoryById(
        @Param('id') id: string,
        @Body() payload: UpdateConsumptionHistoryDto,
        @Res() response: Response
    ) {
        const result = await this.consumptionHistoryService.updateById(id, payload);
        return response.status(result.status).json(result);
    }
}