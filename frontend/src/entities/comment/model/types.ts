export type TComment = {
	id: number;
	createdAt: string;
	updatedAt: string;
	body: string;
	author: {
		username: string;
		bio: string;
		image: string;
		following: boolean;
	};
};
