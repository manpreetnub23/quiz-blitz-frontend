import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useGameStore from "../store/useGameStore";
import socket from "../socket/socket";

const STARS = [
	{ id: 0, x: 68.46, y: 97.37, s: 1.4, dur: 3.43, delay: 6.35, op: 0.44 },
	{ id: 1, x: 85.0, y: 0.66, s: 0.41, dur: 2.7, delay: 2.04, op: 0.43 },
	{ id: 2, x: 57.12, y: 75.74, s: 1.07, dur: 3.34, delay: 0.63, op: 0.35 },
	{ id: 3, x: 56.41, y: 43.84, s: 0.77, dur: 5.71, delay: 1.41, op: 0.41 },
	{ id: 4, x: 38.55, y: 90.1, s: 1.01, dur: 3.05, delay: 4.06, op: 0.22 },
	{ id: 5, x: 57.85, y: 93.55, s: 1.07, dur: 2.02, delay: 6.48, op: 0.55 },
	{ id: 6, x: 33.99, y: 71.62, s: 0.82, dur: 5.57, delay: 4.03, op: 0.27 },
	{ id: 7, x: 92.18, y: 96.97, s: 1.21, dur: 3.2, delay: 5.47, op: 0.44 },
	{ id: 8, x: 29.7, y: 60.14, s: 1.43, dur: 2.08, delay: 4.02, op: 0.14 },
	{ id: 9, x: 31.1, y: 33.13, s: 0.97, dur: 2.47, delay: 0.73, op: 0.24 },
	{ id: 10, x: 35.35, y: 85.25, s: 0.94, dur: 4.63, delay: 6.29, op: 0.37 },
	{ id: 11, x: 16.13, y: 68.17, s: 1.47, dur: 4.09, delay: 4.87, op: 0.14 },
	{ id: 12, x: 82.78, y: 53.49, s: 0.6, dur: 2.4, delay: 3.43, op: 0.22 },
	{ id: 13, x: 58.28, y: 65.99, s: 0.79, dur: 1.99, delay: 1.29, op: 0.56 },
	{ id: 14, x: 2.85, y: 59.68, s: 1.5, dur: 4.24, delay: 1.37, op: 0.4 },
	{ id: 15, x: 26.34, y: 47.41, s: 0.77, dur: 2.21, delay: 0.07, op: 0.55 },
	{ id: 16, x: 86.25, y: 18.51, s: 1.12, dur: 2.78, delay: 4.13, op: 0.59 },
	{ id: 17, x: 53.91, y: 50.89, s: 0.85, dur: 4.29, delay: 4.6, op: 0.55 },
	{ id: 18, x: 37.61, y: 76.63, s: 1.15, dur: 3.82, delay: 0.07, op: 0.17 },
	{ id: 19, x: 86.88, y: 78.19, s: 1.26, dur: 5.06, delay: 5.37, op: 0.57 },
	{ id: 20, x: 35.93, y: 10.92, s: 0.44, dur: 3.7, delay: 4.93, op: 0.35 },
	{ id: 21, x: 35.78, y: 15.26, s: 1.19, dur: 3.28, delay: 4.12, op: 0.58 },
	{ id: 22, x: 89.32, y: 37.61, s: 1.24, dur: 3.27, delay: 5.53, op: 0.23 },
	{ id: 23, x: 62.72, y: 94.77, s: 1.47, dur: 2.75, delay: 2.66, op: 0.42 },
	{ id: 24, x: 15.72, y: 15.47, s: 1.15, dur: 5.21, delay: 4.15, op: 0.15 },
	{ id: 25, x: 84.91, y: 28.83, s: 0.92, dur: 5.73, delay: 0.41, op: 0.19 },
	{ id: 26, x: 70.76, y: 40.07, s: 0.76, dur: 2.89, delay: 0.33, op: 0.3 },
	{ id: 27, x: 88.28, y: 76.38, s: 1.08, dur: 2.96, delay: 0.47, op: 0.38 },
	{ id: 28, x: 27.28, y: 13.39, s: 0.83, dur: 5.39, delay: 2.78, op: 0.14 },
	{ id: 29, x: 48.45, y: 99.92, s: 1.18, dur: 4.22, delay: 0.37, op: 0.35 },
	{ id: 30, x: 63.83, y: 27.74, s: 1.27, dur: 5.56, delay: 6.88, op: 0.27 },
	{ id: 31, x: 77.56, y: 37.19, s: 1.4, dur: 5.33, delay: 5.74, op: 0.51 },
	{ id: 32, x: 75.99, y: 31.15, s: 0.74, dur: 1.92, delay: 6.98, op: 0.59 },
	{ id: 33, x: 5.39, y: 34.86, s: 0.7, dur: 5.14, delay: 0.41, op: 0.56 },
	{ id: 34, x: 36.85, y: 17.04, s: 0.57, dur: 2.98, delay: 3.43, op: 0.24 },
	{ id: 35, x: 89.19, y: 14.92, s: 1.45, dur: 2.01, delay: 5.36, op: 0.12 },
	{ id: 36, x: 1.42, y: 55.32, s: 0.92, dur: 3.75, delay: 4.72, op: 0.33 },
	{ id: 37, x: 40.53, y: 86.49, s: 0.92, dur: 5.79, delay: 2.0, op: 0.38 },
	{ id: 38, x: 4.65, y: 45.38, s: 1.38, dur: 4.31, delay: 1.09, op: 0.43 },
	{ id: 39, x: 82.79, y: 52.7, s: 1.18, dur: 2.14, delay: 0.24, op: 0.59 },
	{ id: 40, x: 19.1, y: 19.07, s: 1.1, dur: 4.48, delay: 1.23, op: 0.36 },
	{ id: 41, x: 74.76, y: 43.0, s: 1.05, dur: 5.74, delay: 4.63, op: 0.43 },
	{ id: 42, x: 48.49, y: 71.08, s: 1.28, dur: 2.06, delay: 1.87, op: 0.52 },
	{ id: 43, x: 88.77, y: 60.54, s: 0.43, dur: 4.41, delay: 1.77, op: 0.51 },
	{ id: 44, x: 51.64, y: 25.34, s: 0.67, dur: 3.34, delay: 3.63, op: 0.13 },
	{ id: 45, x: 96.28, y: 11.69, s: 0.86, dur: 5.56, delay: 6.6, op: 0.27 },
	{ id: 46, x: 48.94, y: 75.09, s: 0.96, dur: 2.05, delay: 2.92, op: 0.39 },
	{ id: 47, x: 71.42, y: 43.93, s: 1.1, dur: 3.04, delay: 0.51, op: 0.3 },
	{ id: 48, x: 36.56, y: 54.32, s: 1.38, dur: 4.93, delay: 1.76, op: 0.49 },
	{ id: 49, x: 14.54, y: 35.91, s: 1.09, dur: 5.44, delay: 3.32, op: 0.53 },
	{ id: 50, x: 96.84, y: 78.91, s: 0.71, dur: 5.14, delay: 5.64, op: 0.5 },
	{ id: 51, x: 2.45, y: 87.03, s: 0.83, dur: 3.44, delay: 1.56, op: 0.28 },
	{ id: 52, x: 28.21, y: 56.82, s: 1.12, dur: 3.47, delay: 5.75, op: 0.53 },
	{ id: 53, x: 70.5, y: 15.57, s: 0.47, dur: 4.82, delay: 4.81, op: 0.43 },
	{ id: 54, x: 27.11, y: 33.04, s: 1.28, dur: 4.89, delay: 2.83, op: 0.21 },
	{ id: 55, x: 72.97, y: 4.15, s: 1.32, dur: 2.39, delay: 3.47, op: 0.48 },
	{ id: 56, x: 80.52, y: 4.68, s: 1.13, dur: 2.63, delay: 6.23, op: 0.54 },
	{ id: 57, x: 62.5, y: 13.19, s: 0.92, dur: 2.08, delay: 5.47, op: 0.38 },
	{ id: 58, x: 37.28, y: 86.77, s: 1.47, dur: 5.7, delay: 6.86, op: 0.29 },
	{ id: 59, x: 5.44, y: 20.58, s: 0.67, dur: 4.11, delay: 5.37, op: 0.52 },
	{ id: 60, x: 30.75, y: 18.25, s: 0.41, dur: 5.97, delay: 1.09, op: 0.11 },
	{ id: 61, x: 27.05, y: 89.22, s: 0.65, dur: 3.19, delay: 1.81, op: 0.26 },
	{ id: 62, x: 4.9, y: 9.26, s: 1.3, dur: 2.27, delay: 1.46, op: 0.27 },
	{ id: 63, x: 87.03, y: 51.56, s: 1.48, dur: 3.39, delay: 4.8, op: 0.35 },
	{ id: 64, x: 27.35, y: 56.81, s: 1.25, dur: 5.23, delay: 0.27, op: 0.22 },
	{ id: 65, x: 47.12, y: 42.06, s: 0.93, dur: 5.64, delay: 6.84, op: 0.18 },
	{ id: 66, x: 71.72, y: 29.1, s: 0.94, dur: 2.63, delay: 2.17, op: 0.37 },
	{ id: 67, x: 71.36, y: 75.57, s: 1.06, dur: 3.78, delay: 3.32, op: 0.25 },
	{ id: 68, x: 94.52, y: 44.41, s: 0.89, dur: 2.2, delay: 0.65, op: 0.49 },
	{ id: 69, x: 85.17, y: 26.95, s: 0.76, dur: 5.39, delay: 5.95, op: 0.37 },
	{ id: 70, x: 42.55, y: 28.15, s: 0.82, dur: 3.84, delay: 3.0, op: 0.26 },
	{ id: 71, x: 6.3, y: 82.7, s: 1.06, dur: 4.57, delay: 5.79, op: 0.41 },
	{ id: 72, x: 44.43, y: 34.82, s: 1.41, dur: 4.66, delay: 4.42, op: 0.43 },
	{ id: 73, x: 76.05, y: 38.01, s: 1.27, dur: 3.61, delay: 5.21, op: 0.49 },
	{ id: 74, x: 74.28, y: 29.28, s: 0.56, dur: 3.96, delay: 3.13, op: 0.43 },
	{ id: 75, x: 42.12, y: 8.77, s: 1.21, dur: 4.89, delay: 0.93, op: 0.2 },
	{ id: 76, x: 66.39, y: 68.06, s: 1.1, dur: 2.94, delay: 2.57, op: 0.17 },
	{ id: 77, x: 40.41, y: 68.57, s: 1.28, dur: 4.96, delay: 4.47, op: 0.22 },
	{ id: 78, x: 21.73, y: 92.1, s: 0.92, dur: 3.64, delay: 2.55, op: 0.6 },
	{ id: 79, x: 88.09, y: 98.89, s: 1.01, dur: 3.37, delay: 0.51, op: 0.57 },
	{ id: 80, x: 82.84, y: 85.87, s: 0.52, dur: 3.72, delay: 0.54, op: 0.58 },
	{ id: 81, x: 63.14, y: 63.66, s: 0.75, dur: 5.97, delay: 1.33, op: 0.25 },
	{ id: 82, x: 15.8, y: 72.25, s: 1.49, dur: 5.39, delay: 3.19, op: 0.56 },
	{ id: 83, x: 26.52, y: 65.6, s: 1.06, dur: 2.91, delay: 4.27, op: 0.33 },
	{ id: 84, x: 53.9, y: 13.4, s: 0.91, dur: 3.48, delay: 3.28, op: 0.1 },
	{ id: 85, x: 26.28, y: 63.89, s: 0.46, dur: 5.07, delay: 6.84, op: 0.39 },
	{ id: 86, x: 35.47, y: 43.92, s: 1.23, dur: 5.69, delay: 4.65, op: 0.52 },
	{ id: 87, x: 88.12, y: 3.43, s: 0.44, dur: 5.46, delay: 4.16, op: 0.39 },
	{ id: 88, x: 33.84, y: 9.55, s: 0.53, dur: 3.48, delay: 6.6, op: 0.58 },
	{ id: 89, x: 84.64, y: 80.91, s: 1.03, dur: 5.23, delay: 3.43, op: 0.35 },
	{ id: 90, x: 74.7, y: 34.17, s: 0.85, dur: 4.53, delay: 1.0, op: 0.4 },
	{ id: 91, x: 47.64, y: 84.79, s: 0.94, dur: 3.28, delay: 5.63, op: 0.16 },
	{ id: 92, x: 67.82, y: 58.94, s: 0.41, dur: 3.59, delay: 1.58, op: 0.35 },
	{ id: 93, x: 72.98, y: 90.96, s: 0.52, dur: 4.57, delay: 0.8, op: 0.13 },
	{ id: 94, x: 69.41, y: 91.76, s: 1.47, dur: 2.7, delay: 2.0, op: 0.31 },
	{ id: 95, x: 17.29, y: 80.11, s: 0.46, dur: 2.22, delay: 1.31, op: 0.39 },
	{ id: 96, x: 80.95, y: 10.39, s: 1.42, dur: 3.51, delay: 4.95, op: 0.25 },
	{ id: 97, x: 32.09, y: 9.33, s: 0.86, dur: 2.89, delay: 2.76, op: 0.26 },
	{ id: 98, x: 41.86, y: 71.15, s: 0.5, dur: 3.99, delay: 1.96, op: 0.28 },
	{ id: 99, x: 48.71, y: 56.6, s: 1.27, dur: 4.81, delay: 5.77, op: 0.2 },
	{ id: 100, x: 35.22, y: 14.64, s: 1.39, dur: 3.68, delay: 5.45, op: 0.5 },
	{ id: 101, x: 44.94, y: 69.55, s: 0.63, dur: 5.53, delay: 3.33, op: 0.15 },
	{ id: 102, x: 71.6, y: 89.07, s: 0.94, dur: 3.66, delay: 6.68, op: 0.55 },
	{ id: 103, x: 46.15, y: 23.23, s: 0.95, dur: 4.91, delay: 4.71, op: 0.56 },
	{ id: 104, x: 57.86, y: 0.03, s: 1.45, dur: 2.18, delay: 1.7, op: 0.36 },
	{ id: 105, x: 70.59, y: 51.0, s: 0.86, dur: 3.61, delay: 2.45, op: 0.21 },
	{ id: 106, x: 22.61, y: 71.46, s: 1.31, dur: 3.76, delay: 4.66, op: 0.29 },
	{ id: 107, x: 67.21, y: 36.92, s: 1.28, dur: 2.23, delay: 3.28, op: 0.57 },
	{ id: 108, x: 11.31, y: 65.49, s: 0.68, dur: 4.58, delay: 5.64, op: 0.25 },
	{ id: 109, x: 35.34, y: 35.4, s: 1.39, dur: 5.74, delay: 5.4, op: 0.21 },
	{ id: 110, x: 22.88, y: 85.72, s: 0.66, dur: 4.0, delay: 1.37, op: 0.52 },
	{ id: 111, x: 20.46, y: 18.54, s: 0.63, dur: 4.27, delay: 4.13, op: 0.22 },
	{ id: 112, x: 98.72, y: 25.13, s: 1.13, dur: 5.22, delay: 0.15, op: 0.48 },
	{ id: 113, x: 26.71, y: 54.0, s: 1.28, dur: 3.64, delay: 4.91, op: 0.3 },
	{ id: 114, x: 9.15, y: 63.29, s: 1.01, dur: 4.96, delay: 5.63, op: 0.55 },
	{ id: 115, x: 56.74, y: 96.26, s: 1.3, dur: 1.93, delay: 5.42, op: 0.34 },
	{ id: 116, x: 70.64, y: 40.3, s: 0.68, dur: 5.08, delay: 0.82, op: 0.58 },
	{ id: 117, x: 51.72, y: 2.75, s: 1.24, dur: 3.88, delay: 4.28, op: 0.55 },
	{ id: 118, x: 46.41, y: 76.55, s: 1.08, dur: 4.46, delay: 3.32, op: 0.36 },
	{ id: 119, x: 9.57, y: 22.5, s: 0.59, dur: 4.95, delay: 2.51, op: 0.56 },
	{ id: 120, x: 65.32, y: 42.76, s: 0.43, dur: 2.49, delay: 0.37, op: 0.38 },
	{ id: 121, x: 17.39, y: 36.69, s: 1.29, dur: 3.22, delay: 2.38, op: 0.27 },
	{ id: 122, x: 16.77, y: 97.1, s: 0.58, dur: 5.11, delay: 6.63, op: 0.47 },
	{ id: 123, x: 15.97, y: 28.79, s: 0.71, dur: 4.48, delay: 4.08, op: 0.19 },
	{ id: 124, x: 75.39, y: 45.45, s: 0.97, dur: 4.46, delay: 0.2, op: 0.25 },
	{ id: 125, x: 51.39, y: 95.23, s: 1.1, dur: 4.2, delay: 6.44, op: 0.34 },
	{ id: 126, x: 65.04, y: 41.43, s: 0.84, dur: 5.22, delay: 1.03, op: 0.41 },
	{ id: 127, x: 44.34, y: 85.56, s: 0.45, dur: 5.8, delay: 5.52, op: 0.55 },
	{ id: 128, x: 67.71, y: 42.48, s: 0.9, dur: 2.26, delay: 1.95, op: 0.28 },
	{ id: 129, x: 6.31, y: 84.59, s: 0.57, dur: 5.39, delay: 6.13, op: 0.22 },
	{ id: 130, x: 44.08, y: 16.6, s: 0.94, dur: 2.96, delay: 4.88, op: 0.53 },
	{ id: 131, x: 53.31, y: 12.33, s: 1.02, dur: 2.09, delay: 1.46, op: 0.46 },
	{ id: 132, x: 92.04, y: 28.01, s: 1.01, dur: 3.94, delay: 5.72, op: 0.51 },
	{ id: 133, x: 99.83, y: 39.37, s: 1.36, dur: 4.91, delay: 5.78, op: 0.41 },
	{ id: 134, x: 40.19, y: 50.75, s: 0.83, dur: 3.53, delay: 2.11, op: 0.18 },
	{ id: 135, x: 57.19, y: 26.06, s: 1.24, dur: 4.79, delay: 1.81, op: 0.41 },
	{ id: 136, x: 83.85, y: 82.18, s: 1.44, dur: 5.71, delay: 0.23, op: 0.15 },
	{ id: 137, x: 0.84, y: 91.73, s: 1.29, dur: 5.96, delay: 0.44, op: 0.15 },
	{ id: 138, x: 10.3, y: 79.22, s: 1.33, dur: 5.77, delay: 1.96, op: 0.51 },
	{ id: 139, x: 10.81, y: 97.33, s: 0.77, dur: 2.91, delay: 3.02, op: 0.53 },
	{ id: 140, x: 34.55, y: 49.74, s: 1.04, dur: 5.6, delay: 4.31, op: 0.44 },
	{ id: 141, x: 47.25, y: 63.67, s: 0.42, dur: 5.82, delay: 4.98, op: 0.57 },
	{ id: 142, x: 36.02, y: 4.78, s: 1.46, dur: 5.42, delay: 1.15, op: 0.34 },
	{ id: 143, x: 4.97, y: 66.45, s: 1.3, dur: 2.7, delay: 4.83, op: 0.39 },
	{ id: 144, x: 63.26, y: 34.92, s: 0.71, dur: 4.88, delay: 3.61, op: 0.56 },
	{ id: 145, x: 60.2, y: 78.24, s: 0.82, dur: 5.58, delay: 2.49, op: 0.41 },
	{ id: 146, x: 10.22, y: 32.13, s: 1.0, dur: 5.91, delay: 1.03, op: 0.53 },
	{ id: 147, x: 89.9, y: 10.26, s: 0.79, dur: 1.84, delay: 2.35, op: 0.26 },
	{ id: 148, x: 55.71, y: 80.63, s: 0.73, dur: 2.08, delay: 6.01, op: 0.35 },
	{ id: 149, x: 77.55, y: 61.68, s: 0.51, dur: 5.85, delay: 5.91, op: 0.52 },
	{ id: 150, x: 90.57, y: 97.57, s: 1.27, dur: 2.67, delay: 6.09, op: 0.35 },
	{ id: 151, x: 25.81, y: 56.44, s: 1.28, dur: 5.05, delay: 5.08, op: 0.41 },
	{ id: 152, x: 92.28, y: 12.27, s: 0.88, dur: 2.58, delay: 5.69, op: 0.33 },
	{ id: 153, x: 47.64, y: 90.32, s: 0.69, dur: 2.4, delay: 0.49, op: 0.27 },
	{ id: 154, x: 99.07, y: 77.66, s: 0.76, dur: 5.46, delay: 1.91, op: 0.26 },
	{ id: 155, x: 19.1, y: 54.82, s: 1.47, dur: 2.24, delay: 1.82, op: 0.2 },
	{ id: 156, x: 86.54, y: 4.94, s: 0.56, dur: 4.24, delay: 2.84, op: 0.21 },
	{ id: 157, x: 61.35, y: 70.87, s: 1.39, dur: 5.17, delay: 5.02, op: 0.44 },
	{ id: 158, x: 83.08, y: 91.2, s: 1.14, dur: 5.33, delay: 6.18, op: 0.19 },
	{ id: 159, x: 88.6, y: 60.83, s: 1.48, dur: 4.19, delay: 6.12, op: 0.34 },
	{ id: 160, x: 28.51, y: 52.11, s: 0.61, dur: 3.12, delay: 0.16, op: 0.51 },
	{ id: 161, x: 80.3, y: 75.55, s: 1.3, dur: 5.54, delay: 4.1, op: 0.53 },
	{ id: 162, x: 56.57, y: 18.41, s: 0.75, dur: 4.44, delay: 3.5, op: 0.19 },
	{ id: 163, x: 47.37, y: 86.02, s: 0.72, dur: 5.13, delay: 4.16, op: 0.57 },
	{ id: 164, x: 37.73, y: 92.92, s: 1.41, dur: 5.91, delay: 5.68, op: 0.17 },
	{ id: 165, x: 26.61, y: 78.29, s: 1.38, dur: 4.85, delay: 0.17, op: 0.11 },
	{ id: 166, x: 6.17, y: 89.12, s: 1.29, dur: 3.4, delay: 6.02, op: 0.44 },
	{ id: 167, x: 24.14, y: 58.95, s: 0.51, dur: 4.75, delay: 0.65, op: 0.37 },
	{ id: 168, x: 85.13, y: 88.26, s: 0.53, dur: 2.8, delay: 0.3, op: 0.24 },
	{ id: 169, x: 28.51, y: 26.29, s: 0.62, dur: 1.98, delay: 0.26, op: 0.46 },
	{ id: 170, x: 38.28, y: 44.76, s: 1.1, dur: 3.7, delay: 1.64, op: 0.54 },
	{ id: 171, x: 96.35, y: 9.08, s: 1.15, dur: 5.75, delay: 3.96, op: 0.2 },
	{ id: 172, x: 51.89, y: 62.43, s: 0.49, dur: 2.66, delay: 4.58, op: 0.19 },
	{ id: 173, x: 46.24, y: 39.31, s: 0.75, dur: 2.32, delay: 6.22, op: 0.23 },
	{ id: 174, x: 84.94, y: 30.27, s: 1.47, dur: 5.95, delay: 3.64, op: 0.52 },
	{ id: 175, x: 22.79, y: 72.47, s: 0.55, dur: 5.37, delay: 6.8, op: 0.27 },
	{ id: 176, x: 72.9, y: 5.14, s: 0.5, dur: 5.05, delay: 6.56, op: 0.29 },
	{ id: 177, x: 53.04, y: 41.2, s: 1.24, dur: 3.39, delay: 2.83, op: 0.57 },
	{ id: 178, x: 78.05, y: 86.48, s: 0.75, dur: 5.24, delay: 3.52, op: 0.4 },
	{ id: 179, x: 77.63, y: 66.57, s: 0.82, dur: 4.12, delay: 5.74, op: 0.35 },
];
const AV = ["#A78BFA", "#60A5FA", "#34D399", "#F472B6", "#FBBF24", "#06B6D4"];

