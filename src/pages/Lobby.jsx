import socket from "../socket/socket";
import useGameStore from "../store/useGameStore";
import { initSocketListeners } from "../socket/listeners";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const STARS = [
	{ id: 0, x: 19.24, y: 28.68, s: 0.53, dur: 3.09, delay: 2.17, op: 0.19 },
	{ id: 1, x: 56.9, y: 73.57, s: 0.63, dur: 3.94, delay: 1.08, op: 0.59 },
	{ id: 2, x: 32.03, y: 50.45, s: 1.14, dur: 3.21, delay: 3.33, op: 0.55 },
	{ id: 3, x: 55.01, y: 20.54, s: 1.38, dur: 2.99, delay: 1.84, op: 0.35 },
	{ id: 4, x: 61.66, y: 73.72, s: 0.67, dur: 1.91, delay: 0.85, op: 0.43 },
	{ id: 5, x: 10.37, y: 30.35, s: 0.66, dur: 5.88, delay: 0.79, op: 0.47 },
	{ id: 6, x: 96.2, y: 89.69, s: 0.59, dur: 4.09, delay: 2.99, op: 0.6 },
	{ id: 7, x: 95.17, y: 30.61, s: 1.3, dur: 2.3, delay: 2.85, op: 0.36 },
	{ id: 8, x: 84.71, y: 34.59, s: 0.87, dur: 4.25, delay: 6.69, op: 0.46 },
	{ id: 9, x: 93.28, y: 77.57, s: 0.99, dur: 2.84, delay: 6.05, op: 0.58 },
	{ id: 10, x: 95.61, y: 85.98, s: 0.76, dur: 3.53, delay: 2.47, op: 0.11 },
	{ id: 11, x: 37.89, y: 55.34, s: 0.46, dur: 5.42, delay: 4.89, op: 0.42 },
	{ id: 12, x: 77.36, y: 4.14, s: 1.05, dur: 2.31, delay: 1.08, op: 0.51 },
	{ id: 13, x: 19.39, y: 84.75, s: 0.69, dur: 5.56, delay: 4.78, op: 0.23 },
	{ id: 14, x: 70.57, y: 91.72, s: 1.46, dur: 3.89, delay: 1.29, op: 0.39 },
	{ id: 15, x: 93.85, y: 29.84, s: 1.48, dur: 4.97, delay: 3.9, op: 0.41 },
	{ id: 16, x: 68.95, y: 38.09, s: 0.73, dur: 5.83, delay: 5.14, op: 0.55 },
	{ id: 17, x: 59.48, y: 31.99, s: 0.96, dur: 2.48, delay: 6.04, op: 0.22 },
	{ id: 18, x: 62.68, y: 2.72, s: 0.47, dur: 5.69, delay: 6.71, op: 0.22 },
	{ id: 19, x: 63.38, y: 98.56, s: 1.38, dur: 2.37, delay: 2.83, op: 0.41 },
	{ id: 20, x: 57.72, y: 39.57, s: 1.29, dur: 2.76, delay: 6.3, op: 0.3 },
	{ id: 21, x: 51.91, y: 74.55, s: 0.56, dur: 5.16, delay: 2.85, op: 0.13 },
	{ id: 22, x: 11.43, y: 8.31, s: 0.46, dur: 4.49, delay: 4.69, op: 0.47 },
	{ id: 23, x: 74.63, y: 65.34, s: 0.85, dur: 2.99, delay: 1.75, op: 0.45 },
	{ id: 24, x: 32.64, y: 41.73, s: 0.71, dur: 4.06, delay: 1.97, op: 0.42 },
	{ id: 25, x: 26.39, y: 51.66, s: 1.12, dur: 5.82, delay: 2.79, op: 0.23 },
	{ id: 26, x: 5.81, y: 70.02, s: 0.61, dur: 4.5, delay: 3.75, op: 0.25 },
	{ id: 27, x: 39.73, y: 86.79, s: 1.43, dur: 1.89, delay: 5.93, op: 0.2 },
	{ id: 28, x: 81.06, y: 28.98, s: 0.43, dur: 4.23, delay: 3.03, op: 0.52 },
	{ id: 29, x: 55.43, y: 76.98, s: 0.84, dur: 4.5, delay: 2.93, op: 0.27 },
	{ id: 30, x: 60.67, y: 82.48, s: 0.93, dur: 5.23, delay: 5.39, op: 0.22 },
	{ id: 31, x: 44.47, y: 61.25, s: 0.81, dur: 2.07, delay: 1.49, op: 0.27 },
	{ id: 32, x: 42.58, y: 22.92, s: 0.52, dur: 2.57, delay: 1.88, op: 0.34 },
	{ id: 33, x: 41.37, y: 79.48, s: 0.88, dur: 1.9, delay: 4.07, op: 0.32 },
	{ id: 34, x: 82.49, y: 21.44, s: 1.3, dur: 1.91, delay: 1.61, op: 0.11 },
	{ id: 35, x: 72.44, y: 39.05, s: 0.73, dur: 5.98, delay: 2.84, op: 0.52 },
	{ id: 36, x: 63.74, y: 53.81, s: 1.46, dur: 5.79, delay: 0.27, op: 0.27 },
	{ id: 37, x: 36.45, y: 78.39, s: 1.12, dur: 5.28, delay: 0.81, op: 0.59 },
	{ id: 38, x: 29.93, y: 50.26, s: 1.25, dur: 2.31, delay: 6.69, op: 0.37 },
	{ id: 39, x: 11.97, y: 57.04, s: 0.74, dur: 1.89, delay: 3.56, op: 0.19 },
	{ id: 40, x: 53.54, y: 16.98, s: 0.77, dur: 3.87, delay: 0.2, op: 0.25 },
	{ id: 41, x: 51.13, y: 1.95, s: 0.81, dur: 4.14, delay: 0.07, op: 0.28 },
	{ id: 42, x: 10.9, y: 22.45, s: 1.16, dur: 3.93, delay: 4.87, op: 0.29 },
	{ id: 43, x: 7.3, y: 14.3, s: 0.63, dur: 2.5, delay: 0.39, op: 0.42 },
	{ id: 44, x: 86.09, y: 99.04, s: 1.36, dur: 2.65, delay: 5.25, op: 0.45 },
	{ id: 45, x: 92.27, y: 6.55, s: 1.04, dur: 4.94, delay: 5.5, op: 0.32 },
	{ id: 46, x: 7.78, y: 60.23, s: 0.66, dur: 3.42, delay: 4.91, op: 0.11 },
	{ id: 47, x: 96.36, y: 85.8, s: 0.43, dur: 5.63, delay: 3.74, op: 0.44 },
	{ id: 48, x: 90.95, y: 69.1, s: 0.43, dur: 5.68, delay: 3.11, op: 0.48 },
	{ id: 49, x: 69.91, y: 45.71, s: 1.2, dur: 3.03, delay: 0.24, op: 0.19 },
	{ id: 50, x: 72.15, y: 84.02, s: 0.72, dur: 2.18, delay: 3.81, op: 0.55 },
	{ id: 51, x: 12.46, y: 52.68, s: 0.76, dur: 1.9, delay: 4.15, op: 0.32 },
	{ id: 52, x: 42.36, y: 34.87, s: 0.98, dur: 4.05, delay: 1.72, op: 0.19 },
	{ id: 53, x: 61.29, y: 11.41, s: 0.99, dur: 5.49, delay: 3.51, op: 0.37 },
	{ id: 54, x: 17.61, y: 61.05, s: 1.33, dur: 5.09, delay: 0.26, op: 0.29 },
	{ id: 55, x: 10.53, y: 59.1, s: 0.98, dur: 1.96, delay: 3.7, op: 0.43 },
	{ id: 56, x: 28.42, y: 95.29, s: 1.36, dur: 5.8, delay: 6.46, op: 0.45 },
	{ id: 57, x: 20.81, y: 43.07, s: 0.69, dur: 4.91, delay: 0.26, op: 0.55 },
	{ id: 58, x: 68.85, y: 85.96, s: 1.47, dur: 2.36, delay: 5.64, op: 0.18 },
	{ id: 59, x: 55.07, y: 26.51, s: 1.01, dur: 4.05, delay: 1.63, op: 0.55 },
	{ id: 60, x: 57.29, y: 44.42, s: 1.08, dur: 4.07, delay: 4.51, op: 0.29 },
	{ id: 61, x: 3.84, y: 74.02, s: 0.53, dur: 3.94, delay: 0.54, op: 0.44 },
	{ id: 62, x: 39.12, y: 20.71, s: 0.75, dur: 5.88, delay: 2.15, op: 0.2 },
	{ id: 63, x: 72.45, y: 57.56, s: 1.34, dur: 4.53, delay: 6.07, op: 0.25 },
	{ id: 64, x: 62.57, y: 26.74, s: 1.27, dur: 4.58, delay: 1.34, op: 0.18 },
	{ id: 65, x: 3.16, y: 74.67, s: 0.52, dur: 2.2, delay: 1.25, op: 0.24 },
	{ id: 66, x: 91.74, y: 98.7, s: 0.69, dur: 4.24, delay: 6.69, op: 0.16 },
	{ id: 67, x: 68.16, y: 46.16, s: 0.75, dur: 2.56, delay: 1.93, op: 0.18 },
	{ id: 68, x: 88.13, y: 52.89, s: 0.63, dur: 4.08, delay: 1.47, op: 0.14 },
	{ id: 69, x: 28.85, y: 29.02, s: 1.05, dur: 4.42, delay: 4.8, op: 0.3 },
	{ id: 70, x: 95.12, y: 87.74, s: 1.21, dur: 5.37, delay: 3.11, op: 0.37 },
	{ id: 71, x: 71.78, y: 48.89, s: 1.18, dur: 4.82, delay: 6.68, op: 0.13 },
	{ id: 72, x: 97.21, y: 37.38, s: 0.78, dur: 5.03, delay: 1.68, op: 0.32 },
	{ id: 73, x: 54.74, y: 27.92, s: 1.12, dur: 3.17, delay: 3.81, op: 0.33 },
	{ id: 74, x: 23.04, y: 89.74, s: 1.21, dur: 3.07, delay: 2.66, op: 0.35 },
	{ id: 75, x: 33.95, y: 39.0, s: 0.7, dur: 4.03, delay: 0.76, op: 0.26 },
	{ id: 76, x: 85.28, y: 82.4, s: 0.97, dur: 4.26, delay: 6.34, op: 0.18 },
	{ id: 77, x: 83.87, y: 47.57, s: 0.73, dur: 3.37, delay: 0.44, op: 0.23 },
	{ id: 78, x: 95.31, y: 85.01, s: 1.34, dur: 4.32, delay: 5.15, op: 0.23 },
	{ id: 79, x: 36.56, y: 98.32, s: 0.61, dur: 5.03, delay: 3.63, op: 0.48 },
	{ id: 80, x: 69.13, y: 47.13, s: 1.39, dur: 2.18, delay: 2.1, op: 0.21 },
	{ id: 81, x: 39.2, y: 68.1, s: 0.97, dur: 4.08, delay: 5.24, op: 0.54 },
	{ id: 82, x: 10.18, y: 58.5, s: 0.5, dur: 5.23, delay: 1.07, op: 0.37 },
	{ id: 83, x: 62.01, y: 55.12, s: 1.18, dur: 3.83, delay: 3.44, op: 0.28 },
	{ id: 84, x: 64.92, y: 65.43, s: 0.7, dur: 5.22, delay: 3.96, op: 0.45 },
	{ id: 85, x: 13.48, y: 14.07, s: 0.73, dur: 3.85, delay: 5.37, op: 0.53 },
	{ id: 86, x: 7.49, y: 99.79, s: 1.13, dur: 2.82, delay: 1.18, op: 0.15 },
	{ id: 87, x: 29.82, y: 37.82, s: 1.11, dur: 5.98, delay: 5.82, op: 0.21 },
	{ id: 88, x: 89.43, y: 80.62, s: 0.42, dur: 2.12, delay: 0.39, op: 0.47 },
	{ id: 89, x: 48.5, y: 31.54, s: 0.47, dur: 2.22, delay: 2.96, op: 0.46 },
	{ id: 90, x: 81.92, y: 16.68, s: 0.62, dur: 5.32, delay: 2.14, op: 0.31 },
	{ id: 91, x: 4.59, y: 37.51, s: 0.46, dur: 4.99, delay: 1.92, op: 0.19 },
	{ id: 92, x: 6.03, y: 58.86, s: 1.18, dur: 4.22, delay: 0.63, op: 0.27 },
	{ id: 93, x: 56.43, y: 4.23, s: 1.13, dur: 4.2, delay: 4.11, op: 0.47 },
	{ id: 94, x: 15.4, y: 97.23, s: 1.48, dur: 5.02, delay: 1.52, op: 0.47 },
	{ id: 95, x: 49.35, y: 47.47, s: 0.71, dur: 3.14, delay: 2.21, op: 0.19 },
	{ id: 96, x: 16.89, y: 94.33, s: 1.04, dur: 4.4, delay: 1.08, op: 0.6 },
	{ id: 97, x: 40.49, y: 95.77, s: 1.09, dur: 3.47, delay: 4.43, op: 0.12 },
	{ id: 98, x: 99.53, y: 51.39, s: 0.72, dur: 2.28, delay: 6.12, op: 0.24 },
	{ id: 99, x: 75.12, y: 92.71, s: 1.22, dur: 2.74, delay: 2.98, op: 0.14 },
	{ id: 100, x: 15.36, y: 84.64, s: 1.03, dur: 3.03, delay: 6.14, op: 0.5 },
	{ id: 101, x: 4.7, y: 20.29, s: 1.21, dur: 4.7, delay: 1.48, op: 0.44 },
	{ id: 102, x: 18.71, y: 21.01, s: 1.33, dur: 4.64, delay: 3.79, op: 0.31 },
	{ id: 103, x: 14.93, y: 82.55, s: 0.86, dur: 2.69, delay: 1.03, op: 0.34 },
	{ id: 104, x: 80.57, y: 65.75, s: 1.41, dur: 2.91, delay: 3.19, op: 0.27 },
	{ id: 105, x: 53.73, y: 52.69, s: 0.56, dur: 3.12, delay: 1.34, op: 0.16 },
	{ id: 106, x: 83.79, y: 73.01, s: 0.74, dur: 4.28, delay: 5.04, op: 0.56 },
	{ id: 107, x: 55.12, y: 2.06, s: 1.02, dur: 4.56, delay: 3.3, op: 0.32 },
	{ id: 108, x: 77.12, y: 94.88, s: 0.67, dur: 4.29, delay: 3.1, op: 0.28 },
	{ id: 109, x: 10.7, y: 76.16, s: 0.96, dur: 4.03, delay: 5.16, op: 0.39 },
	{ id: 110, x: 29.61, y: 31.29, s: 0.6, dur: 5.81, delay: 4.87, op: 0.44 },
	{ id: 111, x: 78.23, y: 26.96, s: 1.09, dur: 3.52, delay: 1.07, op: 0.39 },
	{ id: 112, x: 69.51, y: 18.14, s: 1.4, dur: 4.54, delay: 3.49, op: 0.59 },
	{ id: 113, x: 70.59, y: 85.38, s: 0.47, dur: 4.59, delay: 0.8, op: 0.55 },
	{ id: 114, x: 63.26, y: 46.25, s: 1.44, dur: 3.88, delay: 2.12, op: 0.2 },
	{ id: 115, x: 96.38, y: 45.27, s: 1.03, dur: 2.68, delay: 2.61, op: 0.51 },
	{ id: 116, x: 38.19, y: 4.95, s: 1.34, dur: 3.25, delay: 4.39, op: 0.26 },
	{ id: 117, x: 71.35, y: 90.04, s: 0.73, dur: 4.98, delay: 1.98, op: 0.6 },
	{ id: 118, x: 61.32, y: 19.81, s: 0.87, dur: 1.86, delay: 4.05, op: 0.29 },
	{ id: 119, x: 30.74, y: 12.6, s: 0.71, dur: 4.43, delay: 5.09, op: 0.27 },
	{ id: 120, x: 17.39, y: 83.11, s: 1.43, dur: 5.8, delay: 5.45, op: 0.44 },
	{ id: 121, x: 87.75, y: 88.71, s: 1.28, dur: 3.93, delay: 2.25, op: 0.57 },
	{ id: 122, x: 80.04, y: 67.9, s: 0.76, dur: 5.33, delay: 4.96, op: 0.39 },
	{ id: 123, x: 52.13, y: 79.94, s: 0.81, dur: 4.09, delay: 1.57, op: 0.1 },
	{ id: 124, x: 33.42, y: 77.08, s: 1.19, dur: 5.64, delay: 0.73, op: 0.11 },
	{ id: 125, x: 61.88, y: 26.83, s: 1.22, dur: 2.65, delay: 5.67, op: 0.1 },
	{ id: 126, x: 60.17, y: 36.43, s: 1.44, dur: 5.17, delay: 2.97, op: 0.12 },
	{ id: 127, x: 13.31, y: 78.86, s: 1.13, dur: 5.21, delay: 5.67, op: 0.24 },
	{ id: 128, x: 2.28, y: 49.38, s: 1.15, dur: 3.01, delay: 6.91, op: 0.55 },
	{ id: 129, x: 24.8, y: 85.02, s: 1.22, dur: 4.19, delay: 2.8, op: 0.21 },
	{ id: 130, x: 50.57, y: 56.07, s: 1.41, dur: 5.13, delay: 0.94, op: 0.16 },
	{ id: 131, x: 9.79, y: 85.12, s: 0.65, dur: 2.98, delay: 6.14, op: 0.15 },
	{ id: 132, x: 13.56, y: 19.62, s: 0.63, dur: 2.79, delay: 6.2, op: 0.15 },
	{ id: 133, x: 96.89, y: 28.94, s: 1.36, dur: 5.38, delay: 1.55, op: 0.27 },
	{ id: 134, x: 77.18, y: 19.4, s: 0.73, dur: 2.38, delay: 2.36, op: 0.51 },
	{ id: 135, x: 39.81, y: 78.94, s: 0.85, dur: 2.42, delay: 4.71, op: 0.48 },
	{ id: 136, x: 7.79, y: 34.35, s: 0.45, dur: 5.24, delay: 2.32, op: 0.11 },
	{ id: 137, x: 65.45, y: 68.84, s: 0.83, dur: 4.11, delay: 6.96, op: 0.19 },
	{ id: 138, x: 50.07, y: 46.17, s: 0.42, dur: 3.11, delay: 1.23, op: 0.29 },
	{ id: 139, x: 53.06, y: 3.15, s: 1.13, dur: 4.83, delay: 3.73, op: 0.28 },
	{ id: 140, x: 1.96, y: 44.84, s: 1.23, dur: 5.35, delay: 6.74, op: 0.18 },
	{ id: 141, x: 85.02, y: 64.23, s: 0.64, dur: 3.25, delay: 3.43, op: 0.37 },
	{ id: 142, x: 11.52, y: 80.83, s: 1.16, dur: 2.9, delay: 2.42, op: 0.14 },
	{ id: 143, x: 56.54, y: 73.37, s: 1.1, dur: 3.01, delay: 0.18, op: 0.29 },
	{ id: 144, x: 17.21, y: 60.31, s: 0.86, dur: 5.89, delay: 2.4, op: 0.31 },
	{ id: 145, x: 88.69, y: 26.27, s: 1.33, dur: 5.31, delay: 4.71, op: 0.39 },
	{ id: 146, x: 1.11, y: 6.21, s: 0.44, dur: 4.48, delay: 2.19, op: 0.2 },
	{ id: 147, x: 11.96, y: 31.78, s: 1.45, dur: 2.98, delay: 4.95, op: 0.38 },
	{ id: 148, x: 99.16, y: 20.24, s: 0.65, dur: 3.63, delay: 2.16, op: 0.29 },
	{ id: 149, x: 56.2, y: 62.25, s: 1.36, dur: 4.87, delay: 3.27, op: 0.38 },
	{ id: 150, x: 38.4, y: 17.61, s: 1.14, dur: 2.48, delay: 6.47, op: 0.24 },
	{ id: 151, x: 99.5, y: 14.51, s: 0.53, dur: 4.9, delay: 4.33, op: 0.44 },
	{ id: 152, x: 57.65, y: 88.29, s: 1.13, dur: 4.58, delay: 0.11, op: 0.47 },
	{ id: 153, x: 80.87, y: 86.25, s: 0.43, dur: 2.41, delay: 3.25, op: 0.52 },
	{ id: 154, x: 60.91, y: 15.09, s: 0.48, dur: 3.74, delay: 5.93, op: 0.38 },
	{ id: 155, x: 92.46, y: 75.53, s: 1.45, dur: 4.46, delay: 0.54, op: 0.46 },
	{ id: 156, x: 38.57, y: 26.4, s: 0.68, dur: 5.11, delay: 6.67, op: 0.13 },
	{ id: 157, x: 70.13, y: 7.18, s: 0.94, dur: 5.3, delay: 2.88, op: 0.36 },
	{ id: 158, x: 6.86, y: 95.35, s: 1.41, dur: 3.95, delay: 4.66, op: 0.29 },
	{ id: 159, x: 62.87, y: 58.87, s: 1.0, dur: 3.07, delay: 0.97, op: 0.4 },
];
const OPT = [
	{
		label: "A",
		color: "#A78BFA",
		light: "rgba(167,139,250,0.1)",
		border: "rgba(167,139,250,0.28)",
	},
	{
		label: "B",
		color: "#60A5FA",
		light: "rgba(96,165,250,0.1)",
		border: "rgba(96,165,250,0.28)",
	},
	{
		label: "C",
		color: "#34D399",
		light: "rgba(52,211,153,0.1)",
		border: "rgba(52,211,153,0.28)",
	},
	{
		label: "D",
		color: "#F472B6",
		light: "rgba(244,114,182,0.1)",
		border: "rgba(244,114,182,0.28)",
	},
];
const AV = ["#A78BFA", "#60A5FA", "#34D399", "#F472B6", "#FBBF24", "#06B6D4"];

