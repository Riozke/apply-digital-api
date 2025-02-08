import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    category: string;

    @Column({ nullable: true })
    price: number;

    @Column({ default: false })
    deleted: boolean;
}
