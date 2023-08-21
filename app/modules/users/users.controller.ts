import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { Request } from 'express'
import { diskStorage } from 'multer'
import { extname } from 'path'
import { v4 as uuidv4 } from 'uuid'

import { TSafeUser } from '@/types'

import { AuthGuard } from '@/guards'

import { TUserInstance } from './users.interface'

import { UsersService } from './users.service'

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get('/user/me')
  async getMe(
    @Req()
    request: Request,
  ) {
    return this.usersService.getMe(request)
  }

  @Post('/users')
  @HttpCode(200)
  async getUserByUnique(
    @Body('email') email: string,
  ): Promise<NotFoundException | TSafeUser> {
    return this.usersService.getUserByUnique(email)
  }

  @Put('/register')
  async createNewUser(@Body() body: TUserInstance) {
    return this.usersService.createNewUser(body)
  }

  @Post('/user/avatar')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'uploads/images',
        filename: (_, file, cb) => {
          const generatedFileName = uuidv4()

          cb(null, `${generatedFileName}${extname(file.originalname)}`)
        },
      }),
    }),
  )
  async uploadAvatar(
    @Body() body: { userId: string },
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.usersService.uploadAvatar(body, file)
  }
}
