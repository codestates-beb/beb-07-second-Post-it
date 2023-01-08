import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class user{
    @PrimaryGeneratedColumn()
    id : number

    @Column()
    nickname : string

    @Column()
    password : string

    @Column()
    address : string

    @Column()
    token_amount : number

    @Column()
    eth_amount : string

    @CreateDateColumn()
    created_at : Date
}