const S = `
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;800;900&family=Exo+2:wght@300;400;500;600;700;800&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{background:#070710;min-height:100vh;overflow-x:hidden;}
.lb-root{min-height:100vh;background:#070710;font-family:'Exo 2',sans-serif;color:#fff;position:relative;overflow-x:hidden;}
.lb-sf{position:fixed;inset:0;pointer-events:none;z-index:0;}
.lb-star{position:absolute;border-radius:50%;background:#fff;animation:tw ease-in-out infinite;}
@keyframes tw{0%,100%{opacity:var(--op,.2);transform:scale(1)}50%{opacity:1;transform:scale(1.8)}}

.lb-nav{position:fixed;top:0;left:0;right:0;z-index:200;background:rgba(7,7,16,0.92);border-bottom:1px solid rgba(255,255,255,0.06);backdrop-filter:blur(24px);padding:0 40px;height:60px;display:flex;align-items:center;justify-content:space-between;}
.lb-brand{font-family:'Orbitron',monospace;font-size:14px;font-weight:900;letter-spacing:3px;color:#fff;}
.lb-brand span{color:#A78BFA;}
.lb-nav-mid{display:flex;align-items:center;gap:10px;}
.lb-code-lbl{font-family:'Orbitron',monospace;font-size:8px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.18);}
.lb-code-val{font-family:'Orbitron',monospace;font-size:18px;font-weight:900;letter-spacing:5px;color:rgba(255,255,255,0.7);}
.lb-copy-btn{display:flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:7px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.04);cursor:pointer;transition:all 0.2s;flex-shrink:0;}
.lb-copy-btn:hover{background:rgba(167,139,250,0.12);border-color:rgba(167,139,250,0.3);}
.lb-copy-btn.copied{background:rgba(52,211,153,0.12);border-color:rgba(52,211,153,0.3);}
.lb-badge{padding:5px 12px;border-radius:100px;font-family:'Orbitron',monospace;font-size:8px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;}
.lb-badge-host{background:rgba(167,139,250,0.1);border:1px solid rgba(167,139,250,0.25);color:#C4B5FD;}
.lb-badge-player{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);color:rgba(255,255,255,0.3);}
.lb-nav-r{display:flex;align-items:center;gap:10px;}

.lb-body{position:relative;z-index:10;max-width:1200px;margin:0 auto;padding:76px 36px 48px;display:grid;grid-template-columns:300px 1fr;gap:22px;align-items:start;}

/* Players panel */
.lb-pp{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:18px;overflow:hidden;}
.lb-pp-head{padding:14px 18px;border-bottom:1px solid rgba(255,255,255,0.05);display:flex;align-items:center;justify-content:space-between;}
.lb-pp-title{font-family:'Orbitron',monospace;font-size:9px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:rgba(255,255,255,0.25);}
.lb-pp-cnt{font-family:'Orbitron',monospace;font-size:11px;font-weight:800;color:#A78BFA;background:rgba(167,139,250,0.1);border-radius:100px;padding:2px 10px;}
.lb-pp-body{padding:12px;}

.lb-player{display:flex;align-items:center;gap:11px;padding:10px 11px;border-radius:11px;margin-bottom:7px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.05);transition:border-color 0.2s;animation:popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both;}
.lb-player:last-child{margin-bottom:0;}
.lb-player:hover{border-color:rgba(167,139,250,0.18);}
@keyframes popIn{from{opacity:0;transform:scale(0.82) translateX(-6px)}to{opacity:1;transform:scale(1) translateX(0)}}
.lb-av{width:34px;height:34px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-family:'Orbitron',monospace;font-size:13px;font-weight:800;color:#fff;flex-shrink:0;}
.lb-pname{font-size:13px;font-weight:600;flex:1;}
.lb-ptag{font-family:'Orbitron',monospace;font-size:7px;font-weight:700;letter-spacing:1.5px;color:#A78BFA;background:rgba(167,139,250,0.1);border:1px solid rgba(167,139,250,0.2);border-radius:4px;padding:2px 7px;text-transform:uppercase;}

/* Code share */
.lb-share{margin-top:14px;background:rgba(167,139,250,0.04);border:1px solid rgba(167,139,250,0.1);border-radius:14px;padding:16px;text-align:center;}
.lb-share-lbl{font-family:'Orbitron',monospace;font-size:8px;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,0.18);margin-bottom:10px;}
.lb-share-code-row{display:flex;align-items:center;justify-content:center;gap:12px;}
.lb-share-code{font-family:'Orbitron',monospace;font-size:28px;font-weight:900;letter-spacing:7px;color:rgba(255,255,255,0.6);}
.lb-share-copy{display:flex;align-items:center;gap:6px;padding:6px 12px;border-radius:8px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.04);cursor:pointer;font-family:'Orbitron',monospace;font-size:8px;font-weight:700;letter-spacing:1px;color:rgba(255,255,255,0.35);transition:all 0.2s;}
.lb-share-copy:hover{background:rgba(167,139,250,0.1);border-color:rgba(167,139,250,0.25);color:#C4B5FD;}
.lb-share-copy.done{background:rgba(52,211,153,0.1);border-color:rgba(52,211,153,0.25);color:#34D399;}

/* Right panel */
.lb-rp{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:18px;overflow:hidden;}
.lb-rp-head{padding:16px 22px;border-bottom:1px solid rgba(255,255,255,0.05);display:flex;align-items:center;justify-content:space-between;}
.lb-rp-title{font-family:'Orbitron',monospace;font-size:9px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:rgba(255,255,255,0.25);}
.lb-rp-cnt{font-family:'Orbitron',monospace;font-size:11px;font-weight:800;color:rgba(255,255,255,0.35);}
.lb-rp-body{padding:24px;}

.lb-fl{margin-bottom:14px;}
.lb-fl-lbl{display:block;font-family:'Orbitron',monospace;font-size:8px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:rgba(255,255,255,0.18);margin-bottom:8px;}
.lb-inp{width:100%;padding:13px 15px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:12px;color:#fff;font-family:'Exo 2',sans-serif;font-size:14px;font-weight:600;outline:none;transition:all 0.2s;}
.lb-inp::placeholder{color:rgba(255,255,255,0.14);font-weight:400;}
.lb-inp:focus{border-color:rgba(167,139,250,0.45);background:rgba(167,139,250,0.05);box-shadow:0 0 0 3px rgba(167,139,250,0.09);}

.lb-opts{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px;}
.lb-or{display:flex;align-items:center;gap:8px;}
.lb-opill{width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-family:'Orbitron',monospace;font-weight:700;font-size:11px;cursor:pointer;flex-shrink:0;border:1.5px solid;transition:all 0.18s;user-select:none;}
.lb-opill:hover{transform:scale(1.12);}
.lb-opill.sel{transform:scale(1.18);box-shadow:0 4px 14px rgba(0,0,0,0.3);}
.lb-oinp{flex:1;padding:8px 11px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:8px;color:#fff;font-family:'Exo 2',sans-serif;font-size:13px;font-weight:600;outline:none;transition:all 0.2s;}
.lb-oinp::placeholder{color:rgba(255,255,255,0.13);font-weight:400;}
.lb-oinp:focus{border-color:rgba(167,139,250,0.35);}

.lb-hint{font-size:11px;font-weight:600;color:rgba(167,139,250,0.5);margin-bottom:12px;display:flex;align-items:center;gap:6px;}

.lb-sep{height:1px;background:rgba(255,255,255,0.05);margin:18px 0;}

.lb-btn-add{width:100%;padding:12px;border:1px solid rgba(255,255,255,0.08);border-radius:12px;background:rgba(255,255,255,0.04);color:rgba(255,255,255,0.6);font-family:'Orbitron',monospace;font-size:10px;font-weight:700;letter-spacing:1.5px;cursor:pointer;transition:all 0.2s;margin-bottom:18px;}
.lb-btn-add:hover{background:rgba(167,139,250,0.1);border-color:rgba(167,139,250,0.25);color:#C4B5FD;}
.lb-btn-add.fl{animation:flash 0.35s ease;}
@keyframes flash{0%{transform:scale(1)}40%{transform:scale(0.95)}70%{transform:scale(1.04)}100%{transform:scale(1)}}

.lb-q-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;}
.lb-q-lbl{font-family:'Orbitron',monospace;font-size:8px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.2);}
.lb-q-num{font-family:'Orbitron',monospace;font-size:12px;font-weight:800;color:#A78BFA;}
.lb-qlist{max-height:200px;overflow-y:auto;margin-bottom:18px;}
.lb-qlist::-webkit-scrollbar{width:3px;}
.lb-qlist::-webkit-scrollbar-thumb{background:rgba(167,139,250,0.25);border-radius:3px;}
.lb-qi{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.05);border-radius:10px;padding:10px 13px;margin-bottom:7px;transition:border-color 0.15s;}
.lb-qi:hover{border-color:rgba(167,139,250,0.18);}
.lb-qi-n{font-family:'Orbitron',monospace;font-size:7px;font-weight:700;letter-spacing:2px;color:rgba(255,255,255,0.18);margin-bottom:4px;}
.lb-qi-t{font-size:12px;font-weight:600;color:rgba(255,255,255,0.75);margin-bottom:4px;}
.lb-qi-a{font-size:11px;font-weight:600;color:#34D399;}

.lb-btn-launch{width:100%;padding:16px;border:1px solid rgba(167,139,250,0.4);border-radius:13px;background:rgba(167,139,250,0.12);color:#C4B5FD;font-family:'Orbitron',monospace;font-size:12px;font-weight:800;letter-spacing:2px;cursor:pointer;transition:all 0.2s;box-shadow:0 0 32px rgba(167,139,250,0.1);}
.lb-btn-launch:hover{background:rgba(167,139,250,0.2);border-color:rgba(167,139,250,0.6);transform:translateY(-2px);box-shadow:0 8px 28px rgba(167,139,250,0.25);}
.lb-btn-launch:active{transform:translateY(0);}
.lb-btn-launch:disabled{background:rgba(255,255,255,0.03);border-color:rgba(255,255,255,0.06);color:rgba(255,255,255,0.18);box-shadow:none;cursor:not-allowed;transform:none;}

/* Waiting */
.lb-wait{text-align:center;padding:72px 24px;}
.lb-wait-ring{width:64px;height:64px;border-radius:50%;border:2px solid rgba(167,139,250,0.1);border-top-color:rgba(167,139,250,0.7);margin:0 auto 26px;animation:spin 1s linear infinite;}
@keyframes spin{to{transform:rotate(360deg)}}
.lb-wait h3{font-family:'Orbitron',monospace;font-size:16px;font-weight:800;letter-spacing:1px;margin-bottom:10px;}
.lb-wait p{font-size:13px;color:rgba(255,255,255,0.25);font-weight:500;line-height:1.8;}

.lb-err{position:relative;z-index:10;background:rgba(239,68,68,0.07);border:1px solid rgba(239,68,68,0.15);border-radius:11px;padding:10px 16px;color:#FCA5A5;font-size:13px;font-weight:600;margin:72px 36px -8px;}

@media(max-width:960px){.lb-body{grid-template-columns:260px 1fr;gap:16px;padding:72px 20px 40px;}}
@media(max-width:740px){
  .lb-body{grid-template-columns:1fr;}
  .lb-nav{padding:0 16px;}
  .lb-nav-mid{display:none;}
  .lb-err{margin-left:16px;margin-right:16px;}
  .lb-opts{grid-template-columns:1fr;}
}
@media(max-width:480px){.lb-body{padding:68px 10px 36px;}.lb-rp-body{padding:16px 14px;}}
`;

