import { ArrayNotEmpty, IsArray, IsDateString, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class RegisterDto {
    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    password: string

    @IsString()
    @IsNotEmpty()
    confirm_password: string

    @IsString()
    @IsOptional()
    avatar: string

    @IsString()
    @IsOptional()
    name: string

    @IsString()
    @IsOptional()
    age: string

    @IsString()
    @IsOptional()
    address: string

    @IsString()
    @IsOptional()
    phone_number: string
}

export class LoginDto {
    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    password: string
}

export class UpdateUserDto {
    @IsString()
    @IsOptional()
    avatar: string
    
    @IsString()
    @IsOptional()
    name: string

    @IsString()
    @IsOptional()
    age: string

    @IsString()
    @IsOptional()
    address: string

    @IsString()
    @IsOptional()
    phone_number: string
}

export class ChangePasswordUserDto {
    @IsString()
    @IsNotEmpty()
    old_password: string

    @IsString()
    @IsNotEmpty()
    new_password: string

    @IsString()
    @IsNotEmpty()
    confirm_new_password: string
}

export class InsertManyConsumptionHistoryDto {
    @IsNumber()
    @IsNotEmpty()
    electric_used: number

    @IsNumber()
    @IsNotEmpty()
    water_used: number

    @IsNumber()
    @IsNotEmpty()
    temperature: number

    @IsNumber()
    @IsNotEmpty()
    time_report: number

    @IsDateString()
    @IsNotEmpty()
    date_report: string
}

export class UpdateConsumptionHistoryDto {
    @IsNumber()
    @IsNotEmpty()
    electric_used: number

    @IsNumber()
    @IsNotEmpty()
    water_used: number

    @IsNumber()
    @IsNotEmpty()
    temperature: number
}

export class DeleteConsumptionHistoryDto {
    @IsArray()
    @ArrayNotEmpty()
    ids: string[]
}