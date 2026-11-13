import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  ParseIntPipe,
} from '@nestjs/common';

import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
  ) {}

  // GET /notifications/user/:userId
  @Get('user/:userId')
  getNotifications(
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.notificationsService.findForUser(userId);
  }

  // GET /notifications/user/:userId/unread-count
  @Get('user/:userId/unread-count')
  getUnreadCount(
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.notificationsService.getUnreadCount(userId);
  }

  // PATCH /notifications/user/:userId/read-all
  @Patch('user/:userId/read-all')
  markAllAsRead(
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.notificationsService.markAllAsRead(userId);
  }

  // PATCH /notifications/user/:userId/:notificationId/read
  @Patch('user/:userId/:notificationId/read')
  markAsRead(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('notificationId', ParseIntPipe) notificationId: number,
  ) {
    return this.notificationsService.markAsRead(
      userId,
      notificationId,
    );
  }

  // DELETE /notifications/user/:userId/:notificationId
  @Delete('user/:userId/:notificationId')
  deleteNotification(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('notificationId', ParseIntPipe) notificationId: number,
  ) {
    return this.notificationsService.deleteForUser(
      userId,
      notificationId,
    );
  }
}