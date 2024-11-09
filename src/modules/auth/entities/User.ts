// /backend/src/modules/auth/entities/User.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
  } from "typeorm";
  import { Favorite } from "../../favorites/entities/Favorite";
  import { Review } from "../../restaurants/entities/Review";
  
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
  