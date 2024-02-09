import express from "express";
import cors from 'cors';
import recipesRoute from './pages/api/recipesRoute.js';
const app = express();

const router = express.Router();

// parse request body
app.use(express.json());

// handle CORS policy
app.use(cors());

// for each route with prefix  /recipes, handle with this middleware
app.use('/recipes');