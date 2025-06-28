import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, IsNull, Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const result = await this.categoryRepository.save(createCategoryDto);
    return plainToInstance(Category, result);
  }

  async findAll(
    options: FindManyOptions<Category>,
  ): Promise<[Category[], number]> {
    const [list, count] = await this.categoryRepository.findAndCount(options);
    return [plainToInstance(Category, list), count];
  }

  async findOne(options: FindOneOptions<Category>): Promise<Category> {
    const result = await this.categoryRepository.findOne(options);
    return plainToInstance(Category, result);
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    await this.categoryRepository.update(id, {
      ...updateCategoryDto,
      updated_at: new Date().toISOString(),
    });

    const updatedCategory = await this.categoryRepository.findOne({
      where: { id },
    });

    return plainToInstance(Category, updatedCategory);
  }

  async remove(id: string) {
    const record = await this.categoryRepository.update(
      { id: id, deleted_at: IsNull() },
      {
        deleted_at: new Date().toISOString(),
      },
    );

    return record;
  }
}
