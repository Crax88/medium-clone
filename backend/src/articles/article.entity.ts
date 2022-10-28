import 'reflect-metadata';
import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	JoinTable,
	ManyToMany,
	ManyToOne,
	PrimaryGeneratedColumn,
	Unique,
	UpdateDateColumn,
} from 'typeorm';
import { Tag } from '../tags/tag.entity';
import { User } from '../users/user.entity';

@Entity('articles')
export class Article {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ nullable: false, unique: true })
	@Unique('unique_article_slug_idx', ['slug'])
	slug: string;

	@Column({ nullable: false })
	title: string;

	@Column({ nullable: false })
	description: string;

	@Column({ nullable: false })
	body: string;

	@Column({ name: 'author_id' })
	authorId: number;

	@ManyToOne(() => User, (user) => user.articles, { nullable: false })
	@JoinColumn({ name: 'author_id' })
	author: User;

	@ManyToMany(() => Tag)
	@JoinTable({
		name: 'article_tags',
		joinColumn: { name: 'article_id', referencedColumnName: 'id' },
		inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
	})
	tags: Tag[];

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
