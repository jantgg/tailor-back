// /backend/src/modules/auth/User.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
  } from "typeorm";
  import { Favorite } from "../favorites/Favorite";
  import { Review } from "../reviews/Review";
  
  @Entity()
  export class User {
    @PrimaryGeneratedColumn("uuid")
    id!: string;
  
    @Column({ unique: true })
    username!: string;
  
    @Column()
    password!: string;
  
    @CreateDateColumn()
    createdAt!: Date;
  
    @UpdateDateColumn()
    updatedAt!: Date;
  
    @OneToMany(() => Favorite, (favorite) => favorite.user)
    favorites!: Favorite[];
  
    @OneToMany(() => Review, (review) => review.user)
    reviews!: Review[];
  }
  