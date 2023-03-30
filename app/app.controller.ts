import { AppService } from './app.service'
import { Controller, Get } from '@nestjs/common'

@Controller()
export class AppController {
	// eslint-disable-next-line no-unused-vars
	constructor(private readonly appService: AppService) {}

	@Get('/api/status')
	getStatus(): { status: string } {
		return this.appService.getStatus()
	}
}
