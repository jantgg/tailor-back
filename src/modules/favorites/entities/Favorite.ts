// /backend/src/modules/favorites/entities/Favorite.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from "typeorm";
import { User } from "../../auth/entities/User";
import { Restaurant } from "../../restaurants/entities/Restaurant";

@Entity()
export class Favorite {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => User, (user) => user.favorites, { onDelete: "CASCADE" })
  user!: User;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.favorites, { onDelete: "CASCADE" })
  restaurant!: Restaurant;

  @CreateDateColumn()
  createdAt!: Date;
}
