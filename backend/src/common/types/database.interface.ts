export interface DatabaseInterface {
	connect: () => void;
	disconnect: () => void;
}
