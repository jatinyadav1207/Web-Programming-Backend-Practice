import "dotenv/config";
import app from "./app.js";
import { DEFAULT_PORT } from "./config/constants.js";
import connectDB from "./config/database.js";

async function startServer() {
    if (!process.env.MONGODB_URI?.startsWith("mongodb+srv://")) {
        console.error("Set MONGODB_URI to your Atlas SRV connection string in .env.");
        process.exitCode = 1;
        return;
    }

    try {
        await connectDB();
    } catch (error) {
        console.error("Atlas connection failed (%s). Check the URI, database credentials and Atlas IP access list.", error.name);
        process.exitCode = 1;
        return;
    }

    const port = Number(process.env.PORT || DEFAULT_PORT);
    app.listen(port, "127.0.0.1", () => {
        console.log(`Server running at http://127.0.0.1:${port}`);
    }).on("error", (error) => {
        console.error("Server could not listen (%s).", error.code);
        process.exit(1);
    });
}

startServer();
