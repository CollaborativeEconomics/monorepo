const fs = require("fs");
const path = require("path");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter the name of the chain (e.g., Xrpl): ", async (chainName) => {
  const templateFolder = "src/chains/Template";
  const newFolder = `src/chains/${chainName}`;
  const filesToProcess = ["common.txt", "server.txt", "client.txt"];

  fs.cpSync(templateFolder, newFolder, { recursive: true });

  for (const file of filesToProcess) {
    const filePath = path.join(newFolder, file);
    let content = fs.readFileSync(filePath, "utf8");

    // Rename "Blockchain" to the given chain name
    content = content.replace(/Blockchain/g, chainName);

    const placeholders = content.match(/{\w+}/g) || [];
    for (const placeholder of placeholders) {
      const isFunction = placeholder.endsWith("FUNCTION}");
      const question = isFunction
        ? `Enter implementation for ${placeholder.slice(
            1,
            -9,
          )} (press enter to skip): `
        : `Replace ${placeholder}: `;

      const replacement = await new Promise((resolve) => {
        rl.question(question, (input) => {
          resolve(
            input ||
              (isFunction
                ? `throw new Error("${placeholder.slice(
                    1,
                    -9,
                  )} method not yet implemented.");`
                : placeholder),
          );
        });
      });

      content = content.replace(placeholder, replacement ?? "");
    }

    // Change the file extension to .ts
    const newFilePath = filePath.replace(/\.txt$/, ".ts");
    fs.writeFileSync(newFilePath, content, "utf8");
    fs.unlinkSync(filePath); // Remove the old .txt file

    // Extract and log TODO comments
    const todos = content.match(/\/\/ TODO: .*/g) || [];
    todos.forEach((todo) => console.log(todo));
  }

  rl.close();
});
