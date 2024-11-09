// /backend/src/modules/restaurants/entities/Restaurant.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
  } from "typeorm";
  import { Favorite } from "../../favorites/entities/Favorite";
  import { Review } from "./Review";
  
  @Entity()
  export class Restaurant {
    @PrimaryGeneratedColumn("uuid")
    id!: string;
  
    @Column()
    name!: string;
  
    @Column()
    neighborhood!: string;
  
    @Column()
    photograph!: string;
  
    @Column()
    address!: string;
  
    @Column("simple-json")
    latlng!: { lat: number; lng: number };
  
    @Column()
    image!: string;
  
    @Column()
    cuisine_type!: string;
  
    @Column("simple-json")
    operating_hours!: Record<string, string>;
  
    @CreateDateColumn()
    createdAt!: Date;
  
    @UpdateDateColumn()
    updatedAt!: Date;
  
    @OneToMany(() => Favorite, (favorite) => favorite.restaurant)
    favorites!: Favorite[];
  
    @OneToMany(() => Review, (review) => review.restaurant)
    reviews!: Review[];
  }
  