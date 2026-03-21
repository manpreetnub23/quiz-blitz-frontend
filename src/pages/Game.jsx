import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useGameStore from "../store/useGameStore";
import { initSocketListeners } from "../socket/listeners";
import QuestionCard from "../components/QuestionCard";

const STARS = [
	{ id: 0, x: 47.01, y: 72.83, s: 0.76, dur: 5.53, delay: 2.87, op: 0.49 },
	{ id: 1, x: 26.52, y: 24.52, s: 1.38, dur: 3.89, delay: 2.91, op: 0.5 },
	{ id: 2, x: 96.32, y: 30.95, s: 1.24, dur: 3.98, delay: 5.12, op: 0.65 },
	{ id: 3, x: 20.64, y: 75.26, s: 0.96, dur: 4.78, delay: 6.1, op: 0.18 },
	{ id: 4, x: 21.26, y: 41.19, s: 0.47, dur: 3.27, delay: 2.92, op: 0.17 },
	{ id: 5, x: 74.35, y: 76.28, s: 0.87, dur: 3.25, delay: 1.41, op: 0.33 },
	{ id: 6, x: 31.65, y: 21.41, s: 1.44, dur: 2.76, delay: 0.28, op: 0.22 },
	{ id: 7, x: 1.94, y: 86.54, s: 1.41, dur: 3.14, delay: 6.72, op: 0.54 },
	{ id: 8, x: 42.1, y: 11.2, s: 1.42, dur: 4.35, delay: 1.61, op: 0.65 },
	{ id: 9, x: 36.57, y: 20.31, s: 0.99, dur: 5.31, delay: 0.99, op: 0.31 },
	{ id: 10, x: 33.73, y: 94.01, s: 1.6, dur: 3.75, delay: 1.19, op: 0.48 },
	{ id: 11, x: 86.12, y: 33.18, s: 0.65, dur: 4.68, delay: 0.69, op: 0.56 },
	{ id: 12, x: 0.43, y: 15.07, s: 1.24, dur: 3.27, delay: 0.57, op: 0.54 },
	{ id: 13, x: 23.93, y: 46.12, s: 0.72, dur: 4.0, delay: 3.05, op: 0.63 },
	{ id: 14, x: 20.09, y: 7.08, s: 0.76, dur: 2.37, delay: 4.63, op: 0.24 },
	{ id: 15, x: 10.06, y: 21.87, s: 0.63, dur: 3.43, delay: 3.61, op: 0.22 },
	{ id: 16, x: 35.46, y: 70.25, s: 1.36, dur: 4.23, delay: 6.52, op: 0.4 },
	{ id: 17, x: 93.61, y: 72.05, s: 1.16, dur: 2.3, delay: 0.39, op: 0.17 },
	{ id: 18, x: 82.95, y: 90.67, s: 1.14, dur: 2.17, delay: 3.53, op: 0.23 },
	{ id: 19, x: 58.39, y: 73.18, s: 0.59, dur: 2.33, delay: 0.73, op: 0.62 },
	{ id: 20, x: 56.17, y: 99.46, s: 1.16, dur: 4.3, delay: 3.92, op: 0.4 },
	{ id: 21, x: 31.47, y: 12.29, s: 0.43, dur: 2.06, delay: 4.45, op: 0.44 },
	{ id: 22, x: 61.99, y: 21.02, s: 0.65, dur: 2.6, delay: 1.3, op: 0.27 },
	{ id: 23, x: 73.26, y: 63.43, s: 1.4, dur: 5.18, delay: 1.52, op: 0.42 },
	{ id: 24, x: 44.87, y: 41.84, s: 1.24, dur: 5.51, delay: 1.12, op: 0.32 },
	{ id: 25, x: 75.26, y: 35.67, s: 1.22, dur: 2.3, delay: 4.72, op: 0.53 },
	{ id: 26, x: 75.21, y: 41.92, s: 1.57, dur: 2.7, delay: 3.25, op: 0.37 },
	{ id: 27, x: 80.58, y: 43.16, s: 0.41, dur: 3.23, delay: 6.81, op: 0.62 },
	{ id: 28, x: 25.57, y: 73.31, s: 0.67, dur: 5.87, delay: 5.79, op: 0.57 },
	{ id: 29, x: 6.75, y: 88.28, s: 0.61, dur: 5.42, delay: 2.15, op: 0.6 },
	{ id: 30, x: 49.5, y: 36.29, s: 0.96, dur: 3.62, delay: 3.44, op: 0.28 },
	{ id: 31, x: 3.73, y: 12.16, s: 0.84, dur: 4.47, delay: 1.26, op: 0.49 },
	{ id: 32, x: 5.44, y: 43.56, s: 0.43, dur: 5.63, delay: 6.58, op: 0.23 },
	{ id: 33, x: 31.76, y: 86.95, s: 0.56, dur: 4.19, delay: 0.76, op: 0.16 },
	{ id: 34, x: 59.82, y: 69.83, s: 0.92, dur: 2.47, delay: 1.62, op: 0.1 },
	{ id: 35, x: 12.44, y: 37.78, s: 1.09, dur: 3.67, delay: 5.52, op: 0.56 },
	{ id: 36, x: 92.49, y: 55.2, s: 1.32, dur: 5.58, delay: 1.93, op: 0.3 },
	{ id: 37, x: 63.75, y: 40.44, s: 1.31, dur: 3.14, delay: 3.65, op: 0.23 },
	{ id: 38, x: 77.96, y: 35.81, s: 0.91, dur: 3.76, delay: 2.16, op: 0.63 },
	{ id: 39, x: 68.53, y: 19.39, s: 1.17, dur: 2.03, delay: 2.66, op: 0.46 },
	{ id: 40, x: 26.29, y: 51.8, s: 1.18, dur: 3.0, delay: 3.76, op: 0.62 },
	{ id: 41, x: 76.42, y: 50.52, s: 0.96, dur: 2.98, delay: 1.73, op: 0.39 },
	{ id: 42, x: 73.89, y: 95.42, s: 1.56, dur: 5.63, delay: 3.36, op: 0.3 },
	{ id: 43, x: 3.11, y: 64.47, s: 1.23, dur: 4.97, delay: 6.32, op: 0.16 },
	{ id: 44, x: 61.23, y: 19.08, s: 1.32, dur: 5.82, delay: 5.31, op: 0.24 },
	{ id: 45, x: 80.63, y: 77.43, s: 1.21, dur: 3.99, delay: 6.59, op: 0.54 },
	{ id: 46, x: 16.78, y: 71.39, s: 1.39, dur: 2.09, delay: 0.87, op: 0.43 },
	{ id: 47, x: 13.03, y: 38.53, s: 1.58, dur: 5.29, delay: 0.69, op: 0.52 },
	{ id: 48, x: 23.44, y: 29.55, s: 1.48, dur: 5.23, delay: 6.51, op: 0.31 },
	{ id: 49, x: 10.77, y: 13.08, s: 0.89, dur: 4.44, delay: 2.34, op: 0.55 },
	{ id: 50, x: 23.58, y: 60.26, s: 0.86, dur: 4.19, delay: 1.2, op: 0.54 },
	{ id: 51, x: 25.74, y: 87.96, s: 1.06, dur: 4.75, delay: 5.18, op: 0.21 },
	{ id: 52, x: 81.31, y: 67.51, s: 0.68, dur: 1.9, delay: 4.32, op: 0.16 },
	{ id: 53, x: 42.37, y: 42.04, s: 0.97, dur: 2.96, delay: 2.52, op: 0.29 },
	{ id: 54, x: 48.22, y: 67.72, s: 0.94, dur: 4.12, delay: 0.22, op: 0.6 },
	{ id: 55, x: 18.72, y: 65.1, s: 0.99, dur: 3.32, delay: 3.4, op: 0.62 },
	{ id: 56, x: 6.46, y: 73.69, s: 1.57, dur: 2.93, delay: 1.28, op: 0.36 },
	{ id: 57, x: 62.12, y: 14.11, s: 0.54, dur: 2.01, delay: 5.29, op: 0.51 },
	{ id: 58, x: 70.87, y: 8.21, s: 0.98, dur: 5.77, delay: 3.69, op: 0.47 },
	{ id: 59, x: 84.51, y: 67.01, s: 1.19, dur: 4.55, delay: 4.44, op: 0.37 },
	{ id: 60, x: 57.92, y: 67.68, s: 1.21, dur: 4.07, delay: 4.99, op: 0.27 },
	{ id: 61, x: 99.83, y: 25.06, s: 0.45, dur: 4.41, delay: 5.55, op: 0.24 },
	{ id: 62, x: 34.53, y: 5.32, s: 0.42, dur: 3.13, delay: 2.21, op: 0.2 },
	{ id: 63, x: 28.35, y: 45.41, s: 0.46, dur: 2.47, delay: 5.5, op: 0.45 },
	{ id: 64, x: 39.33, y: 41.24, s: 1.22, dur: 2.36, delay: 0.09, op: 0.3 },
	{ id: 65, x: 41.49, y: 24.78, s: 0.81, dur: 4.36, delay: 2.29, op: 0.5 },
	{ id: 66, x: 59.57, y: 80.69, s: 0.9, dur: 4.43, delay: 3.09, op: 0.17 },
	{ id: 67, x: 11.61, y: 99.51, s: 1.52, dur: 3.52, delay: 6.99, op: 0.37 },
	{ id: 68, x: 72.72, y: 92.45, s: 1.42, dur: 5.87, delay: 5.88, op: 0.45 },
	{ id: 69, x: 81.71, y: 95.7, s: 1.48, dur: 5.0, delay: 2.59, op: 0.58 },
	{ id: 70, x: 84.98, y: 7.03, s: 1.47, dur: 3.83, delay: 4.15, op: 0.57 },
	{ id: 71, x: 77.97, y: 94.44, s: 1.5, dur: 4.5, delay: 5.07, op: 0.31 },
	{ id: 72, x: 64.05, y: 90.18, s: 0.42, dur: 5.41, delay: 6.3, op: 0.49 },
	{ id: 73, x: 89.46, y: 16.38, s: 0.58, dur: 1.86, delay: 0.11, op: 0.13 },
	{ id: 74, x: 33.42, y: 97.61, s: 0.69, dur: 3.97, delay: 5.46, op: 0.19 },
	{ id: 75, x: 83.31, y: 4.15, s: 1.5, dur: 5.24, delay: 2.51, op: 0.39 },
	{ id: 76, x: 55.87, y: 10.81, s: 0.7, dur: 1.85, delay: 5.68, op: 0.38 },
	{ id: 77, x: 53.78, y: 44.53, s: 1.3, dur: 5.09, delay: 4.73, op: 0.18 },
	{ id: 78, x: 86.75, y: 26.64, s: 0.4, dur: 5.62, delay: 1.7, op: 0.34 },
	{ id: 79, x: 14.53, y: 33.62, s: 1.11, dur: 2.31, delay: 0.56, op: 0.5 },
	{ id: 80, x: 22.93, y: 75.7, s: 1.48, dur: 2.48, delay: 3.27, op: 0.58 },
	{ id: 81, x: 19.8, y: 47.1, s: 0.89, dur: 4.41, delay: 0.55, op: 0.46 },
	{ id: 82, x: 75.85, y: 75.24, s: 1.03, dur: 5.26, delay: 6.23, op: 0.45 },
	{ id: 83, x: 70.65, y: 24.25, s: 1.29, dur: 2.45, delay: 0.14, op: 0.63 },
	{ id: 84, x: 72.54, y: 27.56, s: 1.22, dur: 5.3, delay: 4.78, op: 0.32 },
	{ id: 85, x: 68.07, y: 38.56, s: 0.93, dur: 4.2, delay: 0.83, op: 0.25 },
	{ id: 86, x: 26.18, y: 14.7, s: 0.54, dur: 4.6, delay: 0.57, op: 0.37 },
	{ id: 87, x: 58.05, y: 12.56, s: 0.57, dur: 3.73, delay: 4.25, op: 0.32 },
	{ id: 88, x: 72.06, y: 56.43, s: 0.89, dur: 3.64, delay: 6.29, op: 0.28 },
	{ id: 89, x: 57.33, y: 84.21, s: 1.03, dur: 5.33, delay: 6.83, op: 0.44 },
	{ id: 90, x: 95.16, y: 41.39, s: 1.01, dur: 4.92, delay: 2.56, op: 0.27 },
	{ id: 91, x: 98.05, y: 69.01, s: 1.48, dur: 2.95, delay: 1.54, op: 0.46 },
	{ id: 92, x: 57.66, y: 94.87, s: 1.53, dur: 5.14, delay: 2.42, op: 0.6 },
	{ id: 93, x: 8.62, y: 65.66, s: 1.46, dur: 3.22, delay: 0.11, op: 0.44 },
	{ id: 94, x: 74.89, y: 96.08, s: 1.17, dur: 3.64, delay: 3.6, op: 0.15 },
	{ id: 95, x: 48.32, y: 55.88, s: 0.76, dur: 3.91, delay: 2.39, op: 0.15 },
	{ id: 96, x: 18.86, y: 54.04, s: 1.16, dur: 1.93, delay: 4.78, op: 0.47 },
	{ id: 97, x: 85.1, y: 64.39, s: 0.6, dur: 2.15, delay: 2.79, op: 0.6 },
	{ id: 98, x: 75.72, y: 32.04, s: 1.34, dur: 4.85, delay: 4.61, op: 0.29 },
	{ id: 99, x: 96.63, y: 44.07, s: 1.32, dur: 3.69, delay: 3.6, op: 0.52 },
	{ id: 100, x: 3.84, y: 28.5, s: 1.22, dur: 5.35, delay: 5.82, op: 0.16 },
	{ id: 101, x: 14.02, y: 20.72, s: 0.5, dur: 5.1, delay: 5.97, op: 0.16 },
	{ id: 102, x: 1.58, y: 10.26, s: 1.6, dur: 2.78, delay: 5.82, op: 0.43 },
	{ id: 103, x: 51.45, y: 19.23, s: 0.64, dur: 3.08, delay: 6.17, op: 0.29 },
	{ id: 104, x: 76.56, y: 28.02, s: 0.49, dur: 5.18, delay: 3.61, op: 0.48 },
	{ id: 105, x: 44.67, y: 31.75, s: 1.55, dur: 2.64, delay: 3.18, op: 0.15 },
	{ id: 106, x: 74.48, y: 66.34, s: 1.44, dur: 4.63, delay: 5.62, op: 0.44 },
	{ id: 107, x: 92.84, y: 52.82, s: 0.7, dur: 2.5, delay: 2.48, op: 0.22 },
	{ id: 108, x: 38.53, y: 71.48, s: 0.62, dur: 5.32, delay: 0.18, op: 0.64 },
	{ id: 109, x: 69.73, y: 68.32, s: 0.7, dur: 3.23, delay: 4.7, op: 0.6 },
	{ id: 110, x: 4.96, y: 64.59, s: 0.73, dur: 4.94, delay: 3.13, op: 0.54 },
	{ id: 111, x: 21.77, y: 83.12, s: 1.09, dur: 2.15, delay: 1.69, op: 0.24 },
	{ id: 112, x: 48.25, y: 86.66, s: 0.61, dur: 4.0, delay: 0.38, op: 0.54 },
	{ id: 113, x: 45.1, y: 41.06, s: 0.92, dur: 2.06, delay: 1.21, op: 0.54 },
	{ id: 114, x: 66.94, y: 56.31, s: 1.32, dur: 5.97, delay: 5.73, op: 0.52 },
	{ id: 115, x: 71.5, y: 55.81, s: 1.49, dur: 5.59, delay: 3.48, op: 0.23 },
	{ id: 116, x: 38.05, y: 18.19, s: 0.85, dur: 2.38, delay: 2.69, op: 0.2 },
	{ id: 117, x: 86.79, y: 69.97, s: 0.83, dur: 5.72, delay: 6.92, op: 0.14 },
	{ id: 118, x: 23.67, y: 94.8, s: 1.27, dur: 2.37, delay: 5.04, op: 0.36 },
	{ id: 119, x: 43.47, y: 35.75, s: 0.46, dur: 2.97, delay: 3.43, op: 0.64 },
	{ id: 120, x: 97.57, y: 87.24, s: 1.02, dur: 4.38, delay: 3.54, op: 0.2 },
	{ id: 121, x: 86.92, y: 89.45, s: 1.29, dur: 2.12, delay: 0.17, op: 0.37 },
	{ id: 122, x: 5.15, y: 59.67, s: 0.77, dur: 3.01, delay: 2.66, op: 0.44 },
	{ id: 123, x: 5.94, y: 92.13, s: 1.59, dur: 4.06, delay: 1.72, op: 0.5 },
	{ id: 124, x: 40.77, y: 5.58, s: 0.81, dur: 2.15, delay: 0.23, op: 0.24 },
	{ id: 125, x: 62.56, y: 66.07, s: 1.36, dur: 4.21, delay: 4.56, op: 0.38 },
	{ id: 126, x: 87.84, y: 92.17, s: 1.12, dur: 5.33, delay: 6.24, op: 0.36 },
	{ id: 127, x: 46.4, y: 38.16, s: 1.02, dur: 2.59, delay: 2.66, op: 0.37 },
	{ id: 128, x: 98.49, y: 56.59, s: 0.64, dur: 2.69, delay: 2.07, op: 0.61 },
	{ id: 129, x: 39.38, y: 2.18, s: 0.93, dur: 4.9, delay: 6.28, op: 0.43 },
	{ id: 130, x: 83.69, y: 5.47, s: 1.6, dur: 5.75, delay: 6.22, op: 0.28 },
	{ id: 131, x: 12.93, y: 21.74, s: 0.44, dur: 3.06, delay: 6.76, op: 0.63 },
	{ id: 132, x: 61.46, y: 26.87, s: 1.52, dur: 3.67, delay: 6.03, op: 0.22 },
	{ id: 133, x: 74.56, y: 3.39, s: 1.41, dur: 2.24, delay: 4.21, op: 0.13 },
	{ id: 134, x: 0.74, y: 99.61, s: 0.69, dur: 2.87, delay: 4.2, op: 0.54 },
	{ id: 135, x: 25.72, y: 80.66, s: 0.94, dur: 5.83, delay: 4.18, op: 0.43 },
	{ id: 136, x: 82.51, y: 58.79, s: 1.0, dur: 3.64, delay: 5.43, op: 0.63 },
	{ id: 137, x: 87.51, y: 91.31, s: 0.87, dur: 2.11, delay: 6.82, op: 0.41 },
	{ id: 138, x: 97.28, y: 83.99, s: 0.75, dur: 5.14, delay: 6.85, op: 0.5 },
	{ id: 139, x: 90.55, y: 93.42, s: 0.77, dur: 3.77, delay: 6.82, op: 0.29 },
	{ id: 140, x: 42.44, y: 9.23, s: 1.32, dur: 3.74, delay: 2.84, op: 0.15 },
	{ id: 141, x: 97.8, y: 76.53, s: 0.85, dur: 5.1, delay: 0.08, op: 0.15 },
	{ id: 142, x: 3.44, y: 71.26, s: 1.19, dur: 3.21, delay: 5.66, op: 0.46 },
	{ id: 143, x: 10.32, y: 81.47, s: 1.51, dur: 4.88, delay: 0.75, op: 0.31 },
	{ id: 144, x: 57.57, y: 19.05, s: 0.73, dur: 5.39, delay: 0.11, op: 0.33 },
	{ id: 145, x: 89.24, y: 9.76, s: 1.46, dur: 3.63, delay: 2.22, op: 0.53 },
	{ id: 146, x: 23.92, y: 88.92, s: 1.22, dur: 2.21, delay: 0.62, op: 0.45 },
	{ id: 147, x: 47.15, y: 11.04, s: 0.43, dur: 2.57, delay: 4.61, op: 0.59 },
	{ id: 148, x: 17.41, y: 8.04, s: 0.45, dur: 5.55, delay: 6.45, op: 0.31 },
	{ id: 149, x: 84.89, y: 10.55, s: 1.3, dur: 3.45, delay: 2.46, op: 0.33 },
	{ id: 150, x: 37.17, y: 21.82, s: 1.18, dur: 4.56, delay: 1.05, op: 0.54 },
	{ id: 151, x: 66.08, y: 13.81, s: 1.5, dur: 5.89, delay: 3.62, op: 0.65 },
	{ id: 152, x: 46.3, y: 71.21, s: 1.5, dur: 4.39, delay: 4.84, op: 0.52 },
	{ id: 153, x: 25.18, y: 66.67, s: 0.49, dur: 3.43, delay: 6.51, op: 0.62 },
	{ id: 154, x: 39.64, y: 7.61, s: 1.52, dur: 3.72, delay: 0.3, op: 0.32 },
	{ id: 155, x: 89.94, y: 38.23, s: 1.55, dur: 2.4, delay: 2.12, op: 0.15 },
	{ id: 156, x: 45.01, y: 4.02, s: 1.27, dur: 4.12, delay: 5.02, op: 0.29 },
	{ id: 157, x: 44.83, y: 14.44, s: 0.83, dur: 5.26, delay: 6.59, op: 0.31 },
	{ id: 158, x: 45.1, y: 66.47, s: 1.49, dur: 2.29, delay: 5.23, op: 0.22 },
	{ id: 159, x: 69.34, y: 88.14, s: 0.82, dur: 4.6, delay: 5.89, op: 0.3 },
	{ id: 160, x: 21.41, y: 74.8, s: 0.62, dur: 3.78, delay: 4.41, op: 0.3 },
	{ id: 161, x: 37.31, y: 62.69, s: 1.25, dur: 3.75, delay: 6.95, op: 0.29 },
	{ id: 162, x: 24.97, y: 31.26, s: 0.45, dur: 3.86, delay: 6.67, op: 0.35 },
	{ id: 163, x: 1.95, y: 92.76, s: 1.34, dur: 5.98, delay: 0.07, op: 0.3 },
	{ id: 164, x: 18.36, y: 5.38, s: 0.81, dur: 4.72, delay: 6.36, op: 0.19 },
	{ id: 165, x: 32.0, y: 63.81, s: 1.25, dur: 5.12, delay: 1.11, op: 0.36 },
	{ id: 166, x: 86.69, y: 2.66, s: 1.13, dur: 2.16, delay: 2.54, op: 0.28 },
	{ id: 167, x: 83.65, y: 74.72, s: 0.55, dur: 3.32, delay: 1.05, op: 0.63 },
	{ id: 168, x: 59.71, y: 4.13, s: 1.01, dur: 4.31, delay: 0.55, op: 0.47 },
	{ id: 169, x: 33.78, y: 55.5, s: 1.2, dur: 2.7, delay: 4.66, op: 0.16 },
	{ id: 170, x: 18.64, y: 12.06, s: 0.91, dur: 4.58, delay: 2.16, op: 0.59 },
	{ id: 171, x: 10.64, y: 93.55, s: 0.69, dur: 4.53, delay: 4.78, op: 0.48 },
	{ id: 172, x: 77.25, y: 62.92, s: 1.16, dur: 2.14, delay: 0.8, op: 0.47 },
	{ id: 173, x: 29.37, y: 9.18, s: 0.47, dur: 3.88, delay: 3.34, op: 0.38 },
	{ id: 174, x: 86.48, y: 77.74, s: 0.69, dur: 2.44, delay: 0.47, op: 0.27 },
	{ id: 175, x: 66.41, y: 65.16, s: 1.3, dur: 4.34, delay: 4.07, op: 0.15 },
	{ id: 176, x: 1.89, y: 86.87, s: 0.64, dur: 2.12, delay: 2.04, op: 0.38 },
	{ id: 177, x: 46.44, y: 50.41, s: 1.3, dur: 5.12, delay: 4.69, op: 0.63 },
	{ id: 178, x: 64.03, y: 3.99, s: 0.87, dur: 3.76, delay: 1.85, op: 0.32 },
	{ id: 179, x: 18.91, y: 95.9, s: 0.92, dur: 4.33, delay: 0.27, op: 0.58 },
	{ id: 180, x: 18.6, y: 62.81, s: 1.36, dur: 1.88, delay: 5.72, op: 0.39 },
	{ id: 181, x: 70.28, y: 68.97, s: 0.55, dur: 3.6, delay: 3.39, op: 0.41 },
	{ id: 182, x: 47.95, y: 14.58, s: 0.54, dur: 5.51, delay: 5.72, op: 0.21 },
	{ id: 183, x: 11.51, y: 78.11, s: 0.91, dur: 3.36, delay: 2.76, op: 0.6 },
	{ id: 184, x: 1.34, y: 12.41, s: 0.87, dur: 4.99, delay: 2.43, op: 0.36 },
	{ id: 185, x: 78.03, y: 24.46, s: 1.32, dur: 5.05, delay: 1.35, op: 0.53 },
	{ id: 186, x: 66.04, y: 43.65, s: 1.38, dur: 2.41, delay: 0.73, op: 0.23 },
	{ id: 187, x: 76.13, y: 50.86, s: 0.62, dur: 3.39, delay: 4.86, op: 0.27 },
	{ id: 188, x: 65.45, y: 31.61, s: 0.48, dur: 3.21, delay: 6.12, op: 0.36 },
	{ id: 189, x: 41.88, y: 20.64, s: 1.02, dur: 4.11, delay: 2.58, op: 0.46 },
	{ id: 190, x: 63.61, y: 78.04, s: 0.49, dur: 4.22, delay: 4.42, op: 0.35 },
	{ id: 191, x: 91.58, y: 83.72, s: 1.07, dur: 4.95, delay: 0.72, op: 0.16 },
	{ id: 192, x: 65.38, y: 86.96, s: 0.52, dur: 2.41, delay: 2.9, op: 0.62 },
	{ id: 193, x: 23.73, y: 31.36, s: 1.44, dur: 3.17, delay: 1.32, op: 0.64 },
	{ id: 194, x: 14.55, y: 85.3, s: 1.55, dur: 4.62, delay: 6.78, op: 0.23 },
	{ id: 195, x: 25.46, y: 62.87, s: 1.36, dur: 2.92, delay: 2.11, op: 0.13 },
	{ id: 196, x: 54.78, y: 20.68, s: 0.45, dur: 2.52, delay: 1.14, op: 0.11 },
	{ id: 197, x: 98.75, y: 41.15, s: 1.41, dur: 4.32, delay: 5.19, op: 0.42 },
	{ id: 198, x: 0.53, y: 79.0, s: 1.49, dur: 2.92, delay: 2.47, op: 0.3 },
	{ id: 199, x: 64.04, y: 56.5, s: 1.05, dur: 5.81, delay: 4.71, op: 0.34 },
];

