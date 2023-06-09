import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  UseGuards,
} from "@nestjs/common";
import { User } from "@prisma/client";
import { GetUser } from "src/auth/decorator";
import { JwtGuard } from "src/auth/guard";
import { UserService } from "./user.service";
import { UserDto } from "./dto";

@UseGuards(JwtGuard)
@Controller("users")
export class UserController {
  constructor(private userService: UserService) {}
  @Get("me")
  getMe(@GetUser("") user: User) {
    return user;
  }
  @HttpCode(HttpStatus.ACCEPTED)
  @Patch("brandname")
  brandName(@GetUser("id") userId: number, @Body() dto: UserDto) {
    return this.userService.brandName(userId, dto);
  }
  @Delete("delete")
  deleteUser(@GetUser("id") userId: number) {
    return this.userService.deleteUser(userId);
  }
}
