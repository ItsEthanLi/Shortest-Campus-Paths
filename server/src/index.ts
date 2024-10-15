import express, { Express } from "express";
import bodyParser from 'body-parser';
import { readFileSync } from 'fs';
import { parseEdges } from "./campus";
import { getBuildings } from "./routes";


// Parse the information about the walkways on campus.
const content = readFileSync("data/campus_edges.csv", {encoding: 'utf-8'});
parseEdges(content.split("\n"));


// Configure and start the HTTP server.
const port: number = 8088;
const app: Express = express();
app.use(bodyParser.json());
 app.get("/api/buildings", getBuildings);
// TODO (Task 3): add a route to get the shortest path
app.listen(port, () => console.log(`Server listening on ${port}`));
