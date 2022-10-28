import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('tags')
export class Tag {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ name: 'tag_name', unique: true })
	@Unique('unique_tag_name_idx', ['tag_name'])
	tagName: string;
}
