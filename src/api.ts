const API_KEY = "538b777273f0fd37c37dfdd6101c1a53";
const BASE_URL = "https://api.themoviedb.org/3";

const getMoviesOptions = {
	method: "GET",
	headers: {
		accept: "application/json",
		Authorization: `Bearer ${API_KEY}`,
	},
};

export function getMovies() {
	return fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}`, getMoviesOptions).then(response => response.json());
}
