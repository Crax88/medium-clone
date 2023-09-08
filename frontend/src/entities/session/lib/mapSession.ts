import { SessionDto } from '../api/types';
import { Session } from '../model/types';

export const mapSession = (sessionDto: SessionDto): Session => {
	const {
		user: { token, ...userData },
	} = sessionDto;
	return {
		acccessToken: token,
		user: userData,
	};
};
