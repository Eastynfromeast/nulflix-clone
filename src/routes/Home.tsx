import { useQuery } from "react-query";
import styled from "styled-components";
import { IGetMoivesResult, getMovies } from "../api";
import { makeImagePath } from "../utils";

const Wrapper = styled.div`
	background-color: black;
`;

const Loader = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	height: 20vh;
`;

const Banner = styled.div<{ $bgPhoto: string }>`
	height: 100vh;
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: 60px;
	background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(${props => props.$bgPhoto});
	background-size: cover;
`;

const Title = styled.h2`
	font-size: 68px;
	margin-bottom: 20px;
`;
const Overview = styled.p`
	font-size: 24px;
	width: 50%;
`;

const IMG_URL = "https://image.tmdb.org/t/p/";
function Home() {
	const { data, isLoading } = useQuery<IGetMoivesResult>({
		queryKey: ["movies", "nowPlaying"],
		queryFn: getMovies,
	});

	console.log(data);
	return (
		<Wrapper>
			{isLoading ? (
				<Loader>Loading... </Loader>
			) : (
				<>
					<Banner $bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}>
						<Title>{data?.results[0].title}</Title>
						<Overview>{data?.results[0].overview}</Overview>
					</Banner>
				</>
			)}
		</Wrapper>
	);
}

export default Home;
