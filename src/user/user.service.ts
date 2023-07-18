import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto, resetPWDDto } from './dto';
import { error } from 'console';
import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class UserService {
  private transporter: nodemailer.Transporter;
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.YOUR_APP_MAIL,
        pass: process.env.YOUR_GENERATED_APP_PASSWORD,
      },
    });

    //testing success
    this.transporter.verify((err, success) => {
      if (err) {
        console.log(err.message);
      } else {
        console.log('ready for messages');
        console.log(success);
      }
    });
  }
  async brandName(userId: number, dto: UserDto) {
    try {
      if (!userId) throw new HttpException('Not found', HttpStatus.NOT_FOUND);
      const user = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          brandName: dto.brandName,
        },
      });
      if (!user)
        throw new HttpException(
          'Not found or error updating brand name',
          HttpStatus.NOT_FOUND,
        );
      delete user.hash;

      return user;
    } catch (error) {
      throw new HttpException('server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async deleteUser(userId: number) {
    try {
      if (!userId) throw new HttpException('Not found', HttpStatus.NOT_FOUND);
      const user = await this.prisma.user.delete({
        where: {
          id: userId,
        },
      });
      return { message: `${user.email} account has been deleted ` };
    } catch (error) {
      throw new HttpException('server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async changePassword(
    userId: number,
    newPassword: string,
    oldpassword: string,
  ) {
    if (!newPassword)
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Enter new password',
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: error,
        },
      );
    if (!oldpassword)
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Enter old password',
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: error,
        },
      );
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      if (!user)
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'user not found',
          },
          HttpStatus.NOT_FOUND,
          {
            cause: error,
          },
        );

      const pwMatches = await argon.verify(user.hash, oldpassword);
      if (!pwMatches) throw new ForbiddenException('Credentials incorrect');
      const hash = await argon.hash(newPassword);
      const updateUser = await this.prisma.user.update({
        where: {
          email: user.email,
        },
        data: {
          hash: hash,
        },
      });

      return { message: `${updateUser.email} password has been updated ` };
    } catch (error) {
      throw new HttpException('server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async forgotPassword(dto: resetPWDDto) {
    try {
      console.log(dto.email);
      const user = await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });
      if (!user)
        throw new HttpException('user not found', HttpStatus.NOT_FOUND);

      const email = user.email;
      const payload = { sub: user.id, email };
      const secret = this.config.get('JWT_SECRET');
      const resetToken = await this.jwt.signAsync(payload, {
        expiresIn: '15m',
        secret: secret,
      });
      const URL = `http://localhost:3333/users/resetpassword/${resetToken}`;
      this.transporter.sendMail({
        to: email,
        subject: 'Password Reset',
        html: `<p>You requested a password reset. Click the link below to reset your password:</p>
            <a href="${URL}">Reset Password</a>`,
      });
      return {
        message: `check your mail to complete the reset password step`,
      };
    } catch (error) {
      throw new HttpException('server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async resetPassword(token: string) {
    try {
      const secret = this.config.get('JWT_SECRET');
      if (!token)
        throw new HttpException('Token Not Fount', HttpStatus.NOT_FOUND);
      const decoded = await this.jwt.verifyAsync(token, { secret: secret });
      console.log(decoded);

      if (!decoded)
        throw new HttpException('Invalid Token', HttpStatus.BAD_REQUEST);

      const redirectUrl = `http://localhost:3333/users/updatepassword/${decoded.sub}`;
      return redirectUrl;
    } catch (error) {
      throw new HttpException('server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async updatedResetPassword(userId: string, password: string) {
    try {
      const hash = await argon.hash(password);
      console.log(hash);
      const user = await this.prisma.user.update({
        where: {
          id: Number(userId),
        },
        data: {
          hash: hash,
        },
      });
      return {
        message: `your password has successfully been reseted and updated`,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException('server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
