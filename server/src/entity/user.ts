import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class post{
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
    eth_amount : number

    @Column()
    created_at : Date
}