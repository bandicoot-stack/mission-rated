import assert from "node:assert/strict";
import test from "node:test";
import { normalizeBusiness, normalizeInstallation } from "./normalize.ts";

test("rejects incomplete installation rows", () => {
  assert.equal(normalizeInstallation({ id: "x" }), null);
});

test("does not invent scores, reviews, or verification", () => {
  const business = normalizeBusiness({ id: "1", name: "Harbor Co." });
  assert.equal(business?.missionScore, null);
  assert.equal(business?.reviewCount, 0);
  assert.equal(business?.verified, false);
});