const S = `
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;800;900&family=Exo+2:wght@300;400;500;600;700;800&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{background:#070710;min-height:100vh;overflow-x:hidden;}
.r-root{min-height:100vh;background:#070710;font-family:'Exo 2',sans-serif;color:#fff;position:relative;overflow-x:hidden;}
.r-sf{position:fixed;inset:0;pointer-events:none;z-index:0;}
.r-star{position:absolute;border-radius:50%;background:#fff;animation:tw ease-in-out infinite;}
@keyframes tw{0%,100%{opacity:var(--op,.2);transform:scale(1)}50%{opacity:1;transform:scale(1.8)}}

/* Shimmer particles on complete */
.r-shimmer{position:fixed;pointer-events:none;z-index:1;border-radius:50%;animation:drift linear infinite;}
@keyframes drift{0%{transform:translateY(-20px) rotate(0deg);opacity:1}100%{transform:translateY(105vh) rotate(360deg);opacity:0}}

.r-nav{position:fixed;top:0;left:0;right:0;z-index:200;background:rgba(7,7,16,0.92);border-bottom:1px solid rgba(255,255,255,0.06);backdrop-filter:blur(24px);padding:0 40px;height:60px;display:flex;align-items:center;justify-content:space-between;}
.r-brand{font-family:'Orbitron',monospace;font-size:14px;font-weight:900;letter-spacing:3px;color:#fff;}
.r-brand span{color:#A78BFA;}
.r-nav-tag{font-family:'Orbitron',monospace;font-size:8px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,0.2);}

.r-body{position:relative;z-index:10;max-width:680px;margin:0 auto;padding:80px 24px 60px;}

/* Hero */
.r-hero{text-align:center;margin-bottom:48px;animation:heroIn 0.8s cubic-bezier(0.22,1,0.36,1) both;}
@keyframes heroIn{from{opacity:0;transform:scale(0.75) translateY(36px)}to{opacity:1;transform:scale(1) translateY(0)}}
.r-moon-scene{
  position:relative;width:220px;height:220px;margin:0 auto 32px;
}
/* Big moon */
.r-moon{
  position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
  width:140px;height:140px;border-radius:50%;
  background:radial-gradient(circle at 38% 35%,#E8E4FF,#C4B5FD 35%,#7C3AED 70%,#2D1B69 100%);
  box-shadow:0 0 0 1px rgba(167,139,250,0.2),0 0 40px rgba(167,139,250,0.3),0 0 80px rgba(167,139,250,0.15);
  animation:moonGlow 4s ease-in-out infinite;
}
/* Craters */
.r-crater{position:absolute;border-radius:50%;background:rgba(0,0,0,0.15);border:1px solid rgba(0,0,0,0.1);}
/* Rocket orbit path (invisible) */
.r-orbit-path{
  position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
  width:200px;height:200px;border-radius:50%;
  border:1px dashed rgba(167,139,250,0.12);
}
/* Rocket wrapper spins */
.r-rocket-arm{
  position:absolute;top:50%;left:50%;
  width:0;height:0;transform-origin:0 0;
  animation:rocketOrbit 6s linear infinite;
}
@keyframes rocketOrbit{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
/* Rocket sits at end of arm */
.r-rocket{
  position:absolute;
  top:-8px;left:96px;
  width:18px;height:18px;
  animation:rocketCounter 6s linear infinite;
}
@keyframes rocketCounter{from{transform:rotate(0deg)}to{transform:rotate(-360deg)}}
/* Shooting star */
.r-shoot{
  position:absolute;height:1.5px;border-radius:2px;
  background:linear-gradient(90deg,rgba(255,255,255,0.9),rgba(255,255,255,0));
  animation:shoot linear infinite;
  transform-origin:right center;
}
@keyframes shoot{0%{opacity:0;transform:translateX(0) rotate(var(--ang,-25deg)) scaleX(0);transform-origin:right center}20%{opacity:1}80%{opacity:1}100%{opacity:0;transform:translateX(-220px) rotate(var(--ang,-25deg)) scaleX(1);transform-origin:right center}}15%{opacity:1}70%{opacity:1}100%{opacity:0;transform:translateX(-120px) rotate(var(--ang,-25deg)) scaleX(1)}}
@keyframes moonGlow{0%,100%{box-shadow:0 0 0 1px rgba(167,139,250,0.2),0 0 40px rgba(167,139,250,0.3),0 0 80px rgba(167,139,250,0.15);}50%{box-shadow:0 0 0 2px rgba(167,139,250,0.35),0 0 60px rgba(167,139,250,0.5),0 0 120px rgba(167,139,250,0.25);}}50%{transform:translateY(-10px)}}
.r-title{font-family:'Orbitron',monospace;font-size:clamp(32px,5.5vw,58px);font-weight:900;letter-spacing:-2px;line-height:0.95;color:#fff;margin-bottom:12px;}
.r-title .dim{color:rgba(255,255,255,0.35);}
.r-sub{font-size:13px;color:rgba(255,255,255,0.25);font-weight:500;letter-spacing:1px;font-family:'Orbitron',monospace;}

/* Podium */
.r-podium{display:flex;align-items:flex-end;justify-content:center;gap:12px;margin-bottom:40px;animation:fadeUp 0.6s ease 0.2s both;}
@keyframes fadeUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
.r-pod{display:flex;flex-direction:column;align-items:center;gap:7px;}
.r-pod-av{width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Orbitron',monospace;font-size:17px;font-weight:900;color:#fff;}
.r-pod-name{font-size:11px;font-weight:700;text-align:center;max-width:84px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:rgba(255,255,255,0.5);}
.r-pod-medal{font-family:'Orbitron',monospace;font-size:11px;font-weight:800;letter-spacing:1px;}
.r-pod-pts{font-family:'Orbitron',monospace;font-size:9px;font-weight:700;color:rgba(255,255,255,0.25);}
.r-pod-bar{width:80px;border-radius:8px 8px 0 0;display:flex;align-items:center;justify-content:center;border:1px solid;}
.r-pod-rank{font-family:'Orbitron',monospace;font-size:22px;font-weight:900;}

/* Leaderboard */
.r-lb{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:20px;overflow:hidden;margin-bottom:24px;animation:fadeUp 0.6s ease 0.28s both;}
.r-lb-head{padding:16px 22px;border-bottom:1px solid rgba(255,255,255,0.05);display:flex;align-items:center;justify-content:space-between;}
.r-lb-title{font-family:'Orbitron',monospace;font-size:9px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:rgba(255,255,255,0.25);}
.r-lb-cnt{font-family:'Orbitron',monospace;font-size:10px;font-weight:700;color:rgba(255,255,255,0.18);}
.r-lb-body{padding:12px;}
.r-row{display:flex;align-items:center;gap:13px;padding:11px 13px;border-radius:12px;margin-bottom:7px;border:1px solid;transition:border-color 0.2s;animation:rowIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both;}
@keyframes rowIn{from{opacity:0;transform:translateX(-18px)}to{opacity:1;transform:translateX(0)}}
.r-row:nth-child(1){animation-delay:.04s;background:rgba(167,139,250,0.05);border-color:rgba(167,139,250,0.18);}
.r-row:nth-child(2){animation-delay:.08s;background:rgba(96,165,250,0.04);border-color:rgba(96,165,250,0.14);}
.r-row:nth-child(3){animation-delay:.12s;background:rgba(52,211,153,0.04);border-color:rgba(52,211,153,0.14);}
.r-row:not(:nth-child(1)):not(:nth-child(2)):not(:nth-child(3)){animation-delay:calc(.12s + var(--i)*0.04s);background:rgba(255,255,255,0.015);border-color:rgba(255,255,255,0.05);}
.r-row:hover{border-color:rgba(167,139,250,0.22);}
.r-rank{font-family:'Orbitron',monospace;font-size:14px;width:30px;text-align:center;flex-shrink:0;color:rgba(255,255,255,0.35);}
.r-av{width:40px;height:40px;border-radius:11px;display:flex;align-items:center;justify-content:center;font-family:'Orbitron',monospace;font-size:14px;font-weight:900;color:#fff;flex-shrink:0;}
.r-name{flex:1;font-size:13px;font-weight:700;}
.r-score{font-family:'Orbitron',monospace;font-size:18px;font-weight:900;letter-spacing:-1px;}
.r-score.s0{color:#A78BFA;}.r-score.s1{color:#60A5FA;}.r-score.s2{color:#34D399;}.r-score.sn{color:rgba(255,255,255,0.3);}

.r-cta{width:100%;padding:16px;border:1px solid rgba(167,139,250,0.35);border-radius:13px;background:rgba(167,139,250,0.1);color:#C4B5FD;font-family:'Orbitron',monospace;font-size:11px;font-weight:800;letter-spacing:2px;cursor:pointer;transition:all 0.2s;box-shadow:0 0 28px rgba(167,139,250,0.08);animation:fadeUp 0.6s ease 0.45s both;}
.r-cta:hover{background:rgba(167,139,250,0.18);border-color:rgba(167,139,250,0.55);transform:translateY(-2px);box-shadow:0 8px 28px rgba(167,139,250,0.2);}

@media(max-width:768px){.r-nav{padding:0 18px;}.r-body{padding:72px 18px 48px;}.r-podium{gap:8px;}}
@media(max-width:480px){.r-body{padding:68px 12px 40px;}.r-title{font-size:30px;letter-spacing:-1.5px;}.r-moon-scene{
  position:relative;width:220px;height:220px;margin:0 auto 32px;
}
/* Big moon */
.r-moon{
  position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
  width:140px;height:140px;border-radius:50%;
  background:radial-gradient(circle at 38% 35%,#E8E4FF,#C4B5FD 35%,#7C3AED 70%,#2D1B69 100%);
  box-shadow:0 0 0 1px rgba(167,139,250,0.2),0 0 40px rgba(167,139,250,0.3),0 0 80px rgba(167,139,250,0.15);
  animation:moonGlow 4s ease-in-out infinite;
}
/* Craters */
.r-crater{position:absolute;border-radius:50%;background:rgba(0,0,0,0.15);border:1px solid rgba(0,0,0,0.1);}
/* Rocket orbit path (invisible) */
.r-orbit-path{
  position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
  width:200px;height:200px;border-radius:50%;
  border:1px dashed rgba(167,139,250,0.12);
}
/* Rocket wrapper spins */
.r-rocket-arm{
  position:absolute;top:50%;left:50%;
  width:0;height:0;transform-origin:0 0;
  animation:rocketOrbit 6s linear infinite;
}
@keyframes rocketOrbit{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
/* Rocket sits at end of arm */
.r-rocket{
  position:absolute;
  top:-8px;left:96px;
  width:18px;height:18px;
  animation:rocketCounter 6s linear infinite;
}
@keyframes rocketCounter{from{transform:rotate(0deg)}to{transform:rotate(-360deg)}}
/* Shooting star */
.r-shoot{
  position:absolute;height:1.5px;border-radius:2px;
  background:linear-gradient(90deg,rgba(255,255,255,0.9),rgba(255,255,255,0));
  animation:shoot linear infinite;
  transform-origin:right center;
}
@keyframes shoot{0%{opacity:0;transform:translateX(0) rotate(var(--ang,-25deg)) scaleX(0);transform-origin:right center}20%{opacity:1}80%{opacity:1}100%{opacity:0;transform:translateX(-220px) rotate(var(--ang,-25deg)) scaleX(1);transform-origin:right center}}15%{opacity:1}70%{opacity:1}100%{opacity:0;transform:translateX(-120px) rotate(var(--ang,-25deg)) scaleX(1)}}
@keyframes moonGlow{0%,100%{box-shadow:0 0 0 1px rgba(167,139,250,0.2),0 0 40px rgba(167,139,250,0.3),0 0 80px rgba(167,139,250,0.15);}50%{box-shadow:0 0 0 2px rgba(167,139,250,0.35),0 0 60px rgba(167,139,250,0.5),0 0 120px rgba(167,139,250,0.25);}}.r-pod-bar{width:64px;}.r-pod-av{width:40px;height:40px;font-size:14px;}.r-lb-head{padding:13px 16px;}.r-lb-body{padding:9px;}}
`;

