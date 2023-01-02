import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class post{
    @PrimaryGeneratedColumn()
    id : number

    @Column()
    user_id : number

    @Column()
    title : string

    @Column()
    content : string

    @Column()
    created_at : Date

    @Column()
    views : number
}