import { ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';



@Injectable()
export class AuthService {
  private transporter: nodemailer.Transporter
  constructor(private prisma: PrismaService,private jwt:JwtService, private config: ConfigService, 
    ){
      this.transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.YOUR_APP_MAIL,
          pass: process.env.YOUR_GENERATED_APP_PASSWORD,
        },
      });

      //testing success
this.transporter.verify((err,success)=>{
  if(err){
    console.log(err.message);
  }else{
    console.log("ready for messages")
    console.log(success)
  }
})
    }
  async signUp(dto: AuthDto) {
    try {
      
      // generate password hash
      const hash = await argon.hash(dto.password);
      // save the new user in the db
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });
      const verificationToken = await this.signToken(user.id, user.email)
      const url = `http://localhost:3333/auth/verify/${user.id}`
      this.transporter.sendMail({
        to:dto.email,
        subject: 'Verify Account',
        html: `Click <a href = '${url}'>here</a> to confirm your email.`
      })
      return verificationToken;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }
  async verifyUser(id:string) {
    
    // Check we have an id
    if (!id) throw new HttpException('Bad request ', HttpStatus.BAD_REQUEST)
    try{
      const userid = parseInt(id)
        // Step 2 - Find user with matching ID
        const user = await this.prisma.user.findUnique({
          where: {
          id: userid,
          }
        })
      
        
        if (!user) throw new HttpException('Not found', HttpStatus.NOT_FOUND)
        // Step 3 - Update user verification status to true
         await  this.prisma.user.update({
          where: {
            id: userid,
            },
            data:{
              verified: true
          }
         });
        return ({
              message: "Account Verified"
        });
     } catch (err) {
      throw new err
     }
  }
  async signIn(dto: AuthDto){
    //find user by email
    const user = await this.prisma.user.findUnique({
        where:{
            email:dto.email
        },
    });
    // if user not foun throw error 
    if(!user) throw new HttpException('Not found', HttpStatus.NOT_FOUND)
    if(user.verified == false) throw new ForbiddenException('verify your account first')
    //compare password
    const pwMatches = await argon.verify(user.hash, dto.password)
    //if password incorrect throw exception
    if(!pwMatches) throw new ForbiddenException('Credentials incorrect')

    return this.signToken(user.id, user.email);
  }
  async signToken(userId: number, email:string):Promise<{access_token: string}>{
    const payload = {
      sub:userId,
      email
    }
    const secret = this.config.get('JWT_SECRET')

    const Token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: secret,
    })

    return {
      access_token: Token,
    };

  }
}
