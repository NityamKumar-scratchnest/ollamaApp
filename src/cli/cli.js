import axios from "axios";
import readlineSync from "readline-sync";
import chalk from "chalk";
import ora from "ora";
import fs from "fs";
import http from "http";

const API = "http://localhost:5055/api";

const TOKEN_FILE = "./token.json";
const SESSION_FILE = "./session.json";

// 🔥 fix ECONNRESET
const agent = new http.Agent({ keepAlive: false });

// ================= TOKEN =================

const saveToken = (token) => {
  fs.writeFileSync(TOKEN_FILE, JSON.stringify({ token }));
};

const getToken = () => {
  if (!fs.existsSync(TOKEN_FILE)) return null;
  return JSON.parse(fs.readFileSync(TOKEN_FILE)).token;
};

const clearToken = () => {
  if (fs.existsSync(TOKEN_FILE)) fs.unlinkSync(TOKEN_FILE);
};

// ================= SESSION =================

const saveSession = (conversationId) => {
  fs.writeFileSync(SESSION_FILE, JSON.stringify({ conversationId }));
};

const getSession = () => {
  if (!fs.existsSync(SESSION_FILE)) return null;
  return JSON.parse(fs.readFileSync(SESSION_FILE)).conversationId;
};

const clearSession = () => {
  if (fs.existsSync(SESSION_FILE)) fs.unlinkSync(SESSION_FILE);
};

// ================= AUTH =================

const signup = async () => {
  const email = readlineSync.question("Email: ");
  const password = readlineSync.question("Password: ", {
    hideEchoBack: true,
  });

  await axios.post(`${API}/auth/signup`, { email, password });

  console.log(chalk.green("✅ Signup successful! Please login.\n"));
};

const login = async () => {
  const email = readlineSync.question("Email: ");
  const password = readlineSync.question("Password: ", {
    hideEchoBack: true,
  });

  const spinner = ora("Logging in...").start();

  try {
    const res = await axios.post(`${API}/auth/login`, {
      email,
      password,
    });

    spinner.succeed("Logged in!");
    saveToken(res.data.token);

    return res.data.token;
  } catch (err) {
    spinner.fail("Login failed");
    console.log(chalk.red(err.response?.data?.msg || err.message));
    process.exit();
  }
};

// ================= REQUEST =================

const sendRequest = async (payload, token) => {
  try {
    return await axios.post(`${API}/chat`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 8000,
      httpAgent: agent,
    });
  } catch (err) {
    console.log(chalk.gray("⚠️ retrying..."));
    return await axios.post(`${API}/chat`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 8000,
      httpAgent: agent,
    });
  }
};

// ================= CHAT =================

const chatLoop = async (token) => {
  console.log(chalk.blue("\n💬 Start chatting"));
  console.log(chalk.gray("Commands: /new , /logout , exit\n"));

  let conversationId = getSession();

  while (true) {
    const message = readlineSync.question(chalk.yellow("You: "));

    // exit
    if (message.toLowerCase() === "exit") {
      console.log(chalk.green("👋 Goodbye!"));
      process.exit();
    }

    // new chat
    if (message === "/new") {
      clearSession();
      conversationId = null;
      console.log(chalk.cyan("🆕 New conversation started\n"));
      continue;
    }

    // logout
    if (message === "/logout") {
      clearToken();
      clearSession();
      console.log(chalk.red("Logged out!"));
      process.exit();
    }

    const spinner = ora("Thinking...").start();

    try {
      const res = await sendRequest(
        { message, conversationId },
        token
      );

      spinner.stop();

      if (res.data.conversationId) {
        conversationId = res.data.conversationId;
        saveSession(conversationId);
      }

      console.log(chalk.green("AI:"), res.data.reply, "\n");

    } catch (err) {
      spinner.fail("Error talking to server");

      console.log("ERROR:", {
        message: err.message,
        code: err.code,
        response: err.response?.data,
      });
    }
  }
};

// ================= MAIN =================

const start = async () => {
  console.log(chalk.cyan("\n=== AI Terminal ===\n"));

  let token = getToken();

  if (!token) {
    console.log("1. Login");
    console.log("2. Signup");

    const choice = readlineSync.question("> ");

    if (choice === "2") {
      await signup();
    }

    token = await login();
  } else {
    console.log(chalk.green("🔐 Using saved session"));
  }

  await chatLoop(token);
};

start();