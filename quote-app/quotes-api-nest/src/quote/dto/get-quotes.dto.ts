import { Expose, Transform } from 'class-transformer';

export class UserDto {
  @Expose()
  id: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;
}

export class QuoteDto {
  @Expose()
  id: string;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  @Expose()
  quote: string;

  @Expose()
  author: string;

  @Expose()
  likes: number;

  @Expose()
  dislikes: number;

  @Expose()
  tags: string;

  @Expose()
  @Transform((value) => ({
    id: value.obj.user.id,
    firstName: value.obj.user.firstName,
    lastName: value.obj.user.lastName,
  }))
  user: UserDto;
}
