import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './dto';
import { error } from 'console';
import { ForbiddenException, Injectable } from '@nestjs/common';

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
    async deleteUser(userId: number,){
        try {
            const user = await this.prisma.user.delete({
                where:{
                    id: userId,
                },
            })
            return {message:`${user.email} account has been deleted `}
        } catch (error) {
            throw error
        }
    }
    async changePassword(userId: number, newPassword:string, oldpassword:string){
        if(!newPassword) throw error( "enter your new password")
        if(!oldpassword) throw  error( "enter your old password")
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                  id: userId,
                },
              })
              if(!user) return ({message: "User not found"})

              const pwMatches = await argon.verify(user.hash, oldpassword)
              if(!pwMatches) throw new ForbiddenException('Credentials incorrect') 
              const hash = await argon.hash(newPassword);
              const updateUser = await this.prisma.user.update({
                    where: {
                      email: user.email,
                    },
                    data: {
                      hash: hash,
                    },
                  })

                  return {message:`${updateUser.email} password has been updated `}
              
        } catch (error) {
            throw error
        }
    }
    async forgotPassword(){

    }
}
