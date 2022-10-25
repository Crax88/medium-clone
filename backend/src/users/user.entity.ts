import 'reflect-metadata';
import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('users')
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true, nullable: false })
	@Unique('unique_email_idx', ['email'])
	email: string;

	@Column({ unique: true, nullable: false })
	@Unique('unique_username_idx', ['username'])
	username: string;

	@Column()
	password: string;

	@Column({ nullable: true })
	image: string;

	@Column({ type: 'text', nullable: true })
	bio: string | null;

	@Column({
		name: 'created_at',
		nullable: false,
		type: 'timestamp without time zone',
		default: () => 'CURRENT_TIMESTAMP',
	})
	createdAt: string;

	@Column({ name: 'updated_at', type: 'timestamp without time zone', nullable: true })
	updatedAt: string;
}
