import { useQuery } from "react-query";
import styled from "styled-components";
import { IGetMoivesResult, getMovies } from "../api";
import { makeImagePath } from "../utils";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";

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
	background-position: center center;
`;

const Title = styled.h2`
	font-size: 68px;
	margin-bottom: 20px;
`;
const Overview = styled.p`
	font-size: 24px;
	width: 50%;
`;

const Slider = styled(motion.div)`
	position: relative;
	top: -100px;
`;

const Row = styled(motion.div)`
	display: grid;
	grid-template-columns: repeat(6, 1fr);
	gap: 5px;
	position: absolute;
	bottom: 0;
	width: 100%;
`;

const Box = styled(motion.div)<{ $bgPhoto: string }>`
	height: 200px;
	color: ${props => props.theme.white.darker};
	font-size: 66px;
	background-image: url(${props => props.$bgPhoto});
	background-size: cover;
	background-position: center center;
	&:first-child {
		transform-origin: center left;
	}
	&:last-child {
		transform-origin: center right;
	}
`;

const Info = styled(motion.div)`
	position: absolute;
	bottom: 0;
	width: 100%;
	padding: 20px;
	background-color: ${props => props.theme.black.lighter};
	opacity: 0;
	h4 {
		text-align: center;
		font-size: 18px;
	}
`;

const Overlay = styled(motion.div)`
	position: fixed;
	top: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.75);
	opacity: 0;
`;

const BigMovie = styled(motion.div)`
	position: absolute;
	width: 40vw;
	height: 50vh;
	left: 0;
	right: 0;
	margin: 0 auto;
	border-radius: 15px;
	overflow: hidden;
	background-color: ${props => props.theme.black.lighter};
`;

const BigCover = styled.div`
	width: 100%;
	height: 400px;
	background-size: cover;
	background-position: center center;
`;
const BigTitle = styled.h3`
	color: ${props => props.theme.white.lighter};
	font-size: 46px;
	position: relative;
	top: -60px;
	padding: 10px;
`;

const BigOverview = styled.p`
	padding: 20px;
	color: ${props => props.theme.white.lighter};
`;

const rowVariants = {
	hidden: {
		x: window.innerWidth + 5,
	},
	visible: { x: 0 },
	exit: {
		x: -window.innerWidth,
	},
};

const boxVariants = {
	normal: {
		scale: 1,
	},
	hover: {
		scale: 1.3,
		y: -80,
		transition: {
			delay: 0.3,
			duration: 0.1,
			type: "tween",
		},
	},
};

const infoVariants = {
	hover: {
		opacity: 1,
		transition: {
			delay: 0.3,
			duration: 0.1,
			type: "tween",
		},
	},
};

const offset = 6;

function Home() {
	const navigate = useNavigate();
	const bigMovieMatch = useMatch("/movies/:movieId");
	const { scrollY } = useScroll();
	const { data, isLoading } = useQuery<IGetMoivesResult>({
		queryKey: ["movies", "nowPlaying"],
		queryFn: getMovies,
	});

	const [index, setIndex] = useState(0);
	const increaseIndex = () => {
		if (data) {
			if (isLeaving) return;
			toggleLeaving();
			const totalMovies = data?.results.length - 1;
			const maxIndex = Math.floor(totalMovies / offset) - 1;
			setIndex(prev => (prev === maxIndex ? 0 : prev + 1));
		}
	};
	const [isLeaving, setIsLeaving] = useState(false);
	const toggleLeaving = () => setIsLeaving(prev => !prev);
	const onBoxClicked = (movieId: number) => {
		navigate(`/movies/${movieId}`);
	};

	const onOverlayClick = () => {
		navigate(-1);
	};

	const clickedMovie = bigMovieMatch?.params.movieId && data?.results.find(movie => String(movie.id) === bigMovieMatch.params.movieId);

	return (
		<Wrapper>
			{isLoading ? (
				<Loader>Loading... </Loader>
			) : (
				<>
					<Banner onClick={increaseIndex} $bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}>
						<Title>{data?.results[0].title}</Title>
						<Overview>{data?.results[0].overview}</Overview>
					</Banner>
					<Slider>
						<AnimatePresence initial={false} onExitComplete={toggleLeaving}>
							<Row variants={rowVariants} initial="hidden" animate="visible" exit="exit" transition={{ type: "tween", duration: 1 }} key={index}>
								{data?.results
									.slice(1)
									.slice(offset * index, offset * index + offset)
									.map(movie => (
										<Box
											layoutId={movie.id.toString()}
											key={movie.id}
											variants={boxVariants}
											whileHover="hover"
											transition={{ type: "tween" }}
											$bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
											onClick={() => onBoxClicked(movie.id)}
										>
											<Info variants={infoVariants}>
												<h4>{movie.title}</h4>
											</Info>
										</Box>
									))}
							</Row>
						</AnimatePresence>
					</Slider>
					<AnimatePresence>
						{bigMovieMatch && (
							<>
								<Overlay onClick={onOverlayClick} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
								<BigMovie layoutId={bigMovieMatch.params.movieId} style={{ top: scrollY.get() + 100 }}>
									{clickedMovie && (
										<>
											<BigCover
												style={{
													backgroundImage: `linear-gradient(to bottom, transparent, black),url(${makeImagePath(clickedMovie.backdrop_path, "w500")} )`,
												}}
											/>
											<BigTitle>{clickedMovie.title}</BigTitle>
											<BigOverview>{clickedMovie.overview}</BigOverview>
										</>
									)}
								</BigMovie>
							</>
						)}
					</AnimatePresence>
				</>
			)}
		</Wrapper>
	);
}

export default Home;
