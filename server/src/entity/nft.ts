import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class nft{
    @PrimaryGeneratedColumn()
    id : number

    @Column()
    user_id : number

    @Column()
    token_id : number

    @Column()
    tx_hash : string
}