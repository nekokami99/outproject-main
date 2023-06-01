import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserInterface } from 'src/interfaces/user.interface';
import { UserService } from 'src/services/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly jwtService: JwtService,
        private readonly userService: UserService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const secured = this.reflector.get<string[]>(
            'OUTPROJECT_AUTH',
            context.getHandler(),
        );

        if (!secured) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new HttpException(
                {
                    status: HttpStatus.UNAUTHORIZED,
                    message: 'Cannot define your user',
                    data: null
                },
                HttpStatus.UNAUTHORIZED
            );
        }
        try {
            const payload = await this.jwtService.verifyAsync(token.replace('Bearer ', ''), { secret: '8BC14C7E2421EAE512157F98386C9' });

            //Find user by id
            const result = await this.userService.findById(payload._id);
            if (!result?.data) {
                throw new HttpException(
                    {
                        status: HttpStatus.UNAUTHORIZED,
                        message: 'Cannot define your user',
                        data: null
                    },
                    HttpStatus.UNAUTHORIZED
                )
            }
            request.tokenInfo = { _id: String(result.data._id) };
        } catch {
            throw new HttpException(
                {
                    status: HttpStatus.UNAUTHORIZED,
                    message: 'Cannot define your user',
                    data: null
                },
                HttpStatus.UNAUTHORIZED
            );
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}