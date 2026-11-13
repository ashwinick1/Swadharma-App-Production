import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { NotificationEntity } from './entities/notification.entity';

export interface CreateNotificationInput {
  userId: number;
  title: string;
  message: string;
  type: string;
  referenceId?: string | null;
}

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
  ) {}

  // =====================================================
  // CREATE NOTIFICATION
  // =====================================================
  async create(input: CreateNotificationInput) {
    if (!Number.isInteger(Number(input.userId)) || Number(input.userId) <= 0) {
      throw new BadRequestException('Valid user ID is required.');
    }

    if (!input.title?.trim() || !input.message?.trim() || !input.type?.trim()) {
      throw new BadRequestException(
        'Title, message and notification type are required.',
      );
    }

    const notification = this.notificationRepository.create({
      userId: Number(input.userId),
      title: input.title.trim(),
      message: input.message.trim(),
      type: input.type.trim().toUpperCase(),
      referenceId: input.referenceId || null,
      isRead: false,
    });

    return this.notificationRepository.save(notification);
  }

  // =====================================================
  // GET NOTIFICATIONS FOR USER
  // =====================================================
  async findForUser(userId: number) {
    if (!Number.isInteger(userId) || userId <= 0) {
      throw new BadRequestException('Valid user ID is required.');
    }

    return this.notificationRepository.find({
      where: { userId },
      order: {
        createdAt: 'DESC',
      },
      take: 100,
    });
  }

  // =====================================================
  // GET UNREAD NOTIFICATION COUNT
  // =====================================================
  async getUnreadCount(userId: number) {
    if (!Number.isInteger(userId) || userId <= 0) {
      throw new BadRequestException('Valid user ID is required.');
    }

    const count = await this.notificationRepository.count({
      where: {
        userId,
        isRead: false,
      },
    });

    return {
      unreadCount: count,
    };
  }

  // =====================================================
  // MARK SINGLE NOTIFICATION AS READ
  // =====================================================
  async markAsRead(userId: number, notificationId: number) {
    const notification = await this.notificationRepository.findOne({
      where: {
        id: notificationId,
        userId,
      },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found.');
    }

    notification.isRead = true;

    return this.notificationRepository.save(notification);
  }

  // =====================================================
  // MARK ALL NOTIFICATIONS AS READ
  // =====================================================
  async markAllAsRead(userId: number) {
    const result = await this.notificationRepository.update(
      {
        userId,
        isRead: false,
      },
      {
        isRead: true,
      },
    );

    return {
      success: true,
      updatedCount: result.affected || 0,
    };
  }

  // =====================================================
  // DELETE NOTIFICATION
  // =====================================================
  async deleteForUser(userId: number, notificationId: number) {
    const result = await this.notificationRepository.delete({
      id: notificationId,
      userId,
    });

    if (!result.affected) {
      throw new NotFoundException('Notification not found.');
    }

    return {
      success: true,
      message: 'Notification deleted successfully.',
    };
  }
}