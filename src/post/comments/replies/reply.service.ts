import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UUID } from 'crypto';
import { Image } from 'src/images/images.entity';
import { ImageService } from 'src/images/images.service';
import { Reply } from 'src/post/entities/reply.entity';
import { InsertResult, Repository } from 'typeorm';
import { ReplyOutputDto } from './dtos/reply-output-dto';

@Injectable()
export class ReplyService {
  constructor(
    @InjectRepository(Reply)
    private readonly replyRepository: Repository<Reply>,
    private readonly imageService: ImageService,
  ) {}

  async addReply(
    comment_id: number,
    text: string,
    images: string[],
  ): Promise<ReplyOutputDto> {
    const image_values = await Promise.allSettled(
      images.map((image: string) => this.imageService.findImage(image)),
    );

    const images_found = image_values.filter(
      (value) => value.status === 'fulfilled',
    );

    // TODO: UPLOAD IMAGES

    const reply_insert_value: InsertResult = await this.replyRepository
      .createQueryBuilder()
      .insert()
      .values([
        {
          comment: {
            id: comment_id,
          },
          // images: images_found,
        },
      ])
      .execute();

    const reply_created: Reply = await this.replyRepository.findOneBy(
      reply_insert_value.identifiers[0].id,
    );

    return new ReplyOutputDto(reply_created);
  }

  async findRepliesByCommentId(comment_id: number): Promise<ReplyOutputDto[]> {
    const replies: Reply[] = await this.replyRepository.find({
      where: { comment_id },
    });

    return replies.map((reply: Reply) => new ReplyOutputDto(reply));
  }

  async findReplyById(reply_id: number): Promise<ReplyOutputDto> {
    const reply: Reply = await this.replyRepository.findOneBy({ id: reply_id });

    return new ReplyOutputDto(reply);
  }

  async updateReply(reply_id: number, text: string) {
    try {
      const reply_data = await this.replyRepository.update(
        { id: reply_id },
        { text },
      );

      return {
        success: true,
        message: 'Reply is successfully updated',
        reply_data,
      };
    } catch (e) {
      console.error(e);
      throw new NotFoundException({
        success: false,
        message: 'Reply not found',
        reply_id,
      });
    }
  }

  async deleteReply(reply_id: number) {
    try {
      await this.replyRepository.delete({ id: reply_id });

      return {
        success: true,
        message: 'Reply is successfully deleted',
        reply_id,
      };
    } catch (e) {
      throw new NotFoundException({
        success: false,
        message: 'Reply not found',
        reply_id,
      });
    }
  }

  public async findReply(
    id: number,
    relations?: { key: string }[],
  ): Promise<Reply> {
    const relationOptions = relations?.reduce(
      (acc, rel: { key: string }) => ({
        ...acc,
        [rel.key]: true,
      }),
      {},
    );
    return await this.replyRepository.findOne({
      where: { id },
      relations: relationOptions || undefined,
    });
  }
}
