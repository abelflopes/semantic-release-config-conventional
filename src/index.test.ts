import { execSync } from "node:child_process";

describe("Semantic Release Config", () => {
  it("should be a configuration object compatible with Semantic Release", async () => {
    expect(() => {
      execSync("npm exec -- semantic-release --dry-run", {
        stdio: "inherit",
      });
    }).not.toThrow();
  });
});
