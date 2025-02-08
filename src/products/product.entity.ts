import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  category: string;

  @Column('float', { nullable: true })
  price: number;

  @Column({ nullable: true })
  brand: string;

  @Column({ nullable: true })
  model: string;

  @Column({ nullable: true })
  color: string;

  @Column('int', { nullable: true })
  stock: number;

  @Column({ default: false })
  deletedAt: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
