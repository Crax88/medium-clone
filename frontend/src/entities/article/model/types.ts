export type TArticle = {
	slug: string;
	title: string;
	description: string;
	body: string;
	tagList: string[];
	createdAt: string;
	updatedAt: string;
	favorited: boolean;
	favoritesCount: number;
	author: {
		username: string;
		bio: string;
		image: string;
		following: boolean;
	};
};
