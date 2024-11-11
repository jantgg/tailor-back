// /backend/src/modules/restaurants/Review.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
  } from "typeorm";
  import { User } from "../auth/User";
  import { Restaurant } from "../restaurants/Restaurant";
  
  @Entity()
  export class Review {
    @PrimaryGeneratedColumn("uuid")
    id!: string;
  
    @Column()
    name!: string;
  
    @Column()
    rating!: number;
  
    @Column("text")
    comments!: string;
  
    @CreateDateColumn()
    createdAt!: Date;
  
    @ManyToOne(() => User, (user) => user.reviews, { onDelete: "SET NULL" })
    user!: User;
  
    @ManyToOne(() => Restaurant, (restaurant) => restaurant.reviews, { onDelete: "CASCADE" })
    restaurant!: Restaurant;
  }
  