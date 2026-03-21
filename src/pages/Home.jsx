import socket from "../socket/socket";
import useGameStore from "../store/useGameStore";
import { initSocketListeners } from "../socket/listeners";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const STARS = [
	{ id: 0, x: 61.78, y: 53.33, s: 0.8, dur: 4.26, delay: 1.16, op: 0.51 },
	{ id: 1, x: 38.37, y: 78.96, s: 1.41, dur: 3.09, delay: 6.95, op: 0.2 },
	{ id: 2, x: 65.63, y: 91.23, s: 0.52, dur: 5.25, delay: 2.79, op: 0.13 },
	{ id: 3, x: 69.92, y: 34.81, s: 0.84, dur: 5.17, delay: 5.6, op: 0.43 },
	{ id: 4, x: 83.25, y: 59.45, s: 0.91, dur: 5.82, delay: 5.57, op: 0.26 },
	{ id: 5, x: 69.05, y: 91.51, s: 0.9, dur: 2.91, delay: 1.41, op: 0.13 },
	{ id: 6, x: 52.54, y: 61.87, s: 1.04, dur: 1.98, delay: 2.85, op: 0.43 },
	{ id: 7, x: 61.97, y: 67.56, s: 1.1, dur: 2.63, delay: 1.99, op: 0.33 },
	{ id: 8, x: 91.65, y: 79.82, s: 0.75, dur: 5.14, delay: 4.28, op: 0.32 },
	{ id: 9, x: 79.04, y: 54.96, s: 1.25, dur: 4.13, delay: 4.52, op: 0.52 },
	{ id: 10, x: 21.37, y: 97.45, s: 0.98, dur: 4.02, delay: 5.43, op: 0.13 },
	{ id: 11, x: 49.47, y: 73.65, s: 0.9, dur: 5.57, delay: 5.63, op: 0.34 },
	{ id: 12, x: 75.22, y: 72.89, s: 0.79, dur: 4.15, delay: 3.98, op: 0.23 },
	{ id: 13, x: 6.68, y: 13.05, s: 0.46, dur: 2.51, delay: 5.74, op: 0.2 },
	{ id: 14, x: 95.27, y: 83.35, s: 1.37, dur: 4.13, delay: 2.99, op: 0.4 },
	{ id: 15, x: 88.11, y: 93.1, s: 0.87, dur: 4.91, delay: 1.09, op: 0.42 },
	{ id: 16, x: 34.73, y: 6.84, s: 0.79, dur: 4.64, delay: 4.21, op: 0.46 },
	{ id: 17, x: 19.15, y: 48.41, s: 1.07, dur: 4.12, delay: 1.12, op: 0.46 },
	{ id: 18, x: 84.27, y: 39.3, s: 0.61, dur: 5.0, delay: 4.37, op: 0.31 },
	{ id: 19, x: 15.91, y: 46.92, s: 1.17, dur: 3.15, delay: 0.21, op: 0.4 },
	{ id: 20, x: 64.13, y: 30.69, s: 1.44, dur: 4.09, delay: 5.47, op: 0.54 },
	{ id: 21, x: 22.51, y: 30.53, s: 0.88, dur: 3.39, delay: 4.46, op: 0.17 },
	{ id: 22, x: 82.03, y: 76.26, s: 0.66, dur: 5.22, delay: 0.6, op: 0.45 },
	{ id: 23, x: 34.25, y: 84.13, s: 0.7, dur: 4.01, delay: 4.16, op: 0.29 },
	{ id: 24, x: 13.95, y: 85.88, s: 0.95, dur: 3.39, delay: 4.48, op: 0.16 },
	{ id: 25, x: 24.3, y: 5.23, s: 1.27, dur: 2.69, delay: 3.74, op: 0.56 },
	{ id: 26, x: 58.0, y: 10.3, s: 1.34, dur: 5.79, delay: 3.54, op: 0.4 },
	{ id: 27, x: 64.42, y: 64.11, s: 0.95, dur: 1.87, delay: 1.04, op: 0.59 },
	{ id: 28, x: 91.52, y: 64.93, s: 1.08, dur: 5.71, delay: 5.15, op: 0.11 },
	{ id: 29, x: 79.07, y: 16.23, s: 1.23, dur: 4.52, delay: 4.98, op: 0.5 },
	{ id: 30, x: 46.1, y: 80.52, s: 1.14, dur: 4.96, delay: 0.18, op: 0.31 },
	{ id: 31, x: 79.22, y: 10.25, s: 0.59, dur: 4.81, delay: 6.35, op: 0.42 },
	{ id: 32, x: 85.89, y: 15.69, s: 0.62, dur: 2.13, delay: 3.85, op: 0.56 },
	{ id: 33, x: 57.75, y: 24.55, s: 1.41, dur: 2.05, delay: 1.59, op: 0.49 },
	{ id: 34, x: 32.83, y: 55.16, s: 0.92, dur: 2.62, delay: 0.52, op: 0.52 },
	{ id: 35, x: 66.13, y: 36.09, s: 1.04, dur: 1.92, delay: 6.56, op: 0.44 },
	{ id: 36, x: 95.21, y: 5.92, s: 1.01, dur: 2.28, delay: 4.56, op: 0.3 },
	{ id: 37, x: 27.83, y: 56.22, s: 0.72, dur: 4.7, delay: 0.05, op: 0.53 },
	{ id: 38, x: 29.94, y: 37.16, s: 1.24, dur: 3.15, delay: 5.29, op: 0.13 },
	{ id: 39, x: 75.95, y: 5.36, s: 1.24, dur: 5.16, delay: 4.36, op: 0.3 },
	{ id: 40, x: 17.37, y: 49.67, s: 1.14, dur: 2.57, delay: 0.51, op: 0.19 },
	{ id: 41, x: 96.64, y: 63.97, s: 1.26, dur: 2.46, delay: 1.55, op: 0.4 },
	{ id: 42, x: 8.04, y: 22.35, s: 0.6, dur: 1.89, delay: 6.72, op: 0.36 },
	{ id: 43, x: 75.64, y: 10.43, s: 1.42, dur: 3.15, delay: 0.36, op: 0.45 },
	{ id: 44, x: 49.06, y: 82.73, s: 0.76, dur: 5.06, delay: 4.09, op: 0.27 },
	{ id: 45, x: 69.86, y: 10.35, s: 0.99, dur: 4.73, delay: 0.43, op: 0.44 },
	{ id: 46, x: 39.83, y: 3.84, s: 0.84, dur: 5.92, delay: 0.29, op: 0.41 },
	{ id: 47, x: 43.4, y: 45.65, s: 1.49, dur: 4.31, delay: 4.3, op: 0.38 },
	{ id: 48, x: 95.64, y: 8.95, s: 1.48, dur: 4.63, delay: 5.4, op: 0.47 },
	{ id: 49, x: 3.23, y: 14.62, s: 0.65, dur: 4.41, delay: 1.15, op: 0.2 },
	{ id: 50, x: 82.29, y: 38.64, s: 0.77, dur: 3.37, delay: 1.51, op: 0.51 },
	{ id: 51, x: 87.79, y: 26.87, s: 1.0, dur: 2.16, delay: 6.5, op: 0.34 },
	{ id: 52, x: 15.13, y: 10.85, s: 0.63, dur: 5.58, delay: 4.93, op: 0.18 },
	{ id: 53, x: 4.37, y: 0.23, s: 0.66, dur: 3.28, delay: 2.17, op: 0.43 },
	{ id: 54, x: 73.07, y: 42.23, s: 0.98, dur: 5.68, delay: 5.11, op: 0.3 },
	{ id: 55, x: 19.96, y: 18.51, s: 1.32, dur: 4.8, delay: 6.6, op: 0.37 },
	{ id: 56, x: 66.19, y: 5.68, s: 1.41, dur: 2.22, delay: 3.89, op: 0.24 },
	{ id: 57, x: 87.55, y: 91.51, s: 0.68, dur: 3.15, delay: 4.82, op: 0.42 },
	{ id: 58, x: 54.1, y: 58.89, s: 0.99, dur: 1.95, delay: 2.26, op: 0.52 },
	{ id: 59, x: 93.49, y: 42.82, s: 1.38, dur: 4.5, delay: 3.97, op: 0.18 },
	{ id: 60, x: 37.56, y: 51.74, s: 0.42, dur: 2.11, delay: 1.33, op: 0.45 },
	{ id: 61, x: 38.36, y: 31.04, s: 1.27, dur: 3.86, delay: 4.29, op: 0.3 },
	{ id: 62, x: 45.29, y: 71.59, s: 0.54, dur: 3.39, delay: 2.72, op: 0.14 },
	{ id: 63, x: 33.07, y: 25.16, s: 1.02, dur: 4.79, delay: 1.75, op: 0.15 },
	{ id: 64, x: 18.57, y: 34.8, s: 0.85, dur: 3.95, delay: 4.59, op: 0.35 },
	{ id: 65, x: 69.89, y: 93.22, s: 1.14, dur: 4.11, delay: 5.43, op: 0.25 },
	{ id: 66, x: 38.51, y: 38.81, s: 0.96, dur: 5.02, delay: 0.72, op: 0.57 },
	{ id: 67, x: 23.44, y: 15.32, s: 1.17, dur: 4.78, delay: 5.15, op: 0.57 },
	{ id: 68, x: 5.54, y: 62.14, s: 0.45, dur: 5.81, delay: 4.31, op: 0.39 },
	{ id: 69, x: 87.32, y: 77.48, s: 1.08, dur: 3.24, delay: 2.08, op: 0.46 },
	{ id: 70, x: 93.77, y: 91.74, s: 1.46, dur: 3.46, delay: 5.33, op: 0.46 },
	{ id: 71, x: 3.17, y: 61.42, s: 1.35, dur: 5.62, delay: 3.06, op: 0.3 },
	{ id: 72, x: 44.72, y: 63.3, s: 0.66, dur: 4.77, delay: 3.62, op: 0.3 },
	{ id: 73, x: 75.08, y: 58.83, s: 0.68, dur: 2.54, delay: 0.01, op: 0.42 },
	{ id: 74, x: 31.36, y: 2.76, s: 0.71, dur: 2.73, delay: 3.34, op: 0.16 },
	{ id: 75, x: 4.94, y: 1.34, s: 0.66, dur: 4.4, delay: 4.06, op: 0.24 },
	{ id: 76, x: 43.85, y: 52.13, s: 0.43, dur: 4.61, delay: 2.2, op: 0.33 },
	{ id: 77, x: 59.72, y: 58.0, s: 1.32, dur: 4.43, delay: 5.64, op: 0.56 },
	{ id: 78, x: 63.66, y: 54.28, s: 0.93, dur: 4.88, delay: 1.93, op: 0.39 },
	{ id: 79, x: 88.53, y: 53.3, s: 0.74, dur: 3.46, delay: 3.26, op: 0.6 },
	{ id: 80, x: 52.72, y: 43.48, s: 0.56, dur: 4.66, delay: 6.94, op: 0.41 },
	{ id: 81, x: 34.34, y: 84.67, s: 1.25, dur: 5.73, delay: 1.59, op: 0.23 },
	{ id: 82, x: 62.77, y: 91.05, s: 1.33, dur: 2.25, delay: 2.18, op: 0.41 },
	{ id: 83, x: 55.97, y: 11.14, s: 1.16, dur: 5.59, delay: 1.35, op: 0.49 },
	{ id: 84, x: 58.38, y: 41.16, s: 1.5, dur: 5.47, delay: 6.1, op: 0.57 },
	{ id: 85, x: 3.51, y: 1.7, s: 1.15, dur: 4.19, delay: 0.08, op: 0.38 },
	{ id: 86, x: 84.04, y: 52.2, s: 0.46, dur: 2.08, delay: 3.62, op: 0.52 },
	{ id: 87, x: 13.24, y: 99.76, s: 0.99, dur: 5.9, delay: 1.9, op: 0.37 },
	{ id: 88, x: 98.19, y: 25.65, s: 0.52, dur: 3.0, delay: 6.65, op: 0.12 },
	{ id: 89, x: 20.3, y: 75.69, s: 0.71, dur: 2.96, delay: 6.15, op: 0.16 },
	{ id: 90, x: 14.94, y: 88.34, s: 0.51, dur: 2.39, delay: 5.05, op: 0.23 },
	{ id: 91, x: 7.62, y: 62.83, s: 1.46, dur: 3.52, delay: 3.01, op: 0.31 },
	{ id: 92, x: 89.38, y: 87.1, s: 0.7, dur: 3.09, delay: 6.1, op: 0.23 },
	{ id: 93, x: 91.06, y: 37.95, s: 1.08, dur: 5.45, delay: 3.68, op: 0.53 },
	{ id: 94, x: 18.23, y: 50.63, s: 0.77, dur: 5.97, delay: 5.96, op: 0.59 },
	{ id: 95, x: 45.71, y: 43.26, s: 0.71, dur: 4.64, delay: 6.59, op: 0.17 },
	{ id: 96, x: 28.69, y: 78.7, s: 1.1, dur: 4.37, delay: 3.4, op: 0.14 },
	{ id: 97, x: 54.74, y: 14.18, s: 0.74, dur: 3.05, delay: 6.58, op: 0.18 },
	{ id: 98, x: 79.8, y: 37.89, s: 1.02, dur: 2.58, delay: 4.43, op: 0.22 },
	{ id: 99, x: 85.81, y: 53.51, s: 0.42, dur: 3.36, delay: 6.1, op: 0.53 },
	{ id: 100, x: 64.05, y: 33.41, s: 1.09, dur: 4.26, delay: 1.62, op: 0.47 },
	{ id: 101, x: 97.06, y: 25.7, s: 0.62, dur: 4.65, delay: 4.75, op: 0.53 },
	{ id: 102, x: 66.28, y: 65.86, s: 0.45, dur: 4.46, delay: 4.73, op: 0.11 },
	{ id: 103, x: 51.76, y: 77.04, s: 1.38, dur: 4.81, delay: 4.4, op: 0.15 },
	{ id: 104, x: 92.55, y: 50.81, s: 1.47, dur: 3.9, delay: 5.0, op: 0.56 },
	{ id: 105, x: 55.62, y: 41.07, s: 0.66, dur: 2.83, delay: 6.58, op: 0.37 },
	{ id: 106, x: 98.75, y: 18.68, s: 0.94, dur: 5.48, delay: 6.03, op: 0.46 },
	{ id: 107, x: 11.05, y: 57.35, s: 0.84, dur: 1.95, delay: 1.93, op: 0.31 },
	{ id: 108, x: 80.16, y: 67.42, s: 1.22, dur: 3.79, delay: 4.36, op: 0.36 },
	{ id: 109, x: 45.0, y: 33.91, s: 0.85, dur: 4.8, delay: 2.68, op: 0.33 },
	{ id: 110, x: 6.89, y: 91.11, s: 0.69, dur: 3.8, delay: 3.57, op: 0.12 },
	{ id: 111, x: 45.27, y: 88.32, s: 0.52, dur: 4.01, delay: 0.67, op: 0.55 },
	{ id: 112, x: 62.35, y: 47.61, s: 1.25, dur: 5.85, delay: 6.29, op: 0.45 },
	{ id: 113, x: 45.17, y: 32.43, s: 0.76, dur: 3.0, delay: 3.84, op: 0.26 },
	{ id: 114, x: 22.64, y: 79.43, s: 0.43, dur: 2.34, delay: 2.48, op: 0.39 },
	{ id: 115, x: 27.07, y: 35.17, s: 0.69, dur: 5.56, delay: 5.76, op: 0.17 },
	{ id: 116, x: 17.58, y: 26.15, s: 0.66, dur: 3.59, delay: 6.86, op: 0.11 },
	{ id: 117, x: 95.1, y: 92.27, s: 0.88, dur: 3.27, delay: 4.44, op: 0.3 },
	{ id: 118, x: 33.53, y: 55.07, s: 0.62, dur: 4.85, delay: 1.27, op: 0.26 },
	{ id: 119, x: 11.16, y: 9.68, s: 0.85, dur: 4.56, delay: 0.62, op: 0.6 },
	{ id: 120, x: 31.85, y: 3.53, s: 0.67, dur: 4.9, delay: 1.49, op: 0.56 },
	{ id: 121, x: 67.82, y: 38.66, s: 0.67, dur: 2.73, delay: 6.46, op: 0.41 },
	{ id: 122, x: 74.24, y: 30.34, s: 1.27, dur: 5.27, delay: 2.27, op: 0.14 },
	{ id: 123, x: 3.79, y: 6.55, s: 0.85, dur: 3.67, delay: 4.47, op: 0.42 },
	{ id: 124, x: 51.17, y: 11.22, s: 1.09, dur: 5.47, delay: 2.56, op: 0.18 },
	{ id: 125, x: 44.9, y: 45.6, s: 1.18, dur: 1.84, delay: 0.01, op: 0.51 },
	{ id: 126, x: 23.32, y: 81.32, s: 1.07, dur: 5.48, delay: 0.21, op: 0.17 },
	{ id: 127, x: 75.74, y: 8.35, s: 0.56, dur: 5.37, delay: 6.04, op: 0.32 },
	{ id: 128, x: 40.9, y: 35.81, s: 1.38, dur: 2.18, delay: 5.49, op: 0.55 },
	{ id: 129, x: 13.23, y: 22.21, s: 0.67, dur: 1.95, delay: 4.86, op: 0.46 },
	{ id: 130, x: 81.74, y: 89.99, s: 1.15, dur: 2.82, delay: 5.68, op: 0.21 },
	{ id: 131, x: 5.13, y: 77.61, s: 0.74, dur: 4.77, delay: 6.56, op: 0.54 },
	{ id: 132, x: 92.96, y: 2.9, s: 1.06, dur: 3.64, delay: 2.24, op: 0.15 },
	{ id: 133, x: 80.24, y: 28.78, s: 0.48, dur: 2.99, delay: 5.8, op: 0.24 },
	{ id: 134, x: 62.96, y: 27.52, s: 0.44, dur: 5.51, delay: 6.03, op: 0.59 },
	{ id: 135, x: 20.2, y: 83.82, s: 1.16, dur: 2.29, delay: 4.39, op: 0.56 },
	{ id: 136, x: 25.93, y: 25.78, s: 0.6, dur: 4.71, delay: 5.0, op: 0.52 },
	{ id: 137, x: 20.16, y: 55.46, s: 0.94, dur: 5.47, delay: 0.56, op: 0.15 },
	{ id: 138, x: 43.45, y: 5.42, s: 0.99, dur: 2.1, delay: 2.57, op: 0.1 },
	{ id: 139, x: 89.51, y: 5.92, s: 1.04, dur: 3.43, delay: 1.58, op: 0.31 },
	{ id: 140, x: 65.05, y: 25.9, s: 0.99, dur: 3.14, delay: 3.24, op: 0.19 },
	{ id: 141, x: 87.83, y: 75.48, s: 0.56, dur: 3.67, delay: 1.58, op: 0.59 },
	{ id: 142, x: 54.64, y: 11.81, s: 0.44, dur: 4.9, delay: 0.96, op: 0.54 },
	{ id: 143, x: 80.19, y: 56.12, s: 0.96, dur: 2.29, delay: 1.59, op: 0.32 },
	{ id: 144, x: 75.03, y: 93.51, s: 1.21, dur: 5.37, delay: 2.66, op: 0.19 },
	{ id: 145, x: 86.16, y: 67.82, s: 1.06, dur: 2.4, delay: 2.58, op: 0.5 },
	{ id: 146, x: 21.29, y: 19.95, s: 0.55, dur: 4.92, delay: 4.57, op: 0.57 },
	{ id: 147, x: 43.06, y: 6.94, s: 1.46, dur: 5.67, delay: 1.67, op: 0.43 },
	{ id: 148, x: 27.52, y: 40.37, s: 0.64, dur: 5.41, delay: 1.55, op: 0.58 },
	{ id: 149, x: 99.53, y: 21.69, s: 1.24, dur: 2.08, delay: 1.46, op: 0.51 },
	{ id: 150, x: 63.42, y: 46.03, s: 1.34, dur: 1.9, delay: 4.22, op: 0.56 },
	{ id: 151, x: 27.29, y: 43.72, s: 1.48, dur: 5.36, delay: 6.65, op: 0.22 },
	{ id: 152, x: 81.9, y: 97.3, s: 0.54, dur: 3.99, delay: 5.93, op: 0.39 },
	{ id: 153, x: 73.92, y: 66.14, s: 1.19, dur: 3.87, delay: 5.62, op: 0.5 },
	{ id: 154, x: 35.26, y: 26.38, s: 1.05, dur: 2.93, delay: 4.73, op: 0.56 },
	{ id: 155, x: 50.54, y: 83.45, s: 1.08, dur: 4.77, delay: 4.27, op: 0.29 },
	{ id: 156, x: 13.88, y: 6.8, s: 1.12, dur: 2.25, delay: 1.67, op: 0.5 },
	{ id: 157, x: 57.79, y: 42.24, s: 0.79, dur: 2.52, delay: 4.21, op: 0.2 },
	{ id: 158, x: 76.15, y: 30.94, s: 0.73, dur: 3.28, delay: 5.92, op: 0.12 },
	{ id: 159, x: 95.76, y: 6.7, s: 1.21, dur: 5.16, delay: 2.01, op: 0.22 },
	{ id: 160, x: 25.78, y: 21.56, s: 1.15, dur: 4.29, delay: 3.73, op: 0.25 },
	{ id: 161, x: 96.37, y: 69.48, s: 1.44, dur: 2.25, delay: 6.95, op: 0.3 },
	{ id: 162, x: 51.27, y: 38.95, s: 1.24, dur: 3.71, delay: 6.19, op: 0.47 },
	{ id: 163, x: 68.05, y: 4.39, s: 0.79, dur: 2.7, delay: 4.71, op: 0.32 },
	{ id: 164, x: 13.18, y: 90.37, s: 1.34, dur: 4.59, delay: 1.12, op: 0.31 },
	{ id: 165, x: 55.73, y: 99.53, s: 1.5, dur: 5.04, delay: 3.34, op: 0.34 },
	{ id: 166, x: 17.8, y: 53.07, s: 1.46, dur: 2.4, delay: 2.43, op: 0.28 },
	{ id: 167, x: 27.5, y: 95.95, s: 1.27, dur: 3.07, delay: 0.61, op: 0.58 },
	{ id: 168, x: 8.44, y: 32.04, s: 1.31, dur: 2.13, delay: 5.27, op: 0.26 },
	{ id: 169, x: 55.07, y: 74.46, s: 1.29, dur: 4.43, delay: 3.07, op: 0.3 },
	{ id: 170, x: 17.49, y: 21.93, s: 1.18, dur: 2.09, delay: 5.56, op: 0.1 },
	{ id: 171, x: 98.82, y: 4.3, s: 0.54, dur: 2.6, delay: 0.3, op: 0.6 },
	{ id: 172, x: 56.47, y: 34.23, s: 1.07, dur: 4.37, delay: 6.12, op: 0.17 },
	{ id: 173, x: 13.86, y: 10.92, s: 0.66, dur: 2.24, delay: 4.3, op: 0.34 },
	{ id: 174, x: 8.95, y: 22.87, s: 0.67, dur: 3.57, delay: 5.85, op: 0.46 },
	{ id: 175, x: 38.92, y: 19.31, s: 0.56, dur: 5.7, delay: 0.04, op: 0.48 },
	{ id: 176, x: 76.43, y: 18.62, s: 0.8, dur: 2.62, delay: 1.94, op: 0.29 },
	{ id: 177, x: 16.03, y: 89.42, s: 1.17, dur: 3.56, delay: 2.94, op: 0.3 },
	{ id: 178, x: 2.66, y: 27.37, s: 1.01, dur: 2.21, delay: 5.18, op: 0.54 },
	{ id: 179, x: 74.56, y: 42.11, s: 0.73, dur: 5.37, delay: 5.81, op: 0.12 },
];

