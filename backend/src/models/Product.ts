import { Table, Column, Model, DataType, HasMany, CreatedAt, UpdatedAt } from 'sequelize-typescript';
import { OrderItem } from './OrderItem';

export enum ProductCategory {
  SHIRT = 'shirt',
  PANT = 'pant',
  SUIT = 'suit',
  KURTA = 'kurta',
  SHERWANI = 'sherwani',
  OTHER = 'other'
}

@Table({
  tableName: 'products',
  timestamps: true
})
export class Product extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true
  })
  id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  name!: string;

  @Column({
    type: DataType.ENUM(...Object.values(ProductCategory)),
    allowNull: false
  })
  category!: ProductCategory;

  @Column({
    type: DataType.TEXT,
    allowNull: true
  })
  description?: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false
  })
  basePrice!: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    defaultValue: 0
  })
  materialCost!: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    defaultValue: 0
  })
  laborCost!: number;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  imageUrl?: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true
  })
  isActive!: boolean;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @HasMany(() => OrderItem)
  orderItems!: OrderItem[];
}
