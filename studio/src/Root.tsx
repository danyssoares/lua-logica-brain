import React from 'react';
import { Composition } from 'remotion';
import { Reel, reelSchemaDefault } from './compositions/Reel';
import {
	CARROSSEL_SLIDE_VIDEO_FRAMES,
	CarrosselSlide,
	calculateCarrosselSlideMetadata,
	carrosselSlideDefault,
} from './compositions/CarrosselSlide';

const REEL_FPS = 30;

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition
				id="Reel"
				component={Reel}
				durationInFrames={reelSchemaDefault.slides.reduce((acc, s) => acc + s.durationInFrames, 0)}
				fps={REEL_FPS}
				width={1080}
				height={1920}
				defaultProps={{ data: reelSchemaDefault }}
			/>
			<Composition
				id="CarrosselSlide"
				component={CarrosselSlide}
				calculateMetadata={calculateCarrosselSlideMetadata}
				durationInFrames={CARROSSEL_SLIDE_VIDEO_FRAMES}
				fps={REEL_FPS}
				width={1080}
				height={1350}
				defaultProps={{ data: carrosselSlideDefault }}
			/>
		</>
	);
};
