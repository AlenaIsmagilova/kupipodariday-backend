import { MainFields } from 'src/main.entities';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Wishlist extends MainFields {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  image: string;

  @ManyToOne(() => Wish, (wish) => wish.image)
  items: Wish[];

  @ManyToOne(() => User, (user) => user.offers)
  owner: User;
}
