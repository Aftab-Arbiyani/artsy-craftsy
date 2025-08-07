import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomArt } from './entities/custom-art.entity';
import { FindManyOptions, FindOneOptions, IsNull, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { CreateCustomArtDto } from './dto/create-custom-art.dto';
import { UpdateCustomArtDto } from './dto/update-custom-art.dto';

@Injectable()
export class CustomArtService {
  constructor(
    @InjectRepository(CustomArt)
    private readonly customArtRepository: Repository<CustomArt>,
  ) {}

  async create(createCustomArtDto: CreateCustomArtDto): Promise<CustomArt> {
    const result = await this.customArtRepository.save(createCustomArtDto);
    return plainToInstance(CustomArt, result);
  }

  async findAll(
    options: FindManyOptions<CustomArt>,
  ): Promise<[CustomArt[], number]> {
    const [list, count] = await this.customArtRepository.findAndCount(options);
    return [plainToInstance(CustomArt, list), count];
  }

  async findOne(options: FindOneOptions<CustomArt>): Promise<CustomArt> {
    const result = await this.customArtRepository.findOne(options);
    return plainToInstance(CustomArt, result);
  }

  async update(
    id: string,
    updateCustomArtDto: UpdateCustomArtDto,
  ): Promise<CustomArt> {
    await this.customArtRepository.update(id, {
      ...updateCustomArtDto,
      updated_at: new Date().toISOString(),
    });

    const updatedCategory = await this.customArtRepository.findOne({
      where: { id },
    });

    return plainToInstance(CustomArt, updatedCategory);
  }

  async remove(id: string) {
    const record = await this.customArtRepository.update(
      { id: id, deleted_at: IsNull() },
      {
        deleted_at: new Date().toISOString(),
      },
    );

    return record;
  }
}
