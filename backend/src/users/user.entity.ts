import 'reflect-metadata';
import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	OneToMany,
	PrimaryGeneratedColumn,
	Unique,
	UpdateDateColumn,
} from 'typeorm';
import { Article } from '../articles/article.entity';

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

	@OneToMany(() => Article, (article) => article.authorId)
	@JoinColumn({ name: 'articles' })
	articles: Article[];

	@CreateDateColumn({
		name: 'created_at',
		nullable: false,
		type: 'timestamp without time zone',
		default: 'NOW()',
	})
	createdAt: string;

	@UpdateDateColumn({
		name: 'updated_at',
		type: 'timestamp without time zone',
		onUpdate: 'NOW()',
		nullable: true,
	})
	updatedAt: string;
}