export default function Result() {
	const navigate = useNavigate();
	const leaderboard = useGameStore((s) => s.leaderboard);
	const room = useGameStore((s) => s.room);
	const reset = useGameStore((s) => s.reset);
	const nameById = useMemo(() => {
		const m = new Map();
		for (const p of room?.players || []) m.set(p.id, p.name || p.id);
		return m;
	}, [room?.players]);
	const playAgain = () => {
		reset();
		localStorage.removeItem("quiz_room_code");
		socket.disconnect();
		navigate("/");
	};

	const pOrder = leaderboard?.length >= 3 ? [1, 0, 2] : [];
	const pH = [76, 106, 56];
	const pColors = [
		"rgba(96,165,250,0.15)",
		"rgba(167,139,250,0.15)",
		"rgba(52,211,153,0.12)",
	];
	const pBorders = [
		"rgba(96,165,250,0.25)",
		"rgba(167,139,250,0.3)",
		"rgba(52,211,153,0.22)",
	];
	const pText = ["#60A5FA", "#A78BFA", "#34D399"];
	const medals = ["01", "02", "03"];

	return (
		<>
			<style>{S}</style>
			<div className="r-root">
				<div className="r-sf">
					{STARS.map((s) => (
						<div
							key={s.id}
							className="r-star"
							style={{
								left: `${s.x}%`,
								top: `${s.y}%`,
								width: s.s,
								height: s.s,
								"--op": s.op,
								animationDuration: `${s.dur}s`,
								animationDelay: `${s.delay}s`,
								opacity: s.op,
							}}
						/>
					))}
				</div>
				<nav className="r-nav">
					<div className="r-brand">
						QUIZ<span>BLITZ</span>
					</div>
					<span className="r-nav-tag">Mission Complete</span>
				</nav>
				<div className="r-body">
					<div className="r-hero">
						{/* Moon scene */}
						<div className="r-moon-scene">
							<div className="r-orbit-path" />
							{/* Rocket arm + rocket SVG */}
							<div className="r-rocket-arm">
								<div className="r-rocket">
									<svg
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
										width="18"
										height="18"
									>
										<path
											d="M12 2C12 2 7 6 7 13h2l-2 4h10l-2-4h2c0-7-5-11-5-11z"
											fill="#C4B5FD"
											stroke="#A78BFA"
											strokeWidth="0.5"
										/>
										<path d="M9 13c0 0-2 1-2 4h2" fill="#7C3AED" />
										<path d="M15 13c0 0 2 1 2 4h-2" fill="#7C3AED" />
										<circle cx="12" cy="10" r="1.5" fill="#E8E4FF" />
									</svg>
								</div>
							</div>
							{/* Moon body */}
							<div className="r-moon">
								{/* Craters */}
								<div
									className="r-crater"
									style={{ width: 18, height: 18, top: "22%", left: "20%" }}
								/>
								<div
									className="r-crater"
									style={{ width: 10, height: 10, top: "55%", left: "55%" }}
								/>
								<div
									className="r-crater"
									style={{ width: 14, height: 14, top: "65%", left: "25%" }}
								/>
								<div
									className="r-crater"
									style={{ width: 7, height: 7, top: "30%", left: "60%" }}
								/>
							</div>
							{/* Shooting stars */}
							{[
								{
									top: "12%",
									left: "8%",
									w: 60,
									ang: "-20deg",
									dur: "3.5s",
									delay: "0s",
								},
								{
									top: "70%",
									left: "55%",
									w: 40,
									ang: "-30deg",
									dur: "5s",
									delay: "1.8s",
								},
								{
									top: "35%",
									left: "70%",
									w: 50,
									ang: "-15deg",
									dur: "4.2s",
									delay: "3s",
								},
							].map((s, i) => (
								<div
									key={i}
									className="r-shoot"
									style={{
										top: s.top,
										left: s.left,
										width: s.w,
										"--ang": s.ang,
										animationDuration: s.dur,
										animationDelay: s.delay,
									}}
								/>
							))}
						</div>
						<div className="r-title">
							Results
							<br />
							<span className="dim">Transmitted</span>
						</div>
						<p className="r-sub">Final scores locked in</p>
					</div>

					{leaderboard?.length >= 3 && (
						<div className="r-podium">
							{pOrder.map((ri) => {
								const e = leaderboard[ri];
								if (!e) return null;
								const name = nameById.get(e.playerId) || e.playerId;
								return (
									<div
										key={ri}
										className="r-pod"
										style={{ flex: ri === 0 ? "1.15" : "1" }}
									>
										<div
											className="r-pod-av"
											style={{
												background: AV[ri % AV.length] + "33",
												color: AV[ri % AV.length],
												border: `1px solid ${AV[ri % AV.length]}44`,
											}}
										>
											{(name || "?")[0].toUpperCase()}
										</div>
										<div className="r-pod-name">{name}</div>
										<div className="r-pod-medal" style={{ color: pText[ri] }}>
											{medals[ri]}
										</div>
										<div className="r-pod-pts">{e.score} pts</div>
										<div
											className="r-pod-bar"
											style={{
												height: pH[ri],
												background: pColors[ri],
												borderColor: pBorders[ri],
											}}
										>
											<span className="r-pod-rank" style={{ color: pText[ri] }}>
												{ri + 1}
											</span>
										</div>
									</div>
								);
							})}
						</div>
					)}

					<div className="r-lb">
						<div className="r-lb-head">
							<span className="r-lb-title">Final Standings</span>
							<span className="r-lb-cnt">
								{leaderboard?.length || 0} pilots
							</span>
						</div>
						<div className="r-lb-body">
							{leaderboard?.length ? (
								leaderboard.map((e, i) => {
									const name = nameById.get(e.playerId) || e.playerId;
									const sc =
										i === 0 ? "s0" : i === 1 ? "s1" : i === 2 ? "s2" : "sn";
									return (
										<div
											key={e.playerId}
											className="r-row"
											style={{ "--i": i }}
										>
											<div className="r-rank">
												{String(i + 1).padStart(2, "0")}
											</div>
											<div
												className="r-av"
												style={{
													background: AV[i % AV.length] + "22",
													color: AV[i % AV.length],
												}}
											>
												{(name || "?")[0].toUpperCase()}
											</div>
											<div className="r-name">{name}</div>
											<div className={`r-score ${sc}`}>{e.score}</div>
										</div>
									);
								})
							) : (
								<p
									style={{
										color: "rgba(255,255,255,0.12)",
										textAlign: "center",
										padding: "28px",
										fontSize: 12,
										fontFamily: "'Orbitron',monospace",
										letterSpacing: "1.5px",
									}}
								>
									No data
								</p>
							)}
						</div>
					</div>

					<button className="r-cta" onClick={playAgain}>
						New Mission
					</button>
				</div>
			</div>
		</>
	);
}
