import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

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

    @CreateDateColumn()
    created_at : Date

    @Column()
    views : number
}