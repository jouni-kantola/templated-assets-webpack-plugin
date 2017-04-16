import test from "ava";
import { log } from "../lib/logger";

test("has log", t => {
  t.is(typeof log, "function");
});
