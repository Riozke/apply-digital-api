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

    @Column({ default: false })
    deletedAt: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
