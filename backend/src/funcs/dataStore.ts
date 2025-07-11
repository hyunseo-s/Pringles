import fs from 'fs';
import { Database } from '../interface'

const DATABASE = "database.json"

let data: Database = {
	users: [],
}

// Read the database file
export const readData = () => {
	if (!fs.existsSync(DATABASE)) {
		fs.writeFileSync(DATABASE, JSON.stringify({ users: []}, null, 2), "utf-8");
	}
	data = JSON.parse(fs.readFileSync(DATABASE, "utf-8"));
};

// Write to the database file 
export const writeData = () => {
	fs.writeFileSync(DATABASE, JSON.stringify(data, null, 2), "utf-8");
};

export const clear = () => {
	data = {
		users: [],
	}

	return {};
}

export function getData() {
  return data;
}