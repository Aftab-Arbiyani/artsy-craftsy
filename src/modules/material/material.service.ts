import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOneOptions, IsNull } from 'typeorm';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { Material } from './entities/material.entity';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class MaterialService {
  constructor(
    @InjectRepository(Material)
    private readonly materialRepository: Repository<Material>,
  ) {}

  async create(createMaterialDto: CreateMaterialDto): Promise<Material> {
    const result = await this.materialRepository.save(createMaterialDto);
    return plainToInstance(Material, result);
  }

  async findAll(
    options: FindManyOptions<Material>,
  ): Promise<[Material[], number]> {
    const [list, count] = await this.materialRepository.findAndCount(options);
    return [plainToInstance(Material, list), count];
  }

  async findOne(options: FindOneOptions<Material>): Promise<Material> {
    const result = await this.materialRepository.findOne(options);
    return plainToInstance(Material, result);
  }

  async update(
    id: string,
    updateMaterialDto: UpdateMaterialDto,
  ): Promise<Material> {
    await this.materialRepository.update(id, {
      ...updateMaterialDto,
      updated_at: new Date().toISOString(),
    });
    const updatedMaterial = await this.materialRepository.findOne({
      where: { id },
    });
    return plainToInstance(Material, updatedMaterial);
  }

  async remove(id: string) {
    const record = await this.materialRepository.update(
      { id: id, deleted_at: IsNull() },
      { deleted_at: new Date().toISOString() },
    );
    return record;
  }
}
