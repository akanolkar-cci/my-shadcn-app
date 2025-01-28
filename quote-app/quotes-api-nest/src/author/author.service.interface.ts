import { GetAuthorsDto } from './dto/get-authors.dto';

export interface AuthorServiceInterface {
  fetchAllAuthors(): Promise<GetAuthorsDto[]>;
}
