import { MainFields } from 'src/main.entities';
import { Offer } from 'src/offers/entities/offer.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Wish extends MainFields {
  @Column()
  name: string;

  @Column()
  link: string;

  @Column()
  image: string;

  @Column({
    scale: 2,
  })
  price: number;

  @Column({
    scale: 2,
    default: 0,
  })
  raised: number;

  @ManyToOne(() => User, (owner) => owner.wishes)
  owner: User;

  @Column()
  description: string;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @Column({ default: 0 })
  copied: number;
}
