import test from "ava";
import {
  trimTrailing,
  trimLeading,
  merge,
  append,
  prepend,
  keepSingle
} from "../lib/string";

test("trim trailing char", t => {
  const trimmed = trimTrailing("///a-value///", "/");
  t.is(trimmed, "///a-value");
});

test("leave leading untouched", t => {
  const trimmed = trimTrailing("///a-value", "/");
  t.is(trimmed, "///a-value");
});

test("trim leading char", t => {
  const trimmed = trimLeading("///a-value///", "/");
  t.is(trimmed, "a-value///");
});

test("leave trailing untouched", t => {
  const trimmed = trimLeading("a-value///", "/");
  t.is(trimmed, "a-value///");
});

test("prepend values as string", t => {
  const updated = prepend(1, 2);
  t.is(updated, "21");
});

test("append values as string", t => {
  const updated = append(1, 2);
  t.is(updated, "12");
});

test("keep single", t => {
  const updated = keepSingle("...a..value ....", ".");
  t.is(updated, ".a.value .");
});

test("merge args", t => {
  const merged = merge("a", "b", 1);
  t.is(merged, "ab1");
});