const CopyIcon = ({ size = 14 }) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
	>
		<rect x="9" y="9" width="13" height="13" rx="2" />
		<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
	</svg>
);
const CheckIcon = ({ size = 14 }) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2.5"
		strokeLinecap="round"
	>
		<polyline points="20 6 9 17 4 12" />
	</svg>
);

export default function Lobby() {
	const navigate = useNavigate();
	const room = useGameStore((s) => s.room);
	const phase = useGameStore((s) => s.phase);
	const playerId = useGameStore((s) => s.playerId);
	const playerName = useGameStore((s) => s.playerName);
	const error = useGameStore((s) => s.error);
	const [qText, setQText] = useState("");
	const [opts, setOpts] = useState(["", "", "", ""]);
	const [correct, setCorrect] = useState(null);
	const [flash, setFlash] = useState(false);
	const [copied, setCopied] = useState(false);
	const [isAdding, setIsAdding] = useState(false);

	const copy = () => {
		navigator.clipboard.writeText(room?.roomCode || "").then(() => {
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		});
	};

	const startQuiz = () =>
		room?.roomCode && socket.emit("start_quiz", { roomCode: room.roomCode });

	const addQ = () => {
		if (!room?.roomCode) return;
		const text = qText.trim(),
			co = opts.map((o) => o.trim());
		if (!text || co.some((o) => !o) || correct === null) return;
		setIsAdding(true);
		socket.emit(
			"add_question",
			{
				roomCode: room.roomCode,
				question: { text, options: co, correctAnswer: co[correct] },
				playerId,
			},
			(ack) => {
				setIsAdding(false);
				if (!ack?.ok) return;
				setQText("");
				setOpts(["", "", "", ""]);
				setCorrect(null);
				setFlash(true);
				setTimeout(() => setFlash(false), 350);
			},
		);
	};

	useEffect(() => {
		initSocketListeners();
		if (!socket.connected) socket.connect();
	}, []);
	useEffect(() => {
		if (!room?.roomCode) {
			navigate("/");
			return;
		}
		const id = playerId || localStorage.getItem("quiz_player_id");
		const name =
			playerName || localStorage.getItem("quiz_player_name") || "Player";
		if (id)
			socket.emit("rejoin_room", {
				roomCode: room.roomCode,
				playerId: id,
				name,
			});
	}, [room?.roomCode, playerId, playerName, navigate]);
	useEffect(() => {
		if (["prepare", "question", "result"].includes(phase)) navigate("/game");
		if (phase === "finished") navigate("/result");
	}, [phase, navigate]);

	const isHost = room?.hostId && playerId && room.hostId === playerId;

	return (
		<>
			<style>{S}</style>
			<div className="lb-root">
				<div className="lb-sf">
					{STARS.map((s) => (
						<div
							key={s.id}
							className="lb-star"
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

				<nav className="lb-nav">
					<div className="lb-brand">
						QUIZ<span>BLITZ</span>
					</div>
					<div className="lb-nav-mid">
						<span className="lb-code-lbl">Room</span>
						<span className="lb-code-val">{room?.roomCode}</span>
						<button
							className={`lb-copy-btn ${copied ? "copied" : ""}`}
							onClick={copy}
							title="Copy code"
						>
							{copied ? <CheckIcon size={13} /> : <CopyIcon size={13} />}
						</button>
					</div>
					<div className="lb-nav-r">
						<span
							style={{
								fontFamily: "'Orbitron',monospace",
								fontSize: 10,
								fontWeight: 700,
								color: "rgba(255,255,255,0.2)",
								letterSpacing: 1,
							}}
						>
							{room?.players?.length || 0} online
						</span>
						{isHost ? (
							<span className="lb-badge lb-badge-host">Commander</span>
						) : (
							<span className="lb-badge lb-badge-player">Crew</span>
						)}
					</div>
				</nav>

				{error && <div className="lb-err">{error}</div>}

				<div className="lb-body">
					<div>
						<div className="lb-pp">
							<div className="lb-pp-head">
								<span className="lb-pp-title">Crew</span>
								<span className="lb-pp-cnt">{room?.players?.length || 0}</span>
							</div>
							<div className="lb-pp-body">
								{room?.players?.length ? (
									room.players.map((p, i) => (
										<div
											key={p.id}
											className="lb-player"
											style={{ animationDelay: `${i * 0.06}s` }}
										>
											<div
												className="lb-av"
												style={{
													background: AV[i % AV.length] + "44",
													color: AV[i % AV.length],
												}}
											>
												{(p.name || "?")[0].toUpperCase()}
											</div>
											<span className="lb-pname">{p.name}</span>
											{room.hostId === p.id && (
												<span className="lb-ptag">CMD</span>
											)}
										</div>
									))
								) : (
									<div
										style={{
											color: "rgba(255,255,255,0.15)",
											fontSize: 12,
											fontFamily: "'Orbitron',monospace",
											letterSpacing: "1px",
											textAlign: "center",
											padding: "20px 0",
										}}
									>
										Awaiting crew...
									</div>
								)}
							</div>
						</div>

						<div className="lb-share">
							<div className="lb-share-lbl">Invite Code</div>
							<div className="lb-share-code-row">
								<div className="lb-share-code">{room?.roomCode}</div>
								<button
									className={`lb-share-copy ${copied ? "done" : ""}`}
									onClick={copy}
								>
									{copied ? (
										<>
											<CheckIcon size={11} />
											Copied
										</>
									) : (
										<>
											<CopyIcon size={11} />
											Copy
										</>
									)}
								</button>
							</div>
						</div>
					</div>

					<div>
						{isHost ? (
							<div className="lb-rp">
								<div className="lb-rp-head">
									<span className="lb-rp-title">Question Builder</span>
									<span className="lb-rp-cnt">
										{room?.questions?.length || 0} questions
									</span>
								</div>
								<div className="lb-rp-body">
									<div className="lb-fl">
										<label className="lb-fl-lbl">Question</label>
										<input
											className="lb-inp"
											value={qText}
											onChange={(e) => setQText(e.target.value)}
											placeholder="What is the capital of France?"
										/>
									</div>
									<div className="lb-fl">
										<label className="lb-fl-lbl">
											Options — tap letter to mark correct
										</label>
										<div className="lb-opts">
											{opts.map((o, i) => {
												const s = OPT[i],
													sel = correct === i;
												return (
													<div key={i} className="lb-or">
														<div
															className={`lb-opill${sel ? " sel" : ""}`}
															onClick={() => setCorrect(i)}
															style={{
																background: sel ? s.color + "33" : s.light,
																borderColor: s.border,
																color: sel ? s.color : s.color + "99",
															}}
														>
															{s.label}
														</div>
														<input
															className="lb-oinp"
															value={o}
															onChange={(e) => {
																const n = [...opts];
																n[i] = e.target.value;
																setOpts(n);
															}}
															placeholder={`Option ${s.label}`}
														/>
													</div>
												);
											})}
										</div>
									</div>
									{correct === null && (
										<div className="lb-hint">
											Select the correct answer above
										</div>
									)}
										<button
											className={`lb-btn-add${flash ? " fl" : ""}`}
											onClick={addQ}
											disabled={isAdding}
										>
											{isAdding ? "Saving..." : "+ Add Question"}
										</button>
									<div className="lb-sep" />
									<div className="lb-q-hdr">
										<span className="lb-q-lbl">Question Bank</span>
										<span className="lb-q-num">
											{room?.questions?.length || 0}
										</span>
									</div>
									<div className="lb-qlist">
										{(room?.questions || []).map((q, i) => (
											<div key={q.id} className="lb-qi">
												<div className="lb-qi-n">Q{i + 1}</div>
												<div className="lb-qi-t">{q.text}</div>
												<div className="lb-qi-a">{q.correctAnswer}</div>
											</div>
										))}
										{!room?.questions?.length && (
											<div
												style={{
													textAlign: "center",
													padding: "18px 0",
													color: "rgba(255,255,255,0.12)",
													fontSize: 12,
												}}
											>
												No questions yet
											</div>
										)}
									</div>
										<button
											className="lb-btn-launch"
											onClick={startQuiz}
											disabled={isAdding || !room?.questions?.length}
										>
										Launch Mission
									</button>
								</div>
							</div>
						) : (
							<div
								className="lb-rp"
								style={{
									minHeight: 380,
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								<div className="lb-wait">
									<div className="lb-wait-ring" />
									<h3>Awaiting Launch</h3>
									<p>
										The commander is building the quiz.
										<br />
										Stand by for liftoff.
									</p>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
}
