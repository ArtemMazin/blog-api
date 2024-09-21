import { ResponseUserDto } from '../users/dto';

export abstract class BaseArticleController<
  CreateDto,
  UpdateDto,
  ResponseDto,
  // ServiceType extends BaseArticleService<T, CreateDto, UpdateDto, ResponseDto>,
> {
  constructor(protected readonly service: any) {}

  protected async getAllArticles(): Promise<ResponseDto[]> {
    return this.service.findAllArticles();
  }

  protected async getMyAllArticles(userId: string): Promise<ResponseDto[]> {
    return await this.service.findMyAllArticles(userId);
  }

  protected async getOneArticle(
    id: string,
    user?: ResponseUserDto,
  ): Promise<ResponseDto> {
    return await this.service.findOneArticle(id, user);
  }

  protected async createArticle(
    createArticleDto: CreateDto,
    user: ResponseUserDto,
    file: Express.Multer.File,
  ): Promise<ResponseDto> {
    return await this.service.createArticle(createArticleDto, user, file);
  }

  protected async updateArticle(
    id: string,
    user: ResponseUserDto,
    updateArticleDto: UpdateDto,
    file?: Express.Multer.File,
  ): Promise<ResponseDto> {
    return await this.service.updateArticle(id, user, updateArticleDto, file);
  }

  protected async deleteArticle(id: string): Promise<ResponseDto> {
    return this.service.deleteArticle(id);
  }

  protected async searchArticles(query: string): Promise<ResponseDto[]> {
    return this.service.searchArticles(query);
  }

  protected async likeArticle(id: string): Promise<ResponseDto> {
    return this.service.likeArticle(id);
  }

  protected async unlikeArticle(id: string): Promise<ResponseDto> {
    return this.service.unlikeArticle(id);
  }

  protected async getTopArticles(): Promise<ResponseDto[]> {
    return this.service.getTopArticles();
  }

  protected async getArticleAuthor(id: string): Promise<string> {
    return this.service.getArticleAuthor(id);
  }
}