const PLANETS = [
	{ r: 70, sz: 9, color: "#A78BFA", speed: 7, startDeg: 20 },
	{ r: 108, sz: 14, color: "#60A5FA", speed: 12, startDeg: 130 },
	{ r: 145, sz: 7, color: "#34D399", speed: 18, startDeg: 250 },
	{ r: 178, sz: 12, color: "#F472B6", speed: 14, startDeg: 55 },
	{ r: 208, sz: 5, color: "#94A3B8", speed: 22, startDeg: 310 },
];

const S = `
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;800;900&family=Exo+2:wght@300;400;500;600;700;800&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{background:#070710;min-height:100vh;overflow-x:hidden;}
.g-root{min-height:100vh;background:#070710;font-family:'Exo 2',sans-serif;color:#fff;position:relative;overflow:hidden;}

/* Starfield */
.g-sf{position:fixed;inset:0;pointer-events:none;z-index:0;}
.g-s{position:absolute;border-radius:50%;background:#fff;animation:tw ease-in-out infinite;}
@keyframes tw{0%,100%{opacity:var(--op,.3)}50%{opacity:1;transform:scale(1.5)}}

/* Nav */
.g-nav{position:fixed;top:0;left:0;right:0;z-index:200;background:rgba(7,7,16,0.9);border-bottom:1px solid rgba(255,255,255,0.06);backdrop-filter:blur(24px);height:60px;padding:0 40px;display:flex;align-items:center;justify-content:space-between;}
.g-brand{font-family:'Orbitron',monospace;font-size:15px;font-weight:900;letter-spacing:3px;}
.g-brand span{color:#A78BFA;}
.g-code-pill{font-family:'Orbitron',monospace;font-size:12px;font-weight:700;letter-spacing:3px;color:rgba(255,255,255,0.4);background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);border-radius:8px;padding:5px 14px;}

/* Prepare screen */
.g-prep{position:fixed;inset:0;z-index:100;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#070710;}

/* Solar system container — everything positioned relative to its center */
.g-solar{position:relative;flex-shrink:0;}

/* Orbit rings: centered using negative margin equal to half the diameter */
.g-oring{position:absolute;top:50%;left:50%;border-radius:50%;border:1px solid rgba(255,255,255,0.05);pointer-events:none;}

/* Each planet uses CSS animation on a wrapper that rotates around the sun center.
   Key fix: wrapper is 0x0 positioned at center, transform-origin 0 0,
   planet sits at (orbitRadius, 0) in the wrapper's local space */
.g-parm{
  position:absolute;
  top:50%;left:50%;
  width:0;height:0;
  transform-origin:0 0;
  animation:pSpin linear infinite;
}
@keyframes pSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}

.g-pball{
  position:absolute;
  border-radius:50%;
  /* planet centered at (orbitRadius, 0) — y offset by -half size */
}
.g-pball::after{
  content:'';position:absolute;inset:0;border-radius:50%;
  background:radial-gradient(circle at 35% 28%,rgba(255,255,255,0.5),transparent 60%);
}

/* Sun */
.g-sun{
  position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
  width:110px;height:110px;border-radius:50%;
  background:#09091A;
  border:1.5px solid rgba(167,139,250,0.4);
  box-shadow:0 0 0 10px rgba(167,139,250,0.05),0 0 0 22px rgba(167,139,250,0.025),0 0 70px rgba(167,139,250,0.3);
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  z-index:30;
  animation:sunPulse 3s ease-in-out infinite;
}
@keyframes sunPulse{
  0%,100%{box-shadow:0 0 0 10px rgba(167,139,250,0.05),0 0 0 22px rgba(167,139,250,0.025),0 0 70px rgba(167,139,250,0.3);}
  50%{box-shadow:0 0 0 14px rgba(167,139,250,0.09),0 0 0 30px rgba(167,139,250,0.045),0 0 110px rgba(167,139,250,0.5);}
}
.g-sun-num{font-family:'Orbitron',monospace;font-size:40px;font-weight:900;color:#fff;line-height:1;animation:numPop 0.45s cubic-bezier(0.34,1.56,0.64,1);}
@keyframes numPop{from{transform:scale(1.8);opacity:0.3}to{transform:scale(1);opacity:1}}
.g-sun-lbl{font-family:'Orbitron',monospace;font-size:7px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:rgba(167,139,250,0.5);margin-top:4px;}

/* Progress ring SVG centered over sun */
.g-prog-ring{position:absolute;top:50%;left:50%;z-index:31;pointer-events:none;}

.g-prep-lbl{margin-top:28px;font-family:'Orbitron',monospace;font-size:9px;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:rgba(255,255,255,0.2);animation:breathe 2.5s ease-in-out infinite;}
@keyframes breathe{0%,100%{opacity:0.2}50%{opacity:0.5}}

/* Game body */
.g-body{position:relative;z-index:10;max-width:820px;margin:0 auto;padding:80px 24px 48px;}
.g-error{background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.18);border-radius:12px;padding:12px 18px;color:#FCA5A5;font-size:13px;font-weight:600;margin-bottom:24px;}

/* Result */
.g-result{animation:fadeUp 0.5s ease both;}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
.g-rc{background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.07);border-radius:20px;overflow:hidden;margin-bottom:14px;}
.g-rc-head{padding:18px 24px;border-bottom:1px solid rgba(255,255,255,0.06);display:flex;align-items:center;gap:12px;}
.g-rc-icon{width:34px;height:34px;border-radius:9px;background:rgba(167,139,250,0.1);border:1px solid rgba(167,139,250,0.2);display:flex;align-items:center;justify-content:center;}
.g-rc-title{font-family:'Orbitron',monospace;font-size:12px;font-weight:700;letter-spacing:2px;color:rgba(255,255,255,0.5);}
.g-ca{padding:10px 24px 12px;border-bottom:1px solid rgba(255,255,255,0.05);display:flex;align-items:center;gap:10px;}
.g-ca-lbl{font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.25);}
.g-ca-val{font-size:13px;font-weight:700;color:#34D399;background:rgba(52,211,153,0.08);border:1px solid rgba(52,211,153,0.18);border-radius:7px;padding:3px 10px;}
.g-rc-body{padding:14px 18px;}
.g-rr{display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:12px;margin-bottom:7px;border:1px solid;animation:rowIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both;}
@keyframes rowIn{from{opacity:0;transform:translateX(-12px)}to{opacity:1;transform:translateX(0)}}
.g-rr:nth-child(1){animation-delay:.04s}.g-rr:nth-child(2){animation-delay:.08s}.g-rr:nth-child(3){animation-delay:.12s}.g-rr:nth-child(4){animation-delay:.16s}
.g-rr.ok{background:rgba(52,211,153,0.05);border-color:rgba(52,211,153,0.18);}
.g-rr.bad{background:rgba(239,68,68,0.04);border-color:rgba(239,68,68,0.12);}
.g-rr-st{width:26px;height:26px;border-radius:7px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.g-rr.ok .g-rr-st{background:rgba(52,211,153,0.12);}
.g-rr.bad .g-rr-st{background:rgba(239,68,68,0.1);}
.g-rr-info{flex:1;min-width:0;}
.g-rr-name{font-size:13px;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.g-rr-ans{font-size:11px;color:rgba(255,255,255,0.28);margin-top:2px;}
.g-rr-pts{font-family:'Orbitron',monospace;font-size:16px;font-weight:800;flex-shrink:0;}
.g-rr-pts.pos{color:#34D399;}.g-rr-pts.neg{color:rgba(255,255,255,0.18);}
.g-next{display:flex;align-items:center;justify-content:center;gap:9px;padding:14px;border-radius:13px;background:rgba(167,139,250,0.04);border:1px solid rgba(167,139,250,0.1);font-size:12px;font-weight:600;color:rgba(255,255,255,0.28);}
.g-ndot{width:6px;height:6px;border-radius:50%;background:#A78BFA;animation:blink 1.4s ease infinite;}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0.1}}
@media(max-width:768px){.g-nav{padding:0 16px;height:54px;}.g-body{padding:72px 14px 40px;}}
@media(max-width:480px){.g-body{padding:64px 10px 36px;}}
`;

