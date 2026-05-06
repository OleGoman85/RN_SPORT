import type { Server } from "http";

export const serverTests = (server: Server): void => {
  server.on("listening", () => {
    console.log("EVENT: listening");
  });

  server.on("close", () => {
    console.log("EVENT: close");
  });

  server.on("error", (err: Error) => {
    console.error("EVENT: error", err);
  });

  process.on("exit", (code: number) => {
    console.log("PROCESS EXIT:", code);
  });

  process.on("beforeExit", (code: number) => {
    console.log("PROCESS BEFORE EXIT:", code);
  });

  setInterval(() => {
    console.log("✅ server alive");
  }, 60000);
};
