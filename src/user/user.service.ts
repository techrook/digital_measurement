import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './dto';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService,){}
    async brandName(userId: number, dto:UserDto){
        try {
            const user = await this.prisma.user.update({
                where:{
                    id: userId,
                },
                data:{
                    brandName: dto.brandName
                }
            })
            delete user.hash;

            return user
        } catch (error) {
            throw error
        }
    }
}