const S = `
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;800;900&family=Exo+2:wght@300;400;500;600;700;800&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{background:#070710;min-height:100vh;overflow-x:hidden;}

.h-root{min-height:100vh;background:#070710;font-family:'Exo 2',sans-serif;color:#fff;display:flex;align-items:stretch;position:relative;overflow:hidden;}
.h-sf{position:fixed;inset:0;pointer-events:none;z-index:0;}
.h-star{position:absolute;border-radius:50%;background:#fff;animation:tw ease-in-out infinite;}
@keyframes tw{0%,100%{opacity:var(--op,.2);transform:scale(1)}50%{opacity:1;transform:scale(1.8)}}

/* Crescent moon deco */
.h-moon-deco{
  position:fixed;top:-60px;right:-60px;
  width:260px;height:260px;border-radius:50%;
  background:transparent;
  box-shadow:inset -40px 10px 0 0 rgba(167,139,250,0.06);
  pointer-events:none;z-index:1;
}

.h-left{
  flex:1;display:flex;flex-direction:column;justify-content:center;
  padding:80px 64px 80px 80px;position:relative;z-index:10;
}
.h-eyebrow{
  display:inline-flex;align-items:center;gap:10px;
  font-family:'Orbitron',monospace;font-size:9px;font-weight:700;
  letter-spacing:3px;text-transform:uppercase;color:rgba(167,139,250,0.6);margin-bottom:30px;
}
.h-eb-dot{width:5px;height:5px;border-radius:50%;background:#A78BFA;animation:blink 2.5s ease infinite;}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0.2}}

.h-title{
  font-family:'Orbitron',monospace;
  font-size:clamp(42px,5.2vw,80px);
  font-weight:900;line-height:0.95;letter-spacing:-2px;
  color:#fff;margin-bottom:8px;
}
.h-title .accent{color:#A78BFA;}
.h-desc{font-size:16px;font-weight:400;color:rgba(255,255,255,0.35);line-height:1.85;max-width:380px;margin:26px 0 44px;}
.h-stats{display:flex;gap:40px;padding-top:36px;border-top:1px solid rgba(255,255,255,0.06);}
.h-sn{font-family:'Orbitron',monospace;font-size:26px;font-weight:900;color:#A78BFA;}
.h-sl{font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.2);margin-top:4px;}

/* Right */
.h-right{
  width:460px;flex-shrink:0;display:flex;align-items:center;justify-content:center;
  padding:60px 60px 60px 32px;position:relative;z-index:10;
}
.h-card{
  width:100%;
  background:rgba(255,255,255,0.025);
  border:1px solid rgba(255,255,255,0.07);
  border-radius:24px;padding:38px 34px;
  animation:cardIn 0.7s cubic-bezier(0.22,1,0.36,1) both;
}
@keyframes cardIn{from{opacity:0;transform:translateY(36px)}to{opacity:1;transform:translateY(0)}}
.h-card-icon{
  width:46px;height:46px;border-radius:13px;
  background:rgba(167,139,250,0.1);border:1px solid rgba(167,139,250,0.2);
  display:flex;align-items:center;justify-content:center;margin-bottom:20px;
}
.h-card-title{font-family:'Orbitron',monospace;font-size:20px;font-weight:800;letter-spacing:-0.5px;margin-bottom:5px;}
.h-card-sub{font-size:13px;color:rgba(255,255,255,0.3);font-weight:500;margin-bottom:28px;}

.h-tabs{display:flex;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:13px;padding:4px;gap:4px;margin-bottom:24px;}
.h-tab{flex:1;padding:10px 6px;border:none;border-radius:9px;font-family:'Exo 2',sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all 0.2s;letter-spacing:0.3px;}
.h-tab.on{background:rgba(167,139,250,0.2);color:#A78BFA;border:1px solid rgba(167,139,250,0.3);}
.h-tab:not(.on){background:transparent;color:rgba(255,255,255,0.25);}
.h-tab:not(.on):hover{color:rgba(255,255,255,0.55);}

.h-fl{margin-bottom:16px;}
.h-fl-lbl{display:block;font-family:'Orbitron',monospace;font-size:8px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,0.2);margin-bottom:8px;}
.h-inp{width:100%;padding:13px 16px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;color:#fff;font-family:'Exo 2',sans-serif;font-size:14px;font-weight:600;outline:none;transition:all 0.2s;}
.h-inp::placeholder{color:rgba(255,255,255,0.15);font-weight:400;}
.h-inp:focus{border-color:rgba(167,139,250,0.5);background:rgba(167,139,250,0.06);box-shadow:0 0 0 3px rgba(167,139,250,0.1);}
.h-inp.code{text-align:center;font-family:'Orbitron',monospace;font-size:22px;font-weight:800;letter-spacing:10px;text-transform:uppercase;padding:16px;}

.h-btn{width:100%;padding:15px;border:none;border-radius:13px;font-family:'Orbitron',monospace;font-size:12px;font-weight:800;cursor:pointer;transition:all 0.2s;letter-spacing:2px;margin-top:4px;}
.h-btn-create{background:rgba(167,139,250,0.15);border:1px solid rgba(167,139,250,0.35);color:#C4B5FD;}
.h-btn-create:hover{background:rgba(167,139,250,0.25);transform:translateY(-2px);box-shadow:0 8px 28px rgba(167,139,250,0.2);}
.h-btn-join{background:rgba(96,165,250,0.12);border:1px solid rgba(96,165,250,0.3);color:#93C5FD;}
.h-btn-join:hover{background:rgba(96,165,250,0.2);transform:translateY(-2px);box-shadow:0 8px 28px rgba(96,165,250,0.18);}

.h-err{background:rgba(239,68,68,0.07);border:1px solid rgba(239,68,68,0.18);border-radius:11px;padding:10px 14px;color:#FCA5A5;font-size:13px;font-weight:600;margin-bottom:16px;}
.h-panel{animation:panelIn 0.22s ease both;}
@keyframes panelIn{from{opacity:0;transform:translateX(6px)}to{opacity:1;transform:translateX(0)}}

/* Vertical divider */
.h-divider{position:absolute;left:calc(100% - 460px);top:15%;bottom:15%;width:1px;background:rgba(255,255,255,0.05);}

@media(max-width:1000px){.h-right{width:400px;padding-right:40px;}}
@media(max-width:820px){
  .h-root{flex-direction:column;}
  .h-left{padding:80px 28px 36px;align-items:center;text-align:center;}
  .h-desc,.h-stats{text-align:center;justify-content:center;}
  .h-right{width:100%;padding:0 20px 64px;}
  .h-card{max-width:420px;margin:0 auto;}
  .h-divider{display:none;}
  .h-moon-deco{display:none;}
}
@media(max-width:480px){
  .h-left{padding:72px 16px 28px;}
  .h-title{font-size:38px;letter-spacing:-1.5px;}
  .h-right{padding:0 12px 48px;}
  .h-card{padding:26px 18px;}
}
`;

