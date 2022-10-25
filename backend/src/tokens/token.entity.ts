import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('tokens')
export class Token {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ nullable: false })
	token: string;

	@Column({ name: 'user_id', nullable: false, unique: true })
	@Unique('unique_user_id_token_idx', ['user_id', 'token'])
	userId: number;
}