const ChartIcon = () => (
	<svg
		width="16"
		height="16"
		viewBox="0 0 24 24"
		fill="none"
		stroke="rgba(167,139,250,0.8)"
		strokeWidth="2"
		strokeLinecap="round"
	>
		<line x1="18" y1="20" x2="18" y2="10" />
		<line x1="12" y1="20" x2="12" y2="4" />
		<line x1="6" y1="20" x2="6" y2="14" />
	</svg>
);

export default function Game() {
	const navigate = useNavigate();
	const room = useGameStore((s) => s.room);
	const question = useGameStore((s) => s.question);
	const phase = useGameStore((s) => s.phase);
	const result = useGameStore((s) => s.result);
	const round = useGameStore((s) => s.round);
	const error = useGameStore((s) => s.error);

	const [countdown, setCountdown] = useState(5);
	const [pct, setPct] = useState(1);
	const [popKey, setPopKey] = useState(0);
	const ivRef = useRef(null);
	const prevRef = useRef(null);

	useEffect(() => {
		initSocketListeners();
	}, []);

	useEffect(() => {
		if (!room?.roomCode) {
			navigate("/");
			return;
		}
		if (phase === "finished") navigate("/result");
	}, [room?.roomCode, phase, navigate]);

	useEffect(() => {
		clearInterval(ivRef.current);
		if (phase !== "prepare") return;
		const tick = () => {
			let s, p;
			if (round?.startTime && round?.duration) {
				const left = Math.max(
					round.duration - (Date.now() - round.startTime),
					0,
				);
				s = Math.ceil(left / 1000);
				p = left / round.duration;
			} else {
				s = countdown > 0 ? countdown : 5;
				p = s / 5;
			}
			if (s !== prevRef.current) {
				setPopKey((k) => k + 1);
				prevRef.current = s;
			}
			setCountdown(s);
			setPct(p);
		};
		tick();
		ivRef.current = setInterval(tick, 100);
		return () => clearInterval(ivRef.current);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [phase, round?.startTime, round?.duration]);

	const rows = (() => {
		if (!result) return [];
		if (Array.isArray(result)) return result;
		if (result.results && Array.isArray(result.results)) return result.results;
		return [];
	})();
	const correctAnswer = result?.correctAnswer ?? null;
	const nameById = new Map();
	for (const p of room?.players || []) nameById.set(p.id, p.name || p.id);

	// Responsive solar size
	const solarD = Math.min(
		480,
		(typeof window !== "undefined" ? window.innerWidth : 480) * 0.84,
	);
	const sc = solarD / 480;

	// Progress ring geometry
	const ringR = 62,
		ringC = 2 * Math.PI * ringR;
	const ringDiam = ringR * 2 + 20;

	return (
		<>
			<style>{S}</style>
			<div className="g-root">
				<div className="g-sf">
					{STARS.map((s) => (
						<div
							key={s.id}
							className="g-s"
							style={{
								left: `${s.x}%`,
								top: `${s.y}%`,
								width: s.s,
								height: s.s,
								"--op": s.op,
								animationDuration: `${s.dur}s`,
								animationDelay: `${s.delay}s`,
							}}
						/>
					))}
				</div>

				<nav className="g-nav">
					<div className="g-brand">
						QUIZ<span>BLITZ</span>
					</div>
					<div className="g-code-pill">{room?.roomCode}</div>
				</nav>

				{phase === "prepare" && (
					<div className="g-prep">
						{/* Stars behind solar system */}
						<div className="g-sf" style={{ position: "absolute" }}>
							{STARS.map((s) => (
								<div
									key={s.id}
									className="g-s"
									style={{
										left: `${s.x}%`,
										top: `${s.y}%`,
										width: s.s,
										height: s.s,
										"--op": s.op,
										animationDuration: `${s.dur}s`,
										animationDelay: `${s.delay}s`,
									}}
								/>
							))}
						</div>

						<div className="g-solar" style={{ width: solarD, height: solarD }}>
							{/* Orbit rings — each centered via negative margin */}
							{PLANETS.map((p, i) => {
								const d = p.r * 2 * sc;
								return (
									<div
										key={`or${i}`}
										className="g-oring"
										style={{
											width: d,
											height: d,
											marginLeft: -d / 2,
											marginTop: -d / 2,
										}}
									/>
								);
							})}

							{/* Planets — arm rotates around center (top:50%, left:50%), planet at end of arm */}
							{PLANETS.map((p, i) => {
								const orbitR = p.r * sc;
								const ps = p.sz * sc;
								return (
									<div
										key={`pa${i}`}
										className="g-parm"
										style={{
											animationDuration: `${p.speed}s`,
											animationDirection: i % 2 === 0 ? "normal" : "reverse",
											animationDelay: `-${(p.startDeg / 360) * p.speed}s`, // offset start angle
										}}
									>
										{/* Planet at distance orbitR along positive X axis, centered vertically */}
										<div
											className="g-pball"
											style={{
												width: ps,
												height: ps,
												left: orbitR - ps / 2,
												top: -ps / 2,
												background: `radial-gradient(circle at 35% 28%, ${p.color}cc, ${p.color} 55%, ${p.color}44 100%)`,
												boxShadow: `0 0 ${ps * 2.5}px ${ps * 0.8}px ${p.color}55`,
											}}
										/>
									</div>
								);
							})}

							{/* SVG progress ring — centered */}
							<svg
								className="g-prog-ring"
								width={ringDiam * sc}
								height={ringDiam * sc}
								viewBox={`0 0 ${ringDiam} ${ringDiam}`}
								style={{
									marginLeft: -(ringDiam * sc) / 2,
									marginTop: -(ringDiam * sc) / 2,
								}}
							>
								<circle
									cx={ringDiam / 2}
									cy={ringDiam / 2}
									r={ringR}
									fill="none"
									stroke="rgba(167,139,250,0.07)"
									strokeWidth="2"
								/>
								<circle
									cx={ringDiam / 2}
									cy={ringDiam / 2}
									r={ringR}
									fill="none"
									stroke="rgba(167,139,250,0.7)"
									strokeWidth="2"
									strokeLinecap="round"
									strokeDasharray={`${ringC * pct} ${ringC}`}
									transform={`rotate(-90 ${ringDiam / 2} ${ringDiam / 2})`}
									style={{
										transition: "stroke-dasharray 0.12s linear",
										filter: "drop-shadow(0 0 5px rgba(167,139,250,0.9))",
									}}
								/>
							</svg>

							{/* Sun core — centered via transform */}
							<div className="g-sun">
								<div className="g-sun-num" key={popKey}>
									{countdown}
								</div>
								<div className="g-sun-lbl">seconds</div>
							</div>
						</div>

						<div className="g-prep-lbl">Get ready · Next question incoming</div>
					</div>
				)}

				<div className="g-body">
					{error && <div className="g-error">{error}</div>}

					{phase === "question" && question && (
						<QuestionCard
							key={question.id ?? `${question.text ?? question.question}-${room?.currentQuestionIndex ?? ""}`}
							question={question}
							roomCode={room?.roomCode}
						/>
					)}

					{phase === "result" && (
						<div className="g-result">
							<div className="g-rc">
								<div className="g-rc-head">
									<div className="g-rc-icon">
										<ChartIcon />
									</div>
									<span className="g-rc-title">Round Results</span>
								</div>
								{correctAnswer && (
									<div className="g-ca">
										<span className="g-ca-lbl">Correct Answer</span>
										<span className="g-ca-val">{correctAnswer}</span>
									</div>
								)}
								<div className="g-rc-body">
									{rows.length > 0 ? (
										rows.map((e, i) => {
											const name =
												nameById.get(e.playerId) || e.playerId || "Player";
											return (
												<div
													key={e.playerId || i}
													className={`g-rr ${e.correct ? "ok" : "bad"}`}
													style={{ animationDelay: `${i * 0.04}s` }}
												>
													<div className="g-rr-st">
														<svg
															width="13"
															height="13"
															viewBox="0 0 24 24"
															fill="none"
															stroke={e.correct ? "#34D399" : "#F87171"}
															strokeWidth="3"
															strokeLinecap="round"
														>
															{e.correct ? (
																<polyline points="20 6 9 17 4 12" />
															) : (
																<>
																	<line x1="18" y1="6" x2="6" y2="18" />
																	<line x1="6" y1="6" x2="18" y2="18" />
																</>
															)}
														</svg>
													</div>
													<div className="g-rr-info">
														<div className="g-rr-name">{name}</div>
														{e.answer && (
															<div className="g-rr-ans">
																Answered: {e.answer}
															</div>
														)}
													</div>
													<div
														className={`g-rr-pts ${e.correct ? "pos" : "neg"}`}
													>
														{e.correct ? `+${e.score || e.points || 0}` : "—"}
													</div>
												</div>
											);
										})
									) : (
										<div
											style={{
												textAlign: "center",
												padding: "28px 0",
												color: "rgba(255,255,255,0.18)",
												fontSize: 13,
											}}
										>
											Calculating...
										</div>
									)}
								</div>
							</div>
							<div className="g-next">
								<span className="g-ndot" />
								Next question incoming
							</div>
						</div>
					)}
				</div>
			</div>
		</>
	);
}