// SVG icons
const RocketIcon = () => (
	<svg
		width="22"
		height="22"
		viewBox="0 0 24 24"
		fill="none"
		stroke="#A78BFA"
		strokeWidth="1.5"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
		<path d="m3.5 11.5 2 2.5 2.5 1.5M9.5 3.5C9.5 3.5 14 2 17.5 5.5S20.5 14.5 20.5 14.5L9.5 3.5z" />
		<path d="m14.5 8.5-5 5" />
	</svg>
);

export default function Home() {
	const [name, setName] = useState(
		() => localStorage.getItem("quiz_player_name") || "",
	);
	const [code, setCode] = useState("");
	const [tab, setTab] = useState("create");
	const navigate = useNavigate();
	const room = useGameStore((s) => s.room);
	const error = useGameStore((s) => s.error);
	const setError = useGameStore((s) => s.setError);
	const setPlayerName = useGameStore((s) => s.setPlayerName);

	useEffect(() => {
		initSocketListeners();
	}, []);
	useEffect(() => {
		if (room?.roomCode) navigate("/lobby");
	}, [room?.roomCode, navigate]);

	const create = () => {
		const t = name.trim();
		if (!t) {
			setError("Enter your name to continue");
			return;
		}
		setError("");
		setPlayerName(t);
		localStorage.setItem("quiz_player_name", t);
		if (!socket.connected) socket.connect();
		socket.emit("create_room");
	};

	const join = () => {
		const n = name.trim(),
			c = code.trim().toUpperCase();
		if (!n || !c) {
			setError("Name and room code required");
			return;
		}
		setError("");
		setPlayerName(n);
		localStorage.setItem("quiz_player_name", n);
		if (!socket.connected) socket.connect();
		socket.emit("join_room", {
			roomCode: c,
			name: n,
			playerId: localStorage.getItem("quiz_player_id") || undefined,
		});
	};

	return (
		<>
			<style>{S}</style>
			<div className="h-root">
				<div className="h-sf">
					{STARS.map((s) => (
						<div
							key={s.id}
							className="h-star"
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
				<div className="h-moon-deco" />

				<div className="h-left">
					<div className="h-eyebrow">
						<span className="h-eb-dot" />
						Multiplayer · Real-Time
					</div>
					<h1 className="h-title">
						Quiz
						<br />
						<span className="accent">Blitz</span>
					</h1>
					<p className="h-desc">
						Host live quiz battles with your own questions. Invite your crew,
						answer fast, and claim the top spot.
					</p>
					<div className="h-stats">
						<div>
							<div className="h-sn">Live</div>
							<div className="h-sl">Real-time</div>
						</div>
						<div>
							<div className="h-sn">∞</div>
							<div className="h-sl">Questions</div>
						</div>
						<div>
							<div className="h-sn">#1</div>
							<div className="h-sl">Wins it all</div>
						</div>
					</div>
				</div>

				<div className="h-divider" />

				<div className="h-right">
					<div className="h-card">
						<div className="h-card-icon">
							<RocketIcon />
						</div>
						<div className="h-card-title">Jump In</div>
						<div className="h-card-sub">Create a room or join a friend's</div>

						{error && <div className="h-err">{error}</div>}

						<div className="h-tabs">
							<button
								className={`h-tab ${tab === "create" ? "on" : ""}`}
								onClick={() => setTab("create")}
							>
								Create Room
							</button>
							<button
								className={`h-tab ${tab === "join" ? "on" : ""}`}
								onClick={() => setTab("join")}
							>
								Join Room
							</button>
						</div>

						<div key={tab} className="h-panel">
							<div className="h-fl">
								<label className="h-fl-lbl">Your Name</label>
								<input
									className="h-inp"
									placeholder="Enter your name"
									value={name}
									onChange={(e) => setName(e.target.value)}
									onKeyDown={(e) =>
										e.key === "Enter" && (tab === "create" ? create() : join())
									}
								/>
							</div>
							{tab === "join" && (
								<div className="h-fl">
									<label className="h-fl-lbl">Room Code</label>
									<input
										className="h-inp code"
										placeholder="····"
										value={code}
										onChange={(e) => setCode(e.target.value)}
										maxLength={6}
										onKeyDown={(e) => e.key === "Enter" && join()}
									/>
								</div>
							)}
							{tab === "create" ? (
								<button className="h-btn h-btn-create" onClick={create}>
									Create Room
								</button>
							) : (
								<button className="h-btn h-btn-join" onClick={join}>
									Enter Room
								</button>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
