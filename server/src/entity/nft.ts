import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class nft{
    @PrimaryGeneratedColumn()
    id : number

    @Column()
    user_id : number

    @Column()
    URI : string

    @Column()
    tx_hash : string
}