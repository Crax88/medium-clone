import 'reflect-metadata';
import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Article } from '../articles/article.entity';

@Entity('comments')
export class Comment {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ name: 'body', nullable: false })
	body: string;

	@Column({ name: 'author_id', nullable: false })
	authorId: number;

	@ManyToOne(() => User, (user) => user.comments, { nullable: false })
	@JoinColumn({ name: 'author_id' })
	author: User;

	@Column({ name: 'article_id', nullable: false })
	articleId: number;

	@ManyToOne(() => Article, (article) => article.comments, { nullable: false })
	@JoinColumn({ name: 'article_id' })
	article: Article;

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
